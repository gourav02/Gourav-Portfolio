"use client"

import { useEffect, useRef } from "react"
import { gsapClient } from "@/lib/gsap"

// Simple animated gradient blobs canvas background
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio)
    let h = (canvas.height = canvas.offsetHeight * devicePixelRatio)

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio
      h = canvas.height = canvas.offsetHeight * devicePixelRatio
    }
    const onResize = () => {
      resize()
    }
    window.addEventListener("resize", onResize)

    type Blob = { x: number; y: number; r: number; hue: number; vx: number; vy: number }
    const blobs: Blob[] = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 120 + 80) * devicePixelRatio,
      hue: [200, 160, 190, 170, 210, 180][i % 6],
      vx: (Math.random() - 0.5) * 0.4 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.4 * devicePixelRatio,
    }))

    const gsap = gsapClient()
    let scrollY = window.scrollY
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener("scroll", onScroll, { passive: true })

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // subtle parallax offset based on scroll
      const py = gsap.utils.clamp(-80, 80, (scrollY % 400) - 200)
      blobs.forEach((b, i) => {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -b.r) b.x = w + b.r
        if (b.x > w + b.r) b.x = -b.r
        if (b.y < -b.r) b.y = h + b.r
        if (b.y > h + b.r) b.y = -b.r
        const grad = ctx.createRadialGradient(b.x, b.y + py * (i * 0.02), 0, b.x, b.y + py * (i * 0.02), b.r)
        grad.addColorStop(0, `hsla(${b.hue} 90% 55% / 0.12)`)
        grad.addColorStop(1, `hsla(${b.hue} 90% 55% / 0.0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 h-full w-full" />
}

"use client"

import { useEffect, useRef } from "react"
import { gsapClient } from "@/lib/gsap"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const gsap = gsapClient()
    const el = barRef.current
    if (!el) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      gsap.to(el, { scaleX: p, duration: 0.12, ease: "power1.out" })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-blue-600 via-emerald-500 to-cyan-500"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}

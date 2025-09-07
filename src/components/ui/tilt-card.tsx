"use client"

import * as React from "react"
import { gsapClient } from "@/lib/gsap"

interface TiltProps {
  children: React.ReactNode
  className?: string
  max?: number // max tilt deg
  scale?: number // hover scale
}

export function Tilt({ children, className, max = 8, scale = 1.02 }: TiltProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const spotRef = React.useRef<HTMLDivElement | null>(null)
  const glowRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const gsap = gsapClient()
    const el = ref.current
    if (!el) return

    const bounds = () => el.getBoundingClientRect()

    const onMove = (e: PointerEvent) => {
      const b = bounds()
      const px = (e.clientX - b.left) / b.width - 0.5
      const py = (e.clientY - b.top) / b.height - 0.5
      gsap.to(el, {
        rotateX: gsap.utils.clamp(-max, max, -py * max * 2),
        rotateY: gsap.utils.clamp(-max, max, px * max * 2),
        scale,
        transformPerspective: 800,
        transformOrigin: "center",
        duration: 0.2,
        ease: "power2.out",
      })
      // move spotlight
      if (spotRef.current) {
        const setX = gsap.quickSetter(spotRef.current, "x", "px")
        const setY = gsap.quickSetter(spotRef.current, "y", "px")
        setX(e.clientX - b.left)
        setY(e.clientY - b.top)
      }
    }

    const onEnter = () => {
      gsap.to(glowRef.current, { opacity: 0.35, duration: 0.2, ease: "power2.out" })
      gsap.to(spotRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" })
    }
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.3, ease: "power3.out" })
      gsap.to(glowRef.current, { opacity: 0, duration: 0.25, ease: "power3.out" })
      gsap.to(spotRef.current, { opacity: 0, duration: 0.25, ease: "power3.out" })
    }

    el.addEventListener("pointerenter", onEnter)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointerenter", onEnter)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [max, scale])

  return (
    <div ref={ref} className={(className ? className + " " : "") + "relative"} style={{ willChange: "transform" }}>
      {/* glow overlay */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 -z-[1] rounded-[inherit] opacity-0">
        <div className="absolute inset-[-1px] rounded-[inherit] bg-[linear-gradient(120deg,_rgba(59,130,246,0.35),_rgba(16,185,129,0.35),_rgba(34,211,238,0.35))] blur-md" />
      </div>
      {/* spotlight following cursor */}
      <div ref={spotRef} className="pointer-events-none absolute -z-[1] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.35),_transparent_60%)] blur-2xl opacity-0" />
      {children}
    </div>
  )
}

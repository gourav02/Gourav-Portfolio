"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { gsapClient } from "@/lib/gsap"

export function RouteTransition() {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const gsap = gsapClient()
    const overlay = overlayRef.current
    if (!overlay) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    // play a quick in-out overlay animation on path change
    const tl = gsap.timeline()
    tl.clear()
      .set(overlay, { yPercent: -100, opacity: 1 })
      .to(overlay, { yPercent: 0, duration: 0.35, ease: "power3.out" })
      .to(overlay, { yPercent: 100, duration: 0.45, ease: "power3.in" }, ">+=0.05")
      .set(overlay, { opacity: 0 })

    // cleanup timeline on unmount
    return () => { tl.kill() }
  }, [pathname])

  return (
    <div
      aria-hidden
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[70] opacity-0"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-emerald-500 to-cyan-500" />
    </div>
  )
}

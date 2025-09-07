"use client"

import { useEffect, useRef } from "react"
import { gsapClient } from "@/lib/gsap"

export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const gsap = gsapClient()
    const dot = dotRef.current
    if (!dot) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isTouch = matchMedia("(hover: none)").matches
    if (prefersReduced || isTouch) return

    // position with quickSetter for performance
    const setX = gsap.quickSetter(dot, "x", "px")
    const setY = gsap.quickSetter(dot, "y", "px")

    const move = (e: PointerEvent) => {
      setX(e.clientX)
      setY(e.clientY)
    }
    const down = () => gsap.to(dot, { scale: 0.8, duration: 0.15, ease: "power2.out" })
    const up = () => gsap.to(dot, { scale: 1, duration: 0.2, ease: "power3.out" })

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerdown", down)
    window.addEventListener("pointerup", up)

    // Magnetic elements
    const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]") )
    const handlers: Array<{ el: HTMLElement; enter: (e: Event) => void; leave: (e: Event) => void; move: (e: PointerEvent) => void; }> = []
    const makeEnter = (el: HTMLElement) => () => {
      gsap.to(el, { scale: 1.03, duration: 0.2, ease: "power2.out" })
    }
    const makeLeave = (el: HTMLElement) => () => {
      gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.3, ease: "power3.out" })
    }
    const makeMove = (el: HTMLElement) => (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      const relX = (e.clientX - (b.left + b.width / 2)) / (b.width / 2)
      const relY = (e.clientY - (b.top + b.height / 2)) / (b.height / 2)
      gsap.to(el, { x: relX * 8, y: relY * 8, duration: 0.15, ease: "power2.out" })
    }
    magnets.forEach((m) => {
      const enterH = makeEnter(m)
      const leaveH = makeLeave(m)
      const moveH = makeMove(m)
      handlers.push({ el: m, enter: enterH, leave: leaveH, move: moveH })
      m.addEventListener("pointerenter", enterH)
      m.addEventListener("pointerleave", leaveH)
      m.addEventListener("pointermove", moveH)
    })

    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerdown", down)
      window.removeEventListener("pointerup", up)
      handlers.forEach(({ el, enter, leave, move }) => {
        el.removeEventListener("pointerenter", enter)
        el.removeEventListener("pointerleave", leave)
        el.removeEventListener("pointermove", move)
      })
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/30 bg-foreground/10 backdrop-blur-sm md:block"
      style={{ transform: "translate(-9999px, -9999px)" }}
    />
  )
}

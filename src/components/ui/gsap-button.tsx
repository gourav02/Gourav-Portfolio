"use client"

import * as React from "react"
import { Button as RawButton } from "@/components/ui/button"
import { gsapClient } from "@/lib/gsap"

type RawButtonProps = React.ComponentProps<typeof RawButton>

export const GButton = React.forwardRef<HTMLButtonElement, RawButtonProps>(
  ({ className, children, ...props }, ref) => {
    const innerRef = React.useRef<HTMLButtonElement | null>(null)
    React.useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement)

    React.useEffect(() => {
      const gsap = gsapClient()
      const el = innerRef.current
      if (!el) return

      const enter = () => {
        gsap.to(el, { scale: 1.04, y: -2, duration: 0.2, ease: "power2.out" })
      }
      const leave = () => {
        gsap.to(el, { scale: 1, y: 0, duration: 0.25, ease: "power3.out" })
      }
      el.addEventListener("pointerenter", enter)
      el.addEventListener("pointerleave", leave)
      return () => {
        el.removeEventListener("pointerenter", enter)
        el.removeEventListener("pointerleave", leave)
      }
    }, [])

    return (
      <RawButton ref={innerRef} className={className} {...props}>
        {children}
      </RawButton>
    )
  }
)
GButton.displayName = "GButton"

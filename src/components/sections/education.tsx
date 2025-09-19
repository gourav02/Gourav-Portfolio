"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tilt } from "@/components/ui/tilt-card"
import { education } from "@/data/resume"
import { gsapClient, ScrollTrigger } from "@/lib/gsap"

export function Education() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const gsap = gsapClient()
    if (!root.current) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (prefersReduced) return
      // Split title words
      const title = root.current!.querySelector(".section-title") as HTMLElement | null
      if (title && !title.querySelector(".word")) {
        const text = title.textContent?.trim() || ""
        title.textContent = ""
        const words = text.split(/\s+/)
        words.forEach((w, i) => {
          const outer = document.createElement("span")
          outer.className = "word inline-block overflow-hidden align-top"
          const inner = document.createElement("span")
          inner.className = "inline-block will-change-transform"
          inner.innerHTML = w + (i < words.length - 1 ? "&nbsp;" : "")
          outer.appendChild(inner)
          title.appendChild(outer)
        })
        gsap.from(title.querySelectorAll(".word > span"), {
          yPercent: 120,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: title, start: "top 85%" } as ScrollTrigger.Vars,
        })
      }
      gsap.from(".edu-card", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
        } as ScrollTrigger.Vars,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="education" className="theme-education container mx-auto w-full scroll-mt-24 px-4 sm:px-0">
      <h2 className="text-6xl font-bold tracking-tight flex justify-center">Education</h2>
      <div className="mt-6 grid gap-6">
        {education.map((e) => (
          <Tilt key={e.school} className="edu-card">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  {e.degree} — {e.school}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {e.period} • {e.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">CGPA: {e.cgpa}</div>
              </CardContent>
            </Card>
          </Tilt>
        ))}
      </div>
    </section>
  )
}

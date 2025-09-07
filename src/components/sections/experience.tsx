"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tilt } from "@/components/ui/tilt-card"
import { experience } from "@/data/resume"
import { gsapClient, ScrollTrigger } from "@/lib/gsap"

export function Experience() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const gsap = gsapClient()
    if (!root.current) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (prefersReduced) return
      // Split title
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
      gsap.from(".exp-card", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        } as ScrollTrigger.Vars,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="experience" className="theme-experience container mx-auto w-full scroll-mt-24 px-4 sm:px-0 flex flex-col gap-4">
      <h2 className="text-6xl font-bold tracking-tight flex items-center justify-center">Experience</h2>
      <div className="mt-6 grid gap-6">
        {experience.map((exp) => (
          <Tilt key={exp.company} className="exp-card rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base sm:text-lg">
                  <span className="text-3xl font-bold">{exp.role}</span>
                  <span className="">{exp.company}</span>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {exp.period} • {exp.location}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mt-2 grid list-disc gap-2 pl-5 text-lg">
                  {exp.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Tilt>
        ))}
      </div>
    </section>
  )
}

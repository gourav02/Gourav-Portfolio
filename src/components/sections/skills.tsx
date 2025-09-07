"use client"

import { useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { skills } from "@/data/resume"
import { gsapClient, ScrollTrigger } from "@/lib/gsap"

export function Skills() {
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
      gsap.from(".skills-group", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
        } as ScrollTrigger.Vars,
      })
      gsap.from(".skills-badge", {
        opacity: 0,
        y: 6,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        } as ScrollTrigger.Vars,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="skills" className="theme-skills container mx-auto w-full scroll-mt-24 px-4 sm:px-0">
      <h2 className="section-title text-2xl font-semibold tracking-tight">Skills</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="skills-group">
            <h3 className="text-sm font-medium capitalize text-muted-foreground">
              {group}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {items.map((item) => (
                <Badge key={item} className="skills-badge" variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

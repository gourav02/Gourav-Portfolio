"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { projects } from "@/data/resume"
import { gsapClient, ScrollTrigger } from "@/lib/gsap"
import { Tilt } from "@/components/ui/tilt-card"
import { Github, ExternalLink } from "lucide-react"
import Image from "next/image"

export function Projects() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const gsap = gsapClient()
    if (!root.current) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (prefersReduced) return
      // Split section title into words and animate
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
      gsap.from(".proj-card", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
        } as ScrollTrigger.Vars,
      })

      // Media masked reveal per card
      gsap.utils.toArray<HTMLElement>(".proj-media").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          } as ScrollTrigger.Vars,
        })
        // Parallax move of the inner image/gradient
        const inner = el.querySelector(".proj-media-img")
        if (inner) {
          gsap.to(inner, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            } as ScrollTrigger.Vars,
          })
        }
      })

      gsap.from(".proj-badge", {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
        } as ScrollTrigger.Vars,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="projects" className="theme-projects container mx-auto w-full scroll-mt-24 px-4 flex flex-col gap-4">
      <h2 className="text-6xl font-bold tracking-tight flex justify-center">Projects</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <Tilt key={p.name} className="proj-card rounded-lg">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base sm:text-lg" data-magnetic>{p.name}</CardTitle>
                  <div className="flex items-center gap-1.5">
                    {p.links && (p.links as { github?: string }).github && (
                      <Button asChild size="icon" variant="ghost">
                        <a href={(p.links as { github?: string }).github!} target="_blank" rel="noreferrer" aria-label="GitHub" data-magnetic>
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {p.links && (p.links as { demo?: string }).demo && (
                      <Button asChild size="icon" variant="ghost">
                        <a href={(p.links as { demo?: string }).demo!} target="_blank" rel="noreferrer" aria-label="Live Demo" data-magnetic>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="proj-media relative mb-4 h-40 overflow-hidden rounded-md">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={`${p.name} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="proj-media-img object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="proj-media-img absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_0%,_rgba(59,130,246,0.25),_transparent_60%),_radial-gradient(120%_120%_at_100%_0%,_rgba(16,185,129,0.25),_transparent_60%)]" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <Badge className="proj-badge" variant="secondary" key={s} data-magnetic>
                      {s}
                    </Badge>
                  ))}
                </div>
                <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm text-muted-foreground">
                  {p.highlights.map((h: string, i: number) => (
                    <li key={i}>{h}</li>
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

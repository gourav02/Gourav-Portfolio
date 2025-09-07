"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useRef } from "react"
import { gsapClient, ScrollTrigger } from "@/lib/gsap"

export function SiteHeader() {
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const gsap = gsapClient()
    const nav = navRef.current
    if (!nav) return

    // Scroll spy: highlight active link
    const anchors = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    const sections = anchors
      .map((a) => document.getElementById(a.getAttribute("href")!.slice(1)))
      .filter(Boolean) as HTMLElement[]
    const spyTriggers: ScrollTrigger[] = []
    sections.forEach((section, idx) => {
      const anchor = anchors[idx]
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            anchors.forEach((a) => a.setAttribute("data-active", "false"))
            anchor.setAttribute("data-active", "true")
          }
        },
      })
      spyTriggers.push(st)
    })

    const click = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest("a[href^='#']") as HTMLAnchorElement | null
      if (!link) return
      const id = link.getAttribute("href")?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (prefersReduced) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
      gsap.to(window, {
        duration: 1,
        ease: "power3.out",
        scrollTo: { y: el, offsetY: 72 },
      })
    }
    nav.addEventListener("click", click)
    return () => {
      nav.removeEventListener("click", click)
      spyTriggers.forEach((st) => st.kill())
    }
  }, [])

  const nav = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="#" className="font-mono text-sm font-semibold" data-magnetic>
          gourav.dev
        </Link>
        <nav ref={navRef} className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
              data-magnetic
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

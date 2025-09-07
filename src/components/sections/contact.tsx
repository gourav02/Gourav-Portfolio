"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { gsapClient, ScrollTrigger } from "@/lib/gsap"

const ContactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
})

type ContactValues = z.infer<typeof ContactSchema>

export function Contact() {
  const [loading, setLoading] = useState(false)
  const root = useRef<HTMLElement>(null)
  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

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
      gsap.from([".contact-title", ".contact-desc"], {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
        } as ScrollTrigger.Vars,
      })
      gsap.from(".contact-field", {
        opacity: 0,
        y: 10,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        } as ScrollTrigger.Vars,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  async function onSubmit(values: ContactValues) {
    try {
      setLoading(true)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Failed to send message")
      toast.success("Message sent! I'll get back to you soon.")
      form.reset()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section ref={root} id="contact" className="theme-contact container mx-auto max-w-4xl scroll-mt-24 px-4 sm:px-0">
      <h2 className="section-title contact-title text-2xl font-semibold tracking-tight">Contact</h2>
      <p className="contact-desc mt-2 text-sm text-muted-foreground">Have an opportunity or question? Send a message.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="contact-field">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="contact-field">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="contact-field">
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="How can I help?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="contact-field" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send message"}
          </Button>
        </form>
      </Form>
    </section>
  )
}

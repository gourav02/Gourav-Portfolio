"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { gsapClient, ScrollTrigger } from "@/lib/gsap";
import AnimatedButton from "../ui/magneticButton";

const ContactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
});

type ContactValues = z.infer<typeof ContactSchema>;

export function Contact() {
  const [loading, setLoading] = useState(false);
  const root = useRef<HTMLElement>(null);
  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  useEffect(() => {
    const gsap = gsapClient();
    if (!root.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const ctx = gsap.context(() => {
      if (prefersReduced) return;
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
      });
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
      });
    }, root);
    return () => ctx.revert();
  }, []);

  async function onSubmit(values: ContactValues) {
    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to send message");
      toast.success("Message sent! I'll get back to you soon.");
      form.reset();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      ref={root}
      id="contact"
      className="theme-contact container mx-auto max-w-3xl scroll-mt-24 px-4 sm:px-0 pb-10"
    >
      <h2 className="contact-title text-4xl font-bold tracking-tight text-white text-center">
        Get in Touch
      </h2>
      <p className="contact-desc mt-3 text-center text-base text-gray-300">
        Have an opportunity, collaboration idea, or just a question? Send me a
        message and I’ll get back to you soon.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 grid gap-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="contact-field">
                <FormLabel className="text-white">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="bg-neutral-900/70 border border-neutral-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="contact-field">
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="bg-neutral-900/70 border border-neutral-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="contact-field">
                <FormLabel className="text-white">Message</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="How can I help?"
                    className="bg-neutral-900/70 border border-neutral-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <AnimatedButton type="submit" disabled={loading}>
              {"Send Message"}
            </AnimatedButton>
          </div>
        </form>
      </Form>
    </section>
  );
}

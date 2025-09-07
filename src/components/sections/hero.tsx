"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import AnimatedButton from "../ui/magneticButton";

gsap.registerPlugin(SplitText);

export function splitWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span
      key={i}
      className="inline-block animate-word mr-2 bg-gradient-to-r from-blue-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent"
    >
      {word}
    </span>
  ));
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    // Hand wave animation
    gsap.to(".wave-hand", {
      rotate: 20,
      duration: 0.3,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1,
      ease: "power1.inOut",
    });

    //animate title
    gsap.set(".hero-title", { opacity: 1 });
    const split = SplitText.create("#my-title", { type: "chars" });
    //now animate each character into place from 20px below, fading in:
    gsap.from(split.chars, {
      y: 20,
      autoAlpha: 0,
      stagger: 0.05,
    });

    const words = heroRef.current.querySelectorAll(".animate-word");
    const letters = heroRef.current.querySelectorAll(".animate-letter");
    const tl = gsap.timeline();

    // Animate name (per-letter)
    tl.fromTo(
      letters,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power4.out",
        duration: 1,
        stagger: 0.05,
      }
    );

    // Animate tagline (per-word, after name)
    tl.fromTo(
      words,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power4.out",
        duration: 0.8,
        stagger: 0.1,
      },
      "-=0.3" // overlap with end of name animation
    );
  }, []);

  return (
    <section className="relative container mx-auto w-full px-6 sm:px-0 pt-10 sm:pt-24">
      <div ref={heroRef} className="space-y-6 flex flex-col gap-4">
        {/* Name */}
        <h1
          className="hero-title text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl opacity-0 space-y-4"
          id="my-title"
        >
          Hey There
          <span className="inline-block wave-hand">👋</span>
          <br />
          <span className="name-title">I`m, Gourav Mukherjee</span>
        </h1>

        {/* Tagline */}
        <h2 className="text-lg md:text-2xl font-medium text-gray-600">
          {splitWords(
            "Software Engineer · ReactJS Specialist · Frontend Developer"
          )}
        </h2>

        <div className="hero-cta flex flex-wrap gap-3">
        <AnimatedButton href="#projects">View Projects</AnimatedButton>

        <AnimatedButton href="#contact">Contact Me</AnimatedButton>
      </div>
      </div>
    </section>
  );
}

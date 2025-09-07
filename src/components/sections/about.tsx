"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { summaryData } from "@/data/resume";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const lines = textRef.current.querySelectorAll("span");

    lines.forEach((line) => {
      gsap.to(line, {
        backgroundPositionX: 0,
        ease: "none",
        scrollTrigger: {
          trigger: line,
          scrub: 0.5,
          start: "top center",
          end: "bottom center",
        },
      });
    });
  }, []);

  return (
    <section
      id="about"
      className="mx-auto container w-full scroll-mt-24 flex flex-col gap-5 items-center"
    >
      <h2 className="section-title about-title text-6xl font-bold text-white">
        WHO AM I?
      </h2>
      <p
        ref={textRef}
        className="about-summary sm:text-4xl text-2xl sm:leading-[52px] font-bold space-y-4"
      >
        {summaryData.map((line, i) => (
          <span key={i} className="block gradient-text">
            {line}
          </span>
        ))}
      </p>
    </section>
  );
}

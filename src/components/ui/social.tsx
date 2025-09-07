"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Twitter, Github, Mail, Phone, Instagram } from "lucide-react";
import { Linkedin } from 'lucide-react';

export default function Social() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const icons = containerRef.current.querySelectorAll(".social-icon");

    gsap.to(".box", {
      rotation: 360,
      opacity: 1,
      duration: 2,
      delay: 1,
      // repeat: -1,
      stagger: 0.3, // stagger in from the left with a 0.1 second gap in between animations
      ease: "sine.out"
    });
    

    icons.forEach((icon) => {
      // Scale up & fade in on mount
      gsap.fromTo(
        icon,
        { y: 30, opacity: 0 },
        {
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        }
      );

      // Hover animation
      icon.addEventListener("mouseenter", () => {
        gsap.to(icon, 
          { scale: 1.2, rotate: 0, duration: 0.3, ease: "power2.out" });
      });

      icon.addEventListener("mouseleave", () => {
        gsap.to(icon, { scale: 1, rotate: 360, duration: 0.3, ease: "power2.inOut" });
      });
    });
  }, []);

  return (
    <section className="relative container mx-auto w-full px-10 mt-30">
    <div
      ref={containerRef}
      className="flex gap-6 justify-between items-center"
    >
     <Twitter size={50} className={"social-icon box opacity: 0" }/>
     <Github size={50} className="social-icon box opacity: 0" />
     <Linkedin size={50} className="social-icon box opacity: 0" />
     <Mail size={50} className="social-icon box opacity: 0" />
     <Phone size={50} className="social-icon box opacity: 0" />
     <Instagram size={50} className="social-icon box opacity: 0" />
    </div>
    </section>
    );
}

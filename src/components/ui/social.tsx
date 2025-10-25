"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Twitter, Github, Mail, Phone, Instagram } from "lucide-react";
import { Linkedin } from "lucide-react";

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
      ease: "sine.out",
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
        gsap.to(icon, {
          scale: 1.2,
          rotate: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      icon.addEventListener("mouseleave", () => {
        gsap.to(icon, {
          scale: 1,
          rotate: 360,
          duration: 0.3,
          ease: "power2.inOut",
        });
      });
    });
  }, []);

  return (
    <section className="relative container mx-auto w-full px-10 mt-30">
      <div
        ref={containerRef}
        className="flex gap-6 justify-between items-center"
      >
        <a
          href="https://twitter.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon box hover:text-primary-400 transition-colors"
          aria-label="Twitter Profile"
        >
          <Twitter size={50} />
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/gourav02"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon box hover:text-primary-400 transition-colors"
          aria-label="GitHub Profile"
        >
          <Github size={50} />
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/gourav-mukherjeee-8654891b0/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon box hover:text-primary-400 transition-colors"
          aria-label="LinkedIn Profile"
        >
          <Linkedin size={50} />
        </a>

        {/* Email */}
        <a
          href="mailto:gouravsuvo@gmail.com"
          className="social-icon box hover:text-primary-400 transition-colors"
          aria-label="Send Email"
        >
          <Mail size={50} />
        </a>

        {/* Phone */}
        <a
          href="tel:+916295534646"
          className="social-icon box hover:text-primary-400 transition-colors"
          aria-label="Call Phone Number"
        >
          <Phone size={50} />
        </a>

        {/* Instagram */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon box hover:text-primary-400 transition-colors"
          aria-label="Instagram Profile"
        >
          <Instagram size={50} />
        </a>
      </div>
    </section>
  );
}

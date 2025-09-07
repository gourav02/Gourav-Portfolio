'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Summary: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textContainerRef.current) return;

    const container = containerRef.current;
    const textContainer = textContainerRef.current;

    // Calculate the scroll distance needed
    const textWidth = textContainer.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = textWidth - viewportWidth;

    // Create horizontal scroll animation
    const horizontalScroll = gsap.to(textContainer, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        markers: false,
        pin: true,
        scrub: 1,
        // start: "top top",
        end: () => "+=" + (document.querySelector(".process") as HTMLElement).offsetWidth,
        // invalidateOnRefresh: true,
      }
    });

    // Animate icons as they come into view
    const icons = textContainer.querySelectorAll('.tech-icon');
    icons.forEach((icon) => {
      gsap.fromTo(icon,
        { 
          scale: 0,
          rotation: -180,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: icon,
            containerAnimation: horizontalScroll,
            start: "left 80%",
            end: "left 20%",
            toggleActions: "play reverse play reverse",
          }
        }
      );
    });

    // Animate text words as they scroll
    const words = textContainer.querySelectorAll('.word');
    words.forEach((word) => {
      gsap.fromTo(word,
        { 
          opacity: 0.3,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: word,
            containerAnimation: horizontalScroll,
            start: "left 70%",
            end: "left 30%",
            toggleActions: "play reverse play reverse",
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="w-full h-screen section-theme from-slate-900 via-gray-900 to-black text-white overflow-hidden flex items-center process"
    >
      {/* Horizontal scrolling text container */}
      {/* <div className='w-full flex item-start'>
        HERE
      </div> */}
      <div 
        ref={textContainerRef}
        className="flex items-center whitespace-nowrap text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight px-8"
        style={{ width: 'max-content' }}
      >
        <span className="word mr-6">I</span>
        <span className="word mr-6">build</span>
        
        <span className="word mr-6 text-yellow-400">performant,</span>
        <div className="tech-icon w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-4 text-yellow-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        
        <span className="word mr-6 text-green-400">accessible</span>
        <div className="tech-icon w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-4 text-green-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <circle cx="12" cy="4" r="2"/>
            <path d="m9 20 3-6 3 6"/>
            <path d="m6 8 6 2 6-2"/>
            <path d="M12 10v4"/>
          </svg>
        </div>
        
        <span className="word mr-6">web</span>
        <span className="word mr-6">apps</span>
        <span className="word mr-6">with</span>
        <span className="word mr-6">modern</span>
        <span className="word mr-6">tooling</span>
        <span className="word mr-6">—</span>
        
        <span className="word mr-6 text-cyan-400">React,</span>
        <div className="tech-icon w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-4 text-cyan-400">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <path d="M12 1C18 1 21 4 21 8c0 2-1 4-3 5 2 1 3 3 3 5 0 4-3 7-9 7s-9-3-9-7c0-2 1-4 3-5-2-1-3-3-3-5 0-4 3-7 9-7z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(60 12 12)"/>
            <ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(120 12 12)"/>
          </svg>
        </div>
        
        <span className="word mr-6 text-white">Next.js,</span>
        <div className="tech-icon w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-4 text-white">
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
            <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 2.015 2.895 4.392a10760.433 10760.433 0 004.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C20.765 4.013 17.535.741 13.572.058a19.867 19.867 0 00-1.049-.06C12.287.001 11.95.001 11.572 0z"/>
          </svg>
        </div>
        
        <span className="word mr-6 text-blue-400">TypeScript,</span>
        <div className="tech-icon w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-4 text-blue-400">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <rect x="1" y="1" width="22" height="22" rx="6" fill="currentColor"/>
            <path d="M7.5 7.5h9v1.5h-3.75v8h-1.5v-8H7.5V7.5z" fill="black"/>
            <path d="M13.5 10h1.875c.345 0 .625.28.625.625s-.28.625-.625.625H13.5v1.25h1.875c.345 0 .625.28.625.625s-.28.625-.625.625H13.5v1.25h2.25c.414 0 .75.336.75.75s-.336.75-.75.75H12.75c-.414 0-.75-.336-.75-.75v-4.5c0-.414.336-.75.75-.75z" fill="black"/>
          </svg>
        </div>
        
        <span className="word mr-6 text-teal-400">Tailwind,</span>
        <div className="tech-icon w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-4 text-teal-400">
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
            <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
          </svg>
        </div>
        
        <span className="word mr-6">and</span>
        
        <span className="word mr-6 text-purple-400">delightful</span>
        <span className="word mr-6 text-purple-400">motion.</span>
        <div className="tech-icon w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-4 text-purple-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="8" y1="22" x2="16" y2="22"/>
          </svg>
        </div>
      </div>
      {/* Scroll indicator */}
      {/* <div className="absolute bottom-8 left-8 text-gray-400 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-5 border border-gray-400 rounded-sm relative">
            <div className="w-1 h-1 bg-gray-400 rounded-full absolute top-1 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
          </div>
          <span className="text-sm">Scroll to read horizontally</span>
        </div>
      </div> */}
    </section>
  );
};

export default Summary;
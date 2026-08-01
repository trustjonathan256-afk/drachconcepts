"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ParallaxLayer } from "./ParallaxUtils";

const brands = [
  { name: "Sony Music", style: "font-serif italic tracking-widest" },
  { name: "UNIVERSAL", style: "font-sans font-black tracking-tighter" },
  { name: "VOGUE", style: "font-serif font-light tracking-[0.2em]" },
  { name: "NETFLIX", style: "font-sans font-bold tracking-tight" },
  { name: "RedBull", style: "font-sans font-black italic tracking-tighter" },
  { name: "Spotify", style: "font-sans font-bold tracking-tight" },
  { name: "LVMH", style: "font-serif font-medium tracking-[0.3em]" },
];

const duplicatedBrands = [...brands, ...brands, ...brands];

export default function TrustedBySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background subtle horizontal shift
  const bgX = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 md:py-24 relative overflow-hidden border-t border-gray-100"
    >
      {/* Parallax decorative bg stripe */}
      <motion.div
        style={{ x: bgX }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #000 0rem, #000 0.0625rem, transparent 0.0625rem, transparent 3.75rem)",
          }}
        />
      </motion.div>

      {/* Section Header drifts up slightly on scroll */}
      <ParallaxLayer
        speed={0.18}
        className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16 mb-12 md:mb-16"
      >
        <div className="flex items-center justify-center md:justify-start gap-4">
          <div className="h-[0.0625rem] w-12 bg-gray-300" />
          <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-gray-400 uppercase">
            Trusted by industry leaders
          </p>
          <div className="h-[0.0625rem] w-12 bg-gray-300 md:hidden" />
        </div>
      </ParallaxLayer>

      {/* Marquee drifts at slower rate for depth */}
      <ParallaxLayer speed={0.08}>
        <div className="relative flex max-w-[100rem] mx-auto overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <motion.div
            className="flex items-center gap-16 md:gap-32 whitespace-nowrap px-8"
            animate={{ x: ["0%", "-33.333333%"] }}
            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={index}
                className={`text-2xl md:text-3xl lg:text-4xl text-gray-300 hover:text-dark transition-colors duration-500 cursor-pointer ${brand.style}`}
              >
                {brand.name}
              </div>
            ))}
          </motion.div>
        </div>
      </ParallaxLayer>
    </section>
  );
}

"use client";

import {
  motion,
  Variants,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  MapPin,
  ChevronDown,
  Menu,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import NetBackground from "./NetBackground";

// Reusable animated container for the layout
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const trustRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // ── Hero parallax ────────────────────────────────────────────────────────
  const yHeroImage = useTransform(scrollY, [0, 800], [0, 240]);
  const yHeroText = useTransform(scrollY, [0, 800], [0, -120]);
  const xMarqueeText = useTransform(scrollY, [0, 1000], [50, -450]);

  // ── Trust section parallax (relative to that block) ─────────────────────
  const { scrollYProgress: trustProgress } = useScroll({
    target: trustRef,
    offset: ["start end", "end start"],
  });
  const yTrustHeading = useTransform(trustProgress, [0, 1], ["2rem", "-2rem"]);
  const yTrustBody = useTransform(
    trustProgress,
    [0, 1],
    ["1.25rem", "-1.25rem"],
  );
  const yTrustBg = useTransform(trustProgress, [0, 1], ["-2rem", "2rem"]);
  const yTrustBlob = useTransform(trustProgress, [0, 1], ["-4rem", "4rem"]);

  // Trigger navbar state change when scrolled past 40px
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <div className="font-sans text-black selection:bg-black selection:text-white relative">
      {/* --- ANIMATED SCROLLING STICKY / FIXED NAVIGATION BAR --- */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-black/15 shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-3"
            : "bg-white/70 backdrop-blur-sm border-b border-black/5 py-5"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 max-w-[100rem] mx-auto">
          {/* Logo with smooth dynamic scaling */}
          <a
            href="#"
            className="flex items-center cursor-pointer group select-none"
          >
            <motion.div
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[2.78rem] md:h-[3.71rem] lg:h-[4.33rem] w-auto group-hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/images/drash_logo.png"
                alt="Drach Concepts Logo"
                width={216}
                height={67}
                className="h-full w-auto object-contain"
                priority
              />
            </motion.div>
          </a>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-10 text-[0.9375rem] font-medium text-black/80">
            <a
              href="#"
              className="relative cursor-pointer hover:text-black transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[0.09375rem] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </a>
            <a
              href="#"
              className="relative cursor-pointer flex items-center gap-1 hover:text-black transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[0.09375rem] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              Services <ChevronDown className="w-4 h-4 text-black/40" />
            </a>
            <a
              href="#"
              className="relative cursor-pointer flex items-center gap-1 hover:text-black transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[0.09375rem] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              Portfolio <ChevronDown className="w-4 h-4 text-black/40" />
            </a>
            <a
              href="#"
              className="relative cursor-pointer flex items-center gap-1 hover:text-black transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[0.09375rem] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              Pages <ChevronDown className="w-4 h-4 text-black/40" />
            </a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <motion.button
              animate={{ scale: isScrolled ? 0.95 : 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: isScrolled ? 0.97 : 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer bg-black text-white px-6 py-2.5 md:py-3 text-[0.9375rem] font-medium flex items-center gap-2 hover:bg-black/80 transition-colors shadow-md hover:shadow-xl"
            >
              Book Project{" "}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.06)" }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/20 flex items-center justify-center transition-colors text-black"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* 
        Top Hero Section with Pure White Background 
        Sleek Black & White Editorial Aesthetic
      */}
      <div className="relative bg-white min-h-screen pt-24 pb-24 overflow-hidden border-b border-black/10">
        {/* --- HIGH-VISIBILITY PARALLAX HORIZONTAL TEXT --- */}
        <motion.div
          style={{ x: xMarqueeText }}
          className="absolute left-0 bottom-8 whitespace-nowrap text-[10rem] sm:text-[14rem] font-bold text-black/[0.04] select-none pointer-events-none tracking-tighter uppercase font-serif z-0"
        >
          Drach Concepts • Videography & Photography • Creative Studio •
        </motion.div>

        {/* --- Interactive Net + Animated Grid (mouse-reactive canvas) --- */}
        <NetBackground />

        {/* --- Main Hero Content --- */}
        <main className="relative z-10 mx-auto max-w-[100rem] px-6 md:px-12 lg:px-16 pt-12 lg:pt-16 flex flex-col lg:flex-row gap-12 lg:gap-8">
          {/* Left Column (Text & UI) with Parallax Lift */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: yHeroText }}
            className="w-full lg:w-[55%] pt-4 lg:pr-8"
          >
            {/* Huge Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-[3.25rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.25rem] leading-[1.04] font-light tracking-[-0.04em] text-black"
            >
              Cinematic <br />
              Videography & <br />
              Photography<span className="text-black">.</span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-2xl gap-8"
            >
              <p className="text-black/70 text-[1.0625rem] leading-relaxed max-w-[18.75rem]">
                Specializing in premier 4K videography, editorial photography,
                music production & event coverage.
              </p>

              {/* Rating Block — modern interactive card */}
              <div className="flex flex-col gap-3 group/rating cursor-pointer select-none">
                {/* Avatar Stack */}
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-[0.15625rem] border-white overflow-hidden bg-black/10 -ml-2 first:ml-0 shadow-sm relative cursor-pointer transition-all duration-300 ease-out hover:scale-125 hover:z-30 hover:-translate-y-1 hover:shadow-md hover:border-black/20"
                      style={{ zIndex: i }}
                    >
                      <Image
                        src={`/images/client${i}.jpg`}
                        alt={`Client ${i}`}
                        width={36}
                        height={36}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                  <div
                    className="w-9 h-9 rounded-full border-[0.15625rem] border-white bg-black flex items-center justify-center text-white text-xs font-bold -ml-2 shadow-sm relative cursor-pointer transition-all duration-300 ease-out hover:scale-125 hover:z-30 hover:-translate-y-1 hover:shadow-md hover:bg-black/90"
                    style={{ zIndex: 5 }}
                  >
                    +9k
                  </div>
                </div>

                {/* Stars + Label */}
                <div className="flex flex-col gap-0.5 transition-transform duration-300 group-hover/rating:translate-x-0.5">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className="w-3.5 h-3.5 fill-black transition-transform duration-300 group-hover/rating:scale-110"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-[0.8125rem] font-semibold text-black ml-1 transition-colors duration-200">
                      4.7
                    </span>
                  </div>
                  <p className="text-[0.75rem] text-black/45 font-medium tracking-wide uppercase transition-colors duration-300 group-hover/rating:text-black/70">
                    13,000+ Happy Clients
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Filter / Search Bar */}
            <motion.div
              variants={itemVariants}
              className="mt-16 w-full max-w-[53.125rem] relative z-20"
            >
              {/* Tabs */}
              <div className="flex items-center gap-8 mb-5 px-2">
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer bg-black text-white text-sm font-bold tracking-[0.2em] px-9 py-4 hover:bg-black/85 transition-colors shadow-lg hover:shadow-2xl"
                >
                  SERVICES
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer text-black/40 text-sm font-bold tracking-[0.2em] hover:text-black transition-colors duration-200"
                >
                  PORTFOLIO
                </motion.button>
              </div>

              {/* Main White Box */}
              <div className="bg-white border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] w-full flex flex-col md:flex-row relative">
                <div className="group flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/10 cursor-pointer hover:bg-black/[0.02] transition-colors duration-200">
                  <p className="text-[0.6875rem] text-black/50 mb-2">
                    I&apos;m looking to...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[1rem] font-medium text-black group-hover:text-black/70 transition-colors">
                      Book a Studio
                    </span>
                    <ChevronDown className="w-4 h-4 text-black/40 group-hover:translate-y-0.5 transition-transform duration-200" />
                  </div>
                </div>

                <div className="group flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/10 relative cursor-pointer hover:bg-black/[0.02] transition-colors duration-200">
                  <p className="text-[0.6875rem] text-black/50 mb-2">
                    Location
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[1rem] font-medium text-black group-hover:text-black/70 transition-colors">
                      Creative Studio
                    </span>
                    <MapPin className="w-4 h-4 text-black/40 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                </div>

                <div className="group flex-1 p-6 md:p-8 md:pr-32 relative cursor-pointer hover:bg-black/[0.02] transition-colors duration-200">
                  <p className="text-[0.6875rem] text-black/50 mb-2">
                    Project Range
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[1rem] font-medium text-black group-hover:text-black/70 transition-colors">
                      $1,000 - $20,000
                    </span>
                    <ChevronDown className="w-4 h-4 text-black/40 group-hover:translate-y-0.5 transition-transform duration-200" />
                  </div>
                </div>

                {/* Overlapping Search Button */}
                <motion.button
                  whileHover={{ scale: 1.06, backgroundColor: "#1a1a1a" }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer absolute right-0 bottom-0 md:-right-8 md:-bottom-8 w-24 h-24 bg-black flex items-center justify-center shadow-2xl z-30 transition-shadow hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                >
                  <Search className="w-6 h-6 text-white" strokeWidth={1.5} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column with High-Impact Parallax Scroll Offset */}
          <div className="w-full lg:w-[45%] relative mt-16 lg:mt-0 lg:absolute lg:right-0 lg:top-[15%] h-[31.25rem] lg:h-[43.75rem] z-10">
            <motion.div
              style={{ y: yHeroImage }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full lg:w-[90%] lg:h-[105%] ml-auto bg-black/5 shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-black/10"
            >
              <Image
                src="/images/hero-camera.jpg"
                alt="Drach Concepts — Cinematic Photography"
                fill
                className="object-cover object-center"
                priority
              />
            </motion.div>
          </div>
        </main>
      </div>

      {/* ── Bottom Trust Section — animated background + parallax ── */}
      <section
        ref={trustRef}
        className="bg-white py-24 px-6 md:px-12 lg:px-16 mx-auto max-w-[100rem] relative z-20 -mt-10 lg:-mt-20 border-b border-black/10 overflow-hidden"
      >
        {/* Parallax dot grid — drifts opposite to content */}
        <motion.div
          style={{
            y: yTrustBg,
            backgroundImage:
              "radial-gradient(#000 0.0625rem, transparent 0.0625rem)",
            backgroundSize: "1rem 1rem",
          }}
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
        />

        {/* Ambient blob — slow continuous drift */}
        <motion.div
          style={{ y: yTrustBlob }}
          className="absolute -right-24 -top-24 w-[28rem] h-[28rem] rounded-full pointer-events-none"
          animate={{ x: [0, 30, -15, 0], scale: [1, 1.06, 0.97, 1] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          aria-hidden
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-black/[0.05] to-transparent blur-2xl" />
        </motion.div>
        <motion.div
          style={{ y: yTrustBlob }}
          className="absolute -left-16 bottom-0 w-[20rem] h-[20rem] rounded-full pointer-events-none"
          animate={{ x: [0, -20, 10, 0], scale: [1, 0.94, 1.05, 1] }}
          transition={{
            duration: 22,
            delay: 4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          aria-hidden
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-black/[0.04] to-transparent blur-2xl" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          {/* Heading — fastest parallax layer */}
          <motion.h2
            style={{ y: yTrustHeading }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[2.5rem] md:text-[3.5rem] leading-[1.1] font-semibold text-black max-w-md tracking-tight"
          >
            1,230+ Companies <br /> Trust by us.
          </motion.h2>

          {/* Body + buttons — slower parallax layer */}
          <motion.div
            style={{ y: yTrustBody }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full lg:w-1/2 flex flex-col gap-10"
          >
            <p className="text-black/70 text-[1.0625rem] leading-relaxed max-w-xl">
              Your leading creative partner, transforming visions into reality.
              Trust us to expertly guide you through music, photo, and video
              production. Over 745,000 successful projects delivered worldwide.
            </p>

            <div className="flex items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer bg-black text-white px-8 py-4 text-[0.9375rem] font-medium hover:bg-black/85 transition-colors shadow-md hover:shadow-xl"
              >
                More Details
              </motion.button>
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer group text-[0.9375rem] font-medium text-black flex items-center gap-2 hover:text-black/60 transition-colors"
              >
                Request a Callback{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

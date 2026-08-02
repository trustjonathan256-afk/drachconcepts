"use client";

import {
  motion,
  Variants,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Globe,
  Mail,
  Phone,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const servicesList = [
  "Video Production",
  "Photography",
  "Creative Direction",
  "Music Production",
];

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#" },
  { label: "Portfolio", href: "#" },
  { label: "Process", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Contact", href: "#" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "YouTube", href: "#", icon: FaYoutube },
  { label: "LinkedIn", href: "#", icon: FaLinkedin },
];

// ─── Variants ───────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Interactive Mouse Canvas Component ─────────────────────────────────────
function InteractiveCanvas({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const smoothMouse = useRef({ x: -9999, y: -9999 });
  const ripples = useRef<
    { x: number; y: number; radius: number; maxRadius: number; alpha: number }[]
  >([]);
  const particles = useRef<
    {
      x: number;
      y: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
      r: number;
      pulseOffset: number;
    }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const parent = sectionRef.current;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const count = Math.max(
        80,
        Math.min(170, Math.round((rect.width * rect.height) / 9500))
      );
      particles.current = Array.from({ length: count }, () => {
        const ox = Math.random() * rect.width;
        const oy = Math.random() * rect.height;
        return {
          x: ox,
          y: oy,
          ox,
          oy,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1.1 + Math.random() * 2,
          pulseOffset: Math.random() * Math.PI * 2,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const parent = sectionRef.current;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      smoothMouse.current = { x: -9999, y: -9999 };
    };

    const onClick = (e: MouseEvent) => {
      const parent = sectionRef.current;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      ripples.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 170,
        alpha: 0.45,
      });
    };

    const sectionEl = sectionRef.current;
    if (sectionEl) {
      sectionEl.addEventListener("mousemove", onMouseMove);
      sectionEl.addEventListener("mouseleave", onMouseLeave);
      sectionEl.addEventListener("click", onClick);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const targetX = mouse.current.x;
      const targetY = mouse.current.y;

      if (targetX > 0 && targetY > 0) {
        if (smoothMouse.current.x < 0) {
          smoothMouse.current = { x: targetX, y: targetY };
        } else {
          smoothMouse.current.x += (targetX - smoothMouse.current.x) * 0.14;
          smoothMouse.current.y += (targetY - smoothMouse.current.y) * 0.14;
        }
      }

      const smx = smoothMouse.current.x;
      const smy = smoothMouse.current.y;
      const now = performance.now() / 1000;

      // Spotlight reticle
      if (smx > 0 && smy > 0) {
        const grad = ctx.createRadialGradient(smx, smy, 0, smx, smy, 400);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
        grad.addColorStop(0.4, "rgba(255, 255, 255, 0.025)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(smx, smy, 400, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(smx, smy, 36, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Particles & web lines
      const pts = particles.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        let nearMouse = false;
        let mouseDist = 999;

        if (smx > 0 && smy > 0) {
          const dx = p.x - smx;
          const dy = p.y - smy;
          mouseDist = Math.sqrt(dx * dx + dy * dy);
          if (mouseDist < 240) {
            nearMouse = true;
            const force = ((240 - mouseDist) / 240) * 0.12;
            p.x += (dx / (mouseDist || 1)) * force * 20;
            p.y += (dy / (mouseDist || 1)) * force * 20;
          }
        }

        const pulse = Math.sin(now * 1.4 + p.pulseOffset) * 0.5 + 0.5;
        const baseR = p.r + pulse * 1.1;

        ctx.fillStyle = nearMouse
          ? `rgba(255, 255, 255, ${0.25 + (1 - mouseDist / 240) * 0.2})`
          : "rgba(255, 255, 255, 0.12)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, nearMouse ? baseR * 1.3 : baseR, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alphaBase = 0.06 * (1 - dist / 120);
            ctx.strokeStyle = `rgba(255, 255, 255, ${nearMouse ? alphaBase * 3 : alphaBase})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Click Ripples
      ripples.current = ripples.current.filter((rp) => rp.alpha > 0.01);
      for (const rp of ripples.current) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rp.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        rp.radius += (rp.maxRadius - rp.radius) * 0.06;
        rp.alpha *= 0.94;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (sectionEl) {
        sectionEl.removeEventListener("mousemove", onMouseMove);
        sectionEl.removeEventListener("mouseleave", onMouseLeave);
        sectionEl.removeEventListener("click", onClick);
      }
      cancelAnimationFrame(animId);
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// ─── Main Export Component ───────────────────────────────────────────────────
export default function CtaFooterSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets — larger ranges so motion is clearly visible
  const yHeader = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yBgDots = useTransform(scrollYProgress, [0, 1], ["-16rem", "16rem"]);

  return (
    <footer
      ref={sectionRef}
      className="bg-black text-white relative selection:bg-white selection:text-black border-t border-white/10"
    >
      {/* Scoped overflow clip for bg layers only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Interactive Mouse Tracking Canvas Background */}
        <InteractiveCanvas sectionRef={sectionRef} />

        {/* Parallax Dot Grid */}
        <motion.div
          style={{
            y: yBgDots,
            backgroundImage:
              "radial-gradient(#fff 0.0625rem, transparent 0.0625rem)",
            backgroundSize: "1rem 1rem",
          }}
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
        />
      </div>

      {/* ── TOP HERO CTA BLOCK ── */}
      <div className="pt-24 md:pt-36 pb-20 md:pb-28 border-b border-white/10 relative z-10">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16 text-center">
          <motion.div style={{ y: yHeader }}>
            {/* Eyebrow / Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-[0.2em] text-white/90 uppercase">
                  Based in Uganda
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 backdrop-blur-md">
                <Globe className="w-3.5 h-3.5 text-white/80" />
                <span className="text-xs font-semibold tracking-[0.2em] text-white/90 uppercase">
                  Working Worldwide
                </span>
              </div>
            </motion.div>

            {/* Giant Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.75rem] sm:text-[4.25rem] md:text-[5.5rem] lg:text-[6.75rem] font-light tracking-[-0.04em] text-white leading-[1.04] mb-8 max-w-6xl mx-auto"
            >
              READY TO CREATE SOMETHING <br />
              <span className="font-serif italic font-normal text-white/40">
                EXTRAORDINARY?
              </span>
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/70 text-base md:text-xl lg:text-2xl font-light tracking-tight max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Every great brand deserves visuals that people remember.
            </motion.p>

            {/* Primary Action Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="group relative bg-white text-black px-10 md:px-14 py-5 md:py-6 text-base md:text-lg font-medium flex items-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:shadow-[0_30px_70px_rgba(255,255,255,0.25)] transition-all duration-300 select-none cursor-pointer"
              >
                <span>Book Your Project</span>
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.button>
            </motion.div>

            {/* Services Chips Summary */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-4xl mx-auto border-t border-white/10 pt-10">
              {servicesList.map((service) => (
                <motion.div
                  key={service}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  className="flex items-center gap-2 border border-white/20 bg-white/5 px-4 md:px-5 py-2 text-xs md:text-sm font-medium tracking-wider text-white/80 backdrop-blur-sm cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white/60" />
                  <span>{service}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── FOOTER NAVIGATION & DETAILS ── */}
      <div className="pt-16 pb-12 relative z-10">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
            {/* Column 1: Brand & Mission */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <a href="#" className="inline-block mb-6">
                  <Image
                    src="/images/drash_logo.png"
                    alt="Drach Concepts Logo"
                    width={200}
                    height={62}
                    className="h-10 w-auto object-contain invert"
                  />
                </a>
                <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6 font-normal">
                  Pioneering cinematic videography, editorial photography, and sound architecture. Built for visionary brands worldwide.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      whileHover={{ scale: 1.1, backgroundColor: "#ffffff", color: "#000000" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 border border-white/20 flex items-center justify-center text-white transition-colors"
                      aria-label={s.label}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-6">
                Navigation
              </h4>
              <ul className="space-y-3 text-sm font-medium text-white/70">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <ChevronRight className="w-3 h-3 text-white/30 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Core Disciplines */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-6">
                Disciplines
              </h4>
              <ul className="space-y-3 text-sm font-medium text-white/70">
                {servicesList.map((service) => (
                  <li key={service} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Studio Info */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-6">
                Studio Contact
              </h4>
              <div className="space-y-4 text-sm font-medium text-white/70">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/50 shrink-0 mt-1" />
                  <span>Kampala, Uganda • Worldwide Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/50 shrink-0" />
                  <a
                    href="mailto:contact@drachconcepts.com"
                    className="hover:text-white transition-colors"
                  >
                    contact@drachconcepts.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/50 shrink-0" />
                  <a
                    href="tel:+256700000000"
                    className="hover:text-white transition-colors"
                  >
                    +256 (0) 700 000 000
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/40">
            <p>© 2026 Drach Concepts. All rights reserved.</p>
            <p className="tracking-wider uppercase text-[0.6875rem]">
              Crafted for extraordinary brands worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

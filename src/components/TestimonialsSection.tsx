"use client";

import {
  motion,
  Variants,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Building2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

// ─── Client Testimonials Data ────────────────────────────────────────────────
const testimonials = [
  {
    id: "01",
    quote:
      "The team at Drach didn't just produce a video—they elevated our entire brand.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "Nova Studios",
    avatar: "/images/client1.jpg",
    rating: 5,
    category: "Brand Campaign",
    year: "2026",
  },
  {
    id: "02",
    quote:
      "Working with Drach on our flagship music video was seamless. Their cinematic eye and attention to acoustic detail are second to none.",
    author: "Marcus Vance",
    role: "Executive Producer",
    company: "Sony Music",
    avatar: "/images/client2.jpg",
    rating: 5,
    category: "Music Production",
    year: "2025",
  },
  {
    id: "03",
    quote:
      "Their editorial photography and set direction transformed our seasonal lookbook into an award-winning cultural piece.",
    author: "Elena Rostova",
    role: "Creative Director",
    company: "Vogue Editorial",
    avatar: "/images/client3.jpg",
    rating: 5,
    category: "Editorial Photography",
    year: "2025",
  },
  {
    id: "04",
    quote:
      "From FPV drone operations to final DaVinci color grading, Drach delivered a masterclass in commercial film production.",
    author: "David Chen",
    role: "Global Brand Lead",
    company: "Apex Technology",
    avatar: "/images/client4.jpg",
    rating: 5,
    category: "Commercial Film",
    year: "2026",
  },
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

// ─── Interactive Canvas Component ───────────────────────────────────────────
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
        grad.addColorStop(0, "rgba(0, 0, 0, 0.08)");
        grad.addColorStop(0.4, "rgba(0, 0, 0, 0.025)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(smx, smy, 400, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
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
          ? `rgba(0, 0, 0, ${0.22 + (1 - mouseDist / 240) * 0.18})`
          : "rgba(0, 0, 0, 0.12)";
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
            ctx.strokeStyle = `rgba(0, 0, 0, ${nearMouse ? alphaBase * 3 : alphaBase})`;
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
        ctx.strokeStyle = `rgba(0, 0, 0, ${rp.alpha})`;
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
export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets — larger ranges so motion is clearly visible
  const yHeader = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yContentGroup = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yBgDots = useTransform(scrollYProgress, [0, 1], ["-16rem", "16rem"]);

  const current = testimonials[activeIndex];

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-20 md:pt-28 pb-28 md:pb-36 relative border-t border-black/10 selection:bg-black selection:text-white"
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
              "radial-gradient(#000 0.0625rem, transparent 0.0625rem)",
            backgroundSize: "1rem 1rem",
          }}
          className="absolute inset-0 pointer-events-none opacity-[0.075]"
        />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* ── Section Header ── */}
        <motion.div style={{ y: yHeader }} className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="h-px w-12 bg-black/40 origin-left"
            />
            <span className="text-xs font-semibold tracking-[0.25em] text-black/50 uppercase">
              CLIENT VOICES
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-8"
            >
              <h2 className="text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5.25rem] leading-[1.05] font-light text-black tracking-[-0.03em]">
                Trusted by artists, <br />
                brands &{" "}
                <span className="font-serif italic font-normal text-black/25">
                  visionaries.
                </span>
              </h2>
            </motion.div>

            {/* Navigation Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-3 lg:pb-3"
            >
              <motion.button
                whileHover={{ scale: 1.06, backgroundColor: "#000000", color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="w-12 h-12 border border-black/20 text-black flex items-center justify-center transition-colors shadow-sm"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06, backgroundColor: "#000000", color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-12 h-12 border border-black/20 text-black flex items-center justify-center transition-colors shadow-sm"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Main Feature Testimonial Display ── */}
        <motion.div
          style={{ y: yContentGroup }}
          className="relative bg-white border border-black/10 p-8 sm:p-12 md:p-16 lg:p-20 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          {/* Giant Decorative Quote Mark Background */}
          <div className="absolute right-6 bottom-4 text-black/[0.04] text-[18rem] md:text-[26rem] font-serif font-bold pointer-events-none select-none leading-none">
            &ldquo;
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              {/* Category Pill & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <span className="text-xs font-semibold tracking-[0.2em] text-black/50 uppercase border border-black/15 px-3 py-1.5 backdrop-blur-sm">
                  {current.category} • {current.year}
                </span>

                <div className="flex items-center gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-black fill-black"
                    />
                  ))}
                </div>
              </div>

              {/* Quote Text */}
              <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] text-black tracking-tight font-serif italic mb-12 max-w-5xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-black/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative border border-black/20 bg-black/5 shadow-sm">
                    <Image
                      src={current.avatar}
                      alt={current.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-black">
                      {current.author}
                    </h3>
                    <p className="text-xs text-black/60 font-medium">
                      {current.role} •{" "}
                      <span className="text-black font-semibold">
                        {current.company}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Counter indicator */}
                <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-black/40">
                  <span className="text-black font-bold">
                    0{activeIndex + 1}
                  </span>
                  <span>/</span>
                  <span>0{testimonials.length}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Client Selectors / Thumbnails Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              onClick={() => {
                setDirection(idx > activeIndex ? 1 : -1);
                setActiveIndex(idx);
              }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 border cursor-pointer transition-all duration-300 select-none ${
                idx === activeIndex
                  ? "bg-black text-white border-black shadow-md"
                  : "bg-white text-black border-black/10 hover:border-black/30 hover:bg-black/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden relative border border-black/20 bg-black/10 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate">{t.author}</p>
                  <p className="text-[0.65rem] opacity-60 truncate">
                    {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

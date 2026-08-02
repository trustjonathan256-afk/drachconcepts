"use client";

import {
  motion,
  Variants,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Compass,
  Layers,
  Clapperboard,
  Sliders,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// ─── Process Steps Data ───────────────────────────────────────────────────────
const processSteps = [
  {
    step: "01",
    title: "Discovery & Strategy",
    subtitle: "Deep Dive & Narrative Architecture",
    icon: Compass,
    image: "/images/nathan-dumlao-McztPB7Uqx8-unsplash.jpg",
    description:
      "We begin by immersing ourselves in your brand's DNA. We define core objectives, audience psychology, moodboards, and narrative arcs to ensure strategic alignment before a single frame is shot.",
    deliverables: ["Creative Brief", "Moodboards", "Storyboard & Script", "Concept Pitch"],
    timeline: "Phase 01 • Week 1–2",
    details: {
      focus: "Establishing creative direction and strategic positioning.",
      tools: "Figma, Milanote, Studio Scripting Engines",
      outcome: "Approved creative blueprint and production roadmap.",
    },
  },
  {
    step: "02",
    title: "Pre-Production & Craft",
    subtitle: "Precision Planning & Technical Rigging",
    icon: Layers,
    image: "/images/hero-camera2.jpg",
    description:
      "Flawless execution requires rigorous preparation. We manage talent casting, location scouting, set design, lighting schemes, and shot-by-shot technical pre-visualization.",
    deliverables: ["Technical Shot List", "Casting & Location Permits", "Lighting Plots", "Schedule & Call Sheets"],
    timeline: "Phase 02 • Week 2–3",
    details: {
      focus: "Locking logistics, crew assembly, and camera/lighting packages.",
      tools: "Celtx, Frame.io Previs, ShotDeck",
      outcome: "Turnkey production schedule ready for execution.",
    },
  },
  {
    step: "03",
    title: "Principal Production",
    subtitle: "High-Impact Execution & On-Set Direction",
    icon: Clapperboard,
    image: "/images/event-coverage1.png",
    description:
      "Where vision comes to life. Our directors and cinematographers execute with RED/ARRI 8K/4K cinema cameras, master lighting rigs, FPV aerial coverage, and pristine audio capture.",
    deliverables: ["4K/8K RAW Dailies", "Multi-Track Audio", "FPV Aerial Captures", "B-Roll Archive"],
    timeline: "Phase 03 • Production Days",
    details: {
      focus: "Capturing cinematic visuals and sound with precision.",
      gear: "ARRI Alexa Mini LF, RED V-Raptor, Master Anamorphic Primes",
      outcome: "High-resolution RAW footage and audio masters.",
    },
  },
  {
    step: "04",
    title: "Post-Production & Mastering",
    subtitle: "Editing, Color Grading & Audio Architecture",
    icon: Sliders,
    image: "/images/michael-soledad-jiOByhCw2jE-unsplash.jpg",
    description:
      "We sculpt raw assets into a polished masterpiece. Precision editing, DaVinci Resolve color grading, custom sound design, original music scoring, and multi-platform aspect ratio mastering.",
    deliverables: ["Master Cut (4K/8K)", "DaVinci Color Grade", "Dolby Atmos Audio", "Social Aspect Ratio Cuts"],
    timeline: "Phase 04 • Week 4–6",
    details: {
      focus: "Editorial pacing, color storytelling, and acoustic mixing.",
      tools: "DaVinci Resolve Studio, Premiere Pro, Pro Tools HDX",
      outcome: "Broadcast & web-ready campaign deliverables.",
    },
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

// ─── Process Step Card Component ──────────────────────────────────────────────
function ProcessStepCard({
  item,
  index,
  isSelected,
  onToggleSelect,
}: {
  item: (typeof processSteps)[0];
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = item.icon;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onToggleSelect}
      className={`group relative bg-white border p-8 md:p-10 transition-all duration-400 cursor-pointer select-none overflow-hidden ${
        isSelected
          ? "border-black shadow-[0_25px_60px_rgba(0,0,0,0.12)] ring-1 ring-black"
          : "border-black/10 hover:border-black hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
      }`}
    >
      {/* Accent left indicator line */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-1.5 bg-black origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isSelected || hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left side: Number + Icon + Title + Subtitle */}
        <div className="flex items-start gap-6">
          <span className="text-3xl sm:text-4xl font-light text-black/30 group-hover:text-black font-serif italic transition-colors shrink-0 pt-1">
            {item.step}
          </span>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-black/5 group-hover:bg-black text-black group-hover:text-white flex items-center justify-center transition-colors duration-300">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-black/40 group-hover:text-black transition-colors">
                {item.subtitle}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-light tracking-tight text-black group-hover:translate-x-1 transition-transform duration-300">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Right side: Timeline badge & toggle arrow */}
        <div className="flex items-center gap-4 shrink-0 self-start lg:self-center">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-black/50 border border-black/15 px-3 py-1.5 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-black/40" />
            <span>{item.timeline}</span>
          </div>

          <motion.div
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{
              backgroundColor: isSelected ? "#000000" : "rgba(0, 0, 0, 0)",
              color: isSelected ? "#ffffff" : "#000000",
              rotate: isSelected ? 90 : hovered ? 45 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 border border-black/20 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Description */}
      <p className="text-black/65 text-base leading-relaxed font-normal mt-6 max-w-4xl">
        {item.description}
      </p>

      {/* Deliverable pills */}
      <div className="mt-6 pt-6 border-t border-black/10 flex flex-wrap items-center gap-2">
        <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-black/40 uppercase mr-2">
          Deliverables:
        </span>
        {item.deliverables.map((del) => (
          <motion.span
            key={del}
            whileHover={{ scale: 1.05, backgroundColor: "#000000", color: "#ffffff" }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium bg-black/5 text-black px-3 py-1 border border-black/10 transition-colors"
          >
            {del}
          </motion.span>
        ))}
      </div>

      {/* ── ON CLICK EXPANDED DRAWER DETAILS ── */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black pt-6 bg-black/[0.02] -mx-8 md:-mx-10 -mb-8 md:-mb-10 p-8 md:p-10"
          >
            {/* Responsive Process Step Visual Image */}
            <div className="relative w-full h-48 sm:h-64 mb-6 overflow-hidden border border-black/10 bg-black/5">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 text-white text-xs font-semibold uppercase tracking-widest">
                Phase {item.step} Visual Blueprint
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-[0.625rem] font-bold tracking-widest uppercase text-black/50 block mb-1">
                  Core Focus
                </span>
                <p className="text-xs font-semibold text-black leading-relaxed">
                  {item.details.focus}
                </p>
              </div>

              <div>
                <span className="text-[0.625rem] font-bold tracking-widest uppercase text-black/50 block mb-1">
                  {item.details.gear ? "Camera & Equipment" : "Tools & Platforms"}
                </span>
                <p className="text-xs font-medium text-black/80 leading-relaxed">
                  {item.details.gear || item.details.tools}
                </p>
              </div>

              <div>
                <span className="text-[0.625rem] font-bold tracking-widest uppercase text-black/50 block mb-1">
                  Key Milestone
                </span>
                <p className="text-xs font-medium text-black/80 leading-relaxed">
                  {item.details.outcome}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
              <span className="text-xs font-medium text-black/50">
                Ready to initiate this phase for your brand?
              </span>
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: "#000000" }}
                whileTap={{ scale: 0.96 }}
                className="bg-black text-white px-5 py-2 text-xs font-medium tracking-wider uppercase flex items-center gap-2 shadow-md"
              >
                Initiate {item.title.split(" ")[0]}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Export Component ───────────────────────────────────────────────────
export default function ProcessSection() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets — larger ranges so motion is clearly visible
  const yHeader = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yProcessGroup = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yBgDots = useTransform(scrollYProgress, [0, 1], ["-16rem", "16rem"]);

  const toggleSelectStep = (step: string) => {
    if (selectedStep === step) {
      setSelectedStep(null);
    } else {
      setSelectedStep(step);
    }
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
              OUR PROCESS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <h2 className="text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5.25rem] leading-[1.05] font-light text-black tracking-[-0.03em]">
                Built for brands that <br />
                expect{" "}
                <span className="font-serif italic font-normal text-black/25">
                  excellence.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 lg:pb-3"
            >
              <p className="text-black/65 text-base md:text-[1.0625rem] leading-relaxed max-w-lg">
                We don&apos;t simply shoot videos. We craft visual experiences
                that move audiences and elevate brands.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Process Steps Vertical Flow ── */}
        <motion.div
          style={{ y: yProcessGroup }}
          className="space-y-4 md:space-y-6"
        >
          {processSteps.map((item, index) => (
            <ProcessStepCard
              key={item.step}
              item={item}
              index={index}
              isSelected={selectedStep === item.step}
              onToggleSelect={() => toggleSelectStep(item.step)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

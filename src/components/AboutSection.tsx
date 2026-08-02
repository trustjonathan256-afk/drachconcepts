"use client";

import {
  motion,
  Variants,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Video,
  Volume2,
  Globe,
  Award,
  Zap,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ─── Framer Motion Variants ───────────────────────────────────────────────────
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Core Pillars Data ────────────────────────────────────────────────────────
const pillars = [
  {
    id: "01",
    title: "Strategic Vision & Brand Craft",
    icon: Compass,
    description:
      "We shape distinct visual identities and brand strategies that command attention and drive emotional resonance.",
    tags: ["Brand Architecture", "Visual Identity", "Creative Direction"],
  },
  {
    id: "02",
    title: "Cinematic Visual Production",
    icon: Video,
    description:
      "State-of-the-art 4K videography, aerial drone cinematography, and commercial photography designed for high impact.",
    tags: ["4K Video Production", "Drone Coverage", "Editorial Photography"],
  },
  {
    id: "03",
    title: "Sonic & Audio Architecture",
    icon: Volume2,
    description:
      "Full-scale music recording, mixing, mastering, sound design, and custom voiceover scoring in our premier studios.",
    tags: ["Music Recording", "Sound Design", "Audio Mastering"],
  },
  {
    id: "04",
    title: "Digital & Immersive Media",
    icon: Globe,
    description:
      "Crafting interactive web experiences, high-converting social media collateral, and next-gen digital campaign assets.",
    tags: ["Digital Campaigns", "Social Content", "Interactive Media"],
  },
];

// ─── Impact Metrics Data ──────────────────────────────────────────────────────
const metrics = [
  {
    value: "12+",
    label: "Years of Excellence",
    detail: "Delivering world-class creative services",
  },
  {
    value: "750+",
    label: "Global Campaigns",
    detail: "Executed across North America & Europe",
  },
  {
    value: "25+",
    label: "Industry Awards",
    detail: "Recognized in visual & audio arts",
  },
  {
    value: "99.4%",
    label: "Client Retention",
    detail: "Long-term trusted brand partnerships",
  },
];

// ─── Animated Background Blob ─────────────────────────────────────────────────
function AmbientBlob({
  size,
  top,
  left,
  duration,
  delay,
  opacity,
  xRange,
  yRange,
}: {
  size: string;
  top: string;
  left: string;
  duration: number;
  delay: number;
  opacity: number;
  xRange: number[];
  yRange: number[];
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        background:
          "radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)",
        opacity,
      }}
      animate={{
        x: xRange,
        y: yRange,
        scale: [1, 1.08, 0.96, 1.04, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Animated Diagonal Lines ──────────────────────────────────────────────────
function AnimatedGridLine({
  x1,
  y1,
  x2,
  y2,
  delay,
}: {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  delay: number;
}) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="currentColor"
      strokeWidth="0.5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.3, 0.3, 0] }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Interactive Canvas Component ──────────────────────────────────────────────
function InteractiveAboutCanvas({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
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
  const burstParticles = useRef<never[]>([]);
  const trail = useRef<{ x: number; y: number; alpha: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const parent = sectionRef.current;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Build initial particles grid
      const count = Math.max(
        80,
        Math.min(180, Math.round((rect.width * rect.height) / 10000)),
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
          r: 1.2 + Math.random() * 2,
          pulseOffset: Math.random() * Math.PI * 2,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const parent = sectionRef.current;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      mouse.current = { x: curX, y: curY };
    };

    const handleMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      smoothMouse.current = { x: -9999, y: -9999 };
      trail.current = [];
    };

    const handleClick = (e: MouseEvent) => {
      const parent = sectionRef.current;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      // Same eased ripple as HeroSection
      ripples.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 160,
        alpha: 0.5,
      });
    };

    const sectionEl = sectionRef.current;
    if (sectionEl) {
      sectionEl.addEventListener("mousemove", handleMouseMove);
      sectionEl.addEventListener("mouseleave", handleMouseLeave);
      sectionEl.addEventListener("click", handleClick);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── 60fps Smooth Lerping (Linear Interpolation) ──
      const targetX = mouse.current.x;
      const targetY = mouse.current.y;

      if (targetX > 0 && targetY > 0) {
        if (smoothMouse.current.x < 0) {
          smoothMouse.current = { x: targetX, y: targetY };
        } else {
          smoothMouse.current.x += (targetX - smoothMouse.current.x) * 0.14;
          smoothMouse.current.y += (targetY - smoothMouse.current.y) * 0.14;
        }

        // Push smooth position to trail
        trail.current.unshift({
          x: smoothMouse.current.x,
          y: smoothMouse.current.y,
          alpha: 0.95,
        });
        if (trail.current.length > 18) trail.current.pop();
      }

      const smx = smoothMouse.current.x;
      const smy = smoothMouse.current.y;

      const now = performance.now() / 1000;

      // ── 1. Dim Soft Spotlight & Subtle Reticle ──
      if (smx > 0 && smy > 0) {
        // Soft ambient aura — very subtle
        const grad = ctx.createRadialGradient(smx, smy, 0, smx, smy, 420);
        grad.addColorStop(0, "rgba(0, 0, 0, 0.10)");
        grad.addColorStop(0.35, "rgba(0, 0, 0, 0.04)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(smx, smy, 420, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring — dim
        ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(smx, smy, 42, 0, Math.PI * 2);
        ctx.stroke();

        // Inner reticle ring — soft
        ctx.strokeStyle = "rgba(0, 0, 0, 0.32)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(smx, smy, 18, 0, Math.PI * 2);
        ctx.stroke();

        // 4 small crosshair ticks — ghost
        ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(smx, smy - 26);
        ctx.lineTo(smx, smy - 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(smx, smy + 12);
        ctx.lineTo(smx, smy + 26);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(smx - 26, smy);
        ctx.lineTo(smx - 12, smy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(smx + 12, smy);
        ctx.lineTo(smx + 26, smy);
        ctx.stroke();

        // Tiny center dot
        ctx.fillStyle = "rgba(0, 0, 0, 0.40)";
        ctx.beginPath();
        ctx.arc(smx, smy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 2. Faint Fading Trail ──
      const tr = trail.current;
      for (let i = tr.length - 1; i >= 0; i--) {
        const t = tr[i];
        t.alpha -= 0.04;
        if (t.alpha <= 0) {
          tr.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(0, 0, 0, ${t.alpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 3.5 * (1 - i / tr.length) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 3. Update & Draw Particles with Enriched Visibility ──
      const pts = particles.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at boundaries
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        let nearMouse = false;
        let mouseDist = 999;

        // Mouse repulsion using smooth lerped position
        if (smx > 0 && smy > 0) {
          const dx = p.x - smx;
          const dy = p.y - smy;
          mouseDist = Math.sqrt(dx * dx + dy * dy);
          if (mouseDist < 260) {
            nearMouse = true;
            const force = ((260 - mouseDist) / 260) * 0.12;
            p.x += (dx / (mouseDist || 1)) * force * 22;
            p.y += (dy / (mouseDist || 1)) * force * 22;
          }
        }

        // Animated pulse radius
        const pulse = Math.sin(now * 1.4 + p.pulseOffset) * 0.5 + 0.5;
        const baseR = p.r + pulse * 1.2;

        ctx.fillStyle = nearMouse
          ? `rgba(0, 0, 0, ${0.22 + (1 - mouseDist / 260) * 0.18})`
          : "rgba(0, 0, 0, 0.13)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, nearMouse ? baseR * 1.3 : baseR, 0, Math.PI * 2);
        ctx.fill();

        // Subtle connecting lines — dim webs
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alphaBase = 0.07 * (1 - dist / 130);
            const illuminated = nearMouse ? alphaBase * 3 : alphaBase;
            ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(0.3, illuminated)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // ── Draw Click Ripples (same eased expansion as Hero) ──
      ripples.current = ripples.current.filter((rp) => rp.alpha > 0.01);
      for (const rp of ripples.current) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${rp.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        rp.radius += (rp.maxRadius - rp.radius) * 0.06;
        rp.alpha *= 0.94;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (sectionEl) {
        sectionEl.removeEventListener("mousemove", handleMouseMove);
        sectionEl.removeEventListener("mouseleave", handleMouseLeave);
        sectionEl.removeEventListener("click", handleClick);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function AboutSection() {
  const [activePillar, setActivePillar] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // ─── Scroll-driven Parallax ───────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Images & Multi-axis Parallax Transforms — high travel for visibility
  const yPrimaryImage = useTransform(scrollYProgress, [0, 1], [260, -260]);
  const rotatePrimary = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const scalePrimary = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.88, 1.08, 0.9],
  );

  const ySecondaryImage = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const rotateSecondary = useTransform(scrollYProgress, [0, 1], [12, -12]);

  const yBadge = useTransform(scrollYProgress, [0, 1], [160, -160]);
  const yFloatingTag = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const rotateQuoteMark = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  // Background layers — multi-speed parallax depth
  const yBgDots = useTransform(scrollYProgress, [0, 1], ["-14rem", "14rem"]);
  const yBgBlob1 = useTransform(scrollYProgress, [0, 1], ["-24rem", "24rem"]);
  const yBgBlob2 = useTransform(scrollYProgress, [0, 1], ["18rem", "-18rem"]);
  const yBgBlob3 = useTransform(scrollYProgress, [0, 1], ["-28rem", "28rem"]);

  // Content layers
  const yHeading = useTransform(scrollYProgress, [0, 1], ["7rem", "-7rem"]);
  const yPillars = useTransform(scrollYProgress, [0, 1], ["4rem", "-4rem"]);
  const yMetrics = useTransform(scrollYProgress, [0, 1], ["5rem", "-5rem"]);
  const yManifesto = useTransform(scrollYProgress, [0, 1], ["8rem", "-8rem"]);

  // Staggered multi-speed parallax for metric cards
  const yMetric0 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yMetric1 = useTransform(scrollYProgress, [0, 1], [140, -140]);
  const yMetric2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yMetric3 = useTransform(scrollYProgress, [0, 1], [110, -110]);
  const metricYTransforms = [yMetric0, yMetric1, yMetric2, yMetric3];

  return (
    <section
      ref={sectionRef}
      className="bg-white py-24 md:py-32 relative overflow-hidden border-t border-black/10 selection:bg-black selection:text-white"
    >
      {/* ── INTERACTIVE CANVAS BACKGROUND ─────────────────────────────────── */}
      <InteractiveAboutCanvas sectionRef={sectionRef} />

      {/* ── ANIMATED BACKGROUND LAYER ──────────────────────────────────────── */}

      {/* Dot grid — drifts upward as you scroll down */}
      <motion.div
        style={{
          y: yBgDots,
          backgroundImage:
            "radial-gradient(#000000 0.0625rem, transparent 0.0625rem)",
          backgroundSize: "1rem 1rem",
        }}
        className="absolute left-0 top-0 w-full h-full pointer-events-none opacity-[0.08]"
      />

      {/* Large ambient blobs that float continuously */}
      <motion.div
        style={{ y: yBgBlob1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <AmbientBlob
          size="36rem"
          top="-10%"
          left="-8%"
          duration={14}
          delay={0}
          opacity={1}
          xRange={[0, 40, -20, 0]}
          yRange={[0, -30, 20, 0]}
        />
      </motion.div>
      <motion.div
        style={{ y: yBgBlob2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <AmbientBlob
          size="28rem"
          top="30%"
          left="65%"
          duration={18}
          delay={3}
          opacity={1}
          xRange={[0, -50, 30, 0]}
          yRange={[0, 40, -30, 0]}
        />
      </motion.div>
      <motion.div
        style={{ y: yBgBlob3 }}
        className="absolute inset-0 pointer-events-none"
      >
        <AmbientBlob
          size="22rem"
          top="70%"
          left="15%"
          duration={22}
          delay={6}
          opacity={1}
          xRange={[0, 30, -40, 10, 0]}
          yRange={[0, -20, 30, -10, 0]}
        />
      </motion.div>

      {/* Animated SVG diagonal reveal lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-black/20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <AnimatedGridLine x1="0" y1="0" x2="30%" y2="100%" delay={0} />
        <AnimatedGridLine x1="100%" y1="0" x2="70%" y2="100%" delay={2.5} />
        <AnimatedGridLine x1="50%" y1="0" x2="80%" y2="100%" delay={5} />
      </svg>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* ── SECTION HEADER with parallax drift ── */}
        <motion.div
          style={{ y: yHeading }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 md:mb-24"
        >
          {/* Eyebrow Label */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[0.0625rem] w-12 bg-black/40" />
            <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-black/70 uppercase">
              About Drach Concepts
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <h2 className="text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] leading-[1.06] font-light text-black tracking-[-0.03em]">
                Pioneering the Future of <br className="hidden sm:inline" />
                <span className="font-serif italic font-normal text-black/90">
                  Visual & Sonic
                </span>{" "}
                Storytelling.
              </h2>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 lg:pb-2"
            >
              <p className="text-black/70 text-[1rem] md:text-[1.0625rem] leading-relaxed max-w-xl">
                At Drach Concepts, we fuse strategic precision with uninhibited
                artistry to empower visionary brands through music production,
                cinematic film, and iconic design.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── MAIN GRID: Pillars + Media Composition ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24 md:mb-32">
          {/* Left Column: Core Pillars Accordion — with its own parallax drift */}
          <motion.div
            style={{ y: yPillars }}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-6 flex flex-col gap-4"
          >
            <div className="mb-4">
              <span className="text-xs font-bold tracking-widest text-black/40 uppercase">
                Core Disciplines
              </span>
              <h3 className="text-2xl md:text-3xl font-medium text-black mt-1">
                Engineered for Cultural Impact
              </h3>
            </div>

            <div className="space-y-4">
              {pillars.map((pillar, index) => {
                const IconComponent = pillar.icon;
                const isActive = activePillar === index;

                return (
                  <motion.div
                    key={pillar.id}
                    onClick={() => setActivePillar(index)}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`group p-6 md:p-8 cursor-pointer transition-all duration-300 border select-none ${isActive
                        ? "bg-white border-black shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                        : "bg-black/[0.02] border-black/10 hover:bg-white hover:border-black/30 hover:shadow-lg"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold tracking-wider text-black/40 group-hover:text-black transition-colors">
                          {pillar.id}
                        </span>
                        <div
                          className={`w-10 h-10 rounded-none flex items-center justify-center border transition-all duration-300 ${isActive
                              ? "bg-black border-black text-white shadow-md"
                              : "bg-white border-black/15 text-black group-hover:bg-black group-hover:text-white group-hover:border-black"
                            }`}
                        >
                          <IconComponent
                            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                            strokeWidth={1.5}
                          />
                        </div>
                        <h4 className="text-lg md:text-xl font-semibold text-black transition-transform duration-300 group-hover:translate-x-1">
                          {pillar.title}
                        </h4>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-none flex items-center justify-center border transition-all duration-300 ${isActive
                            ? "bg-black border-black text-white"
                            : "border-black/20 text-black/40 group-hover:bg-black group-hover:text-white group-hover:border-black"
                          }`}
                      >
                        <ArrowUpRight
                          className={`w-4 h-4 transition-transform duration-300 ${isActive
                              ? "rotate-45"
                              : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -6 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden mt-4 pt-4 border-t border-black/10"
                        >
                          <p className="text-black/70 text-[0.9375rem] leading-relaxed mb-4">
                            {pillar.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {pillar.tags.map((tag) => (
                              <motion.span
                                key={tag}
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "#000000",
                                  color: "#ffffff",
                                }}
                                transition={{ duration: 0.2 }}
                                className="text-[0.75rem] font-medium tracking-wide bg-black/5 text-black px-3 py-1 border border-black/10 cursor-pointer transition-colors"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Media Composition — images with multi-axis parallax & rotation */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-6 relative pt-6 lg:pt-0"
          >
            <div className="relative w-full h-[30rem] sm:h-[36.25rem] lg:h-[40rem]">
              {/* Floating Glass Tag Pill — fastest parallax drift */}
              <motion.div
                style={{ y: yFloatingTag }}
                whileHover={{ scale: 1.06, rotate: 2 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute right-6 top-6 z-40 bg-white border border-black/20 px-4 py-2.5 shadow-xl flex items-center gap-2 cursor-pointer group select-none hover:bg-black hover:border-black transition-colors duration-300"
              >
                <Sparkles className="w-4 h-4 text-black group-hover:text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs font-bold tracking-wider text-black group-hover:text-white uppercase">
                  4K Video • Sound Architecture
                </span>
              </motion.div>

              {/* Primary Image — moves up faster with dynamic rotation & scale */}
              <motion.div
                style={{
                  y: yPrimaryImage,
                  rotate: rotatePrimary,
                  scale: scalePrimary,
                }}
                className="absolute left-0 top-0 w-[85%] h-[80%] bg-black overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-black/10 group cursor-pointer"
              >
                <Image
                  src="/images/music-studio.jpg"
                  alt="Drach Concepts Audio Studio"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-white/70 font-bold">
                    Studio Production
                  </span>
                  <h4 className="text-xl font-medium mt-1 transition-transform duration-300 group-hover:translate-x-1">
                    High-Fidelity Audio Engineering
                  </h4>
                </div>
              </motion.div>

              {/* Secondary Image — drifts in opposite direction with counter-rotation */}
              <motion.div
                style={{ y: ySecondaryImage, rotate: rotateSecondary }}
                className="absolute right-0 bottom-0 w-[58%] h-[60%] bg-white p-2 shadow-[0_25px_50px_rgba(0,0,0,0.2)] border border-black/15 z-20 group cursor-pointer"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="/images/videography.jpg"
                    alt="Drach Concepts Videography"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </motion.div>

              {/* Badge — slowest parallax + hover lift */}
              <motion.div
                style={{ y: yBadge }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0 32px 64px rgba(0,0,0,0.18)",
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="absolute left-6 bottom-12 z-30 bg-white/95 backdrop-blur-md border border-black/15 p-5 shadow-2xl max-w-[15rem] cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-none bg-black text-white flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black uppercase tracking-wider">
                      Drach Concepts
                    </p>
                    <p className="text-[0.6875rem] text-black/50">
                      Est. 2014 • London / Lagos
                    </p>
                  </div>
                </div>
                <p className="text-[0.8125rem] text-black/70 leading-snug">
                  Over 10 years crafting award-winning media and high-end
                  productions.
                </p>
              </motion.div>

              {/* Decorative Corner */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-t-2 border-r-2 border-black/20 pointer-events-none hidden sm:block" />
            </div>
          </motion.div>
        </div>

        {/* ── METRICS BAR — staggered multi-speed parallax depth ── */}
        <motion.div
          style={{ y: yMetrics }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white border border-black/15 p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.04)] mb-24 md:mb-32"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-black/10">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                style={{ y: metricYTransforms[idx] }}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.25 },
                }}
                className={`flex flex-col justify-between cursor-pointer group/metric p-4 -m-4 transition-all duration-300 rounded-sm hover:bg-black/[0.03] select-none ${idx !== 0 ? "pt-6 md:pt-4 md:pl-8 lg:pl-12" : ""}`}
              >
                <div>
                  <span className="text-[3rem] md:text-[3.75rem] font-light leading-none text-black tracking-tight block transition-transform duration-300 group-hover/metric:translate-x-1">
                    {metric.value}
                  </span>
                  <h4 className="text-sm font-semibold tracking-wider uppercase text-black mt-2 transition-colors duration-300 group-hover/metric:text-black">
                    {metric.label}
                  </h4>
                </div>
                <p className="text-xs text-black/50 mt-2 font-normal transition-colors duration-300 group-hover/metric:text-black/75">
                  {metric.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── MANIFESTO BLOCK — deepest parallax layer ── */}
        <motion.div
          style={{ y: yManifesto }}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-black text-white p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl border border-black group/manifesto"
        >
          {/* Parallax Rotating Quote Watermark */}
          <motion.div
            style={{ rotate: rotateQuoteMark }}
            className="absolute -right-8 -bottom-12 text-white/[0.09] text-[20rem] md:text-[28rem] font-serif font-bold pointer-events-none select-none leading-none"
          >
            &ldquo;
          </motion.div>

          {/* Animated ambient glows inside the dark block */}
          <motion.div
            className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
            animate={{
              x: [0, 30, -10, 0],
              y: [0, -20, 10, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"
            animate={{
              x: [0, -20, 30, 0],
              y: [0, 20, -30, 0],
              scale: [1, 0.9, 1.08, 1],
            }}
            transition={{
              duration: 20,
              delay: 5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 text-white/80 mb-6">
              <Zap className="w-5 h-5 text-white/90" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                The Drach Manifesto
              </span>
            </div>

            <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] text-white/95 tracking-tight font-serif italic mb-10">
              &ldquo;We don&apos;t just produce content. We engineer emotional
              resonance, crafting visual and audio experiences that transform
              brands into timeless cultural icons.&rdquo;
            </blockquote>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-8 border-t border-white/15">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border border-white/20 bg-black">
                  <Image
                    src="/images/director.jpg"
                    alt="Creative Director"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    Drach Leadership
                  </p>
                  <p className="text-xs text-white/60">
                    Creative Direction & Executive Producer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <Link href="/portfolio">
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: "#f0f0f0" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white text-black px-8 py-4 text-[0.9375rem] font-medium flex items-center gap-2 group cursor-pointer"
                  >
                    Explore Our Work
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

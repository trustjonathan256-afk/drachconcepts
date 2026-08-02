"use client";

import {
  motion,
  Variants,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Play } from "lucide-react";
import { useRef, useEffect, useState } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────
const projects = [
  {
    id: "featured",
    title: "Echoes of the City",
    category: "Music Video",
    year: "2026",
    image: "/images/project-featured.png",
    tags: ["Creative Direction", "Cinematography", "Color Grading"],
  },
  {
    id: "noir",
    title: "Noir Campaign",
    category: "Brand Campaign",
    year: "2025",
    image: "/images/project-brand.png",
    tags: ["Editorial Photography", "Art Direction"],
  },
  {
    id: "skyline",
    title: "Above the Skyline",
    category: "Aerial Cinematography",
    year: "2025",
    image: "/images/project-aerial.png",
    tags: ["Drone Coverage", "Color Grading"],
  },
];

// ─── Framer Motion Variants ─────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Interactive Mouse Tracking Canvas Component ─────────────────────────────
function InteractiveMouseCanvas({
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
  const trail = useRef<{ x: number; y: number; alpha: number }[]>([]);

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
        90,
        Math.min(200, Math.round((rect.width * rect.height) / 9000))
      );
      particles.current = Array.from({ length: count }, () => {
        const ox = Math.random() * rect.width;
        const oy = Math.random() * rect.height;
        return {
          x: ox,
          y: oy,
          ox,
          oy,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.2 + Math.random() * 2.2,
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
      trail.current = [];
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
        alpha: 0.5,
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

      // ── Spotlight + Precision Reticle ──
      if (smx > 0 && smy > 0) {
        // Soft aura glow
        const grad = ctx.createRadialGradient(smx, smy, 0, smx, smy, 450);
        grad.addColorStop(0, "rgba(0, 0, 0, 0.12)");
        grad.addColorStop(0.35, "rgba(0, 0, 0, 0.04)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(smx, smy, 450, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.strokeStyle = "rgba(0, 0, 0, 0.20)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(smx, smy, 44, 0, Math.PI * 2);
        ctx.stroke();

        // Inner reticle ring
        ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(smx, smy, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair ticks
        const ticks: [number, number][] = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];
        ctx.strokeStyle = "rgba(0, 0, 0, 0.32)";
        ctx.lineWidth = 1;
        for (const [dx, dy] of ticks) {
          ctx.beginPath();
          ctx.moveTo(smx + dx * 26, smy + dy * 26);
          ctx.lineTo(smx + dx * 14, smy + dy * 14);
          ctx.stroke();
        }

        // Center dot
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.beginPath();
        ctx.arc(smx, smy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Cursor Trail ──
      const tr = trail.current;
      for (let i = tr.length - 1; i >= 0; i--) {
        const t = tr[i];
        t.alpha -= 0.04;
        if (t.alpha <= 0) {
          tr.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(0, 0, 0, ${t.alpha * 0.26})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 3.5 * (1 - i / tr.length) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Interactive Particles + Web Lines ──
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
          if (mouseDist < 270) {
            nearMouse = true;
            const force = ((270 - mouseDist) / 270) * 0.14;
            p.x += (dx / (mouseDist || 1)) * force * 24;
            p.y += (dy / (mouseDist || 1)) * force * 24;
          }
        }

        const pulse = Math.sin(now * 1.5 + p.pulseOffset) * 0.5 + 0.5;
        const baseR = p.r + pulse * 1.2;

        ctx.fillStyle = nearMouse
          ? `rgba(0, 0, 0, ${0.25 + (1 - mouseDist / 270) * 0.2})`
          : "rgba(0, 0, 0, 0.14)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, nearMouse ? baseR * 1.35 : baseR, 0, Math.PI * 2);
        ctx.fill();

        // Constellation webs
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            const alphaBase = 0.08 * (1 - dist / 135);
            const illuminated = nearMouse ? alphaBase * 3.2 : alphaBase;
            ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(0.32, illuminated)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // ── Click Ripples ──
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

// ─── High-Impact Featured Card ───────────────────────────────────────────────
function FeaturedCard({ project }: { project: (typeof projects)[0] }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // High travel distance parallax for card image
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-22%", "22%"]);
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.72, 0.48, 0.7]
  );

  return (
    <motion.article
      ref={cardRef}
      custom={1}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative w-full overflow-hidden bg-black cursor-pointer shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-black/10"
      style={{ aspectRatio: "21/9" }}
    >
      {/* High-speed parallax image */}
      <motion.div
        className="absolute inset-0 w-full h-[144%] top-[-22%]"
        style={{ y: imageY }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
        />
      </motion.div>

      {/* Dynamic gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Animated letterbox bars */}
      <motion.div
        className="absolute top-0 inset-x-0 h-8 bg-black z-10 pointer-events-none"
        animate={{ scaleY: hovered ? 0.35 : 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "top" }}
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 h-8 bg-black z-10 pointer-events-none"
        animate={{ scaleY: hovered ? 0.35 : 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "bottom" }}
      />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
        <motion.div
          animate={{ scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-20 border-2 border-white/60 flex items-center justify-center backdrop-blur-md bg-white/10 shadow-2xl"
        >
          <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
        </motion.div>
      </div>

      {/* Info row */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white/60 text-xs font-semibold tracking-[0.25em] uppercase">
              {project.category}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/50 text-xs tracking-widest">
              {project.year}
            </span>
          </div>
          <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-none mb-4">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-white/65 text-xs border border-white/20 px-3 py-1 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/portfolio"
          className="group/cta flex items-center gap-3 text-white font-medium text-sm tracking-wide shrink-0 hover:gap-4 transition-all duration-300"
        >
          <span className="border-b border-white/40 group-hover/cta:border-white pb-0.5 transition-colors duration-300">
            View Case Study
          </span>
          <div className="w-8 h-8 border border-white/40 flex items-center justify-center group-hover/cta:bg-white group-hover/cta:border-white transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 group-hover/cta:text-black transition-colors duration-300" />
          </div>
        </Link>
      </div>
    </motion.article>
  );
}

// ─── High-Impact Grid Card with Column Parallax ──────────────────────────────
function GridCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Inner image high-travel parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);
  
  // Asynchronous column offset (even cards move upward, odd cards move downward on scroll)
  const columnOffset = useTransform(
    scrollYProgress,
    [0, 1],
    index % 2 === 0 ? [70, -70] : [-70, 70]
  );

  return (
    <motion.article
      ref={cardRef}
      custom={2 + index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      style={{ y: columnOffset }}
      className="group relative overflow-hidden bg-black cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-black/10"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <motion.div
          className="absolute inset-0 w-full h-[150%] top-[-25%]"
          style={{ y: imageY }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 group-hover:from-black/75 transition-colors duration-500 pointer-events-none" />

        {/* Arrow chip */}
        <div className="absolute top-5 right-5 z-10 w-9 h-9 border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 backdrop-blur-sm">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>

        {/* Category badge */}
        <div className="absolute top-5 left-5 z-10 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-white/70 uppercase border border-white/20 px-3 py-1 backdrop-blur-sm">
            {project.category}
          </span>
        </div>

        {/* Info */}
        <div className="absolute bottom-0 inset-x-0 z-10 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase">
              {project.category}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-white/40 text-xs">{project.year}</span>
          </div>
          <h3 className="text-white text-xl md:text-2xl font-light tracking-tight leading-snug group-hover:-translate-y-0.5 transition-transform duration-300">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-white/60 text-[0.65rem] border border-white/15 px-2.5 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Multi-speed parallax layers — balanced so top entry is comfortable and smooth
  const yHeader = useTransform(scrollYProgress, [0, 1], [50, -100]);
  const yCardsGroup = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const yBgDots = useTransform(scrollYProgress, [0, 1], ["-10rem", "10rem"]);
  const yBlob1 = useTransform(scrollYProgress, [0, 1], ["-16rem", "16rem"]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], ["14rem", "-14rem"]);

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-16 md:pt-24 pb-28 md:pb-36 relative overflow-hidden border-t border-black/10 selection:bg-black selection:text-white"
    >
      {/* ── Interactive Mouse Canvas Background ── */}
      <InteractiveMouseCanvas sectionRef={sectionRef} />

      {/* ── Parallax Dot Grid ── */}
      <motion.div
        style={{
          y: yBgDots,
          backgroundImage:
            "radial-gradient(#000 0.0625rem, transparent 0.0625rem)",
          backgroundSize: "1rem 1rem",
        }}
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
      />

      {/* ── Parallax Ambient Blobs ── */}
      <motion.div
        style={{ y: yBlob1 }}
        className="absolute -left-20 -top-20 w-[36rem] h-[36rem] rounded-full pointer-events-none"
      >
        <div className="w-full h-full rounded-full bg-gradient-radial from-black/[0.06] to-transparent blur-3xl" />
      </motion.div>
      <motion.div
        style={{ y: yBlob2 }}
        className="absolute -right-20 top-[40%] w-[30rem] h-[30rem] rounded-full pointer-events-none"
      >
        <div className="w-full h-full rounded-full bg-gradient-radial from-black/[0.05] to-transparent blur-3xl" />
      </motion.div>

      <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">

        {/* ── Section Header — High Travel Parallax ───────────────────────────── */}
        <motion.div style={{ y: yHeader }} className="mb-20 md:mb-24">
          {/* Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="h-px w-12 bg-black/40 origin-left"
            />
            <span className="text-xs font-semibold tracking-[0.25em] text-black/50 uppercase">
              Featured Work
            </span>
          </motion.div>

          {/* Title + Tagline */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.75rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5.5rem] font-light tracking-[-0.03em] text-black leading-[1.05]"
            >
              Selected
              <br />
              <span className="font-serif italic font-normal text-black/25">
                Projects.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-sm text-black/60 text-base leading-relaxed lg:text-right"
            >
              Every frame tells a story.
              <br />
              Every project reflects our commitment
              <br />
              to cinematic excellence.
            </motion.p>
          </div>
        </motion.div>

        {/* ── Main Work Grid — Group Parallax ─────────────────────────────────── */}
        <motion.div style={{ y: yCardsGroup }} className="space-y-6 md:space-y-8">
          {/* Featured Full-Width Card */}
          <FeaturedCard project={projects[0]} />

          {/* 2-Column Asynchronous Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4">
            {projects.slice(1).map((p, i) => (
              <GridCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Section Footer CTA ──────────────────────────────────────────────── */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 md:mt-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-black/10"
        >
          <div className="flex items-center gap-6">
            <span className="text-black/40 text-sm font-medium tracking-wide">
              12 projects completed in 2025–2026
            </span>
            <div className="h-px w-8 bg-black/15 hidden sm:block" />
            <span className="text-black/30 text-xs font-medium tracking-widest uppercase hidden sm:block">
              More on the way
            </span>
          </div>

          <Link
            href="/portfolio"
            className="group flex items-center gap-3 text-black font-semibold text-sm tracking-wide hover:gap-4 transition-all duration-300"
          >
            <span className="border-b border-black/30 group-hover:border-black pb-0.5 transition-colors duration-300">
              View All Projects
            </span>
            <div className="w-8 h-8 border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300">
              <ArrowRight className="w-4 h-4 group-hover:text-white transition-colors duration-300" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

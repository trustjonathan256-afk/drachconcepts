"use client";

import {
  motion,
  Variants,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Video,
  Camera,
  Music,
  Sparkles,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  ChevronDown,
  X,
  Sliders,
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

// ─── Expertise Services Data ──────────────────────────────────────────────────
const expertiseItems = [
  {
    id: "01",
    title: "Video & Cinematography",
    icon: Video,
    shortDesc: "High-impact 4K cinematic film, commercials, and aerial production.",
    description:
      "From high-concept music videos to national brand commercials, we handle full-cycle visual production with RED/ARRI cinema cameras and FPV drone operations.",
    capabilities: [
      "4K Cinema Production",
      "Aerial Drone Coverage",
      "Color Grading & VFX",
      "Creative Direction",
    ],
    expandedDetails: {
      workflow: "Concepting → Pre-Production → On-Set Direction → Post-Production & Color",
      gear: "ARRI Alexa Mini LF, RED V-Raptor 8K, DJ I Inspire 3 FPV, Master Anamorphic Primes",
      highlights: "Over 450+ music videos & commercial films produced worldwide.",
    },
  },
  {
    id: "02",
    title: "Editorial & Campaign Photography",
    icon: Camera,
    shortDesc: "Commercial, lookbook, and high-fashion portraiture.",
    description:
      "Crafting iconic imagery for global publications and brands. We design bespoke lighting setups, art direction, and high-end retouching for maximum impact.",
    capabilities: [
      "Editorial & Lookbooks",
      "Studio & Location",
      "Art & Set Direction",
      "Master Retouching",
    ],
    expandedDetails: {
      workflow: "Moodboarding → Casting & Location Scouting → Studio Shoot → High-End Retouch",
      gear: "Hasselblad H6D-100c, Profoto Pro-11 Flash Systems, Medium Format Primes",
      highlights: "Featured in Vogue, GQ, Harper's Bazaar, and global billboards.",
    },
  },
  {
    id: "03",
    title: "Music & Audio Architecture",
    icon: Music,
    shortDesc: "World-class recording, mixing, mastering, and scoring.",
    description:
      "Equipped with premier acoustic recording spaces and analog outboard gear. We engineer original film scores, record artists, and deliver release-ready audio.",
    capabilities: [
      "Recording Studio",
      "Mixing & Mastering",
      "Original Film Scoring",
      "Immersive Sound Design",
    ],
    expandedDetails: {
      workflow: "Acoustic Capture → Analog Processing → Multi-Stem Mixing → Dolby Atmos Master",
      gear: "Neve 8424 Console, SSL Bus Compressors, Neumann U87, Pro Tools HDX",
      highlights: "Platinum-certified mixing engineers & award-winning film scorers.",
    },
  },
  {
    id: "04",
    title: "Brand Identity & Digital Media",
    icon: Sparkles,
    shortDesc: "Strategic positioning, visual identity, and campaign collateral.",
    description:
      "Defining how visionary brands communicate visually and sonically across platforms. We build unified design systems and high-converting digital assets.",
    capabilities: [
      "Brand Strategy",
      "Visual Identity Systems",
      "Digital Campaigns",
      "Interactive Content",
    ],
    expandedDetails: {
      workflow: "Brand Audit → Visual Architecture → System Guidelines → Campaign Rollout",
      gear: "Figma, Adobe Creative Cloud, Cinema 4D, Custom Motion Graphics Engines",
      highlights: "Empowered 180+ brands with distinctive visual & sonic identities.",
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

// ─── Interactive Mouse Canvas ───────────────────────────────────────────────
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
        maxRadius: 175,
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
      }

      const smx = smoothMouse.current.x;
      const smy = smoothMouse.current.y;
      const now = performance.now() / 1000;

      // Spotlight & crosshair reticle
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

// ─── Expertise Card Component with Rich Click & Hover Transitions ────────────
function ExpertiseCard({
  item,
  index,
  isSelected,
  onToggleSelect,
}: {
  item: (typeof expertiseItems)[0];
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
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onToggleSelect}
      className={`group relative bg-white border p-8 md:p-10 flex flex-col justify-between cursor-pointer transition-all duration-400 select-none overflow-hidden ${
        isSelected
          ? "border-black shadow-[0_30px_70px_rgba(0,0,0,0.14)] ring-1 ring-black"
          : "border-black/10 hover:border-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.09)]"
      }`}
    >
      {/* Top accent line with spring expansion */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-black origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isSelected || hovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Top row: Number + Icon + Expand Arrow */}
      <div>
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ color: hovered || isSelected ? "#000000" : "rgba(0,0,0,0.4)" }}
              className="text-xs font-bold tracking-widest uppercase transition-colors"
            >
              {item.id}
            </motion.span>
            <motion.div
              animate={{
                backgroundColor: isSelected || hovered ? "#000000" : "rgba(0,0,0,0.05)",
                color: isSelected || hovered ? "#ffffff" : "#000000",
                rotate: hovered ? [0, -8, 8, 0] : 0,
              }}
              transition={{ duration: 0.35 }}
              className="w-12 h-12 flex items-center justify-center shadow-sm"
            >
              <IconComponent className="w-5 h-5 transition-transform duration-300" />
            </motion.div>
          </div>

          {/* Interactive Toggle Pill Button */}
          <motion.div
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{
              backgroundColor: isSelected ? "#000000" : "rgba(0, 0, 0, 0)",
              color: isSelected ? "#ffffff" : "#000000",
              rotate: isSelected ? 45 : hovered ? 45 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="w-9 h-9 border border-black/20 flex items-center justify-center text-black"
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h3
          animate={{ x: hovered || isSelected ? 4 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl md:text-3xl font-light tracking-tight text-black mb-4"
        >
          {item.title}
        </motion.h3>

        {/* Description */}
        <p className="text-black/65 text-base leading-relaxed mb-6 font-normal">
          {item.description}
        </p>
      </div>

      {/* Capability deliverables chips */}
      <div className="pt-6 border-t border-black/10 mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-black/40 uppercase block">
            Key Deliverables
          </span>
          <span className="text-[0.65rem] font-medium tracking-wider text-black/40 group-hover:text-black transition-colors">
            {isSelected ? "Click to collapse" : "Click for deep dive"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {item.capabilities.map((cap) => (
            <motion.div
              key={cap}
              whileHover={{ x: 3, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-black/40 group-hover:text-black shrink-0 transition-colors" />
              <span className="text-xs font-medium text-black/75 group-hover:text-black transition-colors">
                {cap}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── ON CLICK EXPANDED DETAILS (In-depth Drawer) ── */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black pt-6 bg-black/[0.02] -mx-8 md:-mx-10 -mb-8 md:-mb-10 p-8 md:p-10"
          >
            <div className="space-y-4">
              <div>
                <span className="text-[0.625rem] font-bold tracking-widest uppercase text-black/50 block mb-1">
                  Production Workflow
                </span>
                <p className="text-xs font-semibold text-black leading-relaxed">
                  {item.expandedDetails.workflow}
                </p>
              </div>

              <div>
                <span className="text-[0.625rem] font-bold tracking-widest uppercase text-black/50 block mb-1">
                  Camera & Technical Gear
                </span>
                <p className="text-xs font-medium text-black/80 leading-relaxed">
                  {item.expandedDetails.gear}
                </p>
              </div>

              <div>
                <span className="text-[0.625rem] font-bold tracking-widest uppercase text-black/50 block mb-1">
                  Proven Track Record
                </span>
                <p className="text-xs font-medium text-black/80 leading-relaxed">
                  {item.expandedDetails.highlights}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-black/10">
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: "#000000" }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-black text-white px-5 py-2.5 text-xs font-medium tracking-wider uppercase flex items-center gap-2 shadow-md"
                >
                  Book {item.title.split(" ")[0]}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.96 }}
                  className="text-xs font-medium tracking-wider uppercase text-black flex items-center gap-1.5 hover:text-black/60 transition-colors"
                >
                  View Case Studies
                  <ExternalLink className="w-3.5 h-3.5 text-black/50" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Export Component ───────────────────────────────────────────────────
export default function ExpertiseSection() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets
  const yHeader = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const yGrid = useTransform(scrollYProgress, [0, 1], [20, -40]);
  const yBgDots = useTransform(scrollYProgress, [0, 1], ["-12rem", "12rem"]);

  const toggleSelectCard = (id: string) => {
    if (selectedCard === id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(id);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-20 md:pt-28 pb-28 md:pb-36 relative overflow-hidden border-t border-black/10 selection:bg-black selection:text-white"
    >
      {/* Interactive Mouse Tracking Canvas */}
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
              OUR EXPERTISE
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
                Creative solutions <br />
                crafted for{" "}
                <span className="font-serif italic font-normal text-black/25">
                  ambitious brands.
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
                We combine strategy, storytelling, and technical excellence to
                produce work that leaves a lasting impression.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Expertise 2x2 Grid ── */}
        <motion.div
          style={{ y: yGrid }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start"
        >
          {expertiseItems.map((item, index) => (
            <ExpertiseCard
              key={item.id}
              item={item}
              index={index}
              isSelected={selectedCard === item.id}
              onToggleSelect={() => toggleSelectCard(item.id)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

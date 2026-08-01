"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight, ArrowRight, Play } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const featuredProject = {
  title: "Echoes of the City",
  category: "Music Video",
  year: "2026",
  image: "/images/project-featured.png",
  tags: ["Creative Direction", "Cinematography", "Editing"],
};

const gridProjects = [
  {
    title: "Noir Campaign",
    category: "Brand Campaign",
    year: "2025",
    image: "/images/project-brand.png",
    tags: ["Editorial Photography", "Art Direction"],
  },
  {
    title: "Above the Skyline",
    category: "Aerial Cinematography",
    year: "2025",
    image: "/images/project-aerial.png",
    tags: ["Drone Coverage", "Color Grading"],
  },
];

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Featured Card ─────────────────────────────────────────────────────────────
function FeaturedCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [0.72, 0.55, 0.68],
  );

  return (
    <motion.div
      ref={cardRef}
      custom={2}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="group relative w-full overflow-hidden rounded-2xl bg-black cursor-pointer"
      style={{ aspectRatio: "16/8" }}
    >
      {/* Parallax image */}
      <motion.div
        className="absolute inset-0 w-full h-[120%] top-[-10%]"
        style={{ y: imageY }}
      >
        <Image
          src={featuredProject.image}
          alt={featuredProject.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      </motion.div>

      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-black/70 z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-black/70 z-10 pointer-events-none" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
        <div className="w-20 h-20 rounded-full border-2 border-white/60 flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:scale-110 transition-transform duration-300">
          <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase">
              {featuredProject.category}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-white/50 text-xs tracking-[0.15em]">
              {featuredProject.year}
            </span>
          </div>
          <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-none mb-4">
            {featuredProject.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {featuredProject.tags.map((tag) => (
              <span
                key={tag}
                className="text-white/60 text-xs border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <a
          href="#"
          className="group/btn flex items-center gap-3 text-white font-semibold text-sm tracking-wide shrink-0 hover:gap-4 transition-all duration-300"
        >
          <span className="border-b border-white/40 group-hover/btn:border-white pb-0.5 transition-colors duration-300">
            View Case Study
          </span>
          <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:border-white transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 group-hover/btn:text-black transition-colors duration-300" />
          </div>
        </a>
      </div>
    </motion.div>
  );
}

// ─── Grid Card ─────────────────────────────────────────────────────────────────
function GridCard({
  project,
  index,
}: {
  project: (typeof gridProjects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div
      ref={cardRef}
      custom={3 + index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="group relative overflow-hidden rounded-2xl bg-black cursor-pointer"
      style={{ aspectRatio: "4/3" }}
    >
      {/* Parallax image */}
      <motion.div
        className="absolute inset-0 w-full h-[120%] top-[-10%]"
        style={{ y: imageY }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-colors duration-500" />

      {/* Ring glow on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/0 group-hover:ring-white/20 transition-all duration-500 pointer-events-none z-10" />

      {/* Arrow */}
      <div className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-10 backdrop-blur-sm">
        <ArrowUpRight className="w-4 h-4 text-white" />
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-7">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white/50 text-xs font-semibold tracking-[0.18em] uppercase">
            {project.category}
          </span>
          <span className="text-white/30 text-xs">•</span>
          <span className="text-white/40 text-xs">{project.year}</span>
        </div>
        <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight leading-tight mb-3 group-hover:-translate-y-0.5 transition-transform duration-300">
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-white/55 text-[0.65rem] border border-white/15 rounded-full px-2.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], ["5rem", "-5rem"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4rem", "4rem"]);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-24 md:py-32 relative overflow-hidden border-t border-black/10 selection:bg-black selection:text-white"
    >
      {/* Subtle dot grid bg */}
      <motion.div
        style={{
          y: bgY,
          backgroundImage: "radial-gradient(#000 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
      />

      <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* ── Section Header ──────────────────────────────────────── */}
        <motion.div style={{ y: headerY }} className="mb-16 md:mb-20">
          {/* Eyebrow */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
              className="h-px w-12 bg-black origin-left"
            />
            <span className="text-xs font-semibold tracking-[0.25em] text-black/40 uppercase">
              Featured Work
            </span>
          </motion.div>

          {/* Title + tagline */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-black leading-[1.05]"
            >
              Selected
              <br />
              <span className="text-black/20">Projects</span>
            </motion.h2>

            <motion.p
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-sm text-black/50 text-base leading-relaxed lg:text-right"
            >
              Every frame tells a story.
              <br />
              Every project reflects our commitment
              <br />
              to cinematic excellence.
            </motion.p>
          </div>
        </motion.div>

        {/* ── Featured Large Card ──────────────────────────────────── */}
        <div className="mb-5 md:mb-6">
          <FeaturedCard />
        </div>

        {/* ── 2-Col Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-14 md:mb-16">
          {gridProjects.map((project, i) => (
            <GridCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* ── View All CTA ─────────────────────────────────────────── */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center justify-between border-t border-black/10 pt-8"
        >
          <span className="text-black/30 text-sm font-medium tracking-wide">
            12 projects completed in 2025–2026
          </span>
          <a
            href="#"
            className="group flex items-center gap-3 text-black font-semibold text-sm tracking-wide hover:gap-4 transition-all duration-300"
          >
            <span className="border-b border-black/30 group-hover:border-black pb-0.5 transition-colors duration-300">
              View All Projects
            </span>
            <div className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300">
              <ArrowRight className="w-4 h-4 group-hover:text-white transition-colors duration-300" />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

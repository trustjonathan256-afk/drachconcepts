import Navbar from "@/components/Navbar";
import FeaturedWorkSection from "@/components/FeaturedWorkSection";
import CtaFooterSection from "@/components/CtaFooterSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Film } from "lucide-react";

export const metadata = {
  title: "Portfolio | Drach Concepts",
  description: "Browse selected portfolio projects, music videos, commercial campaigns, and editorial photography by Drach Concepts.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      
      {/* Modern Left-Aligned Split Hero Banner with Image */}
      <section className="bg-black text-white py-20 lg:py-28 px-6 md:px-12 lg:px-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTAs (Left Aligned) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-6">
              <Film className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold tracking-[0.2em] text-white/90 uppercase">
                Curated Case Studies & Gallery
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.04] mb-8 text-white">
              Cinematic Stories. <br />
              <span className="font-serif italic text-white/50">Masterful</span> <br />
              Executions.
            </h1>
            
            <p className="text-white/70 max-w-xl text-lg md:text-xl leading-relaxed font-light mb-10">
              A curated archive of commercial campaigns, music videos, editorial photography, and sound productions crafted for visionary global clients.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link href="/booking">
                <button className="bg-white text-black px-8 py-4 text-sm font-semibold tracking-wider uppercase flex items-center gap-2 hover:bg-white/90 transition-colors shadow-lg cursor-pointer">
                  Commission Project <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: High-Impact Photography Showcase */}
          <div className="lg:col-span-5 relative h-[28rem] sm:h-[34rem] w-full border border-white/15 overflow-hidden shadow-2xl group">
            <Image
              src="/images/project-featured.png"
              alt="Echoes of the City Project Feature"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-white/60 block mb-1">
                Featured Production 2026
              </span>
              <p className="text-sm font-medium text-white">
                Echoes of the City — Music Video & Visual Concept
              </p>
            </div>
          </div>

        </div>
      </section>

      <FeaturedWorkSection />
      <CtaFooterSection />
    </main>
  );
}

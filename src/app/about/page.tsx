import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import TrustedBySection from "@/components/TrustedBySection";
import CtaFooterSection from "@/components/CtaFooterSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";

export const metadata = {
  title: "About Us | Drach Concepts",
  description: "Learn about Drach Concepts, our studio origins, team leadership, creative philosophy, and global achievements.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      
      {/* Modern Left-Aligned Split Hero Banner with Image */}
      <section className="bg-black text-white py-20 lg:py-28 px-6 md:px-12 lg:px-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTAs (Left Aligned) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-6">
              <Compass className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold tracking-[0.2em] text-white/90 uppercase">
                Studio Philosophy & Origins
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.04] mb-8 text-white">
              Crafting Timeless <br />
              <span className="font-serif italic text-white/50">Cultural</span> <br />
              Icons.
            </h1>
            
            <p className="text-white/70 max-w-xl text-lg md:text-xl leading-relaxed font-light mb-10">
              Drach Concepts is an award-winning creative media powerhouse specializing in commercial videography, high-fashion photography, sound architecture, and brand direction.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link href="/booking">
                <button className="bg-white text-black px-8 py-4 text-sm font-semibold tracking-wider uppercase flex items-center gap-2 hover:bg-white/90 transition-colors shadow-lg cursor-pointer">
                  Start a Conversation <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/contact" className="text-sm font-medium text-white/80 hover:text-white border-b border-white/30 pb-0.5 transition-colors">
                Contact Leadership &rarr;
              </Link>
            </div>
          </div>

          {/* Right Column: High-Impact Director Image */}
          <div className="lg:col-span-5 relative h-[28rem] sm:h-[34rem] w-full border border-white/15 overflow-hidden shadow-2xl group">
            <Image
              src="/images/michael-soledad-jiOByhCw2jE-unsplash.jpg"
              alt="Creative Direction Leadership"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-white/60 block mb-1">
                Executive Leadership
              </span>
              <p className="text-sm font-medium text-white">
                Creative Direction & Global Production Operations
              </p>
            </div>
          </div>

        </div>
      </section>

      <AboutSection />
      <TrustedBySection />
      <CtaFooterSection />
    </main>
  );
}

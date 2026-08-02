"use client";

import Navbar from "@/components/Navbar";
import CtaFooterSection from "@/components/CtaFooterSection";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Sparkles, DollarSign, Calendar } from "lucide-react";
import Image from "next/image";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BookingForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "Video Production";
  const initialPhase = searchParams.get("phase") || "";

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: initialService,
    budget: "$5,000 - $10,000",
    location: "Studio Production",
    timeline: "Within 1 Month",
    notes: initialPhase ? `Interested in starting phase: ${initialPhase}` : "",
  });

  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsBooked(true);
  };

  const services = [
    "Video Production",
    "Photography",
    "Creative Direction",
    "Music Production",
    "Drone Coverage",
    "Event Coverage",
    "Full Brand Campaign",
  ];

  const budgetOptions = [
    "< $1,000",
    "$1,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000+",
  ];

  return (
    <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-16 py-20 text-left">
      {isBooked ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black text-white p-10 md:p-16 text-left max-w-3xl border border-white/10 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-white/50 mb-2 block">
            Booking Confirmed
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
            Project Request Received
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-8 font-light">
            Thank you <span className="text-white font-medium">{formData.name}</span>. Our lead producer will review your requirements for <span className="text-white font-medium">{formData.service}</span> and reach out within 24 hours to schedule your consultation.
          </p>
          <button
            onClick={() => setIsBooked(false)}
            className="bg-white text-black px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors cursor-pointer"
          >
            Submit Another Request
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-black/5 border border-black/10 p-8 sm:p-14 lg:p-20 text-left">
          <div className="max-w-4xl">
            <div className="mb-12">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/50 block mb-2">
                Step 1 of 2
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight">
                Select Service & Budget
              </h2>
            </div>

            {/* Service Options */}
            <div className="mb-10">
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-black" /> Primary Service
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {services.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setFormData({ ...formData, service: s })}
                    className={`p-4 text-xs font-semibold tracking-wider uppercase border text-left cursor-pointer transition-all ${
                      formData.service === s
                        ? "bg-black text-white border-black shadow-md"
                        : "bg-white text-black/80 border-black/15 hover:border-black/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Options */}
            <div className="mb-12">
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-black" /> Estimated Budget Range
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {budgetOptions.map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setFormData({ ...formData, budget: b })}
                    className={`p-4 text-xs font-semibold tracking-wider uppercase border text-center cursor-pointer transition-all ${
                      formData.budget === b
                        ? "bg-black text-white border-black shadow-md"
                        : "bg-white text-black/80 border-black/15 hover:border-black/50"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-black/10 mb-12">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/50 block mb-2">
                Step 2 of 2
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight mb-8">
                Your Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="Brand Studio Co."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@brand.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+256 700 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                  Project Details & Scope Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your creative goals, shoot locations, target deliverables, or deadline details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-black text-white py-6 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-3 shadow-2xl hover:bg-black/90 transition-colors cursor-pointer"
              >
                Submit Project Request <ArrowUpRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-20">
      <Navbar />

      {/* Modern Left-Aligned Split Hero Banner with Image */}
      <section className="bg-black text-white py-20 lg:py-28 px-6 md:px-12 lg:px-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTAs (Left Aligned) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-6">
              <Calendar className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold tracking-[0.2em] text-white/90 uppercase">
                Reserve Studio & Production Time
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.04] mb-8 text-white">
              Book Your <br />
              <span className="font-serif italic text-white/50">Next</span> <br />
              Production.
            </h1>
            
            <p className="text-white/70 max-w-xl text-lg md:text-xl leading-relaxed font-light mb-10">
              Select your required production disciplines, budget parameters, and timeline to initiate project planning with our executive producers.
            </p>
          </div>

          {/* Right Column: High-Impact Equipment Photo */}
          <div className="lg:col-span-5 relative h-[24rem] sm:h-[30rem] w-full border border-white/15 overflow-hidden shadow-2xl group">
            <Image
              src="/images/hero-camera2.jpg"
              alt="Drach Concepts Cinema Camera Rig"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-white/60 block mb-1">
                Direct Scheduling
              </span>
              <p className="text-sm font-medium text-white">
                Fast-track onboarding for commercial & artist clients
              </p>
            </div>
          </div>

        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-left px-6 text-black/50">Loading booking form...</div>}>
        <BookingForm />
      </Suspense>

      <CtaFooterSection />
    </main>
  );
}

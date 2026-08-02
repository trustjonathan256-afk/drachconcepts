"use client";

import Navbar from "@/components/Navbar";
import CtaFooterSection from "@/components/CtaFooterSection";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    service: "Video Production",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        service: "Video Production",
        message: "",
      });
    }, 500);
  };

  return (
    <main className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      
      {/* Modern Left-Aligned Split Hero Banner with Image */}
      <section className="bg-black text-white py-20 lg:py-28 px-6 md:px-12 lg:px-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTAs (Left Aligned) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-6">
              <MessageSquare className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold tracking-[0.2em] text-white/90 uppercase">
                Direct Inquiries & Executive Contact
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.04] mb-8 text-white">
              Initiate Your <br />
              <span className="font-serif italic text-white/50">Creative</span> <br />
              Project.
            </h1>
            
            <p className="text-white/70 max-w-xl text-lg md:text-xl leading-relaxed font-light mb-10">
              Have a vision for your commercial campaign, music production, or editorial shoot? Get in touch with our studio executive team directly.
            </p>
          </div>

          {/* Right Column: Studio Environment Image */}
          <div className="lg:col-span-5 relative h-[24rem] sm:h-[30rem] w-full border border-white/15 overflow-hidden shadow-2xl group">
            <Image
              src="/images/music-studio.jpg"
              alt="Drach Concepts Studio Facility"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10">
              <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-white/60 block mb-1">
                Response Guarantee
              </span>
              <p className="text-sm font-medium text-white">
                All production inquiries answered within 24 hours
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="py-24 px-6 md:px-12 lg:px-16 max-w-[100rem] mx-auto text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/50 block mb-3">
                Studio Information
              </span>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8 text-black">
                Let&apos;s build visual excellence together.
              </h2>
              <p className="text-black/70 text-base leading-relaxed mb-10 font-normal max-w-md">
                Whether you need commercial videography, high-end photography, drone coverage, or sound architecture, we respond to all inquiries within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-black/5 border border-black/10">
                  <MapPin className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Main Studio Headquarters
                    </h3>
                    <p className="text-sm text-black/70">
                      Kampala, Uganda • Global Operations Worldwide
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-black/5 border border-black/10">
                  <Mail className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Direct Email
                    </h3>
                    <a
                      href="mailto:contact@drachconcepts.com"
                      className="text-sm text-black hover:underline font-semibold"
                    >
                      contact@drachconcepts.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-black/5 border border-black/10">
                  <Phone className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-1">
                      Studio Direct Line
                    </h3>
                    <a
                      href="tel:+256700000000"
                      className="text-sm text-black hover:underline font-semibold"
                    >
                      +256 700 000 000
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-black/5 border border-black/10 p-8 sm:p-12">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-start text-left gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-black">Message Sent Successfully!</h3>
                <p className="text-black/70 max-w-md">
                  Thank you for reaching out to Drach Concepts. Our creative production team will review your inquiry and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 bg-black text-white px-8 py-3 text-xs font-semibold tracking-wider uppercase hover:bg-black/85 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <h3 className="text-2xl font-light text-black mb-6">Send Us a Direct Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                      Primary Service Interest
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black transition-colors cursor-pointer"
                    >
                      <option value="Video Production">Video Production</option>
                      <option value="Photography">Photography</option>
                      <option value="Music Production">Music Production</option>
                      <option value="Creative Direction">Creative Direction</option>
                      <option value="Drone Coverage">Drone Coverage</option>
                      <option value="Event Coverage">Event Coverage</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-2">
                    Project Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your project vision, timeline, and goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-black/20 p-4 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-black text-white py-5 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:bg-black/90 transition-colors cursor-pointer"
                >
                  Send Message <Send className="w-4 h-4" />
                </motion.button>
              </form>
            )}
          </div>

        </div>
      </section>

      <CtaFooterSection />
    </main>
  );
}

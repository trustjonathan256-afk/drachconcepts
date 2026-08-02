"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
  ];

  const pageDropdownLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Process", href: "/process" },
    { label: "Contact Us", href: "/contact" },
    { label: "Book Project", href: "/booking" },
  ];

  const allMobileLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About Us", href: "/about" },
    { label: "Process", href: "/process" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-black/15 shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-3"
            : "bg-white/70 backdrop-blur-sm border-b border-black/5 py-5"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 max-w-[100rem] mx-auto">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer group select-none"
          >
            <motion.div
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[2.78rem] md:h-[3.71rem] lg:h-[4.33rem] w-auto group-hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/images/drash_logo.png"
                alt="Drach Concepts Logo"
                width={216}
                height={67}
                className="h-full w-auto object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Center Desktop Links */}
          <nav className="hidden lg:flex items-center gap-10 text-[0.9375rem] font-medium text-black/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/" && pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`relative cursor-pointer hover:text-black transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-[0.09375rem] after:bg-black after:transition-all after:duration-300 ${
                    isActive ? "text-black after:w-full font-semibold" : "after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Pages Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsPagesDropdownOpen(true)}
              onMouseLeave={() => setIsPagesDropdownOpen(false)}
            >
              <button
                className="relative cursor-pointer flex items-center gap-1 hover:text-black transition-colors duration-200 py-1"
                aria-expanded={isPagesDropdownOpen}
              >
                Pages <ChevronDown className={`w-4 h-4 text-black/40 transition-transform duration-200 ${isPagesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isPagesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-black/10 shadow-xl py-2 z-50"
                  >
                    {pageDropdownLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-black/80 hover:text-black hover:bg-black/5 transition-colors"
                        onClick={() => setIsPagesDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Actions (Desktop & Mobile trigger) */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/booking">
                <motion.button
                  animate={{ scale: isScrolled ? 0.95 : 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: isScrolled ? 0.97 : 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer bg-black text-white px-6 py-2.5 md:py-3 text-[0.9375rem] font-medium flex items-center gap-2 hover:bg-black/80 transition-colors shadow-md hover:shadow-xl"
                >
                  Book Project{" "}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "rgba(0,0,0,0.06)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden cursor-pointer w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/20 flex items-center justify-center transition-colors text-black z-50"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white border-l border-black/10 p-8 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between pb-8 mb-8 border-b border-black/10">
                  <Link
                    href="/"
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleLogoClick(e);
                    }}
                  >
                    <Image
                      src="/images/drash_logo.png"
                      alt="Drach Concepts Logo"
                      width={160}
                      height={50}
                      className="h-8 w-auto object-contain cursor-pointer"
                    />
                  </Link>
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-6">
                  {allMobileLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={(e) => {
                          setIsMobileMenuOpen(false);
                          if (link.href === "/" && pathname === "/") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className={`text-xl font-medium transition-colors flex items-center justify-between ${
                          isActive ? "text-black font-semibold" : "text-black/70 hover:text-black"
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-black" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile CTA */}
              <div className="pt-8 border-t border-black/10 flex flex-col gap-4">
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-black text-white text-center py-4 text-base font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-black/90 transition-colors"
                >
                  Book Project <ArrowUpRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-center text-black/50 tracking-wider uppercase">
                  Kampala, Uganda • Worldwide
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

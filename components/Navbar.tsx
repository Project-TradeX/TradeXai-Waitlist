"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string, label: string) => {
    setMobileMenuOpen(false);
    analytics.trackCtaClick(`nav_${label.toLowerCase()}`, "navbar");
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      window.scrollTo({ top: elementRect - bodyRect - offset, behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Vision", id: "why-tradex" },
    { label: "Roadmap", id: "roadmap" },
    { label: "Community", id: "community" },
    { label: "Updates", id: "newsletter" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-obsidian-950/80 border-b border-white/[0.04] backdrop-blur-xl" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("hero", "Logo")}
          className="flex items-center gap-2.5 group bg-transparent border-none cursor-pointer shrink-0"
        >
          <img src="/logo.png" alt="TradeXai Logo" className="h-10 w-auto object-contain shrink-0 opacity-100 group-hover:opacity-90 transition-opacity" />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.id, link.label)}
              className="relative text-[13px] font-medium text-white/50 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none uppercase tracking-wider font-sans group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => handleNavClick("waitlist", "Join Waitlist")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border-none bg-white text-black text-[12px] uppercase tracking-widest hover:bg-white/90 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-[0.97] transition-all duration-200 cursor-pointer font-sans font-semibold shadow-sm"
          >
            Request Access
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-16 left-0 right-0 z-40 bg-obsidian-950 border-b border-white/[0.04] flex flex-col md:hidden"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.id, link.label)}
              className="text-left text-sm font-medium py-2 border-b border-white/[0.04] text-foreground/75 hover:text-accent-primary transition-colors bg-transparent"
            >
              {link.label}
            </button>
          ))}



            <button
              onClick={() => handleNavClick("waitlist", "Join Waitlist Mobile")}
              className="w-full mt-2 py-3 border border-white/10 bg-white/5 text-white text-[11px] uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer font-sans font-medium"
            >
              Request Access
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}

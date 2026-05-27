"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    analytics.trackCtaClick(`toggle_theme_${nextTheme}`, "navbar");
  };

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
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      {/* Glass pill navbar — exact match to reference image with highly frosted glass effect */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex items-center justify-between gap-6 px-5 py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? "border border-glass-border-strong bg-glass-bg-strong shadow-[0_4px_32px_rgba(0,0,0,0.15)]"
            : "border border-glass-border bg-glass-bg"
        }`}
        style={{
          minWidth: "min(720px, 94vw)",
          backdropFilter: scrolled ? "blur(32px) saturate(210%)" : "blur(24px) saturate(180%)",
          WebkitBackdropFilter: scrolled ? "blur(32px) saturate(210%)" : "blur(24px) saturate(180%)",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNavClick("hero", "Logo")}
          className="flex items-center gap-2 group bg-transparent border-none cursor-pointer shrink-0"
        >
          {/* Diamond icon like reference image */}
          <div className="w-6 h-6 rotate-45 rounded-sm bg-emerald-accent/15 border border-emerald-accent/40 flex items-center justify-center group-hover:border-emerald-accent group-hover:bg-emerald-accent/25 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-emerald-accent group-hover:shadow-[0_0_8px_var(--accent-primary)] transition-all" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight group-hover:text-emerald-accent transition-colors">
            Trade<span className="text-emerald-accent">X</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.id, link.label)}
              className="text-[13px] font-medium text-foreground/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA — matching image: teal pill with arrow */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-glass-border bg-glass-bg hover:bg-foreground/5 hover:border-glass-border-strong text-foreground/70 hover:text-foreground transition-all duration-300 cursor-pointer flex items-center justify-center"
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-emerald-accent" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-accent" />
            )}
          </button>

          <button
            onClick={() => handleNavClick("waitlist", "Join Waitlist")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-accent text-black font-semibold text-[12px] tracking-wide hover:bg-emerald-accent/90 hover:shadow-[0_0_20px_rgba(0,191,165,0.35)] transition-all duration-300 cursor-pointer"
          >
            Join Waitlist
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg text-foreground/75 hover:text-emerald-accent transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-16 left-4 right-4 z-40 p-5 rounded-2xl border border-glass-border-strong bg-glass-bg-strong flex flex-col gap-4 md:hidden"
          style={{
            backdropFilter: "blur(32px) saturate(210%)",
            WebkitBackdropFilter: "blur(32px) saturate(210%)",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.id, link.label)}
              className="text-left text-sm font-medium py-2 border-b border-glass-border text-foreground/75 hover:text-emerald-accent transition-colors bg-transparent"
            >
              {link.label}
            </button>
          ))}

          {/* Mobile Theme Selector */}
          <div className="flex items-center justify-between py-2 border-b border-glass-border">
            <span className="text-sm font-medium text-foreground/70">Theme</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-full border border-glass-border bg-glass-bg hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-all duration-300 cursor-pointer flex items-center gap-2"
              style={{
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
              }}
            >
              {!mounted ? (
                <div className="w-4 h-4" />
              ) : resolvedTheme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-emerald-accent" />
                  <span className="text-xs">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-emerald-accent" />
                  <span className="text-xs">Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => handleNavClick("waitlist", "Join Waitlist Mobile")}
            className="w-full py-3 rounded-full bg-emerald-accent text-black font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            Join Waitlist <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </header>
  );
}

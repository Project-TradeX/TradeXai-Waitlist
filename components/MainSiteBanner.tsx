"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe } from "lucide-react";

export default function MainSiteBanner() {
  return (
    <section className="w-full py-10 px-3 md:px-5 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-primary/[0.015] to-transparent pointer-events-none" />

      <motion.a
        href="https://tradexai.tech"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.012, borderColor: "rgba(37,99,235,0.5)" }}
        className="group relative max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-white/[0.07] glass-panel px-8 py-7 cursor-pointer transition-colors duration-300 no-underline card-inset-highlight"
      >
        {/* Top shimmer line on hover */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

        {/* Left side — icon + text */}
        <div className="flex items-center gap-5">
          {/* Animated globe icon */}
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-12 h-12 rounded-xl bg-accent-primary/5 border border-accent-primary/15 flex items-center justify-center text-accent-primary shrink-0 group-hover:bg-accent-primary/12 group-hover:border-accent-primary/40 transition-all duration-300"
          >
            <Globe className="w-5 h-5" />
          </motion.div>

          <div className="text-left">
            <p className="text-[10px] font-bold text-accent-primary/70 uppercase tracking-widest font-ui mb-1">
              Official Platform
            </p>
            <h3 className="text-base font-semibold text-white font-display tracking-tight leading-snug">
              Explore the full TradeXai platform
            </h3>
            <p className="text-xs text-foreground/50 font-sans mt-0.5">
              Visit{" "}
              <span className="text-accent-primary/80 font-medium">tradexai.tech</span>{" "}
              — our main product website
            </p>
          </div>
        </div>

        {/* Right side — CTA pill */}
        <div className="flex items-center gap-2.5 shrink-0 bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-2.5 group-hover:bg-accent-primary group-hover:border-accent-primary transition-all duration-300">
          <span className="text-[12px] font-semibold text-white uppercase tracking-widest font-ui whitespace-nowrap">
            Go to Main Site
          </span>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowUpRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </motion.a>
    </section>
  );
}

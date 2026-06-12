"use client";

import { motion } from "framer-motion";
import { EyeOff, AlertCircle, Cpu } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function WhyTradeXai() {
  const cards = [
    {
      icon: EyeOff,
      title: "Information Filtration",
      subtitle: "Erase Market Noise",
      description:
        "Synthesize complex market inputs into actionable, high-conviction briefs. Eliminate the noise and focus exclusively on data that aligns with your rules.",
      label: "EFFICIENCY",
      metric: "95% Noise Reduction",
    },
    {
      icon: AlertCircle,
      title: "Execution Psychology",
      subtitle: "Control Behavioral Drift",
      description:
        "Map your trading execution to psychological states. Automatically isolate loss-inducing behavioral patterns, emotional over-sizing, and panic liquidations before they erode capital.",
      label: "INTELLIGENCE",
      metric: "Real-Time Bias Auditing",
    },
    {
      icon: Cpu,
      title: "Unified Workflow",
      subtitle: "Consolidate Execution Space",
      description:
        "Replace scattered spreadsheets, chat channels, and manual journals. TradeXai integrates pre-trade compliance, live psychological metrics, and post-trade audits into one professional interface.",
      label: "STRUCTURE",
      metric: "Unified Workspace",
    },
  ];

  return (
    <section
      id="why-tradex"
      className="py-24 max-w-7xl mx-auto px-3 md:px-5 relative overflow-hidden"
    >
      {/* Ambient glass background blob */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-primary/[0.025] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-accent-primary/[0.015] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center space-y-4"
      >
        <span className="font-ui text-xs font-bold text-accent-primary tracking-widest uppercase bg-accent-primary/5 px-3.5 py-1.5 rounded-full border border-accent-primary/10 animate-border-glow">
          SYSTEMIC BOTTLENECKS
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display">
          Designed for the{" "}
          <span className="text-shimmer">Disciplined Investor</span>
        </h2>
        <p className="text-foreground/60 max-w-xl font-sans text-sm md:text-base">
          While traditional platforms attempt to predict market movements,
          TradeXai helps you control the only variable that guarantees
          long-term performance: your own decision execution.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              whileHover={{ y: -8, borderColor: "rgba(37, 99, 235, 0.45)" }}
              className="card-inset-highlight relative rounded-2xl border border-white/[0.06] glass-panel p-8 flex flex-col justify-between group transition-all duration-300"
              style={{ willChange: "transform" }}
            >
              {/* Corner gradient accent */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-accent-primary/[0.04] to-transparent rounded-tr-2xl pointer-events-none group-hover:from-accent-primary/[0.08] transition-colors duration-500" />

              {/* Shimmer top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

              <div>
                {/* Icon wrapper */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-12 h-12 rounded-xl bg-accent-primary/5 border border-white/[0.08] flex items-center justify-center text-accent-primary mb-6 group-hover:bg-accent-primary/15 group-hover:border-accent-primary/45 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                <h3 className="text-xl font-semibold text-foreground mb-1 tracking-tight font-display">
                  {card.title}
                </h3>
                <p className="text-xs font-semibold text-accent-primary/70 uppercase tracking-widest font-ui mb-4">
                  {card.subtitle}
                </p>
                <p className="text-sm text-foreground/65 leading-relaxed font-sans mb-8">
                  {card.description}
                </p>
              </div>

              {/* Technical tag footer */}
              <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-ui text-foreground/45 group-hover:text-accent-primary/70 transition-colors duration-300">
                <span className="font-semibold">{card.label}</span>
                <span className="font-bold text-foreground">{card.metric}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

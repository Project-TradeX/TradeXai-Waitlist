"use client";

import { motion } from "framer-motion";
import { EyeOff, AlertCircle, Cpu } from "lucide-react";

export default function WhyTradeX() {
  const cards = [
    {
      icon: EyeOff,
      title: "Information Overload",
      subtitle: "Filter the noise.",
      description: "Markets produce billions of data points daily. TradeX parses, cleans, and surfaces critical contextual anomalies, preventing analysis paralysis and emotional fatigue.",
      metric: "95% less redundant alerts",
    },
    {
      icon: AlertCircle,
      title: "Execution Discipline",
      subtitle: "Master the psychology.",
      description: "Losses are rarely due to poor setups, but poor execution. We map your trade logs to structural behavioral patterns, identifying emotional bias and panic actions in real-time.",
      metric: "Track behavioral drift",
    },
    {
      icon: Cpu,
      title: "Fragmented Workflows",
      subtitle: "Consolidate structures.",
      description: "No more juggling ten spreadsheets, four chat channels, and two charting tools. TradeX builds a unified decision space that records and scores every step of your trade life cycle.",
      metric: "Unified workspace",
    },
  ];

  return (
    <section
      id="why-tradex"
      className="py-24 max-w-7xl mx-auto px-4 md:px-8 relative overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-accent/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center space-y-4">
        <span className="font-technical text-xs font-semibold text-emerald-accent tracking-widest uppercase bg-emerald-accent/5 px-3 py-1 rounded-full border border-emerald-accent/10">
          The Problem Space
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Why We Built TradeX
        </h2>
        <p className="text-foreground/60 max-w-xl font-sans">
          Most software claims to forecast the market. We focus on what you can actually control: your information inputs, behavioral habits, and workflow structure.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, borderColor: "rgba(0, 191, 165, 0.4)" }}
              className="relative rounded-2xl border border-glass-border bg-[var(--glass-bg)] p-8 flex flex-col justify-between group transition-all duration-300 backdrop-blur-sm"
            >
              {/* Card visual elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-accent/[0.02] to-transparent rounded-tr-2xl pointer-events-none group-hover:from-emerald-accent/[0.05] transition-colors" />
              
              <div>
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-emerald-accent/5 border border-emerald-border flex items-center justify-center text-emerald-accent mb-6 group-hover:bg-emerald-accent/15 group-hover:border-emerald-accent/45 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-1 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs font-medium text-emerald-accent/70 uppercase tracking-widest font-technical mb-4">
                  {card.subtitle}
                </p>
                <p className="text-sm text-foreground/65 leading-relaxed font-sans mb-8">
                  {card.description}
                </p>
              </div>

              {/* Technical tag footer */}
              <div className="pt-4 border-t border-glass-border flex items-center justify-between text-[11px] font-technical text-foreground/40 group-hover:text-emerald-accent/60 transition-colors">
                <span>METRIC_STATUS</span>
                <span className="font-semibold">{card.metric}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

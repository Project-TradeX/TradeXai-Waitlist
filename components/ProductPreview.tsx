"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Activity, LayoutGrid, Users2, ShieldCheck, Terminal, CheckCircle2 } from "lucide-react";

type FeatureType = "mirror" | "workspace" | "consultation" | "engine";

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState<FeatureType>("mirror");
  const analytics = useAnalytics();

  const handleTabChange = (tab: FeatureType) => {
    setActiveTab(tab);
    analytics.trackCtaClick(`preview_tab_${tab}`, "product_preview");
  };

  const tabs = [
    { id: "mirror", label: "Behavioral Mirror", icon: Activity, tag: "Emotional Pattern Analysis" },
    { id: "workspace", label: "Market Workspace", icon: LayoutGrid, tag: "Pre-Trade Auditing" },
    { id: "consultation", label: "Human Consultation", icon: Users2, tag: "Professional Guidance" },
    { id: "engine", label: "Learning Engine", icon: ShieldCheck, tag: "Habit Adaptation" },
  ] as const;

  return (
    <section
      id="vision"
      className="py-24 max-w-7xl mx-auto px-4 md:px-8 relative overflow-hidden bg-dot-grid-fine"
    >
      {/* Glow Backdrops */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-emerald-accent/[0.015] rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-16 flex flex-col items-start space-y-4">
        <div className="flex items-center space-x-2 font-technical text-xs font-semibold text-emerald-accent tracking-widest uppercase">
          <span>[SYSTEM_MODULES: ACTIVE]</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          The Cognitive Decision Layer
        </h2>
        <p className="text-foreground/60 max-w-2xl font-sans text-sm md:text-base">
          An intentional ecosystem built to audit your cognitive traps, organize your structural rules, and help you trade with professional clarity.
        </p>
      </div>

      {/* Tab Selectors + Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Navigation List */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 cursor-pointer backdrop-blur-sm ${
                  isActive
                    ? "bg-obsidian-800 border-emerald-accent/30 text-white shadow-[0_4px_20px_rgba(0,245,196,0.04)]"
                    : "bg-obsidian-800/30 border-emerald-border/40 text-foreground/60 hover:text-foreground hover:bg-obsidian-800/25"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-emerald-accent/10 border-emerald-accent/40 text-emerald-accent"
                      : "bg-obsidian-950 border-emerald-border/40 text-foreground/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold tracking-tight">{tab.label}</h3>
                  <p className="text-[11px] font-technical text-emerald-accent/60 uppercase tracking-widest mt-1">
                    {tab.tag}
                  </p>
                </div>
              </button>
            );
          })}

          <div className="pt-4 px-2 flex items-center gap-1.5 text-foreground/45 text-xs font-technical">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent/60 animate-pulse" />
            <span>Preview — not final product</span>
          </div>
        </div>

        {/* Right Column — Simulated Technical Workspace Window */}
        <div className="lg:col-span-8">
          <div className="w-full rounded-2xl border border-emerald-border/50 bg-obsidian-950 shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Terminal Window Header */}
            <div className="bg-obsidian-900 px-6 py-4 border-b border-emerald-border/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/35" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/35" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/35" />
                <span className="font-technical text-[10px] text-foreground/40 pl-3">
                  tradex_terminal://preview_{activeTab}.sh
                </span>
              </div>
              <div className="flex items-center space-x-3 font-technical text-[10px] text-emerald-accent/60">
                <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse" />
                <span>SYNCED</span>
              </div>
            </div>

            {/* Dynamic Dashboard Viewport */}
            <div className="p-6 md:p-8 min-h-[380px] bg-obsidian-950/80 relative flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex-1"
                >
                  {/* Active Screen Rendering */}
                  {activeTab === "mirror" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-obsidian-900 border border-emerald-border/40 rounded-xl p-4">
                          <span className="text-[10px] font-technical text-foreground/40 block">FOMO_INDEX</span>
                          <span className="text-xl font-bold font-technical text-red-400 mt-1 block">CRITICAL</span>
                          <span className="text-[9px] font-technical text-foreground/50">3 bias events flag</span>
                        </div>
                        <div className="bg-obsidian-900 border border-emerald-border/40 rounded-xl p-4">
                          <span className="text-[10px] font-technical text-foreground/40 block">SLIPPAGE_RATE</span>
                          <span className="text-xl font-bold font-technical text-emerald-accent mt-1 block">-14.2%</span>
                          <span className="text-[9px] font-technical text-foreground/50">Intentional entry delta</span>
                        </div>
                        <div className="bg-obsidian-900 border border-emerald-border/40 rounded-xl p-4">
                          <span className="text-[10px] font-technical text-foreground/40 block">COGNITIVE_RECOVERY</span>
                          <span className="text-xl font-bold font-technical text-white mt-1 block">88.5%</span>
                          <span className="text-[9px] font-technical text-foreground/50">Cool-down timer compliant</span>
                        </div>
                      </div>

                      <div className="bg-obsidian-900 border border-emerald-border/30 rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-emerald-accent" /> Emotional Anomalies Detected (Last 24 Hours)
                        </h4>
                        <div className="space-y-2.5 font-technical text-xs">
                          <div className="flex justify-between items-center py-2 px-3 rounded bg-obsidian-950 border border-emerald-border/10">
                            <span className="text-red-400 font-semibold">[BIAS_DETECTED]</span>
                            <span className="text-foreground/70">Revenge entry after 3 consecutive losses</span>
                            <span className="text-foreground/40">14:02:11</span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 rounded bg-obsidian-950 border border-emerald-border/10">
                            <span className="text-emerald-accent font-semibold">[OPTIMIZED]</span>
                            <span className="text-foreground/70">Forced rest period activated after size increase</span>
                            <span className="text-foreground/40">10:32:05</span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 rounded bg-obsidian-950 border border-emerald-border/10">
                            <span className="text-yellow-400 font-semibold">[WARN_EMOTION]</span>
                            <span className="text-foreground/70">Fast scrolling logs detected (FOMO trigger hint)</span>
                            <span className="text-foreground/40">09:14:50</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "workspace" && (
                    <div className="space-y-6">
                      <div className="bg-obsidian-900 border border-emerald-border/40 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-emerald-border/20">
                          <h4 className="text-xs font-bold text-white font-technical">
                            PRE_TRADE_AUDIT_VERIFICATION // SETUP_09A
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-emerald-accent/10 border border-emerald-accent/30 text-[9px] text-emerald-accent font-technical">
                            COMPLIANT
                          </span>
                        </div>
                        <div className="space-y-3">
                          {[
                            "Is conviction supported by an independent catalyst (not chat forums)?",
                            "Is risk-to-reward ratio minimum 1:2.5 based on behavioral range?",
                            "Is the absolute dollar loss of this setup below maximum daily limits?",
                            "Have you performed a 2-minute respiratory focus pause before entry?",
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-3 text-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-accent mt-0.5 shrink-0" />
                              <span className="text-foreground/80 leading-tight">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-obsidian-900 border border-emerald-border/20 rounded-xl p-4 font-technical text-[10px]">
                          <span className="text-foreground/40 block">RISK_LIMITS_GLOBAL</span>
                          <span className="text-white mt-1 block">$1,200 per setup max</span>
                          <span className="text-emerald-accent/60 mt-1 block">✓ RIGID</span>
                        </div>
                        <div className="bg-obsidian-900 border border-emerald-border/20 rounded-xl p-4 font-technical text-[10px]">
                          <span className="text-foreground/40 block">DAILY_DECISION_LIMIT</span>
                          <span className="text-white mt-1 block">4 maximum entries</span>
                          <span className="text-emerald-accent/60 mt-1 block">✓ LOCKED</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "consultation" && (
                    <div className="space-y-6">
                      <div className="bg-obsidian-900 border border-emerald-border/30 rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-white mb-4">
                          Behavioral Coach Feedback // Monthly Audit
                        </h4>
                        <div className="p-4 rounded-lg bg-obsidian-950 border border-emerald-border/20 text-xs leading-relaxed text-foreground/85 font-sans">
                          &ldquo;We reviewed your Friday session logs. The overtrading alert spiked due to rapid entry scaling. Notice how your conviction rating fell from 8/10 to 3/10 as you added size. For the upcoming week, we are locking your daily trade frequency to 2 entries to break this loop.&rdquo;
                        </div>
                        <div className="mt-4 flex items-center justify-between text-[10px] font-technical text-foreground/50">
                          <span>COACH: Aaron Vance (Principal behavioral coach)</span>
                          <span>UPDATED: 2 hours ago</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-emerald-border/20 text-[10px] font-technical text-foreground/70">
                          Schedule Live Audit
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-accent/5 border border-emerald-accent/25 text-[10px] font-technical text-emerald-accent">
                          Action items logged: 3
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === "engine" && (
                    <div className="space-y-5">
                      <div className="bg-obsidian-900 border border-emerald-border/30 rounded-xl p-5 font-technical text-xs space-y-3">
                        <div className="flex justify-between items-center text-[10px] text-foreground/45 border-b border-emerald-border/20 pb-2">
                          <span>SYSTEM_WEIGHT_ADAPTATION</span>
                          <span>EPOCH: 410</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-foreground/60">Risk Tolerance Adaptation</span>
                            <span className="text-emerald-accent">Tightening limit thresholds (-4.2%)</span>
                          </div>
                          <div className="w-full h-1 bg-obsidian-950 rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-emerald-accent" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-foreground/60">FOMO Alarm Trigger Threshold</span>
                            <span className="text-emerald-accent">Calibrated trigger (Sens = 0.85)</span>
                          </div>
                          <div className="w-full h-1 bg-obsidian-950 rounded-full overflow-hidden">
                            <div className="w-11/12 h-full bg-emerald-accent" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-foreground/60">Execution Window Hold Restriction</span>
                            <span className="text-emerald-accent">Added 12-second slip lock buffer</span>
                          </div>
                          <div className="w-full h-1 bg-obsidian-950 rounded-full overflow-hidden">
                            <div className="w-3/5 h-full bg-emerald-accent" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-emerald-accent/15 bg-emerald-accent/5 text-[10px] font-technical text-emerald-accent/95 leading-relaxed">
                        [INTELLIGENCE_REPORT] The learning engine has matched high heart rate periods to trading slippages. Autonomic locks will trigger if rest periods are skipped.
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Status bar */}
              <div className="pt-6 mt-6 border-t border-emerald-border/30 flex items-center justify-between text-[9px] font-technical text-foreground/45">
                <span>MODEL_STATUS: INTEGRATED</span>
                <span>SECURE ENCRYPTED DECISION LOGGING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

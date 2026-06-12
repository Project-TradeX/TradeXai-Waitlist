"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Activity, LayoutGrid, BookOpen, ShieldAlert, Zap, Users, ShieldCheck, BrainCircuit, MessageSquare, TrendingUp } from "lucide-react";

type FeatureType = "market" | "copilot" | "community" | "expert";

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState<FeatureType>("market");
  const [isPaused, setIsPaused] = useState(false);
  const analytics = useAnalytics();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tabs = [
    { id: "market", label: "Market Intelligence", icon: TrendingUp, tag: "Data Synthesis" },
    { id: "copilot", label: "AI Copilot", icon: BrainCircuit, tag: "Execution Assistant" },
    { id: "community", label: "Community Intelligence", icon: Users, tag: "Crowdsourced Alpha" },
    { id: "expert", label: "Expert Marketplace", icon: BookOpen, tag: "Verified Playbooks" },
  ] as const;

  const handleTabChange = (tab: FeatureType) => {
    setActiveTab(tab);
    analytics.trackCtaClick(`preview_tab_${tab}`, "product_preview");
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.findIndex(t => t.id === prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex].id;
      });
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, tabs]);

  return (
    <section
      id="vision"
      className="py-32 max-w-7xl mx-auto px-3 md:px-5 relative overflow-hidden font-sans"
    >
      {/* Ambient glass blobs */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-accent-primary/[0.022] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-primary/[0.012] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mb-16 flex flex-col items-start space-y-4"
      >
        <div className="flex items-center space-x-2 font-ui text-xs font-bold text-accent-primary tracking-widest uppercase bg-accent-primary/10 px-3 py-1 rounded-full border border-accent-primary/20 animate-border-glow">
          <span>SERVICES</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
          Enterprise{" "}<span className="text-shimmer">Financial Intelligence</span>
        </h2>
        <p className="text-foreground/60 max-w-2xl text-sm md:text-base leading-relaxed">
          A premium execution suite designed to audit your trading psychology, enforce strategic risk rules, and lock in professional execution discipline.
        </p>
      </motion.div>

      {/* Tab Selectors + Preview Workspace */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Column — Navigation List */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                whileHover={!isActive ? { x: 4 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 cursor-pointer backdrop-blur-sm card-inset-highlight ${
                  isActive
                    ? "bg-obsidian-800 border-accent-primary/30 text-white shadow-[0_4px_20px_rgba(37,99,235,0.08)] animate-border-glow"
                    : "bg-obsidian-800/30 border-white/[0.04] text-foreground/60 hover:text-foreground hover:bg-obsidian-800/50 hover:border-white/10"
                }`}
              >
                {/* Auto-rotation progress indicator */}
                {isActive && !isPaused && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-[2px] bg-accent-primary/50 rounded-b-2xl"
                  />
                )}
                
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary"
                      : "bg-obsidian-950 border-white/[0.04] text-foreground/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 font-ui">
                  <h3 className="text-sm font-bold tracking-tight">{tab.label}</h3>
                  <p className="text-[10px] font-semibold text-accent-primary/60 uppercase tracking-widest mt-1">
                    {tab.tag}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right Column — Simulated Technical Workspace Window */}
        <div className="lg:col-span-8">
          <div className="w-full rounded-2xl border border-white/[0.07] bg-obsidian-950 shadow-[0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden" style={{ backdropFilter: "blur(20px)" }}>
            {/* Window Header */}
            <div className="bg-obsidian-900 px-6 py-4 border-b border-white/[0.04] flex items-center justify-between font-ui">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/15 border border-foreground/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/15 border border-foreground/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/15 border border-foreground/10" />
                <span className="text-[10px] text-foreground/40 pl-3">
                  TradeXai Workspace
                </span>
              </div>
                <div className="flex items-center space-x-2 text-[10px] text-accent-primary/80 font-semibold font-ui">
                  <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                  <span>Platform Live</span>
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
                  {activeTab === "market" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4 font-ui">
                        <div className="bg-obsidian-900 border border-white/[0.04] rounded-xl p-4">
                          <span className="text-[9px] text-foreground/45 block tracking-wider font-semibold">MARKET SENTIMENT</span>
                          <span className="text-xl font-bold text-accent-primary mt-1 block">BULLISH</span>
                          <span className="text-[9px] text-foreground/50">Aggregated from 10k+ sources</span>
                        </div>
                        <div className="bg-obsidian-900 border border-white/[0.04] rounded-xl p-4">
                          <span className="text-[9px] text-foreground/45 block tracking-wider font-semibold">VOLATILITY INDEX</span>
                          <span className="text-xl font-bold text-white mt-1 block font-mono">14.2</span>
                          <span className="text-[9px] text-foreground/50">Optimal trading range</span>
                        </div>
                        <div className="bg-obsidian-900 border border-white/[0.04] rounded-xl p-4">
                          <span className="text-[9px] text-foreground/45 block tracking-wider font-semibold">INSTITUTIONAL FLOW</span>
                          <span className="text-xl font-bold text-accent-primary mt-1 block">+ $2.4B</span>
                          <span className="text-[9px] text-foreground/50">Last 24 hours</span>
                        </div>
                      </div>

                      <div className="bg-obsidian-900 border border-white/[0.04] rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-white mb-3 flex items-center gap-2 font-display">
                          <Activity className="w-3.5 h-3.5 text-accent-primary" /> Live Data Feed
                        </h4>
                        <div className="space-y-2.5 text-xs font-sans">
                          <div className="flex justify-between items-center py-2 px-3 rounded bg-obsidian-950 border border-white/[0.04]">
                            <span className="text-accent-primary font-semibold text-[10px] font-ui">[EQUITIES]</span>
                            <span className="text-foreground/75 text-[11px]">Unusual options activity detected on tech sector</span>
                            <span className="text-foreground/40 font-mono">14:02</span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 rounded bg-obsidian-950 border border-white/[0.04]">
                            <span className="text-white font-semibold text-[10px] font-ui">[MACRO]</span>
                            <span className="text-foreground/75 text-[11px]">Core inflation data aligns with market expectations</span>
                            <span className="text-foreground/40 font-mono">10:32</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "copilot" && (
                    <div className="space-y-6">
                      <div className="bg-obsidian-900 border border-white/[0.04] rounded-xl p-6 flex flex-col h-full min-h-[250px]">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-obsidian-950 border border-white/[0.04] flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-foreground/50">U</span>
                            </div>
                            <div className="bg-obsidian-950 border border-white/[0.04] p-3 rounded-xl rounded-tl-none text-xs text-foreground/80">
                              Analyze my last 5 trades. What is my biggest leak?
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center shrink-0">
                              <BrainCircuit className="w-4 h-4 text-accent-primary" />
                            </div>
                            <div className="bg-accent-primary/5 border border-accent-primary/10 p-3 rounded-xl rounded-tl-none text-xs text-foreground/90 leading-relaxed">
                              I've reviewed your execution logs. Your primary leak is <strong>premature exits</strong> on winning positions. In your last 5 trades, you exited 4 times before hitting your first partial target, leaving 2.4R on the table.
                              <br/><br/>
                              Recommendation: I can enforce a "Hold" lock until your first technical target is met. Shall I activate this constraint for tomorrow's session?
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "community" && (
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="bg-obsidian-900 border border-white/[0.04] rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3">
                        <Users className="w-8 h-8 text-accent-primary" />
                        <h4 className="text-sm font-bold text-white">Global Sentiment Hub</h4>
                        <p className="text-xs text-foreground/60 leading-relaxed">
                          Tap into aggregated insights from verified professional traders.
                        </p>
                        <button className="px-4 py-1.5 mt-2 text-xs font-semibold bg-white/[0.03] border border-white/[0.05] rounded-lg hover:bg-white/[0.06] transition-colors">
                          Join Discussions
                        </button>
                      </div>
                      <div className="bg-obsidian-900 border border-white/[0.04] rounded-xl p-5">
                        <h4 className="text-xs font-semibold text-white mb-3">Top Contributors</h4>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-obsidian-950 border border-white/[0.04]" />
                              <div className="flex-1">
                                <div className="h-2 w-16 bg-white/[0.05] rounded mb-1" />
                                <div className="h-1.5 w-10 bg-white/[0.02] rounded" />
                              </div>
                              <span className="text-[10px] text-accent-primary font-mono">+42%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "expert" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-obsidian-900 border border-white/[0.04] rounded-xl p-4 hover:border-accent-primary/20 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                              <BookOpen className="w-5 h-5 text-foreground/40 group-hover:text-accent-primary transition-colors" />
                              <span className="text-[9px] font-mono text-accent-primary/60 border border-accent-primary/10 px-1.5 py-0.5 rounded">VERIFIED</span>
                            </div>
                            <h4 className="text-xs font-bold text-white mb-1">Momentum Breakout Strategy</h4>
                            <p className="text-[10px] text-foreground/50">By TradeXai Quantitative Team</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

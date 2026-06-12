"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Calendar, CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BuildInPublic() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(4); // Default expand current week (Week 4)
  const analytics = useAnalytics();

  const handleWeekToggle = (weekNum: number) => {
    if (expandedWeek === weekNum) {
      setExpandedWeek(null);
    } else {
      setExpandedWeek(weekNum);
      analytics.trackCtaClick(`timeline_week_${weekNum}`, "build_in_public");
    }
  };

  const timeline = [
    {
      week: 1,
      title: "Research & Problem Discovery",
      status: "completed",
      summary: "Identified core cognitive friction in retail and professional trade setups.",
      details: [
        "Conducted deep structural audits of 40+ manual trading journals.",
        "Scoped the primary cognitive bottlenecks: Overtrading, size escalation, and bias logs.",
        "Drafted mathematical models for behavioral drift and entry/exit correlation metrics.",
      ],
    },
    {
      week: 2,
      title: "Workspace Prototyping",
      status: "completed",
      summary: "Built cognitive sandboxes and pre-trade compliance workspace drafts.",
      details: [
        "Coded interactive local rules check-wizards matching structural risk limits.",
        "Designed the initial database framework for private, offline decision auditing.",
        "Created abstract canvas mapping systems representing Decision -> Insight patterns.",
      ],
    },
    {
      week: 3,
      title: "Alpha Trials & Interviews",
      status: "completed",
      summary: "Interviewed active traders to validate behavioral triggers and workspace UI.",
      details: [
        "Tested compliance checker prototypes with 15 active futures & forex traders.",
        "Discovered that 80% of critical errors occurred within 10 minutes of a losing trade.",
        "Added forced physiological cool-down structures into the system spec.",
      ],
    },
    {
      week: 4,
      title: "Founding Waitlist Deployment",
      status: "active",
      summary: "Launching waitlist queue to build our initial co-design cohorts.",
      details: [
        "Deploying premium pre-launch waitlist dashboard (Vercel edge ready).",
        "Integrating Neon Serverless Postgres for durable, secure database storage.",
        "Enabling gamified referral prioritizations to fast-track active feedback contributors.",
      ],
    },
  ];

  return (
    <section
      id="roadmap"
      className="py-24 max-w-4xl mx-auto px-3 md:px-5 relative overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-accent-primary/[0.015] rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center space-y-4"
      >
        <span className="text-[10px] font-semibold text-accent-primary uppercase tracking-widest font-ui">
          Development Timeline
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Follow the <span className="text-shimmer">Build Process</span>
        </h2>
        <p className="text-foreground/60 text-sm font-sans">
          TradeXai is built publicly. Explore what we researched, where we stand today, and what is next in our design cycle.
        </p>
      </motion.div>

      {/* Timeline Tree */}
      <div className="relative border-l border-white/[0.08]/40 pl-6 md:pl-8 space-y-8 max-w-2xl mx-auto">
        {timeline.map((item) => {
          const isExpanded = expandedWeek === item.week;
          const isActive = item.status === "active";
          const isCompleted = item.status === "completed";

          return (
            <motion.div
              key={item.week}
              className="relative group"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: item.week * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Bullet Node */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1 z-10">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-obsidian-950 border border-accent-primary flex items-center justify-center text-accent-primary shadow-[0_0_10px_rgba(37,99,235,0.15)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full bg-accent-primary border border-accent-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-pulse">
                    <Circle className="w-2.5 h-2.5 fill-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-obsidian-950 border border-white/[0.08] flex items-center justify-center text-foreground/30">
                    <Circle className="w-2 h-2" />
                  </div>
                )}
              </div>

              {/* Card Container */}
              <div
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "bg-obsidian-800 border-accent-primary/35 shadow-[0_0_20px_rgba(37,99,235,0.02)]"
                    : "bg-obsidian-850/40 border-white/[0.08]/40"
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => handleWeekToggle(item.week)}
                  className="w-full text-left p-5 md:p-6 flex items-start justify-between cursor-pointer focus:outline-none bg-transparent"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-technical text-[10px] font-bold text-accent-primary uppercase tracking-widest bg-accent-primary/5 border border-accent-primary/15 px-2.5 py-0.5 rounded">
                        WEEK 0{item.week}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-technical text-accent-primary font-semibold flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-accent-primary animate-ping" />
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-xs text-foreground/60 leading-relaxed font-sans">{item.summary}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-foreground/40 mt-1 shrink-0 transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-accent-primary" : ""
                    }`}
                  />
                </button>

                {/* Collapsible Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/[0.08]/20"
                    >
                      <div className="p-5 md:p-6 bg-obsidian-900/40 space-y-3">
                        <span className="text-[10px] text-foreground/40 block tracking-widest uppercase font-ui font-semibold">
                          Weekly Deliverables
                        </span>
                        <ul className="space-y-2">
                          {item.details.map((detail, idx) => (
                            <li key={idx} className="text-xs text-foreground/80 flex items-start space-x-2.5">
                              <span className="text-accent-primary font-semibold mt-0.5 font-technical">&gt;</span>
                              <span className="leading-relaxed font-sans">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

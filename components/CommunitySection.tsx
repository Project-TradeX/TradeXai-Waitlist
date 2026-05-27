"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnalytics } from "@/hooks/useAnalytics";
import { FeedbackSchema, type FeedbackInput } from "@/lib/schemas";
import { MessageSquareShare, Mail, PhoneCall, Send, Check, X, ArrowDown, Users2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunitySection() {
  const [activePath, setActivePath] = useState<"feedback" | "updates" | "founder" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [quickEmail, setQuickEmail] = useState("");
  const analytics = useAnalytics();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(FeedbackSchema),
  });

  const handlePathToggle = (path: "feedback" | "updates" | "founder") => {
    if (activePath === path) {
      setActivePath(null);
    } else {
      setActivePath(path);
      analytics.trackCtaClick(`community_path_${path}`, "community_section");
    }
  };

  const onSubmitFeedback = async (data: FeedbackInput) => {
    setIsSubmitting(true);
    setFeedbackSuccess(false);
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit feedback.");

      setFeedbackSuccess(true);
      analytics.trackFormSubmit("feedback_drawer", "success", { type: data.type });
      reset();
      setTimeout(() => setFeedbackSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      analytics.trackFormSubmit("feedback_drawer", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitQuickNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmail || !quickEmail.includes("@")) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: quickEmail,
          experience: "intermediate", // default fallback for newsletter quick opt-in
          challenge: "Newsletter Quick Opt-in",
          tools: "None",
          expectation: "Follow build updates",
          joinNewsletter: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to subscribe.");

      setNewsletterSuccess(true);
      analytics.trackFormSubmit("community_newsletter", "success");
      setQuickEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      analytics.trackFormSubmit("community_newsletter", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="community"
      className="py-24 max-w-7xl mx-auto px-4 md:px-8 relative overflow-hidden"
    >
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-emerald-accent/[0.01] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center space-y-4">
        <span className="font-technical text-xs font-semibold text-emerald-accent tracking-widest uppercase bg-emerald-accent/5 px-3 py-1 rounded-full border border-emerald-accent/10">
          Co-Design Program
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Build TradeX With Us
        </h2>
        <p className="text-foreground/60 max-w-xl font-sans text-sm">
          We don&apos;t believe in silent builders. Choose a path below to help collaborate, validate ideas, or share market roadblocks directly with our core engineering cell.
        </p>
      </div>

      {/* Interactive Path Selector grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Share Feedback */}
        <button
          onClick={() => handlePathToggle("feedback")}
          className={`text-left p-8 rounded-2xl border transition-all duration-300 relative group cursor-pointer backdrop-blur-sm ${
            activePath === "feedback"
              ? "bg-obsidian-800 border-emerald-accent text-white shadow-[0_4px_25px_rgba(0,245,196,0.05)]"
              : "bg-obsidian-800/40 border-emerald-border/40 text-foreground/80 hover:border-emerald-accent/30 hover:bg-obsidian-800/20"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-accent/5 border border-emerald-border/50 flex items-center justify-center text-emerald-accent mb-6 group-hover:bg-emerald-accent/15 transition-all">
            <MessageSquareShare className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Share Feedback</h3>
          <p className="text-xs text-foreground/50 leading-relaxed mb-4">
            Struggling with a specific emotional trap or analytical barrier? Log your ideas or pain points.
          </p>
          <div className="text-[10px] font-technical text-emerald-accent flex items-center gap-1">
            <span>LAUNCH DRAWER</span>
            <ArrowDown className={`w-3 h-3 transition-transform duration-300 ${activePath === "feedback" ? "rotate-180" : ""}`} />
          </div>
        </button>

        {/* Card 2: Join Updates */}
        <button
          onClick={() => handlePathToggle("updates")}
          className={`text-left p-8 rounded-2xl border transition-all duration-300 relative group cursor-pointer backdrop-blur-sm ${
            activePath === "updates"
              ? "bg-obsidian-800 border-emerald-accent text-white shadow-[0_4px_25px_rgba(0,245,196,0.05)]"
              : "bg-obsidian-800/40 border-emerald-border/40 text-foreground/80 hover:border-emerald-accent/30 hover:bg-obsidian-800/20"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-accent/5 border border-emerald-border/50 flex items-center justify-center text-emerald-accent mb-6 group-hover:bg-emerald-accent/15 transition-all">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Join Updates</h3>
          <p className="text-xs text-foreground/50 leading-relaxed mb-4">
            Opt into monthly engineering updates. Read our core learnings and decision science research logs.
          </p>
          <div className="text-[10px] font-technical text-emerald-accent flex items-center gap-1">
            <span>EXPAND OPT-IN</span>
            <ArrowDown className={`w-3 h-3 transition-transform duration-300 ${activePath === "updates" ? "rotate-180" : ""}`} />
          </div>
        </button>

        {/* Card 3: Talk to Founder */}
        <button
          onClick={() => handlePathToggle("founder")}
          className={`text-left p-8 rounded-2xl border transition-all duration-300 relative group cursor-pointer backdrop-blur-sm ${
            activePath === "founder"
              ? "bg-obsidian-800 border-emerald-accent text-white shadow-[0_4px_25px_rgba(0,245,196,0.05)]"
              : "bg-obsidian-800/40 border-emerald-border/40 text-foreground/80 hover:border-emerald-accent/30 hover:bg-obsidian-800/20"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-accent/5 border border-emerald-border/50 flex items-center justify-center text-emerald-accent mb-6 group-hover:bg-emerald-accent/15 transition-all">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Talk To Founder</h3>
          <p className="text-xs text-foreground/50 leading-relaxed mb-4">
            Are you an institutional participant or active day trader? Book a direct research briefing session.
          </p>
          <div className="text-[10px] font-technical text-emerald-accent flex items-center gap-1">
            <span>SHOW CONTACTS</span>
            <ArrowDown className={`w-3 h-3 transition-transform duration-300 ${activePath === "founder" ? "rotate-180" : ""}`} />
          </div>
        </button>
      </div>

      {/* Expandable Action Drawers */}
      <AnimatePresence>
        {activePath && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full glass-card rounded-2xl border-emerald-border/40 overflow-hidden"
          >
            <div className="p-6 md:p-8 relative">
              {/* Close Button */}
              <button
                onClick={() => setActivePath(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-foreground/40 hover:text-emerald-accent transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* DRAWER 1: SHARE FEEDBACK FORM */}
              {activePath === "feedback" && (
                <div className="max-w-2xl mx-auto">
                  <h4 className="text-sm font-technical text-emerald-accent uppercase tracking-widest mb-4">
                    // SUBMIT CO-DESIGN FEEDBACK
                  </h4>
                  {feedbackSuccess ? (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-accent/10 border border-emerald-accent/30 flex items-center justify-center text-emerald-accent mx-auto mb-2">
                        <Check className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-white">Feedback Logged.</p>
                      <p className="text-xs text-foreground/50">Our engineering cell reviews all logs within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmitFeedback)} className="space-y-4 text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-[10px] font-technical text-foreground/60 uppercase">Name (Optional)</label>
                          <input
                            type="text"
                            placeholder="Alex Vance"
                            {...register("name")}
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-border/40 bg-obsidian-950 text-xs focus:outline-none focus:border-emerald-accent transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-[10px] font-technical text-foreground/60 uppercase">Email *</label>
                          <input
                            type="email"
                            placeholder="alex@trader.io"
                            {...register("email")}
                            className="w-full px-4 py-2.5 rounded-xl border border-emerald-border/40 bg-obsidian-950 text-xs focus:outline-none focus:border-emerald-accent transition-all"
                          />
                          {errors.email && <span className="text-[9px] text-red-400 font-technical">{errors.email.message}</span>}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-technical text-foreground/60 uppercase">Feedback Type *</label>
                        <div className="grid grid-cols-4 gap-2">
                          {["Idea", "Pain", "Question", "Feature"].map((fType) => (
                            <label
                              key={fType}
                              className="border border-emerald-border/40 bg-obsidian-950 p-2.5 rounded-lg text-center text-xs font-semibold hover:border-emerald-accent/40 cursor-pointer block"
                            >
                              <input
                                type="radio"
                                value={fType}
                                {...register("type")}
                                className="mr-1.5 accent-emerald-accent"
                              />
                              {fType}
                            </label>
                          ))}
                        </div>
                        {errors.type && <span className="text-[9px] text-red-400 font-technical">{errors.type.message}</span>}
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-technical text-foreground/60 uppercase">Message *</label>
                        <textarea
                          rows={3}
                          placeholder="Describe your design suggestion, platform pain point, or general question..."
                          {...register("message")}
                          className="w-full px-4 py-2.5 rounded-xl border border-emerald-border/40 bg-obsidian-950 text-xs focus:outline-none focus:border-emerald-accent transition-all resize-none"
                        />
                        {errors.message && <span className="text-[9px] text-red-400 font-technical">{errors.message.message}</span>}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-2.5 px-6 rounded-full bg-emerald-accent text-black text-xs font-bold hover:bg-emerald-accent/80 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Feedback</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* DRAWER 2: JOIN UPDATES RAPID EMAIL */}
              {activePath === "updates" && (
                <div className="max-w-md mx-auto text-center space-y-4">
                  <h4 className="text-sm font-technical text-emerald-accent uppercase tracking-widest">
                    // SUBSCRIBE TO THE BUILD NEWSLETTER
                  </h4>
                  <p className="text-xs text-foreground/60">
                    Get raw, technical digests detailing our decision science research and development progress. No spam, monthly schedules.
                  </p>

                  {newsletterSuccess ? (
                    <div className="py-4 space-y-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-accent/10 border border-emerald-accent/30 flex items-center justify-center text-emerald-accent mx-auto mb-1">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-white">Subscribed Successfully.</p>
                    </div>
                  ) : (
                    <form onSubmit={onSubmitQuickNewsletter} className="flex items-center space-x-2">
                      <input
                        type="email"
                        required
                        placeholder="enter.your@email.com"
                        value={quickEmail}
                        onChange={(e) => setQuickEmail(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-border/40 bg-obsidian-950 text-xs focus:outline-none focus:border-emerald-accent transition-all"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-2.5 px-5 rounded-xl bg-emerald-accent text-black text-xs font-bold hover:bg-emerald-accent/85 transition-all cursor-pointer disabled:opacity-40 shrink-0"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* DRAWER 3: TALK TO FOUNDER DETAIL */}
              {activePath === "founder" && (
                <div className="max-w-lg mx-auto text-center space-y-6">
                  <h4 className="text-sm font-technical text-emerald-accent uppercase tracking-widest">
                    // DIRECT ENGINEERING BRIEFING ACCESS
                  </h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    We want to schedule 20-minute product research briefings with professional or heavily disciplined market participants. Reach out directly to book a session:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                      href="mailto:founders@tradex.ai"
                      onClick={() => analytics.trackCtaClick("founder_email_click", "community")}
                      className="border border-emerald-border/40 bg-obsidian-950 p-4 rounded-xl text-left hover:border-emerald-accent/40 transition-all flex items-start space-x-3 group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-accent/5 text-emerald-accent shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block group-hover:text-emerald-accent transition-colors">founders@tradex.ai</span>
                        <span className="text-[10px] text-foreground/45 mt-0.5 block">Direct inbox cell</span>
                      </div>
                    </a>

                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analytics.trackCtaClick("founder_linkedin_click", "community")}
                      className="border border-emerald-border/40 bg-obsidian-950 p-4 rounded-xl text-left hover:border-emerald-accent/40 transition-all flex items-start space-x-3 group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-accent/5 text-emerald-accent shrink-0">
                        <Users2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block group-hover:text-emerald-accent transition-colors">TradeX Core Team</span>
                        <span className="text-[10px] text-foreground/45 mt-0.5 block">Connect on LinkedIn</span>
                      </div>
                    </a>
                  </div>

                  <div className="text-[10px] font-technical text-foreground/40">
                    * NOTE: Please mention experience level and active tools when mailing.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

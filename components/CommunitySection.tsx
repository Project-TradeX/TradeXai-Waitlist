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
      className="py-24 max-w-7xl mx-auto px-3 md:px-5 relative overflow-hidden"
    >
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-accent-primary/[0.01] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center space-y-4"
      >
        <span className="font-technical text-xs font-semibold text-accent-primary tracking-widest uppercase bg-accent-primary/5 px-3 py-1 rounded-full border border-accent-primary/10 animate-border-glow">
          Co-Design Program
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Build TradeXai <span className="text-shimmer">With Us</span>
        </h2>
        <p className="text-foreground/60 max-w-xl font-sans text-sm">
          We don&apos;t believe in silent builders. Choose a path below to help collaborate, validate ideas, or share market roadblocks directly with our core engineering cell.
        </p>
      </motion.div>

      {/* Interactive Path Selector grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Share Feedback */}
        <motion.button
          onClick={() => handlePathToggle("feedback")}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, borderColor: "rgba(37,99,235,0.5)" }}
          className={`text-left p-8 rounded-2xl border transition-all duration-300 relative group cursor-pointer backdrop-blur-sm card-inset-highlight ${
            activePath === "feedback"
              ? "bg-obsidian-800 border-accent-primary text-white shadow-[0_4px_25px_rgba(37,99,235,0.05)]"
              : "bg-obsidian-800/40 border-white/[0.08]/40 text-foreground/80 hover:bg-obsidian-800/20"
          }`}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-12 h-12 rounded-xl bg-accent-primary/5 border border-white/[0.08]/50 flex items-center justify-center text-accent-primary mb-6 group-hover:bg-accent-primary/15 transition-all"
          >
            <MessageSquareShare className="w-5 h-5" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2">Share Feedback</h3>
          <p className="text-xs text-foreground/50 leading-relaxed mb-4">
            Struggling with a specific emotional trap or analytical barrier? Log your ideas or pain points.
          </p>
          <div className="text-[10px] font-ui text-accent-primary flex items-center gap-1">
            <span>OPEN FORM</span>
            <ArrowDown className={`w-3 h-3 transition-transform duration-300 ${activePath === "feedback" ? "rotate-180" : ""}`} />
          </div>
        </motion.button>

        {/* Card 2: Join Updates */}
        <motion.button
          onClick={() => handlePathToggle("updates")}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, borderColor: "rgba(37,99,235,0.5)" }}
          className={`text-left p-8 rounded-2xl border transition-all duration-300 relative group cursor-pointer backdrop-blur-sm card-inset-highlight ${
            activePath === "updates"
              ? "bg-obsidian-800 border-accent-primary text-white shadow-[0_4px_25px_rgba(37,99,235,0.05)]"
              : "bg-obsidian-800/40 border-white/[0.08]/40 text-foreground/80 hover:bg-obsidian-800/20"
          }`}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-12 h-12 rounded-xl bg-accent-primary/5 border border-white/[0.08]/50 flex items-center justify-center text-accent-primary mb-6 group-hover:bg-accent-primary/15 transition-all"
          >
            <Mail className="w-5 h-5" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2">Join Updates</h3>
          <p className="text-xs text-foreground/50 leading-relaxed mb-4">
            Opt into monthly engineering updates. Read our core learnings and decision science research logs.
          </p>
          <div className="text-[10px] font-ui text-accent-primary flex items-center gap-1">
            <span>SUBSCRIBE</span>
            <ArrowDown className={`w-3 h-3 transition-transform duration-300 ${activePath === "updates" ? "rotate-180" : ""}`} />
          </div>
        </motion.button>

        {/* Card 3: Talk to Founder */}
        <motion.button
          onClick={() => handlePathToggle("founder")}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, borderColor: "rgba(37,99,235,0.5)" }}
          className={`text-left p-8 rounded-2xl border transition-all duration-300 relative group cursor-pointer backdrop-blur-sm card-inset-highlight ${
            activePath === "founder"
              ? "bg-obsidian-800 border-accent-primary text-white shadow-[0_4px_25px_rgba(37,99,235,0.05)]"
              : "bg-obsidian-800/40 border-white/[0.08]/40 text-foreground/80 hover:bg-obsidian-800/20"
          }`}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-12 h-12 rounded-xl bg-accent-primary/5 border border-white/[0.08]/50 flex items-center justify-center text-accent-primary mb-6 group-hover:bg-accent-primary/15 transition-all"
          >
            <PhoneCall className="w-5 h-5" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2">Talk To Founder</h3>
          <p className="text-xs text-foreground/50 leading-relaxed mb-4">
            Are you an institutional participant or active day trader? Book a direct research briefing session.
          </p>
          <div className="text-[10px] font-ui text-accent-primary flex items-center gap-1">
            <span>CONTACT</span>
            <ArrowDown className={`w-3 h-3 transition-transform duration-300 ${activePath === "founder" ? "rotate-180" : ""}`} />
          </div>
        </motion.button>
      </div>

      {/* Expandable Action Drawers */}
      <AnimatePresence>
        {activePath && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full glass-card rounded-2xl border-white/[0.08]/40 overflow-hidden"
          >
            <div className="p-6 md:p-8 relative">
              {/* Close Button */}
              <button
                onClick={() => setActivePath(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-foreground/40 hover:text-accent-primary transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* DRAWER 1: SHARE FEEDBACK FORM */}
              {activePath === "feedback" && (
                <div className="max-w-2xl mx-auto">
                  <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-widest mb-4 font-ui">
                    Share Your Feedback
                  </h4>
                  {feedbackSuccess ? (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary mx-auto mb-2">
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
                            className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08]/40 bg-obsidian-950 text-xs focus:outline-none focus:border-accent-primary transition-all"
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-[10px] font-technical text-foreground/60 uppercase">Email *</label>
                          <input
                            type="email"
                            placeholder="alex@trader.io"
                            {...register("email")}
                            className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08]/40 bg-obsidian-950 text-xs focus:outline-none focus:border-accent-primary transition-all"
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
                              className="border border-white/[0.08]/40 bg-obsidian-950 p-2.5 rounded-lg text-center text-xs font-semibold hover:border-accent-primary/40 cursor-pointer block"
                            >
                              <input
                                type="radio"
                                value={fType}
                                {...register("type")}
                                className="mr-1.5 accent-accent-primary"
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
                          className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08]/40 bg-obsidian-950 text-xs focus:outline-none focus:border-accent-primary transition-all resize-none"
                        />
                        {errors.message && <span className="text-[9px] text-red-400 font-technical">{errors.message.message}</span>}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-2.5 px-6 rounded-full bg-accent-primary text-black text-xs font-bold hover:bg-accent-primary/80 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
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
                  <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-widest font-ui">
                    Subscribe to the Build Newsletter
                  </h4>
                  <p className="text-xs text-foreground/60">
                    Get raw, technical digests detailing our decision science research and development progress. No spam, monthly schedules.
                  </p>

                  {newsletterSuccess ? (
                    <div className="py-4 space-y-1">
                      <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary mx-auto mb-1">
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
                        className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08]/40 bg-obsidian-950 text-xs focus:outline-none focus:border-accent-primary transition-all"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-2.5 px-5 rounded-xl bg-accent-primary text-black text-xs font-bold hover:bg-accent-primary/85 transition-all cursor-pointer disabled:opacity-40 shrink-0"
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
                  <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-widest font-ui">
                    Book a Founder Briefing
                  </h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    We want to schedule 20-minute product research briefings with professional or heavily disciplined market participants. Reach out directly to book a session:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                      href="mailto:founders@tradex.ai"
                      onClick={() => analytics.trackCtaClick("founder_email_click", "community")}
                      className="border border-white/[0.08]/40 bg-obsidian-950 p-4 rounded-xl text-left hover:border-accent-primary/40 transition-all flex items-start space-x-3 group"
                    >
                      <div className="p-2 rounded-lg bg-accent-primary/5 text-accent-primary shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block group-hover:text-accent-primary transition-colors">founders@tradex.ai</span>
                        <span className="text-[10px] text-foreground/45 mt-0.5 block">Direct inbox cell</span>
                      </div>
                    </a>

                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analytics.trackCtaClick("founder_linkedin_click", "community")}
                      className="border border-white/[0.08]/40 bg-obsidian-950 p-4 rounded-xl text-left hover:border-accent-primary/40 transition-all flex items-start space-x-3 group"
                    >
                      <div className="p-2 rounded-lg bg-accent-primary/5 text-accent-primary shrink-0">
                        <Users2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block group-hover:text-accent-primary transition-colors">TradeXai Core Team</span>
                        <span className="text-[10px] text-foreground/45 mt-0.5 block">Connect on LinkedIn</span>
                      </div>
                    </a>
                  </div>

                  <div className="text-[10px] font-sans text-foreground/40">
                    Please mention your experience level and current tools when reaching out.
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

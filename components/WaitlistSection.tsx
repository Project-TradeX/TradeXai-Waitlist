"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnalytics } from "@/hooks/useAnalytics";
import { WaitlistSchema, type WaitlistInput } from "@/lib/schemas";
import { ArrowRight, Copy, Check, Share2, Award, Users, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function WaitlistSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<{
    email: string;
    referralCode: string;
    referredBy?: string | null;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const analytics = useAnalytics();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(WaitlistSchema),
    defaultValues: {
      experience: undefined,
      joinNewsletter: true,
      referredBy: null,
    },
  });

  const selectedExperience = watch("experience");

  // Load from localStorage on mount (keeps referral status persistent on page reloads!)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check if user already signed up previously
    const saved = localStorage.getItem("tradex_waitlist_signup");
    if (saved) {
      try {
        setRegisteredUser(JSON.parse(saved));
      } catch (e) {
        // Silently skip
      }
    }

    // Capture referral query from URL if present
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode && refCode.startsWith("TX-")) {
      setValue("referredBy", refCode);
      // Log referral traffic trigger
      analytics.trackCtaClick(`referred_by_${refCode}`, "landing_url");
    }
  }, [setValue]);

  const onSubmit = async (data: WaitlistInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    analytics.trackFormSubmit("waitlist_form", "success", { experience: data.experience });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit. Please try again.");
      }

      // Success! Fire confetti explosion
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f5c4", "#10b981", "#ffffff", "#022216"],
      });

      const userSession = {
        email: data.email,
        referralCode: resData.referral_code || "TX-MEMBER",
        referredBy: data.referredBy,
      };

      // Persist signup details in browser local storage
      localStorage.setItem("tradex_waitlist_signup", JSON.stringify(userSession));
      setRegisteredUser(userSession);
      analytics.trackWaitlistSignup(data.experience, data.challenge.length);

    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred.");
      analytics.trackFormSubmit("waitlist_form", "error", { errorMsg: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReferralUrl = () => {
    if (!registeredUser) return "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://tradex.ai";
    return `${baseUrl}?ref=${registeredUser.referralCode}`;
  };

  const copyToClipboard = () => {
    const url = getReferralUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    analytics.trackCtaClick("copy_referral_link", "waitlist_success");
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerMockShare = () => {
    const url = getReferralUrl();
    const text = `Join the Founding Waitlist for TradeXai — AI-assisted behavioral intelligence for modern market participants! Get priority queue status using my link:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
    analytics.trackCtaClick("share_twitter_referral", "waitlist_success");
  };

  return (
    <section
      id="waitlist"
      className="py-24 max-w-5xl mx-auto px-3 md:px-5 relative overflow-hidden"
    >
      {/* Background visual glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent-primary/[0.02] rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-slow" />

      <div className="w-full glass-card rounded-3xl border-accent-primary/20 p-8 md:p-12 relative overflow-hidden">
        {/* Fine background tech grid in the card */}
        <div className="absolute inset-0 bg-dot-grid-fine opacity-30 pointer-events-none" />

        <AnimatePresence mode="wait">
          {!registeredUser ? (
            /* STEP 1: FORM REGISTER VIEW */
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Form Header */}
              <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
                <span className="text-[10px] font-semibold text-accent-primary tracking-widest uppercase bg-accent-primary/5 border border-accent-primary/15 px-3 py-1 rounded-full font-ui">
                  Early Access · Now Open
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-display">
                  Join the Founding Waitlist
                </h2>
                <p className="text-sm md:text-base text-foreground/60 leading-relaxed font-sans">
                  We are launching a private beta in batches. Fill out the application below to secure your placement and help shape our development roadmap.
                </p>
              </div>

              {/* Error Callout */}
              {submitError && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-sans text-center">
                  {submitError}
                </div>
              )}

              {/* Referred Indicator */}
              {watch("referredBy") && (
                <div className="mb-6 p-3 rounded-lg border border-accent-primary/25 bg-accent-primary/5 text-[11px] font-sans text-accent-primary text-center">
                  ✓ Invite code applied: {watch("referredBy")} — Priority position boost active
                </div>
              )}

              {/* Actual Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto text-left">
                {/* 1. Email Address */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold text-foreground/80 tracking-wide uppercase font-ui">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@institution.com"
                    {...register("email")}
                    className={`w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-300 ${errors.email ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-white/[0.08] bg-obsidian-900 focus:border-accent-primary"}`}
                    style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-400 font-technical mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* 2. Experience Level */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase font-ui">
                    Trading Experience Level *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "beginner", label: "Beginner", desc: "< 1 Year" },
                      { value: "intermediate", label: "Intermediate", desc: "1-3 Years" },
                      { value: "advanced", label: "Advanced", desc: "3+ Years" },
                      { value: "institutional", label: "Institutional", desc: "Professional" },
                    ].map((level) => {
                      const isChecked = selectedExperience === level.value;
                      return (
                        <motion.label
                          key={level.value}
                          whileHover={{ scale: 1.02, translateY: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border text-center flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
                            isChecked
                              ? "bg-accent-primary/10 border-accent-primary text-foreground shadow-[0_0_15px_rgba(37,99,235,0.08)]"
                              : "bg-[var(--bg-elevated)] border-white/[0.08] text-foreground/60 hover:border-accent-primary/40 hover:bg-[var(--bg-overlay)]"
                          }`}
                        >
                          <input
                            type="radio"
                            value={level.value}
                            {...register("experience")}
                            className="absolute opacity-0 pointer-events-none"
                          />
                          <span className="text-sm font-semibold tracking-tight">{level.label}</span>
                          <span className="text-[10px] font-technical text-foreground/45 mt-0.5">{level.desc}</span>
                        </motion.label>
                      );
                    })}
                  </div>
                  {errors.experience && (
                    <span className="text-[10px] text-red-400 font-technical mt-1">
                      {errors.experience.message}
                    </span>
                  )}
                </div>

                {/* 3. Challenge */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="challenge" className="text-xs font-semibold text-foreground/80 tracking-wide uppercase font-ui">
                    Biggest Trading Decision Challenge *
                  </label>
                  <textarea
                    id="challenge"
                    rows={3}
                    placeholder="e.g. Overtrading after a loss, closing winners too early out of fear, or filters failing to block signal noise."
                    {...register("challenge")}
                    className={`w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-300 resize-none ${errors.challenge ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-white/[0.08] bg-obsidian-900 focus:border-accent-primary"}`}
                    style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                  />
                  {errors.challenge && (
                    <span className="text-[10px] text-red-400 font-technical mt-1">
                      {errors.challenge.message}
                    </span>
                  )}
                </div>

                {/* 4. Current Tools */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="tools" className="text-xs font-semibold text-foreground/80 tracking-wide uppercase font-ui">
                    Current Trading Tools & Platforms *
                  </label>
                  <input
                    id="tools"
                    type="text"
                    placeholder="e.g. TradingView, Excel, Python scripts, Terminal, Notion"
                    {...register("tools")}
                    className={`w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-300 ${errors.tools ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-white/[0.08] bg-obsidian-900 focus:border-accent-primary"}`}
                    style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                  />
                  {errors.tools && (
                    <span className="text-[10px] text-red-400 font-technical mt-1">
                      {errors.tools.message}
                    </span>
                  )}
                </div>

                {/* 5. Expectation */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="expectation" className="text-xs font-semibold text-foreground/80 tracking-wide uppercase font-ui">
                    What Would Make TradeXai Extremely Valuable To You? *
                  </label>
                  <textarea
                    id="expectation"
                    rows={3}
                    placeholder="e.g. A structured journal that categorizes emotional triggers, or a workspace to run rules audit checks before taking size."
                    {...register("expectation")}
                    className={`w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-300 resize-none ${errors.expectation ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-white/[0.08] bg-obsidian-900 focus:border-accent-primary"}`}
                    style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                  />
                  {errors.expectation && (
                    <span className="text-[10px] text-red-400 font-technical mt-1">
                      {errors.expectation.message}
                    </span>
                  )}
                </div>

                {/* Newsletter Opt-in Checkbox */}
                <div className="flex items-center space-x-3 pt-2">
                  <input
                    id="joinNewsletter"
                    type="checkbox"
                    {...register("joinNewsletter")}
                    className="w-4 h-4 rounded accent-accent-primary bg-[var(--bg-elevated)] border-white/[0.08] cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor="joinNewsletter" className="text-xs text-foreground/60 select-none cursor-pointer">
                    Join our monthly builder newsletter (Follow the build notes & insights).
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-4 max-w-xs">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(37,99,235,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-full py-4 px-6 rounded-full bg-accent-primary text-white font-semibold text-sm hover:bg-accent-primary/85 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center space-x-2 font-technical text-xs tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                        <span>SUBMITTING...</span>
                      </span>
                    ) : (
                      <>
                        <span>Join Founding Waitlist</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* STEP 2: REFERRAL DASHBOARD VIEW */
            <motion.div
              key="referral-dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto text-center py-6"
            >
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary mx-auto mb-6 shadow-[0_0_25px_rgba(37,99,235,0.1)]">
                <Award className="w-8 h-8" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2 font-display">
                Welcome to the founding queue.
              </h2>
              <p className="text-xs font-semibold text-accent-primary uppercase tracking-widest mb-6 font-ui">
                Application Received · ID: {registeredUser.referralCode}
              </p>
              
              <div className="bg-[var(--bg-elevated)] border border-white/[0.08] rounded-2xl p-6 mb-8 text-left space-y-4">
                <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                   We have queued your application details. You are registered as <span className="text-foreground font-semibold">{registeredUser.email}</span>. To fast-track your approval status, share your unique referral link:
                </p>

                {/* Link Copier Widget */}
                <div className="flex items-center space-x-2 bg-[var(--bg-surface)] rounded-xl p-1.5 border border-white/[0.08]">
                  <div className="flex-1 px-3 text-xs font-technical text-foreground/60 overflow-x-auto whitespace-nowrap select-all scrollbar-none py-2">
                    {getReferralUrl()}
                  </div>
                  <motion.button
                    onClick={copyToClipboard}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3.5 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-primary hover:bg-accent-primary hover:text-black transition-all cursor-pointer flex items-center gap-1.5 font-semibold text-xs shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <motion.button
                    onClick={triggerMockShare}
                    whileHover={{ scale: 1.015, borderColor: "rgba(37,99,235,0.4)" }}
                    whileTap={{ scale: 0.985 }}
                    className="flex-1 min-w-[140px] py-3 px-4 rounded-xl border border-white/[0.08] bg-[var(--bg-elevated)] text-foreground/80 hover:text-foreground transition-all text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-accent-primary" />
                    <span>Share on X (Twitter)</span>
                  </motion.button>
                </div>
              </div>

              {/* Milestone Tracks */}
              <div className="space-y-4 mb-8 text-left">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-technical">
                  Fast-Track Milestones
                </h3>
                <div className="space-y-3 font-ui text-xs">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/20 text-accent-primary">
                    <span className="flex items-center gap-2.5 font-semibold">
                      <Check className="w-4 h-4 shrink-0" /> Application Received
                    </span>
                    <span>✓ COMPLETE</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-white/[0.04] text-foreground/50">
                    <span className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 shrink-0" /> Invite 1 Friend
                    </span>
                    <span className="text-[10px] text-foreground/35 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> WAITING
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-white/[0.04] text-foreground/50">
                    <span className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 shrink-0 animate-pulse-slow" /> Invite 3 Friends for Priority Access
                    </span>
                    <span className="text-[10px] text-foreground/35 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> WAITING
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-foreground/45 flex items-center justify-center gap-2 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-ping" />
                <span>Invite 3 people &rarr; priority batch queue bypass</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

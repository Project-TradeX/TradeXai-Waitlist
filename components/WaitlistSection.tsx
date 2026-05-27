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
    const text = `Join the Founding Waitlist for TradeX — AI-assisted behavioral intelligence for modern market participants! Get priority queue status using my link:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
    analytics.trackCtaClick("share_twitter_referral", "waitlist_success");
  };

  return (
    <section
      id="waitlist"
      className="py-24 max-w-5xl mx-auto px-4 md:px-8 relative overflow-hidden"
    >
      {/* Background visual glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-accent/[0.02] rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-slow" />

      <div className="w-full glass-card rounded-3xl border-emerald-accent/20 p-8 md:p-12 relative overflow-hidden">
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
                <span className="font-technical text-[10px] font-semibold text-emerald-accent tracking-widest uppercase bg-emerald-accent/5 border border-emerald-accent/15 px-3 py-1 rounded-full">
                  [APPLICATION_QUEUE: LIVE]
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Join the Founding Waitlist
                </h2>
                <p className="text-sm md:text-base text-foreground/60 leading-relaxed font-sans">
                  We are launching a private beta in batches. Fill out the application below to secure your placement and help shape our development roadmap.
                </p>
              </div>

              {/* Error Callout */}
              {submitError && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-technical text-center">
                  [SYSTEM_ERROR] {submitError}
                </div>
              )}

              {/* Referred Indicator */}
              {watch("referredBy") && (
                <div className="mb-6 p-3 rounded-lg border border-emerald-accent/25 bg-emerald-accent/5 text-[11px] font-technical text-emerald-accent text-center">
                  ✓ INVITE CODE DETECTED: {watch("referredBy")} (Priority position boost active)
                </div>
              )}

              {/* Actual Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto text-left">
                {/* 1. Email Address */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold text-foreground/80 font-technical tracking-wider uppercase">
                    01 // EMAIL ADDRESS *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@institution.com"
                    {...register("email")}
                    className={`w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-300 ${errors.email ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-glass-border-strong bg-[var(--input-bg)] focus:border-emerald-accent"}`}
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
                  <label className="text-xs font-semibold text-foreground/80 font-technical tracking-wider uppercase">
                    02 // TRADING EXPERIENCE LEVEL *
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
                        <label
                          key={level.value}
                          className={`relative p-4 rounded-xl border text-center flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
                            isChecked
                              ? "bg-emerald-accent/10 border-emerald-accent text-foreground shadow-[0_0_15px_rgba(0,191,165,0.08)]"
                              : "bg-[var(--bg-elevated)] border-glass-border-strong text-foreground/60 hover:border-emerald-accent/40 hover:bg-[var(--bg-overlay)]"
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
                        </label>
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
                  <label htmlFor="challenge" className="text-xs font-semibold text-foreground/80 font-technical tracking-wider uppercase">
                    03 // WHAT IS YOUR BIGGEST COGNITIVE OR MARKET DECISION CHALLENGE? *
                  </label>
                  <textarea
                    id="challenge"
                    rows={3}
                    placeholder="e.g. Overtrading after a loss, closing winners too early out of fear, or filters failing to block signal noise."
                    {...register("challenge")}
                    className={`w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-300 resize-none ${errors.challenge ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-glass-border-strong bg-[var(--input-bg)] focus:border-emerald-accent"}`}
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
                  <label htmlFor="tools" className="text-xs font-semibold text-foreground/80 font-technical tracking-wider uppercase">
                    04 // WHICH TRADING TOOLS OR PLATFORMS DO YOU CURRENTLY USE? *
                  </label>
                  <input
                    id="tools"
                    type="text"
                    placeholder="e.g. TradingView, Excel, Python scripts, Terminal, Notion"
                    {...register("tools")}
                    className={`w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-300 ${errors.tools ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-glass-border-strong bg-[var(--input-bg)] focus:border-emerald-accent"}`}
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
                  <label htmlFor="expectation" className="text-xs font-semibold text-foreground/80 font-technical tracking-wider uppercase">
                    05 // WHAT WOULD MAKE TRADEX EXTREMELY VALUABLE TO YOU? *
                  </label>
                  <textarea
                    id="expectation"
                    rows={3}
                    placeholder="e.g. A structured journal that categorizes emotional triggers, or a workspace to run rules audit checks before taking size."
                    {...register("expectation")}
                    className={`w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-foreground placeholder:text-foreground/35 focus:outline-none transition-all duration-300 resize-none ${errors.expectation ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-glass-border-strong bg-[var(--input-bg)] focus:border-emerald-accent"}`}
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
                    className="w-4 h-4 rounded accent-emerald-accent bg-[var(--bg-elevated)] border-glass-border-strong cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor="joinNewsletter" className="text-xs text-foreground/60 select-none cursor-pointer">
                    Join our monthly builder newsletter (Follow the build notes & insights).
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-4 max-w-xs">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-full bg-emerald-accent text-black font-semibold text-sm hover:bg-emerald-accent/85 hover:shadow-[0_0_20px_rgba(0,245,196,0.25)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </button>
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
              <div className="w-16 h-16 rounded-2xl bg-emerald-accent/10 border border-emerald-accent/30 flex items-center justify-center text-emerald-accent mx-auto mb-6 shadow-[0_0_25px_rgba(0,245,196,0.1)]">
                <Award className="w-8 h-8" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Welcome to the founding queue.
              </h2>
              <p className="text-xs font-technical text-emerald-accent uppercase tracking-widest mb-6">
                [QUEUE_STATUS: VERIFIED // ID: {registeredUser.referralCode}]
              </p>
              
              <div className="bg-[var(--bg-elevated)] border border-glass-border-strong rounded-2xl p-6 mb-8 text-left space-y-4">
                <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                   We have queued your application details. You are registered as <span className="text-foreground font-semibold">{registeredUser.email}</span>. To fast-track your approval status, share your unique referral link:
                </p>

                {/* Link Copier Widget */}
                <div className="flex items-center space-x-2 bg-[var(--bg-surface)] rounded-xl p-1.5 border border-glass-border-strong">
                  <div className="flex-1 px-3 text-xs font-technical text-foreground/60 overflow-x-auto whitespace-nowrap select-all scrollbar-none py-2">
                    {getReferralUrl()}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-3.5 rounded-lg bg-emerald-accent/10 border border-emerald-accent/20 text-emerald-accent hover:bg-emerald-accent hover:text-black transition-all cursor-pointer flex items-center gap-1.5 font-semibold text-xs shrink-0"
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
                  </button>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={triggerMockShare}
                    className="flex-1 min-w-[140px] py-3 px-4 rounded-xl border border-glass-border-strong hover:border-emerald-accent/40 bg-[var(--bg-elevated)] text-foreground/80 hover:text-foreground transition-all text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-accent" />
                    <span>Share on X (Twitter)</span>
                  </button>
                </div>
              </div>

              {/* Milestone Tracks */}
              <div className="space-y-4 mb-8 text-left">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-technical">
                  Fast-Track Milestones
                </h3>
                <div className="space-y-3 font-technical text-xs">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-accent/5 border border-emerald-accent/20 text-emerald-accent">
                    <span className="flex items-center gap-2.5 font-semibold">
                      <Check className="w-4 h-4 shrink-0" /> Application Received
                    </span>
                    <span>✓ COMPLETE</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-glass-border text-foreground/50">
                    <span className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 shrink-0" /> Invite 1 Friend
                    </span>
                    <span className="text-[10px] text-foreground/35 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> WAITING
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-glass-border text-foreground/50">
                    <span className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 shrink-0 animate-pulse-slow" /> Invite 3 Friends for Priority Access
                    </span>
                    <span className="text-[10px] text-foreground/35 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> WAITING
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs font-technical text-foreground/45 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-ping" />
                <span>Invite 3 people &rarr; priority batch queue bypass</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

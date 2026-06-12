"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const analytics = useAnalytics();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg(null);
    analytics.trackCtaClick("newsletter_subscribe", "newsletter_section");

    try {
      // Submitting newsletter to waitlist route with newsletter status set
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          experience: "intermediate",
          challenge: "Newsletter Direct Signup",
          tools: "None",
          expectation: "Follow monthly build notes",
          joinNewsletter: true,
        }),
      });

      if (!response.ok) throw new Error("Could not subscribe. Email might already exist.");

      setIsSuccess(true);
      analytics.trackFormSubmit("newsletter_footer", "success");
      setEmail("");
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      analytics.trackFormSubmit("newsletter_footer", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="py-24 max-w-4xl mx-auto px-3 md:px-5 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full glass-card rounded-3xl border-accent-primary/15 p-8 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-8"
      >
        {/* Decorative ambient radial blur inside card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/[0.01] rounded-full blur-[100px] pointer-events-none" />
        {/* Shimmer top line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent rounded-t-3xl" />

        {/* Copy Column */}
        <div className="text-left space-y-3 md:max-w-md">
          <span className="text-[10px] font-semibold text-accent-primary tracking-widest uppercase font-ui">
            Monthly Newsletter
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Follow The <span className="text-shimmer">Build.</span>
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 leading-relaxed font-sans">
            Monthly updates, decision-science research logs, and development experiments directly from our core engineering cell. No fluff.
          </p>
        </div>

        {/* Form Column */}
        <div className="w-full md:max-w-xs flex flex-col space-y-2">
          {isSuccess ? (
            <div className="flex items-center space-x-3 text-accent-primary bg-accent-primary/5 border border-accent-primary/20 p-4 rounded-xl">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold block text-white">Verification Sent.</span>
                <span className="text-[10px] text-foreground/50 block font-technical">Check inbox for confirmation</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className={`w-full px-5 py-3 rounded-full border bg-obsidian-950/80 font-sans text-xs focus:outline-none focus:border-accent-primary transition-all duration-300 ${
                    errorMsg ? "border-red-500/50" : "border-white/[0.08]/40"
                  }`}
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full bg-accent-primary text-white font-semibold text-[10px] uppercase tracking-wider hover:bg-accent-primary/80 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 group"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  ) : (
                    <>
                      <span>Join</span>
                      <Send className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </>
                  )}
                </motion.button>
              </div>

              {errorMsg && (
                <span className="text-[9px] text-red-400 font-technical text-left block pl-2">
                  [SYSTEM_ERROR] {errorMsg}
                </span>
              )}
            </form>
          )}
          <span className="text-[9px] font-technical text-foreground/35 text-left pl-2">
            Secure, encrypted subscription. Opt-out at any time.
          </span>
        </div>
      </motion.div>
    </section>
  );
}

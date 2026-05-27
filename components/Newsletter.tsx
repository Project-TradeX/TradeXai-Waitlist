"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Send, CheckCircle2 } from "lucide-react";

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
      className="py-24 max-w-4xl mx-auto px-4 md:px-8 relative overflow-hidden"
    >
      <div className="w-full glass-card rounded-3xl border-emerald-accent/15 p-8 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Decorative ambient radial blur inside card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-accent/[0.01] rounded-full blur-[100px] pointer-events-none" />

        {/* Copy Column */}
        <div className="text-left space-y-3 md:max-w-md">
          <span className="font-technical text-[10px] font-semibold text-emerald-accent tracking-widest uppercase">
            // WEEKLY_LOGS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Follow The Build.
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 leading-relaxed font-sans">
            Monthly updates, decision-science research logs, and development experiments directly from our core engineering cell. No fluff.
          </p>
        </div>

        {/* Form Column */}
        <div className="w-full md:max-w-xs flex flex-col space-y-2">
          {isSuccess ? (
            <div className="flex items-center space-x-3 text-emerald-accent bg-emerald-accent/5 border border-emerald-accent/20 p-4 rounded-xl">
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
                  className={`w-full px-5 py-3 rounded-full border bg-obsidian-950/80 font-sans text-xs focus:outline-none focus:border-emerald-accent transition-all duration-300 ${
                    errorMsg ? "border-red-500/50" : "border-emerald-border/40"
                  }`}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full bg-emerald-accent text-black font-semibold text-[10px] uppercase tracking-wider hover:bg-emerald-accent/80 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                  ) : (
                    <>
                      <span>Join</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
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
      </div>
    </section>
  );
}

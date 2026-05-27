"use client";

import { useAnalytics } from "@/hooks/useAnalytics";

const NAV_LINKS = [
  { label: "Home",     id: "hero" },
  { label: "Waitlist", id: "waitlist" },
  { label: "Roadmap",  id: "roadmap" },
  { label: "Community",id: "community" },
  { label: "Updates",  id: "newsletter" },
];

const COMMUNITY_LINKS = [
  {
    label: "X (Twitter)",
    href: "https://twitter.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current shrink-0">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current shrink-0">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Indie Hackers",
    href: "https://indiehackers.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current shrink-0">
        <path d="M11.98 0C5.366 0 0 5.367 0 11.982c0 6.616 5.366 11.981 11.98 11.981 6.616 0 11.981-5.365 11.981-11.981C23.961 5.367 18.596 0 11.98 0zm-2.59 16.178H7.084V7.824h2.306v8.354zm5.21 0h-2.306V7.824h2.306v8.354z" />
      </svg>
    ),
  },
  {
    label: "Reddit",
    href: "https://reddit.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current shrink-0">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
  {
    label: "Y Combinator",
    href: "https://ycombinator.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current shrink-0">
        <path d="M0 24V0h24v24H0zM13.23 12.366L16.8 5.476h-1.869l-2.127 4.308c-.07.143-.14.308-.21.49a6.05 6.05 0 0 0-.182.49l-.028.056a17.5 17.5 0 0 0-.406-1.036L9.857 5.476H7.918l3.626 6.89v4.158h1.687v-4.158z" />
      </svg>
    ),
  },
];

const LEGAL_LINKS = [
  { label: "Privacy",  href: "#" },
  { label: "Terms",    href: "#" },
  { label: "Cookies",  href: "#" },
  { label: "Ethics",   href: "#" },
  { label: "Security", href: "#" },
];

export default function Footer() {
  const analytics = useAnalytics();

  const scrollTo = (id: string, label: string) => {
    analytics.trackCtaClick(`footer_${label.toLowerCase()}`, "footer");
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  };

  return (
    <footer
      aria-label="Site footer"
      className="relative w-full mt-auto border-t border-glass-border overflow-hidden"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      {/* Subtle ambient top glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 w-[500px] h-[1px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, var(--accent-primary), transparent)", opacity: 0.18 }}
      />

      {/* ── MAIN FOOTER GRID ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* ── LEFT — Brand ── */}
          <div className="flex flex-col gap-4">
            {/* Logo mark */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-6 h-6 rotate-45 rounded-sm flex items-center justify-center border transition-colors duration-300"
                style={{ background: "rgba(0,191,165,0.12)", borderColor: "var(--accent-primary)", opacity: 0.9 }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-primary)" }} />
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground font-sans">
                Trade<span style={{ color: "var(--accent-primary)" }}>X</span>
              </span>
            </div>

            {/* Tagline */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-semibold text-foreground/50 uppercase tracking-widest font-mono leading-none">
                AI-Driven Market Intelligence &amp;
              </p>
              <p className="text-[11px] font-semibold text-foreground/50 uppercase tracking-widest font-mono leading-none">
                Behavioral Decision Platform
              </p>
            </div>

            {/* One-liner */}
            <p className="text-xs text-foreground/40 leading-relaxed max-w-[220px] font-sans mt-1">
              Building structured intelligence for better market decisions.
            </p>

            {/* Accent divider */}
            <div
              className="w-8 h-px mt-1"
              style={{ background: "var(--accent-primary)", opacity: 0.35 }}
            />
          </div>

          {/* ── CENTER — Explore ── */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold text-foreground/35 tracking-widest uppercase font-mono">
              Explore
            </p>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id, link.label)}
                  className="group text-left text-sm text-foreground/55 hover:text-foreground transition-all duration-200 bg-transparent border-none cursor-pointer w-fit"
                  aria-label={`Navigate to ${link.label}`}
                >
                  <span className="relative">
                    {link.label}
                    <span
                      className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                      style={{ background: "var(--accent-primary)", opacity: 0.6 }}
                    />
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* ── RIGHT — Community ── */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold text-foreground/35 tracking-widest uppercase font-mono">
              Community
            </p>
            <nav aria-label="Community links" className="flex flex-col gap-2.5">
              {COMMUNITY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.trackCtaClick(`footer_social_${link.label.toLowerCase().replace(/\s/g, "_")}`, "footer")}
                  className="group flex items-center gap-2 text-sm text-foreground/55 hover:text-foreground transition-all duration-200 w-fit"
                  aria-label={`Visit TradeX on ${link.label}`}
                >
                  <span className="text-foreground/30 group-hover:text-emerald-accent transition-colors duration-200">
                    {link.icon}
                  </span>
                  <span className="relative">
                    {link.label}
                    <span
                      className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                      style={{ background: "var(--accent-primary)", opacity: 0.6 }}
                    />
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ── BOTTOM RULE ── */}
        <div
          className="w-full my-8"
          style={{ height: "1px", background: "var(--glass-border)", opacity: 0.6 }}
        />

        {/* ── BOTTOM ROW — Legal + Contact + Copyright ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

          {/* Legal links */}
          <nav aria-label="Legal links" className="flex items-center flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => analytics.trackCtaClick(`footer_legal_${link.label.toLowerCase()}`, "footer")}
                className="group relative text-[11px] text-foreground/40 hover:text-foreground/75 transition-colors duration-200 font-sans"
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                  style={{ background: "var(--accent-primary)", opacity: 0.45 }}
                />
              </a>
            ))}

            {/* Contact email */}
            <span className="text-foreground/20 text-[11px] hidden md:inline">·</span>
            <a
              href="mailto:contact.tradex1@gmail.com"
              onClick={() => analytics.trackCtaClick("footer_email_contact", "footer")}
              className="group relative text-[11px] text-foreground/40 hover:text-foreground/75 transition-colors duration-200 font-mono"
            >
              contact.tradex1@gmail.com
              <span
                className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ background: "var(--accent-primary)", opacity: 0.45 }}
              />
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-foreground/30 font-mono shrink-0">
            © {new Date().getFullYear()} TRADE_X. All rights reserved.
          </p>
        </div>

        {/* ── DISCLAIMER ── */}
        <p className="mt-3 text-[10px] text-foreground/25 font-sans leading-relaxed max-w-2xl">
          TradeX does not provide investment advice or execute trades. Users remain solely responsible for all financial decisions.
        </p>

        {/* ── MICROCOPY ── */}
        <div className="mt-5 flex items-center gap-2">
          {["Privacy-first", "Human-in-the-loop", "Explainability over prediction"].map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className="w-0.5 h-0.5 rounded-full"
                  style={{ background: "var(--accent-primary)", opacity: 0.4 }}
                />
              )}
              <span className="text-[10px] text-foreground/25 font-mono tracking-wide">{tag}</span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

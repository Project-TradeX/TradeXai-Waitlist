"use client";

import { useAnalytics } from "@/hooks/useAnalytics";

export default function Footer() {
  const analytics = useAnalytics();

  const handleScrollTo = (id: string, label: string) => {
    analytics.trackCtaClick(`footer_${label.toLowerCase()}`, "footer");
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  };

  const handleSocialClick = (label: string) => {
    analytics.trackCtaClick(`footer_social_${label.toLowerCase().replace(/\s/g, "_")}`, "footer");
  };

  const handleLegalClick = (label: string) => {
    analytics.trackCtaClick(`footer_legal_${label.toLowerCase()}`, "footer");
  };

  return (
    <footer
      aria-label="Site footer"
      className="relative w-full mt-auto border-t border-white/[0.04] bg-transparent overflow-hidden"
    >
      {/* ── MAIN FOOTER CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-12">
        
        {/* Five-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">
          
          {/* Column 1: Brand + Disclaimer */}
          <div className="lg:col-span-4 flex flex-col gap-5 pr-2">
            <button
              onClick={() => handleScrollTo("hero", "Logo")}
              className="flex items-center self-start bg-transparent border-none cursor-pointer group"
            >
              <img src="/footer-logo.png" alt="TradeXai AI Logo" className="h-10 w-auto object-contain shrink-0 opacity-90 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="flex flex-col gap-3 text-[11px] text-white/35 leading-relaxed font-sans max-w-sm">
              <p>
                AI-powered decision intelligence for modern traders and private funds. Built to consolidate workflows, audit behavioral patterns, and improve execution clarity.
              </p>
              <p>
                TradeXai systems are designed for educational and decision optimization purposes. No brokerage services are offered or implied.
              </p>
              <p className="text-[10px] text-white/25">
                © {new Date().getFullYear()} TradeXai Research Systems Inc. All rights reserved.
              </p>
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-white/25 tracking-widest uppercase font-ui">
              Products
            </h3>
            <div className="flex flex-col gap-2.5 text-xs font-sans">
              {[
                { label: "AI Decision Mirror", id: "vision" },
                { label: "Pre-Trade Auditor", id: "vision" },
                { label: "Playbook Workspace", id: "vision" },
                { label: "Adaptive Risk Guard", id: "vision" },
                { label: "Performance Analytics", id: "vision" },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => handleScrollTo(item.id, item.label)}
                  className="text-left text-white/40 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-white/25 tracking-widest uppercase font-ui">
              Company
            </h3>
            <div className="flex flex-col gap-2.5 text-xs font-sans">
              {[
                { label: "Research Papers", href: "#" },
                { label: "Methodology", href: "#" },
                { label: "Team", href: "#" },
                { label: "Safety & Privacy", href: "#" },
                { label: "Careers", href: "#" },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-white/40 hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Community */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-white/25 tracking-widest uppercase font-ui">
              Community
            </h3>
            <div className="flex flex-col gap-2.5 text-xs font-sans">
              {[
                { label: "X (Twitter)", href: "https://twitter.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "Reddit", href: "https://reddit.com" },
                { label: "Product Hunt", href: "https://producthunt.com" },
                { label: "F6S", href: "https://www.f6s.com" },
                { label: "Briefing Sessions", id: "community" },
              ].map(item => (
                'href' in item && item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick(item.label)}
                    className="text-white/40 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => handleScrollTo((item as any).id!, item.label)}
                    className="text-left text-white/40 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Column 5: Policies */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-white/25 tracking-widest uppercase font-ui">
              Policies
            </h3>
            <div className="flex flex-col gap-2.5 text-xs font-sans">
              {[
                { label: "Terms of Use" },
                { label: "Disclaimer" },
                { label: "Privacy Policy" },
                { label: "Cookies Policy" },
                { label: "Security & Ethics" },
              ].map(item => (
                <a
                  key={item.label}
                  href="#"
                  onClick={() => handleLegalClick(item.label)}
                  className="text-white/40 hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div
          className="w-full mt-10 mb-6"
          style={{ height: "1px", background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 50%, transparent 95%)" }}
        />

        {/* Giant watermark-style slogan */}
        <div className="w-full flex justify-center py-6 select-none pointer-events-none">
          <h2 className="text-[clamp(1.5rem,5vw,4.5rem)] font-extrabold text-white tracking-tighter leading-none uppercase font-display text-center drop-shadow-sm">
            LOOK FIRST / THEN LEAP.
          </h2>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/[0.04] text-[11px] text-white/30 font-sans">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="font-semibold text-white/20">
              © {new Date().getFullYear()} TRADEXAI
            </span>
            <span className="text-white/10">|</span>
            <a
              href="mailto:contact.tradex1@gmail.com"
              onClick={() => analytics.trackCtaClick("footer_email_contact", "footer")}
              className="hover:text-white transition-colors"
            >
              contact.tradex1@gmail.com
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/20 font-ui font-semibold uppercase tracking-wider text-[9px]">
            <span>Privacy-First</span>
            <span>·</span>
            <span>Human-in-the-loop</span>
            <span>·</span>
            <span>Explainability over prediction</span>
          </div>

        </div>

      </div>
    </footer>
  );
}

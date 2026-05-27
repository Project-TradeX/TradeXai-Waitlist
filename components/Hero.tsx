"use client";

import { useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analytics = useAnalytics();

  const scrollTo = (id: string, label: string) => {
    analytics.trackCtaClick(label, "hero");
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }
  };

  // Canvas — abstract node mesh visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    const mouse = { x: -999, y: -999, active: false };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const nodes = [
      { label: "DECISION",  xP: 0.12, yP: 0.30, pulse: 0, hover: 0, spd: 0.12 },
      { label: "BEHAVIOR",  xP: 0.38, yP: 0.52, pulse: 0, hover: 0, spd: 0.09 },
      { label: "PATTERN",   xP: 0.62, yP: 0.34, pulse: 0, hover: 0, spd: 0.14 },
      { label: "INSIGHT",   xP: 0.86, yP: 0.62, pulse: 0, hover: 0, spd: 0.08 },
    ];

    const particles: { x: number; y: number; spd: number; len: number; op: number }[] = [];
    for (let i = 0; i < 18; i++) {
      particles.push({ x: Math.random(), y: Math.random(), spd: 0.15 + Math.random() * 0.3, len: 20 + Math.random() * 50, op: 0.04 + Math.random() * 0.08 });
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const isLight = document.documentElement.classList.contains("light");

      // Fine grid
      ctx.strokeStyle = isLight ? "rgba(0, 138, 120, 0.04)" : "rgba(0, 191, 165, 0.018)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Particle rain
      particles.forEach(p => {
        p.y -= p.spd / H * 0.6;
        if (p.y < -0.1) { p.y = 1.1; p.x = Math.random(); }
        ctx.strokeStyle = isLight ? `rgba(0, 138, 120, ${p.op * 0.7})` : `rgba(0, 191, 165, ${p.op})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(p.x * W, p.y * H);
        ctx.lineTo(p.x * W, p.y * H + p.len);
        ctx.stroke();
      });

      // Resolve nodes
      const resolved = nodes.map(n => {
        const wx = Math.sin(t * 0.001 * n.spd) * 14;
        const wy = Math.cos(t * 0.001 * n.spd) * 14;
        const px = n.xP * W + wx;
        const py = n.yP * H + wy;
        const d = Math.hypot(px - mouse.x, py - mouse.y);
        n.hover += ((d < 120 && mouse.active ? 1 : 0) - n.hover) * 0.1;
        n.pulse = 0.5 + Math.sin(t * 0.003 + n.spd * 10) * 0.5;
        return { ...n, px, py };
      });

      // Connections
      for (let i = 0; i < resolved.length - 1; i++) {
        const a = resolved[i], b = resolved[i + 1];
        const tf = ((t * 0.0004 + i * 0.3) % 1);

        // Dim base line
        ctx.strokeStyle = isLight ? "rgba(0, 138, 120, 0.07)" : "rgba(0, 191, 165, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();

        // Animated gradient overlay
        const grad = ctx.createLinearGradient(a.px, a.py, b.px, b.py);
        const midDist = Math.hypot((a.px + b.px) / 2 - mouse.x, (a.py + b.py) / 2 - mouse.y);
        const alpha = midDist < 120 ? 0.65 : 0.18;
        const accentColor = isLight ? "rgba(0, 138, 120," : "rgba(0, 191, 165,";
        grad.addColorStop(Math.max(0, tf - 0.15), "transparent");
        grad.addColorStop(tf, `${accentColor}${alpha})`);
        grad.addColorStop(Math.min(1, tf + 0.15), "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();

        // Moving data packet
        const pkx = a.px + (b.px - a.px) * tf;
        const pky = a.py + (b.py - a.py) * tf;
        ctx.fillStyle = isLight ? "#008a78" : "#00bfa5";
        ctx.shadowColor = isLight ? "#008a78" : "#00bfa5";
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(pkx, pky, 2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes
      resolved.forEach(n => {
        const r = 8 + n.hover * 5;
        // Outer pulse ring
        ctx.strokeStyle = isLight ? `rgba(0, 138, 120, ${0.06 + n.hover * 0.12})` : `rgba(0, 191, 165, ${0.08 + n.hover * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(n.px, n.py, r * (2 + n.pulse * 0.5), 0, Math.PI * 2); ctx.stroke();
        // Main circle
        ctx.fillStyle = isLight ? "#ffffff" : "#040809";
        ctx.strokeStyle = n.hover > 0.05
          ? (isLight ? "#008a78" : "#00bfa5")
          : (isLight ? "rgba(0, 138, 120, 0.3)" : "rgba(0, 191, 165, 0.35)");
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Core dot
        ctx.fillStyle = isLight ? "#008a78" : "#00bfa5";
        ctx.beginPath(); ctx.arc(n.px, n.py, 3 + n.hover, 0, Math.PI * 2); ctx.fill();
        // Label
        ctx.fillStyle = n.hover > 0.05
          ? (isLight ? "#008a78" : "#00bfa5")
          : (isLight ? "rgba(26, 31, 38, 0.8)" : "rgba(236, 239, 237, 0.8)");
        ctx.font = `bold 9px JetBrains Mono, monospace`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.px, n.py + r + 16);
        // Sub label on hover
        if (n.hover > 0.05) {
          ctx.fillStyle = isLight ? "rgba(0, 138, 120, 0.7)" : "rgba(0, 191, 165, 0.6)";
          ctx.font = "8px Inter, sans-serif";
          const subs: Record<string, string> = { DECISION: "Entry Point", BEHAVIOR: "Emotional Drift", PATTERN: "Cognitive Bias", INSIGHT: "Intentional Edge" };
          ctx.fillText(subs[n.label] ?? "", n.px, n.py + r + 28);
        }
      });

      // Mouse glow
      if (mouse.active) {
        const rg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        const glowColor = isLight ? "rgba(0, 138, 120, 0.03)" : "rgba(0, 191, 165, 0.05)";
        rg.addColorStop(0, glowColor);
        rg.addColorStop(1, "transparent");
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2); ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; mouse.x = -999; mouse.y = -999; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col overflow-hidden">

      {/* ── TOP ROW ── exact layout from reference image */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 md:px-10 pt-32 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* LEFT: badge + headline */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Badge pill — matches "Proudly Open-source on GitHub" style */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border border-emerald-border bg-emerald-border/5 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" />
              <span className="text-[11px] font-semibold text-foreground/80 tracking-widest uppercase">
                Founding Waitlist Open
              </span>
            </motion.div>

            {/* Big bold headline — same weight/size as reference */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-[1.05] tracking-tight text-foreground"
            >
              Make Better<br />
              Market{" "}
              <span className="text-emerald-accent">Decisions.</span>
            </motion.h1>
          </div>

          {/* RIGHT: description + CTA buttons — exactly like reference layout */}
          <div className="lg:col-span-5 flex flex-col gap-5 lg:pt-10">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-[15px] text-foreground/65 leading-relaxed max-w-sm"
            >
              AI-assisted behavioral intelligence for modern traders and intentional
              market participants. Reduce noise, audit patterns, build discipline.
            </motion.p>

            {/* Dual CTAs — reference style: one solid teal, one dark bordered */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <button
                onClick={() => scrollTo("waitlist", "Join Early Access")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-accent text-black font-semibold text-[13px] hover:bg-emerald-accent/90 hover:shadow-[0_0_24px_rgba(0,191,165,0.35)] transition-all duration-300 cursor-pointer"
              >
                Join Early Access
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo("why-tradex", "See Our Vision")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-glass-border-strong bg-foreground/5 text-foreground/85 font-semibold text-[13px] hover:border-emerald-accent/30 hover:text-foreground transition-all duration-300 cursor-pointer backdrop-blur-sm"
              >
                See Our Vision
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── GLASS DASHBOARD CARD ── mimicking the Keldrón bottom panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35 }}
          className="mt-10 w-full rounded-xl overflow-hidden border border-glass-border-strong bg-glass-bg shadow-[0_24px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          style={{
            backdropFilter: "blur(28px) saturate(190%)",
            WebkitBackdropFilter: "blur(28px) saturate(190%)",
          }}
        >
          {/* Card top bar — mimics browser / terminal chrome */}
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b border-glass-border bg-obsidian-900/90"
          >
            <div className="flex items-center gap-4">
              {/* Window traffic-light dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[rgba(239,68,68,0.4)] border border-[rgba(239,68,68,0.4)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[rgba(234,179,8,0.4)] border border-[rgba(234,179,8,0.4)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[rgba(0,191,165,0.35)] border border-[rgba(0,191,165,0.35)]" />
              </div>
              <span className="font-mono text-[10px] text-foreground/40 tracking-wider">
                tradex / behavioral-workspace / <span className="text-emerald-accent/75">live-session</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 font-mono text-[9px] text-foreground/40">
              <span className="px-2 py-0.5 rounded border border-glass-border-strong text-emerald-accent/75">
                SYNCED
              </span>
              <span>⟨ serial, rack, risk &gt; 70 ⟩</span>
              <span className="border-l border-foreground/10 pl-3">Filters · 2</span>
              <span className="border-l border-foreground/10 pl-3">↓ Export</span>
            </div>
          </div>

          {/* Card body — two-column layout matching reference */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left sidebar */}
            <div className="md:col-span-3 border-r border-glass-border p-4 hidden md:block bg-obsidian-900/30">
              <p className="font-mono text-[9px] text-foreground/35 tracking-widest uppercase mb-2">Views</p>
              <nav className="flex flex-col gap-0.5">
                {[
                  { label: "All decisions", count: "248", active: false },
                  { label: "High conviction", count: "42", active: true },
                  { label: "Emotional flags", count: "18", active: false },
                  { label: "Scaling fast", count: "30", active: false },
                  { label: "By session", count: "54", active: false },
                  { label: "By bias type", count: "9", active: false },
                ].map(item => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-all ${
                      item.active
                        ? "bg-emerald-border text-emerald-accent font-semibold"
                        : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`font-mono text-[10px] ${item.active ? "text-emerald-accent" : "text-foreground/30"}`}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </nav>

              <p className="font-mono text-[9px] text-foreground/35 tracking-widest uppercase mt-4 mb-2">Modules</p>
              {["Behavioral Mirror", "Risk Workspace", "Learning Engine"].map(m => (
                <div key={m} className="px-3 py-1.5 text-[11px] text-foreground/50 hover:text-foreground hover:bg-foreground/5 cursor-pointer transition-colors rounded-md">
                  {m}
                </div>
              ))}
            </div>

            {/* Right main panel — stats + canvas viz */}
            <div className="md:col-span-9 flex flex-col">
              {/* Top stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-glass-border">
                {[
                  { label: "SESSIONS", value: "1,248", delta: "+18 this wk" },
                  { label: "AVG CLARITY", value: "7.8", delta: "↑ 3.2%" },
                  { label: "BIAS EVENTS", value: "42", delta: "+0" },
                  { label: "IMPROVEMENT", value: "88%", delta: "quarterly" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`p-4 ${i < 3 ? "border-r border-glass-border" : ""}`}
                  >
                    <p className="font-mono text-[9px] text-foreground/45 tracking-widest uppercase mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
                    <p className="text-[10px] text-foreground/40 font-mono mt-0.5">{stat.delta}</p>
                  </div>
                ))}
              </div>

              {/* Canvas visualization area */}
              <div className="relative flex-1 min-h-[280px]">
                {/* Chart label */}
                <div className="absolute top-4 left-4 font-mono text-[10px] text-foreground/40 flex items-center gap-4 z-10">
                  <span>BEHAVIORAL PATTERN FLOW — LIVE VISUALIZATION</span>
                  <span className="flex items-center gap-1.5 text-emerald-accent/75">
                    <span className="w-6 h-px bg-emerald-accent/60 inline-block" /> avg clarity
                  </span>
                  <span className="flex items-center gap-1.5 text-foreground/30">
                    <span className="w-6 h-px bg-foreground/25 inline-block" style={{ borderStyle: "dashed" }} /> sessions &gt; 70
                  </span>
                </div>

                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* Bottom data table rows */}
              <div className="border-t border-glass-border">
                <div className="grid grid-cols-5 px-4 py-2 font-mono text-[9px] text-foreground/35 tracking-widest uppercase border-b border-glass-border">
                  {["PATTERN TYPE", "SESSION", "FREQ", "RISK", "ACTION"].map(h => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
                {[
                  { pattern: "FOMO Entry", session: "S-4860-17", freq: "+82%", risk: 72, action: "cool-down 10m" },
                  { pattern: "Revenge Trade", session: "A-1102-09", freq: "+64%", risk: 58, action: "review logs" },
                  { pattern: "Early Exit", session: "W5-2", freq: "+41%", risk: 54, action: "monitor" },
                  { pattern: "Bias Override", session: "S-2210-01", freq: "+22%", risk: 38, action: "—" },
                ].map((row) => (
                  <div key={row.session} className="grid grid-cols-5 px-4 py-2.5 border-b border-glass-border/40 text-[11px] font-mono hover:bg-foreground/5 transition-colors">
                    <span className="text-foreground/80 font-semibold">{row.pattern}</span>
                    <span className="text-foreground/40">{row.session}</span>
                    <span className="text-emerald-accent font-semibold">{row.freq}</span>
                    <span className="flex items-center gap-2">
                      <span className="h-1 w-12 rounded-full bg-foreground/10 overflow-hidden">
                        <span
                          className="h-full block rounded-full"
                          style={{
                            width: `${(row.risk / 100) * 100}%`,
                            background: row.risk > 65 ? "rgba(239,68,68,0.7)" : "rgba(0,191,165,0.7)"
                          }}
                        />
                      </span>
                      <span className="text-foreground/50">{row.risk}</span>
                    </span>
                    <span className="text-foreground/40">{row.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust row below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center gap-6 mt-6"
        >
          {[
            { dot: true, label: "Built in Public" },
            { dot: true, label: "Early Community" },
            { dot: true, label: "Research Driven" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent/60" />
              <span className="text-[11px] text-foreground/45 font-medium tracking-wide">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

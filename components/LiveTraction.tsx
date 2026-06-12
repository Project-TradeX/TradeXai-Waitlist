"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Video, Globe2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface MetricItem {
  id: string;
  label: string;
  target: number;
  current: number;
  suffix: string;
  icon: any;
}

export default function LiveTraction() {
  const [metrics, setMetrics] = useState<MetricItem[]>([
    { id: "waitlist",   label: "Waitlist Members",        target: 1248, current: 0, suffix: "+", icon: Users    },
    { id: "interviews", label: "Interviews Conducted",     target: 52,   current: 0, suffix: "",  icon: Video    },
    { id: "community",  label: "Community Members",        target: 680,  current: 0, suffix: "+", icon: Globe2   },
    { id: "countries",  label: "Countries Represented",    target: 24,   current: 0, suffix: "",  icon: Sparkles },
  ]);

  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTractionData = async () => {
      try {
        const response = await fetch("/api/traction");
        if (!response.ok) throw new Error();
        const data = await response.json();
        setMetrics((prev) =>
          prev.map((item) => {
            if (item.id === "waitlist" && data.waitlist) {
              return { ...item, target: data.waitlist };
            }
            return item;
          })
        );
      } catch (err) {
        // Silently default to baseline values
      }
    };
    fetchTractionData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          triggerCountUp();
        }
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, [hasAnimated, metrics]);

  const triggerCountUp = () => {
    const duration = 1800;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      setMetrics((prev) =>
        prev.map((item) => {
          const progress = frame / totalFrames;
          const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
          const currentCount = Math.round(item.target * easeProgress);
          return { ...item, current: frame === totalFrames ? item.target : currentCount };
        })
      );
      if (frame === totalFrames) clearInterval(counter);
    }, frameRate);
  };

  return (
    <section
      ref={containerRef}
      className="py-16 relative overflow-hidden"
    >
      {/* Glass background strip */}
      <div className="absolute inset-0 glass-panel border-y border-white/[0.04] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid-fine opacity-15 pointer-events-none" />

      {/* Accent blobs */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-accent-primary/[0.025] rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-3 md:px-5">
        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center space-y-3 group cursor-default"
              >
                {/* Icon Accent */}
                <motion.div
                  whileHover={{ scale: 1.12, backgroundColor: "rgba(37,99,235,0.15)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-11 h-11 rounded-xl bg-accent-primary/5 border border-white/[0.07] flex items-center justify-center text-accent-primary/80 group-hover:text-accent-primary transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Number Counter */}
                <div className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-0.5">
                  <motion.span
                    key={item.current}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                  >
                    {item.current.toLocaleString()}
                  </motion.span>
                  <span className="text-accent-primary text-2xl">{item.suffix}</span>
                </div>

                {/* Label */}
                <span className="text-xs text-foreground/50 font-sans tracking-wide">
                  {item.label}
                </span>

                {/* Underline animation on hover */}
                <div className="w-0 group-hover:w-8 h-[1px] bg-accent-primary/40 transition-all duration-500 rounded-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

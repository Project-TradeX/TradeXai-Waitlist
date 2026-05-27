"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Video, Globe2, Sparkles } from "lucide-react";

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
    { id: "waitlist", label: "Waitlist Members", target: 1248, current: 0, suffix: "+", icon: Users },
    { id: "interviews", label: "Interviews Conducted", target: 52, current: 0, suffix: "", icon: Video },
    { id: "community", label: "Community Members", target: 680, current: 0, suffix: "+", icon: Globe2 },
    { id: "countries", label: "Countries Represented", target: 24, current: 0, suffix: "", icon: Sparkles },
  ]);

  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real counts from Neon database API
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
            if (item.id === "feedback" && data.feedback) {
              // Can link feedback count dynamically if needed
            }
            return item;
          })
        );
      } catch (err) {
        // Silently default to standard target baseline values if offline
      }
    };

    fetchTractionData();
  }, []);

  // Viewport intersection detector to trigger count animation once
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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAnimated, metrics]);

  const triggerCountUp = () => {
    const duration = 1500; // Count-up time in milliseconds
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      
      setMetrics((prev) =>
        prev.map((item) => {
          // Easing out quadratic function
          const progress = frame / totalFrames;
          const easeProgress = progress * (2 - progress);
          const currentCount = Math.round(item.target * easeProgress);

          return {
            ...item,
            current: frame === totalFrames ? item.target : currentCount,
          };
        })
      );

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);
  };

  return (
    <section
      ref={containerRef}
      className="py-16 border-y border-emerald-border/40 bg-obsidian-800/20 max-w-7xl mx-auto px-4 md:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-dot-grid-fine opacity-20 pointer-events-none" />

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex flex-col items-center text-center space-y-2 group">
              {/* Icon Accent */}
              <div className="w-10 h-10 rounded-xl bg-emerald-accent/5 border border-emerald-border/30 flex items-center justify-center text-emerald-accent/80 group-hover:text-emerald-accent transition-colors duration-300">
                <Icon className="w-4.5 h-4.5" />
              </div>

              {/* Number Counter */}
              <div className="text-3xl md:text-4xl font-extrabold text-white font-technical tracking-tight flex items-center">
                <span>{item.current.toLocaleString()}</span>
                <span className="text-emerald-accent">{item.suffix}</span>
              </div>

              {/* Label */}
              <span className="text-xs text-foreground/50 font-sans tracking-wide">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

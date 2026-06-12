"use client";

import { useEffect, useRef } from "react";
import "@/instrumentation-client";

// Extend window interface for optional client-side tracking engines
declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, properties?: Record<string, any>) => void;
      pageview: () => void;
    };
  }
}

export function useAnalytics() {
  const scrollTracked = useRef<Record<number, boolean>>({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  const captureEvent = (eventName: string, properties?: Record<string, any>) => {
    // Console log events in development for quick debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics Event] "${eventName}"`, properties || "");
    }

    // Capture in PostHog if initialized
    if (typeof window !== "undefined" && window.posthog) {
      try {
        window.posthog.capture(eventName, properties);
      } catch (err) {
        console.error("Failed to capture PostHog event:", err);
      }
    }
  };

  // 1. Tracks Scroll Depth
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight <= 0) return;
      
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

      // Check thresholds: 25%, 50%, 75%, 100%
      [25, 50, 75, 100].forEach((threshold) => {
        if (scrollPercentage >= threshold && !scrollTracked.current[threshold]) {
          scrollTracked.current[threshold] = true;
          captureEvent("scroll_depth_reached", {
            depth: `${threshold}%`,
            url: window.location.href,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Tracks Initial Page View
  useEffect(() => {
    if (typeof window === "undefined") return;
    captureEvent("page_view", {
      path: window.location.pathname,
      referrer: document.referrer || "direct",
    });

    if (window.posthog) {
      try {
        window.posthog.pageview();
      } catch (err) {
        // Silently fail
      }
    }
  }, []);

  return {
    trackCtaClick: (ctaName: string, location: string) => {
      captureEvent("cta_clicked", { ctaName, location });
    },
    trackWaitlistSignup: (experience: string, challengeLength: number) => {
      captureEvent("waitlist_signup_completed", {
        experience,
        challengeLength,
      });
    },
    trackFormSubmit: (formName: string, status: "success" | "error", details?: Record<string, any>) => {
      captureEvent("form_submitted", {
        formName,
        status,
        ...details,
      });
    },
    trackTerminalCommand: (command: string, hasResponse: boolean) => {
      captureEvent("terminal_command_executed", {
        command,
        hasResponse,
      });
    },
  };
}
export type UseAnalyticsType = ReturnType<typeof useAnalytics>;

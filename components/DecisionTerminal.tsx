"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Send, Sparkles, Bot, User, ArrowUpRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const SUGGESTED_PROMPTS = [
  "How does TradeXai detect emotional bias patterns?",
  "What is the Pre-Trade Auditor?",
  "How do I join the founding waitlist?",
  "What makes TradeXai different from TradingView?",
];

const AI_RESPONSES: Record<string, string> = {
  default:
    "Great question. TradeXai is an AI-powered decision intelligence layer built for serious traders and private funds. It audits your decision-making workflows, isolates emotional bias patterns, and consolidates fragmented market setups — so you trade with clarity, not chaos. Want to learn about a specific feature?",
  bias:
    "TradeXai's AI engine analyzes your historical trade activity to detect cognitive patterns: overtrading after a loss, sizing escalation under FOMO, and rule deviations during high-volatility sessions. It flags these in real time with a structured bias score — giving you objective data on your own decision quality.",
  auditor:
    "The Pre-Trade Auditor is a structured compliance checkpoint that runs before you enter any position. It validates your setup against your personal playbook rules — confirming alignment on risk parameters, session conditions, and conviction scores. If your trade doesn't pass, you'll know exactly why.",
  waitlist:
    "You can join the founding waitlist by scrolling down to the application section. We're accepting traders in private batches — early applicants get priority access and the opportunity to directly influence the product roadmap through co-design sessions.",
  tradingview:
    "TradingView is an excellent charting and data platform. TradeXai is a decision intelligence layer — it doesn't replace your charts, it works alongside them. Where TradingView shows you what the market is doing, TradeXai audits what *you* are doing: your discipline, your biases, and your execution quality.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("bias") || lower.includes("emotion") || lower.includes("detect") || lower.includes("pattern"))
    return AI_RESPONSES.bias;
  if (lower.includes("auditor") || lower.includes("pre-trade") || lower.includes("compliance") || lower.includes("audit"))
    return AI_RESPONSES.auditor;
  if (lower.includes("waitlist") || lower.includes("join") || lower.includes("access") || lower.includes("beta"))
    return AI_RESPONSES.waitlist;
  if (lower.includes("tradingview") || lower.includes("different") || lower.includes("compare") || lower.includes("vs"))
    return AI_RESPONSES.tradingview;
  return AI_RESPONSES.default;
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DecisionTerminal() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Hello. I'm the TradeXai AI assistant — ask me anything about the platform, our mission, or how we help traders make better decisions. What would you like to know?",
      time: getTime(),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const analytics = useAnalytics();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);
    analytics.trackCtaClick("copilot_question", "decision_copilot");

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getResponse(text),
      time: getTime(),
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputVal);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMsg) return;
    try {
      await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contactEmail, message: contactMsg }),
      });
    } catch {}
    setContactSent(true);
    analytics.trackFormSubmit("copilot_contact", "success");
  };

  return (
    <section
      id="updates"
      className="py-24 max-w-5xl mx-auto px-3 md:px-5 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] bg-accent-primary/[0.025] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center space-y-4"
      >
        <span className="text-xs font-semibold text-accent-primary tracking-widest uppercase bg-accent-primary/5 px-3 py-1 rounded-full border border-accent-primary/10 font-ui animate-border-glow">
          AI Copilot
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
          Ask the TradeXai <span className="text-shimmer">Copilot</span>
        </h2>
        <p className="text-foreground/60 text-sm font-sans max-w-md">
          Have a question about the platform, our methodology, or how we can help your trading workflow? Our AI assistant is ready to help.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Chat Interface */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-white/[0.08] bg-obsidian-950/70 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 bg-obsidian-900/80 border-b border-white/[0.04]">
            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-accent-primary" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white font-ui">TradeXai AI Copilot</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                <span className="text-[10px] text-foreground/50">Online · Decision Intelligence</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 p-5 space-y-4 overflow-y-auto min-h-[320px] max-h-[380px] scrollbar-none"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border ${
                    msg.role === "assistant"
                      ? "bg-accent-primary/10 border-accent-primary/20 text-accent-primary"
                      : "bg-foreground/10 border-foreground/10 text-foreground/60"
                  }`}>
                    {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  {/* Bubble */}
                  <div className={`max-w-[78%] group flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed font-sans ${
                      msg.role === "assistant"
                        ? "bg-obsidian-800 border border-white/[0.04] text-foreground/90 rounded-tl-sm"
                        : "bg-accent-primary text-black font-medium rounded-tr-sm"
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-foreground/30 mt-1 px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center border bg-accent-primary/10 border-accent-primary/20 text-accent-primary">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-obsidian-800 border border-white/[0.04] flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-accent-primary/60 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleFormSubmit}
            className="border-t border-white/[0.04] px-4 py-3 flex items-center gap-2 bg-obsidian-900/60"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isTyping}
              placeholder="Ask about TradeXai..."
              className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-foreground/35 focus:outline-none font-sans disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isTyping || !inputVal.trim()}
              aria-label="Send message"
              className="w-8 h-8 rounded-lg bg-accent-primary text-black flex items-center justify-center hover:bg-accent-primary/85 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right panel: Suggested Prompts + Contact */}
        <div className="lg:col-span-4 space-y-5">
          {/* Suggested prompts */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <p className="text-[10px] text-foreground/45 uppercase tracking-widest font-ui font-semibold">
              Suggested Questions
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <motion.button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isTyping}
                  whileHover={{ scale: 1.015, x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full text-left px-3 py-2.5 rounded-xl border border-white/[0.04] bg-obsidian-900/50 text-[12px] text-foreground/70 hover:text-white hover:border-accent-primary/30 hover:bg-obsidian-800/50 transition-all duration-200 font-sans cursor-pointer disabled:opacity-50 flex items-center gap-2 group"
                >
                  <ArrowUpRight className="w-3 h-3 text-accent-primary/50 group-hover:text-accent-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 transition-transform duration-200" />
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
 
          {/* Direct contact */}
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[10px] text-foreground/45 uppercase tracking-widest font-ui font-semibold mb-3">
              Speak to the Founders
            </p>
            {contactSent ? (
              <div className="py-4 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-accent-primary mx-auto" />
                <p className="text-xs font-semibold text-white">Message received.</p>
                <p className="text-[10px] text-foreground/50">We'll reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-2.5">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.04] bg-obsidian-950 text-xs text-white placeholder:text-foreground/35 focus:outline-none focus:border-accent-primary/50 transition-all font-sans"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Your question or message..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.04] bg-obsidian-950 text-xs text-white placeholder:text-foreground/35 focus:outline-none focus:border-accent-primary/50 transition-all resize-none font-sans"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold hover:bg-accent-primary hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  Send Message
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

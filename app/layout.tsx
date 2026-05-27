import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-technical",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TradeX | AI-Assisted Market Intelligence & Decision Workspaces",
  description: "Reduce information overload, audit emotional trading patterns, and build intentional execution workflows. Join the founding waitlist for early access.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  keywords: ["market intelligence", "trading software", "behavioral finance", "decision support", "algorithmic workflow", "professional traders"],
  authors: [{ name: "TradeX Team" }],
  openGraph: {
    title: "TradeX — Make Better Market Decisions.",
    description: "AI-assisted behavioral intelligence for modern traders and intentional market participants.",
    url: "https://tradex.ai",
    siteName: "TradeX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TradeX Market Intelligence Workspace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeX — Make Better Market Decisions.",
    description: "AI-assisted behavioral intelligence for modern market participants.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground bg-dot-grid min-h-screen antialiased flex flex-col">
        {/* Inline theme init — runs synchronously before first paint to prevent flash */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tradex-theme');var d=(!t||t==='system')?window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark':t;document.documentElement.classList.add(d)}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        <ThemeProvider>
        
        {/* Dynamic Sweeping SVG Aurora Wave matching the provided image exactly */}
        <div className="aurora-glow absolute top-0 left-0 right-0 h-[900px] overflow-hidden pointer-events-none -z-10 select-none">
          <svg
            className="absolute top-[-250px] left-[-200px] w-[180%] h-[1200px] opacity-75 md:opacity-90"
            viewBox="0 0 1440 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Curved organic glowing wave paths */}
            <path
              d="M-100 -50 C 350 350, 750 200, 1600 -100 L 1600 -200 Z"
              fill="url(#aurora-glow-teal)"
              filter="url(#aurora-heavy-blur)"
            />
            <path
              d="M-50 180 C 420 520, 880 320, 1500 50 L 1500 -200 Z"
              fill="url(#aurora-glow-cyan)"
              filter="url(#aurora-heavy-blur)"
            />
            
            <defs>
              {/* Giant standard blur filter for butter-smooth aura light blending */}
              <filter
                id="aurora-heavy-blur"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                filterUnits="userSpaceOnUse"
              >
                <feGaussianBlur stdDeviation="110" result="blur" />
              </filter>
              
              <linearGradient
                id="aurora-glow-teal"
                x1="0"
                y1="0"
                x2="1440"
                y2="1000"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#00bfa5" stopOpacity="0.28" />
                <stop offset="45%" stopColor="#00a8cc" stopOpacity="0.18" />
                <stop offset="80%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
              
              <linearGradient
                id="aurora-glow-cyan"
                x1="0"
                y1="0"
                x2="1440"
                y2="1000"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="10%" stopColor="#0d9488" stopOpacity="0.22" />
                <stop offset="55%" stopColor="#00bfa5" stopOpacity="0.16" />
                <stop offset="90%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

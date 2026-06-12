import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyTradeXai from "@/components/WhyTradeXai";
import ProductPreview from "@/components/ProductPreview";
import WaitlistSection from "@/components/WaitlistSection";
import CommunitySection from "@/components/CommunitySection";
import BuildInPublic from "@/components/BuildInPublic";
import LiveTraction from "@/components/LiveTraction";
import Newsletter from "@/components/Newsletter";
import DecisionTerminal from "@/components/DecisionTerminal";
import MainSiteBanner from "@/components/MainSiteBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Floating Glass Navigation */}
      <Navbar />

      {/* Main content body */}
      <main className="flex-1 w-full flex flex-col items-stretch">
        {/* Section 1: Hero Visual Node Mesh Flow */}
        <Hero />

        {/* Section 2: Why TradeXai core value props */}
        <WhyTradeXai />

        {/* Section 3: Premium Technical Product Preview Workspaces */}
        <ProductPreview />

        {/* Section 4: Founding Waitlist high-converting signup form & Persistent Referral */}
        <WaitlistSection />

        {/* Section 5: Build TradeX With Us Collapsible Drawer Path Selection */}
        <CommunitySection />

        {/* Section 6: Expandable Weekly Build In Public Timeline */}
        <BuildInPublic />

        {/* Section 7: Dynamically Animated Traction Counter stats */}
        <LiveTraction />

        {/* Section 8: Newsletter follow-the-build capture */}
        <Newsletter />

        {/* Section 9: retro bash Decision Terminal for custom user queries */}
        <DecisionTerminal />

      </main>

      {/* Main Platform CTA Banner */}
      <MainSiteBanner />

      {/* Minimal Footer */}
      <Footer />
    </>
  );
}

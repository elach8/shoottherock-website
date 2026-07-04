import Image from "next/image";
import Navbar from "@/components/Navbar";
import { BRAND } from "@/lib/brand";
import Button from "@/components/Button";
import Section from "@/components/Section";
import Hero from "@/components/sections/Hero";
import Demo from "@/components/sections/Demo";
import WhyShootTheRock from "@/components/sections/WhyShootTheRock";
import BeatALegend from "@/components/sections/BeatALegend";
import Analytics from "@/components/sections/Analytics";
import Health from "@/components/sections/Health";
import Hardware from "@/components/sections/Hardware";
import Future from "@/components/sections/Future";
import Download from "@/components/sections/Download";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <Hero />
      <BeatALegend />
      <Demo />
      
      
      <Analytics />
      <Health />
      <Hardware />
      <Future />
      <Download />
      <Footer />

    </main>
  );
}
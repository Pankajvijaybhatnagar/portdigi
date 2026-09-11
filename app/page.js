import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Capabilities from "@/components/Capabilities";
import Portfolio from "@/components/Portfolio";
import ResultsBanner from "@/components/ResultsBanner";
import Process from "@/components/Process";
import ProcessTwo from "@/components/ProcessTwo";
import ROI from "@/components/ROI";
import WhyUs from "@/components/WhyUs";
import Comparison from "@/components/Comparison";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedBy />
      <Marquee />
      <Services />
      <Capabilities />
      <Portfolio />
      <ResultsBanner />
      <Process />
      <ProcessTwo />
      <ROI />
      <WhyUs />
      <Comparison />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import ResultsBanner from "@/components/ResultsBanner";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Portfolio />
      <ResultsBanner />
      <Process />
      <WhyUs />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}

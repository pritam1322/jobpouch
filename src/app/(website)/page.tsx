import IntegratedCompanies from "@/components/IntegratedCompanies";
import Analytics from "@/components/landingPages/Analytics";
import Features from "@/components/landingPages/Features";
import Footer from "@/components/landingPages/Footer";
import Hero from "@/components/landingPages/Hero";
import Pricing from "@/components/landingPages/Pricing";
import Templates from "@/components/landingPages/Templates";
import Testimonials from "@/components/landingPages/Testimonials";


export default function Home() {
  return (
    <main className="bg-neutral-900">

      <Hero />
      <Features />
      <Analytics />
      <Templates />
      <Testimonials />
      <Pricing />
      {/* <div className="max-w-7xl mx-auto my-4">
        <IntegratedCompanies />
      </div> */}
      <Footer />
    </main>
  );
}

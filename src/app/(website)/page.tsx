import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IntegratedCompanies from "@/components/IntegratedCompanies";


export default function Home() {
  return (
    <main className="">
      <div className="max-w-5xl mx-auto my-24">
        <Hero />
      </div>
      <div className="max-w-7xl mx-auto my-4">
        <IntegratedCompanies />
      </div>
      <Footer />
    </main>
  );
}

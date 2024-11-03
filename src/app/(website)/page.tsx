import Hero from "@/components/Hero";
import IntegratedCompanies from "@/components/IntegratedCompanies";


export default function Home() {
  return (
    <section>
      <div className="max-w-5xl mx-auto my-16">
        <Hero />
      </div>
      <div className="max-w-7xl mx-auto my-4">
        <IntegratedCompanies />
      </div>
    </section>
  );
}

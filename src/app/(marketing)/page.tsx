"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import Offers from "@/components/Offers";
import About from "@/components/About";
import Values from "@/components/Values";
import Services from "@/components/Services";
import Programs from "@/components/Programs";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import Process from "@/components/Process";
import PlanningGuide from "@/components/PlanningGuide";
import PlanRecommender from "@/components/PlanRecommender";
import PlanInquiryModal from "@/components/PlanInquiryModal";

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleInquire = (planName: string) => {
    setSelectedPlan(planName);
  };

  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <Offers />
      <Process />
      <PlanningGuide />
      <PlanRecommender onInquire={handleInquire} />
      <Services onInquire={handleInquire} />
      <Programs onInquire={handleInquire} />
      <Benefits />
      <Testimonials />
      <About />
      <Values />
      <FAQ />
      <Contact />

      <PlanInquiryModal 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        planName={selectedPlan || ''} 
      />
    </div>
  );
}

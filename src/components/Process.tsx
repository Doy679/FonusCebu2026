"use client";

import { siteData } from '@/data/siteData';
import { motion } from 'framer-motion';
import { Search, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

const iconMap: Record<string, any> = {
  Search,
  Send,
  ShieldCheck
};

export default function Process() {
  if (!siteData.processSteps) return null;

  return (
    <section className="process-section py-24 bg-white relative z-10" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-20">
          <Reveal width="100%">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary tracking-tight">How It Works</h2>
          </Reveal>
          <Reveal width="100%" delay={0.3}>
            <div className="divider w-20 h-1 bg-accent mx-auto"></div>
          </Reveal>
          <Reveal width="100%" delay={0.4}>
            <p className="text-base-content/70 mt-6 max-w-xl mx-auto">Providing a simple, transparent path to securing your family&apos;s future peace of mind.</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-6xl mx-auto">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-accent/20 z-0"></div>

          {siteData.processSteps.map((step, index) => {
            const Icon = iconMap[step.icon];
            
            return (
              <Reveal key={index} delay={0.2 + (index * 0.2)} width="100%">
                <div className="flex flex-col items-center text-center relative z-10 group">
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:scale-110 group-hover:bg-accent ring-8 ring-base-100">
                    {Icon && <Icon size={32} />}
                    <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold border-4 border-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4 text-primary leading-tight">{step.title}</h3>
                  <p className="text-base-content/70 text-sm leading-relaxed max-w-[250px]">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

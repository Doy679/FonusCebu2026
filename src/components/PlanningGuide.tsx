"use client";

import { siteData } from '@/data/siteData';
import { Reveal } from './Reveal';
import { Phone, ClipboardCheck, Layout, HeartHandshake, ArrowRight } from 'lucide-react';

const icons = [Phone, ClipboardCheck, Layout, HeartHandshake];

export default function PlanningGuide() {
  if (!siteData.planningGuide) return null;

  return (
    <section className="py-24 bg-white relative z-10" id="guide">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Header Content */}
            <div className="lg:w-1/3">
              <Reveal width="100%">
                <span className="text-accent font-bold tracking-[3px] text-[10px] uppercase mb-4 block">Educational Resource</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
                  What to do when a <span className="italic text-accent">Loved One</span> passes
                </h2>
                <p className="text-base-content/70 leading-relaxed mb-8">
                  We understand that these moments are difficult. Our step-by-step guide is designed to provide clarity and support when you need it most.
                </p>
                <div className="p-6 bg-base-100 rounded-2xl border border-black/5 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-3 text-primary">
                    <Phone size={20} className="text-accent" />
                    <span className="font-bold text-sm underline">{siteData.contact.phone[0]}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">24/7 Response Team Available</p>
                  <a href="#contact" className="btn btn-primary btn-sm rounded-full no-animation">Contact Support</a>
                </div>
              </Reveal>
            </div>

            {/* Checklist Content */}
            <div className="lg:w-2/3 w-full">
              <div className="grid grid-cols-1 gap-6">
                {siteData.planningGuide.map((item, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <Reveal key={index} delay={0.2 + (index * 0.1)} width="100%">
                      <div className="group flex gap-6 p-8 rounded-[32px] bg-base-100 border border-black/5 hover:border-accent/30 hover:shadow-xl transition-all duration-500">
                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-white text-accent flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                          <Icon size={28} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Step {index + 1}: {item.step}</span>
                          </div>
                          <h3 className="text-xl font-serif font-bold text-primary">{item.action}</h3>
                          <p className="text-sm text-base-content/70 leading-relaxed">
                            {item.details}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

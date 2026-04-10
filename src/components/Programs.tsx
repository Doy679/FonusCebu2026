"use client";

import { siteData } from '@/data/siteData';
import { Users, User, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

interface ProgramsProps {
  onInquire: (planName: string) => void;
}

export default function Programs({ onInquire }: ProgramsProps) {
  return (
    <section className="programs-section py-24 bg-base-200 relative z-10" id="programs">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-16">
          <Reveal width="100%">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Membership Programs</h2>
          </Reveal>
          <Reveal width="100%" delay={0.3}>
            <div className="divider w-20 h-1 bg-accent mx-auto"></div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {siteData.programs.map((program, index) => (
            <Reveal key={index} delay={0.2 + (index * 0.2)} width="100%">
              <div className="program-card bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5 flex flex-col h-full group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg group-hover:bg-accent transition-colors duration-500">
                    {index === 0 ? <Users size={28} /> : <User size={28} />}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary uppercase tracking-wide">{program.name}</h3>
                </div>
                
                <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-8 w-fit">
                  {program.description}
                </div>
                
                <ul className="space-y-4 mb-10 flex-1">
                  {program.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-base-content/80 text-sm leading-relaxed border-b border-dashed border-base-200 pb-4 last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => onInquire(program.name)}
                  className="btn btn-primary w-full rounded-full h-14 min-h-0 text-base font-bold shadow-lg group/btn"
                >
                  Inquire for Program <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

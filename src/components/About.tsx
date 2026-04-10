"use client";

import { siteData } from '@/data/siteData';
import { Eye, Target, History, ShieldCheck, Award, Users } from 'lucide-react';
import { Reveal } from './Reveal';
import Image from 'next/image';

export default function About() {
  return (
    <section className="features py-24 relative bg-white -mt-12 rounded-t-[30px] z-10" id="about">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-16">
          <Reveal width="100%">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Who We Are</h2>
          </Reveal>
          <Reveal width="100%" delay={0.3}>
            <div className="divider w-20 h-1 bg-accent mx-auto"></div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          <Reveal delay={0.2} width="100%">
            <div className="feature-box p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform h-full bg-base-100/50 border border-black/5">
              <div className="icon-wrapper w-[70px] h-[70px] bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-accent shadow-lg">
                <Eye size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4 text-primary uppercase tracking-wider">Our Vision</h3>
              <p className="text-xs uppercase leading-relaxed text-base-content/70">{siteData.about.vision}</p>
            </div>
          </Reveal>

          <Reveal delay={0.4} width="100%">
            <div className="feature-box p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform h-full bg-base-100/50 border border-black/5">
              <div className="icon-wrapper w-[70px] h-[70px] bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-accent shadow-lg">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4 text-primary uppercase tracking-wider">Our Mission</h3>
              <p className="text-xs uppercase leading-relaxed text-base-content/70">{siteData.about.mission}</p>
            </div>
          </Reveal>

          <Reveal delay={0.6} width="100%">
            <div className="feature-box p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform h-full bg-base-100/50 border border-black/5">
              <div className="icon-wrapper w-[70px] h-[70px] bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-accent shadow-lg">
                <History size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-4 text-primary uppercase tracking-wider">Company History</h3>
              <p className="text-xs uppercase leading-relaxed text-base-content/70">{siteData.about.history}</p>
            </div>
          </Reveal>
        </div>

        {/* Cooperative Trust Badges Section */}
        <Reveal width="100%" delay={0.8}>
          <div className="bg-primary rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <span className="inline-block px-4 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-[2px] mb-6">
                  Official Recognition
                </span>
                <h3 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                  A Fully Registered <br />
                  <span className="italic text-accent">Federation Cooperative</span>
                </h3>
                <p className="text-white/70 leading-relaxed mb-10 max-w-lg">
                  Organized in September 2009 and officially CDA Registered on July 2011, FONUS CEBU is committed to the highest standards of cooperative service and ethical funeral practices.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-accent" size={24} />
                    <div className="text-left">
                      <div className="text-sm font-bold">CDA Registered</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest">Since 2011</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="text-accent" size={24} />
                    <div className="text-left">
                      <div className="text-sm font-bold">Swedish Brand</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest">Quality Standard</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="text-accent" size={24} />
                    <div className="text-left">
                      <div className="text-sm font-bold">Member Owned</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest">Cooperative Power</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo / Badge Display */}
              <div className="lg:w-1/2 flex justify-center items-center gap-10">
                <div className="relative w-40 h-40 bg-white p-6 rounded-full shadow-inner flex items-center justify-center group hover:scale-105 transition-transform duration-500">
                  <Image src="/fonus.webp" alt="FONUS Logo" width={120} height={120} className="object-contain" />
                </div>
                <div className="relative w-40 h-40 bg-white p-6 rounded-full shadow-inner flex items-center justify-center group hover:scale-105 transition-transform duration-500 delay-100">
                  <Image src="/coop.png" alt="Coop Logo" width={120} height={120} className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

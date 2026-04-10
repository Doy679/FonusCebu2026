"use client";

import { siteData } from '@/data/siteData';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  if (!siteData.testimonials) return null;

  return (
    <section className="testimonials-section py-24 bg-base-100 relative z-10" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Member Stories</h2>
          <div className="divider w-20 h-1 bg-accent mx-auto"></div>
          <p className="text-base-content/70 mt-4">Hear from the community members we have the honor to serve.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {siteData.testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="testimonial-card bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all relative overflow-hidden group border border-black/5"
            >
              <div className="absolute top-0 right-0 p-6 text-accent/10 transition-transform group-hover:scale-110">
                <Quote size={80} />
              </div>
              
              <div className="relative z-10">
                <p className="text-base-content/80 text-lg italic leading-relaxed mb-8">
                  &quot;{testimonial.content}&quot;
                </p>
                
                <div className="flex items-center justify-between border-t border-base-200 pt-6">
                  <div>
                    <h4 className="font-bold text-primary text-lg">{testimonial.name}</h4>
                    <span className="text-xs uppercase tracking-widest text-accent font-bold">{testimonial.role}</span>
                  </div>
                  <div className="text-xs text-base-content/50 font-medium">{testimonial.date}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

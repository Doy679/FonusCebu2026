"use client";

import { siteData } from '@/data/siteData';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  if (!siteData.faqs) return null;

  return (
    <section className="faq-section py-24 bg-white relative z-10" id="faq">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="section-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Frequently Asked Questions</h2>
          <div className="divider w-20 h-1 bg-accent mx-auto"></div>
          <p className="text-base-content/70 mt-4">Everything you need to know about our memorial plans and services.</p>
        </div>

        <div className="space-y-4">
          {siteData.faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="collapse collapse-arrow bg-base-100 border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <input type="radio" name="faq-accordion" defaultChecked={index === 0} /> 
              <div className="collapse-title text-lg font-bold text-primary py-5 px-8">
                {faq.question}
              </div>
              <div className="collapse-content px-8 pb-6"> 
                <p className="text-base-content/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

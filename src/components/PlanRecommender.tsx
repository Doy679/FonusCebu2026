"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { siteData } from '@/data/siteData';

type Step = 'start' | 'budget' | 'viewing' | 'result';

interface PlanRecommenderProps {
  onInquire: (planName: string) => void;
}

export default function PlanRecommender({ onInquire }: PlanRecommenderProps) {
  const [step, setStep] = useState<Step>('start');
  const [answers, setAnswers] = useState({
    budget: '',
    viewing: '',
  });

  const getRecommendation = () => {
    if (answers.budget === 'premium') return siteData.packages[2]; // White Rose
    if (answers.budget === 'standard' || answers.viewing === 'comprehensive') return siteData.packages[1]; // Red Rose
    return siteData.packages[0]; // Rosa Peace
  };

  const recommendation = getRecommendation();

  const reset = () => {
    setStep('start');
    setAnswers({ budget: '', viewing: '' });
  };

  return (
    <section className="py-24 bg-base-100 relative z-10 overflow-hidden" id="help-me-choose">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-2xl border border-black/5 p-8 md:p-12 relative">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-12 text-accent/5 pointer-events-none">
            <Sparkles size={120} />
          </div>

          <AnimatePresence mode="wait">
            {step === 'start' && (
              <motion.div 
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Heart size={40} />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Not sure which plan to pick?</h2>
                <p className="text-base-content/70 mb-10 max-w-md mx-auto leading-relaxed">
                  Answer 2 quick questions and we&apos;ll recommend the best memorial plan for your family&apos;s needs and budget.
                </p>
                <button 
                  onClick={() => setStep('budget')}
                  className="btn btn-primary rounded-full px-10 h-14 min-h-0 text-base font-bold shadow-xl group"
                >
                  Help Me Choose <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 'budget' && (
              <motion.div 
                key="budget"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="py-6"
              >
                <span className="text-accent font-bold text-[10px] uppercase tracking-[3px] mb-4 block">Question 1 of 2</span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-8">What is your monthly budget range?</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'basic', label: 'Affordable (around ₱267/mo)', desc: 'Focus on essential dignified services.' },
                    { id: 'standard', label: 'Mid-range (around ₱516/mo)', desc: 'Balanced features with extra documentation support.' },
                    { id: 'premium', label: 'Premium (around ₱1,075/mo)', desc: 'Full-service arrangements with more floral tributes.' }
                  ].map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => {
                        setAnswers({ ...answers, budget: opt.id });
                        setStep('viewing');
                      }}
                      className="flex flex-col items-start p-6 rounded-2xl border-2 border-base-200 hover:border-accent hover:bg-accent/5 transition-all text-left group"
                    >
                      <span className="font-bold text-primary group-hover:text-accent transition-colors">{opt.label}</span>
                      <span className="text-sm text-base-content/60">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'viewing' && (
              <motion.div 
                key="viewing"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="py-6"
              >
                <span className="text-accent font-bold text-[10px] uppercase tracking-[3px] mb-4 block">Question 2 of 2</span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-8">What viewing arrangements do you prefer?</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'basic', label: '9 Days Home Viewing', desc: 'Traditional home viewing setup.' },
                    { id: 'comprehensive', label: 'Home Viewing + More Documentation', desc: 'Assistance with more copies of Death Certificate and extra flowers.' }
                  ].map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => {
                        setAnswers({ ...answers, viewing: opt.id });
                        setStep('result');
                      }}
                      className="flex flex-col items-start p-6 rounded-2xl border-2 border-base-200 hover:border-accent hover:bg-accent/5 transition-all text-left group"
                    >
                      <span className="font-bold text-primary group-hover:text-accent transition-colors">{opt.label}</span>
                      <span className="text-sm text-base-content/60">{opt.desc}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep('budget')} className="mt-8 text-xs font-bold text-primary/50 hover:text-primary flex items-center gap-2">
                  <RefreshCw size={12} /> Start Over
                </button>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest mb-6">
                  Recommended for you
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">{recommendation.name}</h3>
                <span className="text-accent font-bold text-sm uppercase tracking-widest block mb-8">{recommendation.tier}</span>
                
                <div className="bg-base-100 rounded-3xl p-8 mb-10 border border-black/5">
                  <div className="text-4xl font-serif font-bold text-primary mb-6">{recommendation.price}<small className="text-sm font-normal text-base-content/60">/mo</small></div>
                  <ul className="text-left space-y-3 max-w-xs mx-auto">
                    {recommendation.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-base-content/80">
                        <CheckCircle2 size={16} className="text-accent" /> {f}
                      </li>
                    ))}
                    <li className="text-[10px] text-base-content/40 italic pl-7">+ and more features</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => onInquire(recommendation.name)}
                    className="btn btn-primary rounded-full px-10"
                  >
                    Inquire Now
                  </button>
                  <button 
                    onClick={reset}
                    className="btn btn-ghost rounded-full flex items-center gap-2"
                  >
                    <RefreshCw size={16} /> Retake Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

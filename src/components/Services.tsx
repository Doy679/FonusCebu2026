"use client";

import { siteData } from '@/data/siteData';
import { CheckCircle, Info, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from './Reveal';
import { useLanguage } from '@/lib/LanguageContext';

interface ServicesProps {
  onInquire: (planName: string) => void;
}

export default function Services({ onInquire }: ServicesProps) {
  const [priceMode, setPriceMode] = useState<'monthly' | 'spot'>('monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const calculateSavings = (contractPrice: string | undefined, spotCash: string | undefined) => {
    if (!contractPrice || !spotCash) return null;
    const contract = parseInt(contractPrice.replace(/[^0-9]/g, ''));
    const spot = parseInt(spotCash.replace(/[^0-9]/g, ''));
    return (contract - spot).toLocaleString();
  };

  return (
    <section className="pricing py-24 bg-white relative z-10" id="packages">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-10">
          <Reveal width="100%">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">{t('section_plans')}</h2>
          </Reveal>
          <Reveal width="100%" delay={0.4}>
            <div className="divider w-20 h-1 bg-accent mx-auto mb-8"></div>
          </Reveal>
          
          {/* Price Toggle */}
          <Reveal width="100%" delay={0.5}>
            <div className="flex flex-col items-center gap-4 mb-12">
              <div className="inline-flex items-center p-1 bg-base-200 rounded-full border border-black/5">
                <button 
                  onClick={() => setPriceMode('monthly')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    priceMode === 'monthly' 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-base-content/60 hover:text-primary'
                  }`}
                >
                  {t('toggle_monthly')}
                </button>
                <button 
                  onClick={() => setPriceMode('spot')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    priceMode === 'spot' 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-base-content/60 hover:text-primary'
                  }`}
                >
                  {t('toggle_spot')} <span className="badge badge-accent badge-sm border-none text-[10px] py-0 h-4">{t('save_badge')}</span>
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {priceMode === 'monthly' ? (
                  <motion.p 
                    key="monthly-info"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-base-content/60 flex items-center gap-1.5"
                  >
                    <Info size={14} className="text-accent" /> Standard 5-year (60 months) installment plan.
                  </motion.p>
                ) : (
                  <motion.p 
                    key="spot-info"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-base-content/60 flex items-center gap-1.5"
                  >
                    <Sparkles size={14} className="text-accent" /> Pay once and get a significant discount on your memorial plan.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {siteData.packages.map((pkg, index) => {
            const savings = calculateSavings(pkg.contractPrice, pkg.spotCash);
            
            // Determine if this card should be highlighted (maroon)
            const isHighlighted = hoveredIndex !== null 
              ? hoveredIndex === index 
              : pkg.featured;
            
            // Determine if other cards should be dimmed
            const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
            
            return (
              <Reveal key={index} delay={0.2 + (index * 0.1)} width="100%">
                <motion.div 
                  layout
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`plan-card relative p-8 rounded-[32px] transition-all duration-500 border border-black/5 flex flex-col h-full ${
                    isHighlighted 
                      ? 'bg-primary text-white md:scale-105 shadow-2xl z-20' 
                      : 'bg-base-100 text-base-content z-10'
                  } ${isDimmed ? 'opacity-40 grayscale-[0.8] scale-95' : 'opacity-100 grayscale-0'}`}
                >
                  {pkg.featured && !isDimmed && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-[10px] tracking-[1px] font-bold uppercase whitespace-nowrap shadow-lg">
                      MOST POPULAR
                    </div>
                  )}
                  
                  {/* Flower Image */}
                  <div className="mx-auto mb-6 relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-sm">
                    {pkg.image && (
                      <Image 
                        src={pkg.image} 
                        alt={`${pkg.name} flower`} 
                        fill
                        className="object-cover"
                        sizes="288px"
                        quality={100}
                      />
                    )}
                  </div>

                  <div className="text-center mb-2">
                    {pkg.tier && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isHighlighted ? 'text-accent' : 'text-accent/80'}`}>
                        {pkg.tier}
                      </span>
                    )}
                    <h3 className={`plan-name text-lg font-bold uppercase tracking-[1px] leading-tight mt-1 ${isHighlighted ? 'text-white' : 'text-primary'}`}>
                      {pkg.name}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1 mb-8">
                    <AnimatePresence mode="wait">
                      {priceMode === 'monthly' ? (
                        <motion.div 
                          key="monthly-price"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="text-center"
                        >
                          <div className={`text-4xl font-serif font-bold flex items-baseline justify-center gap-1 ${isHighlighted ? 'text-white' : 'text-primary'}`}>
                            {pkg.price}<small className={`text-sm font-normal ${isHighlighted ? 'text-white/70' : 'text-base-content/60'}`}>/mo</small>
                          </div>
                          <div className={`text-xs mt-1 ${isHighlighted ? 'text-white/80' : 'text-base-content/70'}`}>
                            Total: <strong>{pkg.contractPrice}</strong> over 5 yrs
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="spot-price"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="text-center"
                        >
                          <div className={`text-4xl font-serif font-bold flex items-baseline justify-center gap-1 ${isHighlighted ? 'text-white' : 'text-primary'}`}>
                            {pkg.spotCash}
                          </div>
                          {savings && (
                            <div className={`inline-block mt-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${isHighlighted ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                              {t('you_save')} ₱{savings}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <ul className="plan-features space-y-3 mb-8 flex-1">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm leading-tight">
                        <CheckCircle size={16} className={`shrink-0 mt-0.5 ${isHighlighted ? 'text-accent' : 'text-accent'}`} />
                        <span className={isHighlighted ? 'text-white/90' : 'text-base-content/80'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4">
                    <button 
                      onClick={() => onInquire(pkg.name)}
                      className={`btn w-full rounded-full py-4 h-auto min-h-0 border-none shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-sm ${
                        isHighlighted 
                          ? 'bg-accent text-white hover:bg-white hover:text-primary' 
                          : 'bg-primary text-white hover:bg-secondary'
                      }`}
                    >
                      {priceMode === 'spot' ? t('get_spot_offer') : t('inquire_now')}
                    </button>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

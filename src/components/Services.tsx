import { siteData } from '@/data/siteData';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function Services() {
  return (
    <section className="pricing py-24 bg-white relative z-10" id="packages">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Our Life Plans</h2>
          <div className="divider w-20 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteData.packages.map((pkg, index) => (
            <div 
              key={index} 
              className={`plan-card relative p-8 rounded-[24px] transition-all border border-black/5 flex flex-col ${
                pkg.featured 
                  ? 'bg-primary text-white scale-105 shadow-2xl z-20' 
                  : 'bg-base-100 text-base-content z-10'
              }`}
            >
              {pkg.featured && (
                <div className="text-center mb-4 text-[10px] tracking-[1px] font-bold text-accent uppercase">MOST POPULAR</div>
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

              <h3 className={`plan-name text-lg font-bold uppercase tracking-[1px] mb-2 leading-tight ${pkg.featured ? 'text-white' : 'text-primary'}`}>
                {pkg.name}
              </h3>
              
              <div className="flex flex-col gap-1 mb-6">
                <div className={`text-4xl font-serif font-bold flex items-baseline gap-1 ${pkg.featured ? 'text-white' : 'text-primary'}`}>
                  {pkg.price}<small className={`text-sm font-normal ${pkg.featured ? 'text-white/70' : 'text-base-content/60'}`}>/mo</small>
                </div>
                <div className={`text-xs ${pkg.featured ? 'text-white/80' : 'text-base-content/70'}`}>
                  Contract Price: <strong>{pkg.contractPrice}</strong>
                </div>
                <div className={`text-xs ${pkg.featured ? 'text-white/80' : 'text-base-content/70'}`}>
                  Spot Cash: <strong>{pkg.spotCash}</strong>
                </div>
              </div>

              <ul className="plan-features space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm leading-tight">
                    <CheckCircle size={16} className="text-accent shrink-0 mt-0.5" />
                    <span className={pkg.featured ? 'text-white/90' : 'text-base-content/80'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a 
                  href="#contact" 
                  className={`btn w-full rounded-full py-3 h-auto min-h-0 border-none transition-transform hover:-translate-y-1 text-sm ${
                    pkg.featured 
                      ? 'bg-accent text-primary hover:bg-[#5E0B0B] hover:text-white' 
                      : 'bg-primary text-white hover:bg-secondary'
                  }`}
                >
                  {pkg.featured ? 'Choose Plan' : 'Inquire'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

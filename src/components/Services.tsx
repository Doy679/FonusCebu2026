import { siteData } from '@/data/siteData';
import { CheckCircle } from 'lucide-react';

export default function Services() {
  return (
    <section className="pricing py-24 bg-white relative z-10" id="packages">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Service Packages</h2>
          <div className="divider w-20 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteData.packages.map((pkg, index) => (
            <div 
              key={index} 
              className={`plan-card relative p-10 rounded-[24px] transition-all border border-black/5 flex flex-col ${
                pkg.featured 
                  ? 'bg-primary text-white scale-105 shadow-2xl z-20' 
                  : 'bg-base-100 text-base-content z-10'
              }`}
            >
              {pkg.featured && (
                <div className="text-center mb-4 text-[10px] tracking-[1px] font-bold text-accent uppercase">MOST POPULAR</div>
              )}
              <h3 className={`plan-name text-lg font-bold uppercase tracking-[2px] mb-2 ${pkg.featured ? 'text-white' : 'text-primary'}`}>
                {pkg.name}
              </h3>
              <div className={`plan-price text-4xl font-serif font-bold mb-8 flex items-baseline gap-1 ${pkg.featured ? 'text-white' : 'text-primary'}`}>
                {pkg.price}<small className={`text-base font-normal ${pkg.featured ? 'text-white/70' : 'text-base-content/60'}`}>/mo</small>
              </div>
              <ul className="plan-features space-y-4 mb-10">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={18} className="text-accent shrink-0" />
                    <span className={pkg.featured ? 'text-white/90' : 'text-base-content/80'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a 
                  href="#contact" 
                  className={`btn w-full rounded-full py-4 h-auto min-h-0 border-none transition-transform hover:-translate-y-1 ${
                    pkg.featured 
                      ? 'bg-accent text-primary hover:bg-[#b08d4b]' 
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

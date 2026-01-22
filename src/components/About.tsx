import { siteData } from '@/data/siteData';
import { Eye, Target, History } from 'lucide-react';

export default function About() {
  return (
    <section className="features py-24 relative bg-white -mt-12 rounded-t-[30px] z-10" id="about">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Who We Are</h2>
          <div className="divider w-20 h-1 bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="feature-box p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform">
            <div className="icon-wrapper w-[70px] h-[70px] bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
              <Eye size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4 text-primary uppercase">Our Vision</h3>
            <p className="text-sm uppercase leading-relaxed text-base-content/80">{siteData.about.vision}</p>
          </div>

          <div className="feature-box p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform">
            <div className="icon-wrapper w-[70px] h-[70px] bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4 text-primary uppercase">Our Mission</h3>
            <p className="text-sm uppercase leading-relaxed text-base-content/80">{siteData.about.mission}</p>
          </div>

          <div className="feature-box p-8 rounded-2xl text-center hover:-translate-y-1 transition-transform">
            <div className="icon-wrapper w-[70px] h-[70px] bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
              <History size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4 text-primary uppercase">Company History</h3>
            <p className="text-sm uppercase leading-relaxed text-base-content/80">{siteData.about.history}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

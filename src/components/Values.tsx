import { siteData } from '@/data/siteData';

export default function Values() {
  return (
    <section className="values-section py-24 bg-base-100 relative z-10" id="values">
      <div className="container mx-auto px-4">
        <div className="section-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">Our Core Values</h2>
          <p className="text-base-content/70">The principles that guide our federation.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {siteData.about.humaneValues?.map((value, idx) => (
            <div key={idx} className="value-card bg-white p-8 rounded-2xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border-b-4 border-transparent hover:border-accent">
              <span className="value-letter block text-4xl font-serif font-bold text-primary mb-2">{value.letter}</span>
              <span className="value-word text-[10px] uppercase tracking-wider font-semibold text-base-content/60 leading-tight">
                {value.word}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

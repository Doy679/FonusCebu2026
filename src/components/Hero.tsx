import { siteData } from '@/data/siteData';

export default function Hero() {
  return (
    <section id="home" className="hero-section min-h-[90vh] flex items-center justify-center relative bg-cover bg-center bg-fixed overflow-hidden" 
      style={{ 
        backgroundImage: "linear-gradient(to right, rgba(253, 251, 247, 0.95) 0%, rgba(253, 251, 247, 0.85) 40%, rgba(253, 251, 247, 0.3) 100%), url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2574&auto=format&fit=crop')" 
      }}>
      
      {/* Subtle organic texture to add depth */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>

      <div className="hero-content relative z-10 max-w-5xl text-center md:text-left px-6 pt-24 pb-12 animate-fade-in flex flex-col items-center md:items-start w-full">
        
        <span className="hero-badge inline-block border-2 border-primary/10 text-primary bg-white/60 backdrop-blur-md px-8 py-2.5 rounded-full text-xs font-bold tracking-[4px] uppercase mb-10 shadow-sm border-b-primary/20">
          {siteData.hero.badge}
        </span>
        
        <h1 className="hero-title text-5xl md:text-8xl font-serif font-bold mb-10 leading-[1.3] tracking-tight text-primary drop-shadow-sm uppercase">
          WE VALUE <br />
          <span className="inline-block pb-3 pr-3 -mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#8D6E63] to-accent italic normal-case leading-normal">
            Human Dignity
          </span>
        </h1>
        
        <p className="hero-desc text-lg md:text-2xl text-primary/85 mb-14 max-w-2xl leading-relaxed font-medium">
          {siteData.hero.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center md:justify-start w-full sm:w-auto">
          <a href="#packages" className="btn btn-primary bg-primary text-white border-primary hover:bg-secondary hover:border-secondary transition-all transform hover:-translate-y-1 hover:shadow-2xl rounded-full px-12 py-5 h-auto min-h-[4rem] text-base font-bold tracking-widest shadow-xl">
            {siteData.hero.buttonText}
          </a>
          <a href="#about" className="btn btn-outline border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all transform hover:-translate-y-1 hover:shadow-xl rounded-full px-12 py-5 h-auto min-h-[4rem] text-base font-bold tracking-widest backdrop-blur-sm bg-white/40">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}


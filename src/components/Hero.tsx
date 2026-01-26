import { siteData } from '@/data/siteData';

export default function Hero() {
  return (
    <section id="home" className="hero-section min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark Maroon Overlay for Video Visibility and Premium Feel */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: "linear-gradient(to bottom, rgba(56, 4, 4, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)" 
        }}
      ></div>
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0"></div>

      <div className="hero-content relative z-10 max-w-5xl text-center md:text-left px-6 pt-24 pb-12 animate-fade-in flex flex-col items-center md:items-start w-full">
        
        <span className="hero-badge inline-block border-2 border-accent/30 text-accent bg-black/20 backdrop-blur-md px-8 py-2.5 rounded-full text-xs font-bold tracking-[4px] uppercase mb-10 shadow-sm">
          {siteData.hero.badge}
        </span>
        
        <h1 className="hero-title text-4xl md:text-8xl font-serif font-bold mb-10 leading-[1.3] tracking-tight text-white drop-shadow-2xl uppercase">
          WE VALUE <br />
          <span className="inline-block pb-3 pr-3 -mb-3 text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-accent italic normal-case leading-normal">
            Human Dignity
          </span>
        </h1>
        
        <p className="hero-desc text-lg md:text-2xl text-white/90 mb-14 max-w-2xl leading-relaxed font-medium drop-shadow-lg">
          {siteData.hero.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center md:justify-start w-full sm:w-auto">
          <a href="#packages" className="btn btn-primary bg-accent text-primary border-accent hover:bg-white hover:text-primary transition-all transform hover:-translate-y-1 hover:shadow-2xl rounded-full px-12 py-5 h-auto min-h-[4rem] text-base font-bold tracking-widest shadow-xl">
            {siteData.hero.buttonText}
          </a>
          <a href="#about" className="btn btn-outline border-white/40 text-white hover:bg-white hover:text-primary hover:border-white transition-all transform hover:-translate-y-1 hover:shadow-xl rounded-full px-12 py-5 h-auto min-h-[4rem] text-base font-bold tracking-widest backdrop-blur-sm bg-white/10">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}


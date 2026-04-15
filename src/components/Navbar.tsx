"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { siteData } from '@/data/siteData';
import { useLanguage } from '@/lib/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsState] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsState(!isOpen);

  return (
    <header className="site-header fixed top-0 left-0 w-full h-20 flex items-center z-[9000] bg-primary shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center w-full">
        <Link href="/" className="logo flex items-center gap-3 no-underline shrink-0">
          <div className="bg-white p-0.5 rounded-full relative h-11 w-11 overflow-hidden border border-white/20">
            <Image 
              src="/fonus.webp" 
              alt="FONUS Logo" 
              fill
              priority
              className="object-cover scale-[1.6] origin-top"
              sizes="44px"
            />
          </div>
          <div className="flex flex-col">
            <span className="logo-text font-serif font-bold text-2xl text-white tracking-wide leading-none">
              {siteData.general.name}
            </span>
            <span className="text-[10px] text-white/80 font-medium tracking-widest uppercase leading-tight">
              Federation of Cooperative
            </span>
          </div>
          <div className="bg-white p-0.5 rounded-full relative h-11 w-11 overflow-hidden border border-white/20 ml-1">
            <Image 
              src="/coop.png" 
              alt="Coop Logo" 
              fill
              priority
              className="object-contain scale-125"
              sizes="44px"
            />
          </div>
        </Link>
        
        <div className="hamburger md:hidden text-3xl cursor-pointer text-white relative z-[1001]" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </div>
        
        <nav className={`
          fixed inset-0 w-screen h-screen bg-primary z-[999]
          flex flex-col justify-center items-center gap-8
          transition-all duration-300 ease-in-out
          md:relative md:inset-auto md:w-auto md:h-auto md:bg-transparent md:flex-row md:gap-8 md:p-0
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'}
        `}>
          <ul className="flex flex-col md:flex-row items-center gap-8 text-xl md:text-sm font-medium text-white/90 uppercase tracking-widest">
            <li><Link href="#home" onClick={() => setIsState(false)} className="hover:text-accent relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-accent after:transition-all hover:after:w-full">{t('nav_home')}</Link></li>
            <li><Link href="#about" onClick={() => setIsState(false)} className="hover:text-accent relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-accent after:transition-all hover:after:w-full">{t('nav_about')}</Link></li>
            <li><Link href="#values" onClick={() => setIsState(false)} className="hover:text-accent relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-accent after:transition-all hover:after:w-full">{t('nav_values')}</Link></li>
            <li><Link href="#packages" onClick={() => setIsState(false)} className="hover:text-accent relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-accent after:transition-all hover:after:w-full">{t('nav_packages')}</Link></li>
            <li><Link href="#location" onClick={() => setIsState(false)} className="hover:text-accent relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-accent after:transition-all hover:after:w-full">{t('nav_location')}</Link></li>
            
            {/* Language Switcher */}
            {mounted && (
              <li className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                <Globe size={14} className="text-white/70" />
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`text-[10px] font-bold transition-colors ${language === 'en' ? 'text-accent' : 'text-white/60 hover:text-white'}`}
                >
                  EN
                </button>
                <span className="text-white/20 text-[10px]">|</span>
                <button 
                  onClick={() => setLanguage('ceb')} 
                  className={`text-[10px] font-bold transition-colors ${language === 'ceb' ? 'text-accent' : 'text-white/60 hover:text-white'}`}
                >
                  CEB
                </button>
              </li>
            )}

            <li><Link href="#contact" onClick={() => setIsState(false)} className="btn bg-white text-primary border-none hover:bg-accent hover:text-white px-8 rounded-full normal-case">{t('nav_contact')}</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

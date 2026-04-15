"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function TransitionScreen() {
  const [show, setShow] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Start fade out after 0.7s
    const timer1 = setTimeout(() => {
      setOpacity(0);
    }, 700);

    // Unmount after fade out (1s total)
    const timer2 = setTimeout(() => {
      setShow(false);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!mounted || !show) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] bg-[#380404] flex items-center justify-center transition-opacity duration-300 ease-out"
      style={{ opacity: opacity }}
    >
      <div className="flex items-center gap-4 md:gap-8 animate-pulse">
        {/* Left Logo */}
        <div className="relative w-16 h-16 md:w-24 md:h-24 bg-white rounded-full p-1 border-2 border-white/20 shadow-lg overflow-hidden">
          <Image 
            src="/fonus.webp" 
            alt="FONUS Logo" 
            fill
            className="object-cover scale-[1.2] origin-top rounded-full"
            priority
          />
        </div>

        {/* Text */}
        <div className="text-center flex flex-col items-center">
          <h1 className="font-serif font-bold text-2xl md:text-4xl text-white tracking-widest leading-none mb-2">
            FONUS CEBU
          </h1>
          <p className="text-[10px] md:text-sm text-white/80 font-medium tracking-[0.3em] uppercase">
            Federation Cooperative
          </p>
        </div>

        {/* Right Logo */}
        <div className="relative w-16 h-16 md:w-24 md:h-24 bg-white rounded-full p-1 border-2 border-white/20 shadow-lg overflow-hidden">
          <Image 
            src="/coop.png" 
            alt="Coop Logo" 
            fill
            className="object-contain scale-[1.2] rounded-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BrandingHeader({ compact = false }: { compact?: boolean }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const leftLogoDark = PlaceHolderImages.find(img => img.id === 'left-logo');
  const leftLogoLight = PlaceHolderImages.find(img => img.id === 'left-logo-light');
  const cemLogo = PlaceHolderImages.find(img => img.id === 'cem-logo');
  const rightAltLogoDark = PlaceHolderImages.find(img => img.id === 'right-alt-logo');
  const rightAltLogoLight = PlaceHolderImages.find(img => img.id === 'right-alt-logo-light');
  const kickwiseLogo = PlaceHolderImages.find(img => img.id === 'kickwise-logo');

  const currentLeftLogo = (!mounted || isDark) ? leftLogoDark : (leftLogoLight || leftLogoDark);
  const currentRightLogo = (!mounted || isDark) ? rightAltLogoDark : (rightAltLogoLight || rightAltLogoDark);

  return (
    <header className={`w-full relative z-20 ${compact ? 'bg-card/80 border-b border-border' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex-shrink-0 transition-opacity duration-300">
          <Image 
            src={currentLeftLogo?.imageUrl || ''} 
            alt="Association Logo" 
            width={compact ? 45 : 60} 
            height={compact ? 45 : 60} 
            className="object-contain"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <h1 className="text-[9px] md:text-[11px] font-headline font-black text-foreground tracking-[0.2em] uppercase leading-tight text-right">
              College of <br className="md:hidden" /> Engineering Munnar
            </h1>
          </div>
          <Image 
            src={cemLogo?.imageUrl || ''} 
            alt="CEM Logo" 
            width={compact ? 40 : 55} 
            height={compact ? 40 : 55} 
            className="object-contain rounded-full"
          />
          <div className="h-8 w-[1px] bg-foreground/20 opacity-20" />
          <div className="transition-opacity duration-300">
            <Image 
              src={currentRightLogo?.imageUrl || ''} 
              alt="Right Logo" 
              width={compact ? 40 : 55} 
              height={compact ? 40 : 55} 
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className={`container mx-auto px-4 text-center ${compact ? 'py-4' : 'mt-1'}`}>
        <div className="space-y-0.5 flex flex-col items-center">
          <h1 className="text-[10px] md:text-xs font-headline font-black text-foreground tracking-[0.4em] uppercase mb-4 opacity-80">
            College of Engineering Munnar
          </h1>
          
          <h2 className={`${compact ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} font-headline font-black text-primary tracking-widest uppercase`}>
            Dhruva 2026
          </h2>
          
          <p className="text-[10px] md:text-xs font-body font-medium text-foreground opacity-90 lowercase italic">
            And
          </p>

          <div className={`${compact ? 'text-[9px] md:text-xs' : 'text-[11px] md:text-sm'} font-headline font-black text-primary tracking-[0.1em] uppercase flex flex-col items-center text-center leading-tight`}>
            <span>Department of</span>
            <span>Computer Science and Engineering</span>
          </div>
          
          <p className="text-[10px] font-headline font-black italic text-black dark:text-white uppercase tracking-[0.3em] mt-1">
            Presents
          </p>
        </div>

        {!compact && (
          <div className="mt-2 flex flex-col items-center gap-2">
            <a href="https://ibb.co/C3SScxtc" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 active:scale-95">
              <Image 
                src="https://i.ibb.co/FLddrGWr/Picsart-26-06-09-22-18-44-081.png" 
                alt="Kickwise Logo" 
                width={250} 
                height={250} 
                className="object-contain animate-pop"
                priority
              />
            </a>
            <div className="w-64 h-[1px] bg-primary/20 mt-2" />
            <p className="text-xs md:text-sm font-headline font-black text-foreground tracking-[0.5em] uppercase">
              PREDICTION LEAGUE
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

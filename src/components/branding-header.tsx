"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BrandingHeader({ compact = false }: { compact?: boolean }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initial check for dark mode
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Observer to watch for theme class changes
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

  // Logic to select the correct logo based on the current theme
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

      <div className={`container mx-auto px-4 text-center ${compact ? 'py-4' : 'mt-2 mb-8'}`}>
        <div className="space-y-4">
          <p className="text-[10px] md:text-sm font-headline font-bold uppercase tracking-[0.4em] text-foreground/80">
            College of Engineering Munnar
          </p>
          
          <div className="py-2" />

          <div className="space-y-2">
            <h2 className={`${compact ? 'text-2xl' : 'text-3xl md:text-4xl'} font-headline font-black text-primary tracking-widest uppercase`}>
              dhruva and Department of Computer Science
            </h2>
            
            <p className={`${compact ? 'text-[10px]' : 'text-lg md:text-xl'} font-headline font-black text-primary tracking-widest uppercase`}>
              CSE Association Munnar
            </p>
          </div>
          
          <p className="text-[11px] font-headline font-black italic text-primary/70 uppercase tracking-[0.3em] mt-4">
            Presents
          </p>
        </div>

        {!compact && (
          <div className="mt-8 flex flex-col items-center gap-6">
             <Image 
              src={kickwiseLogo?.imageUrl || ''} 
              alt="Kickwise Logo" 
              width={140} 
              height={140} 
              className="object-contain animate-pop"
            />
            <div className="w-48 h-[1px] bg-primary/20" />
            <p className="text-xs md:text-sm font-headline font-black text-foreground tracking-[0.5em] uppercase">
              2026 PREDICTION ARENA
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

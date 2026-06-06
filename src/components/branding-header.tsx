
"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BrandingHeader({ compact = false }: { compact?: boolean }) {
  const leftLogo = PlaceHolderImages.find(img => img.id === 'left-logo');
  const cemLogo = PlaceHolderImages.find(img => img.id === 'cem-logo');
  const rightAltLogo = PlaceHolderImages.find(img => img.id === 'right-alt-logo');
  const kickwiseLogo = PlaceHolderImages.find(img => img.id === 'kickwise-logo');

  return (
    <header className={`w-full relative z-20 ${compact ? 'bg-card/80 border-b border-border' : ''}`}>
      {/* Topmost Logo Bar */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left Logo */}
        <div className="flex-shrink-0">
          <Image 
            src={leftLogo?.imageUrl || ''} 
            alt="Association Logo" 
            width={compact ? 45 : 60} 
            height={compact ? 45 : 60} 
            className="object-contain"
          />
        </div>

        {/* Right Logos with Thin Divider */}
        <div className="flex items-center gap-4">
          <Image 
            src={cemLogo?.imageUrl || ''} 
            alt="CEM Logo" 
            width={compact ? 40 : 55} 
            height={compact ? 40 : 55} 
            className="object-contain rounded-full"
          />
          <div className="h-8 w-[1px] bg-foreground/20 opacity-20" />
          <Image 
            src={rightAltLogo?.imageUrl || ''} 
            alt="Right Logo" 
            width={compact ? 40 : 55} 
            height={compact ? 40 : 55} 
            className="object-contain"
          />
        </div>
      </div>

      {/* Center Branding Content */}
      <div className={`container mx-auto px-4 text-center ${compact ? 'py-4' : 'mt-2 mb-8'}`}>
        <div className="space-y-4">
          {/* Top Level: College Name */}
          <p className="text-[10px] md:text-sm font-headline font-bold uppercase tracking-[0.4em] text-foreground/80">
            College of Engineering Munnar
          </p>
          
          <div className="py-2" /> {/* Requested Gap */}

          {/* Middle Level: Dhruva and Dept (Same manner) */}
          <div className="space-y-2">
            <h2 className={`${compact ? 'text-2xl' : 'text-3xl md:text-4xl'} font-headline font-black text-primary tracking-widest uppercase`}>
              Dhruva
            </h2>
            
            <p className={`${compact ? 'text-[10px]' : 'text-lg md:text-xl'} font-headline font-black text-primary tracking-widest uppercase`}>
              Department of Computer Science and Engineering
            </p>
          </div>
          
          {/* Bottom Level: Presents */}
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

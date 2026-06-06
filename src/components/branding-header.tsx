"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BrandingHeader({ compact = false }: { compact?: boolean }) {
  const leftLogo = PlaceHolderImages.find(img => img.id === 'left-logo');
  const cemLogo = PlaceHolderImages.find(img => img.id === 'cem-logo');
  const rightAltLogo = PlaceHolderImages.find(img => img.id === 'right-alt-logo');
  const kickwiseLogo = PlaceHolderImages.find(img => img.id === 'kickwise-logo');
  const extraLogo = PlaceHolderImages.find(img => img.id === 'extra-logo');

  return (
    <header className={`w-full relative z-20 ${compact ? 'bg-card/80 border-b border-border' : ''}`}>
      {/* Topmost Logo Bar */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Left Logo */}
        <div className="flex-shrink-0">
          <Image 
            src={leftLogo?.imageUrl || ''} 
            alt="Association Logo" 
            width={compact ? 40 : 50} 
            height={compact ? 40 : 50} 
            className="object-contain"
          />
        </div>

        {/* Right Logos with Thin Divider */}
        <div className="flex items-center gap-3">
          <Image 
            src={cemLogo?.imageUrl || ''} 
            alt="CEM Logo" 
            width={compact ? 35 : 45} 
            height={compact ? 35 : 45} 
            className="object-contain rounded-full"
          />
          <div className="h-6 w-[0.5px] bg-foreground/10" />
          <Image 
            src={rightAltLogo?.imageUrl || ''} 
            alt="Alt Logo" 
            width={compact ? 35 : 45} 
            height={compact ? 35 : 45} 
            className="object-contain"
          />
        </div>
      </div>

      {/* Center Branding Content */}
      <div className={`container mx-auto px-4 text-center ${compact ? 'py-4' : 'mt-2 mb-8'}`}>
        <div className="space-y-0.5">
          <p className="text-[10px] md:text-xs font-headline font-bold uppercase tracking-[0.2em] text-foreground/70">
            College of Engineering Munnar
          </p>
          {!compact && <div className="py-2" />}
          <h2 className={`${compact ? 'text-xl' : 'text-3xl md:text-5xl'} font-headline font-black text-primary tracking-widest uppercase`}>
            Dhruva
          </h2>
          <p className="text-[9px] md:text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
            Department of Computer Science and Engineering
          </p>
          <p className="text-[10px] italic font-light text-foreground/40 mt-1 lowercase">
            Presents
          </p>
        </div>

        <div className={`${compact ? 'mt-2' : 'mt-6'} flex justify-center items-center gap-4`}>
          <div className={`relative ${compact ? 'w-40' : 'w-64 md:w-80'} aspect-[4/1]`}>
            <Image 
              src={kickwiseLogo?.imageUrl || ''} 
              alt="Kickwise 2026" 
              fill
              className="object-contain gold-glow"
              priority
            />
          </div>
          {!compact && (
             <Image 
              src={extraLogo?.imageUrl || ''} 
              alt="Extra Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
          )}
        </div>
        
        {!compact && (
          <p className="text-xs md:text-sm font-headline font-bold text-foreground mt-4 tracking-[0.4em] uppercase border-t border-primary/20 pt-4 inline-block">
            2026 PREDICTION ARENA
          </p>
        )}
      </div>
    </header>
  );
}

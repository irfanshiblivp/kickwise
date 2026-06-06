"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BrandingHeader() {
  const leftLogo = PlaceHolderImages.find(img => img.id === 'left-logo');
  const cemLogo = PlaceHolderImages.find(img => img.id === 'cem-logo');
  const rightAltLogo = PlaceHolderImages.find(img => img.id === 'right-alt-logo');
  const kickwiseLogo = PlaceHolderImages.find(img => img.id === 'kickwise-logo');

  return (
    <header className="w-full relative z-20">
      {/* Top Bar with Logos */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-start">
        {/* Left Logo */}
        <div className="flex-shrink-0">
          <Image 
            src={leftLogo?.imageUrl || ''} 
            alt="Association Logo" 
            width={60} 
            height={60} 
            className="object-contain"
          />
        </div>

        {/* Right Logos with Divider */}
        <div className="flex items-center gap-4">
          <Image 
            src={cemLogo?.imageUrl || ''} 
            alt="CEM Logo" 
            width={55} 
            height={55} 
            className="object-contain rounded-full"
          />
          <div className="h-10 w-[1px] bg-white/20" />
          <Image 
            src={rightAltLogo?.imageUrl || ''} 
            alt="Alt Logo" 
            width={55} 
            height={55} 
            className="object-contain"
          />
        </div>
      </div>

      {/* Center Branding Content */}
      <div className="container mx-auto px-4 text-center mt-4 mb-8">
        <div className="space-y-1">
          <p className="text-sm md:text-base font-headline font-semibold tracking-wider text-white/90">
            College of Engineering Munnar
          </p>
          <div className="py-4" /> {/* Gap */}
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-accent tracking-widest uppercase">
            Dhruva
          </h2>
          <p className="text-xs md:text-sm font-medium text-white/70 uppercase tracking-widest mt-2">
            Department of Computer Science and Engineering
          </p>
          <p className="text-sm italic font-light text-white/60 mt-4 lowercase">
            Presents
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-[320px] md:max-w-[480px] aspect-[4/1]">
            <Image 
              src={kickwiseLogo?.imageUrl || ''} 
              alt="Kickwise 2026" 
              fill
              className="object-contain gold-glow"
              priority
            />
          </div>
        </div>
        
        <p className="text-lg md:text-xl font-headline font-bold text-foreground mt-4 tracking-[0.3em] uppercase">
          2026 PREDICTION ARENA
        </p>
      </div>
    </header>
  );
}

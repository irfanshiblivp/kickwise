
"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BrandingHeader() {
  const collegeLogo = PlaceHolderImages.find(img => img.id === 'college-logo');
  const unionLogo = PlaceHolderImages.find(img => img.id === 'union-logo');
  const clubLogo = PlaceHolderImages.find(img => img.id === 'club-logo');

  return (
    <header className="w-full pt-8 pb-12">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-6 mb-8">
          <Image 
            src={collegeLogo?.imageUrl || ''} 
            alt="College Logo" 
            width={80} 
            height={80} 
            className="rounded-full border-2 border-primary/20 p-1 bg-card shadow-lg"
          />
          <Image 
            src={unionLogo?.imageUrl || ''} 
            alt="Union Logo" 
            width={70} 
            height={70} 
            className="rounded-full border-2 border-primary/20 p-1 bg-card shadow-lg"
          />
          <Image 
            src={clubLogo?.imageUrl || ''} 
            alt="Club Logo" 
            width={80} 
            height={80} 
            className="rounded-full border-2 border-primary/20 p-1 bg-card shadow-lg"
          />
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Dhruva 2026 Presents</p>
          <h2 className="text-xl md:text-2xl font-headline font-bold text-muted-foreground">
            College of Engineering Munnar
          </h2>
          <p className="text-sm md:text-md text-muted-foreground/80 font-medium">
            Department of Computer Science and Engineering
          </p>
        </div>

        <h1 className="text-6xl md:text-9xl font-headline font-black tracking-tighter text-primary drop-shadow-[0_0_30px_rgba(61,139,255,0.4)]">
          KICKWISE
        </h1>
        <p className="text-xl md:text-2xl font-headline font-bold text-foreground mt-2">
          2026 PREDICTION ARENA
        </p>
      </div>
    </header>
  );
}

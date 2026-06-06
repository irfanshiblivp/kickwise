"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandingHeader } from '@/components/branding-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, ChevronRight, UserPlus, LogIn, Info, Star } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const bgImage = PlaceHolderImages.find(img => img.id === 'world-cup-bg');

  useEffect(() => {
    const user = localStorage.getItem('kw_current_user');
    if (user) setIsAuth(true);
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-background selection:bg-primary selection:text-white">
      {/* Hero Background with Blur Overlay */}
      <div className="fixed inset-0 z-0">
        <Image 
          src={bgImage?.imageUrl || ''} 
          alt="World Cup Stadium" 
          fill 
          className="object-cover opacity-30 blur-[2px]"
          priority
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <BrandingHeader />

      <main className="container mx-auto px-4 z-10 flex flex-col items-center flex-grow max-w-5xl">
        <div className="text-center space-y-8 mb-16 mt-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-headline font-bold text-foreground mb-4 uppercase tracking-tighter">Official Predictor League</h1>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              Join the College of Engineering Munnar's premier prediction tournament for FIFA World Cup 2026. 
              Analyze real match-ups, submit your scores, and climb the campus leaderboard to become the ultimate football strategist.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuth ? (
              <>
                <Button 
                  onClick={() => router.push('/register')}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-headline font-bold px-8 h-12 transition-all hover:translate-y-[-2px] shadow-lg rounded-none"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  JOIN TOURNAMENT
                </Button>
                <Button 
                  onClick={() => router.push('/login')}
                  variant="outline" 
                  size="lg" 
                  className="border-primary/20 text-primary hover:bg-primary/5 font-headline font-bold px-8 h-12 rounded-none"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  MEMBER LOGIN
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => router.push('/dashboard')}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-headline font-bold px-10 h-14 transition-all shadow-xl rounded-none"
              >
                ACCESS ARENA
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Points & Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-16">
          <Card className="glass-morphism border-primary/10 overflow-hidden group">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                POINT DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/40 border border-primary/5">
                <span className="font-bold text-sm">EXACT SCORE MATCH</span>
                <span className="bg-primary text-white px-3 py-1 text-xs font-black rounded-full">10 PTS</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/40 border border-primary/5">
                <span className="font-bold text-sm">CORRECT OUTCOME (W/D/L)</span>
                <span className="bg-primary/20 text-primary px-3 py-1 text-xs font-black rounded-full">5 PTS</span>
              </div>
              <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest pt-2">
                * Predictions must be submitted before the countdown ends for each match.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-primary/10 group">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                TOURNAMENT RULES
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Only registered students of CEM Munnar are eligible for the leaderboard.</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Score updates are verified by department administrators after match completion.</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Points are automatically calculated and added to player profiles.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full py-8 text-foreground/30 text-[9px] uppercase tracking-[0.4em] text-center border-t border-border z-10">
        College of Engineering Munnar • Dhruva 2026 • CSE Association
      </footer>
    </div>
  );
}

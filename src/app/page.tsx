
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
  const stadiumBg = PlaceHolderImages.find(img => img.id === 'stadium-bg');

  useEffect(() => {
    const user = localStorage.getItem('kw_current_user');
    if (user) setIsAuth(true);
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-background selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Stadium Background with Grass and Blur */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image 
          src={stadiumBg?.imageUrl || ''} 
          alt="Stadium Background" 
          fill 
          className="object-cover opacity-20 blur-[6px] scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
      </div>

      <BrandingHeader />

      <main className="container mx-auto px-4 z-10 flex flex-col items-center flex-grow max-w-5xl">
        <div className="text-center space-y-8 mb-20">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-headline font-bold text-foreground/80 mb-4 uppercase tracking-[0.2em]">Official Predictor League</h1>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              Join the College of Engineering Munnar's premier prediction tournament for FIFA World Cup 2026. 
              Analyze real match-ups, submit your scores, and climb the campus leaderboard to become the ultimate football strategist.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {!isAuth ? (
              <>
                <Button 
                  onClick={() => router.push('/register')}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-headline font-bold px-10 h-14 transition-all hover:scale-105 shadow-2xl rounded-none border-2 border-primary"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  JOIN THE ARENA
                </Button>
                <Button 
                  onClick={() => router.push('/login')}
                  variant="outline" 
                  size="lg" 
                  className="border-primary/40 text-primary hover:bg-primary/5 font-headline font-bold px-10 h-14 rounded-none"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  MEMBER LOGIN
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => router.push('/dashboard')}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-headline font-bold px-12 h-16 transition-all shadow-2xl rounded-none border-2 border-white/10"
              >
                ACCESS ARENA
                <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        {/* Points & Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-20">
          <Card className="bg-card/40 backdrop-blur-sm border-primary/10 rounded-none overflow-hidden classic-border">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg font-headline font-black flex items-center gap-3 uppercase tracking-widest">
                <Star className="h-5 w-5 text-primary" />
                Point Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-5">
              <div className="flex items-center justify-between p-4 bg-background/60 border border-primary/5 group transition-colors hover:border-primary/20">
                <div className="space-y-1">
                  <span className="font-black text-sm uppercase block">Exact Score</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Perfect score prediction</span>
                </div>
                <span className="bg-primary text-white px-4 py-2 text-sm font-black rounded-none shadow-lg">+10 PTS</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-background/60 border border-primary/5 group transition-colors hover:border-primary/20">
                <div className="space-y-1">
                  <span className="font-black text-sm uppercase block">Correct Outcome</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Win/Draw/Loss correctly predicted</span>
                </div>
                <span className="bg-primary/10 text-primary px-4 py-2 text-sm font-black rounded-none border border-primary/20">+5 PTS</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-sm border-primary/10 rounded-none overflow-hidden classic-border">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg font-headline font-black flex items-center gap-3 uppercase tracking-widest">
                <Info className="h-5 w-5 text-primary" />
                Tournament Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <ul className="space-y-5 text-sm text-foreground/80">
                <li className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="font-medium">Only registered students of CEM Munnar are eligible for the leaderboard prizes.</span>
                </li>
                <li className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="font-medium">Score updates are verified by department administrators after match completion.</span>
                </li>
                <li className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="font-medium">Predictions must be submitted before the match lock time.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full py-10 text-foreground/30 text-[9px] uppercase font-bold tracking-[0.5em] text-center border-t border-border/50 z-10 bg-background/50">
        College of Engineering Munnar • Dhruva 2026 • CSE Association
      </footer>
    </div>
  );
}

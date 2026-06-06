"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandingHeader } from '@/components/branding-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, ChevronRight, UserPlus, LogIn, ShieldCheck, Zap } from 'lucide-react';
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
    <div className="min-h-screen relative flex flex-col items-center bg-background">
      {/* Hero Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage?.imageUrl || ''} 
          alt="World Cup Stadium" 
          fill 
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <BrandingHeader />

      <main className="container mx-auto px-4 z-10 flex flex-col items-center flex-grow">
        <div className="max-w-3xl text-center space-y-8 mb-16 mt-8">
          <p className="text-xl text-white/80 leading-relaxed font-light italic">
            "Experience the thrill of the World Cup like never before."
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {!isAuth ? (
              <>
                <Button 
                  onClick={() => router.push('/register')}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-bold px-10 h-14 rounded-sm transition-all hover:scale-105 shadow-xl classic-border"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  CREATE PROFILE
                </Button>
                <Button 
                  onClick={() => router.push('/login')}
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 text-white hover:bg-white/10 font-headline font-bold px-10 h-14 rounded-sm"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  PLAYER LOGIN
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => router.push('/dashboard')}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-bold px-12 h-16 rounded-sm transition-all hover:scale-105 shadow-[0_0_30px_rgba(218,165,32,0.3)]"
              >
                ACCESS ARENA
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
          <Card className="glass-morphism border-white/10 smooth-sweep hover:border-primary/40 group">
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <div className="bg-white/5 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline font-bold text-xl mb-3 tracking-wide">ELITE COMPETITION</h3>
              <p className="text-white/60 text-sm leading-relaxed">Submit precision scores before kick-off. Earn maximum points for exact results.</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/10 smooth-sweep hover:border-primary/40 group">
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <div className="bg-white/5 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline font-bold text-xl mb-3 tracking-wide">SECURE ANALYTICS</h3>
              <p className="text-white/60 text-sm leading-relaxed">Real-time leaderboard updates verified by campus administrators for total transparency.</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/10 smooth-sweep hover:border-primary/40 group">
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <div className="bg-white/5 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline font-bold text-xl mb-3 tracking-wide">AI STRATEGY</h3>
              <p className="text-white/60 text-sm leading-relaxed">Leverage the Kickwise AI engine for historical data analysis and form-based insights.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full py-8 text-white/30 text-[10px] uppercase tracking-[0.4em] text-center border-t border-white/5 z-10">
        College of Engineering Munnar • Dhruva 2026 • CSE Association
      </footer>
    </div>
  );
}

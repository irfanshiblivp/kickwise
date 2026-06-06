
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandingHeader } from '@/components/branding-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, ChevronRight, UserPlus, LogIn } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('kw_current_user');
    if (user) setIsAuth(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <BrandingHeader />

      <main className="container mx-auto px-4 z-10 flex flex-col items-center">
        <div className="max-w-2xl text-center space-y-6 mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The ultimate prediction platform for the FIFA World Cup 2026. 
            Join your fellow students from CEM Munnar, climb the leaderboard, and prove your football IQ.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuth ? (
              <>
                <Button 
                  onClick={() => router.push('/register')}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-headline font-bold px-8 h-14 rounded-full transition-all hover:scale-105 active:scale-95"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  JOIN THE ARENA
                </Button>
                <Button 
                  onClick={() => router.push('/login')}
                  variant="outline" 
                  size="lg" 
                  className="border-primary text-primary hover:bg-primary/10 font-headline font-bold px-8 h-14 rounded-full"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  LOGIN
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => router.push('/dashboard')}
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-headline font-bold px-8 h-14 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(132,125,255,0.4)]"
              >
                GO TO DASHBOARD
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
          <Card className="glass-morphism border-primary/20 smooth-sweep hover:border-primary/50">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-2xl mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline font-bold text-xl mb-2">Predict & Win</h3>
              <p className="text-muted-foreground text-sm">Submit your scores before kick-off. Earn 10 points for exact match, 5 for outcome.</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-accent/20 smooth-sweep hover:border-accent/50">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-accent/20 p-4 rounded-2xl mb-4">
                <Trophy className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-headline font-bold text-xl mb-2">Live Standings</h3>
              <p className="text-muted-foreground text-sm">Watch the leaderboard evolve in real-time as match results are confirmed by admins.</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-primary/20 smooth-sweep hover:border-primary/50">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-2xl mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline font-bold text-xl mb-2">AI Insights</h3>
              <p className="text-muted-foreground text-sm">Leverage our custom AI engine to analyze past stats and player form before you predict.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-auto py-8 text-muted-foreground/60 text-xs">
        © 2026 College of Engineering Munnar. Developed for Dhruva.
      </footer>
    </div>
  );
}

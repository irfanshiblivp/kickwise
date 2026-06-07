"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandingHeader } from '@/components/branding-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { Trophy, ChevronRight, UserPlus, LogIn, Star, Send, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { db } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [msgName, setMsgName] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const stadiumBg = PlaceHolderImages.find(img => img.id === 'stadium-bg');

  useEffect(() => {
    const user = localStorage.getItem('kw_current_user');
    if (user) setIsAuth(true);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName || !msgBody) return;
    db.inbox.add(msgName, msgBody);
    toast({ title: "Message Sent", description: "Admin will review your feedback soon." });
    setMsgName('');
    setMsgBody('');
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-background selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Stadium Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image 
          src={stadiumBg?.imageUrl || ''} 
          alt="Stadium Background" 
          fill 
          className="object-cover opacity-40 dark:opacity-20 blur-[4px] animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background dark:via-background/80" />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <BrandingHeader />

      <main className="container mx-auto px-4 z-10 flex flex-col items-center flex-grow max-w-5xl">
        <div className="text-center space-y-8 mb-20 mt-10 animate-fade-in-up">
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
                  className="border-primary/40 text-primary hover:bg-primary/5 font-headline font-bold px-10 h-14 rounded-none transition-all hover:scale-105"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  MEMBER LOGIN
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => router.push('/dashboard')}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-headline font-bold px-12 h-16 transition-all hover:scale-105 shadow-2xl rounded-none border-2 border-white/10"
              >
                ACCESS ARENA
                <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-20">
          <Card className="glass-morphism rounded-none classic-border animate-fade-in-up delay-1">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg font-headline font-black flex items-center gap-3 uppercase tracking-widest">
                <Star className="h-5 w-5 text-primary" />
                Point Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-5">
              <div className="flex items-center justify-between p-4 bg-background/60 border border-primary/5 group transition-all hover:border-primary/40 hover:translate-x-1">
                <div className="space-y-1">
                  <span className="font-black text-sm uppercase block">Exact Score</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Perfect score prediction</span>
                </div>
                <span className="bg-primary text-white px-4 py-2 text-sm font-black rounded-none shadow-lg transition-transform group-hover:scale-110">+10 XP</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-background/60 border border-primary/5 group transition-all hover:border-primary/40 hover:translate-x-1">
                <div className="space-y-1">
                  <span className="font-black text-sm uppercase block">Correct Outcome</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Win/Draw/Loss correctly predicted</span>
                </div>
                <span className="bg-primary/10 text-primary px-4 py-2 text-sm font-black rounded-none border border-primary/20 transition-transform group-hover:scale-110">+5 XP</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism rounded-none classic-border animate-fade-in-up delay-2">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg font-headline font-black flex items-center gap-3 uppercase tracking-widest">
                <MessageSquare className="h-5 w-5 text-primary" />
                Message Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    placeholder="Your Name / ID" 
                    className="rounded-none bg-white/50 border-primary/10 focus-visible:ring-primary/30"
                    value={msgName}
                    onChange={e => setMsgName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Report issues or tournament feedback..." 
                    className="rounded-none bg-white/50 border-primary/10 min-h-[100px] focus-visible:ring-primary/30"
                    value={msgBody}
                    onChange={e => setMsgBody(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-none font-bold uppercase text-xs tracking-widest h-12 shadow-md transition-all hover:shadow-primary/20">
                  <Send className="h-4 w-4 mr-2" /> SEND TO COMMAND CENTER
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full py-10 text-foreground/30 text-[9px] uppercase font-bold tracking-[0.5em] text-center border-t border-border/50 z-10 bg-background/50">
        College of Engineering Munnar • Dhruva 2026 • CSE Association
      </footer>
      <Toaster />
    </div>
  );
}
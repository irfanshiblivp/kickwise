
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { db, User, Match, Broadcast, AppSettings, Prediction } from '@/lib/db';
import { BrandingHeader } from '@/components/branding-header';
import { MatchCard } from '@/components/match-card';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LogOut, 
  Trophy, 
  MessageSquare, 
  LayoutDashboard, 
  ListOrdered, 
  CalendarCheck, 
  History,
  TrendingUp,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, query, orderBy, doc, where } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  
  const matchesQuery = useMemo(() => query(collection(firestore, 'matches'), orderBy('date', 'asc')), [firestore]);
  const broadcastsQuery = useMemo(() => query(collection(firestore, 'broadcasts'), orderBy('timestamp', 'desc')), [firestore]);
  const leaderboardQuery = useMemo(() => query(collection(firestore, 'users'), orderBy('points', 'desc')), [firestore]);
  const settingsDocRef = useMemo(() => doc(firestore, 'settings', 'app'), [firestore]);

  const { data: matches } = useCollection<Match>(matchesQuery);
  const { data: broadcasts } = useCollection<Broadcast>(broadcastsQuery);
  const { data: leaderboard } = useCollection<User>(leaderboardQuery);
  const { data: settingsData } = useDoc<AppSettings>(settingsDocRef);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const stadiumBg = PlaceHolderImages.find(img => img.id === 'stadium-bg');

  const settings = settingsData || { leaderboardVisible: true };

  useEffect(() => {
    const savedUser = localStorage.getItem('kw_current_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [router]);

  const currentUserRef = useMemo(() => user ? doc(firestore, 'users', user.id) : null, [firestore, user]);
  const { data: freshUser } = useDoc<User>(currentUserRef);
  
  const userPredictionsQuery = useMemo(() => user ? query(collection(firestore, 'predictions'), where('userId', '==', user.id)) : null, [firestore, user]);
  const { data: predictions } = useCollection<Prediction>(userPredictionsQuery);

  const activeUser = freshUser || user;

  const logout = () => {
    localStorage.removeItem('kw_current_user');
    router.push('/');
  };

  const filteredMatches = useMemo(() => {
    let base = activeTab === 'upcoming' 
      ? matches.filter(m => !m.isFinished)
      : matches.filter(m => m.isFinished);

    if (selectedRound !== 'all') {
      base = base.filter(m => m.round.toString() === selectedRound);
    }

    return base.sort((a, b) => {
      if (activeTab === 'upcoming') {
        if (a.isLocked !== b.isLocked) return a.isLocked ? 1 : -1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [matches, activeTab, selectedRound]);

  if (!activeUser) return null;

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image 
          src={stadiumBg?.imageUrl || ''} 
          alt="Stadium Background" 
          fill 
          className="object-cover opacity-10 dark:opacity-5 blur-[4px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background dark:via-background/90" />
      </div>

      <BrandingHeader compact showPredictingLogo />

      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-xs font-black text-primary uppercase">{activeUser.points} XP</span>
            </div>
            {activeUser.isAdmin && (
              <Button size="sm" variant="outline" onClick={() => router.push('/admin')} className="text-[9px] font-black uppercase h-7 border-primary/20 rounded-none bg-primary/5 hover:bg-primary hover:text-white transition-all">
                <ShieldCheck className="h-3 w-3 mr-1" /> Command Center
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest">{activeUser.username}</span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase">{activeUser.year} {activeUser.department}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout} 
              className="h-8 px-4 hover:bg-destructive/10 hover:text-destructive text-[10px] font-black uppercase tracking-wider border-border rounded-none"
            >
              <LogOut className="h-3 w-3 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1 z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-black flex items-center gap-3 tracking-tighter uppercase">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                  Prediction League
                </h2>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <TabsList className="bg-muted/50 border border-border rounded-none h-11 p-1">
                    <TabsTrigger value="upcoming" className="flex-1 rounded-none px-6 text-[10px] font-black uppercase flex items-center gap-2 tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                      <CalendarCheck className="h-3.5 w-3.5" />
                      Live Fixtures
                    </TabsTrigger>
                    <TabsTrigger value="finished" className="flex-1 rounded-none px-6 text-[10px] font-black uppercase flex items-center gap-2 tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                      <History className="h-3.5 w-3.5" />
                      Archived Results
                    </TabsTrigger>
                    {settings.leaderboardVisible && (
                      <TabsTrigger value="leaderboard" className="lg:hidden flex-1 rounded-none px-6 text-[10px] font-black uppercase flex items-center gap-2 tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                        <ListOrdered className="h-3.5 w-3.5" />
                        Standings
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {(activeTab === 'upcoming' || activeTab === 'finished') && (
                    <div className="flex bg-muted/50 border border-border p-1 rounded-none overflow-x-auto scrollbar-hide">
                      {[
                        { id: 'all', label: 'ALL ROUNDS' },
                        { id: '0', label: 'FRIENDLIES' },
                        { id: '1', label: 'ROUND 1' },
                        { id: '2', label: 'ROUND 2' },
                        { id: '3', label: 'ROUND 3' },
                        { id: '4', label: 'KNOCKOUTS' }
                      ].map(round => (
                        <button
                          key={round.id}
                          onClick={() => setSelectedRound(round.id)}
                          className={`px-4 py-2 text-[9px] font-black uppercase transition-all min-w-[90px] tracking-widest border border-transparent ${selectedRound === round.id ? 'bg-primary text-white shadow-lg border-primary/20' : 'text-muted-foreground hover:text-primary'}`}
                        >
                          {round.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <TabsContent value="upcoming" className="m-0 animate-fade-in-up">
                  <div className="bento-grid">
                    {filteredMatches.length > 0 ? (
                      filteredMatches.map(match => (
                        <MatchCard 
                          key={match.id} 
                          match={match} 
                          user={activeUser} 
                          existingPrediction={predictions.find(p => p.matchId === match.id)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-24 text-center glass-morphism rounded-none border-2 border-dashed border-primary/10">
                        <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em]">System clear: No active matches in the league.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="finished" className="m-0 animate-fade-in-up">
                   <div className="bento-grid">
                    {filteredMatches.length > 0 ? (
                      filteredMatches.map(match => (
                        <MatchCard 
                          key={match.id} 
                          match={match} 
                          user={activeUser} 
                          existingPrediction={predictions.find(p => p.matchId === match.id)}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-24 text-center glass-morphism rounded-none border-2 border-dashed border-primary/10">
                        <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em]">Archive clear: No historical results logged.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="leaderboard" className="m-0 lg:hidden animate-fade-in-up">
                  <Card className="glass-morphism rounded-none classic-border overflow-hidden shadow-2xl">
                    <CardHeader className="bg-primary/5 border-b border-border py-4">
                      <CardTitle className="text-xs font-headline font-black uppercase flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        Global Standings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {leaderboard.filter(u => !u.isAdmin).map((u, idx) => (
                          <div key={u.id} className={`flex items-center justify-between px-6 py-5 transition-colors ${u.id === activeUser.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}>
                            <div className="flex items-center gap-4">
                              <span className={`w-8 text-[10px] font-black ${idx < 3 ? 'text-primary' : 'text-muted-foreground'}`}>#{idx + 1}</span>
                              <div>
                                <p className="font-black uppercase text-xs">{u.username}</p>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{u.year} | {u.department}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-headline font-black text-primary block">{u.points} XP</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="space-y-8 hidden lg:block">
            {settings.leaderboardVisible ? (
              <Card className="glass-morphism classic-border rounded-none overflow-hidden shadow-2xl">
                <CardHeader className="pb-4 border-b border-border bg-primary/5">
                  <CardTitle className="text-[10px] font-headline font-black uppercase flex items-center gap-2 tracking-[0.2em]">
                    <ListOrdered className="h-4 w-4 text-primary" />
                    Elite Standings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 p-0 max-h-[500px] overflow-y-auto scrollbar-hide">
                  <div className="divide-y divide-border">
                    {leaderboard.filter(u => !u.isAdmin).map((u, idx) => (
                      <div key={u.id} className={`flex items-center justify-between px-5 py-4 transition-all duration-300 ${u.id === activeUser.id ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-primary/5'}`}>
                        <div className="flex items-center gap-4">
                          <span className={`w-6 text-[10px] font-black ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                            #{idx + 1}
                          </span>
                          <div>
                            <p className={`text-[11px] font-black uppercase tracking-tight ${u.id === activeUser.id ? 'text-primary' : ''}`}>{u.username}</p>
                            <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">{u.year} | {u.department}</p>
                          </div>
                        </div>
                        <span className="font-headline font-black text-xs text-primary">{u.points}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-morphism border-dashed border-primary/20 rounded-none overflow-hidden shadow-xl">
                <CardContent className="py-16 flex flex-col items-center justify-center text-center px-8">
                  <div className="bg-primary/10 p-4 mb-4 rounded-none">
                    <EyeOff className="h-8 w-8 text-primary/40" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] leading-relaxed">
                    Leaderboard access<br />restricted by admin
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="glass-morphism classic-border rounded-none overflow-hidden shadow-2xl">
              <CardHeader className="pb-4 border-b border-border bg-primary/5">
                <CardTitle className="text-[10px] font-headline font-black uppercase flex items-center gap-2 tracking-[0.2em]">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Live Bulletins
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 px-0">
                <ScrollArea className="h-[350px] px-6">
                  <div className="space-y-6">
                    {broadcasts.length > 0 ? (
                      broadcasts.map(msg => (
                        <div key={msg.id} className="relative pl-4 border-l-2 border-primary animate-fade-in-up">
                          <p className="text-[11px] font-bold leading-relaxed mb-3 text-foreground/90">{msg.message}</p>
                          <div className="flex justify-between items-center text-[8px] text-muted-foreground font-black uppercase tracking-widest">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-none">{msg.author}</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20">
                        <p className="text-muted-foreground text-[9px] uppercase font-black tracking-widest opacity-50">No incoming transmissions</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Button onClick={() => router.push('/')} variant="ghost" className="w-full text-[9px] font-black uppercase tracking-[0.4em] py-8 rounded-none border border-border/50 hover:bg-primary/5 transition-all">
              Return to Main Entrance
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-8 text-foreground/30 text-[8px] uppercase font-black tracking-[0.6em] text-center border-t border-border/20 z-10 bg-background/50 backdrop-blur-sm">
        Dhruva 2026 • Prediction League • CSE Association Munnar
      </footer>
      <Toaster />
    </div>
  );
}

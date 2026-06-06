
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { db, User, Match, Broadcast } from '@/lib/db';
import { BrandingHeader } from '@/components/branding-header';
import { MatchCard } from '@/components/match-card';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, Trophy, MessageSquare, LayoutDashboard, ListOrdered } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const stadiumBg = PlaceHolderImages.find(img => img.id === 'stadium-bg');

  useEffect(() => {
    const savedUser = localStorage.getItem('kw_current_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    const freshUser = db.users.find(parsedUser.username);
    setUser(freshUser || parsedUser);
    refreshData();
  }, [router]);

  const refreshData = () => {
    setMatches(db.matches.all());
    setBroadcasts(db.broadcasts.all());
    setLeaderboard(db.users.all());
    const savedUser = localStorage.getItem('kw_current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const fresh = db.users.find(parsed.username);
      if (fresh) setUser(fresh);
    }
  };

  const logout = () => {
    localStorage.removeItem('kw_current_user');
    router.push('/');
  };

  const filteredMatches = useMemo(() => {
    if (activeTab === 'upcoming') {
      return matches.filter(m => !m.isFinished).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return matches.filter(m => m.isFinished).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [matches, activeTab]);

  if (!user) return null;

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      {/* Stadium Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image 
          src={stadiumBg?.imageUrl || ''} 
          alt="Stadium Background" 
          fill 
          className="object-cover opacity-10 blur-[4px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
      </div>

      <BrandingHeader compact />

      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Trophy className="h-3 w-3 text-primary" />
              <span className="text-xs font-black text-primary uppercase">{user.points} XP</span>
            </div>
            {user.isAdmin && (
              <Button size="sm" variant="outline" onClick={() => router.push('/admin')} className="text-[9px] font-black uppercase h-7 border-primary/20">Admin Panel</Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-black uppercase">{user.username}</span>
              <span className="text-[9px] text-muted-foreground font-bold">{user.year} {user.department}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout} 
              className="h-9 px-4 hover:bg-destructive/10 hover:text-destructive text-xs font-bold uppercase tracking-wider transition-colors border-primary/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Tournament View */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-headline font-black flex items-center gap-2 tracking-tighter uppercase">
                <LayoutDashboard className="h-6 w-6 text-primary" />
                Live Matches
              </h2>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="bg-muted/50 border border-border w-full rounded-none">
                  <TabsTrigger value="upcoming" className="flex-1 rounded-none text-[10px] font-bold uppercase">Active Fixtures</TabsTrigger>
                  <TabsTrigger value="finished" className="flex-1 rounded-none text-[10px] font-bold uppercase">Past Results</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="bento-grid">
              {filteredMatches.length > 0 ? (
                filteredMatches.map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    user={user} 
                    existingPrediction={db.predictions.forUser(user.id).find(p => p.matchId === match.id)}
                    onPredictionSubmit={refreshData}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center glass-morphism rounded-none border border-dashed border-muted">
                  <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">No matches in this category.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Leaderboard & Broadcasts */}
          <div className="space-y-6">
            <Card className="glass-morphism border-primary/10 rounded-none overflow-hidden">
              <CardHeader className="pb-3 border-b border-border bg-primary/5">
                <CardTitle className="text-sm font-headline font-black uppercase flex items-center gap-2">
                  <ListOrdered className="h-4 w-4 text-primary" />
                  Hall of Fame
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 p-0">
                <div className="divide-y divide-border">
                  {leaderboard.filter(u => !u.isAdmin).slice(0, 10).map((u, idx) => (
                    <div key={u.id} className={`flex items-center justify-between px-4 py-3 transition-colors ${u.id === user.id ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-5 text-[10px] font-black ${idx === 0 ? 'text-yellow-600' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <p className={`text-xs font-bold uppercase ${u.id === user.id ? 'text-primary' : ''}`}>{u.username}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-medium">{u.year} | {u.department}</p>
                        </div>
                      </div>
                      <span className="font-headline font-black text-xs text-primary">{u.points}</span>
                    </div>
                  ))}
                  {leaderboard.filter(u => !u.isAdmin).length === 0 && (
                    <div className="p-10 text-center">
                      <p className="text-[10px] font-black text-muted-foreground uppercase italic">No contestants yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-primary/10 rounded-none overflow-hidden">
              <CardHeader className="pb-3 border-b border-border bg-primary/5">
                <CardTitle className="text-sm font-headline font-black uppercase flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Bulletins
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-0">
                <ScrollArea className="h-[250px] px-4">
                  <div className="space-y-4">
                    {broadcasts.length > 0 ? (
                      broadcasts.map(msg => (
                        <div key={msg.id} className="bg-muted/30 p-3 rounded-none border-l-2 border-primary">
                          <p className="text-[11px] leading-relaxed mb-2 font-medium">{msg.message}</p>
                          <div className="flex justify-between items-center text-[8px] text-muted-foreground font-black uppercase tracking-widest">
                            <span className="text-primary">{msg.author}</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-[10px] py-10 uppercase font-black tracking-tighter">No recent updates.</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}


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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [activeRound, setActiveRound] = useState('1');

  useEffect(() => {
    const savedUser = localStorage.getItem('kw_current_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
    refreshData();
  }, [router]);

  const refreshData = () => {
    setMatches(db.matches.all());
    setBroadcasts(db.broadcasts.all());
    setLeaderboard(db.users.all());
  };

  const logout = () => {
    localStorage.removeItem('kw_current_user');
    router.push('/');
  };

  const filteredMatches = useMemo(() => {
    return matches.filter(m => m.round.toString() === activeRound);
  }, [matches, activeRound]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold text-xl tracking-tight">KICKWISE</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold">{user.username}</span>
              <span className="text-[10px] text-muted-foreground uppercase">{user.year} YEAR | {user.department}</span>
            </div>
            <div className="bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
              <span className="text-primary font-black">{user.points} PTS</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Tournament View */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-headline font-bold flex items-center gap-2">
                <LayoutDashboard className="h-8 w-8 text-accent" />
                Tournament Rounds
              </h2>
              
              <Tabs value={activeRound} onValueChange={setActiveRound} className="w-full md:w-auto">
                <TabsList className="bg-card border border-border w-full">
                  <TabsTrigger value="1" className="flex-1">Round 1</TabsTrigger>
                  <TabsTrigger value="2" className="flex-1">Round 2</TabsTrigger>
                  <TabsTrigger value="3" className="flex-1">Round 3</TabsTrigger>
                  <TabsTrigger value="4" className="flex-1">Knockout</TabsTrigger>
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
                <div className="col-span-full py-20 text-center glass-morphism rounded-3xl border border-dashed border-muted">
                  <p className="text-muted-foreground">No matches scheduled for this round yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Leaderboard & Broadcasts */}
          <div className="space-y-6">
            <Card className="glass-morphism border-accent/20">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-accent" />
                  Top Challengers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 p-0">
                <div className="divide-y divide-border">
                  {leaderboard.slice(0, 10).map((u, idx) => (
                    <div key={u.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-xs font-black ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold">{u.username}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{u.year} | {u.department}</p>
                        </div>
                      </div>
                      <span className="font-headline font-black text-primary">{u.points}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-primary/20">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Admin Broadcasts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-0">
                <ScrollArea className="h-[300px] px-4">
                  <div className="space-y-4">
                    {broadcasts.length > 0 ? (
                      broadcasts.map(msg => (
                        <div key={msg.id} className="bg-muted/30 p-3 rounded-lg border-l-2 border-primary">
                          <p className="text-sm mb-1">{msg.message}</p>
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase">
                            <span className="font-bold text-primary">{msg.author}</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-xs py-10">No messages from admins yet.</p>
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

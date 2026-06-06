
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, Match, User } from '@/lib/db';
import { BrandingHeader } from '@/components/branding-header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  ShieldCheck, 
  Plus, 
  Unlock, 
  Lock, 
  CheckCircle, 
  MessageSquare,
  Users,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [broadcast, setBroadcast] = useState('');
  const [newMatch, setNewMatch] = useState({
    teamA: '', teamB: '', flagA: '🏳️', flagB: '🏳️', round: 1, date: '', time: '', venue: ''
  });
  const stadiumBg = PlaceHolderImages.find(img => img.id === 'stadium-bg');

  useEffect(() => {
    const savedUser = localStorage.getItem('kw_current_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    if (!user.isAdmin) {
      router.push('/dashboard');
      return;
    }
    refresh();
  }, [router]);

  const refresh = () => {
    setMatches(db.matches.all());
    setUsers(db.users.all());
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.teamA || !newMatch.teamB) return;
    db.matches.add({
      ...newMatch,
      isLocked: true
    });
    toast({ title: "Match Added", description: `${newMatch.teamA} vs ${newMatch.teamB} scheduled.` });
    refresh();
    setNewMatch({ teamA: '', teamB: '', flagA: '🏳️', flagB: '🏳️', round: 1, date: '', time: '', venue: '' });
  };

  const toggleLock = (matchId: string, currentStatus: boolean) => {
    db.matches.update(matchId, { isLocked: !currentStatus });
    refresh();
    toast({ title: `Match ${!currentStatus ? 'Locked' : 'Unlocked'}` });
  };

  const logout = () => {
    localStorage.removeItem('kw_current_user');
    router.push('/');
  };

  const handleUpdateScore = (matchId: string, scoreA: number, scoreB: number) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    db.matches.update(matchId, { scoreA, scoreB, isFinished: true, isLocked: true });

    const predictions = db.predictions.forMatch(matchId);
    predictions.forEach(pred => {
      let pointsAwarded = 0;
      if (pred.scoreA === scoreA && pred.scoreB === scoreB) {
        pointsAwarded = 10;
      } else {
        const actualWinner = scoreA > scoreB ? 'A' : scoreA < scoreB ? 'B' : 'Draw';
        const predictedWinner = pred.scoreA > pred.scoreB ? 'A' : pred.scoreA < pred.scoreB ? 'B' : 'Draw';
        if (actualWinner === predictedWinner) {
          pointsAwarded = 5;
        }
      }
      if (pointsAwarded > 0) {
        db.users.addPoints(pred.userId, pointsAwarded);
      }
    });

    toast({ 
      title: "Score Updated!", 
      description: `Results applied and points distributed.` 
    });
    refresh();
  };

  const sendBroadcast = () => {
    if (!broadcast) return;
    db.broadcasts.add(broadcast, 'ADMIN');
    setBroadcast('');
    toast({ title: "Broadcast Sent", description: "All users can now see your message." });
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Background Image */}
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
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            <h1 className="font-headline font-black text-sm uppercase tracking-widest text-primary">ADMIN CONTROL</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="font-bold uppercase text-[10px]">
              <ArrowLeft className="h-3 w-3 mr-2" /> View Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout} 
              className="text-destructive hover:bg-destructive/10 border-destructive/20 font-bold uppercase text-[10px]"
            >
              <LogOut className="h-3 w-3 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8 space-y-8 z-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-morphism rounded-none border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-primary/5">
                <CardTitle className="font-headline font-black uppercase tracking-tighter text-sm">Active Fixtures</CardTitle>
                <Badge variant="outline" className="text-primary border-primary/30 rounded-none text-[9px] font-black">{matches.length} MATCHES</Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {matches.map(m => (
                  <div key={m.id} className="p-4 rounded-none border border-border bg-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center w-12 border-r border-border pr-4">
                        <Badge className="bg-primary/10 text-primary mb-1 uppercase font-bold text-[9px] rounded-none">R{m.round}</Badge>
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-tighter">{m.flagA} {m.teamA} vs {m.teamB} {m.flagB}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{m.date} | {m.venue}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button 
                        size="sm" 
                        variant={m.isLocked ? "outline" : "secondary"}
                        onClick={() => toggleLock(m.id, m.isLocked)}
                        className={m.isLocked ? "text-[10px] font-bold uppercase h-8 rounded-none" : "bg-green-600/10 text-green-600 hover:bg-green-600/20 text-[10px] font-bold uppercase h-8 rounded-none"}
                      >
                        {m.isLocked ? <Lock className="h-3 w-3 mr-2" /> : <Unlock className="h-3 w-3 mr-2" />}
                        {m.isLocked ? "Locked" : "Unlocked"}
                      </Button>

                      {!m.isFinished ? (
                        <div className="flex items-center gap-2 bg-background/50 p-1 rounded-none border border-border">
                          <Input className="w-10 h-8 p-1 text-center bg-transparent border-none text-xs font-black" placeholder="A" id={`scoreA-${m.id}`} />
                          <span className="font-bold">-</span>
                          <Input className="w-10 h-8 p-1 text-center bg-transparent border-none text-xs font-black" placeholder="B" id={`scoreB-${m.id}`} />
                          <Button 
                            size="icon" 
                            className="h-8 w-8 bg-primary hover:bg-primary/90 rounded-none"
                            onClick={() => {
                              const sA = (document.getElementById(`scoreA-${m.id}`) as HTMLInputElement).value;
                              const sB = (document.getElementById(`scoreB-${m.id}`) as HTMLInputElement).value;
                              if (sA && sB) handleUpdateScore(m.id, parseInt(sA), parseInt(sB));
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="default" className="bg-primary/10 text-primary border border-primary/20 font-black uppercase text-[10px] rounded-none">Final: {m.scoreA}-{m.scoreB}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-morphism rounded-none border-primary/10">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="font-headline font-black uppercase text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  Create New Fixture
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreateMatch} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Team A</Label>
                    <Input className="rounded-none bg-white/50 h-9" placeholder="Nation A" value={newMatch.teamA} onChange={e => setNewMatch({...newMatch, teamA: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Flag A</Label>
                    <Input className="rounded-none bg-white/50 h-9" placeholder="Emoji" value={newMatch.flagA} onChange={e => setNewMatch({...newMatch, flagA: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Team B</Label>
                    <Input className="rounded-none bg-white/50 h-9" placeholder="Nation B" value={newMatch.teamB} onChange={e => setNewMatch({...newMatch, teamB: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Flag B</Label>
                    <Input className="rounded-none bg-white/50 h-9" placeholder="Emoji" value={newMatch.flagB} onChange={e => setNewMatch({...newMatch, flagB: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Round</Label>
                    <Input className="rounded-none bg-white/50 h-9" type="number" value={newMatch.round} onChange={e => setNewMatch({...newMatch, round: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Date</Label>
                    <Input className="rounded-none bg-white/50 h-9" type="date" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Time</Label>
                    <Input className="rounded-none bg-white/50 h-9" type="time" value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Venue</Label>
                    <Input className="rounded-none bg-white/50 h-9" placeholder="Stadium" value={newMatch.venue} onChange={e => setNewMatch({...newMatch, venue: e.target.value})} />
                  </div>
                  <Button type="submit" className="col-span-full bg-primary hover:bg-primary/90 mt-2 font-headline font-black uppercase tracking-widest rounded-none h-11">PUBLISH TO ARENA</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-morphism rounded-none border-primary/10">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="font-headline font-black uppercase text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Broadcaster
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Input 
                  placeholder="Announce tournament updates..." 
                  value={broadcast} 
                  onChange={e => setBroadcast(e.target.value)}
                  className="bg-white/50 text-[11px] font-bold rounded-none h-10"
                />
                <Button onClick={sendBroadcast} className="w-full bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest rounded-none h-10">SEND BULLETIN</Button>
              </CardContent>
            </Card>

            <Card className="glass-morphism rounded-none border-primary/10">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="font-headline font-black uppercase text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Leaderboard Data
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {users.slice(0, 10).map(u => (
                    <div key={u.id} className="flex justify-between items-center p-3 rounded-none bg-white/30 border border-border/50">
                      <div className="flex flex-col">
                        <span className="font-bold text-[10px] uppercase">{u.username}</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-black">{u.department}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black border-primary/20 text-primary rounded-none">{u.points} XP</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      <Toaster />
    </div>
  );
}

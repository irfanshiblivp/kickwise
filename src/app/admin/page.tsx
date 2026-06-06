"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, Match, User } from '@/lib/db';
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
  LogOut
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [broadcast, setBroadcast] = useState('');
  const [newMatch, setNewMatch] = useState({
    teamA: '', teamB: '', flagA: '🏳️', flagB: '🏳️', round: 1, date: '', time: '', venue: ''
  });

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
    db.matches.add({
      ...newMatch,
      isLocked: true
    });
    toast({ title: "Match Added", description: `${newMatch.teamA} vs ${newMatch.teamB} scheduled.` });
    refresh();
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

    db.matches.update(matchId, { scoreA, scoreB, isFinished: true });

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
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-accent h-6 w-6" />
            <h1 className="font-headline font-black text-xl uppercase tracking-widest">ADMIN PANEL</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="font-bold uppercase text-[10px]">Back to App</Button>
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

      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-morphism border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline font-black uppercase tracking-tighter">Live Tournament Schedule</CardTitle>
                <Badge variant="outline" className="text-accent border-accent/30">{matches.length} Total Matches</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {matches.map(m => (
                  <div key={m.id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center w-12">
                        <Badge className="bg-accent/20 text-accent mb-1 uppercase font-bold text-[9px]">R{m.round}</Badge>
                      </div>
                      <div>
                        <p className="font-bold text-lg uppercase tracking-tighter">{m.flagA} {m.teamA} vs {m.teamB} {m.flagB}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{m.date} | {m.venue}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button 
                        size="sm" 
                        variant={m.isLocked ? "outline" : "secondary"}
                        onClick={() => toggleLock(m.id, m.isLocked)}
                        className={m.isLocked ? "text-[10px] font-bold uppercase" : "bg-green-600/10 text-green-600 hover:bg-green-600/20 text-[10px] font-bold uppercase"}
                      >
                        {m.isLocked ? <Lock className="h-3 w-3 mr-2" /> : <Unlock className="h-3 w-3 mr-2" />}
                        {m.isLocked ? "Unlock" : "Lock"}
                      </Button>

                      {!m.isFinished ? (
                        <div className="flex items-center gap-2 bg-background/50 p-1 rounded-md border border-border">
                          <Input className="w-10 h-8 p-1 text-center bg-transparent border-none text-sm font-black" placeholder="A" id={`scoreA-${m.id}`} />
                          <span className="font-bold">-</span>
                          <Input className="w-10 h-8 p-1 text-center bg-transparent border-none text-sm font-black" placeholder="B" id={`scoreB-${m.id}`} />
                          <Button 
                            size="icon" 
                            className="h-8 w-8 bg-primary hover:bg-primary/90"
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
                        <Badge variant="default" className="bg-primary/20 text-primary font-black uppercase text-[10px]">Finished: {m.scoreA}-{m.scoreB}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-morphism border-primary/20">
              <CardHeader>
                <CardTitle className="font-headline font-black uppercase flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add New Fixture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateMatch} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Team A</Label>
                    <Input placeholder="Nation A" value={newMatch.teamA} onChange={e => setNewMatch({...newMatch, teamA: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Flag A</Label>
                    <Input placeholder="Emoji" value={newMatch.flagA} onChange={e => setNewMatch({...newMatch, flagA: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Team B</Label>
                    <Input placeholder="Nation B" value={newMatch.teamB} onChange={e => setNewMatch({...newMatch, teamB: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Flag B</Label>
                    <Input placeholder="Emoji" value={newMatch.flagB} onChange={e => setNewMatch({...newMatch, flagB: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Round</Label>
                    <Input type="number" value={newMatch.round} onChange={e => setNewMatch({...newMatch, round: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Date</Label>
                    <Input type="date" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Time</Label>
                    <Input type="time" value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black opacity-60">Venue</Label>
                    <Input placeholder="Stadium" value={newMatch.venue} onChange={e => setNewMatch({...newMatch, venue: e.target.value})} />
                  </div>
                  <Button type="submit" className="col-span-full bg-primary hover:bg-primary/90 mt-2 font-headline font-black uppercase tracking-widest">PUBLISH SCHEDULE</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-morphism border-accent/20">
              <CardHeader>
                <CardTitle className="font-headline font-black uppercase flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  Bulletins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Announce tournament updates..." 
                  value={broadcast} 
                  onChange={e => setBroadcast(e.target.value)}
                  className="bg-background/50 text-xs font-bold"
                />
                <Button onClick={sendBroadcast} className="w-full bg-accent hover:bg-accent/90 text-[10px] font-black uppercase tracking-widest">SEND BROADCAST</Button>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-primary/20">
              <CardHeader>
                <CardTitle className="font-headline font-black uppercase flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Active Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id} className="flex justify-between items-center p-3 rounded bg-muted/10 border border-border/50">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs uppercase">{u.username}</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-black">{u.department}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black border-primary/20 text-primary">{u.points} PTS</Badge>
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

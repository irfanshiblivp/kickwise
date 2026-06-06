
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, Match, User, Prediction } from '@/lib/db';
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
  Settings, 
  Unlock, 
  Lock, 
  CheckCircle, 
  MessageSquare,
  Users,
  Trophy
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

  const handleUpdateScore = (matchId: string, scoreA: number, scoreB: number) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // 1. Update match score
    db.matches.update(matchId, { scoreA, scoreB, isFinished: true });

    // 2. Award points automatically
    const predictions = db.predictions.forMatch(matchId);
    predictions.forEach(pred => {
      let pointsAwarded = 0;
      
      // Exact score: 10 pts
      if (pred.scoreA === scoreA && pred.scoreB === scoreB) {
        pointsAwarded = 10;
      } 
      // Correct outcome: 5 pts
      else {
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
      description: `Results applied and points distributed to ${predictions.length} participants.` 
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
            <h1 className="font-headline font-black text-xl">KICKWISE ADMIN</h1>
          </div>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>Back to App</Button>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Manage Matches */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-morphism border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">Active Tournament Schedule</CardTitle>
                <Badge variant="outline" className="text-accent border-accent/30">{matches.length} Total Matches</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {matches.map(m => (
                  <div key={m.id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center w-12">
                        <Badge className="bg-accent/20 text-accent mb-1">R{m.round}</Badge>
                      </div>
                      <div>
                        <p className="font-bold text-lg">{m.flagA} {m.teamA} vs {m.teamB} {m.flagB}</p>
                        <p className="text-xs text-muted-foreground">{m.date} | {m.venue}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button 
                        size="sm" 
                        variant={m.isLocked ? "outline" : "secondary"}
                        onClick={() => toggleLock(m.id, m.isLocked)}
                        className={m.isLocked ? "" : "bg-green-600/20 text-green-400 hover:bg-green-600/30"}
                      >
                        {m.isLocked ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
                        {m.isLocked ? "Unlock" : "Lock"}
                      </Button>

                      {!m.isFinished ? (
                        <div className="flex items-center gap-2 bg-background/50 p-1 rounded-md border border-border">
                          <Input className="w-10 h-8 p-1 text-center bg-transparent border-none" placeholder="A" id={`scoreA-${m.id}`} />
                          <span>-</span>
                          <Input className="w-10 h-8 p-1 text-center bg-transparent border-none" placeholder="B" id={`scoreB-${m.id}`} />
                          <Button 
                            size="icon" 
                            className="h-8 w-8"
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
                        <Badge variant="default" className="bg-primary/20 text-primary">Finished: {m.scoreA}-{m.scoreB}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-morphism border-primary/20">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add New Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateMatch} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Team A Name</Label>
                    <Input placeholder="Nation A" value={newMatch.teamA} onChange={e => setNewMatch({...newMatch, teamA: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Flag A</Label>
                    <Input placeholder="Emoji" value={newMatch.flagA} onChange={e => setNewMatch({...newMatch, flagA: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Team B Name</Label>
                    <Input placeholder="Nation B" value={newMatch.teamB} onChange={e => setNewMatch({...newMatch, teamB: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Flag B</Label>
                    <Input placeholder="Emoji" value={newMatch.flagB} onChange={e => setNewMatch({...newMatch, flagB: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Round</Label>
                    <Input type="number" value={newMatch.round} onChange={e => setNewMatch({...newMatch, round: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Input placeholder="Stadium" value={newMatch.venue} onChange={e => setNewMatch({...newMatch, venue: e.target.value})} />
                  </div>
                  <Button type="submit" className="col-span-full bg-primary hover:bg-primary/90 mt-2 font-headline">PUBLISH SCHEDULE</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Users & Broadcasts */}
          <div className="space-y-6">
            <Card className="glass-morphism border-accent/20">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  Broadcast Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Announce tournament updates..." 
                  value={broadcast} 
                  onChange={e => setBroadcast(e.target.value)}
                  className="bg-background/50"
                />
                <Button onClick={sendBroadcast} className="w-full bg-accent hover:bg-accent/90">SEND TO ALL USERS</Button>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-primary/20">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id} className="flex justify-between items-center p-2 rounded bg-muted/10 border border-border/50 text-sm">
                      <span className="font-bold">{u.username}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{u.points} PTS</Badge>
                      </div>
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

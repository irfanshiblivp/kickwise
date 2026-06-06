
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, Match, UserMessage, AppSettings, User } from '@/lib/db';
import { BrandingHeader } from '@/components/branding-header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  Plus, 
  Unlock, 
  Lock, 
  CheckCircle, 
  MessageSquare,
  LogOut,
  ArrowLeft,
  Trash2,
  Mail,
  Edit2,
  RefreshCcw,
  ListOrdered,
  LayoutGrid,
  Trophy,
  History
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const STADIUMS = {
  USA: [
    "Mercedes-Benz Stadium (Atlanta)",
    "Gillette Stadium (Boston)",
    "AT&T Stadium (Dallas)",
    "NRG Stadium (Houston)",
    "Arrowhead Stadium (Kansas City)",
    "SoFi Stadium (Los Angeles)",
    "Hard Rock Stadium (Miami)",
    "MetLife Stadium (New York/New Jersey)",
    "Lincoln Financial Field (Philadelphia)",
    "Levi's Stadium (San Francisco Bay Area)",
    "Lumen Field (Seattle)"
  ],
  Mexico: [
    "Estadio Akron (Guadalajara)",
    "Estadio Azteca (Mexico City)",
    "Estadio BBVA (Monterrey)"
  ],
  Canada: [
    "BMO Field (Toronto)",
    "BC Place (Vancouver)"
  ]
};

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ leaderboardVisible: true });
  const [broadcast, setBroadcast] = useState('');
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [newMatch, setNewMatch] = useState({
    teamA: '', teamB: '', flagA: '', flagB: '', group: 'Group A', round: 1, date: '', time: '', venue: ''
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
    setMessages(db.inbox.all());
    setUsers(db.users.all());
    setSettings(db.settings.get());
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.teamA || !newMatch.teamB || !newMatch.venue) {
      toast({ title: "Validation Error", description: "Teams and Venue are required.", variant: "destructive" });
      return;
    }
    db.matches.add({
      ...newMatch,
      isLocked: false
    });
    toast({ title: "Match Added", description: `${newMatch.teamA} vs ${newMatch.teamB} scheduled.` });
    refresh();
    setNewMatch({ teamA: '', teamB: '', flagA: '', flagB: '', group: 'Group A', round: 1, date: '', time: '', venue: '' });
  };

  const toggleLeaderboardVisibility = () => {
    const newVal = !settings.leaderboardVisible;
    db.settings.update({ leaderboardVisible: newVal });
    refresh();
    toast({ title: newVal ? "Leaderboard Visible" : "Leaderboard Hidden" });
  };

  const handleResetSystem = () => {
    if (confirm("NUCLEAR OPTION: This will permanently delete all users, predictions, messages, and restore default matches. Are you sure?")) {
      db.system.resetAll();
    }
  };

  const toggleLock = (matchId: string, currentStatus: boolean) => {
    db.matches.update(matchId, { isLocked: !currentStatus });
    refresh();
    toast({ title: `Match ${!currentStatus ? 'Locked' : 'Unlocked'}` });
  };

  const handleLockRound = (round: number, lock: boolean) => {
    db.matches.lockRound(round, lock);
    refresh();
    toast({ title: `Round ${round} ${lock ? 'Locked' : 'Unlocked'}` });
  };

  const deleteMatch = (matchId: string) => {
    if (confirm("Are you sure you want to delete this match?")) {
      db.matches.delete(matchId);
      refresh();
      toast({ title: "Match Deleted" });
    }
  };

  const recalculatePoints = () => {
    db.users.resetPoints();
    const allMatches = db.matches.all().filter(m => m.isFinished);
    allMatches.forEach(m => {
      const predictions = db.predictions.forMatch(m.id);
      predictions.forEach(pred => {
        let pointsAwarded = 0;
        if (pred.scoreA === m.scoreA && pred.scoreB === m.scoreB) {
          pointsAwarded = 10;
        } else {
          const actualWinner = m.scoreA! > m.scoreB! ? 'A' : m.scoreA! < m.scoreB! ? 'B' : 'Draw';
          const predictedWinner = pred.scoreA > pred.scoreB ? 'A' : pred.scoreA < pred.scoreB ? 'B' : 'Draw';
          if (actualWinner === predictedWinner) pointsAwarded = 5;
        }
        if (pointsAwarded > 0) db.users.addPoints(pred.userId, pointsAwarded);
      });
    });
    refresh();
  };

  const handleUpdateScore = (matchId: string, scoreA: number, scoreB: number) => {
    db.matches.update(matchId, { scoreA, scoreB, isFinished: true, isLocked: true });
    recalculatePoints();
    toast({ title: "Score Updated!", description: `Results applied and points recalculated.` });
  };

  const saveEdit = (matchId: string, updates: any) => {
    db.matches.update(matchId, updates);
    setEditingMatch(null);
    toast({ title: "Match Updated" });
    refresh();
  };

  const sendBroadcast = () => {
    if (!broadcast) return;
    db.broadcasts.add(broadcast, 'ADMIN');
    setBroadcast('');
    toast({ title: "Broadcast Sent" });
  };

  const logout = () => {
    localStorage.removeItem('kw_current_user');
    router.push('/');
  };

  const format12h = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
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

      <BrandingHeader compact />

      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            <h1 className="font-headline font-black text-sm uppercase tracking-widest text-primary">ADMIN CONTROL</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="font-bold uppercase text-[10px]">
              <ArrowLeft className="h-3 w-3 mr-2" /> View Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={logout} className="text-destructive border-destructive/20 font-bold uppercase text-[10px]">
              <LogOut className="h-3 w-3 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8 space-y-8 z-10 flex-1 max-w-6xl">
        <Tabs defaultValue="manage" className="w-full">
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="flex w-full min-max md:grid md:grid-cols-5 h-auto bg-muted/50 border border-border p-1 rounded-none mb-4">
              <TabsTrigger value="create" className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-2 flex-1">
                <Plus className="h-3 w-3" /> New Match
              </TabsTrigger>
              <TabsTrigger value="manage" className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-2 flex-1">
                <History className="h-3 w-3" /> Fixtures & Scores
              </TabsTrigger>
              <TabsTrigger value="leadership" className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-2 flex-1">
                <Trophy className="h-3 w-3" /> Leadership
              </TabsTrigger>
              <TabsTrigger value="rounds" className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-2 flex-1">
                <Lock className="h-3 w-3" /> Rounds
              </TabsTrigger>
              <TabsTrigger value="system" className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-2 flex-1">
                <ShieldCheck className="h-3 w-3" /> System
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="create">
            <Card className="glass-morphism rounded-none classic-border">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="font-headline font-black uppercase tracking-tighter text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  Enter New Official Fixture
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Team A & Flag</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Team A" value={newMatch.teamA} onChange={e => setNewMatch({...newMatch, teamA: e.target.value})} className="rounded-none bg-card/50 border-border text-xs h-10" />
                      <Input placeholder="Flag A" value={newMatch.flagA} onChange={e => setNewMatch({...newMatch, flagA: e.target.value})} className="w-20 rounded-none bg-card/50 border-border text-xs h-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Team B & Flag</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Team B" value={newMatch.teamB} onChange={e => setNewMatch({...newMatch, teamB: e.target.value})} className="rounded-none bg-card/50 border-border text-xs h-10" />
                      <Input placeholder="Flag B" value={newMatch.flagB} onChange={e => setNewMatch({...newMatch, flagB: e.target.value})} className="w-20 rounded-none bg-card/50 border-border text-xs h-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground">Round</Label>
                      <Select value={newMatch.round.toString()} onValueChange={v => setNewMatch({...newMatch, round: parseInt(v)})}>
                        <SelectTrigger className="rounded-none bg-card/50 border-border text-xs h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Round 1</SelectItem>
                          <SelectItem value="2">Round 2</SelectItem>
                          <SelectItem value="3">Round 3</SelectItem>
                          <SelectItem value="4">Knockouts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground">Group</Label>
                      <Input placeholder="Group A" value={newMatch.group} onChange={e => setNewMatch({...newMatch, group: e.target.value})} className="rounded-none bg-card/50 border-border text-xs h-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground">Date</Label>
                      <Input type="date" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} className="rounded-none bg-card/50 border-border text-xs h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground">Time</Label>
                      <Input type="time" value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} className="rounded-none bg-card/50 border-border text-xs h-10" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Venue</Label>
                    <Select value={newMatch.venue} onValueChange={v => setNewMatch({...newMatch, venue: v})}>
                      <SelectTrigger className="rounded-none bg-card/50 border-border text-xs h-10">
                        <SelectValue placeholder="Select Tournament Stadium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-primary font-black uppercase text-[10px] tracking-widest">USA Venues</SelectLabel>
                          {STADIUMS.USA.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-primary font-black uppercase text-[10px] tracking-widest">Mexico Venues</SelectLabel>
                          {STADIUMS.Mexico.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel className="text-primary font-black uppercase text-[10px] tracking-widest">Canada Venues</SelectLabel>
                          {STADIUMS.Canada.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="md:col-span-2 w-full bg-primary hover:bg-primary/90 rounded-none font-black uppercase text-xs h-11 shadow-lg">
                    CREATE OFFICIAL FIXTURE
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card className="glass-morphism rounded-none classic-border">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-primary/5">
                <CardTitle className="font-headline font-black uppercase tracking-tighter text-sm">Update Scores & Manage Fixtures</CardTitle>
                <Badge variant="outline" className="text-primary border-primary/30 rounded-none text-[9px] font-black">{matches.length} MATCHES</Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {matches.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(m => (
                  <div key={m.id} className="p-4 rounded-none border border-border bg-card/40 flex flex-col gap-4">
                    {editingMatch === m.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input className="text-xs h-8" defaultValue={m.teamA} id={`editTeamA-${m.id}`} />
                        <Input className="text-xs h-8" defaultValue={m.teamB} id={`editTeamB-${m.id}`} />
                        <Select defaultValue={m.venue} onValueChange={v => {
                          const input = document.getElementById(`editVenue-${m.id}`) as HTMLInputElement;
                          if (input) input.value = v;
                        }}>
                          <SelectTrigger className="rounded-none border-border text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(STADIUMS).flat().map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <input type="hidden" id={`editVenue-${m.id}`} defaultValue={m.venue} />
                        <Input type="date" className="text-xs h-8" defaultValue={m.date} id={`editDate-${m.id}`} />
                        <Input type="time" className="text-xs h-8" defaultValue={m.time} id={`editTime-${m.id}`} />
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 text-[10px] font-bold" onClick={() => {
                            const updates = {
                              teamA: (document.getElementById(`editTeamA-${m.id}`) as HTMLInputElement).value,
                              teamB: (document.getElementById(`editTeamB-${m.id}`) as HTMLInputElement).value,
                              venue: (document.getElementById(`editVenue-${m.id}`) as HTMLInputElement).value,
                              date: (document.getElementById(`editDate-${m.id}`) as HTMLInputElement).value,
                              time: (document.getElementById(`editTime-${m.id}`) as HTMLInputElement).value,
                            };
                            saveEdit(m.id, updates);
                          }}>Save</Button>
                          <Button size="sm" variant="outline" className="flex-1 text-[10px] font-bold" onClick={() => setEditingMatch(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center w-12 border-r border-border pr-4">
                            <Badge className="bg-primary/10 text-primary mb-1 uppercase font-bold text-[9px] rounded-none">R{m.round}</Badge>
                          </div>
                          <div>
                            <p className="font-bold text-sm uppercase tracking-tighter">
                              {m.flagA} {m.teamA} vs {m.teamB} {m.flagB}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{m.date} | {format12h(m.time)} | {m.venue}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button size="icon" variant="ghost" onClick={() => setEditingMatch(m.id)} className="h-8 w-8 text-primary">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteMatch(m.id)} className="h-8 w-8 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={m.isLocked ? "outline" : "secondary"}
                            onClick={() => toggleLock(m.id, m.isLocked)}
                            className={m.isLocked ? "text-[10px] font-bold uppercase h-8 rounded-none w-24" : "bg-green-600/10 text-green-600 text-[10px] font-bold uppercase h-8 rounded-none w-24"}
                          >
                            {m.isLocked ? <Lock className="h-3 w-3 mr-2" /> : <Unlock className="h-3 w-3 mr-2" />}
                            {m.isLocked ? "Locked" : "Unlocked"}
                          </Button>

                          <div className="flex items-center gap-2 bg-background/50 p-1 rounded-none border border-border">
                            <Input className="w-10 h-8 p-1 text-center bg-transparent border-none text-xs font-black" defaultValue={m.scoreA} id={`scoreA-${m.id}`} placeholder="A" />
                            <span className="font-bold">-</span>
                            <Input className="w-10 h-8 p-1 text-center bg-transparent border-none text-xs font-black" defaultValue={m.scoreB} id={`scoreB-${m.id}`} placeholder="B" />
                            <Button 
                              size="icon" 
                              className="h-8 w-8 bg-primary rounded-none"
                              onClick={() => {
                                const sA = (document.getElementById(`scoreA-${m.id}`) as HTMLInputElement).value;
                                const sB = (document.getElementById(`scoreB-${m.id}`) as HTMLInputElement).value;
                                if (sA !== '' && sB !== '') handleUpdateScore(m.id, parseInt(sA), parseInt(sB));
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leadership">
            <Card className="glass-morphism rounded-none classic-border">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="font-headline font-black uppercase text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="h-4 w-4 text-primary" />
                    Leadership Table Control
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">{settings.leaderboardVisible ? "Visible to Students" : "Hidden from Students"}</span>
                    <Switch checked={settings.leaderboardVisible} onCheckedChange={toggleLeaderboardVisibility} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 p-0">
                <div className="divide-y divide-border">
                  {users.filter(u => !u.isAdmin).map((u, idx) => (
                    <div key={u.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className={`w-6 text-xs font-black ${idx < 3 ? 'text-primary' : 'text-muted-foreground'}`}>#{idx + 1}</span>
                        <div>
                          <p className="font-bold uppercase text-sm">{u.username}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{u.year} | {u.department}</p>
                        </div>
                      </div>
                      <span className="font-headline font-black text-primary">{u.points} XP</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rounds">
            <Card className="glass-morphism rounded-none classic-border overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="font-headline font-black uppercase text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Global Round Control (Bulk Unlock/Lock)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {[
                  { label: "ROUND 1", val: 1 },
                  { label: "ROUND 2", val: 2 },
                  { label: "ROUND 3", val: 3 },
                  { label: "KNOCKOUTS", val: 4 }
                ].map(r => (
                  <div key={r.val} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border bg-card/30 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-black uppercase block">{r.label}</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Manage entry access for all matches in this round</span>
                    </div>
                    <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
                      <Button size="sm" variant="outline" className="h-10 text-[9px] md:text-[10px] font-black px-2 md:px-6 flex items-center justify-center gap-2" onClick={() => handleLockRound(r.val, false)}>
                        <Unlock className="h-3 w-3" /> 
                        <span className="truncate">UNLOCK ROUND</span>
                      </Button>
                      <Button size="sm" variant="default" className="h-10 text-[9px] md:text-[10px] font-black px-2 md:px-6 bg-primary flex items-center justify-center gap-2" onClick={() => handleLockRound(r.val, true)}>
                        <Lock className="h-3 w-3" /> 
                        <span className="truncate">LOCK ROUND</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="glass-morphism rounded-none classic-border">
                  <CardHeader className="bg-primary/5 border-b border-border">
                    <CardTitle className="font-headline font-black uppercase text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Student Inbox
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {messages.length > 0 ? messages.map(msg => (
                          <div key={msg.id} className="p-3 border border-border bg-card/30 relative group">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black uppercase text-primary">{msg.username}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => { db.inbox.delete(msg.id); refresh(); }}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-[11px] font-medium leading-relaxed">{msg.message}</p>
                            <span className="text-[8px] text-muted-foreground uppercase block mt-2">{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                        )) : (
                          <p className="text-[10px] text-center text-muted-foreground font-black uppercase py-20 italic">No student messages found.</p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="glass-morphism rounded-none classic-border">
                  <CardHeader className="bg-primary/5 border-b border-border">
                    <CardTitle className="font-headline font-black uppercase text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Global Broadcaster
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <Input placeholder="Send announcement to all students..." value={broadcast} onChange={e => setBroadcast(e.target.value)} className="bg-card/50 text-[11px] font-bold rounded-none h-11 border-border" />
                    <Button onClick={sendBroadcast} className="w-full bg-primary text-[10px] font-black uppercase tracking-widest rounded-none h-11 shadow-lg">SEND BULLETIN</Button>
                  </CardContent>
                </Card>

                <Card className="glass-morphism rounded-none classic-border border-destructive/20 overflow-hidden">
                  <CardHeader className="bg-destructive/5 border-b border-border">
                    <CardTitle className="font-headline font-black uppercase text-sm text-destructive flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      System Reset
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
                      Danger: This will clear all tournament data, student accounts, and results. Use with extreme caution.
                    </p>
                    <Button 
                      variant="destructive" 
                      className="w-full rounded-none font-black text-[10px] uppercase h-11"
                      onClick={handleResetSystem}
                    >
                      NUCLEAR SYSTEM RESET
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  );
}

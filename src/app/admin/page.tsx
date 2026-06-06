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
  Trophy,
  History,
  FilePlus2,
  Radio,
  Settings2
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const STADIUMS = {
  USA: [
    "Mercedes-Benz Stadium (Atlanta)",
    "Gillette Stadium (Boston)",
    "AT&T Stadium (Dallas - 9 matches)",
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

  const refresh = () => {
    setMatches(db.matches.all());
    setMessages(db.inbox.all());
    setUsers(db.users.all());
    setSettings(db.settings.get());
  };

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
    if (confirm("CRITICAL: This will permanently delete all data. Continue?")) {
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
    if (confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      db.matches.delete(matchId);
      refresh();
      toast({ title: "Match Deleted", description: "The fixture has been removed from the tournament." });
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
    toast({ title: "Standings Recalculated", description: "All points have been updated based on final scores." });
  };

  const handleUpdateScore = (matchId: string, scoreA: number, scoreB: number) => {
    db.matches.update(matchId, { scoreA, scoreB, isFinished: true, isLocked: true });
    recalculatePoints();
  };

  const saveEdit = (matchId: string, updates: any) => {
    db.matches.update(matchId, updates);
    setEditingMatch(null);
    toast({ title: "Updated" });
    refresh();
  };

  const sendBroadcast = () => {
    if (!broadcast) return;
    db.broadcasts.add(broadcast, 'ADMIN');
    setBroadcast('');
    toast({ title: "Broadcast Transmitted" });
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
      <div className="fixed inset-0 z-0">
        <Image 
          src={stadiumBg?.imageUrl || ''} 
          alt="Stadium Background" 
          fill 
          className="object-cover opacity-10 dark:opacity-5 blur-[4px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/90 to-background" />
      </div>

      <BrandingHeader compact />

      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-none">
              <ShieldCheck className="text-white h-5 w-5" />
            </div>
            <h1 className="font-headline font-black text-xs uppercase tracking-[0.3em] text-primary">Command Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')} className="font-black uppercase text-[9px] tracking-widest rounded-none border-primary/20">
              <ArrowLeft className="h-3 w-3 mr-2" /> User View
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive font-black uppercase text-[9px] tracking-widest hover:bg-destructive/5 rounded-none">
              <LogOut className="h-3 w-3 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8 space-y-8 z-10 flex-1 max-w-7xl">
        <Tabs defaultValue="entry" className="w-full">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="flex w-full min-w-max h-auto bg-muted/30 border border-border p-1 rounded-none mb-8">
              {[
                { val: "entry", icon: FilePlus2, label: "Entry Section" },
                { val: "manage", icon: History, label: "Fixture Hub" },
                { val: "leadership", icon: Trophy, label: "Leadership" },
                { val: "rounds", icon: Lock, label: "Round Toggles" },
                { val: "broadcast", icon: Radio, label: "Live Broadcast" },
                { val: "system", icon: Settings2, label: "System Core" }
              ].map(t => (
                <TabsTrigger key={t.val} value={t.val} className="rounded-none py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] gap-3 flex-1 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <t.icon className="h-4 w-4" /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="entry" className="animate-fade-in-up">
            <Card className="glass-morphism rounded-none classic-border overflow-hidden shadow-2xl">
              <CardHeader className="bg-primary/5 border-b border-border py-6">
                <CardTitle className="font-headline font-black uppercase tracking-widest text-sm flex items-center gap-3">
                  <Plus className="h-5 w-5 text-primary" />
                  New Fixture Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-10 px-6 md:px-12 pb-12">
                <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Home Team Identity</Label>
                      <div className="flex gap-4">
                        <Input placeholder="e.g. Mexico" value={newMatch.teamA} onChange={e => setNewMatch({...newMatch, teamA: e.target.value})} className="rounded-none bg-background/50 border-border h-12 font-bold" />
                        <Input placeholder="🇲🇽" value={newMatch.flagA} onChange={e => setNewMatch({...newMatch, flagA: e.target.value})} className="w-24 rounded-none bg-background/50 border-border text-center text-2xl h-12" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Away Team Identity</Label>
                      <div className="flex gap-4">
                        <Input placeholder="e.g. South Africa" value={newMatch.teamB} onChange={e => setNewMatch({...newMatch, teamB: e.target.value})} className="rounded-none bg-background/50 border-border h-12 font-bold" />
                        <Input placeholder="🇿🇦" value={newMatch.flagB} onChange={e => setNewMatch({...newMatch, flagB: e.target.value})} className="w-24 rounded-none bg-background/50 border-border text-center text-2xl h-12" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tournament Round</Label>
                      <Select value={newMatch.round.toString()} onValueChange={v => setNewMatch({...newMatch, round: parseInt(v)})}>
                        <SelectTrigger className="rounded-none bg-background/50 border-border h-12 font-bold uppercase text-[10px]">
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
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Group / Pool</Label>
                      <Input placeholder="Group A" value={newMatch.group} onChange={e => setNewMatch({...newMatch, group: e.target.value})} className="rounded-none bg-background/50 border-border h-12 font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Match Date</Label>
                      <Input type="date" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} className="rounded-none bg-background/50 border-border h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Kickoff Time (24h)</Label>
                      <Input type="time" value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} className="rounded-none bg-background/50 border-border h-12 font-bold" />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Official Venue</Label>
                    <Select value={newMatch.venue} onValueChange={v => setNewMatch({...newMatch, venue: v})}>
                      <SelectTrigger className="rounded-none bg-background/50 border-border h-12 font-bold">
                        <SelectValue placeholder="Select Tournament Stadium" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STADIUMS).map(([country, venues]) => (
                          <SelectGroup key={country}>
                            <SelectLabel className="text-primary font-black uppercase text-[10px] tracking-[0.2em] py-3 border-b border-border/50 mb-1">{country} HOSTS</SelectLabel>
                            {venues.map(s => <SelectItem key={s} value={s} className="text-[11px] font-bold">{s}</SelectItem>)}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="md:col-span-2 w-full bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase tracking-[0.4em] h-16 shadow-2xl transition-all hover:scale-[1.01] mt-4">
                    Commit to Tournament Schedule
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="animate-fade-in-up">
            <Card className="glass-morphism rounded-none classic-border shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-primary/5 py-6">
                <CardTitle className="font-headline font-black uppercase tracking-widest text-sm">Active Fixture Management</CardTitle>
                <Badge variant="outline" className="text-primary border-primary/30 rounded-none text-[9px] font-black tracking-widest px-4 py-1">{matches.length} REGISTERED</Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {matches.length > 0 ? [...matches].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(m => (
                  <div key={m.id} className="p-6 rounded-none border border-border bg-background/40 hover:bg-primary/5 transition-all">
                    {editingMatch === m.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input className="rounded-none font-bold" defaultValue={m.teamA} id={`editTeamA-${m.id}`} />
                        <Input className="rounded-none font-bold" defaultValue={m.teamB} id={`editTeamB-${m.id}`} />
                        <Select defaultValue={m.venue} onValueChange={v => {
                          const input = document.getElementById(`editVenue-${m.id}`) as HTMLInputElement;
                          if (input) input.value = v;
                        }}>
                          <SelectTrigger className="rounded-none font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(STADIUMS).flat().map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <input type="hidden" id={`editVenue-${m.id}`} defaultValue={m.venue} />
                        <div className="flex gap-4 md:col-span-3">
                          <Button size="sm" className="flex-1 font-black uppercase tracking-widest rounded-none" onClick={() => {
                            const updates = {
                              teamA: (document.getElementById(`editTeamA-${m.id}`) as HTMLInputElement).value,
                              teamB: (document.getElementById(`editTeamB-${m.id}`) as HTMLInputElement).value,
                              venue: (document.getElementById(`editVenue-${m.id}`) as HTMLInputElement).value,
                            };
                            saveEdit(m.id, updates);
                          }}>Save Updates</Button>
                          <Button size="sm" variant="outline" className="flex-1 font-black uppercase tracking-widest rounded-none" onClick={() => setEditingMatch(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="text-center w-20 border-r border-border/50 pr-6">
                            <Badge className="bg-primary text-white mb-2 uppercase font-black text-[9px] rounded-none px-2 tracking-tighter">RD {m.round}</Badge>
                            <p className="text-[9px] font-black text-muted-foreground uppercase">{m.group}</p>
                          </div>
                          <div>
                            <p className="font-headline font-black text-base uppercase tracking-tight mb-1">
                              {m.flagA} {m.teamA} <span className="text-primary mx-3 text-xs italic">VS</span> {m.teamB} {m.flagB}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{m.date} | {format12h(m.time)} | {m.venue}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-none border border-border">
                            <Input className="w-12 h-10 p-0 text-center bg-transparent border-none text-base font-black focus-visible:ring-0" defaultValue={m.scoreA} id={`scoreA-${m.id}`} placeholder="A" />
                            <span className="font-black text-xs text-muted-foreground">:</span>
                            <Input className="w-12 h-10 p-0 text-center bg-transparent border-none text-base font-black focus-visible:ring-0" defaultValue={m.scoreB} id={`scoreB-${m.id}`} placeholder="B" />
                            <Button 
                              size="icon" 
                              className="h-10 w-10 bg-primary hover:bg-primary/90 rounded-none shadow-lg"
                              onClick={() => {
                                const sA = (document.getElementById(`scoreA-${m.id}`) as HTMLInputElement).value;
                                const sB = (document.getElementById(`scoreB-${m.id}`) as HTMLInputElement).value;
                                if (sA !== '' && sB !== '') handleUpdateScore(m.id, parseInt(sA), parseInt(sB));
                              }}
                            >
                              <CheckCircle className="h-5 w-5 text-white" />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => toggleLock(m.id, m.isLocked)}
                            className={`h-10 w-10 rounded-none border-border transition-colors ${m.isLocked ? 'bg-destructive/10 text-destructive' : 'bg-green-600/10 text-green-600'}`}
                          >
                            {m.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>

                          <Button size="icon" variant="ghost" onClick={() => setEditingMatch(m.id)} className="h-10 w-10 rounded-none text-primary hover:bg-primary/10">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteMatch(m.id)} className="h-10 w-10 rounded-none text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="py-24 text-center glass-morphism border-2 border-dashed border-border">
                    <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">No fixtures registered.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leadership" className="animate-fade-in-up">
            <Card className="glass-morphism rounded-none classic-border shadow-2xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border py-6">
                <CardTitle className="font-headline font-black uppercase tracking-widest text-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ListOrdered className="h-5 w-5 text-primary" />
                    Student Standing Table
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={recalculatePoints} className="rounded-none border-primary/30 text-[9px] font-black uppercase h-8 px-4 bg-primary/5 hover:bg-primary hover:text-white transition-all">
                      <RefreshCcw className="h-3 w-3 mr-2" /> Recalculate Points
                    </Button>
                    <div className="flex items-center gap-4 bg-background/50 px-6 py-2 border border-border">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{settings.leaderboardVisible ? "LIVE TO USERS" : "HIDDEN FROM USERS"}</span>
                      <Switch checked={settings.leaderboardVisible} onCheckedChange={toggleLeaderboardVisibility} />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {users.filter(u => !u.isAdmin).map((u, idx) => (
                    <div key={u.id} className="flex items-center justify-between px-10 py-6 hover:bg-primary/5 transition-all group">
                      <div className="flex items-center gap-8">
                        <span className={`w-10 text-sm font-black ${idx < 3 ? 'text-primary' : 'text-muted-foreground'}`}>#{idx + 1}</span>
                        <div>
                          <p className="font-headline font-black uppercase text-base group-hover:text-primary transition-colors">{u.username}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">{u.year} | {u.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-headline font-black text-primary text-2xl">{u.points}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">ACCUMULATED XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rounds" className="animate-fade-in-up">
            <Card className="glass-morphism rounded-none classic-border overflow-hidden shadow-2xl">
              <CardHeader className="bg-primary/5 border-b border-border py-6">
                <CardTitle className="font-headline font-black uppercase tracking-widest text-sm flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  Global Round Switchboard
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-10 px-6 md:px-12 pb-12 space-y-6">
                {[
                  { label: "GROUP STAGE ROUND 1", val: 1, desc: "Opening set of 24 fixtures" },
                  { label: "GROUP STAGE ROUND 2", val: 2, desc: "Mid-group tournament matches" },
                  { label: "GROUP STAGE ROUND 3", val: 3, desc: "Final group stage qualifiers" },
                  { label: "KNOCKOUT PHASE", val: 4, desc: "Round of 32 through Final" }
                ].map(r => (
                  <div key={r.val} className="flex flex-col md:flex-row md:items-center justify-between p-8 border border-border bg-background/40 hover:border-primary/30 transition-all gap-8">
                    <div className="space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] block">{r.label}</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{r.desc}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                      <Button size="lg" variant="outline" className="h-14 text-[10px] font-black px-8 rounded-none tracking-[0.2em] border-primary/20 hover:bg-green-600 hover:text-white transition-all uppercase" onClick={() => handleLockRound(r.val, false)}>
                        <Unlock className="h-4 w-4 mr-3" /> OPEN
                      </Button>
                      <Button size="lg" className="h-14 text-[10px] font-black px-8 bg-primary rounded-none tracking-[0.2em] shadow-xl hover:bg-destructive transition-all uppercase" onClick={() => handleLockRound(r.val, true)}>
                        <Lock className="h-4 w-4 mr-3" /> LOCK
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="broadcast" className="animate-fade-in-up">
            <Card className="glass-morphism rounded-none classic-border shadow-2xl h-fit overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border py-6">
                <CardTitle className="font-headline font-black uppercase tracking-widest text-sm flex items-center gap-3">
                  <Radio className="h-5 w-5 text-primary" />
                  Live Announcement Broadcast
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-10 px-6 md:px-12 pb-12 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Message Payload</Label>
                  <Input 
                    placeholder="Enter urgent broadcast message for all players..." 
                    value={broadcast} 
                    onChange={e => setBroadcast(e.target.value)} 
                    className="bg-background/50 font-bold rounded-none h-20 border-border px-6 focus:ring-primary/30 text-base" 
                  />
                </div>
                <Button onClick={sendBroadcast} className="w-full bg-primary text-[11px] font-black uppercase tracking-[0.4em] rounded-none h-16 shadow-2xl hover:bg-primary/90 transition-all">
                  TRANSMIT TO ALL ARENAS
                </Button>

                <div className="pt-10 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Recent Transmissions</h3>
                  <ScrollArea className="h-[300px] border border-border bg-background/20 p-4">
                    <div className="space-y-4">
                      {db.broadcasts.all().map(b => (
                        <div key={b.id} className="p-4 bg-muted/30 border-l-2 border-primary">
                          <p className="text-[11px] font-bold mb-2">{b.message}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{new Date(b.timestamp).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="glass-morphism rounded-none classic-border shadow-2xl h-fit">
                <CardHeader className="bg-primary/5 border-b border-border py-6">
                  <CardTitle className="font-headline font-black uppercase tracking-widest text-sm flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    Incoming Transmissions (Inbox)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4 pr-4">
                      {messages.length > 0 ? messages.map(msg => (
                        <div key={msg.id} className="p-6 border border-border bg-background/30 relative group hover:border-primary/30 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">{msg.username}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => { db.inbox.delete(msg.id); refresh(); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-[11px] font-bold leading-relaxed mb-4">{msg.message}</p>
                          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-[0.2em] border-t border-border/30 pt-3 block">{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                      )) : (
                        <div className="py-24 text-center glass-morphism border-2 border-dashed border-border">
                          <p className="text-muted-foreground font-black uppercase text-[9px] tracking-[0.3em]">Inbox Empty</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="space-y-10">
                <Card className="glass-morphism rounded-none classic-border border-destructive/30 overflow-hidden shadow-2xl">
                  <CardHeader className="bg-destructive/10 border-b border-border py-6 text-center">
                    <CardTitle className="font-headline font-black uppercase tracking-widest text-sm text-destructive flex items-center justify-center gap-3">
                      <RefreshCcw className="h-5 w-5 animate-spin-slow" />
                      Critical System Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-10 space-y-6 px-10 pb-12">
                    <div className="bg-destructive/5 p-6 border border-destructive/10">
                      <p className="text-[10px] font-black text-destructive uppercase leading-relaxed text-center tracking-widest">
                        WARNING: EXECUTION OF THE NUCLEAR OPTION WILL PERMANENTLY ERASE ALL TOURNAMENT DATA, PLAYER PROFILES, AND RECORDS.
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="w-full rounded-none font-black text-[11px] uppercase h-16 tracking-[0.4em] shadow-2xl transition-all active:scale-95"
                      onClick={handleResetSystem}
                    >
                      EXECUTE NUCLEAR RESET
                    </Button>
                  </CardContent>
                </Card>

                <div className="p-10 text-center glass-morphism classic-border">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">Dhruva 2026 Prediction Arena Core</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  );
}
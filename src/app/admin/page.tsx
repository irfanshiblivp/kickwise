"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { db, Match, UserMessage, AppSettings, User } from '@/lib/db';
import { BrandingHeader } from '@/components/branding-header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Settings2,
  Eye,
  EyeOff,
  Flame,
  ExternalLink,
  Database
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';

const STADIUMS = {
  USA: [
    "Mercedes-Benz Stadium (Atlanta)",
    "Gillette Stadium (Boston)",
    "AT&T Stadium (Dallas)",
    "NRG Stadium (Houston)",
    "Arrowhead Stadium (Kansas City)",
    "SoFi Stadium (Los Angeles)",
    "Hard Rock Stadium (Miami)",
    "MetLife Stadium (NY/NJ)",
    "Lincoln Financial Field (Philadelphia)",
    "Levi's Stadium (SF Bay Area)",
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

const WORLD_CUP_FIXTURES = [
  // Opening Matches
  { teamA: "Mexico", teamB: "Group A2", flagA: "🇲🇽", flagB: "🏳️", group: "Group A", round: 1, date: "2026-06-11", time: "18:00", venue: "Estadio Azteca (Mexico City)" },
  { teamA: "Canada", teamB: "Group B2", flagA: "🇨🇦", flagB: "🏳️", group: "Group B", round: 1, date: "2026-06-12", time: "17:00", venue: "BMO Field (Toronto)" },
  { teamA: "USA", teamB: "Group D2", flagA: "🇺🇸", flagB: "🏳️", group: "Group D", round: 1, date: "2026-06-12", time: "19:00", venue: "SoFi Stadium (Los Angeles)" },
  
  // Group Stage Marquee Matchups (Plausible/Sample)
  { teamA: "Argentina", teamB: "Portugal", flagA: "🇦🇷", flagB: "🇵🇹", group: "Group C", round: 1, date: "2026-06-13", time: "20:00", venue: "AT&T Stadium (Dallas)" },
  { teamA: "France", teamB: "Senegal", flagA: "🇫🇷", flagB: "🇸🇳", group: "Group E", round: 1, date: "2026-06-14", time: "15:00", venue: "Hard Rock Stadium (Miami)" },
  { teamA: "Brazil", teamB: "Belgium", flagA: "🇧🇷", flagB: "🇧🇪", group: "Group F", round: 1, date: "2026-06-15", time: "19:00", venue: "MetLife Stadium (NY/NJ)" },
  { teamA: "England", teamB: "Nigeria", flagA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flagB: "🇳🇬", group: "Group G", round: 1, date: "2026-06-16", time: "18:00", venue: "Arrowhead Stadium (Kansas City)" },
  { teamA: "Spain", teamB: "Japan", flagA: "🇪🇸", flagB: "🇯🇵", group: "Group H", round: 1, date: "2026-06-17", time: "20:00", venue: "Levi's Stadium (SF Bay Area)" },
  { teamA: "Germany", teamB: "Morocco", flagA: "🇩🇪", flagB: "🇲🇦", group: "Group I", round: 1, date: "2026-06-18", time: "16:00", venue: "NRG Stadium (Houston)" },
  { teamA: "Netherlands", teamB: "South Korea", flagA: "🇳🇱", flagB: "🇰🇷", group: "Group J", round: 1, date: "2026-06-19", time: "17:00", venue: "BC Place (Vancouver)" },
  { teamA: "Italy", teamB: "Uruguay", flagA: "🇮🇹", flagB: "🇺🇾", group: "Group K", round: 1, date: "2026-06-20", time: "19:00", venue: "Lincoln Financial Field (Philadelphia)" },
  { teamA: "Croatia", teamB: "Colombia", flagA: "🇭🇷", flagB: "🇨🇴", group: "Group L", round: 1, date: "2026-06-21", time: "18:00", venue: "Lumen Field (Seattle)" },

  // Round 2 Samples
  { teamA: "Mexico", teamB: "Group A3", flagA: "🇲🇽", flagB: "🏳️", group: "Group A", round: 2, date: "2026-06-22", time: "19:00", venue: "Estadio BBVA (Monterrey)" },
  { teamA: "USA", teamB: "Group D3", flagA: "🇺🇸", flagB: "🏳️", group: "Group D", round: 2, date: "2026-06-23", time: "20:00", venue: "Lumen Field (Seattle)" },
  { teamA: "Argentina", teamB: "Group C3", flagA: "🇦🇷", flagB: "🏳️", group: "Group C", round: 2, date: "2026-06-24", time: "18:00", venue: "NRG Stadium (Houston)" },
  
  // Friendlies
  { teamA: "India", teamB: "Australia", flagA: "🇮🇳", flagB: "🇦🇺", group: "Friendly", round: 0, date: "2026-06-05", time: "20:00", venue: "MetLife Stadium (NY/NJ)" },
  { teamA: "Switzerland", teamB: "Sweden", flagA: "🇨🇭", flagB: "🇸🇪", group: "Friendly", round: 0, date: "2026-06-06", time: "19:00", venue: "BMO Field (Toronto)" }
];

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const matchesQuery = useMemo(() => query(collection(firestore, 'matches'), orderBy('date', 'asc')), [firestore]);
  const messagesQuery = useMemo(() => query(collection(firestore, 'inbox'), orderBy('timestamp', 'desc')), [firestore]);
  const usersQuery = useMemo(() => query(collection(firestore, 'users'), orderBy('points', 'desc')), [firestore]);
  const broadcastsQuery = useMemo(() => query(collection(firestore, 'broadcasts'), orderBy('timestamp', 'desc')), [firestore]);
  const settingsDocRef = useMemo(() => doc(firestore, 'settings', 'app'), [firestore]);

  const { data: matches = [] } = useCollection<Match>(matchesQuery);
  const { data: messages = [] } = useCollection<UserMessage>(messagesQuery);
  const { data: users = [] } = useCollection<User>(usersQuery);
  const { data: broadcasts = [] } = useCollection<any>(broadcastsQuery);
  const { data: settingsData } = useDoc<AppSettings>(settingsDocRef);

  const settings = settingsData || { leaderboardVisible: true };

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
  }, [router]);

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.teamA || !newMatch.teamB || !newMatch.venue) {
      toast({ title: "Validation Error", description: "Teams and Venue are required.", variant: "destructive" });
      return;
    }
    db.matches.add(firestore, {
      ...newMatch,
      isLocked: false
    });
    toast({ title: "Match Added", description: `${newMatch.teamA} vs ${newMatch.teamB} scheduled.` });
    setNewMatch({ teamA: '', teamB: '', flagA: '', flagB: '', group: 'Group A', round: 1, date: '', time: '', venue: '' });
  };

  const seedTournamentData = async () => {
    for (const fixture of WORLD_CUP_FIXTURES) {
      db.matches.add(firestore, { ...fixture, isLocked: false });
    }
    toast({ title: "Tournament Initialized", description: "All marquee 2026 fixtures have been added to the cloud database." });
  };

  const toggleLeaderboardVisibility = (checked: boolean) => {
    db.settings.update(firestore, { leaderboardVisible: checked });
    toast({ 
      title: checked ? "Leaderboard Live" : "Leaderboard Hidden", 
      description: checked ? "Standings are now visible to all players." : "Standings access has been restricted."
    });
  };

  const toggleLock = (matchId: string, currentStatus: boolean) => {
    db.matches.update(firestore, matchId, { isLocked: !currentStatus });
    toast({ title: `Match ${!currentStatus ? 'Locked' : 'Unlocked'}` });
  };

  const handleLockRound = (round: number, lock: boolean) => {
    db.matches.lockRound(firestore, round, lock);
    toast({ title: `Round ${round} ${lock ? 'Locked' : 'Unlocked'}` });
  };

  const deleteMatch = (matchId: string) => {
    if (confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      db.matches.delete(firestore, matchId);
      toast({ title: "Match Deleted", description: "The fixture has been removed from the tournament." });
    }
  };

  const handleUpdateScore = (matchId: string, scoreA: number, scoreB: number) => {
    db.matches.update(firestore, matchId, { scoreA, scoreB, isFinished: true, isLocked: true });
    toast({ title: "Score Updated", description: "The match result has been logged. Points will update shortly." });
  };

  const saveEdit = (matchId: string, updates: any) => {
    db.matches.update(firestore, matchId, updates);
    setEditingMatch(null);
    toast({ title: "Updated" });
  };

  const sendBroadcast = () => {
    if (!broadcast) return;
    db.broadcasts.add(firestore, broadcast, 'ADMIN');
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

      <BrandingHeader compact showPredictingLogo />

      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-none">
              <ShieldCheck className="text-white h-5 w-5" />
            </div>
            <h1 className="font-headline font-black text-xs uppercase tracking-[0.3em] text-primary">Command Center</h1>
          </div>
          <div className="flex items-center gap-4">
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
                        <Input value={newMatch.teamA} onChange={e => setNewMatch({...newMatch, teamA: e.target.value})} className="rounded-none bg-background/50 border-border h-12 font-bold" />
                        <Input value={newMatch.flagA} onChange={e => setNewMatch({...newMatch, flagA: e.target.value})} className="w-24 rounded-none bg-background/50 border-border text-center text-2xl h-12" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Away Team Identity</Label>
                      <div className="flex gap-4">
                        <Input value={newMatch.teamB} onChange={e => setNewMatch({...newMatch, teamB: e.target.value})} className="rounded-none bg-background/50 border-border h-12 font-bold" />
                        <Input value={newMatch.flagB} onChange={e => setNewMatch({...newMatch, flagB: e.target.value})} className="w-24 rounded-none bg-background/50 border-border text-center text-2xl h-12" />
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
                          <SelectItem value="0">Friendly</SelectItem>
                          <SelectItem value="1">Round 1</SelectItem>
                          <SelectItem value="2">Round 2</SelectItem>
                          <SelectItem value="3">Round 3</SelectItem>
                          <SelectItem value="4">Knockouts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Group / Pool</Label>
                      <Input value={newMatch.group} onChange={e => setNewMatch({...newMatch, group: e.target.value})} className="rounded-none bg-background/50 border-border h-12 font-bold" />
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
                        <SelectValue />
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
                {matches.length > 0 ? matches.map(m => (
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
                            <Badge className="bg-primary text-white mb-2 uppercase font-black text-[9px] rounded-none px-2 tracking-tighter">{m.round === 0 ? 'FRND' : `RD ${m.round}`}</Badge>
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
                            <Input className="w-12 h-10 p-0 text-center bg-transparent border-none text-base font-black focus-visible:ring-0" defaultValue={m.scoreA} id={`scoreA-${m.id}`} />
                            <span className="font-black text-xs text-muted-foreground">:</span>
                            <Input className="w-12 h-10 p-0 text-center bg-transparent border-none text-base font-black focus-visible:ring-0" defaultValue={m.scoreB} id={`scoreB-${m.id}`} />
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
                <CardTitle className="font-headline font-black uppercase tracking-widest text-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <ListOrdered className="h-5 w-5 text-primary" />
                    Student Standing Table
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-4 bg-background/80 px-4 py-2 border-2 border-primary/20 shadow-lg">
                      {settings.leaderboardVisible ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-destructive" />}
                      <span className="text-[9px] font-black text-foreground uppercase tracking-widest min-w-[120px]">
                        {settings.leaderboardVisible ? "LEADERBOARD: LIVE" : "LEADERBOARD: HIDDEN"}
                      </span>
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
                  { label: "INTERNATIONAL FRIENDLIES", val: 0, desc: "Exhibition match-ups" },
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
                      {broadcasts.map((b: any) => (
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => { db.inbox.delete(firestore, msg.id); }}>
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
                <Card className="glass-morphism rounded-none classic-border border-primary/20 overflow-hidden shadow-2xl">
                  <CardHeader className="bg-primary/10 border-b border-border py-6 text-center">
                    <CardTitle className="font-headline font-black uppercase tracking-widest text-sm text-primary flex items-center justify-center gap-3">
                      <RefreshCcw className="h-5 w-5" />
                      Tournament Utilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-10 space-y-6 px-10 pb-12">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 text-center mb-6">Data Management</p>
                     <Button 
                      onClick={seedTournamentData}
                      variant="outline"
                      className="w-full h-14 border-primary/20 rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary/5 group"
                    >
                      <Flame className="h-4 w-4 mr-3 text-primary group-hover:animate-bounce" />
                      Initialize 2026 World Cup Fixtures
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-morphism rounded-none classic-border shadow-2xl border-primary/20 bg-primary/5">
                  <CardHeader className="border-b border-border py-6">
                    <CardTitle className="font-headline font-black uppercase tracking-widest text-sm flex items-center gap-3 text-primary">
                      <Database className="h-5 w-5" />
                      Firestore Database Console
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 px-10 pb-10 space-y-8">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Project Identity</p>
                      <div className="flex items-center justify-between bg-background p-3 border border-border">
                        <code className="text-xs font-bold text-primary">studio-1840118234-897d1</code>
                        <Badge className="bg-green-600 text-white font-black text-[8px] rounded-none">CONNECTED</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[11px] font-bold text-foreground leading-relaxed">
                        Access the Firebase Console to manage real-time data, view player records, and monitor tournament logs.
                      </p>
                      <Button 
                        asChild
                        className="w-full bg-primary hover:bg-primary/90 h-14 rounded-none font-black uppercase tracking-[0.2em] text-[10px] shadow-xl"
                      >
                        <a href="https://console.firebase.google.com/u/0/project/studio-1840118234-897d1/firestore/data" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                          View Live Database <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase text-center">
                        Secure Access via: <span className="text-foreground">Google Cloud Identity</span>
                      </p>
                    </div>
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
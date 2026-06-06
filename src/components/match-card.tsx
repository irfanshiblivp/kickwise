"use client";

import { useState, useEffect } from 'react';
import { Match, db, User, Prediction } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Lock, Trophy, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface MatchCardProps {
  match: Match;
  user: User;
  existingPrediction?: Prediction;
  onPredictionSubmit: () => void;
}

export function MatchCard({ match, user, existingPrediction, onPredictionSubmit }: MatchCardProps) {
  const [scoreA, setScoreA] = useState(existingPrediction?.scoreA.toString() || '');
  const [scoreB, setScoreB] = useState(existingPrediction?.scoreB.toString() || '');
  const [isAutoLocked, setIsAutoLocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkLock = () => {
      if (!match.date || !match.time) return;
      const matchStart = new Date(`${match.date}T${match.time}`);
      const now = new Date();
      // Lock 30 minutes before match starts
      const lockThreshold = new Date(matchStart.getTime() - 30 * 60 * 1000);
      if (now >= lockThreshold) {
        setIsAutoLocked(true);
      }
    };

    checkLock();
    const timer = setInterval(checkLock, 30000); // Check every 30 seconds
    return () => clearInterval(timer);
  }, [match.date, match.time]);

  const effectiveLocked = match.isLocked || isAutoLocked || match.isFinished;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveLocked) return;
    if (scoreA === '' || scoreB === '') {
      toast({ title: "Scores Required", description: "Please enter both scores.", variant: "destructive" });
      return;
    }

    db.predictions.submit({
      userId: user.id,
      matchId: match.id,
      scoreA: parseInt(scoreA),
      scoreB: parseInt(scoreB)
    });
    
    toast({
      title: "Prediction Recorded",
      description: `Your ${scoreA}-${scoreB} result has been locked in.`
    });
    onPredictionSubmit();
  };

  const isUrl = (str: string) => str.startsWith('http') || str.startsWith('https') || str.startsWith('/');

  return (
    <Card className={`glass-morphism rounded-none border-primary/10 relative overflow-hidden transition-all duration-300 animate-fade-in-up ${effectiveLocked && !match.isFinished ? 'opacity-80' : 'hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase rounded-none px-2 py-0.5">
            {match.group || 'Tournament'} Fixture
          </Badge>
          {match.isFinished ? (
            <Badge variant="default" className="bg-green-600 text-white rounded-none text-[8px] font-bold uppercase">Result Final</Badge>
          ) : effectiveLocked ? (
            <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 rounded-none text-[8px] font-bold uppercase">
              <Lock className="h-2.5 w-2.5 mr-1" /> Entries Closed
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-600/30 rounded-none text-[8px] font-black uppercase animate-pulse">
              <Timer className="h-2.5 w-2.5 mr-1" /> Open for Entries
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-center gap-1">
          <div className="flex-1 flex flex-col items-center group/team">
            {isUrl(match.flagA) ? (
              <div className="relative h-12 w-12 mb-2 transition-transform group-hover/team:scale-110">
                <Image src={match.flagA} alt={match.teamA} fill className="object-contain" />
              </div>
            ) : (
              <span className="text-4xl mb-1 transition-transform group-hover/team:scale-110">{match.flagA || '🏳️'}</span>
            )}
            <span className="font-headline font-black text-sm uppercase tracking-tighter truncate w-full">{match.teamA}</span>
            {match.isFinished && (
              <span className="text-xl font-black text-primary mt-1">{match.scoreA}</span>
            )}
          </div>
          
          <div className="flex flex-col items-center px-2">
            <span className="text-muted-foreground font-black text-[9px] uppercase">VS</span>
          </div>

          <div className="flex-1 flex flex-col items-center group/team">
             {isUrl(match.flagB) ? (
              <div className="relative h-12 w-12 mb-2 transition-transform group-hover/team:scale-110">
                <Image src={match.flagB} alt={match.teamB} fill className="object-contain" />
              </div>
            ) : (
              <span className="text-4xl mb-1 transition-transform group-hover/team:scale-110">{match.flagB || '🏳️'}</span>
            )}
            <span className="font-headline font-black text-sm uppercase tracking-tighter truncate w-full">{match.teamB}</span>
            {match.isFinished && (
              <span className="text-xl font-black text-primary mt-1">{match.scoreB}</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="flex flex-col gap-1.5 text-[10px] font-bold uppercase text-foreground/50 bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-primary" />
            <span>{match.date} @ {match.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="truncate">{match.venue}</span>
          </div>
        </div>

        {match.isFinished ? (
          <div className="bg-primary/5 p-3 border border-primary/10">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Trophy className="h-3 w-3" />
              <span className="text-[10px] font-black uppercase">Official Result: {match.scoreA} - {match.scoreB}</span>
            </div>
            {existingPrediction && (
              <div className="mt-2 text-center border-t border-primary/5 pt-2">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">
                  Your entry: <span className="text-foreground">{existingPrediction.scoreA} - {existingPrediction.scoreB}</span>
                </p>
                {existingPrediction.scoreA === match.scoreA && existingPrediction.scoreB === match.scoreB ? (
                  <p className="text-[8px] text-green-600 font-black mt-1 animate-bounce">+10 POINTS EARNED</p>
                ) : (
                  ((existingPrediction.scoreA > existingPrediction.scoreB && match.scoreA! > match.scoreB!) ||
                   (existingPrediction.scoreA < existingPrediction.scoreB && match.scoreA! < match.scoreB!) ||
                   (existingPrediction.scoreA === existingPrediction.scoreB && match.scoreA! === match.scoreB!)) &&
                  <p className="text-[8px] text-amber-600 font-black mt-1 animate-bounce">+5 POINTS EARNED</p>
                )}
              </div>
            )}
          </div>
        ) : !effectiveLocked ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-14">
                <Input 
                  type="number" 
                  value={scoreA} 
                  onChange={(e) => setScoreA(e.target.value)}
                  className="text-center text-lg font-black h-10 border-primary/20 rounded-none bg-white/50 transition-all focus:bg-white focus:scale-105"
                  min="0"
                  placeholder="-"
                />
              </div>
              <span className="text-sm font-black text-muted-foreground">:</span>
              <div className="w-14">
                <Input 
                  type="number" 
                  value={scoreB} 
                  onChange={(e) => setScoreB(e.target.value)}
                  className="text-center text-lg font-black h-10 border-primary/20 rounded-none bg-white/50 transition-all focus:bg-white focus:scale-105"
                  min="0"
                  placeholder="-"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest rounded-none h-10 transition-transform active:scale-95 shadow-md hover:shadow-primary/20">
              LOCK PREDICTION
            </Button>
          </form>
        ) : (
          <div className="bg-muted/40 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Entries are closed for this match.</p>
            {existingPrediction && (
              <p className="text-[9px] font-black uppercase mt-1">Your Prediction: {existingPrediction.scoreA} - {existingPrediction.scoreB}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

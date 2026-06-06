
"use client";

import { useState } from 'react';
import { Match, db, User, Prediction } from '@/lib/db';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Sparkles, Lock, Trophy } from 'lucide-react';
import { predictMatch } from '@/ai/flows/prediction-assistant-flow';
import { useToast } from '@/hooks/use-toast';

interface MatchCardProps {
  match: Match;
  user: User;
  existingPrediction?: Prediction;
  onPredictionSubmit: () => void;
}

export function MatchCard({ match, user, existingPrediction, onPredictionSubmit }: MatchCardProps) {
  const [scoreA, setScoreA] = useState(existingPrediction?.scoreA.toString() || '');
  const [scoreB, setScoreB] = useState(existingPrediction?.scoreB.toString() || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (match.isLocked) return;

    db.predictions.submit({
      userId: user.id,
      matchId: match.id,
      scoreA: parseInt(scoreA),
      scoreB: parseInt(scoreB)
    });
    
    toast({
      title: "Prediction Saved!",
      description: `Your ${scoreA}-${scoreB} prediction has been recorded.`
    });
    onPredictionSubmit();
  };

  const handleAiAssist = async () => {
    setIsAiLoading(true);
    try {
      const result = await predictMatch({
        teamA: match.teamA,
        teamB: match.teamB,
        pastMatchesData: "Historic world cup performance and regional qualifiers stats.",
        teamAStats: "High pressing game, key striker in good form.",
        teamBStats: "Solid defensive block, counter-attacking specialists.",
        matchContext: `Match round ${match.round} at ${match.venue}`
      });
      
      toast({
        title: "AI Analysis Complete",
        description: `${result.predictedOutcome}. Suggested score: ${result.predictedScore}. Insights: ${result.insights.substring(0, 100)}...`,
      });

      const [predA, predB] = result.predictedScore.split('-').map(s => s.trim());
      if (predA && predB) {
        setScoreA(predA);
        setScoreB(predB);
      }
    } catch (err) {
      toast({ title: "AI Assistant Error", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Card className={`glass-morphism border-primary/20 relative overflow-hidden smooth-sweep ${match.isLocked ? 'locked-card' : 'hover:border-primary/60'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-none">
            Round {match.round === 4 ? 'Knockout' : match.round}
          </Badge>
          {match.isLocked ? (
            <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
              <Lock className="h-3 w-3 mr-1" /> Locked
            </Badge>
          ) : match.isFinished ? (
            <Badge variant="default" className="bg-green-600 text-white">Finished</Badge>
          ) : (
            <Badge variant="outline" className="text-green-400 border-green-400/30">Live Soon</Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-center gap-2">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-4xl mb-1">{match.flagA}</span>
            <span className="font-headline font-bold text-lg uppercase tracking-wider">{match.teamA}</span>
            {match.isFinished && (
              <span className="text-2xl font-black text-primary mt-1">{match.scoreA}</span>
            )}
          </div>
          
          <div className="flex flex-col items-center px-4">
            <span className="text-muted-foreground font-black text-xs uppercase mb-1">VS</span>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <span className="text-4xl mb-1">{match.flagB}</span>
            <span className="font-headline font-bold text-lg uppercase tracking-wider">{match.teamB}</span>
            {match.isFinished && (
              <span className="text-2xl font-black text-primary mt-1">{match.scoreB}</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-accent" />
            <span>{match.date} @ {match.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span>{match.venue}</span>
          </div>
        </div>

        {match.isFinished ? (
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-bold">Official Result: {match.scoreA} - {match.scoreB}</span>
            </div>
            {existingPrediction && (
              <p className="text-center text-[10px] text-muted-foreground mt-1">
                Your prediction: {existingPrediction.scoreA} - {existingPrediction.scoreB}
              </p>
            )}
          </div>
        ) : !match.isLocked && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16">
                <Input 
                  type="number" 
                  value={scoreA} 
                  onChange={(e) => setScoreA(e.target.value)}
                  className="text-center text-xl font-bold h-12 border-primary/30"
                  min="0"
                />
              </div>
              <span className="text-xl font-bold">-</span>
              <div className="w-16">
                <Input 
                  type="number" 
                  value={scoreB} 
                  onChange={(e) => setScoreB(e.target.value)}
                  className="text-center text-xl font-bold h-12 border-primary/30"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 font-bold">
                SUBMIT
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleAiAssist} 
                disabled={isAiLoading}
                className="bg-accent/20 text-accent hover:bg-accent/30"
              >
                {isAiLoading ? '...' : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

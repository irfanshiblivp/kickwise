
"use client";

import { useEffect, useRef, useMemo } from 'react';
import { Match } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query } from 'firebase/firestore';

export function MatchNotifier() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const notifiedMatches = useRef<Set<string>>(new Set());

  const matchesQuery = useMemo(() => query(collection(firestore, 'matches')), [firestore]);
  const { data: matches } = useCollection<Match>(matchesQuery);

  useEffect(() => {
    if (!matches || matches.length === 0) return;

    const checkUpcomingMatches = () => {
      const now = new Date();

      matches.forEach((match: Match) => {
        if (match.isFinished || match.isLocked) return;
        if (notifiedMatches.current.has(match.id)) return;

        const matchStart = new Date(`${match.date}T${match.time}`);
        const diffInMinutes = (matchStart.getTime() - now.getTime()) / (1000 * 60);

        // Notify if match starts in less than 30 minutes but more than 0
        if (diffInMinutes > 0 && diffInMinutes <= 30) {
          notifiedMatches.current.add(match.id);
          
          toast({
            title: "Fixture Alert!",
            description: `${match.teamA} vs ${match.teamB} starts in ${Math.round(diffInMinutes)} mins! Prediction closes soon.`,
            variant: "default",
          });
        }
      });
    };

    const interval = setInterval(checkUpcomingMatches, 60000);
    checkUpcomingMatches();

    return () => clearInterval(interval);
  }, [toast, matches]);

  return null;
}

"use client";

import { useEffect, useRef } from 'react';
import { db, Match } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export function MatchNotifier() {
  const { toast } = useToast();
  const notifiedMatches = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkUpcomingMatches = () => {
      const allMatches = db.matches.all();
      const now = new Date();

      allMatches.forEach((match: Match) => {
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

    // Check every minute
    const interval = setInterval(checkUpcomingMatches, 60000);
    checkUpcomingMatches(); // Initial check

    return () => clearInterval(interval);
  }, [toast]);

  return null;
}

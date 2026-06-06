
"use client";

export type AcademicYear = '2nd' | '3rd' | '4th';
export type Department = 'CSE' | 'ECE' | 'EEE' | 'ME' | 'CE';

export interface User {
  id: string;
  username: string;
  year: AcademicYear;
  department: Department;
  points: number;
  isAdmin: boolean;
  password?: string;
}

export interface Match {
  id: string;
  round: number; // 1, 2, 3, or 4 for Knockout
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  date: string;
  time: string;
  venue: string;
  isLocked: boolean;
  scoreA?: number;
  scoreB?: number;
  isFinished: boolean;
}

export interface Prediction {
  userId: string;
  matchId: string;
  scoreA: number;
  scoreB: number;
}

export interface Broadcast {
  id: string;
  message: string;
  timestamp: string;
  author: string;
}

// Initial Data
const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1', round: 1, teamA: 'USA', teamB: 'Mexico', flagA: '🇺🇸', flagB: '🇲🇽',
    date: '2026-06-11', time: '18:00', venue: 'Estadio Azteca', isLocked: false, isFinished: false
  },
  {
    id: 'm2', round: 1, teamA: 'Canada', teamB: 'Morocco', flagA: '🇨🇦', flagB: '🇲🇦',
    date: '2026-06-12', time: '20:00', venue: 'BMO Field', isLocked: false, isFinished: false
  },
  {
    id: 'm3', round: 2, teamA: 'Argentina', teamB: 'Spain', flagA: '🇦🇷', flagB: '🇪🇸',
    date: '2026-06-20', time: '21:00', venue: 'MetLife Stadium', isLocked: true, isFinished: false
  }
];

// Memory Store (Simulated DB)
let users: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin',
    year: '4th',
    department: 'CSE',
    points: 0,
    isAdmin: true
  }
];
let matches: Match[] = [...INITIAL_MATCHES];
let predictions: Prediction[] = [];
let broadcasts: Broadcast[] = [];

// Persistence layer using localStorage if in browser
if (typeof window !== 'undefined') {
  const savedUsers = localStorage.getItem('kw_users');
  const savedMatches = localStorage.getItem('kw_matches');
  const savedPredictions = localStorage.getItem('kw_predictions');
  const savedBroadcasts = localStorage.getItem('kw_broadcasts');
  
  if (savedUsers) {
    const parsedUsers = JSON.parse(savedUsers);
    // Ensure default admin always exists
    if (!parsedUsers.find((u: any) => u.username === 'admin')) {
      parsedUsers.push(users[0]);
    }
    users = parsedUsers;
  }
  if (savedMatches) matches = JSON.parse(savedMatches);
  if (savedPredictions) predictions = JSON.parse(savedPredictions);
  if (savedBroadcasts) broadcasts = JSON.parse(savedBroadcasts);
}

const save = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kw_users', JSON.stringify(users));
    localStorage.setItem('kw_matches', JSON.stringify(matches));
    localStorage.setItem('kw_predictions', JSON.stringify(predictions));
    localStorage.setItem('kw_broadcasts', JSON.stringify(broadcasts));
  }
};

export const db = {
  users: {
    all: () => users.sort((a, b) => b.points - a.points),
    find: (username: string) => users.find(u => u.username === username),
    create: (userData: Omit<User, 'id' | 'points' | 'isAdmin'>) => {
      const newUser: User = { ...userData, id: Math.random().toString(36), points: 0, isAdmin: userData.username === 'admin' };
      users.push(newUser);
      save();
      return newUser;
    },
    addPoints: (userId: string, pts: number) => {
      const user = users.find(u => u.id === userId);
      if (user) {
        user.points += pts;
        save();
      }
    }
  },
  matches: {
    all: () => matches,
    update: (matchId: string, updates: Partial<Match>) => {
      const idx = matches.findIndex(m => m.id === matchId);
      if (idx !== -1) {
        matches[idx] = { ...matches[idx], ...updates };
        save();
      }
    },
    add: (match: Omit<Match, 'id' | 'isFinished'>) => {
      const newMatch = { ...match, id: Math.random().toString(36), isFinished: false };
      matches.push(newMatch);
      save();
    }
  },
  predictions: {
    forMatch: (matchId: string) => predictions.filter(p => p.matchId === matchId),
    forUser: (userId: string) => predictions.filter(p => p.userId === userId),
    submit: (prediction: Prediction) => {
      const idx = predictions.findIndex(p => p.userId === prediction.userId && p.matchId === prediction.matchId);
      if (idx !== -1) {
        predictions[idx] = prediction;
      } else {
        predictions.push(prediction);
      }
      save();
    }
  },
  broadcasts: {
    all: () => broadcasts,
    add: (msg: string, author: string) => {
      broadcasts.unshift({ id: Math.random().toString(36), message: msg, author, timestamp: new Date().toISOString() });
      save();
    }
  }
};

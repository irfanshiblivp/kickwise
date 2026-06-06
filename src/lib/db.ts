
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
  round: number;
  group?: string;
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

export interface UserMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
}

export interface AppSettings {
  leaderboardVisible: boolean;
}

const INITIAL_MATCHES: Match[] = [
  // Thursday, 11 June 2026
  { id: 'm1', round: 1, group: 'Group A', teamA: 'Mexico', teamB: 'South Africa', flagA: '🇲🇽', flagB: '🇿🇦', date: '2026-06-11', time: '18:00', venue: 'Mexico City Stadium', isLocked: false, isFinished: false },
  { id: 'm2', round: 1, group: 'Group A', teamA: 'Korea Republic', teamB: 'Czechia', flagA: '🇰🇷', flagB: '🇨🇿', date: '2026-06-11', time: '21:00', venue: 'Estadio Guadalajara', isLocked: false, isFinished: false },
  // Friday, 12 June 2026
  { id: 'm3', round: 1, group: 'Group B', teamA: 'Canada', teamB: 'Bosnia', flagA: '🇨🇦', flagB: '🇧🇦', date: '2026-06-12', time: '19:00', venue: 'Toronto Stadium', isLocked: false, isFinished: false },
  { id: 'm4', round: 1, group: 'Group D', teamA: 'USA', teamB: 'Paraguay', flagA: '🇺🇸', flagB: '🇵🇾', date: '2026-06-12', time: '20:00', venue: 'Los Angeles Stadium', isLocked: false, isFinished: false },
  // Saturday, 13 June 2026
  { id: 'm5', round: 1, group: 'Group C', teamA: 'Haiti', teamB: 'Scotland', flagA: '🇭🇹', flagB: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', date: '2026-06-13', time: '15:00', venue: 'Boston Stadium', isLocked: false, isFinished: false },
  { id: 'm6', round: 1, group: 'Group D', teamA: 'Australia', teamB: 'Türkiye', flagA: '🇦🇺', flagB: '🇹🇷', date: '2026-06-13', time: '18:00', venue: 'BC Place Vancouver', isLocked: false, isFinished: false },
  { id: 'm7', round: 1, group: 'Group C', teamA: 'Brazil', teamB: 'Morocco', flagA: '🇧🇷', flagB: '🇲🇦', date: '2026-06-13', time: '21:00', venue: 'New York New Jersey Stadium', isLocked: false, isFinished: false },
  { id: 'm8', round: 1, group: 'Group B', teamA: 'Qatar', teamB: 'Switzerland', flagA: '🇶🇦', flagB: '🇨🇭', date: '2026-06-13', time: '22:00', venue: 'San Francisco Bay Area Stadium', isLocked: false, isFinished: false },
  // Sunday, 14 June 2026
  { id: 'm9', round: 1, group: 'Group E', teamA: 'Côte d\'Ivoire', teamB: 'Ecuador', flagA: '🇨🇮', flagB: '🇪🇨', date: '2026-06-14', time: '16:00', venue: 'Philadelphia Stadium', isLocked: false, isFinished: false },
  { id: 'm10', round: 1, group: 'Group E', teamA: 'Germany', teamB: 'Curaçao', flagA: '🇩🇪', flagB: '🇨🇼', date: '2026-06-14', time: '19:00', venue: 'Houston Stadium', isLocked: false, isFinished: false },
  { id: 'm11', round: 1, group: 'Group F', teamA: 'Netherlands', teamB: 'Japan', flagA: '🇳🇱', flagB: '🇯🇵', date: '2026-06-14', time: '20:00', venue: 'Dallas Stadium', isLocked: false, isFinished: false },
  { id: 'm12', round: 1, group: 'Group F', teamA: 'Sweden', teamB: 'Tunisia', flagA: '🇸🇪', flagB: '🇹🇳', date: '2026-06-14', time: '21:00', venue: 'Estadio Monterrey', isLocked: false, isFinished: false },
  // Monday, 15 June 2026
  { id: 'm13', round: 1, group: 'Group H', teamA: 'Saudi Arabia', teamB: 'Uruguay', flagA: '🇸🇦', flagB: '🇺🇾', date: '2026-06-15', time: '17:00', venue: 'Miami Stadium', isLocked: false, isFinished: false },
  { id: 'm14', round: 1, group: 'Group H', teamA: 'Spain', teamB: 'Cabo Verde', flagA: '🇪🇸', flagB: '🇨🇻', date: '2026-06-15', time: '20:00', venue: 'Atlanta Stadium', isLocked: false, isFinished: false },
  { id: 'm15', round: 1, group: 'Group G', teamA: 'IR Iran', teamB: 'New Zealand', flagA: '🇮🇷', flagB: '🇳🇿', date: '2026-06-15', time: '21:00', venue: 'Los Angeles Stadium', isLocked: false, isFinished: false },
  { id: 'm16', round: 1, group: 'Group G', teamA: 'Belgium', teamB: 'Egypt', flagA: '🇧🇪', flagB: '🇪🇬', date: '2026-06-15', time: '22:00', venue: 'Seattle Stadium', isLocked: false, isFinished: false },
  // Tuesday, 16 June 2026
  { id: 'm17', round: 1, group: 'Group I', teamA: 'France', teamB: 'Senegal', flagA: '🇫🇷', flagB: '🇸🇳', date: '2026-06-16', time: '18:00', venue: 'New York New Jersey Stadium', isLocked: false, isFinished: false },
  { id: 'm18', round: 1, group: 'Group I', teamA: 'Iraq', teamB: 'Norway', flagA: '🇮🇶', flagB: '🇳🇴', date: '2026-06-16', time: '21:00', venue: 'Boston Stadium', isLocked: false, isFinished: false },
  { id: 'm19', round: 1, group: 'Group J', teamA: 'Argentina', teamB: 'Algeria', flagA: '🇦🇷', flagB: '🇩🇿', date: '2026-06-16', time: '22:00', venue: 'Kansas City Stadium', isLocked: false, isFinished: false },
  { id: 'm20', round: 1, group: 'Group J', teamA: 'Austria', teamB: 'Jordan', flagA: '🇦🇹', flagB: '🇯🇴', date: '2026-06-16', time: '23:00', venue: 'San Francisco Bay Area Stadium', isLocked: false, isFinished: false },
  // Wednesday, 17 June 2026
  { id: 'm21', round: 1, group: 'Group L', teamA: 'Ghana', teamB: 'Panama', flagA: '🇬🇭', flagB: '🇵🇦', date: '2026-06-17', time: '19:00', venue: 'Toronto Stadium', isLocked: false, isFinished: false },
  { id: 'm22', round: 1, group: 'Group L', teamA: 'England', teamB: 'Croatia', flagA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagB: '🇭🇷', date: '2026-06-17', time: '20:00', venue: 'Dallas Stadium', isLocked: false, isFinished: false },
  { id: 'm23', round: 1, group: 'Group K', teamA: 'Portugal', teamB: 'Congo DR', flagA: '🇵🇹', flagB: '🇨🇩', date: '2026-06-17', time: '21:00', venue: 'Houston Stadium', isLocked: false, isFinished: false },
  { id: 'm24', round: 1, group: 'Group K', teamA: 'Uzbekistan', teamB: 'Colombia', flagA: '🇺🇿', flagB: '🇨🇴', date: '2026-06-17', time: '22:00', venue: 'Mexico City Stadium', isLocked: false, isFinished: false },
];

let users: User[] = [
  { id: 'admin-seed', username: 'admin12', password: 'admdhr12', year: '4th', department: 'CSE', points: 0, isAdmin: true }
];
let matches: Match[] = [...INITIAL_MATCHES];
let predictions: Prediction[] = [];
let broadcasts: Broadcast[] = [];
let userMessages: UserMessage[] = [];
let settings: AppSettings = { leaderboardVisible: true };

if (typeof window !== 'undefined') {
  const CURRENT_DB_VERSION = 'kw_initialized_v3';
  const savedUsers = localStorage.getItem('kw_users');
  const savedMatches = localStorage.getItem('kw_matches');
  const savedPredictions = localStorage.getItem('kw_predictions');
  const savedBroadcasts = localStorage.getItem('kw_broadcasts');
  const savedInbox = localStorage.getItem('kw_inbox');
  const savedSettings = localStorage.getItem('kw_settings');
  
  if (!localStorage.getItem(CURRENT_DB_VERSION)) {
    localStorage.clear();
    localStorage.setItem('kw_users', JSON.stringify(users));
    localStorage.setItem('kw_matches', JSON.stringify(INITIAL_MATCHES));
    localStorage.setItem('kw_predictions', JSON.stringify([]));
    localStorage.setItem('kw_broadcasts', JSON.stringify([]));
    localStorage.setItem('kw_inbox', JSON.stringify([]));
    localStorage.setItem('kw_settings', JSON.stringify(settings));
    localStorage.setItem(CURRENT_DB_VERSION, 'true');
  } else {
    if (savedUsers) users = JSON.parse(savedUsers);
    if (savedMatches) matches = JSON.parse(savedMatches);
    if (savedPredictions) predictions = JSON.parse(savedPredictions);
    if (savedBroadcasts) broadcasts = JSON.parse(savedBroadcasts);
    if (savedInbox) userMessages = JSON.parse(savedInbox);
    if (savedSettings) settings = JSON.parse(savedSettings);

    if (!users.some(u => u.username === 'admin12')) {
      users.push({ id: 'admin-seed', username: 'admin12', password: 'admdhr12', year: '4th', department: 'CSE', points: 0, isAdmin: true });
    }
  }
}

const save = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kw_users', JSON.stringify(users));
    localStorage.setItem('kw_matches', JSON.stringify(matches));
    localStorage.setItem('kw_predictions', JSON.stringify(predictions));
    localStorage.setItem('kw_broadcasts', JSON.stringify(broadcasts));
    localStorage.setItem('kw_inbox', JSON.stringify(userMessages));
    localStorage.setItem('kw_settings', JSON.stringify(settings));
  }
};

export const db = {
  settings: {
    get: () => settings,
    update: (updates: Partial<AppSettings>) => {
      settings = { ...settings, ...updates };
      save();
    }
  },
  users: {
    all: () => users.sort((a, b) => b.points - a.points),
    find: (username: string) => users.find(u => u.username === username),
    create: (userData: Omit<User, 'id' | 'points' | 'isAdmin'>) => {
      const newUser: User = { ...userData, id: Math.random().toString(36), points: 0, isAdmin: userData.username === 'admin12' };
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
    },
    resetPoints: () => {
      users = users.map(u => ({ ...u, points: 0 }));
      save();
    }
  },
  matches: {
    all: () => [...matches],
    update: (matchId: string, updates: Partial<Match>) => {
      const idx = matches.findIndex(m => m.id === matchId);
      if (idx !== -1) {
        matches[idx] = { ...matches[idx], ...updates };
        save();
      }
    },
    lockRound: (round: number, isLocked: boolean) => {
      matches = matches.map(m => m.round === round ? { ...m, isLocked } : m);
      save();
    },
    add: (match: Omit<Match, 'id' | 'isFinished'>) => {
      const newMatch = { ...match, id: Math.random().toString(36), isFinished: false };
      matches.push(newMatch);
      save();
    },
    delete: (matchId: string) => {
      matches = matches.filter(m => m.id !== matchId);
      save();
    }
  },
  predictions: {
    all: () => predictions,
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
  },
  inbox: {
    all: () => userMessages,
    add: (username: string, message: string) => {
      userMessages.unshift({ id: Math.random().toString(36), username, message, timestamp: new Date().toISOString() });
      save();
    },
    delete: (id: string) => {
      userMessages = userMessages.filter(m => m.id !== id);
      save();
    }
  },
  system: {
    resetAll: () => {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.reload();
      }
    }
  }
};


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
  // 12 June 2026
  { id: 'm1', round: 1, group: 'Group A', teamA: 'Mexico', teamB: 'South Africa', flagA: '🇲🇽', flagB: '🇿🇦', date: '2026-06-12', time: '00:30', venue: 'Mexico City Stadium', isLocked: false, isFinished: false },
  { id: 'm2', round: 1, group: 'Group A', teamA: 'South Korea', teamB: 'Czechia', flagA: '🇰🇷', flagB: '🇨🇿', date: '2026-06-12', time: '07:30', venue: 'Guadalajara Stadium', isLocked: false, isFinished: false },
  // 13 June 2026
  { id: 'm3', round: 1, group: 'Group B', teamA: 'Canada', teamB: 'Bosnia & Herzegovina', flagA: '🇨🇦', flagB: '🇧🇦', date: '2026-06-13', time: '00:30', venue: 'Toronto Stadium', isLocked: false, isFinished: false },
  { id: 'm4', round: 1, group: 'Group D', teamA: 'USA', teamB: 'Paraguay', flagA: '🇺🇸', flagB: '🇵🇾', date: '2026-06-13', time: '06:30', venue: 'Los Angeles Stadium', isLocked: false, isFinished: false },
  // 14 June 2026
  { id: 'm5', round: 1, group: 'Group B', teamA: 'Qatar', teamB: 'Switzerland', flagA: '🇶🇦', flagB: '🇨🇭', date: '2026-06-14', time: '00:30', venue: 'San Francisco Bay Area Stadium', isLocked: false, isFinished: false },
  { id: 'm6', round: 1, group: 'Group C', teamA: 'Brazil', teamB: 'Morocco', flagA: '🇧🇷', flagB: '🇲🇦', date: '2026-06-14', time: '03:30', venue: 'New York/New Jersey Stadium', isLocked: false, isFinished: false },
  { id: 'm7', round: 1, group: 'Group C', teamA: 'Haiti', teamB: 'Scotland', flagA: '🇭🇹', flagB: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', date: '2026-06-14', time: '06:30', venue: 'Boston Stadium', isLocked: false, isFinished: false },
  { id: 'm8', round: 1, group: 'Group D', teamA: 'Australia', teamB: 'Türkiye', flagA: '🇦🇺', flagB: '🇹🇷', date: '2026-06-14', time: '09:30', venue: 'BC Place Vancouver', isLocked: false, isFinished: false },
  { id: 'm9', round: 1, group: 'Group E', teamA: 'Germany', teamB: 'Curaçao', flagA: '🇩🇪', flagB: '🇨🇼', date: '2026-06-14', time: '22:30', venue: 'Houston Stadium', isLocked: false, isFinished: false },
  // 15 June 2026
  { id: 'm10', round: 1, group: 'Group F', teamA: 'Netherlands', teamB: 'Japan', flagA: '🇳🇱', flagB: '🇯🇵', date: '2026-06-15', time: '01:30', venue: 'Dallas Stadium', isLocked: false, isFinished: false },
  { id: 'm11', round: 1, group: 'Group E', teamA: 'Côte d\'Ivoire', teamB: 'Ecuador', flagA: '🇨🇮', flagB: '🇪🇨', date: '2026-06-15', time: '04:30', venue: 'Philadelphia Stadium', isLocked: false, isFinished: false },
  { id: 'm12', round: 1, group: 'Group F', teamA: 'Sweden', teamB: 'Tunisia', flagA: '🇸🇪', flagB: '🇹🇳', date: '2026-06-15', time: '07:30', venue: 'Monterrey Stadium', isLocked: false, isFinished: false },
  { id: 'm13', round: 1, group: 'Group H', teamA: 'Spain', teamB: 'Cabo Verde', flagA: '🇪🇸', flagB: '🇨🇻', date: '2026-06-15', time: '21:30', venue: 'Atlanta Stadium', isLocked: false, isFinished: false },
  // 16 June 2026
  { id: 'm14', round: 1, group: 'Group G', teamA: 'Belgium', teamB: 'Egypt', flagA: '🇧🇪', flagB: '🇪🇬', date: '2026-06-16', time: '00:30', venue: 'Seattle Stadium', isLocked: false, isFinished: false },
  { id: 'm15', round: 1, group: 'Group H', teamA: 'Saudi Arabia', teamB: 'Uruguay', flagA: '🇸🇦', flagB: '🇺🇾', date: '2026-06-16', time: '03:30', venue: 'Miami Stadium', isLocked: false, isFinished: false },
  { id: 'm16', round: 1, group: 'Group G', teamA: 'Iran', teamB: 'New Zealand', flagA: '🇮🇷', flagB: '🇳🇿', date: '2026-06-16', time: '06:30', venue: 'Los Angeles Stadium', isLocked: false, isFinished: false },
  // 17 June 2026
  { id: 'm17', round: 1, group: 'Group I', teamA: 'France', teamB: 'Senegal', flagA: '🇫🇷', flagB: '🇸🇳', date: '2026-06-17', time: '00:30', venue: 'New York/New Jersey Stadium', isLocked: false, isFinished: false },
  { id: 'm18', round: 1, group: 'Group I', teamA: 'Iraq', teamB: 'Norway', flagA: '🇮🇶', flagB: '🇳🇴', date: '2026-06-17', time: '03:30', venue: 'Boston Stadium', isLocked: false, isFinished: false },
  { id: 'm19', round: 1, group: 'Group J', teamA: 'Argentina', teamB: 'Algeria', flagA: '🇦🇷', flagB: '🇩🇿', date: '2026-06-17', time: '06:30', venue: 'Kansas City Stadium', isLocked: false, isFinished: false },
  { id: 'm20', round: 1, group: 'Group J', teamA: 'Austria', teamB: 'Jordan', flagA: '🇦🇹', flagB: '🇯🇴', date: '2026-06-17', time: '09:30', venue: 'San Francisco Bay Area Stadium', isLocked: false, isFinished: false },
  { id: 'm21', round: 1, group: 'Group K', teamA: 'Portugal', teamB: 'DR Congo', flagA: '🇵🇹', flagB: '🇨🇩', date: '2026-06-17', time: '22:30', venue: 'Houston Stadium', isLocked: false, isFinished: false },
  // 18 June 2026
  { id: 'm22', round: 1, group: 'Group L', teamA: 'England', teamB: 'Croatia', flagA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagB: '🇭🇷', date: '2026-06-18', time: '01:30', venue: 'Dallas Stadium', isLocked: false, isFinished: false },
  { id: 'm23', round: 1, group: 'Group L', teamA: 'Ghana', teamB: 'Panama', flagA: '🇬🇭', flagB: '🇵🇦', date: '2026-06-18', time: '04:30', venue: 'Toronto Stadium', isLocked: false, isFinished: false },
  { id: 'm24', round: 1, group: 'Group K', teamA: 'Uzbekistan', teamB: 'Colombia', flagA: '🇺🇿', flagB: '🇨🇴', date: '2026-06-18', time: '07:30', venue: 'Mexico City Stadium', isLocked: false, isFinished: false },

  // Round 2
  { id: 'm25', round: 2, teamA: 'Czechia', teamB: 'South Africa', flagA: '🇨🇿', flagB: '🇿🇦', date: '2026-06-19', time: '21:30', venue: 'Mercedes-Benz Stadium (Atlanta)', isLocked: false, isFinished: false },
  { id: 'm26', round: 2, teamA: 'Switzerland', teamB: 'Bosnia & Herzegovina', flagA: '🇨🇭', flagB: '🇧🇦', date: '2026-06-20', time: '00:30', venue: 'SoFi Stadium (Los Angeles)', isLocked: false, isFinished: false },
  { id: 'm27', round: 2, teamA: 'Canada', teamB: 'Qatar', flagA: '🇨🇦', flagB: '🇶🇦', date: '2026-06-20', time: '03:30', venue: 'BC Place (Vancouver)', isLocked: false, isFinished: false },
  { id: 'm28', round: 2, teamA: 'Mexico', teamB: 'South Korea', flagA: '🇲🇽', flagB: '🇰🇷', date: '2026-06-20', time: '06:30', venue: 'Estadio Akron (Guadalajara)', isLocked: false, isFinished: false },
  { id: 'm29', round: 2, teamA: 'USA', teamB: 'Australia', flagA: '🇺🇸', flagB: '🇦🇺', date: '2026-06-20', time: '00:30', venue: 'Lumen Field (Seattle)', isLocked: false, isFinished: false },
  { id: 'm30', round: 2, teamA: 'Scotland', teamB: 'Morocco', flagA: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagB: '🇲🇦', date: '2026-06-20', time: '03:30', venue: 'Gillette Stadium (Boston)', isLocked: false, isFinished: false },
  { id: 'm31', round: 2, teamA: 'Brazil', teamB: 'Haiti', flagA: '🇧🇷', flagB: '🇭🇹', date: '2026-06-20', time: '06:00', venue: 'Lincoln Financial Field (Philadelphia)', isLocked: false, isFinished: false },
  { id: 'm32', round: 2, teamA: 'Türkiye', teamB: 'Paraguay', flagA: '🇹🇷', flagB: '🇵🇾', date: '2026-06-20', time: '08:30', venue: 'Levi\'s Stadium (SF Bay Area)', isLocked: false, isFinished: false },
  { id: 'm33', round: 2, teamA: 'Netherlands', teamB: 'Sweden', flagA: '🇳🇱', flagB: '🇸🇪', date: '2026-06-20', time: '22:30', venue: 'NRG Stadium (Houston)', isLocked: false, isFinished: false },
  { id: 'm34', round: 2, teamA: 'Germany', teamB: 'Côte d\'Ivoire', flagA: '🇩🇪', flagB: '🇨🇮', date: '2026-06-21', time: '01:30', venue: 'BMO Field (Toronto)', isLocked: false, isFinished: false },
  { id: 'm35', round: 2, teamA: 'Ecuador', teamB: 'Curaçao', flagA: '🇪🇨', flagB: '🇨🇼', date: '2026-06-21', time: '05:30', venue: 'Arrowhead Stadium (Kansas City)', isLocked: false, isFinished: false },
  { id: 'm36', round: 2, teamA: 'Tunisia', teamB: 'Japan', flagA: '🇹🇳', flagB: '🇯🇵', date: '2026-06-21', time: '09:30', venue: 'Estadio BBVA (Monterrey)', isLocked: false, isFinished: false },
  { id: 'm37', round: 2, teamA: 'Spain', teamB: 'Saudi Arabia', flagA: '🇪🇸', flagB: '🇸🇦', date: '2026-06-21', time: '21:30', venue: 'Mercedes-Benz Stadium (Atlanta)', isLocked: false, isFinished: false },
  { id: 'm38', round: 2, teamA: 'Belgium', teamB: 'Iran', flagA: '🇧🇪', flagB: '🇮🇷', date: '2026-06-22', time: '00:30', venue: 'SoFi Stadium (Los Angeles)', isLocked: false, isFinished: false },
  { id: 'm39', round: 2, teamA: 'Uruguay', teamB: 'Cabo Verde', flagA: '🇺🇾', flagB: '🇨🇻', date: '2026-06-22', time: '03:30', venue: 'Hard Rock Stadium (Miami)', isLocked: false, isFinished: false },
  { id: 'm40', round: 2, teamA: 'New Zealand', teamB: 'Egypt', flagA: '🇳🇿', flagB: '🇪🇬', date: '2026-06-22', time: '06:30', venue: 'BC Place (Vancouver)', isLocked: false, isFinished: false },
  { id: 'm41', round: 2, teamA: 'Argentina', teamB: 'Austria', flagA: '🇦🇷', flagB: '🇦🇹', date: '2026-06-22', time: '22:30', venue: 'AT&T Stadium (Dallas)', isLocked: false, isFinished: false },
  { id: 'm42', round: 2, teamA: 'France', teamB: 'Iraq', flagA: '🇫🇷', flagB: '🇮🇶', date: '2026-06-23', time: '02:30', venue: 'Lincoln Financial Field (Philadelphia)', isLocked: false, isFinished: false },
  { id: 'm43', round: 2, teamA: 'Norway', teamB: 'Senegal', flagA: '🇳🇴', flagB: '🇸🇳', date: '2026-06-23', time: '05:30', venue: 'MetLife Stadium (NY/NJ)', isLocked: false, isFinished: false },
  { id: 'm44', round: 2, teamA: 'Jordan', teamB: 'Algeria', flagA: '🇯🇴', flagB: '🇩🇿', date: '2026-06-23', time: '08:30', venue: 'Levi\'s Stadium (SF Bay Area)', isLocked: false, isFinished: false },
  { id: 'm45', round: 2, teamA: 'Portugal', teamB: 'Uzbekistan', flagA: '🇵🇹', flagB: '🇺🇿', date: '2026-06-23', time: '22:30', venue: 'NRG Stadium (Houston)', isLocked: false, isFinished: false },
  { id: 'm46', round: 2, teamA: 'England', teamB: 'Ghana', flagA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagB: '🇬🇭', date: '2026-06-24', time: '01:30', venue: 'Gillette Stadium (Boston)', isLocked: false, isFinished: false },
  { id: 'm47', round: 2, teamA: 'Panama', teamB: 'Croatia', flagA: '🇵🇦', flagB: '🇭🇷', date: '2026-06-24', time: '04:30', venue: 'BMO Field (Toronto)', isLocked: false, isFinished: false },
  { id: 'm48', round: 2, teamA: 'Colombia', teamB: 'DR Congo', flagA: '🇨🇴', flagB: '🇨🇩', date: '2026-06-24', time: '07:30', venue: 'Estadio Akron (Guadalajara)', isLocked: false, isFinished: false },

  // Round 3
  { id: 'm49', round: 3, teamA: 'Bosnia & Herzegovina', teamB: 'Qatar', flagA: '🇧🇦', flagB: '🇶🇦', date: '2026-06-25', time: '00:30', venue: 'Lumen Field (Seattle)', isLocked: false, isFinished: false },
  { id: 'm50', round: 3, teamA: 'Switzerland', teamB: 'Canada', flagA: '🇨🇭', flagB: '🇨🇦', date: '2026-06-25', time: '00:30', venue: 'BC Place (Vancouver)', isLocked: false, isFinished: false },
  { id: 'm51', round: 3, teamA: 'Morocco', teamB: 'Haiti', flagA: '🇲🇦', flagB: '🇭🇹', date: '2026-06-25', time: '03:30', venue: 'Mercedes-Benz Stadium (Atlanta)', isLocked: false, isFinished: false },
  { id: 'm52', round: 3, teamA: 'Scotland', teamB: 'Brazil', flagA: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagB: '🇧🇷', date: '2026-06-25', time: '03:30', venue: 'Hard Rock Stadium (Miami)', isLocked: false, isFinished: false },
  { id: 'm53', round: 3, teamA: 'Czechia', teamB: 'Mexico', flagA: '🇨🇿', flagB: '🇲🇽', date: '2026-06-25', time: '06:30', venue: 'Estadio Banorte (Mexico City)', isLocked: false, isFinished: false },
  { id: 'm54', round: 3, teamA: 'South Africa', teamB: 'South Korea', flagA: '🇿🇦', flagB: '🇰🇷', date: '2026-06-25', time: '06:30', venue: 'Estadio BBVA (Monterrey)', isLocked: false, isFinished: false },
  { id: 'm55', round: 3, teamA: 'Curaçao', teamB: 'Côte d\'Ivoire', flagA: '🇨🇼', flagB: '🇨🇮', date: '2026-06-26', time: '01:30', venue: 'Lincoln Financial Field (Philadelphia)', isLocked: false, isFinished: false },
  { id: 'm56', round: 3, teamA: 'Ecuador', teamB: 'Germany', flagA: '🇪🇨', flagB: '🇩🇪', date: '2026-06-26', time: '01:30', venue: 'MetLife Stadium (NY/NJ)', isLocked: false, isFinished: false },
  { id: 'm57', round: 3, teamA: 'Japan', teamB: 'Sweden', flagA: '🇯🇵', flagB: '🇸🇪', date: '2026-06-26', time: '04:30', venue: 'AT&T Stadium (Dallas)', isLocked: false, isFinished: false },
  { id: 'm58', round: 3, teamA: 'Tunisia', teamB: 'Netherlands', flagA: '🇹🇳', flagB: '🇳🇱', date: '2026-06-26', time: '04:30', venue: 'Arrowhead Stadium (Kansas City)', isLocked: false, isFinished: false },
  { id: 'm59', round: 3, teamA: 'Paraguay', teamB: 'Australia', flagA: '🇵🇾', flagB: '🇦🇺', date: '2026-06-26', time: '07:30', venue: 'Levi\'s Stadium (SF Bay Area)', isLocked: false, isFinished: false },
  { id: 'm60', round: 3, teamA: 'Türkiye', teamB: 'USA', flagA: '🇹🇷', flagB: '🇺🇸', date: '2026-06-26', time: '07:30', venue: 'SoFi Stadium (Los Angeles)', isLocked: false, isFinished: false },
  { id: 'm61', round: 3, teamA: 'Norway', teamB: 'France', flagA: '🇳🇴', flagB: '🇫🇷', date: '2026-06-27', time: '00:30', venue: 'Gillette Stadium (Boston)', isLocked: false, isFinished: false },
  { id: 'm62', round: 3, teamA: 'Senegal', teamB: 'Iraq', flagA: '🇸🇳', flagB: '🇮🇶', date: '2026-06-27', time: '00:30', venue: 'BMO Field (Toronto)', isLocked: false, isFinished: false },
  { id: 'm63', round: 3, teamA: 'Cabo Verde', teamB: 'Saudi Arabia', flagA: '🇨🇻', flagB: '🇸🇦', date: '2026-06-27', time: '05:30', venue: 'NRG Stadium (Houston)', isLocked: false, isFinished: false },
  { id: 'm64', round: 3, teamA: 'Uruguay', teamB: 'Spain', flagA: '🇺🇾', flagB: '🇪🇸', date: '2026-06-27', time: '05:30', venue: 'Estadio Akron (Guadalajara)', isLocked: false, isFinished: false },
  { id: 'm65', round: 3, teamA: 'Egypt', teamB: 'Iran', flagA: '🇪🇬', flagB: '🇮🇷', date: '2026-06-27', time: '08:30', venue: 'Lumen Field (Seattle)', isLocked: false, isFinished: false },
  { id: 'm66', round: 3, teamA: 'New Zealand', teamB: 'Belgium', flagA: '🇳🇿', flagB: '🇧🇪', date: '2026-06-27', time: '08:30', venue: 'BC Place (Vancouver)', isLocked: false, isFinished: false },
  { id: 'm67', round: 3, teamA: 'Croatia', teamB: 'Ghana', flagA: '🇭🇷', flagB: '🇬🇭', date: '2026-06-28', time: '02:30', venue: 'Lincoln Financial Field (Philadelphia)', isLocked: false, isFinished: false },
  { id: 'm68', round: 3, teamA: 'Panama', teamB: 'England', flagA: '🇵🇦', flagB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', date: '2026-06-28', time: '02:30', venue: 'MetLife Stadium (NY/NJ)', isLocked: false, isFinished: false },
  { id: 'm69', round: 3, teamA: 'Colombia', teamB: 'Portugal', flagA: '🇨🇴', flagB: '🇵🇹', date: '2026-06-28', time: '05:00', venue: 'Hard Rock Stadium (Miami)', isLocked: false, isFinished: false },
  { id: 'm70', round: 3, teamA: 'DR Congo', teamB: 'Uzbekistan', flagA: '🇨🇩', flagB: '🇺🇿', date: '2026-06-28', time: '05:00', venue: 'Mercedes-Benz Stadium (Atlanta)', isLocked: false, isFinished: false },
  { id: 'm71', round: 3, teamA: 'Algeria', teamB: 'Austria', flagA: '🇩🇿', flagB: '🇦🇹', date: '2026-06-28', time: '07:30', venue: 'Arrowhead Stadium (Kansas City)', isLocked: false, isFinished: false },
  { id: 'm72', round: 3, teamA: 'Jordan', teamB: 'Argentina', flagA: '🇯🇴', flagB: '🇦🇷', date: '2026-06-28', time: '07:30', venue: 'AT&T Stadium (Dallas)', isLocked: false, isFinished: false },
];

let users: User[] = [];
let matches: Match[] = [];
let predictions: Prediction[] = [];
let broadcasts: Broadcast[] = [];
let userMessages: UserMessage[] = [];
let settings: AppSettings = { leaderboardVisible: true };

if (typeof window !== 'undefined') {
  const CURRENT_DB_VERSION = 'kw_arena_v11'; // Bumped version for R3 matches
  const savedUsers = localStorage.getItem('kw_users');
  const savedMatches = localStorage.getItem('kw_matches');
  const savedPredictions = localStorage.getItem('kw_predictions');
  const savedBroadcasts = localStorage.getItem('kw_broadcasts');
  const savedInbox = localStorage.getItem('kw_inbox');
  const savedSettings = localStorage.getItem('kw_settings');
  
  if (!localStorage.getItem(CURRENT_DB_VERSION)) {
    localStorage.clear();
    users = [{ id: 'admin-seed', username: 'admin12', password: 'admdhr12', year: '4th', department: 'CSE', points: 0, isAdmin: true }];
    matches = [...INITIAL_MATCHES];
    predictions = [];
    broadcasts = [];
    userMessages = [];
    settings = { leaderboardVisible: true };
    
    localStorage.setItem('kw_users', JSON.stringify(users));
    localStorage.setItem('kw_matches', JSON.stringify(matches));
    localStorage.setItem('kw_predictions', JSON.stringify(predictions));
    localStorage.setItem('kw_broadcasts', JSON.stringify(broadcasts));
    localStorage.setItem('kw_inbox', JSON.stringify(userMessages));
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
    get: () => ({ ...settings }),
    update: (updates: Partial<AppSettings>) => {
      settings = { ...settings, ...updates };
      save();
    }
  },
  users: {
    all: () => [...users].sort((a, b) => b.points - a.points),
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
    all: () => [...predictions],
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
    all: () => [...broadcasts],
    add: (msg: string, author: string) => {
      broadcasts.unshift({ id: Math.random().toString(36), message: msg, author, timestamp: new Date().toISOString() });
      save();
    }
  },
  inbox: {
    all: () => [...userMessages],
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

'use client';

import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  getDocs,
  writeBatch,
  Firestore
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type AcademicYear = '2nd' | '3rd' | '4th';
export type Department = 'CSE' | 'ECE' | 'EEE' | 'ME';

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
  id?: string;
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

/**
 * Firestore Mutation Helpers
 * We keep the "db" naming for compatibility but refactor methods to accept Firestore instance.
 */
export const db = {
  users: {
    add: async (firestore: Firestore, user: Omit<User, 'id' | 'points' | 'isAdmin'>) => {
      const userRef = doc(collection(firestore, 'users'));
      const newUser = {
        ...user,
        id: userRef.id,
        points: 0,
        isAdmin: false
      };
      await setDoc(userRef, newUser).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: user
        }));
      });
      return newUser;
    },
    updatePoints: (firestore: Firestore, userId: string, points: number) => {
      const userRef = doc(firestore, 'users', userId);
      setDoc(userRef, { points }, { merge: true }).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update'
        }));
      });
    },
    resetPoints: async (firestore: Firestore) => {
      const snap = await getDocs(collection(firestore, 'users'));
      const batch = writeBatch(firestore);
      snap.docs.forEach(d => batch.update(d.ref, { points: 0 }));
      await batch.commit();
    }
  },
  matches: {
    add: (firestore: Firestore, match: Omit<Match, 'id' | 'isFinished'>) => {
      const matchRef = collection(firestore, 'matches');
      addDoc(matchRef, { ...match, isFinished: false }).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'matches',
          operation: 'create'
        }));
      });
    },
    update: (firestore: Firestore, matchId: string, updates: Partial<Match>) => {
      const matchRef = doc(firestore, 'matches', matchId);
      setDoc(matchRef, updates, { merge: true }).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: matchRef.path,
          operation: 'update'
        }));
      });
    },
    delete: (firestore: Firestore, matchId: string) => {
      deleteDoc(doc(firestore, 'matches', matchId)).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: `matches/${matchId}`,
          operation: 'delete'
        }));
      });
    },
    lockRound: async (firestore: Firestore, round: number, isLocked: boolean) => {
      const q = query(collection(firestore, 'matches'), where('round', '==', round));
      const snap = await getDocs(q);
      const batch = writeBatch(firestore);
      snap.docs.forEach(d => batch.update(d.ref, { isLocked }));
      await batch.commit();
    }
  },
  predictions: {
    submit: (firestore: Firestore, prediction: Prediction) => {
      const predId = `${prediction.userId}_${prediction.matchId}`;
      const predRef = doc(firestore, 'predictions', predId);
      setDoc(predRef, prediction, { merge: true }).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: predRef.path,
          operation: 'write',
          requestResourceData: prediction
        }));
      });
    }
  },
  broadcasts: {
    add: (firestore: Firestore, message: string, author: string) => {
      addDoc(collection(firestore, 'broadcasts'), {
        message,
        author,
        timestamp: new Date().toISOString()
      }).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'broadcasts',
          operation: 'create'
        }));
      });
    }
  },
  inbox: {
    add: (firestore: Firestore, username: string, message: string) => {
      addDoc(collection(firestore, 'inbox'), {
        username,
        message,
        timestamp: new Date().toISOString()
      }).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'inbox',
          operation: 'create'
        }));
      });
    },
    delete: (firestore: Firestore, id: string) => {
      deleteDoc(doc(firestore, 'inbox', id)).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: `inbox/${id}`,
          operation: 'delete'
        }));
      });
    }
  },
  settings: {
    update: (firestore: Firestore, updates: Partial<AppSettings>) => {
      const settingsRef = doc(firestore, 'settings', 'app');
      setDoc(settingsRef, updates, { merge: true }).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update'
        }));
      });
    }
  }
};
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logout, handleFirestoreError, OperationType, registerWithEmail, loginWithEmail, firebaseUpdateProfile } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  syllabus: 'CBSE' | 'TN State Board';
  grade: string;
  age?: string;
  learningPreference?: string;
  photoURL?: string;
  points?: number;
  interests?: string[];
  learningGoal?: string;
  learnerType?: 'Fast' | 'Average' | 'Slow';
  dailyGoal?: 'Casual' | 'Regular' | 'Serious' | 'Insane';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (role?: 'student' | 'teacher') => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string, role: 'student' | 'teacher', syllabus: 'CBSE' | 'TN State Board', grade?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  awardPoints: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Clear previous listener if it exists
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user) {
        setLoading(true);
        const userRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            const intendedRole = localStorage.getItem('intended_role') as 'student' | 'teacher' || 'student';
            const newProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || 'Anonymous',
              email: user.email || '',
              role: intendedRole,
              syllabus: 'CBSE',
              grade: '',
              photoURL: user.photoURL || '',
              points: 0,
              interests: [],
              learningGoal: ''
            };
            await setDoc(userRef, newProfile);
            setProfile(newProfile);
            localStorage.removeItem('intended_role');
          } else {
            setProfile(userDoc.data() as UserProfile);
          }

          // Start listener for real-time updates
          unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
              setProfile(snapshot.data() as UserProfile);
            }
          }, (error) => {
            // Only report if it's not a permission error during logout
            if (auth.currentUser) {
              handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
            }
          });

        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const signIn = async (role: 'student' | 'teacher' = 'student') => {
    localStorage.setItem('intended_role', role);
    await loginWithGoogle();
  };

  const signInEmail = async (email: string, pass: string) => {
    await loginWithEmail(email, pass);
  };

  const signUpEmail = async (email: string, pass: string, name: string, role: 'student' | 'teacher', syllabus: 'CBSE' | 'TN State Board', grade: string = '') => {
    const userCredential = await registerWithEmail(email, pass);
    const user = userCredential.user;
    
    await firebaseUpdateProfile(user, { displayName: name });

    const userRef = doc(db, 'users', user.uid);
    const newProfile: UserProfile = {
      uid: user.uid,
      name,
      email,
      role,
      syllabus,
      grade,
      photoURL: '',
      points: 0,
      interests: [],
      learningGoal: ''
    };
    await setDoc(userRef, newProfile);
    setProfile(newProfile);
  };

  const signOutUser = async () => {
    await logout();
  };

  const awardPoints = async (amount: number) => {
    if (user && profile) {
      const userRef = doc(db, 'users', user.uid);
      try {
        const newPoints = (profile.points || 0) + amount;
        await setDoc(userRef, { points: newPoints }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (user && profile) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userRef, { ...profile, ...updates }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signInEmail, signUpEmail, signOutUser, updateProfile, awardPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

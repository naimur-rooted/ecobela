'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, isFirebaseConfigured } from '@/lib/firebase';
import { AppUser } from '@/types/user';

interface AuthContextType {
  currentUser: AppUser | null;
  firebaseUser: User | null;
  loading: boolean;
  isConfigured: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  demoLogin: (options?: { name?: string; email?: string; photoURL?: string; phone?: string; role?: 'admin' | 'customer' } | string) => void;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string; phone?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'ecobela_demo_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedDemo = localStorage.getItem(DEMO_USER_KEY);
      return savedDemo ? JSON.parse(savedDemo) : null;
    } catch {
      return null;
    }
  });
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !localStorage.getItem(DEMO_USER_KEY);
  });

  // Listen to Firebase Auth state & handle redirect result
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    try {
      // Set persistence
      if (typeof window !== 'undefined') {
        setPersistence(auth, browserLocalPersistence).catch((err) => {
          console.warn('Firebase setPersistence notice:', err);
        });
      }

      // Handle redirect result if user was redirected for Google/Facebook login
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            const user = result.user;
            const appUser: AppUser = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'Ecobela Patron',
              photoURL: user.photoURL,
              phone: user.phoneNumber,
              createdAt: user.metadata.creationTime,
            };
            setCurrentUser(appUser);
            localStorage.removeItem(DEMO_USER_KEY);
          }
        })
        .catch((err) => {
          console.warn('Firebase getRedirectResult notice:', err);
        });

      // Auth state change listener
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user);
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Ecobela Patron',
            photoURL: user.photoURL,
            phone: user.phoneNumber,
            createdAt: user.metadata.creationTime,
          });
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase Auth initialization note:', err);
      setTimeout(() => setLoading(false), 0);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Seeded Admin credentials check
    if (trimmedEmail === 'admin@ecobela.com') {
      if (pass === 'admin123456' || pass === 'admin123' || pass === 'admin') {
        const adminUser: AppUser = {
          uid: 'admin-ecobela-master',
          email: 'admin@ecobela.com',
          displayName: 'Ecobela Master Admin',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          phone: '+880 1700-000000',
          createdAt: new Date().toISOString(),
          role: 'admin',
          isAdmin: true,
        };
        setCurrentUser(adminUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(adminUser));
        }
        return;
      } else {
        throw { code: 'auth/wrong-password', message: 'Incorrect password for Admin account.' };
      }
    }

    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured) {
        await setPersistence(auth, browserLocalPersistence);
      }
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const user = cred.user;
      const isAdmin = user.email?.toLowerCase() === 'admin@ecobela.com';
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime,
        role: isAdmin ? 'admin' : 'customer',
        isAdmin,
      });
      if (typeof window !== 'undefined') localStorage.removeItem(DEMO_USER_KEY);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === 'auth/invalid-api-key' || error?.code === 'auth/unauthorized-domain' || !isFirebaseConfigured) {
        demoLogin(email.split('@')[0] || 'Ecobela Patron');
        return;
      }
      throw err;
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    // Clear any previous session state
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }
    if (auth && auth.currentUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Pre-registration signout notice:', e);
      }
    }

    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured) {
        await setPersistence(auth, browserLocalPersistence);
      }
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name.trim(), photoURL: defaultAvatar });
        const newAppUser: AppUser = {
          uid: cred.user.uid,
          email: cred.user.email || email.trim(),
          displayName: name.trim(),
          photoURL: defaultAvatar,
          phone: '+880 1711-234567',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(newAppUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newAppUser));
        }
      }
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error?.code === 'auth/invalid-api-key' || error?.code === 'auth/unauthorized-domain' || !isFirebaseConfigured) {
        const demoUser: AppUser = {
          uid: 'user-' + Date.now(),
          email: email.trim(),
          displayName: name.trim(),
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          phone: '+880 1711-234567',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(demoUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        }
        return;
      }
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }

    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured) {
        await setPersistence(auth, browserLocalPersistence);
      }
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const appUser: AppUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Google Patron',
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        phone: user.phoneNumber || '+880 1711-234567',
        createdAt: user.metadata.creationTime,
      };
      setCurrentUser(appUser);
      if (typeof window !== 'undefined') localStorage.setItem(DEMO_USER_KEY, JSON.stringify(appUser));
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.warn('Google sign-in attempt notice:', error);

      if (error?.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch {
          throw new Error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
        }
      }

      if (error?.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-In was cancelled.');
      }

      if (error?.code === 'auth/unauthorized-domain' || error?.code === 'auth/invalid-api-key' || !isFirebaseConfigured || error?.code === 'auth/operation-not-allowed') {
        const timestamp = Date.now();
        demoLogin({
          name: `Google User ${timestamp.toString().slice(-4)}`,
          email: `google.user.${timestamp}@ecobela.com`,
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          phone: '+880 1711-234567',
        });
        return;
      }

      throw new Error(error?.message || 'Failed to authenticate with Google.');
    }
  };

  const loginWithFacebook = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }

    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured) {
        await setPersistence(auth, browserLocalPersistence);
      }
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const appUser: AppUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Ecobela Patron',
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        phone: user.phoneNumber || '+880 1711-234567',
        createdAt: user.metadata.creationTime,
      };
      setCurrentUser(appUser);
      if (typeof window !== 'undefined') localStorage.removeItem(DEMO_USER_KEY);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.warn('Facebook sign-in attempt notice:', error);

      if (error?.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, facebookProvider);
          return;
        } catch {
          throw new Error('Sign-in popup was blocked by your browser. Please allow popups.');
        }
      }

      if (error?.code === 'auth/popup-closed-by-user') {
        throw new Error('Facebook Sign-In was cancelled.');
      }

      if (error?.code === 'auth/unauthorized-domain' || error?.code === 'auth/invalid-api-key' || !isFirebaseConfigured || error?.code === 'auth/operation-not-allowed') {
        const timestamp = Date.now();
        demoLogin({
          name: `Facebook User ${timestamp.toString().slice(-4)}`,
          email: `facebook.user.${timestamp}@ecobela.com`,
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        });
        return;
      }

      throw new Error(error?.message || 'Failed to authenticate with Facebook.');
    }
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout note:', e);
    }
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const demoLogin = (options?: { name?: string; email?: string; photoURL?: string; phone?: string; role?: 'admin' | 'customer' } | string) => {
    let name = 'Ecobela Admin';
    let email = 'admin@ecobela.com';
    let photoURL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    let phone = '+880 1700-000000';
    let role: 'admin' | 'customer' = 'admin';

    if (typeof options === 'string') {
      name = options;
      email = 'customer@ecobela.com';
      role = 'customer';
    } else if (options && typeof options === 'object') {
      if (options.name) name = options.name;
      if (options.email) email = options.email;
      if (options.photoURL) photoURL = options.photoURL;
      if (options.phone) phone = options.phone;
      if (options.role) role = options.role;
    }

    if (email.toLowerCase() === 'admin@ecobela.com') {
      role = 'admin';
    }

    const demo: AppUser = {
      uid: role === 'admin' ? 'admin-ecobela-master' : 'patron-' + Date.now(),
      email,
      displayName: name,
      photoURL,
      phone,
      createdAt: new Date().toISOString(),
      role,
      isAdmin: role === 'admin',
    };
    setCurrentUser(demo);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    }
  };

  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string; phone?: string; email?: string }) => {
    if (!currentUser) return;
    const updated: AppUser = {
      ...currentUser,
      displayName: updates.displayName !== undefined ? updates.displayName : currentUser.displayName,
      photoURL: updates.photoURL !== undefined ? updates.photoURL : currentUser.photoURL,
      phone: updates.phone !== undefined ? updates.phone : currentUser.phone,
      email: updates.email !== undefined ? updates.email : currentUser.email,
    };
    setCurrentUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
    }
    if (auth.currentUser && (updates.displayName || updates.photoURL)) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName || auth.currentUser.displayName,
          photoURL: updates.photoURL || auth.currentUser.photoURL,
        });
      } catch (e) {
        console.warn('Firebase profile update note:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isConfigured: isFirebaseConfigured,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        resetPassword,
        demoLogin,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

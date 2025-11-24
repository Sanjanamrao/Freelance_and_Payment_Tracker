// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getCurrentUser,
  getUserProfile,
  onAuthStateChange,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
} from '../services/auth';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session on mount
    checkUser();

    // Listen for auth changes
    const { data: authListener } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile(currentUser.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProfile(userId) {
    try {
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  const signIn = async (credentials) => {
    const data = await authSignIn(credentials);
    setUser(data.user);
    if (data.user) {
      await loadUserProfile(data.user.id);
    }
    return data;
  };

  const signUp = async (credentials) => {
    const data = await authSignUp(credentials);
    return data;
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isFreelancer: profile?.role === 'freelancer',
    isClient: profile?.role === 'client',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
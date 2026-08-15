import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(true);
  // Which action ('login' | 'signup' | 'logout') most recently changed the
  // session — lets sync logic tell "logging into an existing account" apart
  // from "signing up a new one" when both start from a guest identity.
  const lastAuthActionRef = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuestMode(false);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuestMode(false);
      } else {
        setIsGuestMode(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured yet.');
    lastAuthActionRef.current = 'login';
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (email, password, displayName, aiFeaturesEnabled = false) => {
    if (!supabase) throw new Error('Supabase is not configured yet.');
    lastAuthActionRef.current = 'signup';
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName, ai_features_enabled: aiFeaturesEnabled } }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    lastAuthActionRef.current = 'logout';
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsGuestMode(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isGuestMode,
        isSupabaseConfigured,
        loginWithEmail,
        signUpWithEmail,
        logout,
        lastAuthActionRef
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

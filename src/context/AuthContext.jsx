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

  // Fetch the editable profile row (display_name, ai_features_enabled) — the
  // live source of truth, distinct from the signup-time snapshot in
  // user.user_metadata which never updates after account creation.
  const fetchProfile = async () => {
    if (!supabase || !user) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, email, ai_features_enabled')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  };

  const updateProfile = async ({ displayName, aiFeaturesEnabled }) => {
    if (!supabase || !user) throw new Error('Not signed in.');
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, ai_features_enabled: aiFeaturesEnabled })
      .eq('id', user.id);
    if (error) throw error;
  };

  const deleteAccount = async () => {
    if (!supabase || !user) throw new Error('Not signed in.');
    const { error } = await supabase.functions.invoke('smart-action');
    if (error) {
      let message = error.message || 'Could not delete your account.';
      try {
        const body = await error.context?.json();
        if (body?.error) message = body.error;
      } catch {
        // fall back to error.message above
      }
      throw new Error(message);
    }
    lastAuthActionRef.current = 'logout';
    await supabase.auth.signOut();
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
        fetchProfile,
        updateProfile,
        deleteAccount,
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

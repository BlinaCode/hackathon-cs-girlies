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
  //
  // The profiles row is created by an AFTER INSERT trigger on auth.users,
  // which can still be committing in the instant right after signUp()
  // resolves — so a fetch that happens immediately (e.g. AccountPage's first
  // load right after sign-up) can race it and find nothing yet. Retry a
  // couple of times with a short delay before giving up, but only for that
  // "no row yet" case (PGRST116) — any other error fails immediately.
  const fetchProfile = async () => {
    if (!supabase || !user) return null;
    const attempts = 3;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, email, ai_features_enabled')
        .eq('id', user.id)
        .single();
      if (!error) return data;
      const isNoRowYet = error.code === 'PGRST116';
      if (!isNoRowYet || attempt === attempts) throw error;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Updates both the profiles table (the app's live source of truth, read
  // back by fetchProfile) and the auth user's metadata — without the second
  // call, a name/AI-toggle change would never show up against the user in
  // Supabase's own Authentication > Users list, since that view reads
  // user_metadata rather than the profiles table.
  const updateProfile = async ({ displayName, aiFeaturesEnabled }) => {
    if (!supabase || !user) throw new Error('Not signed in.');
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ display_name: displayName, ai_features_enabled: aiFeaturesEnabled })
      .eq('id', user.id);
    if (profileErr) throw profileErr;

    const { error: metadataErr } = await supabase.auth.updateUser({
      data: { display_name: displayName, ai_features_enabled: aiFeaturesEnabled }
    });
    if (metadataErr) throw metadataErr;
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

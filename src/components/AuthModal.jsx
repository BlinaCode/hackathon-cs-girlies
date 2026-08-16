import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';

export function AuthModal({ onClose, onSuccess }) {
  const { loginWithEmail, signUpWithEmail, isSupabaseConfigured } = useAuth();
  const { isSkyMode } = useWellness();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [aiFeaturesEnabled, setAiFeaturesEnabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName, aiFeaturesEnabled);
      } else {
        await loginWithEmail(email, password);
      }
      (onSuccess || onClose)();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ocean-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative border transition-all ${isSkyMode ? 'bg-white border-bluey-200' : 'bg-slate-800 border-slate-700'}`}>

        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isSkyMode ? 'text-bluey-500 hover:text-bluey-900 hover:bg-bluey-50' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'}`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-seafoam-500/20 text-seafoam-400 flex items-center justify-center mx-auto text-2xl border border-seafoam-500/30">
            🦦
          </div>
          <h3 className={`font-display text-2xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-slate-100'}`}>
            {isSignUp ? 'Create Your Sisu Account' : 'Welcome Back to Sisu'}
          </h3>
          <p className={`text-xs ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
            Sync your mood check-ins, values, and streaks across all devices.
          </p>
        </div>

        {!isSupabaseConfigured ? (
          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${isSkyMode ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'}`}>
            <div className={`flex items-center gap-2 font-bold ${isSkyMode ? 'text-amber-700' : 'text-amber-300'}`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              Instant Guest Mode Active
            </div>
            <p>
              Supabase keys are not set in <code>.env</code> yet. The app is running smoothly in <strong>Instant Guest Mode</strong> (persisting to LocalStorage).
            </p>
            <button
              onClick={onClose}
              className="w-full mt-2 py-2 rounded-xl bg-amber-500 text-ocean-950 font-bold text-xs hover:bg-amber-400"
            >
              Continue as Guest
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className={`p-3 rounded-xl border text-xs ${isSkyMode ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                {errorMsg}
              </div>
            )}

            {isSignUp && (
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-seafoam-500 ${isSkyMode ? 'bg-white border-bluey-200 text-bluey-950' : 'bg-slate-900 border-slate-700 text-slate-100'}`}
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-seafoam-500 ${isSkyMode ? 'bg-white border-bluey-200 text-bluey-950' : 'bg-slate-900 border-slate-700 text-slate-100'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-seafoam-500 ${isSkyMode ? 'bg-white border-bluey-200 text-bluey-950' : 'bg-slate-900 border-slate-700 text-slate-100'}`}
                required
              />
            </div>

            {isSignUp && (
              <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer ${isSkyMode ? 'bg-bluey-50 border-bluey-200' : 'bg-slate-900/60 border-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={aiFeaturesEnabled}
                  onChange={e => setAiFeaturesEnabled(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-seafoam-500 shrink-0"
                />
                <span className={`text-xs flex items-center gap-1.5 flex-wrap ${isSkyMode ? 'text-bluey-800' : 'text-slate-300'}`}>
                  <Sparkles className="w-3.5 h-3.5 text-seafoam-400 shrink-0" />
                  Use AI-generated suggestions when reframing thoughts (optional, you can change this later)
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-seafoam-500 text-ocean-950 font-bold text-xs hover:bg-seafoam-400 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <div className={`pt-2 text-center text-xs ${isSkyMode ? 'text-bluey-700' : 'text-slate-400'}`}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-seafoam-500 font-semibold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

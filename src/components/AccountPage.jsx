import React, { useEffect, useState } from 'react';
import { User, Mail, Sparkles, ShieldAlert, Save, Trash2, CheckCircle2, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { OtterMascot } from './OtterMascot';
import surprisedOtterImg from '../assets/images/surprised-otter.png';

function SeaweedFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden="true">
      <path d="M20 58 C20 40, 8 40, 10 22 C12 8, 20 8, 20 2" stroke="#7E7B51" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M20 50 C20 34, 30 34, 28 18" stroke="#A89B6E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function ShellFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden="true">
      <path d="M4 26 C2 16, 30 16, 28 26 C30 30, 2 30, 4 26 Z" fill="#C99C8B" opacity="0.5" />
      <path d="M16 28 L10 16" stroke="#FEF8F7" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M16 28 L16 14" stroke="#FEF8F7" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M16 28 L22 16" stroke="#FEF8F7" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function SandDollarFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="#F5E8C9" stroke="#E3CE9E" strokeWidth="1.2" opacity="0.7" />
      <g stroke="#D1B882" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round">
        <path d="M20 10 C21.5 15, 21.5 20, 20 25 M20 10 C18.5 15, 18.5 20, 20 25" />
        <path d="M10 20 C15 21.5, 20 21.5, 25 20 M10 20 C15 18.5, 20 18.5, 25 20" />
      </g>
    </svg>
  );
}


function ToggleSwitch({ checked, onChange, isSkyMode, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full shrink-0 transition-colors duration-300 ${
        checked ? 'bg-lagoon-500' : (isSkyMode ? 'bg-dune-200' : 'bg-midnight-900')
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

const DELETE_IMPACT = [
  'Every mood check-in and reflection',
  'All reframed thoughts and their progress',
  'Your social circle map',
  'Your breathing streak',
  'Completed resource guide progress',
  'Your login itself — you\'d need to sign up fresh to come back',
];

export function AccountPage({ setActiveTab }) {
  const { user, fetchProfile, updateProfile, deleteAccount } = useAuth();
  const { clearAllLocalData, isSkyMode } = useWellness();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [name, setName] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoadingProfile(false);
      return;
    }
    let cancelled = false;
    fetchProfile()
      .then(data => {
        if (cancelled) return;
        setName(data?.display_name || '');
        setAiEnabled(!!data?.ai_features_enabled);
        setLoadingProfile(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError("Couldn't load your profile right now — please try refreshing.");
        setLoadingProfile(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      await updateProfile({ displayName: name.trim(), aiFeaturesEnabled: aiEnabled });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message || 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount();
      clearAllLocalData();
      setActiveTab('hub');
    } catch (err) {
      setDeleteError(err.message || 'Something went wrong — your account was not deleted.');
      setDeleting(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-10">

      {/* Ambient watercolor blobs, purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-6 h-64 overflow-hidden -z-10">
        <div className={`absolute left-0 top-0 w-72 h-72 rounded-full blur-3xl ${isSkyMode ? 'bg-lagoon-200/50' : 'bg-lagoon-700/20'}`} />
        <div className={`absolute right-0 top-6 w-80 h-80 rounded-full blur-3xl ${isSkyMode ? 'bg-blush-200/50' : 'bg-otterfur-500/10'}`} />
      </div>

      <div className="text-center space-y-2">
        <h2 className={`font-display text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
          <User className={`w-7 h-7 ${isSkyMode ? 'text-lagoon-500' : 'text-lagoon-400'}`} />
          Your Sisu Account
        </h2>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto font-semibold ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
          A quiet place to keep your details, and to care for your data.
        </p>
      </div>

      {!user ? (
        <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 text-center shadow-2xl border
          ${isSkyMode
            ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
            : 'bg-gradient-to-br from-midnight-950 via-midnight-900 to-[#1D2636] border-midnight-800'}`}
        >
          <p className={`text-sm font-semibold ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
            You're browsing as a guest, so there's no account here yet — sign in to see your details.
          </p>
        </div>
      ) : (
        <>
          {/* Profile card */}
          <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-2xl transition-all border
            ${isSkyMode
              ? 'bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60'
              : 'bg-gradient-to-br from-midnight-950 via-midnight-900 to-[#1D2636] border-midnight-800'}`}
          >
            <SeaweedFlourish className="hidden sm:block absolute -bottom-2 left-4 w-8 h-14 opacity-70" />
            <ShellFlourish className="hidden sm:block absolute bottom-4 right-6 w-10 h-8 opacity-70" />

            <div className="relative rounded-2xl sm:rounded-3xl p-1 -mx-1 -mt-1 mb-6">
              <OtterMascot expression="caring" speech="Here's everything Sisu knows about you — take your time." compact />
            </div>

            {loadingProfile ? (
              <div className={`flex items-center justify-center gap-2 py-10 text-sm font-semibold ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading your profile...
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                {loadError && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${isSkyMode ? 'bg-blush-200/60 text-otterfur-500' : 'bg-blush-300/10 text-blush-300'}`}>
                    {loadError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="What should Sisu call you?"
                    className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:ring-2 transition-colors ${
                      isSkyMode
                        ? 'bg-white/70 border-lagoon-200 text-lagoon-950 placeholder-lagoon-400 focus:border-lagoon-400 focus:ring-lagoon-200'
                        : 'bg-midnight-900/50 border-midnight-800 text-midnight-text placeholder-midnight-muted focus:border-lagoon-500 focus:ring-midnight-700'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSkyMode ? 'text-lagoon-800' : 'text-lagoon-300'}`}>
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </label>
                  <div className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium ${
                    isSkyMode ? 'bg-dune-100/60 border-dune-300 text-lagoon-800' : 'bg-midnight-900/40 border-midnight-800 text-midnight-muted'
                  }`}>
                    {user.email}
                  </div>
                </div>

                <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border ${
                  isSkyMode ? 'bg-white/60 border-lagoon-100' : 'bg-midnight-900/30 border-midnight-800'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${isSkyMode ? 'text-lagoon-500' : 'text-lagoon-400'}`} />
                    <div>
                      <div className={`text-sm font-bold ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
                        AI-assisted suggestions
                      </div>
                      <div className={`text-xs mt-0.5 ${isSkyMode ? 'text-lagoon-700/80' : 'text-lagoon-400'}`}>
                        Let Sisu offer gentle AI-generated suggestions when reframing thoughts.
                      </div>
                    </div>
                  </div>
                  <ToggleSwitch checked={aiEnabled} onChange={setAiEnabled} isSkyMode={isSkyMode} label="AI-assisted suggestions" />
                </div>

                {saveError && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${isSkyMode ? 'bg-blush-200/60 text-otterfur-500' : 'bg-blush-300/10 text-blush-300'}`}>
                    {saveError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl font-bold text-sm tracking-wide transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 ${
                    isSkyMode
                      ? 'bg-gradient-to-r from-lagoon-500 to-lagoon-400 text-white shadow-lagoon-400/30 hover:shadow-lagoon-400/50'
                      : 'bg-gradient-to-r from-lagoon-600 to-lagoon-500 text-white shadow-black/40 hover:shadow-lagoon-900/60'
                  }`}
                >
                  {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>

          {/* Danger zone */}
          <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-2 ${
            isSkyMode ? 'bg-blush-100/50 border-blush-200' : 'bg-blush-300/5 border-blush-300/20'
          }`}>
            <SandDollarFlourish className="hidden sm:block absolute -top-2 right-6 w-10 h-10 opacity-60" />

            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${isSkyMode ? 'bg-white/70' : 'bg-lagoon-950/40'}`}>
                <ShieldAlert className={`w-5 h-5 ${isSkyMode ? 'text-otterfur-500' : 'text-blush-300'}`} />
              </div>
              <div className="space-y-1.5">
                <h3 className={`font-display text-lg font-bold ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
                  Delete Account
                </h3>
                <p className={`text-xs sm:text-sm font-medium ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
                  This permanently removes your Sisu account, your login, and all of your data. There's no undoing this one, so take a breath first.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className={`mt-5 px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 ${
                isSkyMode
                  ? 'bg-white border border-blush-300 text-otterfur-500 hover:bg-blush-100 hover:shadow-md'
                  : 'bg-midnight-950/40 border border-blush-300/30 text-blush-300 hover:bg-midnight-950/60'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-lagoon-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`relative border rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl ${
            isSkyMode ? 'bg-white border-lagoon-200' : 'bg-midnight-900 border-midnight-800'
          }`}>
            {!deleting && (
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isSkyMode ? 'text-lagoon-400 hover:bg-lagoon-50 hover:text-lagoon-800' : 'text-lagoon-300 hover:bg-lagoon-800 hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-2 bg-white rounded-2xl shadow-md">
                <img
                  src={surprisedOtterImg}
                  alt="Surprised otter"
                  className="h-28 sm:h-32 w-auto object-contain"
                />
              </div>
              <h3 className={`font-display text-xl font-bold ${isSkyMode ? 'text-lagoon-950' : 'text-white'}`}>
                Wait — are you sure?
              </h3>
              <p className={`text-xs sm:text-sm font-medium ${isSkyMode ? 'text-lagoon-700' : 'text-lagoon-300'}`}>
                This will permanently delete, right now, with no way back:
              </p>
            </div>

            <ul className="space-y-1.5">
              {DELETE_IMPACT.map(item => (
                <li
                  key={item}
                  className={`text-xs sm:text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-xl ${
                    isSkyMode ? 'bg-blush-100/60 text-lagoon-900' : 'bg-blush-300/10 text-lagoon-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSkyMode ? 'bg-otterfur-400' : 'bg-blush-300'}`} />
                  {item}
                </li>
              ))}
            </ul>

            {deleteError && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${isSkyMode ? 'bg-blush-200/60 text-otterfur-500' : 'bg-blush-300/10 text-blush-300'}`}>
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
                disabled={deleting}
                className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all disabled:opacity-60 ${
                  isSkyMode ? 'bg-lagoon-50 border border-lagoon-200 text-lagoon-800 hover:bg-lagoon-100' : 'bg-midnight-800 border border-midnight-700 text-midnight-text hover:bg-midnight-700'
                }`}
              >
                Keep My Account
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-otterfur-500 text-white hover:bg-otterfur-400 shadow-md shadow-otterfur-500/30 disabled:opacity-70"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

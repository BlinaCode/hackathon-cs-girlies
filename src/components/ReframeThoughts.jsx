import React, { useState, useRef } from "react";
import {
  Brain,
  Plus,
  Sparkles,
  TrendingDown,
  CheckCircle,
  ArrowRight,
  Check,
} from "lucide-react";
import { useWellness } from "../context/WellnessContext";

const EMPTY_PRACTICE = {
  initialBeliefScore: 50,
  advantages: "",
  disadvantages: "",
  chosenAlternativeThought: "",
  chosenNewAction: "",
  finalBeliefScore: 50,
};

const FIELD_CLASS =
  "w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:ring-2 transition-colors";

const fieldTone = (isSkyMode) =>
  isSkyMode
    ? "bg-white/70 border-lagoon-200 text-lagoon-950 placeholder-lagoon-400 focus:border-lagoon-400 focus:ring-lagoon-200 shadow-sm"
    : "bg-lagoon-950/50 border-lagoon-700 text-lagoon-50 placeholder-lagoon-500 focus:border-lagoon-500 focus:ring-lagoon-800 shadow-md shadow-black/30";

// Shared card shell — mirrors MoodCheckIn's white/beige gradient in sky mode
// instead of the flatter blue "glass-card" treatment.
const cardShell = (isSkyMode) =>
  `relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-2xl transition-all border ${
    isSkyMode
      ? "bg-gradient-to-br from-white via-lagoon-50 to-blush-100 border-white/60"
      : "bg-gradient-to-br from-lagoon-950 via-lagoon-900 to-[#1a2f38] border-lagoon-800"
  }`;

function SeaweedFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden="true">
      <path
        d="M20 58 C20 40, 8 40, 10 22 C12 8, 20 8, 20 2"
        stroke="#7E7B51"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M20 50 C20 34, 30 34, 28 18"
        stroke="#A89B6E"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

function ShellFlourish({ className }) {
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden="true">
      <path
        d="M4 26 C2 16, 30 16, 28 26 C30 30, 2 30, 4 26 Z"
        fill="#C99C8B"
        opacity="0.5"
      />
      <path
        d="M16 28 L10 16"
        stroke="#FEF8F7"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M16 28 L16 14"
        stroke="#FEF8F7"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M16 28 L22 16"
        stroke="#FEF8F7"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function ReframeThoughts() {
  const {
    beliefs,
    beliefPractices,
    addBelief,
    addBeliefPractice,
    updateBeliefStatus,
    mascotState,
    isSkyMode,
  } = useWellness();

  const activeBeliefs = beliefs.filter((b) => b.status === "active");

  const [selectedBeliefId, setSelectedBeliefId] = useState(
    activeBeliefs[0]?.id || "",
  );
  const [showNewForm, setShowNewForm] = useState(activeBeliefs.length === 0);

  // New-belief form
  const [statement, setStatement] = useState("");
  const [meaningToMe, setMeaningToMe] = useState("");
  const [originHistorical, setOriginHistorical] = useState("");

  // Practice worksheet
  const [practice, setPractice] = useState(EMPTY_PRACTICE);
  const [submitted, setSubmitted] = useState(false);

  const selectedBelief = beliefs.find((b) => b.id === selectedBeliefId);
  const practiceHistory = beliefPractices
    .filter((p) => p.beliefId === selectedBeliefId)
    .sort((a, b) => new Date(a.practicedAt) - new Date(b.practicedAt));

  const setP = (field, value) =>
    setPractice((prev) => ({ ...prev, [field]: value }));

  const handleAddBelief = (e) => {
    e.preventDefault();
    if (!statement.trim()) return;
    const id = addBelief(statement, meaningToMe, originHistorical);
    setSelectedBeliefId(id);
    setStatement("");
    setMeaningToMe("");
    setOriginHistorical("");
    setShowNewForm(false);
    setPractice(EMPTY_PRACTICE);
  };

  const handleLogPractice = (e) => {
    e.preventDefault();
    if (!selectedBeliefId) return;
    addBeliefPractice(selectedBeliefId, practice);
    setPractice(EMPTY_PRACTICE);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="relative max-w-4xl mx-auto space-y-6 sm:space-y-8 px-1 sm:px-0 pb-10">
      {/* Ambient watercolor blobs — same blue + beige blend as MoodCheckIn,
          sitting behind the whole section instead of a flat blue page fill */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-6 h-64 overflow-hidden -z-10"
      >
        <div
          className={`absolute left-0 top-0 w-72 h-72 rounded-full blur-3xl ${isSkyMode ? "bg-lagoon-200/50" : "bg-lagoon-700/20"}`}
        />
        <div
          className={`absolute right-0 top-6 w-80 h-80 rounded-full blur-3xl ${isSkyMode ? "bg-blush-200/50" : "bg-otterfur-500/10"}`}
        />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h2
          className={`font-display text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? "text-lagoon-950" : "text-white"}`}
        >
          <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-lagoon-400" />
          Reframe Thoughts
        </h2>
        <p
          className={`text-xs sm:text-sm max-w-xl mx-auto font-semibold ${isSkyMode ? "text-lagoon-700" : "text-lagoon-300"}`}
        >
          Gently examine a thought that is bothering you, find a kinder
          alternative, and watch your belief in it soften over time.
        </p>
      </div>

      {/* Choose or add a belief */}
      <div className={cardShell(isSkyMode)}>
        <SeaweedFlourish className="hidden sm:block absolute -bottom-2 left-4 w-8 h-14 opacity-70" />
        <ShellFlourish className="hidden sm:block absolute bottom-4 right-6 w-10 h-8 opacity-70" />

        <div className="relative space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h3
              className={`font-display text-lg sm:text-xl font-bold ${isSkyMode ? "text-lagoon-950" : "text-white"}`}
            >
              {showNewForm
                ? "Name a thought to reframe"
                : "Which thought are you working on?"}
            </h3>
            {!showNewForm && (
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className={`px-3 py-1.5 rounded-full border font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${isSkyMode ? "bg-white/70 border-lagoon-500/30 text-lagoon-600 hover:bg-white" : "bg-lagoon-500/10 border-lagoon-500/30 text-lagoon-300 hover:bg-lagoon-500/20"}`}
              >
                <Plus className="w-4 h-4" /> New thought
              </button>
            )}
          </div>

          {showNewForm ? (
            <form onSubmit={handleAddBelief} className="space-y-5">
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? "text-lagoon-800" : "text-lagoon-300"}`}
                >
                  What is one thought that is bothering you?
                </label>
                <input
                  type="text"
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="e.g. I feel that I am not good enough."
                  className={`${FIELD_CLASS} ${fieldTone(isSkyMode)}`}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? "text-lagoon-800" : "text-lagoon-300"}`}
                  >
                    What does that mean to you?
                  </label>
                  <input
                    type="text"
                    value={meaningToMe}
                    onChange={(e) => setMeaningToMe(e.target.value)}
                    placeholder="e.g. That I will be rejected."
                    className={`${FIELD_CLASS} ${fieldTone(isSkyMode)}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isSkyMode ? "text-lagoon-800" : "text-lagoon-300"}`}
                  >
                    Where did it originate?
                  </label>
                  <input
                    type="text"
                    value={originHistorical}
                    onChange={(e) => setOriginHistorical(e.target.value)}
                    placeholder="e.g. Childhood, an old comparison."
                    className={`${FIELD_CLASS} ${fieldTone(isSkyMode)}`}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] ${isSkyMode ? "bg-gradient-to-r from-lagoon-500 to-lagoon-400 text-white shadow-lagoon-400/30 hover:shadow-lagoon-400/50" : "bg-gradient-to-r from-lagoon-600 to-lagoon-500 text-white shadow-black/40 hover:shadow-lagoon-900/60"}`}
                >
                  <ArrowRight className="w-5 h-5" /> Start reframing
                </button>
                {activeBeliefs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className={`px-5 py-3.5 rounded-2xl border font-semibold text-sm transition-all ${isSkyMode ? "border-lagoon-300 text-lagoon-800 bg-white/70 hover:bg-white" : "border-lagoon-700 text-lagoon-300 hover:bg-slate-800/50"}`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <BeliefPicker
              beliefs={activeBeliefs}
              selectedId={selectedBeliefId}
              isSkyMode={isSkyMode}
              onSelect={(id) => {
                setSelectedBeliefId(id);
                setPractice(EMPTY_PRACTICE);
              }}
            />
          )}
        </div>
      </div>

      {/* Practice worksheet */}
      {!showNewForm && selectedBelief && (
        <div className={cardShell(isSkyMode)}>
          <SeaweedFlourish className="hidden sm:block absolute -bottom-2 left-4 w-8 h-14 opacity-70" />
          <ShellFlourish className="hidden sm:block absolute bottom-4 right-6 w-10 h-8 opacity-70" />

          <div className="relative space-y-6">
            {submitted ? (
              <div
                className={`p-6 rounded-2xl border text-center space-y-2 ${isSkyMode ? "bg-white/70 border-lagoon-500/30 shadow-sm" : "bg-lagoon-500/10 border-lagoon-500/30"}`}
              >
                <CheckCircle className="w-8 h-8 text-lagoon-400 mx-auto" />
                <h4
                  className={`font-semibold ${isSkyMode ? "text-lagoon-950" : "text-white"}`}
                >
                  Reframe recorded!
                </h4>
                <p
                  className={`text-xs ${isSkyMode ? "text-lagoon-700" : "text-lagoon-300"}`}
                >
                  Come back and practice this thought again anytime — progress
                  builds with repetition.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogPractice} className="space-y-6">
                <div
                  className={`p-4 rounded-2xl border ${isSkyMode ? "bg-white/70 border-lagoon-200 shadow-sm" : "bg-lagoon-950/50 border-lagoon-700 shadow-md shadow-black/30"}`}
                >
                  <p
                    className={`text-xs ${isSkyMode ? "text-lagoon-600" : "text-lagoon-400"}`}
                  >
                    Working on the thought:
                  </p>
                  <p
                    className={`font-semibold mt-0.5 ${isSkyMode ? "text-lagoon-950" : "text-white"}`}
                  >
                    “{selectedBelief.statement}”
                  </p>
                </div>

                {/* Initial belief score */}
                <ScoreSlider
                  label="How strongly do you believe it right now?"
                  value={practice.initialBeliefScore}
                  onChange={(v) => setP("initialBeliefScore", v)}
                  isSkyMode={isSkyMode}
                />

                {/* Advantages / disadvantages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextArea
                    label="Advantages of thinking this way"
                    value={practice.advantages}
                    onChange={(v) => setP("advantages", v)}
                    placeholder="e.g. It keeps me cautious."
                    isSkyMode={isSkyMode}
                    required
                  />
                  <TextArea
                    label="Disadvantages of thinking this way"
                    value={practice.disadvantages}
                    onChange={(v) => setP("disadvantages", v)}
                    placeholder="e.g. It stops me from trying."
                    isSkyMode={isSkyMode}
                    required
                  />
                </div>

                {/* Alternative thought */}
                <TextArea
                  label="Find an alternative thought"
                  icon={<Sparkles className="w-3.5 h-3.5 text-lagoon-400" />}
                  value={practice.chosenAlternativeThought}
                  onChange={(v) => setP("chosenAlternativeThought", v)}
                  placeholder="A kinder, more balanced way to see this..."
                  isSkyMode={isSkyMode}
                  required
                />

                {/* New action */}
                <TextArea
                  label="What new action can you take today?"
                  value={practice.chosenNewAction}
                  onChange={(v) => setP("chosenNewAction", v)}
                  placeholder="One small step that honors the new thought..."
                  isSkyMode={isSkyMode}
                  required
                />

                {/* Final belief score */}
                <ScoreSlider
                  label="How strongly do you believe the original thought now?"
                  value={practice.finalBeliefScore}
                  onChange={(v) => setP("finalBeliefScore", v)}
                  isSkyMode={isSkyMode}
                />

                <button
                  type="submit"
                  className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] hover:-translate-y-0.5 ${isSkyMode ? "bg-gradient-to-r from-lagoon-500 to-lagoon-400 text-white shadow-lagoon-400/30 hover:shadow-lagoon-400/50" : "bg-gradient-to-r from-lagoon-600 to-lagoon-500 text-white shadow-black/40 hover:shadow-lagoon-900/60"}`}
                >
                  <CheckCircle className="w-5 h-5" /> Save this reframe
                </button>
              </form>
            )}

            {/* Progress over time */}
            {practiceHistory.length > 0 && (
              <div
                className={`pt-6 border-t space-y-3 ${isSkyMode ? "border-lagoon-200/60" : "border-lagoon-700/60"}`}
              >
                <h4
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSkyMode ? "text-lagoon-800" : "text-lagoon-300"}`}
                >
                  <TrendingDown className="w-3.5 h-3.5 text-lagoon-400" />
                  Your belief over time ({practiceHistory.length})
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
                  {practiceHistory.map((p) => (
                    <div
                      key={p.id}
                      className={`p-3 rounded-xl border flex justify-between items-center text-xs ${isSkyMode ? "bg-white/70 border-lagoon-200 shadow-sm" : "bg-lagoon-950/50 border-lagoon-700 shadow-md shadow-black/30"}`}
                    >
                      <span className="text-[10px] text-lagoon-500">
                        {new Date(p.practicedAt).toLocaleDateString()}:{" "}
                        {new Date(p.practicedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                      <div
                        className={`flex items-center gap-2 font-semibold ${isSkyMode ? "text-lagoon-800" : "text-lagoon-200"}`}
                      >
                        <span>{p.initialBeliefScore}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-lagoon-400" />
                        <span className="text-lagoon-400">
                          {p.finalBeliefScore ?? "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateBeliefStatus(selectedBeliefId, "resolved");
                    setSelectedBeliefId("");
                  }}
                  className={`text-xs hover:text-lagoon-500 transition-colors underline underline-offset-2 ${isSkyMode ? "text-lagoon-700" : "text-lagoon-300"}`}
                >
                  This thought no longer bothers me — mark as resolved
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BeliefPicker({ beliefs, selectedId, isSkyMode, onSelect }) {
  return (
    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
      {beliefs.map((b) => (
        <BeliefButton
          key={b.id}
          belief={b}
          isSelected={b.id === selectedId}
          isSkyMode={isSkyMode}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// Mirrors MoodButton's press feedback: a quick pop/scale on the button
// itself plus an outward ripple ring, triggered fresh on every click.
function BeliefButton({ belief, isSelected, isSkyMode, onSelect }) {
  const [justPicked, setJustPicked] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => {
        onSelect(belief.id);
        setJustPicked(true);
      }}
      onAnimationEnd={() => setJustPicked(false)}
      className={`relative w-full flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5 ${
        justPicked ? "animate-select-pop" : ""
      } ${
        isSelected
          ? isSkyMode
            ? "border-lagoon-400 bg-white shadow-md shadow-lagoon-200/60 ring-2 ring-lagoon-300/70 text-lagoon-950"
            : "border-lagoon-400 bg-lagoon-900/50 shadow-md shadow-black/30 ring-2 ring-lagoon-500/60 text-white"
          : isSkyMode
            ? "border-lagoon-100 bg-white/70 text-lagoon-800 hover:border-lagoon-300 hover:bg-white"
            : "border-lagoon-800/60 bg-lagoon-950/30 text-lagoon-200 hover:border-lagoon-600 hover:bg-lagoon-900/40"
      }`}
    >
      {justPicked && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-lagoon-300 animate-pick-ripple"
        />
      )}
      <span className="line-clamp-2">{belief.statement}</span>
      {isSelected && (
        <span
          className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isSkyMode ? "bg-lagoon-400" : "bg-lagoon-500"}`}
        >
          <Check className="w-3.5 h-3.5 text-white" />
        </span>
      )}
    </button>
  );
}

function ScoreSlider({ label, value, onChange, isSkyMode }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <label
          className={`font-bold uppercase tracking-wider ${isSkyMode ? "text-lagoon-800" : "text-lagoon-300"}`}
        >
          {label}
        </label>
        <span
          className={`font-semibold text-sm ${isSkyMode ? "text-lagoon-600" : "text-lagoon-400"}`}
        >
          {value} / 100
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-lagoon-500 ${isSkyMode ? "bg-dune-100" : "bg-lagoon-950"}`}
      />
      <div
        className={`flex justify-between text-[11px] font-medium px-1 ${isSkyMode ? "text-lagoon-600" : "text-lagoon-400"}`}
      >
        <span>Not at all</span>
        <span>Completely</span>
      </div>
    </div>
  );
}

function TextArea({
  label,
  icon,
  value,
  onChange,
  placeholder,
  isSkyMode,
  required,
}) {
  return (
    <div className="space-y-2">
      <label
        className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isSkyMode ? "text-lagoon-800" : "text-lagoon-300"}`}
      >
        {icon}
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        required={required}
        className={`${FIELD_CLASS} resize-none ${fieldTone(isSkyMode)}`}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Compass,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useBreathingTimer,
  BREATHING_MODES,
} from "../hooks/useBreathingTimer";
import { useBreathingPresence } from "../hooks/useBreathingPresence";
import { useWellness } from "../context/WellnessContext";
import mantaSvg from "../assets/svg/mantadeyogaplaya.svg";

function CoastalElementIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
      <path
        d="M 20 36 L 20 6 M 20 12 L 30 6 M 20 18 L 32 12 M 20 24 L 30 18 M 20 12 L 10 6 M 20 18 L 8 12 M 20 24 L 10 18"
        stroke="#84A8A6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const MODE_ACCENTS = [
  { day: "#A4D3DE", night: "#3E6B78" },
  { day: "#F5E8C9", night: "#8A7442" },
  { day: "#D9E7D0", night: "#4E6B45" },
  { day: "#F5B2B8", night: "#8A4A52" },
  { day: "#CFE2F3", night: "#3F5A72" },
];

export function BreathingVisualizer() {
  const participants = useBreathingPresence();

  const {
    modeKey,
    setModeKey,
    mode,
    isActive,
    currentPhase,
    secondsRemaining,
    completedCycles,
    toggleTimer,
    resetTimer,
  } = useBreathingTimer("box");

  const {
    completeBreathingSession,
    setMascotState,
    isSkyMode,
  } = useWellness();

  const [showCelebration, setShowCelebration] = useState(false);
  const [lastSessionCycles, setLastSessionCycles] = useState(0);

  const modeKeys = Object.keys(BREATHING_MODES);
  const modeIndex = modeKeys.indexOf(modeKey);
  const accentPair = MODE_ACCENTS[modeIndex % MODE_ACCENTS.length];
  const accent = isSkyMode ? accentPair.day : accentPair.night;

  useEffect(() => {
    if (isActive) {
      setShowCelebration(false);

      setMascotState({
        expression: "breathing",
        speech:
          "Follow the expanding ocean wave. Breathe in peace, exhale tension.",
      });
    }
  }, [isActive, setMascotState]);

  const handleFinish = () => {
    const cycles = completedCycles;

    setLastSessionCycles(cycles);
    setShowCelebration(true);

    completeBreathingSession();
    resetTimer();
  };

  const handleStartAgain = () => {
    setShowCelebration(false);
    resetTimer();
  };

  const goPrevMode = () => {
    if (isActive) return;

    const nextIdx =
      (modeIndex - 1 + modeKeys.length) % modeKeys.length;

    setModeKey(modeKeys[nextIdx]);
  };

  const goNextMode = () => {
    if (isActive) return;

    const nextIdx = (modeIndex + 1) % modeKeys.length;

    setModeKey(modeKeys[nextIdx]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10 px-2 sm:px-0">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-1">
          <img src={mantaSvg} alt="Beach Yoga Mat" className="w-28 h-28 object-contain drop-shadow-lg" />
        </div>
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm"
          style={
            isSkyMode
              ? { background: "#F5E8C9", color: "#4A2511" }
              : { background: "#5A4A2E", color: "#F5E8C9" }
          }
        >
          Calm & Focus
        </span>

        <h2
          className={`font-display text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2 ${isSkyMode ? "text-bluey-950" : "text-slate-100"
            }`}
        >
          <Compass
            className={`w-6 h-6 ${isSkyMode
              ? "text-bluey-500"
              : "text-seafoam-400"
              }`}
          />
          Ocean Wave Breathing
        </h2>

        <p
          className={`text-xs sm:text-sm max-w-md mx-auto font-medium ${isSkyMode
            ? "text-bluey-700"
            : "text-bluey-300"
            }`}
        >
          Synchronize your breath with expanding ocean waves
          to calm your nervous system.
        </p>
      </div>

      {/* People breathing with you */}
      {participants.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm border ${isSkyMode
              ? "bg-white border-bluey-200 text-bluey-700"
              : "bg-bluey-900 border-bluey-700 text-bluey-200"
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${isSkyMode
                ? "bg-bluey-400"
                : "bg-seafoam-400"
                }`}
            />

            {participants.length === 1
              ? `${participants[0].name} is breathing with you`
              : `${participants[0].name} and ${participants.length - 1
              } other${participants.length - 1 === 1
                ? ""
                : "s"
              } are breathing with you`}
          </span>
        </div>
      )}


      {/* Mode progress dots */}
      <div className="flex items-center justify-center gap-2">
        {modeKeys.map((key, idx) => (
          <div
            key={key}
            className="h-2 rounded-full transition-all"
            style={{
              width:
                idx === modeIndex ? "2rem" : "0.5rem",
              background:
                idx === modeIndex
                  ? isSkyMode
                    ? "#A4D3DE"
                    : "#3E6B78"
                  : isSkyMode
                    ? "#E8E2D1"
                    : "#3A3F45",
            }}
          />
        ))}
      </div>

      {/* Main Breathing Card */}
      <div
        className="rounded-3xl border p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden transition-all"
        style={
          isSkyMode
            ? {
              background: `${accent}33`,
              borderColor: accent,
            }
            : {
              background: `${accent}26`,
              borderColor: `${accent}88`,
            }
        }
      >
        <span className="absolute w-10 h-10 sm:w-12 sm:h-12 opacity-90 top-6 right-6">
          <CoastalElementIcon />
        </span>

        {showCelebration ? (
          /* Celebration */
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 animate-pulse"
                style={{
                  borderColor: `${accent}66`,
                  background: `${accent}22`,
                }}
              />

              <div
                className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border flex flex-col items-center justify-center shadow-2xl backdrop-blur-md p-6 text-center space-y-2"
                style={{
                  background: `${accent}33`,
                  borderColor: `${accent}88`,
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  ✨
                </div>

                <div
                  className={`font-display font-bold text-xl sm:text-2xl ${isSkyMode
                    ? "text-bluey-950"
                    : "text-slate-100"
                    }`}
                >
                  Peace Achieved
                </div>

                <div
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: `${accent}33`,
                    color: isSkyMode
                      ? "#4A2511"
                      : "#D9F4F7",
                  }}
                >
                  {lastSessionCycles} Wave{" "}
                  {lastSessionCycles === 1
                    ? "Cycle"
                    : "Cycles"}{" "}
                  Done
                </div>
              </div>
            </div>

            <button
              onClick={handleStartAgain}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2"
              style={{
                background: isSkyMode
                  ? "#A4D3DE"
                  : "linear-gradient(to right, #3E6B78, #5FA0AF)",
                color: isSkyMode
                  ? "#4A2511"
                  : "#F5FBFC",
              }}
            >
              <Play className="w-4 h-4 fill-current" />
              Start Another Wave
            </button>
          </div>
        ) : (
          <>
            {/* Technique name */}
            <div className="text-center space-y-1 relative z-10">
              <h3
                className={`font-display text-lg sm:text-xl font-bold ${isSkyMode
                  ? ""
                  : "text-slate-100"
                  }`}
                style={
                  isSkyMode
                    ? { color: "#4A2511" }
                    : undefined
                }
              >
                {mode.name}
              </h3>

              <p
                className={`text-xs sm:text-sm max-w-sm mx-auto font-medium ${isSkyMode
                  ? ""
                  : "text-slate-400"
                  }`}
                style={
                  isSkyMode
                    ? { color: "#7A5A3A" }
                    : undefined
                }
              >
                {mode.description}
              </p>
            </div>

            {/* Arrows + breathing bubble */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 relative z-10">
              <button
                onClick={goPrevMode}
                disabled={isActive}
                aria-label="Previous breathing technique"
                className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border-2 flex items-center justify-center transition-all shadow-sm"
                style={
                  isActive
                    ? {
                      opacity: 0.4,
                      cursor: "not-allowed",
                      background: isSkyMode
                        ? "#E8E2D1"
                        : "#2A2E33",
                      borderColor: isSkyMode
                        ? "#D6CBAE"
                        : "#3A3F45",
                      color: isSkyMode
                        ? "#7A5A3A"
                        : "#8A8F94",
                    }
                    : {
                      background: isSkyMode
                        ? "#FAFBF0"
                        : "#1E2226",
                      borderColor: isSkyMode
                        ? "#E8E2D1"
                        : "#3A3F45",
                      color: isSkyMode
                        ? "#4A2511"
                        : "#E5E7EB",
                    }
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center shrink-0">
                <div
                  className={`absolute inset-3 rounded-full border-2 transition-all duration-1000 ${isActive ? "animate-ripple" : ""
                    }`}
                  style={{
                    borderColor: `${accent}66`,
                    background: `${accent}22`,
                  }}
                />

                <div
                  className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full border flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-1000 ${currentPhase.name === "Inhale"
                    ? "scale-110"
                    : currentPhase.name === "Exhale"
                      ? "scale-90"
                      : "scale-100"
                    }`}
                  style={
                    isSkyMode
                      ? currentPhase.name === "Inhale"
                        ? {
                          background:
                            "rgba(255,255,255,0.55)",
                          borderColor: "#A4D3DE",
                          boxShadow:
                            "inset 0 4px 16px rgba(255,255,255,0.7)",
                        }
                        : currentPhase.name === "Exhale"
                          ? {
                            background:
                              "rgba(245,232,201,0.5)",
                            borderColor: "#E3CE9E",
                          }
                          : {
                            background: "#FAFBF0",
                            borderColor: "#E8E2D1",
                          }
                      : currentPhase.name === "Inhale"
                        ? {
                          background:
                            "rgba(164,211,222,0.18)",
                          borderColor: "#5FA0AF",
                          boxShadow:
                            "inset 0 2px 14px rgba(255,255,255,0.15)",
                        }
                        : currentPhase.name === "Exhale"
                          ? {
                            background:
                              "rgba(20,24,28,0.5)",
                            borderColor: "#3A3F45",
                          }
                          : {
                            background:
                              "rgba(30,34,38,0.6)",
                            borderColor: "#4A4F55",
                          }
                  }
                >
                  <span
                    className={`text-xs uppercase font-bold tracking-widest mb-1 ${isSkyMode
                      ? ""
                      : "text-bluey-300"
                      }`}
                    style={
                      isSkyMode
                        ? { color: "#7A5A3A" }
                        : undefined
                    }
                  >
                    {currentPhase.name}
                  </span>

                  <span
                    className={`font-display text-4xl sm:text-5xl font-bold ${isSkyMode
                      ? ""
                      : "text-slate-100"
                      }`}
                    style={
                      isSkyMode
                        ? { color: "#4A2511" }
                        : undefined
                    }
                  >
                    {secondsRemaining}s
                  </span>

                  <span
                    className={`text-xs mt-[13px] font-bold ${isSkyMode
                      ? ""
                      : "text-slate-400"
                      }`}
                    style={
                      isSkyMode
                        ? { color: "#7AABB8" }
                        : undefined
                    }
                  >
                    Cycle {completedCycles}
                  </span>
                </div>
              </div>

              <button
                onClick={goNextMode}
                disabled={isActive}
                aria-label="Next breathing technique"
                className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border-2 flex items-center justify-center transition-all shadow-sm"
                style={
                  isActive
                    ? {
                      opacity: 0.4,
                      cursor: "not-allowed",
                      background: isSkyMode
                        ? "#E8E2D1"
                        : "#2A2E33",
                      borderColor: isSkyMode
                        ? "#D6CBAE"
                        : "#3A3F45",
                      color: isSkyMode
                        ? "#7A5A3A"
                        : "#8A8F94",
                    }
                    : {
                      background: isSkyMode
                        ? "#FAFBF0"
                        : "#1E2226",
                      borderColor: isSkyMode
                        ? "#E8E2D1"
                        : "#3A3F45",
                      color: isSkyMode
                        ? "#4A2511"
                        : "#E5E7EB",
                    }
                }
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 relative z-10 pt-2">
              <button
                onClick={toggleTimer}
                className="px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md flex items-center gap-2"
                style={
                  isSkyMode
                    ? {
                      background: "#A4D3DE",
                      color: "#4A2511",
                    }
                    : {
                      background:
                        "linear-gradient(to right, #3E6B78, #5FA0AF)",
                      color: "#F5FBFC",
                    }
                }
              >
                {isActive ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                )}
                {isActive ? "Pause" : "Start Practice"}
              </button>

              <button
                onClick={resetTimer}
                className="p-3.5 rounded-2xl border font-bold transition-all shadow-sm"
                style={
                  isSkyMode
                    ? {
                      background: "#FAFBF0",
                      borderColor: "#E8E2D1",
                      color: "#7A5A3A",
                    }
                    : {
                      background: "#1E2226",
                      borderColor: "#3A3F45",
                      color: "#B8BCC0",
                    }
                }
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {completedCycles > 0 && (
                <button
                  onClick={handleFinish}
                  className="px-4 py-3.5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  style={
                    isSkyMode
                      ? {
                        background: "#D9E7D0",
                        borderColor: "#B9D1AE",
                        color: "#3F5A34",
                      }
                      : {
                        background:
                          "rgba(74,158,101,0.18)",
                        borderColor:
                          "rgba(74,158,101,0.4)",
                        color: "#8FD9A8",
                      }
                  }
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Practice
                </button>
              )}
            </div>
          </>
        )}

        <p
          className={`text-center text-[11px] font-medium relative z-10 ${isSkyMode ? "" : "text-slate-400"
            }`}
          style={
            isSkyMode
              ? { color: "#7A5A3A" }
              : undefined
          }
        >
          Use the arrows to browse techniques — Start whenever
          you're ready.
        </p>
      </div>
    </div>
  );
}
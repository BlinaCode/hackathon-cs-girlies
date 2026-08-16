import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { OtterMascot } from './OtterMascot';

const QUESTIONS = [
  {
    question: 'How are you feeling right now?',
    options: [
    { label: 'Awful', emoji: '😞' },
    { label: 'Low', emoji: '😕' },
    { label: 'Okay', emoji: '😐' },
    { label: 'Good', emoji: '🙂' },
    { label: 'Great', emoji: '😄' }
  ]
  },
  {
    question: 'How does your body feel right now?',
    options: [
    { label: 'Calm and settled', emoji: '🌿' },
    { label: 'A bit restless', emoji: '🌀' },
    { label: 'Tense — tight chest, racing thoughts', emoji: '💭' },
    { label: 'Overwhelmed', emoji: '🌊' },
    { label: "Exhausted, can't get going", emoji: '😴' }
  ]
  },
  {
    question: "What's weighing on you most right now?",
    options: [
    { label: 'Work or school', emoji: '📚' },
    { label: 'Money', emoji: '💰' },
    { label: 'Relationships or family', emoji: '❤️' },
    { label: 'Health', emoji: '🩺' },
    { label: 'The future / uncertainty', emoji: '🔮' },
    { label: 'Sleep', emoji: '🌙' },
    { label: "I'm not sure", emoji: '🤷' }
  ]
  }
];

export function WelcomeQuestionnaire({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const question = QUESTIONS[currentQuestion];

 const handleAnswer = (answer) => {
  const updatedAnswers = [...answers, answer];
  setAnswers(updatedAnswers);

  // Q1: prioritize mood
  if (currentQuestion === 0) {
    if (answer === 'Awful' || answer === 'Low') {
      onComplete({ answers: updatedAnswers, redirect: 'checkin' });
      return;
    }

    setCurrentQuestion(1);
    return;
  }

  // Q2: if the body feels uncomfortable, prioritize breathing
  if (currentQuestion === 1) {
    if (
      answer === 'A bit restless' ||
      answer === 'Tense — tight chest, racing thoughts' ||
      answer === 'Overwhelmed' ||
      answer === "Exhausted, can't get going"
    ) {
      onComplete({ answers: updatedAnswers, redirect: 'breathing' });
      return;
    }

    setCurrentQuestion(2);
    return;
  }

  // Q3: route to the most relevant tool
  const q3Redirects = {
    'Work or school': 'beliefs',
    'Money': 'resources',
    'Relationships or family': 'beliefs',
    'Health': 'resources',
    'The future / uncertainty': 'beliefs',
    'Sleep': 'breathing',
    "I'm not sure": 'hub'
  };

  onComplete({
    answers: updatedAnswers,
    redirect: q3Redirects[answer] || 'hub'
  });
}; 

  const handleSkip = () => {
    onComplete(null);
  };

  return (
    <div className="min-h-screen bg-ocean-900 text-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">

        {!started ? (
          /* Welcome screen */
          <div className="text-center">
            <OtterMascot
              expression="joyful"
              speech="Hey! Welcome to Sisu. Let's take a quick moment to check in with yourself."
            />

            <div className="mt-8 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 sm:p-10 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-seafoam-500/15 border border-seafoam-500/30 text-seafoam-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                A little check-in
              </div>

              <h1 className="mt-5 font-display text-3xl sm:text-4xl font-bold text-slate-100">
                How are you doing today?
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto">
                Answer three quick questions and we'll help you find the right
                place to start.
              </p>

              <button
                onClick={() => setStarted(true)}
                className="mt-8 px-6 py-3.5 rounded-2xl bg-seafoam-500 text-ocean-950 font-bold text-sm hover:bg-seafoam-400 transition-all shadow-xl shadow-seafoam-500/20 inline-flex items-center gap-2"
              >
                Let's get started
                <ArrowRight className="w-4 h-4" />
              </button>

              <div>
                <button
                  onClick={handleSkip}
                  className="mt-5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Questions */
          <>
            <OtterMascot
              expression="caring"
              speech="Let's take a quick moment to check in with yourself."
            />

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-seafoam-400">
                  Question {currentQuestion + 1} of {QUESTIONS.length}
                </p>

                <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-100">
                  {question.question}
                </h1>
              </div>

              <div className="space-y-3">
               {question.options.map((option) => {
  const label = typeof option === 'string' ? option : option.label;
  const emoji = typeof option === 'string' ? null : option.emoji;

  return (
    <button
      key={label}
      onClick={() => handleAnswer(label)}
      className="w-full text-left px-5 py-4 rounded-2xl bg-slate-900/60 border border-slate-700 hover:border-seafoam-500/60 hover:bg-slate-700/50 transition-all text-sm text-slate-200 flex items-center gap-4"
    >
      {emoji && <span className="text-3xl">{emoji}</span>}
      <span>{label}</span>
    </button>
  );
})} 
              </div>

              <button
                onClick={handleSkip}
                className="mt-6 text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
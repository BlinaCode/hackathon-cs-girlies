import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';

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
  const { isSkyMode } = useWellness();
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
    <div className={`min-h-full flex flex-col items-center justify-center p-6 sm:p-10 transition-all ${isSkyMode ? 'text-bluey-950' : 'text-midnight-text'}`}>
      <div className="w-full max-w-lg">

        {!started ? (
          <div className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-seafoam-500/20 text-seafoam-500 flex items-center justify-center text-3xl mb-4">
              🦦
            </div>

            <div className={`p-4 sm:p-6 transition-all`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-seafoam-500/15 text-seafoam-600 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                A little check-in
              </div>

              <h1 className="mt-6 font-display text-3xl sm:text-4xl font-bold">
                How are you doing today?
              </h1>

              <p className={`mt-4 text-sm sm:text-base leading-relaxed max-w-md mx-auto ${isSkyMode ? 'text-bluey-700' : 'text-midnight-muted'}`}>
                Answer three quick questions and we'll help you find the right
                place to start.
              </p>

              <button
                onClick={() => setStarted(true)}
                className="mt-8 px-6 py-3.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 inline-flex items-center gap-2 hover:scale-105"
              >
                Let's get started
                <ArrowRight className="w-4 h-4" />
              </button>

              <div>
                <button
                  onClick={handleSkip}
                  className={`mt-6 text-sm transition-colors ${isSkyMode ? 'text-bluey-600 hover:text-bluey-900' : 'text-midnight-muted hover:text-midnight-text'}`}
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Questions */
          <div className="flex flex-col items-center">
            
            <div className="w-12 h-12 rounded-full bg-seafoam-500/20 text-seafoam-500 flex items-center justify-center text-2xl mb-2">
              🦦
            </div>

            <div className={`p-4 sm:p-6 w-full transition-all`}>
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-seafoam-600">
                  Question {currentQuestion + 1} of {QUESTIONS.length}
                </p>

                <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold">
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
      className={`w-full text-left px-5 py-4 rounded-2xl border-none transition-all text-sm flex items-center gap-4 ${isSkyMode ? 'bg-cream-100 text-bluey-900 hover:bg-cream-200' : 'bg-midnight-800 text-midnight-text hover:bg-midnight-700'} hover:scale-[1.02]`}
    >
      {emoji && <span className="text-3xl">{emoji}</span>}
      <span className="font-semibold">{label}</span>
    </button>
  );
})}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={handleSkip}
                  className={`text-sm transition-colors ${isSkyMode ? 'text-bluey-600 hover:text-bluey-900' : 'text-midnight-muted hover:text-midnight-text'}`}
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
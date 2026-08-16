import React from 'react';
import sisuOtterImg from '../assets/sisu-otter.png';
import { useWellness } from '../context/WellnessContext';

export function AboutSisu() {
  const { isSkyMode } = useWellness();

  return (
    <article className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 space-y-16">
      
      {/* Top Section: Split Layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
        {/* Image Section (Mobile First: stacked on top) */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img 
            src={sisuOtterImg} 
            alt="Illustration of Sisu, a cheerful sea otter floating peacefully on its back" 
            className="w-full max-w-md lg:max-w-full h-auto object-contain drop-shadow-xl"
            loading="lazy"
          />
        </div>

        {/* Text Content Section */}
        <div className="w-full lg:w-1/2 space-y-10 lg:mt-4">
          <header>
            <h1 
              className={`font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight ${isSkyMode ? 'text-slate-900' : 'text-slate-100'}`}
            >
              Who am I?
            </h1>
          </header>

          <div className="space-y-6">
            <p className={`text-lg leading-relaxed ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>
              Welcome! I'm Sisu, your River Guide to Calmness.
            </p>
            <p className={`text-lg leading-relaxed ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>
              I'm here to take off the barnacles weighing you down to make your day a little more easygoing. Whether it's a few seconds or minutes, I'll be here to guide you through each activity and help you find the right resources to thrive mentally!
            </p>
            <p className={`text-lg leading-relaxed ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>
              As an otter, here's some advice! Let the current take you along toward your goals and don't forget to have a little fun on the way.
            </p>
          </div>

          <section aria-labelledby="what-does-my-name-mean">
            <h2 id="what-does-my-name-mean" className={`text-2xl font-bold mb-3 ${isSkyMode ? 'text-bluey-800' : 'text-bluey-300'}`}>
              What does my name mean?
            </h2>
            <p className={`text-lg leading-relaxed ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>
              Sisu is a Finnish word with the root "sisus" meaning "guts" or "interior". For example, your inner self: how you feel and think. Sisu is a Finnish concept that represents a person's extraordinary perseverance and courage to push beyond the limits when everything may seem to be working against you.
            </p>
          </section>
        </div>
      </div>

      {/* Bottom Section 1: Learn to Float */}
      <section 
        aria-labelledby="learn-to-float" 
        className={`w-full p-8 md:p-12 rounded-3xl ${isSkyMode ? 'bg-white/50 backdrop-blur-md border border-white/20 shadow-sm' : 'bg-bluey-900/50 backdrop-blur-md border border-bluey-800'}`}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 id="learn-to-float" className={`text-3xl md:text-4xl font-display font-bold ${isSkyMode ? 'text-bluey-900' : 'text-slate-100'}`}>
            Learn to Float
          </h2>
          <p className={`text-lg leading-relaxed ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>
            The ocean changes every day. Your mind works the same way. Some days bring calm waters. Other days bring storms. Fighting the current is exhausting. We want to teach you how to float. Our sea otter mascot shows this perfectly. The otter drifts softly on the waves. It stays anchored to the important things.
          </p>
        </div>
      </section>

      {/* Bottom Section 2: Your Daily Anchor */}
      <section 
        aria-labelledby="daily-anchor"
        className={`w-full p-8 md:p-12 rounded-3xl ${isSkyMode ? 'bg-white/50 backdrop-blur-md border border-white/20 shadow-sm' : 'bg-bluey-900/50 backdrop-blur-md border border-bluey-800'}`}
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <h2 id="daily-anchor" className={`text-3xl md:text-4xl font-display font-bold text-center ${isSkyMode ? 'text-bluey-900' : 'text-slate-100'}`}>
            Your Daily Anchor
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className={`p-8 rounded-2xl transition-all hover:scale-[1.02] ${isSkyMode ? 'bg-white/80 shadow-md' : 'bg-bluey-800/80 shadow-lg'}`}>
              <h3 className={`font-bold text-xl mb-3 ${isSkyMode ? 'text-slate-900' : 'text-slate-100'}`}>Shoreline Check-ins</h3>
              <p className={`text-lg ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>Track your feelings daily. See the patterns in your moods.</p>
            </div>
            
            <div className={`p-8 rounded-2xl transition-all hover:scale-[1.02] ${isSkyMode ? 'bg-white/80 shadow-md' : 'bg-bluey-800/80 shadow-lg'}`}>
              <h3 className={`font-bold text-xl mb-3 ${isSkyMode ? 'text-slate-900' : 'text-slate-100'}`}>Ocean Tide Breathing</h3>
              <p className={`text-lg ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>Match your breath to the waves. Calm your body quickly.</p>
            </div>

            <div className={`p-8 rounded-2xl transition-all hover:scale-[1.02] ${isSkyMode ? 'bg-white/80 shadow-md' : 'bg-bluey-800/80 shadow-lg'}`}>
              <h3 className={`font-bold text-xl mb-3 ${isSkyMode ? 'text-slate-900' : 'text-slate-100'}`}>Thought Reframing</h3>
              <p className={`text-lg ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>Watch your worries. Let them sink to the bottom of the sea.</p>
            </div>

            <div className={`p-8 rounded-2xl transition-all hover:scale-[1.02] ${isSkyMode ? 'bg-white/80 shadow-md' : 'bg-bluey-800/80 shadow-lg'}`}>
              <h3 className={`font-bold text-xl mb-3 ${isSkyMode ? 'text-slate-900' : 'text-slate-100'}`}>Social Circle</h3>
              <p className={`text-lg ${isSkyMode ? 'text-slate-700' : 'text-slate-300'}`}>Talk to people who understand. Face the rough water together.</p>
            </div>
          </div>
        </div>
      </section>

    </article>
  );
}

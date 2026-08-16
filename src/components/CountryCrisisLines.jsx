import React, { useState } from 'react';
import { Globe2, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import { CRISIS_LINES } from '../services/crisisLinesData';

const SORTED_CRISIS_LINES = [...CRISIS_LINES].sort((a, b) => a.countryName.localeCompare(b.countryName));

export function CountryCrisisLines() {
  const { isSkyMode } = useWellness();
  const [countryCode, setCountryCode] = useState('US');

  const selected = CRISIS_LINES.find(c => c.countryCode === countryCode);

  return (
    <div className={`rounded-3xl p-6 sm:p-8 space-y-5 transition-all border-none ${isSkyMode ? 'bg-cream-100' : 'bg-midnight-800'}`}>
      <div className="flex items-center gap-2">
        <Globe2 className={`w-5 h-5 ${isSkyMode ? 'text-bluey-600' : 'text-seafoam-400'}`} />
        <h3 className={`font-display text-xl font-bold ${isSkyMode ? 'text-bluey-950' : 'text-white'}`}>
          Crisis Support by Country
        </h3>
      </div>
      <p className={`text-xs sm:text-sm font-medium ${isSkyMode ? 'text-bluey-700' : 'text-midnight-muted'}`}>
        If you or someone you know is in immediate danger, please contact local emergency services right away. These are free, confidential helplines for when you need to talk.
      </p>

      <select
        value={countryCode}
        onChange={e => setCountryCode(e.target.value)}
        className={`w-full sm:w-64 px-4 py-2.5 rounded-xl text-sm font-medium border-none outline-none focus:ring-2 focus:ring-seafoam-500 ${isSkyMode ? 'bg-white text-bluey-950' : 'bg-midnight-900 text-midnight-text'}`}
      >
        {SORTED_CRISIS_LINES.map(c => (
          <option key={c.countryCode} value={c.countryCode}>{c.countryName}</option>
        ))}
      </select>

      <div className="space-y-2.5">
        {selected.lines.map((line, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-none ${isSkyMode ? 'bg-white' : 'bg-midnight-900'}`}
          >
            <div>
              <div className={`font-bold text-sm ${isSkyMode ? 'text-bluey-950' : 'text-midnight-text'}`}>{line.name}</div>
              {(line.hours || line.note) && (
                <div className={`text-[11px] font-medium mt-0.5 ${isSkyMode ? 'text-bluey-600' : 'text-midnight-muted'}`}>
                  {[line.hours, line.note].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm font-bold">
              {line.phone && (
                <a
                  href={`tel:${line.phone.replace(/\s+/g, '')}`}
                  className={`flex items-center gap-1.5 transition-colors ${isSkyMode ? 'text-bluey-600 hover:text-bluey-900' : 'text-seafoam-400 hover:text-seafoam-300'}`}
                >
                  <Phone className="w-3.5 h-3.5" /> {line.phone}
                </a>
              )}
              {line.text && (
                <span className={`flex items-center gap-1.5 ${isSkyMode ? 'text-bluey-600' : 'text-seafoam-400'}`}>
                  <MessageSquare className="w-3.5 h-3.5" /> Text {line.text}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://findahelpline.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xs font-semibold flex items-center gap-1.5 hover:underline w-fit ${isSkyMode ? 'text-bluey-600' : 'text-midnight-muted'}`}
      >
        Don't see your country? Find more helplines at Find A Helpline
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

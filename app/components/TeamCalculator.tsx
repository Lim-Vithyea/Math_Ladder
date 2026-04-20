'use client';

/**
 * TeamCalculator.tsx
 * The calculator panel shown on each side (red / blue).
 * Displays: team header, current question, answer input, and numpad.
 */

import React from 'react';
import { Button } from 'antd';
import type { Question } from '../utils/gameUtils';
import type { Translations } from '../i18n/translations';

// ── Number-pad layout ─────────────────────────────────────────────
const PAD_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['0'],
];

// ── Props ─────────────────────────────────────────────────────────
interface Props {
  team: 'red' | 'blue';
  teamName: string;
  emoji: string;
  score: number;
  totalSteps: number;
  question: Question;
  input: string;
  feedback: 'correct' | 'wrong' | null;
  disabled: boolean;
  t: Translations;           // ← active language translations
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

// ── Theme maps ────────────────────────────────────────────────────
const THEMES = {
  red: {
    header: 'from-red-500 to-orange-400',
    border: 'border-red-400',
    body: 'bg-red-50',
    accent: '#ef4444',
    text: 'text-red-600',
  },
  blue: {
    header: 'from-blue-500 to-cyan-400',
    border: 'border-blue-400',
    body: 'bg-blue-50',
    accent: '#3b82f6',
    text: 'text-blue-600',
  },
};

export default function TeamCalculator({
  team, teamName, emoji, score, totalSteps, question,
  input, feedback, disabled, t, onDigit, onBackspace, onSubmit,
}: Props) {
  const theme = THEMES[team];

  // Feedback ring colour for the question box
  const feedbackRing =
    feedback === 'correct' ? 'bg-green-100 ring-4 ring-green-400' :
      feedback === 'wrong' ? 'bg-red-100 ring-4 ring-red-400 animate-shake' :
        'bg-white';

  return (
    <div className={`w-128 rounded-3xl overflow-hidden shadow-2xl border-4 ${theme.border}`}>

      {/* ── Team Header ──────────────────────────────────────── */}
      <div className={`bg-gradient-to-br ${theme.header} p-4 text-center`}>
        {/* Sprite */}
        <div className="text-5xl mb-1 drop-shadow">{emoji}</div>
        <h2 className="text-white font-black text-xl mb-2">{teamName}</h2>

        {/* Step progress dots */}
        <div className="flex justify-center flex-wrap gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 border-white/60 transition-all duration-300 ${i < score ? 'bg-white scale-110' : 'bg-white/30'
                }`}
            />
          ))}
        </div>
        <p className="text-white/90 text-sm font-bold mt-2">
          {t.stepProgress(score, totalSteps)}
        </p>
      </div>

      {/* ── Calculator Body ───────────────────────────────────── */}
      <div className={`${theme.body} p-4 space-y-3`}>

        {/* Question + answer display */}
        <div className={`rounded-2xl p-3 text-center transition-all duration-200 ${feedbackRing}`}>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            {t.solveIt}
          </p>
          <p className={`text-2xl font-black ${theme.text}`}>{question.text}</p>

          {/* Answer box */}
          <div className="mt-2 bg-gray-100 rounded-xl py-2 px-4 text-3xl font-black text-gray-800 min-h-[48px] flex items-center justify-center">
            {input ? input : <span className="text-gray-300 text-2xl">{t.placeholder}</span>}
          </div>

          {/* Feedback label */}
          {feedback && (
            <div className="mt-2 text-xl font-black animate-bounce-in">
              {feedback === 'correct' ? t.feedbackCorrect : t.feedbackWrong}
            </div>
          )}
        </div>

        {/* Number pad */}
        <div className="space-y-2">
          {PAD_ROWS.map((row, ri) => (
            <div key={ri} className={`grid gap-2 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
              {row.map(digit => (
                <Button
                  key={digit}
                  onClick={() => onDigit(digit)}
                  disabled={disabled}
                  className="h-12 text-xl font-black rounded-xl transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: 'white', color: theme.accent, borderColor: theme.accent, borderWidth: 2 }}
                >
                  {digit}
                </Button>
              ))}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onBackspace}
            disabled={disabled || !input}
            className="h-12 text-lg font-black rounded-xl"
            style={{ backgroundColor: '#f59e0b', borderColor: '#d97706', color: 'white' }}
          >
            {t.btnBack}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={disabled || !input}
            className="h-12 text-lg font-black rounded-xl"
            style={{ backgroundColor: theme.accent, borderColor: theme.accent, color: 'white' }}
          >
            {t.btnGo}
          </Button>
        </div>

      </div>
    </div>
  );
}

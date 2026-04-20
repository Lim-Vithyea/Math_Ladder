'use client';

/**
 * TeamCalculator.tsx
 * The calculator panel shown on each side (red / blue).
 * Displays: team header, current question, answer input, and numpad or multiple choice.
 */

import React from 'react';
import { Button } from 'antd';
import type { Question } from '../utils/gameUtils';
import type { Translations } from '../i18n/translations';
import MultipleChoice from './MultipleChoice';

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
  gameMode?: 'calculator' | 'choices';
  hideProgress?: boolean;
  t: Translations;           // ← active language translations
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: (choice?: number) => void;
}

// ── Theme maps ────────────────────────────────────────────────────
const THEMES = {
  red: {
    header: 'from-red-500 to-orange-400',
    border: 'border-red-400',
    body: 'bg-red-50',
    accent: '#ef4444',
    text: 'text-red-600',
    hover: 'hover:bg-red-100',
  },
  blue: {
    header: 'from-blue-500 to-cyan-400',
    border: 'border-blue-400',
    body: 'bg-blue-50',
    accent: '#3b82f6',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-100',
  },
};

export default function TeamCalculator({
  team, teamName, emoji, score, totalSteps, question,
  input, feedback, disabled, gameMode = 'calculator', 
  hideProgress = false, t, onDigit, onBackspace, onSubmit,
}: Props) {
  const theme = THEMES[team];

  // Feedback ring colour for the question box
  const feedbackRing =
    feedback === 'correct' ? 'bg-green-100 ring-4 ring-green-400' :
      feedback === 'wrong' ? 'bg-red-100 ring-4 ring-red-400 animate-shake' :
        'bg-white';

  return (
    <div className={`w-100 rounded-3xl overflow-hidden shadow-2xl border-4 ${theme.border}`}>

      {/* ── Team Header ──────────────────────────────────────── */}
      <div className={`bg-gradient-to-br ${theme.header} p-4 text-center`}>
        {/* Sprite */}
        <div className="text-5xl mb-1 drop-shadow">{emoji}</div>
        <h2 className="text-white font-black text-xl mb-2">{teamName}</h2>

        {!hideProgress && (
          <>
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
          </>
        )}
      </div>

      {/* ── Calculator Body ───────────────────────────────────── */}
      <div className={`${theme.body} p-4 space-y-3`}>

        {/* Question + answer display */}
        <div className={`rounded-2xl p-1 text-center transition-all duration-200 ${feedbackRing}`}>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            {t.solveIt}
          </p>
          {/* Question & Answer Inline */}
          <div className=" bg-gray-50 rounded-xl px-1 text-3xl font-black min-h-[50px] flex items-center justify-center gap-3 border-2 border-gray-200 shadow-inner">
            <span className={`${theme.text} opacity-90`}>{question.text.replace('?', '')}</span>
            <span className="text-gray-800 min-w-[60px] text-center border-b-4 border-dashed border-gray-300 pb-1">
              {input ? input : <span className="text-transparent">_</span>}
            </span>
          </div>

          {/* Feedback label */}
          {feedback && (
            <div className="mt-2 text-xl font-black animate-bounce-in">
              {feedback === 'correct' ? t.feedbackCorrect : t.feedbackWrong}
            </div>
          )}
        </div>

        {gameMode === 'calculator' ? (
          <>
            {/* Number pad */}
            <div className="space-y-3">
              {PAD_ROWS.map((row, ri) => (
                <div key={ri} className={`grid gap-2 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
                  {row.map(digit => (
                    <Button
                      key={digit}
                      onClick={() => onDigit(digit)}
                      disabled={disabled}
                      className="h-24 sm:h-28 rounded-xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
                      style={{ backgroundColor: 'white', color: theme.accent, borderColor: theme.accent, borderWidth: 2 }}
                    >
                      <span className='text-2xl font-black'>{digit}</span>
                    </Button>
                  ))}
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                onClick={onBackspace}
                disabled={disabled || !input}
                className="h-20 sm:h-24 text-3xl font-black rounded-3xl"
                style={{ backgroundColor: '#f59e0b', borderColor: '#d97706', color: 'white', borderWidth: 4 }}
              >
                {t.btnBack}
              </Button>
              <Button
                onClick={() => onSubmit()}
                disabled={disabled || !input}
                className="h-20 sm:h-24 text-3xl font-black rounded-3xl"
                style={{ backgroundColor: theme.accent, borderColor: theme.accent, color: 'white', borderWidth: 4 }}
              >
                {t.btnGo}
              </Button>
            </div>
          </>
        ) : (
          <MultipleChoice
            options={question.choices || []}
            onSelect={onSubmit}
            disabled={disabled}
            feedbackActive={!!feedback}
            accentColor={theme.accent}
            hoverClass={theme.hover}
          />
        )}

      </div>
    </div>
  );
}

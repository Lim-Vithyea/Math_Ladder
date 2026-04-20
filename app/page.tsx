'use client';

/**
 * page.tsx — Math Ladder Race 🧮
 *
 * Game Rules:
 *   - Red team (🦊 Fox) vs Blue team (🐧 Penguin)
 *   - Each team gets a math question on their own calculator
 *   - Submit the correct answer → character climbs 1 step up the ladder
 *   - First team to reach step 10 wins!
 *
 * State is kept here; child components are purely presentational.
 */

import React, { useState, useCallback } from 'react';
import { ConfigProvider, App, Button } from 'antd';

import TeamCalculator from './components/TeamCalculator';
import LadderScene from './components/LadderScene';
import WinnerModal from './components/WinnerModal';
import MathParticles from './components/MathParticles';
import { generateQuestion, type Question } from './utils/gameUtils';
import { TRANSLATIONS, type Lang } from './i18n/translations';

// ── Constants ─────────────────────────────────────────────────────
const TOTAL_STEPS = 10; // steps to reach the top

// ── Types ─────────────────────────────────────────────────────────
type Team = 'red' | 'blue';

interface TeamState {
  score: number;                      // 0 – TOTAL_STEPS
  question: Question;                    // active math problem
  input: string;                      // digits typed so far
  feedback: 'correct' | 'wrong' | null; // feedback after submit
}

// ── Helpers ───────────────────────────────────────────────────────
function freshTeam(): TeamState {
  return { score: 0, question: generateQuestion(), input: '', feedback: null };
}

// ── Component ─────────────────────────────────────────────────────
export default function GamePage() {
  const [red, setRed] = useState<TeamState>(freshTeam);
  const [blue, setBlue] = useState<TeamState>(freshTeam);
  const [winner, setWinner] = useState<Team | null>(null);

  // ── Language toggle ────────────────────────────────────────────
  const [lang, setLang] = useState<Lang>('en');
  const t = TRANSLATIONS[lang]; // shorthand for current translations

  // Shorthand: pick the right setter
  const setter = (team: Team) => team === 'red' ? setRed : setBlue;

  // ── Digit pressed ──────────────────────────────────────────────
  const handleDigit = useCallback((team: Team, digit: string) => {
    if (winner) return;
    setter(team)(s => ({
      ...s,
      input: s.input.length < 3 ? s.input + digit : s.input,
    }));
  }, [winner]);

  // ── Backspace pressed ──────────────────────────────────────────
  const handleBackspace = useCallback((team: Team) => {
    if (winner) return;
    setter(team)(s => ({ ...s, input: s.input.slice(0, -1) }));
  }, [winner]);

  // ── Submit answer ──────────────────────────────────────────────
  const handleSubmit = useCallback((team: Team) => {
    if (winner) return;

    setter(team)(s => {
      const userAnswer = parseInt(s.input, 10);
      const correct = !isNaN(userAnswer) && userAnswer === s.question.answer;

      if (correct) {
        const newScore = s.score + 1;
        const won = newScore >= TOTAL_STEPS;
        if (won) setWinner(team);
        return {
          ...s,
          score: newScore,
          question: won ? s.question : generateQuestion(),
          input: '',
          feedback: 'correct',
        };
      } else {
        return { ...s, input: '', feedback: 'wrong' };
      }
    });

    // Clear feedback after 700ms
    setTimeout(() => {
      setter(team)(s => ({ ...s, feedback: null }));
    }, 700);
  }, [winner]);

  // ── Reset game ─────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setRed(freshTeam());
    setBlue(freshTeam());
    setWinner(null);
  }, []);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <ConfigProvider theme={{ token: { fontFamily: 'inherit' } }}>
      <App>
        <MathParticles />
        <div
          className="min-h-screen flex flex-col relative bg-transparent"
          style={{ zIndex: 1 }}
        >
          <header className="text-center py-8 px-4 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={() => setLang('en')}
                style={{
                  fontWeight: 800,
                  borderRadius: 12,
                  borderWidth: 2,
                  backgroundColor: lang === 'en' ? '#3b82f6' : 'white',
                  borderColor: lang === 'en' ? '#3b82f6' : '#93c5fd',
                  color: lang === 'en' ? 'white' : '#3b82f6',
                  minWidth: 56,
                }}
              >
                EN
              </Button>
              <Button
                onClick={() => setLang('km')}
                style={{
                  fontWeight: 800,
                  borderRadius: 12,
                  borderWidth: 2,
                  backgroundColor: lang === 'km' ? '#7c3aed' : 'white',
                  borderColor: lang === 'km' ? '#7c3aed' : '#c4b5fd',
                  color: lang === 'km' ? 'white' : '#7c3aed',
                  minWidth: 56,
                }}
              >
                ខ្មែរ
              </Button>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black select-none text-gray-800">
              {t.title}
            </h1>
            <p className="text-gray-600 font-bold text-base lg:text-lg mt-2">
              {t.subtitle}
            </p>
            <p className="text-gray-400 text-sm mt-1 font-semibold">{t.hint}</p>
          </header>

          <main className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 xl:gap-16 px-4 pb-10 flex-1 w-full max-w-7xl mx-auto">

            {/* Central ladder (Mobile: Top, Desktop: Middle) */}
            <div className="order-1 xl:order-2 shrink-0 transform scale-90 sm:scale-100 origin-top">
              <LadderScene
                redScore={red.score}
                blueScore={blue.score}
                totalSteps={TOTAL_STEPS}
              />
            </div>

            {/* Red team (Mobile: Middle, Desktop: Left) */}
            <div className="order-2 xl:order-1 w-full max-w-[500px]">
              <TeamCalculator
                team="red"
                teamName={t.foxTeam}
                emoji="🦊"
                score={red.score}
                totalSteps={TOTAL_STEPS}
                question={red.question}
                input={red.input}
                feedback={red.feedback}
                disabled={!!winner}
                t={t}
                onDigit={(d) => handleDigit('red', d)}
                onBackspace={() => handleBackspace('red')}
                onSubmit={() => handleSubmit('red')}
              />
            </div>

            {/* Blue team (Mobile: Bottom, Desktop: Right) */}
            <div className="order-3 xl:order-3 w-full max-w-[500px]">
              <TeamCalculator
                team="blue"
                teamName={t.penguinTeam}
                emoji="🐧"
                score={blue.score}
                totalSteps={TOTAL_STEPS}
                question={blue.question}
                input={blue.input}
                feedback={blue.feedback}
                disabled={!!winner}
                t={t}
                onDigit={(d) => handleDigit('blue', d)}
                onBackspace={() => handleBackspace('blue')}
                onSubmit={() => handleSubmit('blue')}
              />
            </div>

          </main>
        </div>

        {/* Winner overlay */}
        {winner && (
          <WinnerModal
            winner={winner}
            winnerName={winner === 'red' ? t.foxTeam : t.penguinTeam}
            t={t}
            onReset={handleReset}
          />
        )}
      </App>
    </ConfigProvider>
  );
}

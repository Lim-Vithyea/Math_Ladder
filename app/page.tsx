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
import BackgroundMusic from './components/BackgroundMusic';
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
        // Decrease score by 1 if wrong, but don't go below 0
        const newScore = Math.max(0, s.score - 1);
        return { ...s, score: newScore, input: '', feedback: 'wrong' };
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
            <div className=" absolute top-4 right-4 flex gap-2">
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
              <BackgroundMusic t={t} />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent inline-block select-none py-2 leading-normal">
              {t.title}
            </h1>
            <p className="text-gray-600 font-bold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent select-none py-2 leading-normal text-base lg:text-lg">
              {t.subtitle}
            </p>
            <p className="text-gray-400 text-sm mt-1 font-semibold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent select-none py-2 leading-normal">{t.hint}</p>
          </header>

          <main className="flex flex-col landscape:flex-row md:flex-row items-center md:items-start justify-center gap-6 md:gap-9 px-2 flex-1 w-full max-w-[1400px] mx-auto">

            {/* Central ladder (Mobile Portrait: Top, Landscape/Desktop: Middle) */}
            <div className="order-1 landscape:order-2 md:order-2 shrink-0 transform scale-75 landscape:scale-[0.6] md:scale-100 lg:scale-[1] origin-top md:origin-center">
              <LadderScene
                redScore={red.score}
                blueScore={blue.score}
                totalSteps={TOTAL_STEPS}
              />
            </div>

            {/* Red team (Mobile Portrait: Middle, Landscape/Desktop: Left) */}
            <div className="order-2 landscape:order-1 md:order-1 w-full landscape:w-auto md:w-auto flex-1 max-w-[500px] min-w-[280px]">
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

            {/* Blue team (Mobile Portrait: Bottom, Landscape/Desktop: Right) */}
            <div className="order-3 landscape:order-3 md:order-3 w-full landscape:w-auto md:w-auto flex-1 max-w-[500px] min-w-[280px]">
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

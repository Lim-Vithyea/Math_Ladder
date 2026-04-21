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
import { ConfigProvider, App, Button, theme } from 'antd';

import TeamCalculator from '../components/TeamCalculator';
import LadderScene from '../components/LadderScene';
import WinnerModal from '../components/WinnerModal';
import MathParticles from '../components/MathParticles';
import GameSidebar from '../components/GameSidebar';
import { generateQuestion, type Question, type Difficulty, type QuestionType } from '../utils/gameUtils';
import { TRANSLATIONS, type Lang } from '../i18n/translations';
import { useSettings } from '../context/SettingsContext';

// ── Constants ─────────────────────────────────────────────────────
const TOTAL_STEPS = 15; // steps to reach the top

// ── Types ─────────────────────────────────────────────────────────
type Team = 'red' | 'blue';
type GameMode = 'calculator' | 'choices';

interface TeamState {
  score: number;                      // 0 – TOTAL_STEPS
  question: Question;                    // active math problem
  input: string;                      // digits typed so far
  feedback: 'correct' | 'wrong' | null; // feedback after submit
}

// ── Helpers ───────────────────────────────────────────────────────
function freshTeam(diff: Difficulty, mode: GameMode, type: QuestionType): TeamState {
  return { score: 0, question: generateQuestion(diff, mode === 'choices', type), input: '', feedback: null };
}

// ── Component ─────────────────────────────────────────────────────
export default function GamePage() {
  const {
    difficulty, setDifficulty,
    gameMode, setGameMode,
    exerciseType, setExerciseType,
    lang, setLang, t
  } = useSettings();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [red, setRed] = useState<TeamState>(() => freshTeam(difficulty, gameMode, exerciseType));
  const [blue, setBlue] = useState<TeamState>(() => freshTeam(difficulty, gameMode, exerciseType));
  const [winner, setWinner] = useState<Team | null>(null);

  // ── Difficulty Handler ─────────────────────────────────────────
  const handleDifficultyChange = (val: Difficulty) => {
    setDifficulty(val);
    setRed(freshTeam(val, gameMode, exerciseType));
    setBlue(freshTeam(val, gameMode, exerciseType));
    setWinner(null);
  };

  // ── Mode Handler ───────────────────────────────────────────────
  const handleModeChange = (val: GameMode) => {
    setGameMode(val);
    setRed(freshTeam(difficulty, val, exerciseType));
    setBlue(freshTeam(difficulty, val, exerciseType));
    setWinner(null);
  };

  // ── Exercise Type Handler ──────────────────────────────────────
  const handleExerciseTypeChange = (val: QuestionType) => {
    setExerciseType(val);
    setRed(freshTeam(difficulty, gameMode, val));
    setBlue(freshTeam(difficulty, gameMode, val));
    setWinner(null);
  };

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
  const handleSubmit = useCallback((team: Team, choice?: number) => {
    if (winner) return;

    setter(team)(s => {
      const userAnswer = choice !== undefined ? choice : parseInt(s.input, 10);
      const correct = !isNaN(userAnswer) && userAnswer === s.question.answer;

      if (correct) {
        const newScore = s.score + 1;
        const won = newScore >= TOTAL_STEPS;
        if (won) setWinner(team);
        return {
          ...s,
          score: newScore,
          question: won ? s.question : generateQuestion(difficulty, gameMode === 'choices', exerciseType),
          input: '',
          feedback: 'correct',
        };
      } else {
        // Decrease score by 1 if wrong, but don't go below 0
        const newScore = Math.max(0, s.score - 1);
        return {
          ...s,
          score: newScore,
          input: '',
          feedback: 'wrong',
        };
      }
    });

    // Clear feedback after 700ms
    setTimeout(() => {
      setter(team)(s => ({ ...s, feedback: null }));
    }, 700);
  }, [winner, difficulty, gameMode, exerciseType]);

  // ── Reset game ─────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setRed(freshTeam(difficulty, gameMode, exerciseType));
    setBlue(freshTeam(difficulty, gameMode, exerciseType));
    setWinner(null);
  }, [difficulty, gameMode, exerciseType]);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        fontFamily: 'var(--font-kantumruy), var(--font-nunito), sans-serif',
        borderRadius: 24,
      }
    }}>
      <App style={{ backgroundColor: 'transparent' }}>
        <div
          className="relative h-[calc(100vh)] w-full overflow-hidden bg-[#020617] text-white"
          style={{ fontFamily: 'var(--font-kantumruy), var(--font-nunito), sans-serif' }}
        >
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse [animation-delay:1s]" />
            <MathParticles />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <header className="text-center py-8 px-4 relative">
              <div className="absolute top-4 right-4 z-50">
                <Button
                  type="primary"
                  size="large"
                  icon={<span>⚙️</span>}
                  onClick={() => setIsSidebarOpen(true)}
                  className="shadow-lg font-black rounded-2xl h-12 bg-violet-600 border-none flex items-center gap-2 transition-transform hover:scale-110 active:scale-95"
                >
                  {t.settings}
                </Button>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent inline-block select-none py-2 leading-normal">
                {t.ladderGame}
              </h1>
              <p className="text-slate-400 font-bold max-w-2xl mx-auto">
                {t.subtitle}
              </p>
            </header>

            <GameSidebar
              open={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              lang={lang}
              setLang={setLang}
              difficulty={difficulty}
              setDifficulty={handleDifficultyChange}
              gameMode={gameMode}
              setGameMode={handleModeChange}
              exerciseType={exerciseType}
              setExerciseType={handleExerciseTypeChange}
              onReset={handleReset}
              t={t}
            />

            <main className="flex flex-col landscape:flex-row md:flex-row items-center md:items-start justify-center gap-6 md:gap-9 w-full flex-1">
              {/* Central ladder */}
              <div className="order-1 landscape:order-2 md:order-2 shrink-0 transform scale-75 landscape:scale-[0.6] md:scale-90 lg:scale-100 origin-top">
                <LadderScene
                  redScore={red.score}
                  blueScore={blue.score}
                  totalSteps={TOTAL_STEPS}
                />
              </div>

              {/* Red team */}
              <div className="order-2 landscape:order-1 md:order-1 w-full landscape:w-auto md:w-auto flex-1 max-w-[500px] min-w-[280px] flex justify-center">
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
                  gameMode={gameMode}
                  t={t}
                  onDigit={(d) => handleDigit('red', d)}
                  onBackspace={() => handleBackspace('red')}
                  onSubmit={(choice) => handleSubmit('red', choice)}
                />
              </div>

              {/* Blue team */}
              <div className="order-3 landscape:order-3 md:order-3 w-full landscape:w-auto md:w-auto flex-1 max-w-[450px] min-w-[280px] flex justify-center">
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
                  gameMode={gameMode}
                  t={t}
                  onDigit={(d) => handleDigit('blue', d)}
                  onBackspace={() => handleBackspace('blue')}
                  onSubmit={(choice) => handleSubmit('blue', choice)}
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
        </div>
      </App>
    </ConfigProvider>
  );
}

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ConfigProvider, App, Button, Typography } from 'antd';

import TeamCalculator from '../components/TeamCalculator';
import WinnerModal from '../components/WinnerModal';
import MathParticles from '../components/MathParticles';
import GameSidebar from '../components/GameSidebar';
import { generateQuestion, type Question, type Difficulty, type QuestionType } from '../utils/gameUtils';
import { TRANSLATIONS, type Lang } from '../i18n/translations';

const { Title, Text } = Typography;

// ── Constants ─────────────────────────────────────────────────────
const GAME_DURATION = 60; // seconds

// ── Types ─────────────────────────────────────────────────────────
type Team = 'red' | 'blue';
type GameMode = 'calculator' | 'choices';

interface TeamState {
  score: number;
  question: Question;
  input: string;
  feedback: 'correct' | 'wrong' | null;
}

function freshTeam(diff: Difficulty, mode: GameMode, type: QuestionType): TeamState {
  return { score: 0, question: generateQuestion(diff, mode === 'choices', type), input: '', feedback: null };
}

export default function SpeedChallengePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('calculator');
  const [exerciseType, setExerciseType] = useState<QuestionType>('mixed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const t = TRANSLATIONS[lang];

  const [red, setRed] = useState<TeamState>(() => freshTeam('easy', 'calculator', 'mixed'));
  const [blue, setBlue] = useState<TeamState>(() => freshTeam('easy', 'calculator', 'mixed'));
  const [winner, setWinner] = useState<Team | 'draw' | null>(null);

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // ── Countdown Logic ───────────────────────────────────────────
  const startCountdown = () => {
    setCountdown(3);
    setWinner(null);
    setRed(freshTeam(difficulty, gameMode, exerciseType));
    setBlue(freshTeam(difficulty, gameMode, exerciseType));
    setTimeLeft(GAME_DURATION);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCountdown(null);
        setIsGameActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ── Timer Logic ────────────────────────────────────────────────
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false);
      // Determine winner
      if (red.score > blue.score) setWinner('red');
      else if (blue.score > red.score) setWinner('blue');
      else setWinner('draw');
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft, red.score, blue.score]);

  // ── Handlers ───────────────────────────────────────────────────
  const handleDifficultyChange = (val: Difficulty) => {
    setDifficulty(val);
    handleReset();
  };

  const handleModeChange = (val: GameMode) => {
    setGameMode(val);
    handleReset();
  };

  const handleExerciseTypeChange = (val: QuestionType) => {
    setExerciseType(val);
    handleReset();
  };

  const handleReset = useCallback(() => {
    setRed(freshTeam(difficulty, gameMode, exerciseType));
    setBlue(freshTeam(difficulty, gameMode, exerciseType));
    setTimeLeft(GAME_DURATION);
    setIsGameActive(false);
    setWinner(null);
    setCountdown(null);
  }, [difficulty, gameMode, exerciseType]);

  const setter = (team: Team) => team === 'red' ? setRed : setBlue;

  const handleDigit = useCallback((team: Team, digit: string) => {
    if (!isGameActive) return;
    setter(team)(s => ({
      ...s,
      input: s.input.length < 3 ? s.input + digit : s.input,
    }));
  }, [isGameActive]);

  const handleBackspace = useCallback((team: Team) => {
    if (!isGameActive) return;
    setter(team)(s => ({ ...s, input: s.input.slice(0, -1) }));
  }, [isGameActive]);

  const handleSubmit = useCallback((team: Team, choice?: number) => {
    if (!isGameActive) return;

    setter(team)(s => {
      const userAnswer = choice !== undefined ? choice : parseInt(s.input, 10);
      const correct = !isNaN(userAnswer) && userAnswer === s.question.answer;

      if (correct) {
        return {
          ...s,
          score: s.score + 1,
          question: generateQuestion(difficulty, gameMode === 'choices', exerciseType),
          input: '',
          feedback: 'correct',
        };
      } else {
        return { ...s, input: '', feedback: 'wrong' };
      }
    });

    setTimeout(() => {
      setter(team)(s => ({ ...s, feedback: null }));
    }, 600);
  }, [isGameActive, difficulty, gameMode, exerciseType]);

  return (
    <ConfigProvider theme={{ token: { fontFamily: 'inherit' } }}>
      <App>
        <MathParticles />
        <div className="min-h-screen flex flex-col relative bg-transparent" style={{ zIndex: 1 }}>

          <header className="text-center py-8 px-4 relative">
            <div className="absolute top-4 right-4 z-50">
              <Button
                type="primary"
                size="large"
                icon={<span>⚙️</span>}
                onClick={() => setIsSidebarOpen(true)}
                className="shadow-lg font-black rounded-2xl h-12 bg-violet-600 border-none flex items-center gap-2"
              >
                {t.settings}
              </Button>
            </div>

            <Title className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent inline-block mb-2">
              {t.speedGame}
            </Title>
            <p className="text-gray-500 font-bold max-w-2xl mx-auto">
              {t.speedDesc}
            </p>

            {/* Visual Timer Bar */}
            {isGameActive && (
              <div className="max-w-md mx-auto mt-6 px-4">
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                  <div
                    className={`h-full transition-all duration-1000 ${timeLeft > 30 ? 'bg-green-500' : timeLeft > 10 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                      }`}
                    style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
                  />
                </div>
              </div>
            )}




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

          <main className="flex flex-col landscape:flex-row md:flex-row items-center md:items-start justify-center gap-6 md:gap-9 px-4 pb-12 flex-1 w-full max-w-[1200px] mx-auto">

            {/* Red team */}
            <div className="w-full flex-1 max-w-[450px]">
              <div className="text-center mb-4 bg-red-100 py-2 rounded-2xl border-2 border-red-200">
                <Text className="text-3xl font-black text-red-600 uppercase tracking-widest">{t.score}: {red.score}</Text>
              </div>
              <TeamCalculator
                team="red"
                teamName={t.foxTeam}
                emoji="🦊"
                score={red.score}
                totalSteps={0}
                hideProgress
                question={red.question}
                input={red.input}
                feedback={red.feedback}
                disabled={!isGameActive}
                gameMode={gameMode}
                t={t}
                onDigit={(d) => handleDigit('red', d)}
                onBackspace={() => handleBackspace('red')}
                onSubmit={(choice) => handleSubmit('red', choice)}
              />
            </div>
            {/* timer */}
            <div className="mt-6 mb-4 h-40 flex flex-col items-center justify-center mb-4">
              {countdown !== null ? (
                <div className="flex flex-col items-center">
                  <Text className="text-2xl font-black text-violet-500 uppercase tracking-tighter mb-2 animate-pulse">
                    {countdown === 3 ? 'READY?' : countdown === 2 ? 'SET...' : 'GO!'}
                  </Text>
                  <div className="text-9xl font-black text-violet-600 animate-bounce">
                    {countdown === 0 ? '🚀' : countdown}
                  </div>
                </div>
              ) : (
                <>
                  <div className={`inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-8 transition-colors ${timeLeft <= 10 && isGameActive ? 'border-red-500 bg-red-50 animate-pulse' : 'border-orange-400 bg-orange-50'}`}>
                    <span className="text-sm font-black text-orange-600 uppercase tracking-widest">{t.timeLeft}</span>
                    <span className={`text-5xl font-black ${timeLeft <= 10 && isGameActive ? 'text-red-600' : 'text-orange-600'}`}>
                      {timeLeft}
                    </span>
                  </div>
                  {/* Mode Badge */}
                  <div className="mt-4 bg-white/80 px-4 py-1 rounded-full border-2 border-gray-200 shadow-sm mb-4">
                    <Text className="text-gray-500 font-bold">
                      {gameMode === 'calculator' ? t.modeCalculator : t.modeChoices}
                    </Text>
                  </div>
                </>
              )}
              {!isGameActive && countdown === null && !winner && (
                <Button
                  type="primary"
                  size="large"
                  onClick={startCountdown}
                  className="h-16 px-12 rounded-2xl text-2xl font-black bg-green-500 border-none shadow-xl hover:scale-105 active:scale-95 transition-transform"
                >
                  {t.start}
                </Button>
              )}
            </div>

            {/* Blue team */}
            <div className="w-full flex-1 max-w-[450px]">
              <div className="text-center mb-4 bg-blue-100 py-2 rounded-2xl border-2 border-blue-200">
                <Text className="text-3xl font-black text-blue-600 uppercase tracking-widest">{t.score}: {blue.score}</Text>
              </div>
              <TeamCalculator
                team="blue"
                teamName={t.penguinTeam}
                emoji="🐧"
                score={blue.score}
                totalSteps={0}
                hideProgress
                question={blue.question}
                input={blue.input}
                feedback={blue.feedback}
                disabled={!isGameActive}
                gameMode={gameMode}
                t={t}
                onDigit={(d) => handleDigit('blue', d)}
                onBackspace={() => handleBackspace('blue')}
                onSubmit={(choice) => handleSubmit('blue', choice)}
              />
            </div>

          </main>
        </div>

        {winner && (
          <WinnerModal
            winner={winner === 'draw' ? 'red' : winner}
            winnerName={winner === 'draw' ? "It's a Draw!" : (winner === 'red' ? t.foxTeam : t.penguinTeam)}
            t={{
              ...t,
              wins: winner === 'draw' ? '' : t.wins,
              winnerSub: `${t.finalScore}: 🦊 ${red.score} - 🐧 ${blue.score}`,
            }}
            onReset={startCountdown}
          />
        )}
      </App>
    </ConfigProvider>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import { Button, Typography } from 'antd';

import TeamCalculator from './TeamCalculator';
import TugOfWarScene from './TugOfWarScene';
import WinnerModal from './WinnerModal';
import GameSidebar from './GameSidebar';
import { generateQuestion, type Question, type Difficulty, type QuestionType } from '../utils/gameUtils';
import { useSettings } from '../context/SettingsContext';

const { Title } = Typography;

const MAX_STEPS = 10;

type Team = 'red' | 'blue';
type GameMode = 'calculator' | 'choices';

interface TeamState {
  question: Question;
  input: string;
  feedback: 'correct' | 'wrong' | null;
}

function freshTeam(diff: Difficulty, mode: GameMode, type: QuestionType): TeamState {
  return { question: generateQuestion(diff, mode === 'choices', type), input: '', feedback: null };
}

export default function TugOfWarGame() {
  const {
    difficulty, setDifficulty,
    gameMode, setGameMode,
    exerciseType, setExerciseType,
    lang, setLang, t
  } = useSettings();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [red, setRed] = useState<TeamState>(() => freshTeam(difficulty, gameMode, exerciseType));
  const [blue, setBlue] = useState<TeamState>(() => freshTeam(difficulty, gameMode, exerciseType));
  const [ropePosition, setRopePosition] = useState(0); // -MAX_STEPS to MAX_STEPS
  const [winner, setWinner] = useState<Team | null>(null);

  const handleDifficultyChange = (val: Difficulty) => {
    setDifficulty(val);
    handleResetWithParams(val, gameMode, exerciseType);
  };

  const handleModeChange = (val: GameMode) => {
    setGameMode(val);
    handleResetWithParams(difficulty, val, exerciseType);
  };

  const handleExerciseTypeChange = (val: QuestionType) => {
    setExerciseType(val);
    handleResetWithParams(difficulty, gameMode, val);
  };

  const handleResetWithParams = (diff: Difficulty, mode: GameMode, type: QuestionType) => {
    setRed(freshTeam(diff, mode, type));
    setBlue(freshTeam(diff, mode, type));
    setRopePosition(0);
    setWinner(null);
    setIsGameStarted(false);
  };

  const handleReset = useCallback(() => {
    handleResetWithParams(difficulty, gameMode, exerciseType);
  }, [difficulty, gameMode, exerciseType]);

  const setter = (team: Team) => team === 'red' ? setRed : setBlue;

  const handleDigit = useCallback((team: Team, digit: string) => {
    if (winner || !isGameStarted) return;
    setter(team)(s => ({
      ...s,
      input: s.input.length < 3 ? s.input + digit : s.input,
    }));
  }, [winner, isGameStarted]);

  const handleBackspace = useCallback((team: Team) => {
    if (winner || !isGameStarted) return;
    setter(team)(s => ({ ...s, input: s.input.slice(0, -1) }));
  }, [winner, isGameStarted]);

  const handleSubmit = useCallback((team: Team, choice?: number) => {
    if (winner || !isGameStarted) return;

    setter(team)(s => {
      const userAnswer = choice !== undefined ? choice : parseInt(s.input, 10);
      const correct = userAnswer === s.question.answer;

      if (correct) {
        setRopePosition(prev => {
          const move = team === 'red' ? -1 : 1;
          const next = prev + move;
          if (next <= -MAX_STEPS) setWinner('red');
          if (next >= MAX_STEPS) setWinner('blue');
          return Math.max(-MAX_STEPS, Math.min(MAX_STEPS, next));
        });
        return {
          ...s,
          question: generateQuestion(difficulty, gameMode === 'choices', exerciseType),
          input: '',
          feedback: 'correct',
        };
      } else {
        setRopePosition(prev => {
          // Penalize by moving rope away from team
          const move = team === 'red' ? 1 : -1;
          const next = prev + move;
          return Math.max(-MAX_STEPS, Math.min(MAX_STEPS, next));
        });
        return { ...s, input: '', feedback: 'wrong' };
      }
    });

    setTimeout(() => {
      setter(team)(s => ({ ...s, feedback: null }));
    }, 700);
  }, [winner, difficulty, gameMode, exerciseType, isGameStarted]);

  return (
    <div className="w-full flex-1 flex flex-col">
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

        {!isGameStarted && (
          <>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent inline-block select-none py-2 leading-normal">
              {t.tugGame}
            </h1>
            <p className="text-slate-400 font-bold max-w-2xl mx-auto">
              {t.tugSubtitle}
            </p>
          </>
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

      <div className="flex flex-col items-center">
        {!isGameStarted && !winner && (
          <div className="py-2">
            <Button
              type="primary"
              size="large"
              onClick={() => setIsGameStarted(true)}
              className="h-20 px-16 rounded-3xl text-3xl font-black bg-emerald-600 hover:bg-emerald-500 border-none shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all animate-bounce"
            >
              {t.start}
            </Button>
          </div>
        )}

        {isGameStarted && (
          <div className='w-full flex justify-center items-center py-4'>
            <div className="w-full flex justify-center transform md:scale-100 origin-center px-4">
              <TugOfWarScene ropePosition={ropePosition} maxSteps={MAX_STEPS} />
            </div>
          </div>
        )}
      </div>

      <main className="flex items-center justify-center flex-1 w-full max-w-[1400px] mx-auto pb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-70 w-full px-4">
          <div className="w-full flex justify-center max-w-[500px]">
            <TeamCalculator
              team="red"
              teamName={t.foxTeam}
              emoji="🦊"
              score={Math.abs(Math.min(0, ropePosition))}
              totalSteps={MAX_STEPS}
              question={red.question}
              input={red.input}
              feedback={red.feedback}
              disabled={!!winner || !isGameStarted}
              gameMode={gameMode}
              t={t}
              onDigit={(d) => handleDigit('red', d)}
              onBackspace={() => handleBackspace('red')}
              onSubmit={(choice) => handleSubmit('red', choice)}
            />
          </div>
          <div className="w-full flex justify-center max-w-[500px]">
            <TeamCalculator
              team="blue"
              teamName={t.penguinTeam}
              emoji="🐧"
              score={Math.abs(Math.max(0, ropePosition))}
              totalSteps={MAX_STEPS}
              question={blue.question}
              input={blue.input}
              feedback={blue.feedback}
              disabled={!!winner || !isGameStarted}
              gameMode={gameMode}
              t={t}
              onDigit={(d) => handleDigit('blue', d)}
              onBackspace={() => handleBackspace('blue')}
              onSubmit={(choice) => handleSubmit('blue', choice)}
            />
          </div>
        </div>
      </main>

      {winner && (
        <WinnerModal
          winner={winner}
          winnerName={winner === 'red' ? t.foxTeam : t.penguinTeam}
          t={t}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

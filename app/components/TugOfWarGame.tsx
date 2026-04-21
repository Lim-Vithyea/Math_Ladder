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
  };

  const handleReset = useCallback(() => {
    handleResetWithParams(difficulty, gameMode, exerciseType);
  }, [difficulty, gameMode, exerciseType]);

  const setter = (team: Team) => team === 'red' ? setRed : setBlue;

  const handleDigit = useCallback((team: Team, digit: string) => {
    if (winner) return;
    setter(team)(s => ({
      ...s,
      input: s.input.length < 3 ? s.input + digit : s.input,
    }));
  }, [winner]);

  const handleBackspace = useCallback((team: Team) => {
    if (winner) return;
    setter(team)(s => ({ ...s, input: s.input.slice(0, -1) }));
  }, [winner]);

  const handleSubmit = useCallback((team: Team, choice?: number) => {
    if (winner) return;

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
  }, [winner, difficulty, gameMode, exerciseType]);

  return (
    <div className="w-full">
      <header className="text-center py-4 relative">
        <div className="absolute top-0 right-0">
          <Button
            type="primary"
            icon={<span>⚙️</span>}
            onClick={() => setIsSidebarOpen(true)}
            className="shadow-lg font-black rounded-2xl bg-violet-600 border-none flex items-center gap-2"
          >
            {t.settings}
          </Button>
        </div>

        <Title className="text-4xl font-black bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent inline-block mb-1">
          {t.tugGame}
        </Title>
        <p className="text-gray-500 font-bold mb-1">{t.tugSubtitle}</p>
        <p className="text-gray-400 text-sm font-semibold">{t.tugHint}</p>
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
      <div className=' flex justify-center items-center'>
        <div className="w-full flex justify-center transform md:scale-100 origin-center">
          <TugOfWarScene ropePosition={ropePosition} maxSteps={MAX_STEPS} />
        </div>
      </div>
      <main className="flex items-center justify-center px-2 flex-1 w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
          <div className="w-full flex justify-center">
            <TeamCalculator
              team="red"
              teamName={t.foxTeam}
              emoji="🦊"
              score={Math.abs(Math.min(0, ropePosition))}
              totalSteps={MAX_STEPS}
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
          <div className="w-full flex justify-center">
            <TeamCalculator
              team="blue"
              teamName={t.penguinTeam}
              emoji="🐧"
              score={Math.abs(Math.max(0, ropePosition))}
              totalSteps={MAX_STEPS}
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

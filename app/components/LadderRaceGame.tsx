'use client';

import React, { useState, useCallback } from 'react';
import { Button, Typography } from 'antd';

import TeamCalculator from './TeamCalculator';
import LadderScene from './LadderScene';
import WinnerModal from './WinnerModal';
import GameSidebar from './GameSidebar';
import { generateQuestion, type Question, type Difficulty, type QuestionType } from '../utils/gameUtils';
import { TRANSLATIONS, type Lang } from '../i18n/translations';

const { Title, Text } = Typography;

const TOTAL_STEPS = 10;

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

export default function LadderRaceGame({ lang, t }: { lang: Lang, t: any }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('calculator');
  const [exerciseType, setExerciseType] = useState<QuestionType>('mixed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [red, setRed] = useState<TeamState>(() => freshTeam('easy', 'calculator', 'mixed'));
  const [blue, setBlue] = useState<TeamState>(() => freshTeam('easy', 'calculator', 'mixed'));
  const [winner, setWinner] = useState<Team | null>(null);

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
    setWinner(null);
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
        const newScore = Math.max(0, s.score - 1);
        return { ...s, score: newScore, input: '', feedback: 'wrong' };
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
          {t.title}
        </Title>
        <p className="text-gray-500 font-bold mb-1">{t.subtitle}</p>
        <p className="text-gray-400 text-sm font-semibold">{t.hint}</p>
      </header>

      <GameSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        lang={lang}
        setLang={() => {}}
        difficulty={difficulty}
        setDifficulty={handleDifficultyChange}
        gameMode={gameMode}
        setGameMode={handleModeChange}
        exerciseType={exerciseType}
        setExerciseType={handleExerciseTypeChange}
        onReset={handleReset}
        t={t}
      />

      <main className="flex flex-col landscape:flex-row md:flex-row items-center md:items-start justify-center gap-6 md:gap-9 px-2 flex-1 w-full max-w-[1400px] mx-auto">
        <div className="order-1 landscape:order-2 md:order-2 shrink-0 transform scale-75 landscape:scale-[0.6] md:scale-100 origin-top">
          <LadderScene redScore={red.score} blueScore={blue.score} totalSteps={TOTAL_STEPS} />
        </div>

        <div className="order-2 landscape:order-1 md:order-1 w-full landscape:w-auto md:w-auto flex-1 max-w-[500px]">
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

        <div className="order-3 landscape:order-3 md:order-3 w-full landscape:w-auto md:w-auto flex-1 max-w-[500px]">
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

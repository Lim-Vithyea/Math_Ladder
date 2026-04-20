'use client';

import React from 'react';
import { Drawer, Button, Space, Select, Typography, Divider } from 'antd';
import { Difficulty, QuestionType } from '../utils/gameUtils';
import { Lang, Translations } from '../i18n/translations';
import BackgroundMusic from './BackgroundMusic';
import Link from 'next/link';

const { Title, Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  gameMode: 'calculator' | 'choices';
  setGameMode: (mode: 'calculator' | 'choices') => void;
  exerciseType: QuestionType;
  setExerciseType: (type: QuestionType) => void;
  onReset: () => void;
  t: Translations;
}

export default function GameSidebar({
  open, onClose, lang, setLang, difficulty, setDifficulty,
  gameMode, setGameMode, exerciseType, setExerciseType, onReset, t
}: Props) {
  return (
    <Drawer
      title={<Title level={4} style={{ margin: 0 }}>{t.settings}</Title>}
      placement="right"
      onClose={onClose}
      open={open}
      width={320}
      styles={{ body: { padding: '24px' } }}
    >
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        
        {/* Language */}
        <section>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>🌍 Language / ភាសា</Text>
          <Select
            value={lang}
            onChange={setLang}
            style={{ width: '100%' }}
            options={[
              { value: 'en', label: '🇬🇧 English' },
              { value: 'km', label: '🇰🇭 ខ្មែរ' },
            ]}
          />
        </section>

        <Divider style={{ margin: '12px 0' }} />

        {/* Game Navigation */}
        <section>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>🚀 {t.menuTitle.split('!')[0]}</Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Link href="/ladder-race" style={{ width: '100%' }}>
              <Button 
                block 
                style={{ 
                  textAlign: 'left', 
                  height: 40, 
                  borderRadius: 8,
                  borderColor: '#8b5cf6',
                  color: '#6d28d9',
                  fontWeight: 600
                }}
              >
                🪜 {t.ladderGame}
              </Button>
            </Link>
            <Link href="/speed-challenge" style={{ width: '100%' }}>
              <Button 
                block 
                style={{ 
                  textAlign: 'left', 
                  height: 40, 
                  borderRadius: 8,
                  borderColor: '#f59e0b',
                  color: '#d97706',
                  fontWeight: 600
                }}
              >
                ⏱️ {t.speedGame}
              </Button>
            </Link>
          </Space>
        </section>

        <Divider style={{ margin: '12px 0' }} />

        {/* Exercise Type */}
        <section>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>📚 {t.exerciseType}</Text>
          <Select
            value={exerciseType}
            onChange={setExerciseType}
            style={{ width: '100%' }}
            options={[
              { value: 'mixed', label: t.typeMixed },
              { value: 'addition', label: t.typeAddition },
              { value: 'subtraction', label: t.typeSubtraction },
              { value: 'multiplication', label: t.typeMultiplication },
              { value: 'division', label: t.typeDivision },
            ]}
          />
        </section>

        <Divider style={{ margin: '12px 0' }} />

        {/* Difficulty */}
        <section>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>🔥 {t.gameMode} - {t.diffEasy}/{t.diffHard}</Text>
          <Select
            value={difficulty}
            onChange={setDifficulty}
            style={{ width: '100%' }}
            options={[
              { value: 'easy', label: t.diffEasy },
              { value: 'medium', label: t.diffMedium },
              { value: 'hard', label: t.diffHard },
            ]}
          />
        </section>

        <Divider style={{ margin: '12px 0' }} />

        {/* Game Mode */}
        <section>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>🎮 {t.gameMode}</Text>
          <Select
            value={gameMode}
            onChange={setGameMode}
            style={{ width: '100%' }}
            options={[
              { value: 'calculator', label: t.modeCalculator },
              { value: 'choices', label: t.modeChoices },
            ]}
          />
        </section>

        <Divider style={{ margin: '12px 0' }} />

        {/* Sound */}
        <section>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>🎵 Sound</Text>
          <BackgroundMusic t={t} />
        </section>

        <Divider style={{ margin: '24px 0 12px 0' }} />

        {/* Reset */}
        <Button 
          danger 
          type="primary" 
          block 
          size="large" 
          onClick={() => {
            onReset();
            onClose();
          }}
          style={{ fontWeight: 800, borderRadius: 12, height: 50, marginBottom: 12 }}
        >
          {t.resetGame}
        </Button>

        {/* Back to Menu */}
        <Link href="/">
          <Button 
            block 
            size="large" 
            style={{ fontWeight: 800, borderRadius: 12, height: 50, borderColor: '#6b7280', color: '#374151' }}
          >
            {t.backToMenu}
          </Button>
        </Link>

      </Space>
    </Drawer>
  );
}

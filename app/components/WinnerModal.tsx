'use client';

/**
 * WinnerModal.tsx
 * Full-screen celebration when a team wins.
 */

import React from 'react';
import { Modal, Button } from 'antd';
import type { Translations } from '../i18n/translations';

interface Props {
  winner: 'red' | 'blue';
  winnerName: string;      // already-translated team name
  t: Translations;         // active language translations
  onReset: () => void;
}

const WINNER_INFO = {
  red:  { emoji: '🦊', name: 'Fox Team',    bg: '#fee2e2', color: '#dc2626' },
  blue: { emoji: '🐧', name: 'Penguin Team', bg: '#dbeafe', color: '#2563eb' },
};

export default function WinnerModal({ winner, winnerName, t, onReset }: Props) {
  const info = WINNER_INFO[winner]; // colours + emoji for this team

  return (
    <Modal
      open
      footer={null}
      closable={false}
      centered
      width={420}
      styles={{ body: { padding: 0 } }}   // remove default body padding; we style inside
    >
      {/* Inner wrapper carries all the visual styles */}
      <div
        style={{
          backgroundColor: info.bg,
          borderRadius: 24,
          border: `4px solid ${info.color}`,
          textAlign: 'center',
          padding: 40,
        }}
      >
      {/* Stars decoration */}
      <div className="text-3xl mb-2 space-x-1">
        {['⭐','🌟','✨','🌟','⭐'].map((s, i) => (
          <span key={i} className="animate-twinkle inline-block" style={{ animationDelay: `${i * 0.15}s` }}>{s}</span>
        ))}
      </div>

      {/* Trophy + sprite */}
      <div className="text-7xl mb-3 animate-winner inline-block">🏆</div>
      <div className="text-6xl mb-2">{info.emoji}</div>

      {/* Win message */}
      <h2 className="text-4xl font-black mb-1" style={{ color: info.color }}>
        {winnerName} {t.wins}
      </h2>
      <p className="text-gray-500 text-lg font-bold mb-6">
        {t.winnerSub}
      </p>

      {/* Play again */}
      <Button
        size="large"
        onClick={onReset}
        className="text-xl font-black px-10 rounded-2xl"
        style={{
          backgroundColor: info.color,
          borderColor: info.color,
          color: 'white',
          height: 56,
          fontSize: 20,
        }}
      >
        {t.playAgain}
      </Button>
      </div>
    </Modal>
  );
}

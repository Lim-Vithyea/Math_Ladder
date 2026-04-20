'use client';

/**
 * LadderScene.tsx
 * The central ladder visual.
 * Both character sprites climb opposite sides of the same ladder.
 *
 * Layout (top view):
 *   🦊  |==rung==|  🐧
 *       |        |
 *   Each character sits outside the rails; moves up with score.
 */

import React from 'react';

// ── Config ────────────────────────────────────────────────────────
const STEP_HEIGHT = 46;  // px per rung
const CHAR_SIZE   = 40;  // approx emoji height in px

interface Props {
  redScore: number;
  blueScore: number;
  totalSteps: number;
}

// ── Reusable Single Ladder Component ──
function SingleLadder({ score, totalSteps, emoji, color }: { score: number, totalSteps: number, emoji: string, color: string }) {
  const ladderHeight = totalSteps * STEP_HEIGHT;
  // Bottom offset for character
  const bottomPx = (score / totalSteps) * ladderHeight - CHAR_SIZE / 2;

  return (
    <div className="relative" style={{ width: 80, height: ladderHeight }}>
      {/* Left rail */}
      <div className="absolute rounded-full shadow" style={{ width: 8, left: 0, top: 0, height: '100%', backgroundColor: '#b45309' }} />
      {/* Right rail */}
      <div className="absolute rounded-full shadow" style={{ width: 8, right: 0, top: 0, height: '100%', backgroundColor: '#b45309' }} />
      
      {/* Rungs */}
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepLabel = totalSteps - i;
        const topPx = i * STEP_HEIGHT + STEP_HEIGHT / 2 - 3;
        return (
          <div
            key={i}
            className="absolute flex items-center justify-center"
            style={{ left: 8, right: 8, top: topPx, height: 6, backgroundColor: '#b45309', borderRadius: 3 }}
          >
            <span className="text-amber-100 text-[9px] font-black">{stepLabel}</span>
          </div>
        );
      })}

      {/* Character */}
      <div
        className="absolute transition-all duration-500 ease-out text-4xl w-full flex justify-center"
        style={{ bottom: bottomPx, zIndex: 10, filter: `drop-shadow(0 4px 6px ${color}80)` }}
      >
        {emoji}
      </div>
    </div>
  );
}

export default function LadderScene({ redScore, blueScore, totalSteps }: Props) {
  const ladderHeight = totalSteps * STEP_HEIGHT; 

  return (
    <div className="flex flex-col items-center select-none shrink-0" style={{ width: 280 }}>

      {/* Trophy centered between the ladders */}
      <div className="text-5xl mb-2 animate-float drop-shadow-lg text-center">🏆</div>

      {/* Clouds decoration */}
      <div className="flex gap-12 mb-2 text-3xl opacity-70">
        <span>☁️</span><span className="mt-3">☁️</span><span>☁️</span>
      </div>

      {/* Two Ladders Container */}
      <div className="flex justify-between w-full px-6" style={{ height: ladderHeight }}>
        {/* Red side */}
        <SingleLadder score={redScore} totalSteps={totalSteps} emoji="🦊" color="#dc2626" />
        
        {/* Blue side */}
        <SingleLadder score={blueScore} totalSteps={totalSteps} emoji="🐧" color="#2563eb" />
      </div>

      {/* Ground strip */}
      <div className="w-full h-6 bg-emerald-600 rounded-b-2xl shadow-inner mt-0 border-t-4 border-emerald-700" />

      {/* Score labels below ground */}
      <div className="flex justify-between mt-2 font-black text-base w-full px-4">
        <span className="text-red-400">🦊 {redScore} / {totalSteps}</span>
        <span className="text-blue-400">🐧 {blueScore} / {totalSteps}</span>
      </div>
    </div>
  );
}

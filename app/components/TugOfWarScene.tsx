'use client';

import React from 'react';

interface Props {
  ropePosition: number; // -MAX_STEPS to MAX_STEPS (0 is center)
  maxSteps: number;
}

export default function TugOfWarScene({ ropePosition, maxSteps }: Props) {
  // Movement calculation:
  // We want the opponent to hit the center (50%) at exactly maxSteps.
  // Starting positions: Red at 20%, Blue at 80% (distance from center is 30%)
  // Movement per step = 30% / maxSteps
  const pullOffset = (ropePosition / maxSteps) * 30;

  const redPos = 20 + pullOffset;
  const bluePos = 80 + pullOffset;

  return (
    <div className="flex flex-col items-center select-none shrink-0 w-full max-w-[1200px]">
      {/* The Tug of War Arena */}
      <div className="relative w-full h-25 bg-emerald-50 rounded-3xl border-4 border-emerald-100 shadow-inner overflow-hidden">
        {/* Grass markers */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#10b981 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Center Danger Line (Red) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-red-500 z-20 shadow-[0_0_10px_rgba(239,68,68,0.3)]" />

        {/* The Rope */}
        <div
          className="absolute top-1/2 h-2.5 bg-amber-700 shadow-sm transform -translate-y-1/2 transition-all duration-500 ease-out z-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #b45309, #b45309 10px, #92400e 10px, #92400e 20px)',
            left: `${redPos}%`,
            right: `${100 - bluePos}%`,
          }}
        >
          {/* Center Marker on Rope */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-yellow-400 rounded-sm shadow-sm flex items-center justify-center border-2 border-white">
            <div className="w-1 h-full bg-red-500/20" />
          </div>
        </div>

        {/* Character: Fox (Red) */}
        <div
          className="absolute top-1/2 transition-all duration-500 ease-out flex flex-col items-center z-30"
          style={{
            left: `${redPos}%`,
            transform: 'translate(-50%, -65%)',
          }}
        >
          <span className={`text-5xl filter drop-shadow-lg transition-transform ${ropePosition < 0 ? 'scale-110 rotate-[-10deg]' : 'rotate-0'}`}>🦊</span>
          <div className="mt-1 text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap uppercase">TEAM RED</div>
        </div>

        {/* Character: Penguin (Blue) */}
        <div
          className="absolute top-1/2 transition-all duration-500 ease-out flex flex-col items-center z-30"
          style={{
            left: `${bluePos}%`,
            transform: 'translate(-50%, -65%)',
          }}
        >
          <span className={`text-5xl filter drop-shadow-lg transition-transform ${ropePosition > 0 ? 'scale-110 rotate-[10deg]' : 'rotate-0'}`}>🐧</span>
          <div className="mt-1 text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap uppercase">TEAM BLUE</div>
        </div>
      </div>

      {/* Status Label */}
      <div className="flex justify-between mt-3 font-black text-xl w-full px-8 italic">
        <div className={`transition-all duration-300 ${ropePosition < 0 ? 'scale-125 text-red-600' : 'text-red-300'}`}>
          {ropePosition < 0 ? `PULLING! ${Math.abs(ropePosition)}` : 'HOLD!'}
        </div>
        <div className="text-gray-400 text-sm not-italic flex flex-col items-center">
          <span className="font-bold tracking-tighter opacity-50">DANGER ZONE</span>
          <span className="text-[10px]">DON'T CROSS THE LINE!</span>
        </div>
        <div className={`transition-all duration-300 ${ropePosition > 0 ? 'scale-125 text-blue-600' : 'text-blue-300'}`}>
          {ropePosition > 0 ? `${Math.abs(ropePosition)} PULLING!` : 'HOLD!'}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

interface Props {
  ropePosition: number; // -MAX_STEPS to MAX_STEPS (0 is center)
  maxSteps: number;
}

export default function TugOfWarScene({ ropePosition, maxSteps }: Props) {
  // Calculate percentage for positioning (0% to 100%, 50% is center)
  // ropePosition < 0 means red is winning (left)
  // ropePosition > 0 means blue is winning (right)
  const positionPercent = 50 + (ropePosition / maxSteps) * 40; // Use 40% range to keep characters on screen

  return (
    <div className="flex flex-col items-center select-none shrink-0 w-full max-w-[800px]">
      {/* Scene Title/Trophy */}
      {/* <div className="text-5xl mb-8 animate-float drop-shadow-lg text-center">🏆</div> */}

      {/* The Tug of War Arena */}
      <div className="relative w-full h-20 bg-emerald-50 rounded-3xl border-4 border-emerald-100 shadow-inner overflow-hidden">
        {/* Win Lines */}
        <div className="absolute left-[10%] top-0 bottom-0 w-1 bg-red-400 border-l-2 border-red-500 border-dashed" />
        <div className="absolute right-[10%] top-0 bottom-0 w-1 bg-blue-400 border-r-2 border-blue-500 border-dashed" />

        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 opacity-50" />

        {/* The Rope */}
        <div
          className="absolute bottom-1 left-0 right-0 h-2 bg-amber-700 shadow-lg transform -translate-y-1/2 transition-all duration-500 ease-out"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #b45309, #b45309 10px, #92400e 10px, #92400e 20px)',
            left: `${positionPercent - 50}%`,
            width: '200%'
          }}
        >
          {/* Rope Flag (Center Marker) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-red-500 rounded-sm shadow-md flex items-center justify-center border-2 border-white">
            <span className="text-white text-[10px] font-black">🚩</span>
          </div>
        </div>

        {/* Characters */}
        <div
          className="absolute transition-all duration-500 ease-out text-4xl flex items-center justify-center"
          style={{
            left: `calc(${positionPercent}% - 120px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            filter: 'drop-shadow(0 8px 10px rgba(220, 38, 38, 0.4))'
          }}
        >
          <div className="flex flex-col items-center">
            <span className="mb-2">🦊</span>
            <div className="text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">PULL!</div>
          </div>
        </div>

        <div
          className="absolute top-1/2 transition-all duration-500 ease-out text-4xl flex items-center justify-center"
          style={{
            left: `calc(${positionPercent}% + 40px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            filter: 'drop-shadow(0 8px 10px rgba(37, 99, 235, 0.4))'
          }}
        >
          <div className="flex flex-col items-center">
            <span className="mb-2">🐧</span>
            <div className="text-xs font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">PULL!</div>
          </div>
        </div>
      </div>
      {/* Status Label */}
      <div className="flex justify-between mt-2 font-black text-lg w-full px-8">
        <div className={`transition-all duration-300 ${ropePosition < 0 ? 'scale-110 text-red-600' : 'text-red-400 opacity-50'}`}>
          🦊 {Math.abs(Math.min(0, ropePosition))} / {maxSteps}
        </div>
        <div className="text-gray-400 text-sm italic">
          {ropePosition === 0 ? '--- EQUAL ---' : ropePosition < 0 ? '← RED PULLING' : 'BLUE PULLING →'}
        </div>
        <div className={`transition-all duration-300 ${ropePosition > 0 ? 'scale-110 text-blue-600' : 'text-blue-400 opacity-50'}`}>
          {Math.abs(Math.max(0, ropePosition))} / {maxSteps} 🐧
        </div>
      </div>
    </div>
  );
}

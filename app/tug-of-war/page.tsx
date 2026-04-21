'use client';

import React from 'react';
import { ConfigProvider, App, theme } from 'antd';
import MathParticles from '../components/MathParticles';
import TugOfWarGame from '../components/TugOfWarGame';

export default function TugOfWarPage() {
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
          className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-white"
          style={{ fontFamily: 'var(--font-kantumruy), var(--font-nunito), sans-serif' }}
        >
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse [animation-delay:1s]" />
            <MathParticles />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <TugOfWarGame />
          </div>
        </div>
      </App>
    </ConfigProvider>
  );
}

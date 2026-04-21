'use client';

import React from 'react';
import { ConfigProvider, App } from 'antd';
import MathParticles from '../components/MathParticles';
import TugOfWarGame from '../components/TugOfWarGame';

export default function TugOfWarPage() {
  return (
    <ConfigProvider theme={{ token: { fontFamily: 'inherit' } }}>
      <App>
        <MathParticles />
        <div className="min-h-screen flex flex-col relative bg-transparent" style={{ zIndex: 1 }}>
          <TugOfWarGame />
        </div>
      </App>
    </ConfigProvider>
  );
}

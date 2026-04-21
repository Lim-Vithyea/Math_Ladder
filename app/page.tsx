'use client';

import React from 'react';
import Link from 'next/link';
import { ConfigProvider, App, Button, Typography, Card, Row, Col, Badge, theme } from 'antd';
import MathParticles from './components/MathParticles';
import { useSettings } from './context/SettingsContext';

const { Title, Text } = Typography;

export default function LandingPage() {
  const { lang, setLang, t } = useSettings();

  const toggleLang = () => {
    setLang(lang === 'en' ? 'km' : 'en');
  };

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: theme.darkAlgorithm,
        token: { 
          fontFamily: 'var(--font-kantumruy), var(--font-nunito), sans-serif',
          borderRadius: 24,
          colorPrimary: '#8b5cf6',
        } 
      }}
    >
      <App style={{ backgroundColor: 'transparent' }}>
        <div 
          className="relative min-h-screen w-full overflow-hidden bg-[#020617] selection:bg-violet-500/30 text-white"
          style={{ 
            fontFamily: 'var(--font-kantumruy), var(--font-nunito), sans-serif',
            backgroundColor: '#020617' // Force deep dark blue
          }}
        >
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse [animation-delay:1s]" />
            <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-fuchsia-500/10 blur-[100px] animate-float" />
            <MathParticles />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
            
            {/* Top Bar */}
            <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center w-full max-w-7xl mx-auto">
              <Badge status="processing" text={<span className="text-violet-400 font-black tracking-widest text-xs uppercase">v2.0 Beta</span>} />
              <Button
                size="large"
                onClick={toggleLang}
                className="font-black rounded-2xl border border-white/10 transition-all bg-white/5 hover:bg-white/10 text-white backdrop-blur-3xl px-6 shadow-2xl"
              >
                {lang === 'en' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English'}
              </Button>
            </div>

            <header className="text-center mb-20 max-w-4xl animate-bounce-in">
              <div className="inline-block px-5 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                 <span className="text-xs font-black text-violet-300 uppercase tracking-[0.25em]">The Ultimate Math Battle</span>
              </div>
              <Title className="text-6xl md:text-8xl font-black bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent mb-8 tracking-tight leading-[1.1]">
                {t.menuTitle}
              </Title>
              <Text className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl block mx-auto leading-relaxed">
                {t.menuSubtitle}
              </Text>
            </header>

            <main className="w-full max-w-6xl">
              <Row gutter={[32, 32]} justify="center">

                {/* Ladder Race Card */}
                <Col xs={24} md={8}>
                  <Link href="/ladder-race" className="block h-full">
                    <div className="h-full rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-500 hover:-translate-y-4 hover:bg-white/[0.08] hover:border-violet-500/50 p-12">
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-24 h-24 rounded-[28px] bg-violet-600/20 flex items-center justify-center text-6xl mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl border border-white/10 backdrop-blur-sm">
                          🪜
                        </div>
                        <Title level={2} className="text-3xl font-black text-white mb-4 tracking-tight">
                          {t.ladderGame}
                        </Title>
                        <Text className="text-base text-slate-400 font-medium mb-12 h-16 block leading-relaxed">
                          {t.ladderDesc}
                        </Text>
                        <Button
                          type="primary"
                          size="large"
                          className="w-full h-14 rounded-2xl text-lg font-black bg-violet-600 hover:bg-violet-500 border-none shadow-[0_16px_32px_-8px_rgba(124,58,237,0.6)] transition-all uppercase tracking-tighter"
                        >
                          {t.start}
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Col>

                {/* Speed Challenge Card */}
                <Col xs={24} md={8}>
                  <Link href="/speed-challenge" className="block h-full">
                    <div className="h-full rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-500 hover:-translate-y-4 hover:bg-white/[0.08] hover:border-orange-500/50 p-12">
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-24 h-24 rounded-[28px] bg-orange-600/20 flex items-center justify-center text-6xl mb-8 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 shadow-2xl border border-white/10 backdrop-blur-sm">
                          ⏱️
                        </div>
                        <Title level={2} className="text-3xl font-black text-white mb-4 tracking-tight">
                          {t.speedGame}
                        </Title>
                        <Text className="text-base text-slate-400 font-medium mb-12 h-16 block leading-relaxed">
                          {t.speedDesc}
                        </Text>
                        <Button
                          type="primary"
                          size="large"
                          className="w-full h-14 rounded-2xl text-lg font-black bg-orange-600 hover:bg-orange-500 border-none shadow-[0_16px_32px_-8px_rgba(234,88,12,0.6)] transition-all uppercase tracking-tighter"
                        >
                          {t.start}
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Col>

                {/* Tug of War Card */}
                <Col xs={24} md={8}>
                  <Link href="/tug-of-war" className="block h-full">
                    <div className="h-full rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden group transition-all duration-500 hover:-translate-y-4 hover:bg-white/[0.08] hover:border-emerald-500/50 p-12">
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-24 h-24 rounded-[28px] bg-emerald-600/20 flex items-center justify-center text-6xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl border border-white/10 backdrop-blur-sm">
                          🪢
                        </div>
                        <Title level={2} className="text-3xl font-black text-white mb-4 tracking-tight">
                          {t.tugGame}
                        </Title>
                        <Text className="text-base text-slate-400 font-medium mb-12 h-16 block leading-relaxed">
                          {t.tugDesc}
                        </Text>
                        <Button
                          type="primary"
                          size="large"
                          className="w-full h-14 rounded-2xl text-lg font-black bg-emerald-600 hover:bg-emerald-500 border-none shadow-[0_16px_32px_-8px_rgba(5,150,105,0.6)] transition-all uppercase tracking-tighter"
                        >
                          {t.start}
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Col>

              </Row>
            </main>

            <footer className="mt-28 text-slate-600 font-black select-none tracking-[0.4em] text-[10px] uppercase">
              © 2026 Lim Vithyea • Doem Samaun
            </footer>
          </div>
        </div>
      </App>
    </ConfigProvider>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ConfigProvider, App, Button, Typography, Card, Row, Col } from 'antd';
import MathParticles from './components/MathParticles';
import { useSettings } from './context/SettingsContext';

const { Title, Text } = Typography;

export default function LandingPage() {
  const { lang, setLang, t } = useSettings();

  const toggleLang = () => {
    setLang(lang === 'en' ? 'km' : 'en');
  };

  return (
    <ConfigProvider theme={{ token: { fontFamily: 'inherit' } }}>
      <App>
        <MathParticles />
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 overflow-hidden bg-slate-50">
          
          {/* Language Toggle */}
          <div className="absolute top-6 right-6 z-20">
            <Button 
              size="large"
              onClick={toggleLang}
              className="font-bold rounded-xl shadow-md border-2 border-violet-200 hover:border-violet-400 transition-all bg-white"
            >
              {lang === 'en' ? '🇰🇭 ភាសាខ្មែរ' : '🇺🇸 English'}
            </Button>
          </div>

          <header className="text-center mb-12">
            <Title className="text-5xl md:text-7xl font-black bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent mb-4 leading-tight">
              {t.menuTitle}
            </Title>
            <Text className="text-lg md:text-2xl text-gray-600 font-bold max-w-2xl block mx-auto px-4 leading-relaxed">
              {t.menuSubtitle}
            </Text>
          </header>

          <main className="w-full max-w-5xl">
            <Row gutter={[32, 32]} justify="center">
              
              {/* Ladder Race Card */}
              <Col xs={24} md={12}>
                <Link href="/ladder-race">
                  <Card 
                    hoverable 
                    className="h-full rounded-3xl border-4 border-violet-100 shadow-xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-violet-400"
                    styles={{ body: { padding: '40px 32px' } }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="text-7xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                        🪜
                      </div>
                      <Title level={2} className="text-3xl font-black text-violet-700 mb-4">
                        {t.ladderGame}
                      </Title>
                      <Text className="text-lg text-gray-500 font-semibold mb-8 h-12">
                        {t.ladderDesc}
                      </Text>
                      <Button 
                        type="primary" 
                        size="large" 
                        className="h-14 px-10 rounded-2xl text-xl font-black bg-violet-600 border-none shadow-lg group-hover:bg-violet-700 transition-colors"
                      >
                        {t.start}
                      </Button>
                    </div>
                  </Card>
                </Link>
              </Col>

              {/* Speed Challenge Card */}
              <Col xs={24} md={12}>
                <Link href="/speed-challenge">
                  <Card 
                    hoverable 
                    className="h-full rounded-3xl border-4 border-orange-100 shadow-xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-orange-400"
                    styles={{ body: { padding: '40px 32px' } }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="text-7xl mb-6 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
                        ⏱️
                      </div>
                      <Title level={2} className="text-3xl font-black text-orange-600 mb-4">
                        {t.speedGame}
                      </Title>
                      <Text className="text-lg text-gray-500 font-semibold mb-8 h-12">
                        {t.speedDesc}
                      </Text>
                      <Button 
                        type="primary" 
                        size="large" 
                        className="h-14 px-10 rounded-2xl text-xl font-black bg-orange-500 border-none shadow-lg group-hover:bg-orange-600 transition-colors"
                      >
                        {t.start}
                      </Button>
                    </div>
                  </Card>
                </Link>
              </Col>

            </Row>
          </main>

          <footer className="mt-16 text-gray-400 font-bold select-none opacity-50">
            © 2024 Math Adventure Games • Practice & Fun
          </footer>
        </div>
      </App>
    </ConfigProvider>
  );
}

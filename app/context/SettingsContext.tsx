'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Difficulty, QuestionType } from '../utils/gameUtils';
import { Lang, TRANSLATIONS, Translations } from '../i18n/translations';

type GameMode = 'calculator' | 'choices';

interface Settings {
  lang: Lang;
  difficulty: Difficulty;
  gameMode: GameMode;
  exerciseType: QuestionType;
  musicEnabled: boolean;
}

interface SettingsContextType extends Settings {
  setLang: (lang: Lang) => void;
  setDifficulty: (diff: Difficulty) => void;
  setGameMode: (mode: GameMode) => void;
  setExerciseType: (type: QuestionType) => void;
  setMusicEnabled: (enabled: boolean) => void;
  t: Translations;
}

const DEFAULT_SETTINGS: Settings = {
  lang: 'en',
  difficulty: 'easy',
  gameMode: 'calculator',
  exerciseType: 'mixed',
  musicEnabled: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = 'tug_of_war_settings';

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const value: SettingsContextType = {
    ...settings,
    setLang: (lang) => updateSetting('lang', lang),
    setDifficulty: (difficulty) => updateSetting('difficulty', difficulty),
    setGameMode: (gameMode) => updateSetting('gameMode', gameMode),
    setExerciseType: (exerciseType) => updateSetting('exerciseType', exerciseType),
    setMusicEnabled: (musicEnabled) => updateSetting('musicEnabled', musicEnabled),
    t: TRANSLATIONS[settings.lang],
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

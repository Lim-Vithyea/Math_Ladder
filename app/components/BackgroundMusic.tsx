'use client';
import { useEffect, useRef } from 'react';
import { Button } from 'antd';
import type { Translations } from '../i18n/translations';
import { useSettings } from '../context/SettingsContext';

export default function BackgroundMusic({ t }: { t: Translations }) {
  const { musicEnabled, setMusicEnabled } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio object only on the client side
  useEffect(() => {
    // In Next.js, files in the public folder are served from the root URL.
    // So we just use '/filename.mp3' instead of the local hard drive path.
    audioRef.current = new Audio('/bg-music.mp3');
    audioRef.current.loop = true; // Make it loop forever!
    audioRef.current.volume = 0.5; // Keep the volume low so it's not annoying

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, []);

  // Sync audio state with musicEnabled setting
  useEffect(() => {
    if (!audioRef.current) return;

    if (musicEnabled) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        // If autoplay is blocked, we might need to reset the setting or handle it
        setMusicEnabled(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [musicEnabled]);

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };

  return (
    <Button
      onClick={toggleMusic}
      className="shadow-md border-2"
      style={{
        fontWeight: 800,
        borderRadius: 12,
        backgroundColor: musicEnabled ? '#10b981' : 'white',
        color: musicEnabled ? 'white' : '#6b7280',
        borderColor: musicEnabled ? '#059669' : '#e5e7eb',
      }}
    >
      {musicEnabled ? t.musicOn : t.musicOff}
    </Button>
  );
}

'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import type { Translations } from '../i18n/translations';

export default function BackgroundMusic({ t }: { t: Translations }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio object only on the client side
  useEffect(() => {
    // In Next.js, files in the public folder are served from the root URL.
    // So we just use '/filename.mp3' instead of the local hard drive path.
    audioRef.current = new Audio('/Ai Đưa Em Về   Low Cortisol Song (Agnes Tachyon AI Cover) [Cukak Remix] (1) (1).mp3');
    audioRef.current.loop = true; // Make it loop forever!
    audioRef.current.volume = 1; // Keep the volume low so it's not annoying

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Button
      onClick={toggleMusic}
      className="absolute z-50 shadow-md border-2"
      style={{
        fontWeight: 800,
        borderRadius: 12,
        backgroundColor: isPlaying ? '#10b981' : 'white',
        color: isPlaying ? 'white' : '#6b7280',
        borderColor: isPlaying ? '#059669' : '#e5e7eb',
      }}
    >
      {isPlaying ? t.musicOn : t.musicOff}
    </Button>
  );
}

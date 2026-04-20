'use client';

import React from 'react';
import { Button } from 'antd';

interface Props {
  options: number[];
  onSelect: (choice: number) => void;
  disabled: boolean;
  feedbackActive: boolean;
  accentColor: string;
  hoverClass: string;
}

/**
 * MultipleChoice.tsx
 * A clean, reusable grid for multiple choice answers.
 * Shows 6 big buttons in a 2-column layout.
 */
export default function MultipleChoice({
  options,
  onSelect,
  disabled,
  feedbackActive,
  accentColor,
  hoverClass
}: Props) {
  if (!options || options.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 py-2">
      {options.map((opt, i) => (
        <Button
          key={`${opt}-${i}`}
          onClick={() => onSelect(opt)}
          disabled={disabled || feedbackActive}
          className={`h-24 sm:h-28 text-3xl sm:text-4xl font-black rounded-2xl shadow-md border-b-8 active:border-b-2 active:translate-y-1 transition-all ${hoverClass}`}
          style={{
            backgroundColor: 'white',
            color: accentColor,
            borderColor: accentColor,
          }}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
}

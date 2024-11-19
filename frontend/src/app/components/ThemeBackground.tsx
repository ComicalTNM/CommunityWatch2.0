// components/ThemeBackground.tsx
'use client';

import { useTheme } from '../contexts/ThemeContext';

export default function ThemeBackground() {
  const { theme } = useTheme();

  return (
    <div 
      className="fixed inset-0 z-0"
      style={{ 
        background: `linear-gradient(${theme.direction}, ${theme.backgroundFrom}, ${theme.backgroundTo})`,
        transition: 'background 0.3s ease'
      }}
    />
  );
}
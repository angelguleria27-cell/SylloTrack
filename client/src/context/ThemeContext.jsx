import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../utils/sound';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme state: 'dark' | 'light'
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('syllotrack_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('Could not read theme preference:', e);
    }
    return 'dark'; // Default to stunning dark theme!
  });

  const [soundEnabled, setSoundEnabledState] = useState(soundManager.soundEnabled);

  // Time format state: '12h' (default) | '24h'
  const [timeFormat, setTimeFormatState] = useState(() => {
    try {
      const savedFormat = localStorage.getItem('syllotrack_time_format');
      if (savedFormat === '12h' || savedFormat === '24h') {
        return savedFormat;
      }
    } catch (e) {
      console.warn('Could not read time format preference:', e);
    }
    return '12h'; // Default to 12-hour format
  });

  useEffect(() => {
    // Apply dataset attribute to documentElement
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    try {
      localStorage.setItem('syllotrack_theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    soundManager.playThemeToggle(nextTheme === 'dark');
  };

  const toggleTimeFormat = () => {
    const nextFormat = timeFormat === '12h' ? '24h' : '12h';
    setTimeFormatState(nextFormat);
    try {
      localStorage.setItem('syllotrack_time_format', nextFormat);
    } catch (e) {
      console.warn('Could not save time format preference:', e);
    }
  };

  const toggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabledState(newState);
  };

  const playClickSound = () => soundManager.playClick();
  const playCheckSound = (completed) => soundManager.playCheck(completed);
  const playSuccessSound = () => soundManager.playSuccess();
  const playCelebrationSound = () => soundManager.playCelebration();
  const playDeleteSound = () => soundManager.playDelete();

  const is12Hour = timeFormat === '12h';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === 'dark',
        soundEnabled,
        toggleSound,
        timeFormat,
        is12Hour,
        toggleTimeFormat,
        setTimeFormat: (fmt) => {
          if (fmt === '12h' || fmt === '24h') {
            setTimeFormatState(fmt);
            try {
              localStorage.setItem('syllotrack_time_format', fmt);
            } catch (e) {}
          }
        },
        playClickSound,
        playCheckSound,
        playSuccessSound,
        playCelebrationSound,
        playDeleteSound,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

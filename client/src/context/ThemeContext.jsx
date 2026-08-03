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

  const toggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabledState(newState);
  };

  const playClickSound = () => soundManager.playClick();
  const playCheckSound = (completed) => soundManager.playCheck(completed);
  const playSuccessSound = () => soundManager.playSuccess();
  const playCelebrationSound = () => soundManager.playCelebration();
  const playDeleteSound = () => soundManager.playDelete();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === 'dark',
        soundEnabled,
        toggleSound,
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

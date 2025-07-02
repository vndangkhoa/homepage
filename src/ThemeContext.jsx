import React, { createContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'dark'; // Default to dark theme
  });

  const [accentColor, setAccentColor] = useState(() => {
    const storedAccentColor = localStorage.getItem('accentColor');
    return storedAccentColor || '#64ffda'; // Default accent color
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);

    // Update HSL components of accent color
    const hsl = hexToHSL(accentColor);
    if (hsl) {
      document.documentElement.style.setProperty('--accent-hue', hsl.h);
      document.documentElement.style.setProperty('--accent-sat', `${hsl.s}%`);
      document.documentElement.style.setProperty('--accent-light', `${hsl.l}%`);
      // Also provide RGB components if needed elsewhere, e.g. for rgba()
      const rgb = hexToRGB(accentColor);
      if (rgb) {
        document.documentElement.style.setProperty('--accent-r', rgb.r);
        document.documentElement.style.setProperty('--accent-g', rgb.g);
        document.documentElement.style.setProperty('--accent-b', rgb.b);
      }
    }
  }, [accentColor]);

  // Helper function to convert HEX to HSL
  // (Source: https://stackoverflow.com/a/9493060 - modified)
  const hexToHSL = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Helper function to convert HEX to RGB
  const hexToRGB = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    accentColor,
    setAccentColor,
  }), [theme, accentColor]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

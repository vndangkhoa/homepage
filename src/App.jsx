import React, { useContext } from 'react'; // Removed useEffect, useState, not directly used here
import CardCarousel from './CardCarousel';
import SplashCursor from './SplashCursor';
import ThemeSwitcher from './ThemeSwitcher';
import ThemeContext from './ThemeContext'; // Import ThemeContext
import './App.css';

// Helper to convert CSS RGB/HEX string to {r, g, b} object (0-1 range)
const colorStringToRGBObj = (colorStr) => {
  if (!colorStr) return { r: 0, g: 0, b: 0 }; // Default to black if undefined

  if (colorStr.startsWith('#')) {
    const hex = colorStr.slice(1);
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return { r, g, b };
  } else if (colorStr.startsWith('rgb')) { // Handles rgb(r, g, b) and rgba(r, g, b, a)
    const parts = colorStr.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      return {
        r: parseFloat(parts[0]) / 255,
        g: parseFloat(parts[1]) / 255,
        b: parseFloat(parts[2]) / 255,
      };
    }
  }
  // Fallback for unknown format or if parsing fails
  console.warn(`Could not parse color string for SplashCursor: ${colorStr}`);
  return { r: 0, g: 0, b: 0 };
};


function App() {
  const { theme } = useContext(ThemeContext);

  // Determine SplashCursor BACK_COLOR based on theme
  // These CSS variables are set in ThemeContext and index.css
  let splashBackColor;
  if (theme === 'light') {
    // For light theme, use a light background color, e.g., --bg-color
    const lightBgCss = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    splashBackColor = colorStringToRGBObj(lightBgCss || '#f0f2f5'); // Fallback to a default light
  } else {
    // For dark theme, use a dark background color, e.g., --bg-color
    const darkBgCss = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    splashBackColor = colorStringToRGBObj(darkBgCss || '#0a0a0f'); // Fallback to a default dark
  }

  return (
    <div className="app">
      <ThemeSwitcher />
      <CardCarousel />
      <SplashCursor BACK_COLOR={splashBackColor} DENSITY_DISSIPATION={theme === 'light' ? 1.5 : 3.5} />
    </div>
  );
}

export default App;

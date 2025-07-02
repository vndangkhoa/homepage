import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { theme, toggleTheme, accentColor, setAccentColor } = useContext(ThemeContext);

  const handleAccentColorChange = (e) => {
    setAccentColor(e.target.value);
  };

  return (
    <div className="theme-switcher">
      <button onClick={toggleTheme} className="theme-toggle-button">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <div className="accent-color-picker">
        <label htmlFor="accentColor">Accent Color:</label>
        <input
          type="color"
          id="accentColor"
          value={accentColor}
          onChange={handleAccentColorChange}
          className="accent-color-input"
        />
      </div>
    </div>
  );
};

export default ThemeSwitcher;

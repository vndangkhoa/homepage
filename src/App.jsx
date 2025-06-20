import React, { useEffect, useState } from 'react';
import CardCarousel from './CardCarousel'
import SplashCursor from './SplashCursor';
import './App.css'

function App() {
  return (
    <div className="app">
      <CardCarousel />
      <SplashCursor />
    </div>
  );
}

export default App

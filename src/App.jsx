import React from 'react';
import CardCarousel from './CardCarousel'
import SplashCursor from './SplashCursor'
import './App.css'

function App() {
  return (
    <>
      <SplashCursor />
      <div className="app">
        <CardCarousel />
      </div>
    </>
  )
}

export default App

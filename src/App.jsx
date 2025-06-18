import CardCarousel from './CardCarousel'
import SplashCursor from './SplashCursor'
import './App.css'

function App() {
  console.log('App component rendering');
  
  return (
    <>
      <SplashCursor />
      <div className="app">
        <CardCarousel />
        
        {/* Debug info */}
        <div style={{ position: 'fixed', top: '10px', left: '10px', color: 'white', zIndex: 1000 }}>
          Debug: Carousel loaded
        </div>
      </div>
    </>
  )
}

export default App

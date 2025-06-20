import React, { useState, useRef, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import ContactCard from './ContactCard';
import ToolsCard from './ToolsCard';
import './CardCarousel.css';

const CardCarousel = () => {
  console.log('CardCarousel component rendering');
  
  const [currentCard, setCurrentCard] = useState(0);
  const carouselRef = useRef(null);
  const startXRef = useRef(null);
  const startYRef = useRef(null);
  const mouseDownRef = useRef(false);

  const cards = [
    {
      id: 'profile',
      component: (
        <ProfileCard
          name="Khoa Vo"
          title="Art Lead | Owner of REDMAGIC VN"
          handle="khoavo"
          status="Online"
          contactText="Contact Me"
          avatarUrl={`${import.meta.env.BASE_URL}KhoaVo-profile.png`}
          iconUrl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE1IDVMMTkuMDkgMTIuMjZMMjcuNSAxMy43M0wyMS43NSAxOS4zN0wyMy4xOCAyNy43NUwxNSA0LjI1TDE1IDVaIiBmaWxsPSIjZmZmIi8+PC9zdmc+"
          showUserInfo={true}
          enableTilt={true}
          onContactClick={() => {
            console.log('Contact clicked - switching to contact card');
            nextCard();
          }}
          style={{ color: '#fff' }}
        />
      )
    },
    {
      id: 'contact',
      component: <ContactCard />
    },
    {
      id: 'tools',
      component: <ToolsCard />
    }
  ];

  console.log('Cards array:', cards);
  console.log('Current card:', currentCard);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!startXRef.current || !startYRef.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startXRef.current - currentX;
    const diffY = startYRef.current - currentY;

    // Prevent vertical scrolling if horizontal swipe is detected
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (!startXRef.current || !startYRef.current) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startXRef.current - endX;
    const diffY = startYRef.current - endY;

    // Check if it's a horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextCard(); // Swipe left
      } else {
        prevCard(); // Swipe right
      }
    }

    startXRef.current = null;
    startYRef.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prevCard();
    } else if (e.key === 'ArrowRight') {
      nextCard();
    }
  };

  const handleMouseDown = (e) => {
    mouseDownRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!mouseDownRef.current) return;
    if (!startXRef.current || !startYRef.current) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = startXRef.current - currentX;
    const diffY = startYRef.current - currentY;
    // Prevent vertical scrolling if horizontal drag is detected
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  };

  const handleMouseUp = (e) => {
    if (!mouseDownRef.current) return;
    mouseDownRef.current = false;
    if (!startXRef.current || !startYRef.current) return;
    const endX = e.clientX;
    const endY = e.clientY;
    const diffX = startXRef.current - endX;
    const diffY = startYRef.current - endY;
    // Check if it's a horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextCard(); // Drag left
      } else {
        prevCard(); // Drag right
      }
    }
    startXRef.current = null;
    startYRef.current = null;
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="carousel-wrapper"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ touchAction: 'pan-y', userSelect: 'none' }}
    >
      <div className="carousel-cards">
        {cards.map((card, idx) => (
          <div
            className={`carousel-card${currentCard === idx ? ' active' : ''}`}
            key={card.id}
          >
            {card.component}
          </div>
        ))}
      </div>
      
      <div className="carousel-indicators">
        {cards.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentCard ? 'active' : ''}`}
            onClick={() => {
              if (index !== currentCard) {
                if (index > currentCard) {
                  nextCard();
                } else {
                  prevCard();
                }
              }
            }}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CardCarousel; 
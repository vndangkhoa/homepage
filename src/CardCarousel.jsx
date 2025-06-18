import React, { useState, useRef, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import ContactCard from './ContactCard';
import './CardCarousel.css';

const CardCarousel = () => {
  console.log('CardCarousel component rendering');
  
  const [currentCard, setCurrentCard] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const startXRef = useRef(null);
  const startYRef = useRef(null);

  const cards = [
    {
      id: 'profile',
      component: (
        <ProfileCard
          name="Khoa Vo"
          title="Art Lead"
          handle="khoavo"
          status="Online"
          contactText="Contact Me"
          avatarUrl="/KhoaVo-profile.png"
          iconUrl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE1IDVMMTkuMDkgMTIuMjZMMjcuNSAxMy43M0wyMS43NSAxOS4zN0wyMy4xOCAyNy43NUwxNSA0LjI1TDE1IDVaIiBmaWxsPSIjZmZmIi8+PC9zdmc+"
          showUserInfo={true}
          enableTilt={true}
          onContactClick={() => {
            console.log('Contact clicked - switching to contact card');
            nextCard();
          }}
        />
      )
    },
    {
      id: 'contact',
      component: <ContactCard />
    }
  ];

  console.log('Cards array:', cards);
  console.log('Current card:', currentCard);

  const nextCard = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentCard((prev) => (prev + 1) % cards.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevCard = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="card-carousel"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`carousel-card ${index === currentCard ? 'active' : ''} ${
              index === (currentCard + 1) % cards.length ? 'next' : ''
            } ${index === (currentCard - 1 + cards.length) % cards.length ? 'prev' : ''}`}
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
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentCard(index);
                setTimeout(() => setIsTransitioning(false), 500);
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
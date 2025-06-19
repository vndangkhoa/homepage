import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import './ContactCard.css';

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) => round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
};

const bentoLinks = [
  {
    icon: '🗂️', label: 'Portfolio', url: 'https://portfolio.khoavo.i234.me'
  },
  {
    icon: '💬', label: 'RocketChat', url: 'https://chat.khoavo.i234.me'
  },
  {
    icon: '💬', label: 'Zalo', url: 'https://zalo.me/g/ywjwyv205'
  },
  {
    icon: '🎮', label: 'REDMAGIC', url: 'https://rm8pfix.khoavo.i234.me'
  },
  {
    icon: '🌐', label: 'Website', url: 'https://khoavo.i234.me'
  },
  {
    icon: '📘', label: 'Facebook', url: 'https://facebook.com/khoavo'
  },
  {
    icon: '🐙', label: 'GitHub', url: 'https://github.com/vndangkhoa'
  },
];

const ContactCard = () => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const [headerClicks, setHeaderClicks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const animationHandlers = useMemo(() => {
    let rafId = null;
    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
      const width = card.clientWidth;
      const height = card.clientHeight;
      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;
      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`,
      };
      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };
    const createSmoothAnimation = (duration, startX, startY, card, wrap) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;
      const animationLoop = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);
        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);
        updateCardTransform(currentX, currentY, card, wrap);
        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };
      rafId = requestAnimationFrame(animationLoop);
    };
    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
    };
  }, []);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    const rect = card.getBoundingClientRect();
    animationHandlers.updateCardTransform(
      event.clientX - rect.left,
      event.clientY - rect.top,
      card,
      wrap
    );
  }, [animationHandlers]);

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.cancelAnimation();
    wrap.classList.add('active');
    card.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback((event) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.SMOOTH_DURATION,
      event.offsetX,
      event.offsetY,
      card,
      wrap
    );
    wrap.classList.remove('active');
    card.classList.remove('active');
  }, [animationHandlers]);

  const handleHeaderClick = () => {
    setHeaderClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        return 0;
      }
      return next;
    });
  };

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;

    let orientationHandler = null;
    let permissionGranted = false;

    function handleOrientation(event) {
      const gamma = event.gamma || 0; // [-90,90]
      const beta = event.beta || 0;   // [-180,180]
      const percentX = 50 + (gamma / 90) * 50;
      const percentY = 50 + (beta / 180) * 50;
      animationHandlers.updateCardTransform(
        (percentX / 100) * card.clientWidth,
        (percentY / 100) * card.clientHeight,
        card,
        wrap
      );
    }

    function setupOrientation() {
      if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        window.DeviceOrientationEvent.requestPermission().then((response) => {
          if (response === 'granted') {
            permissionGranted = true;
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        });
      } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }

    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setupOrientation();
      orientationHandler = handleOrientation;
    } else {
      card.addEventListener('pointerenter', handlePointerEnter);
      card.addEventListener('pointermove', handlePointerMove);
      card.addEventListener('pointerleave', handlePointerLeave);
    }

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY,
      card,
      wrap
    );

    return () => {
      if (orientationHandler) {
        window.removeEventListener('deviceorientation', orientationHandler, true);
      }
      card.removeEventListener('pointerenter', handlePointerEnter);
      card.removeEventListener('pointermove', handlePointerMove);
      card.removeEventListener('pointerleave', handlePointerLeave);
      animationHandlers.cancelAnimation();
    };
  }, [animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  return (
    <div ref={wrapRef} className="contact-card-wrapper">
      <section ref={cardRef} className="contact-card">
        <div className="contact-inside">
          <div className="contact-header" onClick={handleHeaderClick} style={{cursor:'pointer'}}>
            <div className="contact-title-block">
              <h2>Khoa Vo</h2>
              <div className="contact-role">Art Lead</div>
            </div>
          </div>
          <div className="contact-bento">
            {bentoLinks.map((item, idx) => (
              <a
                className="bento-tile"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                key={item.label}
                title={item.label}
              >
                <span className="bento-emoji">{item.icon}</span>
                <span className="bento-label">{item.label}</span>
              </a>
            ))}
          </div>
          <div className="contact-footer">
            <div>Status: Available for freelance</div>
            <div>Response: Usually within 24h</div>
          </div>
        </div>
      </section>
      {showConfetti && <div className="confetti">🎉🎊✨</div>}
    </div>
  );
};

export default ContactCard; 
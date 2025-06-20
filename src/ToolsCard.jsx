import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import './ContactCard.css'; // Reuse the same styles for consistency

const toolLinks = [
  { icon: '▶️', label: 'YouTube (No Ads, Download)', url: 'https://utube.khoavo.i234.me' },
  { icon: '🎬', label: 'Tiktok & Facebook (No Ads)', url: 'https://tiktok.khoavo.i234.me' },
  { icon: '📄', label: 'PDF Tools', url: 'https://pdf.khoavo.i234.me' },
  { icon: '🖼️', label: 'JPG Tools', url: 'https://jpg.khoavo.i234.me' },
  { icon: '💻', label: 'IT Utilities', url: 'https://it.khoavo.i234.me' },
  { icon: '🎥', label: 'Movies (Jellyfin)', url: 'https://jellyfin.khoavo.i234.me' },
  { icon: '🎵', label: 'Music Streaming', url: 'https://music.khoavo.i234.me' },
];

const labelStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px',
  display: 'inline-block',
  verticalAlign: 'middle',
};

const ANIMATION_CONFIG = { SMOOTH_DURATION: 600 };
const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) => round(toMin + ((toMax - fromMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const ToolsCard = () => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const linksGridRef = useRef(null);
  const [isScrollable, setIsScrollable] = React.useState(false);

  // Detect if the grid is scrollable
  useEffect(() => {
    const grid = linksGridRef.current;
    if (grid && grid.scrollHeight > grid.clientHeight) {
      setIsScrollable(true);
    } else {
      setIsScrollable(false);
    }
  }, [toolLinks.length]);

  // 3D tilt animation logic
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

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    let orientationHandler = null;
    let touchActive = false;
    function handleOrientation(event) {
      const gamma = event.gamma || 0;
      const beta = event.beta || 0;
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
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        });
      } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }
    function handleTouchStart(e) {
      if (e.touches.length === 1) {
        touchActive = true;
        wrap.classList.add('active');
        card.classList.add('active');
        const rect = card.getBoundingClientRect();
        const touch = e.touches[0];
        animationHandlers.updateCardTransform(
          touch.clientX - rect.left,
          touch.clientY - rect.top,
          card,
          wrap
        );
      }
    }
    function handleTouchMove(e) {
      if (!touchActive || e.touches.length !== 1) return;
      const rect = card.getBoundingClientRect();
      const touch = e.touches[0];
      animationHandlers.updateCardTransform(
        touch.clientX - rect.left,
        touch.clientY - rect.top,
        card,
        wrap
      );
      e.preventDefault();
    }
    function handleTouchEnd(e) {
      if (!touchActive) return;
      touchActive = false;
      wrap.classList.remove('active');
      card.classList.remove('active');
      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        card.clientWidth / 2,
        card.clientHeight / 2,
        card,
        wrap
      );
    }
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setupOrientation();
      orientationHandler = handleOrientation;
      card.addEventListener('touchstart', handleTouchStart, { passive: false });
      card.addEventListener('touchmove', handleTouchMove, { passive: false });
      card.addEventListener('touchend', handleTouchEnd, { passive: false });
      card.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    } else {
      card.addEventListener('pointerenter', handlePointerEnter);
      card.addEventListener('pointermove', handlePointerMove);
      card.addEventListener('pointerleave', handlePointerLeave);
    }
    return () => {
      if (orientationHandler) {
        window.removeEventListener('deviceorientation', orientationHandler, true);
      }
      card.removeEventListener('pointerenter', handlePointerEnter);
      card.removeEventListener('pointermove', handlePointerMove);
      card.removeEventListener('pointerleave', handlePointerLeave);
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
      card.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  return (
    <div className="contactcard-mobile-outer contact-card-wrapper" ref={wrapRef}>
      <div
        className="contactcard-mobile-inner contact-card"
        ref={cardRef}
        tabIndex={0}
        style={{ background: 'none', color: '#fff' }}
      >
        <div
          className={`contactcard-links-grid${isScrollable ? ' scrollable' : ''}`}
          ref={linksGridRef}
        >
          {toolLinks.map((item) => (
            <a
              className="contactcard-link"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              key={item.label}
              title={item.label}
            >
              <span className="contactcard-link-icon">{item.icon}</span>
              <span className="contactcard-link-label" style={labelStyle}>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsCard; 
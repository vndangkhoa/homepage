import React, { useEffect, useRef, useCallback, useMemo } from "react";
import "./ContactCard.css";

const ContactCard = ({ className = "" }) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  const animationHandlers = useMemo(() => {
    let rafId = null;

    const clamp = (value, min = 0, max = 100) =>
      Math.min(Math.max(value, min), max);

    const round = (value, precision = 3) =>
      parseFloat(value.toFixed(precision));

    const adjust = (value, fromMin, fromMax, toMin, toMax) =>
      round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 8))}deg`,
        "--rotate-y": `${round(centerY / 6)}deg`,
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
        const easedProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

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

  const handlePointerMove = useCallback(
    (event) => {
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
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        600,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove("active");
      card.classList.remove("active");
    },
    [animationHandlers]
  );

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;

    card.addEventListener("pointerenter", pointerEnterHandler);
    card.addEventListener("pointermove", pointerMoveHandler);
    card.addEventListener("pointerleave", pointerLeaveHandler);

    // Initial animation
    const initialX = wrap.clientWidth - 70;
    const initialY = 60;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(1500, initialX, initialY, card, wrap);

    return () => {
      card.removeEventListener("pointerenter", pointerEnterHandler);
      card.removeEventListener("pointermove", pointerMoveHandler);
      card.removeEventListener("pointerleave", pointerLeaveHandler);
      animationHandlers.cancelAnimation();
    };
  }, [animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  return (
    <div
      ref={wrapRef}
      className={`contact-card-wrapper ${className}`.trim()}
    >
      <div ref={cardRef} className="contact-card">
        <div className="contact-header">
          <h2>Khoa.Vo</h2>
          <div className="contact-subtitle">Connect with me</div>
        </div>
        
        <div className="contact-links">
          <div className="contact-item">
            <div className="contact-icon facebook">📘</div>
            <div className="contact-info">
              <div className="contact-label">Facebook</div>
              <a 
                href="https://url.khoavo.i234.me/fb-group" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                fb.com/groups/rm8pfix
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon chat">💬</div>
            <div className="contact-info">
              <div className="contact-label">RocketChat</div>
              <a 
                href="https://url.khoavo.i234.me/chat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                chat.khoavo.i234.me
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon redmagic">🔴</div>
            <div className="contact-info">
              <div className="contact-label">REDMAGIC</div>
              <a 
                href="https://url.khoavo.i234.me/rm8pfix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                rm8pfix.khoavo.i234.me
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon zalo">🇻🇳</div>
            <div className="contact-info">
              <div className="contact-label">Zalo Group</div>
              <a 
                href="https://zalo.me/g/ywjwyv205" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                Join our Zalo Group
              </a>
            </div>
          </div>
        </div>

        <div className="contact-footer">
          <div className="swipe-indicator">
            <span>← Swipe to switch cards →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard; 
import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

const FloatingBadge = () => {
  const [rotation, setRotation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Rotate based on scroll position (proportional)
      const scrollPos = window.scrollY;
      setRotation(scrollPos * 0.2); // Adjust multiplier for rotation speed

      // Show badge only after certain scroll
      setIsVisible(scrollPos > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`floating-badge-container ${isVisible ? 'is-visible' : ''}`}>
      <div
        className="badge-wrapper"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="circular-text">
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="transparent"
          />
          <text className="badge-text" fill="var(--brand-red)">
            <textPath xlinkHref="#circlePath">
              AYAKA JOSEI CENTER • TRUSTED LPK JAPAN •&nbsp;
            </textPath>
          </text>
        </svg>
        <div className="badge-center">
          <Globe size={24} color="var(--brand-red)" />
        </div>
      </div>

      <style jsx="true">{`
        .floating-badge-container {
          position: fixed;
          bottom: 120px;
          right: 40px;
          z-index: 1000;
          opacity: 0;
          transform: scale(0.5) rotate(-45deg);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .floating-badge-container.is-visible {
          opacity: 1;
          transform: scale(1) rotate(0);
          pointer-events: auto;
        }

        .badge-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1), 0 0 0 8px rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .circular-text {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .badge-text {
          font-size: 8.5px;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .badge-center {
          position: relative;
          z-index: 2;
          background: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .floating-badge-container {
            bottom: 20px;
            right: 20px;
            transform: scale(0.8);
          }
          .floating-badge-container.is-visible {
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingBadge;

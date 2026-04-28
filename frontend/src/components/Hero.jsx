import React, { useEffect, useState } from 'react';
import { ArrowRight, Globe, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = ({ content }) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const data = content?.home || {
    title: 'AYAKA JOSEI CENTER',
    subtitle: 'Lembaga Pelatihan Kerja Jepang Spesialis Putri',
    buttonText: 'Pelajari Selengkapnya'
  };

  // Parallax calculations
  const bgTransform = `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`;
  const contentTransform = `translateY(${scrollY * -0.15}px)`;
  const glassTransform = `translateY(${scrollY * -0.25}px) rotate(${scrollY * 0.02}deg)`;

  return (
    <section id="home" className="hero-section">
      {/* Dynamic Background Image - PARALLAX ENABLED */}
      <div className="hero-bg-wrapper" style={{ transform: bgTransform }}>
        <img
          src="/assets/hero-bg.png"
          alt="Ayaka Josei Center Background"
          className={`hero-bg-image ${isLoaded ? 'is-loaded' : ''}`}
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Decorative Blur Shapes (Parallax) */}
      <div className="decorative-shapes">
        <div className="shape shape-red" style={{ transform: `translateY(${scrollY * -0.1}px)` }}></div>
        <div className="shape shape-teal" style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
      </div>

      <div className="container hero-container" style={{ transform: contentTransform }}>
        <div className="hero-content">
          <div className={`hero-badge ${isLoaded ? 'animate-up' : ''}`}>
            <span>{t('hero.tagline')}</span>
          </div>

          <h1 className={`hero-title ${isLoaded ? 'animate-up delay-1' : ''}`}>
            <span className="text-white">{t('hero.title').split(' ')[0]}</span>
            <span className="text-gradient"> {t('hero.title').split(' ').slice(1).join(' ')}</span>
          </h1>

          <p className={`hero-subtitle ${isLoaded ? 'animate-up delay-2' : ''}`}>
            {t('hero.subtitle')}
          </p>

          <div className={`hero-actions ${isLoaded ? 'animate-up delay-3' : ''}`}>
            <button className="btn-astra-main">
              <span>{t('hero.cta')}</span>
              <ArrowRight size={20} />
            </button>
            <button className="btn-astra-outline">
              <div className="play-btn-circle">
                <Play size={14} fill="white" />
              </div>
              <span>{t('hero.playVideo')}</span>
            </button>
          </div>
        </div>

        {/* AJC Floating Highlight - PARALLAX ENABLED */}
        <div className={`hero-highlight ${isLoaded ? 'animate-fade-in delay-4' : ''}`} style={{ transform: glassTransform }}>
          <div className="glass-card">
            <div className="glass-logo">
              <img
                src="/assets/logo ayakan.png"
                alt="AJC Logo"
                className="hero-logo-img"
              />
            </div>
            <div className="glass-info">
              <h3>AJC</h3>
              <p>{t('hero.highlight_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 0 80px;
          background: #020617;
          overflow: hidden;
        }

        .hero-bg-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
          will-change: transform;
        }

        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transform: scale(1.1);
          transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-bg-image.is-loaded {
          opacity: 0.55;
          transform: scale(1);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom, 
            rgba(2, 6, 23, 0.8) 0%, 
            rgba(2, 6, 23, 0.4) 50%, 
            rgba(2, 6, 23, 0.9) 100%
          );
        }

        .hero-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 4rem;
          will-change: transform;
        }

        @media (min-width: 1024px) {
          .hero-container {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .hero-content {
          max-width: 750px;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.6rem 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 2px;
          margin-bottom: 2.5rem;
          opacity: 0;
        }

        .hero-title {
          font-size: clamp(3.5rem, 10vw, 6rem);
          line-height: 1.05;
          font-weight: 900;
          margin-bottom: 1.5rem;
          letter-spacing: -3px;
          opacity: 0;
          text-shadow: 2px 4px 8px rgba(0,0,0,0.8); /* Stronger shadow */
        }

        .text-white { color: #ffffff; }

        .text-gradient {
          background: linear-gradient(to right, #ff4d4d, #da291c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 550px;
          line-height: 1.6;
          margin-bottom: 3.5rem;
          font-weight: 500;
          opacity: 0;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          opacity: 0;
        }

        .btn-astra-main {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--brand-red);
          color: white;
          padding: 1.4rem 3rem;
          border-radius: 50px;
          font-weight: 900;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 20px 40px -10px rgba(218, 41, 28, 0.5);
        }

        .btn-astra-main:hover {
          transform: translateY(-5px);
          background: #ff3a2b;
          box-shadow: 0 25px 50px -10px rgba(218, 41, 28, 0.6);
        }

        .btn-astra-outline {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          padding: 1.4rem 3rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-astra-outline:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: white;
        }

        .play-btn-circle {
          width: 36px;
          height: 36px;
          background: var(--brand-red);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Highlight Card */
        .glass-card {
          padding: 4rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.6);
          will-change: transform;
        }

        .glass-logo {
          width: 140px;
          height: 140px;
          background: white;
          color: var(--brand-red);
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        
        .hero-logo-img {
            width: 80%;
            height: 80%;
            object-fit: contain;
        }

        .glass-info { text-align: center; }
        .glass-info h3 { font-size: 3rem; font-weight: 900; letter-spacing: 5px; margin: 0; }
        .glass-info p { color: var(--brand-red); font-weight: 800; letter-spacing: 3px; font-size: 0.9rem; margin-top: 0.5rem; }

        /* Background Shapes */
        .decorative-shapes .shape {
          position: absolute;
          filter: blur(120px);
          border-radius: 50%;
          z-index: 1;
          opacity: 0.4;
          will-change: transform;
        }
        .shape-red { width: 500px; height: 500px; background: var(--brand-red); top: -10%; right: -5%; }
        .shape-teal { width: 400px; height: 400px; background: #2dd4bf; bottom: 10%; left: -5%; opacity: 0.1; }

        /* Animations */
        .animate-up { animation: heroRevealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 1.5s ease-out forwards; }
        
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.8s; }

        @keyframes heroRevealUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 3.5rem; }
          .hero-highlight { display: none; }
          .hero-section { text-align: center; }
          .hero-actions { justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default Hero;

import React, { useState, useEffect } from 'react';
import { Heart, Cpu, Hotel, Coffee, CheckCircle, Info, FileText, ArrowRight, Star, Target, Zap, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProgramPage = ({ content }) => {
    const { t } = useTranslation();
    const data = content?.program_halaman;
    const [activeProgram, setActiveProgram] = useState('kaigo');
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-revealed');
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.vangu-reveal').forEach(el => observer.observe(el));
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, [content]);

    if (!data) return <div className="vangu-loader">Preparing Program Experience...</div>;

    const programs = data.daftarProgram?.items || [];

    return (
        <div className="vangu-wrapper" style={{ '--scroll': scrollY }}>
            {/* 1. EDITORIAL HERO - ASYMMETRIC */}
            <header className="vangu-hero">
                <div className="hero-grid">
                    <div className="hero-text-side vangu-reveal reveal-left">
                        <div className="vangu-badge">{t('program.hero_edition')}</div>
                        <h1 className="hero-title-max">
                            {(t('program.hero_title') || '').split(' ').slice(0, 2).join(' ')} <br />
                            <span className="text-accent-red">{(t('program.hero_title') || '').split(' ').slice(2, 3)}</span> <br />
                            {(t('program.hero_title') || '').split(' ').slice(3).join(' ')}
                        </h1>
                        <p className="hero-desc-max">{t('program.hero_desc')}</p>
                        <div className="hero-cta-group">
                            <button className="vangu-btn-primary">{t('btn.jelajahi')}</button>
                            <div className="vangu-scroll-line"></div>
                        </div>
                    </div>
                    <div className="hero-visual-side vangu-reveal reveal-right">
                        <div className="vangu-image-mask">
                            <div className="mask-bg" style={{ transform: `scale(${1 + scrollY * 0.0005}) rotate(${scrollY * 0.01}deg)` }}></div>
                        </div>
                        <div className="floating-stat-card glass-morph">
                            <span className="stat-num">98%</span>
                            <span className="stat-label">{t('program.placement_rate')}</span>
                        </div>
                    </div>
                </div>
                <div className="large-bg-text">PROGRAM</div>
            </header>

            {/* 2. PENGANTAR - OFFSET BOX */}
            <section className="vangu-section intro-vangu">
                <div className="container">
                    <div className="asymmetric-intro vangu-reveal reveal-up">
                        <div className="intro-accent-box"></div>
                        <div className="intro-content-vangu">
                            <h2 className="vangu-heading-large">{t('program.pengantar.title', { defaultValue: data.pengantar?.title })}</h2>
                            <p className="vangu-p-large">{t('program.pengantar.content', { defaultValue: data.pengantar?.content })}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. INTERACTIVE PROGRAM PANELS */}
            <section className="vangu-section bg-vangu-dark">
                <div className="container-full">
                    <div className="section-meta-center vangu-reveal reveal-up">
                        <span className="meta-tag">{t('program.specializations')}</span>
                        <h2 className="vangu-heading-white center">{t('program.listing.title', { defaultValue: data.daftarProgram?.title })}</h2>
                        <div className="interaction-hint">
                            <span className="hint-line"></span>
                            <span className="hint-text">{t('program.interaction_hint')}</span>
                            <span className="hint-line"></span>
                        </div>
                    </div>

                    <div className="program-panels-vangu">
                        {programs.map((prog, idx) => (
                            <div
                                key={prog.id}
                                className={`vangu-panel ${activeProgram === prog.id ? 'is-active' : ''}`}
                                onMouseEnter={() => setActiveProgram(prog.id)}
                                onClick={() => setActiveProgram(prog.id)}
                            >
                                <div className="panel-bg-overlay"></div>
                                <div className="panel-content">
                                    <div className="panel-header-lux">
                                        <div className="panel-number">0{idx + 1}</div>
                                        {activeProgram !== prog.id && <div className="explore-label">{t('program.explore')} <ArrowRight size={14} /></div>}
                                    </div>
                                    <div className="panel-icon-box">
                                        {prog.id === 'kaigo' && <Heart size={32} />}
                                        {prog.id === 'industri' && <Cpu size={32} />}
                                        {prog.id === 'hospitality' && <Hotel size={32} />}
                                        {prog.id === 'fb' && <Coffee size={32} />}
                                    </div>
                                    <h3 className="panel-title">{t(`program.${prog.id}.name`, { defaultValue: prog.name })}</h3>
                                    <div className="panel-details-reveal">
                                        <p className="panel-desc-lux">{t(`program.${prog.id}.desc`, { defaultValue: prog.desc })}</p>
                                        <div className="panel-grid-lux">
                                            <div className="panel-info-block">
                                                <Target size={18} className="text-red" />
                                                <div>
                                                    <span className="block-label">{t('program.tasks_label')}</span>
                                                    <p>{t(`program.${prog.id}.tasks`, { defaultValue: prog.tasks })}</p>
                                                </div>
                                            </div>
                                            {prog.qualifications && (
                                                <div className="panel-info-block">
                                                    <Star size={18} className="text-red" />
                                                    <div>
                                                        <span className="block-label">{t('program.qual_label')}</span>
                                                        <p>{prog.qualifications}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. PERSYARATAN - CIRCULAR / RADIAL LAYOUT */}
            <section className="vangu-section">
                <div className="container">
                    <div className="radial-requirements">
                        <div className="radial-center vangu-reveal reveal-scale">
                            <div className="center-inner">
                                <Shield size={40} className="text-red" />
                                <span>{t('program.min_req').split(' ').slice(0, 1)} <br /> {t('program.min_req').split(' ').slice(1).join(' ')}</span>
                            </div>
                        </div>
                        <div className="radial-items">
                            {(data.persyaratan?.items || []).map((item, idx) => (
                                <div key={idx} className={`radial-item item-${idx + 1} vangu-reveal reveal-up`}>
                                    <div className="item-label">0{idx + 1}</div>
                                    <p>{t(`program.req.item_${idx}`, { defaultValue: item })}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FASILITAS - BENTO BOX GRID */}
            <section className="vangu-section bg-vangu-soft">
                <div className="container">
                    <div className="section-meta vangu-reveal reveal-up">
                        <h2 className="vangu-heading-large">{t('program.facility.title', { defaultValue: data.fasilitas?.title })}</h2>
                    </div>
                    <div className="bento-grid-vangu">
                        {(data.fasilitas?.items || []).map((item, idx) => (
                            <div key={idx} className={`bento-tile tile-${idx + 1} vangu-reveal reveal-up`}>
                                <div className="bento-icon"><CheckCircle size={24} /></div>
                                <div className="bento-content">
                                    <h4>{t(`program.facility.item_${idx}.title`, { defaultValue: item.label })}</h4>
                                    <p>{t(`program.facility.item_${idx}.desc`, { defaultValue: item.desc })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. ALUR - ANIMATED SNAKEPATH */}
            <section className="vangu-section">
                <div className="container">
                    <div className="section-header-vangu center vangu-reveal reveal-up">
                        <h2 className="vangu-heading-large">{t('program.alur.title', { defaultValue: data.alurSingkat?.title })}</h2>
                    </div>
                    <div className="snakepath-container">
                        <div className="vangu-line-draw"></div>
                        {(data.alurSingkat?.steps || []).map((step, idx) => (
                            <div key={idx} className={`snakepath-node node-${idx % 2 === 0 ? 'left' : 'right'} vangu-reveal reveal-up`}>
                                <div className="node-num">{step.num}</div>
                                <div className="node-box">
                                    <h4>{t(`program.alur.step_${idx}.title`, { defaultValue: step.title })}</h4>
                                    <p>{t(`program.alur.step_${idx}.desc`, { defaultValue: step.desc })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. DISCLAIMER - MODERN ALERT BOX */}
            <section className="vangu-section">
                <div className="container">
                    <div className="modern-disclaimer vangu-reveal reveal-up">
                        <div className="disc-icon"><FileText size={30} /></div>
                        <div className="disc-text">
                            <h3>{t('program.disclaimer.title', { defaultValue: data.disclaimerLegal?.title })}</h3>
                            <p>{t('program.disclaimer.content', { defaultValue: data.disclaimerLegal?.content })}</p>
                            <span className="disc-tag">{t('program.disclaimer.importance', { defaultValue: data.disclaimerLegal?.importance })}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CTA - SPLIT IMPACT */}
            <section className="vangu-cta-section">
                <div className="cta-grid-vangu">
                    <div className="cta-image-vangu vangu-reveal reveal-left"></div>
                    <div className="cta-text-vangu vangu-reveal reveal-right">
                        <span className="cta-accent">{t('section.konsultasi_gratis')}</span>
                        <h2 className="cta-title-vangu">{t('program.cta.title', { defaultValue: data.ajakanKonsultasi?.title })}</h2>
                        <p className="cta-desc-vangu">{t('program.cta.content', { defaultValue: data.ajakanKonsultasi?.content })}</p>
                        <button className="vangu-btn-max">
                            {t('program.cta.btn', { defaultValue: data.ajakanKonsultasi?.cta })} <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </section>

            <style jsx="true">{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Playfair+Display:ital,wght@1,900&display=swap');

                .vangu-wrapper {
                    --bg-red: #da291c;
                    --bg-dark: #0f172a;
                    --bg-soft: #f1f5f9;
                    background: #fff;
                    padding-top: 0; /* Remove padding to allow hero to underlay navbar */
                    overflow-x: hidden;
                }

                /* NAVBAR OVERLAY FIX */
                :global(.navbar) {
                    background: transparent !important;
                    box-shadow: none !important;
                    position: absolute !important;
                    width: 100%;
                    z-index: 1000;
                }

                /* Ensure mobile toggle is visible */
                :global(.navbar .mobile-toggle), 
                :global(.navbar .menu-icon) {
                    color: var(--bg-dark) !important;
                    z-index: 1001;
                }
                
                :global(.navbar-scrolled) {
                    background: rgba(255,255,255,0.95) !important;
                    backdrop-filter: blur(15px);
                    position: fixed !important;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                :global(.navbar-scrolled .mobile-toggle), 
                :global(.navbar-scrolled .menu-icon) {
                    color: var(--bg-dark) !important;
                }

                .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
                .container-full { max-width: 1800px; margin: 0 auto; padding: 0 4rem; }

                /* REVEAL LOGIC */
                .vangu-reveal { opacity: 0; transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal-up { transform: translateY(60px); }
                .reveal-left { transform: translateX(-60px); }
                .reveal-right { transform: translateX(60px); }
                .reveal-scale { transform: scale(0.8); }
                .is-revealed { opacity: 1; transform: translate(0, 0) scale(1); }

                /* HERO - ASYMMETRIC VOGUE STYLE */
                .vangu-hero {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    position: relative;
                    padding: 8rem 0;
                }

                .hero-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 4rem;
                    width: 100%;
                    z-index: 10;
                }

                .hero-text-side { position: relative; }
                .vangu-badge { font-weight: 900; letter-spacing: 5px; color: var(--bg-red); font-size: 0.8rem; margin-bottom: 2rem; }
                
                .hero-title-max {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(3.5rem, 10vw, 8rem);
                    font-weight: 900;
                    line-height: 1;
                    color: var(--bg-dark);
                    letter-spacing: -4px;
                    margin-bottom: 3rem;
                    text-transform: uppercase;
                }

                .text-accent-red {
                    color: var(--bg-red);
                    letter-spacing: -2px;
                }

                .hero-desc-max {
                    font-size: 1.4rem;
                    color: #475569;
                    max-width: 500px;
                    line-height: 1.6;
                    margin-bottom: 4rem;
                }

                .hero-cta-group { display: flex; align-items: center; gap: 3rem; }
                .vangu-btn-primary {
                    background: var(--bg-dark);
                    color: white;
                    border: none;
                    padding: 1.5rem 3rem;
                    font-weight: 900;
                    font-size: 1rem;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .vangu-btn-primary:hover { background: var(--bg-red); transform: translateY(-5px); }

                .vangu-scroll-line { width: 100px; height: 1px; background: #cbd5e1; position: relative; }
                .vangu-scroll-line::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 40px; height: 1px;
                    background: var(--bg-red);
                    animation: dash 2s infinite;
                }

                @keyframes dash {
                    0% { transform: translateX(0); width: 0; }
                    50% { transform: translateX(30px); width: 40px; }
                    100% { transform: translateX(100px); width: 0; }
                }

                .hero-visual-side { position: relative; }
                .vangu-image-mask {
                    width: 100%;
                    height: 700px;
                    background: var(--bg-soft);
                    border-radius: 40px;
                    overflow: hidden;
                    position: relative;
                }
                .mask-bg {
                    width: 100%; height: 100%;
                    background: url('/assets/hero-bg.png') center/cover;
                    opacity: 0.8;
                }

                .floating-stat-card {
                    position: absolute;
                    bottom: 40px;
                    left: -60px;
                    padding: 3rem;
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(20px);
                    border-radius: 30px;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .stat-num { font-size: 3rem; font-weight: 900; color: var(--bg-red); }
                .stat-label { font-weight: 800; opacity: 0.5; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px; }

                .large-bg-text {
                    position: absolute;
                    bottom: -50px;
                    right: -100px;
                    font-size: 25vw;
                    font-weight: 900;
                    color: #f1f5f9;
                    z-index: 1;
                    user-select: none;
                }

                /* SECTION BASICS */
                .vangu-section { padding: 12rem 0; position: relative; z-index: 10; }
                .bg-vangu-dark { background: var(--bg-dark); color: white; }
                .bg-vangu-soft { background: var(--bg-soft); }

                /* INTRO - ASYMMETRIC */
                .asymmetric-intro { position: relative; display: flex; align-items: center; }
                .intro-accent-box { width: 300px; height: 400px; background: var(--bg-soft); position: absolute; left: -100px; top: -50px; z-index: -1; border-radius: 40px; }
                .intro-content-vangu { max-width: 800px; margin-left: 100px; }
                .vangu-heading-large { font-family: 'Outfit', sans-serif; font-size: clamp(2.2rem, 8vw, 4rem); font-weight: 900; color: var(--bg-dark); letter-spacing: -2px; margin-bottom: 2rem; }
                .vangu-heading-white { font-family: 'Outfit', sans-serif; font-size: clamp(2.2rem, 8vw, 4rem); font-weight: 900; color: #fff; letter-spacing: -2px; margin-bottom: 2rem; }
                .vangu-p-large { font-size: clamp(1.4rem, 2.5vw, 2rem); line-height: 1.4; color: #334155; font-weight: 400; }

                /* INTERACTION HINT */
                .interaction-hint { display: flex; align-items: center; justify-content: center; gap: 2rem; margin-top: 1rem; opacity: 0.5; }
                .hint-line { width: 50px; height: 1px; background: rgba(255,255,255,0.3); }
                .hint-text { font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #fff; }

                /* PROGRAM PANELS - DYNAMIC REVEAL */
                .program-panels-vangu {
                    display: flex;
                    height: 650px;
                    gap: 1.5rem;
                    margin-top: 5rem;
                }

                .vangu-panel {
                    flex: 1;
                    height: 100%;
                    background: #1e293b;
                    border-radius: 40px;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                    padding: 4rem 3rem;
                    display: flex;
                    flex-direction: column;
                }

                .vangu-panel.is-active { flex: 3; background: var(--bg-red); }

                .panel-bg-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6)); opacity: 0.6; }
                
                .panel-content { position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; color: white; width: 100%; }
                
                .panel-header-lux { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
                .panel-number { font-size: 1.2rem; font-weight: 900; opacity: 0.4; }
                .explore-label { font-size: 0.7rem; font-weight: 900; letter-spacing: 2px; background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 100px; display: flex; align-items: center; gap: 0.5rem; }

                .panel-icon-box { margin-bottom: 2rem; transform-origin: left; transition: 0.5s; }
                .is-active .panel-icon-box { transform: scale(1.5); color: #fff; }

                .panel-title { font-size: 2.2rem; font-weight: 900; margin-bottom: 2rem; transition: 0.5s; line-height: 1.1; }
                .is-active .panel-title { font-size: 3.2rem; margin-bottom: 3rem; }

                .panel-details-reveal { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s; pointer-events: none; overflow: hidden; height: 0; }
                .is-active .panel-details-reveal { opacity: 1; transform: translateY(0); pointer-events: auto; height: auto; }

                .panel-desc-lux { font-size: 1.2rem; opacity: 0.9; margin-bottom: 3rem; line-height: 1.6; max-width: 600px; }
                
                .panel-grid-lux { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 2.5rem; }
                .panel-info-block { display: flex; gap: 1.2rem; align-items: flex-start; }
                .block-label { display: block; font-size: 0.7rem; font-weight: 900; letter-spacing: 2px; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; }
                .panel-info-block p { font-size: 1rem; font-weight: 700; line-height: 1.4; color: #fff; }

                /* RADIAL REQUIREMENTS */
                .radial-requirements { position: relative; height: 600px; display: flex; align-items: center; justify-content: center; margin: 4rem 0; }
                .radial-center {
                    width: 250px; height: 250px;
                    background: var(--bg-dark);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    z-index: 10;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.2);
                }
                .center-inner span { font-weight: 900; letter-spacing: 2px; font-size: 0.8rem; margin-top: 1rem; display: block; }
                
                .radial-item { position: absolute; width: 280px; padding: 2rem; background: #fff; border: 1px solid #cbd5e1; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.08); transition: 0.4s; z-index: 5; }
                .radial-item:hover { transform: translateY(-5px) scale(1.05); border-color: var(--bg-red); z-index: 20; }
                .radial-item:hover { transform: translateY(-5px); border-color: var(--bg-red); }
                .item-label { color: var(--bg-red); font-weight: 900; margin-bottom: 0.5rem; }
                .radial-item p { font-weight: 700; color: #1e293b; line-height: 1.4; font-size: 0.95rem; }

                .item-1 { top: -20px; left: 0; }
                .item-2 { top: 0; right: 0; }
                .item-3 { bottom: -20px; right: 50px; }
                .item-4 { bottom: 0; left: 50px; }
                .item-5 { top: 40%; left: -80px; } /* Improved spacing */
                
                /* Ensure no overlap by checking screen width media queries below */

                /* BENTO GRID */
                .bento-grid-vangu { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); gap: 1.5rem; height: 600px; margin-top: 5rem; }
                .bento-tile { background: white; border-radius: 40px; padding: 3rem; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1); transition: 0.4s; }
                .bento-tile:hover { transform: scale(1.02); box-shadow: 0 30px 60px rgba(0,0,0,0.05); }
                .tile-1 { grid-column: span 2; grid-row: span 2; background: var(--bg-dark); color: white; }
                .tile-2 { grid-column: span 2; background: #fff; }
                .tile-3 { background: var(--bg-red); color: white; }
                .tile-4 { background: #f8fafc; }

                .bento-icon { margin-bottom: 2rem; color: inherit; }
                .tile-2 .bento-icon, .tile-4 .bento-icon { color: var(--bg-red); }
                .bento-content h4 { font-size: 1.8rem; font-weight: 900; margin-bottom: 1rem; color: var(--bg-dark); }
                .tile-1 .bento-content h4, .tile-3 .bento-content h4 { color: white; }
                
                .bento-content p { font-size: 1.1rem; line-height: 1.6; font-weight: 600; color: #334155; }
                .tile-1 .bento-content p, .tile-3 .bento-content p { color: rgba(255,255,255,0.9); font-weight: 500; }

                /* SNAKEPATH - FLOW */
                .snakepath-container { position: relative; margin-top: 8rem; padding: 2rem 0; }
                .vangu-line-draw { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: #e2e8f0; transform: translateX(-50%); z-index: -1; }
                
                .snakepath-node { display: flex; position: relative; margin-bottom: 6rem; width: 50%; }
                .node-left { margin-right: auto; padding-right: 6rem; text-align: right; justify-content: flex-end; }
                .node-right { margin-left: auto; padding-left: 6rem; text-align: left; justify-content: flex-start; }

                .node-num { font-size: 1.2rem; font-weight: 900; color: var(--bg-red); width: 60px; height: 60px; background: white; border: 2px solid var(--bg-red); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; top: 0; z-index: 10; }
                .node-left .node-num { right: -30px; }
                .node-right .node-num { left: -30px; }

                .node-box { background: #f8fafc; padding: 3rem; border-radius: 30px; width: 100%; max-width: 450px; transition: 0.4s; border: 1px solid #e2e8f0; }
                .node-box:hover { background: var(--bg-dark); color: white; transform: scale(1.05); border-color: var(--bg-dark); }
                .node-box:hover h4, .node-box:hover p { color: white; }
                
                .node-box h4 { font-size: 1.6rem; font-weight: 900; margin-bottom: 1rem; color: var(--bg-dark); }
                .node-box p { font-size: 1.1rem; line-height: 1.6; color: #334155; font-weight: 500; opacity: 1; }

                /* MODERN DISCLAIMER */
                .modern-disclaimer { display: flex; gap: 3rem; background: #fdf2f2; padding: 5rem; border-radius: 50px; border-left: 15px solid var(--bg-red); }
                .disc-icon { color: var(--bg-red); }
                .disc-text h3 { font-size: 2.4rem; font-weight: 900; margin-bottom: 1rem; color: var(--bg-dark); }
                .disc-text p { font-size: 1.2rem; line-height: 1.6; color: #475569; margin-bottom: 2rem; }
                .disc-tag { display: inline-block; padding: 0.6rem 1.5rem; background: var(--bg-red); color: white; font-weight: 900; border-radius: 100px; font-size: 0.8rem; }

                /* CTA GRID */
                .vangu-cta-section { min-height: 70vh; background: #fff; }
                .cta-grid-vangu { display: grid; grid-template-columns: 1fr 1fr; min-height: 70vh; }
                .cta-image-vangu { background: url('/assets/hero-bg.png') center/cover; }
                .cta-text-vangu { padding: 8rem; display: flex; flex-direction: column; justify-content: center; background: var(--bg-dark); color: white; }
                .cta-accent { color: var(--bg-red); font-weight: 900; letter-spacing: 4px; margin-bottom: 2rem; font-size: 0.8rem; }
                .cta-title-vangu { font-size: 4rem; font-weight: 900; margin-bottom: 2rem; line-height: 1; letter-spacing: -2px; }
                .cta-desc-vangu { font-size: 1.4rem; opacity: 0.6; margin-bottom: 4rem; max-width: 500px; }
                .vangu-btn-max { padding: 2rem 4rem; background: var(--bg-red); color: white; border: none; font-weight: 900; font-size: 1.2rem; border-radius: 100px; display: inline-flex; align-items: center; gap: 1.5rem; cursor: pointer; transition: 0.3s; width: fit-content; }
                .vangu-btn-max:hover { transform: translateX(10px) scale(1.05); }

                @media (max-width: 1200px) {
                    .container, .container-full { padding: 0 2rem; }
                    .hero-grid { grid-template-columns: 1fr; text-align: center; padding-top: 120px; }
                    .hero-cta-group { justify-content: center; flex-direction: column; gap: 2rem; }
                    .hero-visual-side { display: none; }
                    
                    .program-panels-vangu { flex-direction: column; height: auto; gap: 1rem; }
                    .vangu-panel { flex: none; height: auto; min-height: 120px; padding: 2.5rem 2rem; }
                    .vangu-panel.is-active { flex: none; height: auto; min-height: 400px; }
                    
                    .panel-header-lux { margin-bottom: 1.5rem; }
                    .is-active .panel-title { font-size: 2.5rem; margin-bottom: 2rem; }
                    .panel-grid-lux { grid-template-columns: 1fr; gap: 1.5rem; }
                    
                    .bento-grid-vangu { grid-template-columns: 1fr; grid-template-rows: auto; height: auto; }
                    .tile-1, .tile-2 { grid-column: span 1; grid-row: span 1; }
                    .tile-1 .bento-content h4 { font-size: 2.2rem; }
                    
                    .snakepath-node { width: 100%; margin-left: 0; margin-right: 0; padding: 0 0 0 4rem; text-align: left; justify-content: flex-start; }
                    .vangu-line-draw { left: 30px; transform: none; }
                    .node-num { left: 0 !important; right: auto !important; }
                    .node-box { max-width: 100%; padding: 2rem; }
                    
                    .radial-requirements { height: auto; flex-direction: column; gap: 1.5rem; }
                    .radial-item { position: static; width: 100%; padding: 2rem; }
                    .radial-center { margin: 2rem auto; width: 200px; height: 200px; }
                    
                    .cta-grid-vangu { grid-template-columns: 1fr; }
                    .cta-image-vangu { display: none; }
                    .cta-text-vangu { padding: 5rem 2rem; text-align: center; align-items: center; }
                    .cta-title-vangu { font-size: 2.8rem; }
                    
                    .modern-disclaimer { flex-direction: column; padding: 3rem 2rem; gap: 2rem; text-align: center; align-items: center; border-left: none; border-top: 10px solid var(--bg-red); }
                    .vangu-heading-large { font-size: 2.8rem; text-align: center; }
                    .intro-content-vangu { margin-left: 0; text-align: center; }
                    .intro-accent-box { display: none; }
                }

                @media (max-width: 768px) {
                    .hero-title-max { font-size: 3.5rem; letter-spacing: -2px; }
                    .vangu-p-large { font-size: 1.3rem; }
                    .vangu-heading-large { font-size: 2.22rem; }
                    .panel-title { font-size: 1.8rem; }
                    .is-active .panel-title { font-size: 2.2rem; }
                }

                .vangu-loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 2rem; letter-spacing: 5px; color: var(--bg-dark); }
            `}</style>
        </div>
    );
};

export default ProgramPage;

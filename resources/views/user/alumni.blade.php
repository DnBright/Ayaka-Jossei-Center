import React, { useEffect, useState } from 'react';
import { Users, Quote, Shield, ExternalLink, MapPin, Award, CheckCircle, ChevronRight, MessageCircle, Star, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AlumniPage = ({ content }) => {
    const { t } = useTranslation();
    const data = content?.alumni_halaman;
    const [activeFilter, setActiveFilter] = useState('all');
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleMouseMove = (e) => {
            setMouseX((e.clientX / window.innerWidth - 0.5) * 40);
            setMouseY((e.clientY / window.innerHeight - 0.5) * 40);
        };
        window.addEventListener('mousemove', handleMouseMove);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-revealed');
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.circle-reveal').forEach(el => observer.observe(el));
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
        };
    }, [content]);

    if (!data) return <div className="circle-loader">Connecting Community...</div>;

    const filteredAlumni = (data.daftarAlumni || []).filter(al =>
        activeFilter === 'all' || al.status === activeFilter
    );

    // Split testimonials for marquee
    const testiRow1 = [...(data.testimoni || []), ...(data.testimoni || [])];
    const testiRow2 = [...(data.testimoni || []), ...(data.testimoni || [])].reverse();

    return (
        <div className="circle-wrapper">
            {/* 1. DYNAMIC SPHERE HERO */}
            <header className="circle-hero-vangu">
                <div className="vangu-bg-glass">
                    <div className="glass-blob blob-1"></div>
                    <div className="glass-blob blob-2"></div>
                </div>

                <div className="circle-container">
                    <div className="hero-split-vangu">
                        <div className="hero-text-vangu circle-reveal reveal-left">
                            <div className="badge-official-vangu">
                                <Sparkles size={14} /> <span>{t('alumni.hero.badge')}</span>
                            </div>
                            <h1 className="hero-title-max">
                                {t('alumni.hero.title')}
                            </h1>
                            <div className="vangu-line-accent"></div>
                            <p className="hero-p-lux">{t('alumni.pengantar', { defaultValue: data.pengantar?.content })}</p>

                            <div className="hero-cta-vangu">
                                <button className="btn-vangu-dark">{t('alumni.hero.cta')}</button>
                                <div className="hero-avatars-min">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="mini-av"></div>)}
                                    <span>{t('alumni.hero.join_count')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="hero-visual-sphere circle-reveal reveal-right"
                            style={{ transform: `translate3d(${mouseX}px, ${mouseY}px, 0)` }}>
                            <div className="main-sphere">
                                <div className="sphere-glow"></div>
                                <div className="sphere-inner">
                                    <Users size={120} strokeWidth={0.5} color="rgba(218, 41, 28, 0.2)" />
                                </div>
                                {/* Floating Profile Orbits */}
                                {data.daftarAlumni?.slice(0, 4).map((al, idx) => (
                                    <div key={al.id} className={`orbit-profile orbit-${idx + 1}`}>
                                        <div className="orbit-img-box">
                                            <img src={al.image} alt="" />
                                        </div>
                                        <div className="orbit-info">
                                            <span>{al.name}</span>
                                            <p>{al.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. INFINITE TESTIMONIAL MARQUEE - REPLACING MONOTONOUS GRID */}
            <section className="marquee-section bg-vangu-dark">
                <div className="marquee-header circle-reveal reveal-up">
                    <h2 className="vangu-heading-white">{t('alumni.marquee.title')}</h2>
                </div>

                <div className="marquee-container">
                    <div className="marquee-track row-1">
                        {testiRow1.map((t, i) => (
                            <div key={`t1-${i}`} className="marquee-item-lux">
                                <Quote className="q-icon-min" />
                                <p>{t.quote}</p>
                                <div className="t-author-min">
                                    <strong>{t.name}</strong>
                                    <span>{t.program}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="marquee-track row-2">
                        {testiRow2.map((t, i) => (
                            <div key={`t2-${i}`} className="marquee-item-lux alt">
                                <Quote className="q-icon-min" />
                                <p>{t.quote}</p>
                                <div className="t-author-min">
                                    <strong>{t.name}</strong>
                                    <span>{t.program}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. BENTO STORY GRID - NON-MONOTONOUS LAYOUT */}
            <section className="circle-section bento-stories-box">
                <div className="circle-container">
                    <div className="bento-header circle-reveal reveal-up">
                        <span className="vangu-tag">{t('alumni.bento.tag')}</span>
                        <h2 className="vangu-heading-large">{t('alumni.bento.title')}</h2>
                    </div>

                    <div className="bento-grid-vangu">
                        {(data.ceritaAlumni || []).map((story, idx) => (
                            <div key={story.id} className={`bento-story-item item-${idx + 1} circle-reveal reveal-up`}>
                                <div className="bento-story-inner">
                                    <div className="bento-meta">
                                        <span className="b-tag">{t('alumni.bento.item_tag')}</span>
                                        <span className="b-author">{story.author}</span>
                                    </div>
                                    <h3>{story.title === "Perjalanan Menuju Kyoto" ? t('alumni.story.kyoto.title') : story.title}</h3>
                                    <p>{story.title === "Perjalanan Menuju Kyoto" ? t('alumni.story.kyoto.content') : story.story}</p>
                                    <button className="b-link">{t('btn.read_full_story')} <ChevronRight size={16} /></button>
                                </div>
                                <div className="bento-decor">
                                    <Award size={80} className="decor-icon" />
                                </div>
                            </div>
                        ))}
                        {/* Placeholder for visual balance if only 1 story */}
                        {data.ceritaAlumni?.length === 1 && (
                            <div className="bento-visual-placeholder circle-reveal reveal-up">
                                <div className="placeholder-content">
                                    <Heart size={40} className="text-red" />
                                    <h4>{t('alumni.bento.placeholder_title')}</h4>
                                    <p>{t('alumni.bento.placeholder_desc')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. FILTERED DIRECTORY - REFINED & LUX */}
            <section className="circle-section directory-vangu">
                <div className="circle-container">
                    <div className="directory-header-lux circle-reveal reveal-up">
                        <h2 className="vangu-heading-mid">{t('alumni.directory.title')}</h2>
                        <div className="vangu-filters">
                            {(data.filter || []).map(f => (
                                <button
                                    key={f.id}
                                    className={`vangu-filter-btn ${activeFilter === f.id ? 'is-active' : ''}`}
                                    onClick={() => setActiveFilter(f.id)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vangu-alumni-grid">
                        {filteredAlumni.map((al, idx) => (
                            <div key={al.id} className="vangu-alumni-card circle-reveal reveal-up" style={{ transitionDelay: `${idx * 0.05}s` }}>
                                <div className="vangu-av-frame">
                                    <img src={al.image} alt={al.name} />
                                    <div className="vangu-av-overlay">
                                        <ExternalLink size={20} />
                                    </div>
                                </div>
                                <div className="vangu-alumni-body">
                                    <div className="vangu-alumni-meta">
                                        <span className={`vangu-status ${al.status}`}>{al.status}</span>
                                        <span className="vangu-year">'{(al.year || '').slice(-2)}</span>
                                    </div>
                                    <h3>{al.name}</h3>
                                    <p><MapPin size={12} /> {al.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. TRANSPARENCY - REFINED SECURITY BOX */}
            <section className="circle-section trans-vangu">
                <div className="circle-container">
                    <div className="vangu-trans-box circle-reveal reveal-up">
                        <div className="vangu-trans-grid">
                            <div className="vangu-trans-icon">
                                <Shield size={48} />
                                <div className="pulse-ring"></div>
                            </div>
                            <div className="vangu-trans-text">
                                <h3>{t('alumni.transparansi.title', { defaultValue: data.transparansi?.title })}</h3>
                                <div className="vangu-trans-line"></div>
                                <p>{t('alumni.transparansi.content', { defaultValue: data.transparansi?.content })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PENUTUP - FINAL SIGNATURE VANGUARD */}
            <footer className="circle-footer-vangu bg-vangu-soft">
                <div className="circle-container">
                    <div className="vangu-footer-inner circle-reveal reveal-up">
                        <div className="vangu-footer-decor">A</div>
                        <h2 className="vangu-footer-h">{t('alumni.penutup', { defaultValue: data.penutup?.content })}</h2>
                        <button className="btn-vangu-red">
                            {t('btn.join_success')} <ArrowRight size={20} />
                        </button>
                        <div className="vangu-footer-meta">
                            <span>{t('alumni.footer.archive_series')}</span>
                            <span className="vangu-meta-dot"></span>
                            <span>VERSION 2026.01</span>
                            <span className="vangu-meta-dot"></span>
                            <span>AYAKA LPK CENTER</span>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx="true">{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Playfair+Display:ital,wght@1,900&display=swap');

                .circle-wrapper {
                    --at-red: #da291c;
                    --at-dark: #0f172a;
                    --at-grey: #64748b;
                    --at-soft: #f8fafc;
                    background: #fff;
                    overflow-x: hidden;
                }

                .circle-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

                /* REVEAL LOGIC */
                .circle-reveal { opacity: 0; transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal-up { transform: translateY(60px); }
                .reveal-left { transform: translateX(-60px); }
                .reveal-right { transform: translateX(60px); }
                .is-revealed { opacity: 1; transform: translate(0, 0); }

                /* VANGUARD HERO */
                .circle-hero-vangu {
                    min-height: 95vh;
                    display: flex;
                    align-items: center;
                    position: relative;
                    background: #fff;
                    padding-top: 100px;
                }

                .vangu-bg-glass {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    pointer-events: none;
                }
                .glass-blob { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15; }
                .blob-1 { width: 600px; height: 600px; background: var(--at-red); top: -100px; left: -100px; }
                .blob-2 { width: 400px; height: 400px; background: #3b82f6; bottom: 100px; right: 0; }

                .hero-split-vangu {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6rem;
                    align-items: center;
                    position: relative;
                    z-index: 10;
                }

                .badge-official-vangu {
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                    background: #f1f5f9;
                    padding: 0.8rem 1.5rem;
                    border-radius: 100px;
                    font-weight: 900;
                    font-size: 0.75rem;
                    color: var(--at-dark);
                    letter-spacing: 2px;
                    margin-bottom: 2.5rem;
                }

                .hero-title-max {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(4rem, 12vw, 8.5rem);
                    font-weight: 900;
                    line-height: 0.85;
                    color: var(--at-dark);
                    letter-spacing: -6px;
                    margin-bottom: 3rem;
                }
                .text-outline { color: transparent; -webkit-text-stroke: 1.5px var(--at-dark); }
                .hero-title-max i { font-family: 'Playfair Display', serif; font-style: italic; color: var(--at-red); }

                .vangu-line-accent { width: 80px; height: 5px; background: var(--at-red); margin-bottom: 3rem; }
                .hero-p-lux { font-size: 1.4rem; color: var(--at-grey); line-height: 1.5; max-width: 500px; margin-bottom: 4rem; }

                .hero-cta-vangu { display: flex; align-items: center; gap: 3rem; }
                .btn-vangu-dark {
                    padding: 1.5rem 3.5rem;
                    background: var(--at-dark);
                    color: white;
                    border: none;
                    border-radius: 100px;
                    font-weight: 900;
                    font-size: 0.9rem;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: 0.4s;
                }
                .btn-vangu-dark:hover { background: var(--at-red); transform: scale(1.05); }

                .hero-avatars-min { display: flex; align-items: center; gap: -10px; }
                .mini-av { width: 35px; height: 35px; border-radius: 50%; background: #e2e8f0; border: 2px solid white; margin-left: -10px; }
                .hero-avatars-min span { font-size: 0.85rem; font-weight: 800; color: var(--at-dark); margin-left: 1rem; }

                /* SUCCESS SPHERE VISUAL */
                .hero-visual-sphere { position: relative; width: 100%; height: 600px; display: flex; align-items: center; justify-content: center; }
                .main-sphere {
                    width: clamp(250px, 40vw, 400px); 
                    height: clamp(250px, 40vw, 400px);
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.05);
                }
                .sphere-glow { position: absolute; inset: -20px; border-radius: 50%; background: radial-gradient(circle, rgba(218,41,28,0.05) 0%, transparent 70%); }
                
                .orbit-profile {
                    position: absolute;
                    background: white;
                    padding: 0.8rem;
                    border-radius: 100px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 1px solid #f1f5f9;
                    transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                }
                .orbit-profile:hover { transform: scale(1.1) !important; z-index: 100; border-color: var(--at-red); }

                .orbit-img-box { width: 50px; height: 50px; border-radius: 50%; overflow: hidden; background: #f1f5f9; }
                .orbit-img-box img { width: 100%; height: 100%; object-fit: cover; }
                
                .orbit-info span { font-weight: 900; font-size: 0.85rem; color: var(--at-dark); display: block; }
                .orbit-info p { font-size: 0.7rem; font-weight: 800; color: var(--at-red); letter-spacing: 1px; }

                .orbit-1 { top: -10%; left: 0; transform: rotate(-5deg); animation: float 6s ease-in-out infinite; }
                .orbit-2 { top: 20%; right: -20%; transform: rotate(5deg); animation: float 6s ease-in-out infinite 1s; }
                .orbit-3 { bottom: 10%; left: -10%; transform: rotate(-8deg); animation: float 6s ease-in-out infinite 2.5s; }
                .orbit-4 { bottom: -5%; right: 10%; transform: rotate(3deg); animation: float 6s ease-in-out infinite 4s; }

                @keyframes float { 0%, 100% { transform: translateY(0) rotate(var(--rot)); } 50% { transform: translateY(-20px) rotate(var(--rot)); } }

                /* INFINITE MARQUEE */
                .marquee-section { padding: 8rem 0; overflow: hidden; background: var(--at-dark); }
                .vangu-heading-white { 
                    font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 900; 
                    color: white; text-align: center; margin-bottom: 5rem; letter-spacing: -1px;
                }
                .vangu-heading-white i { font-family: 'Playfair Display', serif; font-style: italic; color: var(--at-red); }

                .marquee-container { display: flex; flex-direction: column; gap: 3rem; }
                .marquee-track { display: flex; gap: 3rem; width: max-content; }
                
                .row-1 { animation: marqueeL 60s linear infinite; }
                .row-2 { animation: marqueeR 60s linear infinite; }

                @keyframes marqueeL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes marqueeR { from { transform: translateX(-50%); } to { transform: translateX(0); } }

                .marquee-item-lux {
                    width: 450px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 3rem;
                    border-radius: 30px;
                    color: white;
                }
                .marquee-item-lux.alt { background: white; color: var(--at-dark); border-color: white; }
                
                .q-icon-min { color: var(--at-red); margin-bottom: 2rem; }
                .marquee-item-lux p { font-size: 1.15rem; line-height: 1.6; font-style: italic; margin-bottom: 2.5rem; opacity: 0.8; }
                .t-author-min strong { display: block; font-size: 1.1rem; font-weight: 900; margin-bottom: 0.3rem; }
                .t-author-min span { font-weight: 800; font-size: 0.75rem; color: var(--at-red); text-transform: uppercase; letter-spacing: 1px; }

                /* BENTO STORIES */
                .circle-section { padding: 10rem 0; }
                .bento-header { margin-bottom: 5rem; max-width: 600px; }
                .vangu-tag { font-weight: 900; letter-spacing: 5px; color: var(--at-red); font-size: 0.8rem; margin-bottom: 1.5rem; display: block; }
                .vangu-heading-large { font-family: 'Outfit', sans-serif; font-size: 4rem; font-weight: 900; color: var(--at-dark); letter-spacing: -2px; line-height: 1; }
                .vangu-heading-large span { font-family: 'Playfair Display', serif; font-style: italic; color: transparent; -webkit-text-stroke: 1.2px var(--at-dark); }

                .bento-grid-vangu { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto; gap: 2.5rem; }
                
                .bento-story-item { 
                    grid-column: span 2; background: var(--at-soft); border-radius: 40px; padding: clamp(2rem, 5vw, 5rem);
                    border: 1px solid #e2e8f0; position: relative; overflow: hidden;
                }
                .bento-story-item.item-2 { grid-column: span 1; padding: 4rem 3rem; }
                
                .bento-story-inner { position: relative; z-index: 10; }
                .bento-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3rem; }
                .b-tag { font-weight: 900; font-size: 0.75rem; color: var(--at-red); letter-spacing: 2px; }
                .b-author { font-weight: 800; color: var(--at-grey); }

                .bento-story-item h3 { font-size: 2.8rem; font-weight: 900; color: var(--at-dark); margin-bottom: 2rem; line-height: 1.1; }
                .item-2 h3 { font-size: 1.8rem; }
                
                .bento-story-item p { font-size: 1.2rem; line-height: 1.7; color: #475569; margin-bottom: 3.5rem; max-width: 600px; }
                .b-link { background: transparent; border: none; font-weight: 900; letter-spacing: 2px; font-size: 0.8rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; color: var(--at-dark); }
                .b-link:hover { color: var(--at-red); }

                .bento-decor { position: absolute; right: -20px; bottom: -20px; opacity: 0.05; transform: rotate(-15deg); }
                
                .bento-visual-placeholder { 
                    background: var(--at-dark); border-radius: 40px; padding: 4rem; 
                    display: flex; align-items: center; justify-content: center; text-align: center; color: white;
                }
                .placeholder-content h4 { font-size: 1.6rem; font-weight: 900; margin: 1.5rem 0 1rem; }
                .placeholder-content p { font-size: 0.9rem; opacity: 0.6; line-height: 1.5; }

                /* DIRECTORY VANGUARD */
                .directory-vangu { background: #fff; }
                .directory-header-lux { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--at-dark); padding-bottom: 3rem; margin-bottom: 6rem; }
                .vangu-heading-mid { font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 900; color: var(--at-dark); letter-spacing: -2px; }
                
                .vangu-filters { display: flex; gap: 2rem; }
                .vangu-filter-btn { 
                    background: transparent; border: none; font-weight: 900; font-size: 0.85rem; 
                    text-transform: uppercase; letter-spacing: 2px; cursor: pointer; color: #94a3b8;
                    transition: 0.3s;
                }
                .vangu-filter-btn:hover { color: var(--at-dark); }
                .vangu-filter-btn.is-active { color: var(--at-red); border-bottom: 3px solid var(--at-red); }

                .vangu-alumni-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 3rem; }
                .vangu-alumni-card { background: #fff; transition: 0.4s; }
                .vangu-alumni-card:hover { transform: translateY(-10px); }

                .vangu-av-frame { position: relative; aspect-ratio: 1; border-radius: 20px; overflow: hidden; margin-bottom: 2rem; background: #f1f5f9; }
                .vangu-av-frame img { width: 100%; height: 100%; object-fit: cover; }
                .vangu-av-overlay { 
                    position: absolute; inset: 0; background: rgba(218,41,28,0.9); 
                    display: flex; align-items: center; justify-content: center; color: white;
                    opacity: 0; transition: 0.4s;
                }
                .vangu-alumni-card:hover .vangu-av-overlay { opacity: 1; }

                .vangu-alumni-meta { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .vangu-status { font-weight: 900; font-size: 0.65rem; text-transform: uppercase; padding: 0.4rem 0.8rem; border-radius: 4px; }
                .vangu-status.alumni { background: #dcfce7; color: #166534; }
                .vangu-status.proses { background: #fefce8; color: #854d0e; }
                .vangu-year { font-weight: 900; color: #cbd5e1; font-size: 0.9rem; }

                .vangu-alumni-body h3 { font-size: 1.5rem; font-weight: 900; color: var(--at-dark); margin-bottom: 0.5rem; }
                .vangu-alumni-body p { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--at-grey); font-weight: 700; }

                /* TRANSPARENCY VANGUARD */
                .vangu-trans-box { background: var(--at-dark); border-radius: 60px; padding: 6rem; color: white; position: relative; overflow: hidden; }
                .vangu-trans-grid { display: grid; grid-template-columns: 120px 1fr; gap: 5rem; align-items: center; position: relative; z-index: 10; }
                
                .vangu-trans-icon { width: 100px; height: 100px; background: var(--at-red); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; }
                .pulse-ring { position: absolute; inset: -15px; border: 2px solid var(--at-red); border-radius: 50%; opacity: 0; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }

                .vangu-trans-text h3 { font-size: 2.5rem; font-weight: 900; margin-bottom: 2rem; }
                .vangu-trans-line { width: 60px; height: 4px; background: var(--at-red); margin-bottom: 2.5rem; }
                .vangu-trans-text p { font-size: 1.3rem; line-height: 1.6; opacity: 0.7; font-style: italic; max-width: 900px; }

                /* FOOTER VANGUARD */
                .circle-footer-vangu { padding: 12rem 0; text-align: center; }
                .vangu-footer-decor { 
                    width: 80px; height: 80px; background: var(--at-dark); color: white; 
                    font-size: 2.5rem; font-weight: 900; border-radius: 50%; display: flex; 
                    align-items: center; justify-content: center; margin: 0 auto 5rem;
                }
                .vangu-footer-h { font-family: 'Outfit', sans-serif; font-size: 4rem; font-weight: 900; color: var(--at-dark); line-height: 1.1; margin-bottom: 5rem; max-width: 800px; margin-left: auto; margin-right: auto; }
                .btn-vangu-red { 
                    padding: 1.8rem 4rem; background: var(--at-red); color: white; border: none; 
                    border-radius: 100px; font-weight: 900; letter-spacing: 2px;
                    display: flex; align-items: center; gap: 2rem; margin: 0 auto 6rem;
                    cursor: pointer; transition: 0.4s;
                }
                .btn-vangu-red:hover { background: var(--at-dark); transform: translateY(-5px); }
                
                .vangu-footer-meta { display: flex; align-items: center; justify-content: center; gap: 2rem; opacity: 0.2; font-weight: 900; font-size: 0.75rem; letter-spacing: 4px; }
                .vangu-meta-dot { width: 4px; height: 4px; background: var(--at-dark); border-radius: 50%; }

                @media (max-width: 1024px) {
                    .circle-container { padding: 0 2rem; }
                    .hero-split-vangu { grid-template-columns: 1fr; text-align: center; }
                    .hero-text-vangu { display: flex; flex-direction: column; align-items: center; }
                    .hero-cta-vangu { flex-direction: column; gap: 2rem; }
                    .hero-visual-sphere { height: 400px; }
                    .main-sphere { width: 250px; height: 250px; }
                    .orbit-profile { display: none; }
                    .bento-grid-vangu { grid-template-columns: 1fr; }
                    .bento-story-item { grid-column: span 1; padding: 3rem 1.5rem; }
                    .marquee-item-lux { width: 320px; padding: 2rem; }
                    .vangu-heading-large { font-size: 3rem; }
                    .vangu-footer-h { font-size: 2.5rem; }
                    .vangu-trans-grid { grid-template-columns: 1fr; text-align: center; justify-items: center; }
                    .directory-header-lux { flex-direction: column; gap: 2rem; }
                }

                .circle-loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 2rem; letter-spacing: 5px; color: var(--at-dark); }
            `}</style>
        </div>
    );
};

export default AlumniPage;

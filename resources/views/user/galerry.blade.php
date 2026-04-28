import React, { useEffect, useState } from 'react';
import { Camera, Play, Shield, Info, Filter, ArrowRight, Layers, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GaleriPage = ({ content }) => {
    const { t } = useTranslation();
    const data = content?.galeri_halaman;
    const [activeCategory, setActiveCategory] = useState('all');
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

        document.querySelectorAll('.atelier-reveal').forEach(el => observer.observe(el));
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, [content]);

    if (!data) return <div className="atelier-loader">Curating Gallery...</div>;

    const filteredPhotos = activeCategory === 'all'
        ? data.foto
        : data.foto.filter(p => p.category === activeCategory);

    return (
        <div className="atelier-wrapper">
            {/* 1. ATELIER HERO - MINIMALIST & BOLD */}
            <header className="atelier-hero">
                <div className="atelier-container">
                    <div className="hero-split-lux">
                        <div className="hero-meta atelier-reveal reveal-left">
                            <span className="atelier-tag">{t('galeri.hero.tag')}</span>
                            <h1 className="atelier-title-lux">
                                {t('galeri.hero.title')}
                            </h1>
                        </div>
                        <div className="hero-intro-box atelier-reveal reveal-right">
                            <div className="intro-accent-line"></div>
                            <h2>{t('galeri.hero.intro_title', { defaultValue: data.pengantar?.title })}</h2>
                            <p>{t('galeri.hero.intro_content', { defaultValue: data.pengantar?.content })}</p>
                        </div>
                    </div>
                </div>
                <div className="hero-bg-accent"></div>
            </header>

            {/* 2. FILTER & CATEGORIES - STICKY BAR */}
            <nav className="atelier-filter-bar atelier-reveal reveal-up">
                <div className="atelier-container">
                    <div className="filter-inner-lux">
                        <div className="filter-label">
                            <Filter size={18} />
                            <span>{t('galeri.filter.label')}</span>
                        </div>
                        <div className="category-group-lux">
                            {(data.kategori || []).map(cat => (
                                <button
                                    key={cat.id}
                                    className={`cat-btn-lux ${activeCategory === cat.id ? 'is-active' : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {t(`galeri.category.${cat.id}`, { defaultValue: cat.label })}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* 3. PHOTO GRID - MASONRY STYLE */}
            <section className="atelier-section photo-grid-lux">
                <div className="atelier-container">
                    <div className="masonry-layout-lux">
                        {filteredPhotos.map((item, idx) => (
                            <div key={item.id} className="masonry-item-lux atelier-reveal reveal-up" style={{ transitionDelay: `${idx * 0.1}s` }}>
                                <div className="item-frame-lux">
                                    <img src={item.url} alt={item.title} className="masonry-img-lux" />
                                    <div className="item-overlay-lux">
                                        <div className="overlay-info-lux">
                                            <span className="item-cat-tag">{item.category}</span>
                                            <h3>{item.title}</h3>
                                            <p>{item.desc}</p>
                                        </div>
                                        <button className="view-btn-lux"><Eye size={20} /></button>
                                    </div>
                                </div>
                                <div className="item-caption-min">
                                    <span className="caption-num">0{idx + 1}</span>
                                    <span className="caption-title">{item.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. VIDEO SHOWCASE - LARGE SCALE */}
            <section className="atelier-section video-atelier bg-atelier-dark">
                <div className="atelier-container">
                    <div className="section-header-lux atelier-reveal reveal-up">
                        <span className="meta-white">{t('galeri.video.tag')}</span>
                        <h2 className="heading-white-lux">{t('galeri.video.title', { defaultValue: data.video?.title })}</h2>
                    </div>

                    <div className="video-grid-lux">
                        {(data.video?.items || []).map((vid, idx) => (
                            <div key={vid.id} className="video-card-lux atelier-reveal reveal-up">
                                <div className="video-thumb-lux">
                                    <div className="play-trigger-lux"><Play size={32} /></div>
                                    <div className="thumb-overlay-lux"></div>
                                </div>
                                <div className="video-info-lux">
                                    <h3>{vid.title}</h3>
                                    <p>{vid.desc}</p>
                                    <button className="text-btn-lux">{t('btn.watch_film')} <ArrowRight size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. ETHICS & TRUST - FOOTNOTE STYLE */}
            <section className="atelier-section ethics-atelier">
                <div className="atelier-container">
                    <div className="ethics-grid-lux">
                        <div className="ethics-left atelier-reveal reveal-left">
                            <Shield size={48} className="text-red" />
                            <h2 className="ethics-title-lux">{t('galeri.etika.title', { defaultValue: data.etika?.title })}</h2>
                        </div>
                        <div className="ethics-right atelier-reveal reveal-right">
                            <div className="ethics-list-lux">
                                {(data.etika?.points || []).map((point, idx) => (
                                    <div key={idx} className="ethics-item-lux">
                                        <div className="ethics-dot"></div>
                                        <p>{t(`galeri.etika.item_${idx}`, { defaultValue: point })}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PENUTUP - ATELIER LOGO SIGN-OFF */}
            <footer className="atelier-footer">
                <div className="atelier-container">
                    <div className="footer-sign-off atelier-reveal reveal-up">
                        <div className="atelier-logo-mark">A</div>
                        <p className="footer-content-lux">{t('galeri.penutup.content', { defaultValue: data.penutup?.content })}</p>
                        <div className="footer-divider-lux"></div>
                        <span className="archive-date">{t('galeri.footer.archive_date')}</span>
                    </div>
                </div>
            </footer>

            <style jsx="true">{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,700&family=Outfit:wght@400;700;900&display=swap');

                .atelier-wrapper {
                    --at-red: #da291c;
                    --at-dark: #0f172a;
                    --at-soft: #f8fafc;
                    --at-grey: #64748b;
                    background: #fff;
                    padding-top: 0;
                    overflow-x: hidden;
                }

                .atelier-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

                /* REVEAL LOGIC */
                .atelier-reveal { opacity: 0; transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal-up { transform: translateY(60px); }
                .reveal-left { transform: translateX(-60px); }
                .reveal-right { transform: translateX(60px); }
                .is-revealed { opacity: 1; transform: translate(0, 0); }

                /* HERO - MUSEUM STYLE */
                .atelier-hero {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    position: relative;
                    background: #fff;
                    padding: 10rem 0 5rem;
                }

                .hero-split-lux { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: flex-end; position: relative; z-index: 10; }
                
                .atelier-tag { font-weight: 900; letter-spacing: 6px; color: var(--at-red); font-size: 0.8rem; margin-bottom: 2rem; display: block; }
                .atelier-title-lux {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(4rem, 10vw, 8rem);
                    font-weight: 900;
                    line-height: 0.85;
                    color: var(--at-dark);
                    letter-spacing: -4px;
                }
                .atelier-title-lux span { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 700; color: var(--at-red); }

                .intro-accent-line { width: 60px; height: 4px; background: var(--at-red); margin-bottom: 2rem; }
                .hero-intro-box h2 { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 900; color: var(--at-dark); margin-bottom: 1.5rem; letter-spacing: -1px; }
                .hero-intro-box p { font-size: 1.3rem; color: var(--at-grey); line-height: 1.6; max-width: 500px; }

                .hero-bg-accent {
                    position: absolute;
                    top: 0; right: 0; width: 40%; height: 100%;
                    background: var(--at-soft);
                    z-index: 1;
                }

                /* FILTER BAR */
                .atelier-filter-bar {
                    position: sticky;
                    top: clamp(60px, 8vw, 100px);
                    z-index: 100;
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(20px);
                    border-top: 1px solid #f1f5f9;
                    border-bottom: 1px solid #f1f5f9;
                    padding: 1.5rem 0;
                }

                .filter-inner-lux { display: flex; align-items: center; justify-content: space-between; }
                .filter-label { display: flex; align-items: center; gap: 1rem; color: var(--at-dark); font-weight: 900; font-size: 0.75rem; letter-spacing: 2px; }
                .category-group-lux { display: flex; gap: 1rem; }

                .cat-btn-lux {
                    padding: 0.8rem 1.8rem;
                    border: 1px solid #e2e8f0;
                    background: transparent;
                    color: var(--at-dark);
                    font-weight: 800;
                    font-size: 0.85rem;
                    border-radius: 100px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .cat-btn-lux:hover { border-color: var(--at-red); color: var(--at-red); }
                .cat-btn-lux.is-active { background: var(--at-dark); color: white; border-color: var(--at-dark); }

                /* PHOTO GRID - ATELIER STYLE */
                .atelier-section { padding: 8rem 0; }
                
                .masonry-layout-lux {
                    column-count: 3;
                    column-gap: 2.5rem;
                }
                @media (max-width: 1200px) { .masonry-layout-lux { column-count: 2; } }
                @media (max-width: 768px) { .masonry-layout-lux { column-count: 1; } }

                .masonry-item-lux {
                    break-inside: avoid;
                    margin-bottom: 4rem;
                }

                .item-frame-lux {
                    position: relative;
                    background: #f1f5f9;
                    overflow: hidden;
                    border-radius: 4px;
                    aspect-ratio: auto;
                }

                .masonry-img-lux {
                    width: 100%;
                    height: auto;
                    display: block;
                    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .item-frame-lux:hover .masonry-img-lux { transform: scale(1.05); }

                .item-overlay-lux {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(15,23,42,0.9), transparent 70%);
                    padding: 3rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    opacity: 0;
                    transition: 0.5s;
                }

                .item-frame-lux:hover .item-overlay-lux { opacity: 1; }

                .item-cat-tag { color: var(--at-red); font-weight: 900; font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1rem; display: block; }
                .overlay-info-lux h3 { color: white; font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; }
                .overlay-info-lux p { color: rgba(255,255,255,0.7); font-size: 0.95rem; line-height: 1.4; }

                .view-btn-lux {
                    position: absolute;
                    top: 2rem; right: 2rem;
                    width: 50px; height: 50px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transform: scale(0.8);
                    transition: 0.3s;
                }
                .view-btn-lux:hover { transform: scale(1); background: var(--at-red); color: white; }

                .item-caption-min { border-left: 1px solid #e2e8f0; margin-top: 1.5rem; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.2rem; }
                .caption-num { font-size: 0.75rem; font-weight: 900; opacity: 0.3; }
                .caption-title { font-weight: 700; font-size: 1rem; color: var(--at-dark); }

                /* VIDEO SECTION */
                .bg-atelier-dark { background: var(--at-dark); color: white; }
                .meta-white { color: var(--at-red); font-weight: 900; letter-spacing: 5px; font-size: 0.8rem; margin-bottom: 1.5rem; display: block; }
                .heading-white-lux { font-family: 'Outfit', sans-serif; font-size: 3.5rem; font-weight: 900; letter-spacing: -2px; }

                .video-grid-lux { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-top: 5rem; }
                
                .video-card-lux { display: flex; flex-direction: column; gap: 2rem; }
                .video-thumb-lux {
                    aspect-ratio: 16/9;
                    background: #1e293b;
                    border-radius: 20px;
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                }
                .play-trigger-lux {
                    position: absolute;
                    inset: 0; margin: auto;
                    width: 80px; height: 80px;
                    background: white;
                    color: var(--at-dark);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10;
                    transition: 0.4s;
                }
                .video-card-lux:hover .play-trigger-lux { background: var(--at-red); color: white; transform: scale(1.1); }

                .video-info-lux h3 { font-size: 1.8rem; font-weight: 900; margin-bottom: 1rem; }
                .video-info-lux p { color: rgba(255,255,255,0.6); margin-bottom: 2rem; line-height: 1.6; }
                
                .text-btn-lux {
                    background: transparent;
                    border: none;
                    color: var(--at-red);
                    font-weight: 900;
                    letter-spacing: 2px;
                    font-size: 0.85rem;
                    display: flex; align-items: center; gap: 1rem;
                    cursor: pointer;
                }

                /* ETHICS */
                .ethics-grid-lux { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 6rem; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 8rem; }
                .ethics-title-lux { font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 900; color: var(--at-dark); letter-spacing: -1px; margin-top: 2rem; }
                
                .ethics-list-lux { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                .ethics-item-lux { display: flex; gap: 1.5rem; align-items: flex-start; }
                .ethics-dot { width: 8px; height: 8px; background: var(--at-red); border-radius: 50%; margin-top: 0.6rem; }
                .ethics-item-lux p { font-size: 1.1rem; color: var(--at-grey); line-height: 1.5; font-weight: 600; }

                /* FOOTER SIGN-OFF */
                .atelier-footer { padding: 8rem 0 12rem; text-align: center; }
                .footer-sign-off { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
                .atelier-logo-mark {
                    width: 80px; height: 80px;
                    background: var(--at-dark);
                    color: white;
                    font-size: 2.5rem;
                    font-weight: 900;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%;
                    margin-bottom: 3rem;
                }
                .footer-content-lux { font-size: 1.4rem; color: var(--at-grey); line-height: 1.5; font-style: italic; margin-bottom: 3rem; }
                .footer-divider-lux { width: 1px; height: 100px; background: #e2e8f0; margin-bottom: 3rem; }
                .archive-date { font-weight: 900; letter-spacing: 5px; font-size: 0.75rem; color: #cbd5e1; }

                @media (max-width: 1024px) {
                    .atelier-container { padding: 0 2rem; }
                    .hero-split-lux { grid-template-columns: 1fr; gap: 4rem; text-align: center; align-items: center; }
                    .hero-intro-box { text-align: center; display: flex; flex-direction: column; align-items: center; }
                    .category-group-lux { flex-wrap: wrap; justify-content: center; }
                    .video-grid-lux { grid-template-columns: 1fr; }
                    .ethics-grid-lux { grid-template-columns: 1fr; text-align: center; }
                    .ethics-left { display: flex; flex-direction: column; align-items: center; }
                    .atelier-filter-bar { top: 0; }
                }

                .atelier-loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 2rem; color: var(--at-dark); letter-spacing: 5px; }
            `}</style>
        </div>
    );
};

export default GaleriPage;

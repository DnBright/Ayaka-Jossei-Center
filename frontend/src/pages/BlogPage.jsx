import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Tag, ChevronRight, Search, Filter, Book, PenTool, Info, Lock, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { API_URL } from '../config';

const BlogPage = ({ content }) => {
    const { t } = useTranslation();
    const data = content?.blog_halaman;
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchArticles();
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-revealed');
            });
        }, { threshold: 0.1 });

        // Small delay to ensure DOM is ready
        const timeout = setTimeout(() => {
            document.querySelectorAll('.journal-reveal').forEach(el => observer.observe(el));
        }, 100);

        return () => {
            observer.disconnect();
            clearTimeout(timeout);
        };
    }, [content, articles]);

    const fetchArticles = async () => {
        try {
            const resp = await axios.get(`${API_URL}/posts`);
            setArticles(resp.data);
        } catch (err) {
            console.error('Error fetching articles:', err);
            // Fallback to legacy content if API fails
            if (data && data.artikel) setArticles(data.artikel);
        }
    };

    if (!data) return <div className="journal-loader">Assembling Journal...</div>;

    const filteredArticles = (articles || []).filter(art => {
        const matchesCat = activeCategory === 'all' || art.category === activeCategory;
        const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (art.excerpt || art.summary || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    // Helper to identify member content
    const isMemberContent = (cat) => {
        const c = cat?.toLowerCase() || '';
        return c.includes('internal') || c.includes('member') || c.includes('journal');
    };

    return (
        <div className="journal-wrapper">
            {/* 1. JOURNAL HERO - EDITORIAL STYLE */}
            <header className="journal-hero">
                <div className="journal-container">
                    <div className="hero-content-lux">
                        <div className="hero-header-min journal-reveal reveal-up">
                            <span className="journal-tag">{t('blog.hero.tag')}</span>
                            <h1 className="journal-title-lux">{t('blog.hero.title')}</h1>
                        </div>
                        <div className="hero-brief-lux journal-reveal reveal-up" style={{ transitionDelay: '0.2s' }}>
                            <div className="brief-line"></div>
                            <p>{data.pengantar?.content}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. SEARCH & FILTER - MINIMALIST DASHBOARD */}
            <section className="journal-controls-lux">
                <div className="journal-container">
                    <div className="controls-grid-lux journal-reveal reveal-up">
                        <div className="search-box-lux">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder={t('blog.search.placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group-lux">
                            {(data.kategori || []).map(cat => (
                                <button
                                    key={cat.id}
                                    className={`cat-btn-journal ${activeCategory === cat.id ? 'is-active' : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {cat.id === 'all' ? t('galeri.category.all') : t(`blog.category.${cat.id}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ARTICLE LIST - ASYMMETRIC GAZETTE GRID */}
            <section className="journal-articles">
                <div className="journal-container">
                    <div className="articles-grid-lux">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((art, idx) => {
                                const isLocked = isMemberContent(art.category);
                                return (
                                    <article
                                        key={art.id}
                                        className={`journal-card-lux ${idx === 0 ? 'feature-card' : ''} journal-reveal reveal-up`}
                                        style={{ transitionDelay: `${idx * 0.1}s` }}
                                    >
                                        <Link to={`/blog/${art.slug}`} className="card-link-lux">
                                            <div className="card-image-box">
                                                <img src={art.image} alt={art.title} />
                                                <span className={`card-cat-tag ${isLocked ? 'tag-locked' : ''}`}>
                                                    {isLocked && <Lock size={12} style={{ marginRight: 5 }} />}
                                                    {t(`blog.category.${(art.category || '').toLowerCase().replace(' ', '-')}`)}
                                                </span>
                                            </div>
                                            <div className="card-content-lux">
                                                <div className="card-meta">
                                                    <span className="meta-date"><Calendar size={14} /> {art.date || new Date(art.created_at).toLocaleDateString()}</span>
                                                    <span className="meta-views"><Eye size={14} /> {art.views || 0}</span>
                                                    {isLocked && <span className="meta-lock">{t('blog.card.member_only')}</span>}
                                                </div>
                                                <h2 className="card-title-lux">{art.title}</h2>
                                                <p className="card-excerpt-lux">{art.excerpt || art.summary}</p>
                                                <div className="card-footer-lux">
                                                    <span className="read-more-lux">
                                                        {isLocked ? t('btn.member_access') : t('btn.read_article')} <ChevronRight size={16} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="empty-state-journal">{t('blog.empty')}</div>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. PENUTUP & DISCLAIMER - GAZETTE FOOTER */}
            <footer className="journal-footer">
                <div className="journal-container">
                    <div className="footer-journal-box journal-reveal reveal-up">
                        <div className="disclaimer-journal">
                            <Info size={24} className="text-red" />
                            <p>{data.disclaimer}</p>
                        </div>
                        <div className="footer-sign-journal">
                            <h3 className="footer-cta-journal">{data.penutup}</h3>
                            <div className="journal-divider-min"></div>
                            <span className="journal-mark">{t('blog.footer.mark')}</span>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx="true">{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Outfit:wght@400;700;900&display=swap');

                .journal-wrapper {
                    --jr-red: #da291c;
                    --jr-dark: #0f172a;
                    --jr-bg: #f8fafc;
                    --jr-border: #e2e8f0;
                    background: #fff;
                    padding-bottom: 5rem;
                }

                .journal-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

                /* REVEAL */
                .journal-reveal { opacity: 0; transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
                .reveal-up { transform: translateY(40px); }
                .is-revealed { opacity: 1; transform: translateY(0); }

                /* HERO */
                .journal-hero { padding: 12rem 0 6rem; background: #fff; border-bottom: 2px solid var(--jr-dark); }
                .hero-content-lux { display: flex; align-items: flex-end; justify-content: space-between; }
                
                .journal-tag { font-weight: 900; letter-spacing: 5px; color: var(--jr-red); font-size: 0.75rem; display: block; margin-bottom: 1.5rem; }
                .journal-title-lux {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(3rem, 8vw, 6.5rem);
                    font-weight: 900;
                    line-height: 0.9;
                    color: var(--jr-dark);
                    letter-spacing: -2px;
                }
                .journal-title-lux span { color: transparent; -webkit-text-stroke: 1.5px var(--jr-dark); }

                .hero-brief-lux { max-width: 450px; }
                .brief-line { width: 40px; height: 3px; background: var(--jr-red); margin-bottom: 2rem; }
                .hero-brief-lux p { font-size: 1.25rem; color: #475569; line-height: 1.5; font-style: italic; }

                /* CONTROLS */
                .journal-controls-lux { padding: 3rem 0; background: var(--jr-bg); }
                .controls-grid-lux { display: flex; justify-content: space-between; align-items: center; gap: 3rem; }
                
                .search-box-lux { 
                    flex: 1; position: relative; display: flex; align-items: center; 
                    background: #fff; padding: 1rem 2rem; border-radius: 12px; border: 1px solid var(--jr-border);
                }
                .search-icon { color: var(--jr-red); margin-right: 1.5rem; }
                .search-box-lux input { border: none; background: transparent; width: 100%; font-size: 1rem; font-weight: 700; outline: none; }

                .filter-group-lux { display: flex; gap: 0.8rem; }
                .cat-btn-journal {
                    padding: 0.8rem 1.5rem; border: 1px solid transparent; background: transparent;
                    color: var(--jr-dark); font-weight: 900; font-size: 0.8rem; text-transform: uppercase;
                    cursor: pointer; transition: 0.3s;
                }
                .cat-btn-journal:hover { color: var(--jr-red); }
                .cat-btn-journal.is-active { border-bottom: 3px solid var(--jr-red); color: var(--jr-red); }

                /* ARTICLES GRID */
                .journal-articles { padding: 8rem 0; }
                .articles-grid-lux { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; }
                
                .journal-card-lux { position: relative; border-bottom: 1px solid var(--jr-border); padding-bottom: 3rem; }
                .journal-card-lux.feature-card { grid-column: span 2; border-bottom: 3px solid var(--jr-dark); padding-bottom: 5rem; }
                .journal-card-lux.feature-card .card-link-lux { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: start; }

                .card-link-lux { text-decoration: none; display: block; height: 100%; }
                
                .card-image-box { position: relative; border-radius: 4px; overflow: hidden; margin-bottom: 2rem; aspect-ratio: 16/9; background: #f1f5f9; }
                .feature-card .card-image-box { aspect-ratio: 4/3; margin-bottom: 0; }
                .card-image-box img { width: 100%; height: 100%; object-fit: cover; transition: 1s; }
                .journal-card-lux:hover .card-image-box img { transform: scale(1.05); }

                .card-cat-tag { 
                    position: absolute; top: 1.5rem; left: 1.5rem; background: var(--jr-red); 
                    color: white; padding: 0.5rem 1rem; font-size: 0.7rem; font-weight: 900; text-transform: uppercase;
                }

                .card-meta { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; opacity: 0.6; font-size: 0.8rem; font-weight: 800; }
                .meta-date, .meta-views { display: flex; align-items: center; gap: 0.5rem; }
                .meta-views { color: var(--jr-red); }
                .meta-lock { color: var(--jr-red); font-weight: 900; letter-spacing: 1px; font-size: 0.7rem; border: 1px solid var(--jr-red); padding: 2px 6px; border-radius: 4px; }
                .tag-locked { background: #0f172a !important; display: flex; align-items: center; }

                .card-title-lux { 
                    font-family: 'Outfit', sans-serif; 
                    font-size: 1.8rem; 
                    font-weight: 900; 
                    color: var(--jr-dark); 
                    line-height: 1.2; 
                    margin-bottom: 1.5rem; 
                    transition: 0.3s;
                    word-break: break-word;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .feature-card .card-title-lux { font-size: 3rem; -webkit-line-clamp: 3; }
                .journal-card-lux:hover .card-title-lux { color: var(--jr-red); }

                .card-excerpt-lux { color: #475569; font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
                
                .card-footer-lux { border-top: 1px solid #f1f5f9; padding-top: 1.5rem; }
                .read-more-lux { color: var(--jr-dark); font-weight: 900; font-size: 0.85rem; letter-spacing: 2px; display: flex; align-items: center; gap: 0.8rem; }

                /* FOOTER */
                .journal-footer { padding: 4rem 0 8rem; }
                .footer-journal-box { border: 10px solid var(--jr-dark); padding: 5rem; text-align: center; }
                .disclaimer-journal { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; max-width: 800px; margin: 0 auto 4rem; }
                .disclaimer-journal p { font-size: 1.1rem; color: #64748b; line-height: 1.6; font-weight: 600; font-style: italic; }

                .footer-sign-journal { display: flex; flex-direction: column; align-items: center; }
                .footer-cta-journal { font-family: 'Outfit', sans-serif; font-size: 2.22rem; font-weight: 900; color: var(--jr-dark); margin-bottom: 2rem; }
                .journal-divider-min { width: 100px; height: 1px; background: var(--jr-red); margin-bottom: 2.5rem; }
                .journal-mark { font-weight: 900; letter-spacing: 8px; font-size: 0.75rem; color: #94a3b8; }

                @media (max-width: 1024px) {
                    .journal-container { padding: 0 2rem; }
                    .hero-content-lux { flex-direction: column; align-items: flex-start; gap: 4rem; }
                    .controls-grid-lux { flex-direction: column; align-items: stretch; gap: 1.5rem; }
                    .articles-grid-lux { grid-template-columns: 1fr; gap: 5rem; }
                    .journal-card-lux.feature-card { grid-template-columns: 1fr; gap: 3rem; }
                    .journal-card-lux.feature-card .card-image-box { aspect-ratio: 16/9; }
                    .footer-journal-box { padding: 3rem 1.5rem; }
                    .journal-title-lux { font-size: 4rem; }
                    .feature-card .card-title-lux { font-size: 2.2rem; }
                }

                .journal-loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 2rem; letter-spacing: 5px; color: var(--jr-dark); }
            `}</style>
        </div>
    );
};

export default BlogPage;

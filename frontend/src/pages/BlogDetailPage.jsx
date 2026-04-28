import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { ArrowLeft, Calendar, Tag, Info, User, Share2, Facebook, Twitter, Link as LinkIcon, Lock, Eye, Zap } from 'lucide-react';

const BlogDetailPage = ({ content }) => {
    const { t } = useTranslation();
    const { slug } = useParams();
    const data = content?.blog_halaman;
    const [article, setArticle] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const stored = localStorage.getItem('member_user');
        if (stored) setMember(JSON.parse(stored));

        fetchArticleAndRecs();
    }, [slug]);

    const fetchArticleAndRecs = async () => {
        setLoading(true);
        try {
            // 1. Fetch current article by slug
            const artResp = await axios.get(`${API_URL}/posts/${slug}`);
            setArticle(artResp.data);

            // 2. Track post view
            axios.post(`${API_URL}/analytics/track`, { type: 'post', id: artResp.data.id })
                .catch(e => console.error('Failed to track post view:', e));

            // 3. Fetch all posts for recommendations
            const allResp = await axios.get(`${API_URL}/posts`);
            setAllPosts(allResp.data);

        } catch (err) {
            console.error('Error fetching article detail:', err);
            // Fallback to legacy content if available
            const legacyArticle = data?.artikel?.find(a => a.slug === slug);
            if (legacyArticle) {
                setArticle(legacyArticle);
                setAllPosts(data.artikel || []);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading || !article) return <div className="read-loader">{t('blog.retrieving')}</div>;

    const isMemberContent = (cat) => {
        const c = cat?.toLowerCase() || '';
        return c.includes('internal') || c.includes('member') || c.includes('journal');
    };

    const isLocked = isMemberContent(article.category) && !member;

    // Get recommendations: Filter out current article, take top 5
    const recommendations = allPosts
        .filter(p => p.id !== article.id && p.status === 'publish')
        .slice(0, 5);

    return (
        <div className="read-wrapper">
            {/* 1. ARTICLE HEADER - FOCUSED & LUX */}
            <header className="read-header">
                <div className="read-container">
                    <Link to="/blog" className="back-link-lux">
                        <ArrowLeft size={18} /> {t('blog.back')}
                    </Link>

                    <div className="header-stacked-lux">
                        <div className="header-text-side">
                            <span className="read-cat-tag">{article.category}</span>
                            <h1 className="read-title-lux">{article.title}</h1>
                            <div className="read-meta-box">
                                <div className="meta-item-lux">
                                    <Calendar size={16} />
                                    <span>{article.date || new Date(article.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-item-lux">
                                    <User size={16} />
                                    <span>{t('blog.official')}</span>
                                </div>
                                <div className="meta-item-lux">
                                    <Eye size={16} />
                                    <span>{article.views || 0} {t('blog.views')}</span>
                                </div>
                                {isMemberContent(article.category) && (
                                    <div className="meta-item-lux" style={{ color: '#da291c' }}>
                                        <Lock size={16} />
                                        <span>{t('blog.card.member_only')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="header-img-full">
                            <img src={article.image} alt={article.title} className="main-read-img" />
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. MAIN BODY + SIDEBAR LAYOUT */}
            <main className="read-body">
                <div className="read-container content-grid">

                    {/* LEFT: CONTENT */}
                    <div className="content-area">
                        {isLocked ? (
                            <div className="content-locked-box">
                                <Lock size={48} className="lock-icon-lg" />
                                <h2>{t('blog.member_content')}</h2>
                                <p>{t('blog.member_desc')}</p>
                                <Link to="/member/login" className="btn-login-content">{t('nav.login_member')}</Link>
                            </div>
                        ) : (
                            <>
                                <div
                                    className="read-content-main"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                                ></div>

                                <div className="read-share-lux">
                                    <span>{t('blog.share')}</span>
                                    <div className="share-icons-lux">
                                        <button><Facebook size={20} /></button>
                                        <button><Twitter size={20} /></button>
                                        <button><LinkIcon size={20} /></button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT: SIDEBAR */}
                    <aside className="sidebar-area">
                        <div className="sidebar-sticky">
                            <div className="widget-box">
                                <h3 className="widget-title">
                                    <Zap size={18} className="icon-pulse" />
                                    {t('blog.recommendations')}
                                </h3>
                                <div className="widget-line"></div>

                                <div className="rec-list">
                                    {recommendations.map(rec => (
                                        <Link key={rec.id} to={`/blog/${rec.slug}`} className="rec-item">
                                            <div className="rec-thumb">
                                                <img src={rec.image} alt={rec.title} />
                                            </div>
                                            <div className="rec-info">
                                                <h4>{rec.title}</h4>
                                                <span className="rec-date">{new Date(rec.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    ))}
                                    {recommendations.length === 0 && <p className="text-slate-400 text-sm">{t('blog.no_recommendations')}</p>}
                                </div>
                            </div>

                            <div className="widget-box promotional">
                                <h4>{t('blog.promo.title')}</h4>
                                <p>{t('blog.promo.desc')}</p>
                                <Link to="/member/register" className="btn-sidebar-promo">{t('nav.daftar')}</Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* 3. MANDATORY DISCLAIMER */}
            <footer className="read-footer">
                <div className="read-container-narrow">
                    <div className="read-disclaimer-box">
                        <div className="disc-header">
                            <Info size={20} />
                            <span>{t('blog.info_resmi')}</span>
                        </div>
                        <p>{data?.disclaimer}</p>
                    </div>
                </div>
            </footer>

            <style jsx="true">{`
                .read-wrapper {
                    --rd-red: #da291c;
                    --rd-dark: #0f172a;
                    --rd-grey: #64748b;
                    background: #fff;
                    padding-top: 100px;
                }

                .read-container { max-width: 1300px; margin: 0 auto; padding: 0 4rem; }
                .read-container-narrow { max-width: 850px; margin: 0 auto; padding: 0 2rem; }

                /* HEADER */
                .read-header { padding: 4rem 0 0rem; background: #fff; }
                .back-link-lux { 
                    display: inline-flex; align-items: center; gap: 1rem; 
                    text-decoration: none; color: var(--rd-dark); font-weight: 900; 
                    font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 4rem;
                }
                .back-link-lux:hover { color: var(--rd-red); }

                .header-stacked-lux { display: flex; flex-direction: column; gap: 4rem; align-items: flex-start; }
                
                .read-cat-tag { color: var(--rd-red); font-weight: 900; font-size: 0.8rem; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 2rem; display: block; }
                .read-title-lux { font-family: 'Outfit', sans-serif; font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900; color: var(--rd-dark); line-height: 1; margin-bottom: 3.5rem; letter-spacing: -3px; max-width: 1000px; }
                
                .read-meta-box { display: flex; gap: 3rem; border-top: 1px solid #e2e8f0; padding-top: 2rem; width: 100%; }
                .meta-item-lux { display: flex; align-items: center; gap: 0.8rem; font-weight: 800; color: var(--rd-grey); font-size: 0.85rem; }

                .header-img-full { width: 100%; margin-top: 2rem; }
                .main-read-img { 
                    width: 100%; 
                    height: clamp(300px, 60vh, 700px);
                    object-fit: cover;
                    border-radius: 2rem; 
                    box-shadow: 0 40px 100px rgba(15,23,42,0.15); 
                }

                /* GRID LAYOUT FOR CONTENT & SIDEBAR */
                .read-body { padding: 6rem 0; }
                
                .content-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr; /* 2/3 Content, 1/3 Sidebar */
                    gap: 6rem;
                    align-items: start;
                }

                .content-area {
                    /* Main content styles */
                }

                .read-content-main { 
                    font-size: 1.25rem; line-height: 1.8; color: #334155; 
                }
                .read-content-main p { margin-bottom: 2.5rem; }
                .read-content-main strong { color: var(--rd-dark); font-weight: 900; }
                .read-content-main img { max-width: 100%; height: auto; border-radius: 1rem; margin: 2rem 0; }

                .read-share-lux { 
                    margin-top: 6rem; border-top: 1px solid #f1f5f9; padding-top: 3rem;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .read-share-lux span { font-weight: 900; letter-spacing: 2px; font-size: 0.8rem; color: var(--rd-dark); }
                .share-icons-lux { display: flex; gap: 1rem; }
                .share-icons-lux button { 
                    width: 45px; height: 45px; border-radius: 50%; border: 1px solid #e2e8f0; 
                    background: transparent; color: var(--rd-dark); cursor: pointer; transition: 0.3s;
                }
                .share-icons-lux button:hover { background: var(--rd-dark); color: white; border-color: var(--jr-dark); }

                /* SIDEBAR STYLES */
                .sidebar-area {
                    position: relative;
                }

                .sidebar-sticky {
                    position: sticky;
                    top: 120px; /* Stick below header */
                }

                .widget-box {
                    margin-bottom: 3rem;
                }

                .widget-title {
                    font-size: 1.1rem; font-weight: 800; color: var(--rd-dark);
                    display: flex; align-items: center; gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                .widget-line { width: 40px; height: 3px; background: var(--rd-red); margin-bottom: 1.5rem; }
                .icon-pulse { color: var(--rd-red); }

                .rec-list { display: flex; flex-direction: column; gap: 1.5rem; }
                
                .rec-item {
                    text-decoration: none; display: flex; gap: 1rem; align-items: flex-start;
                    group; transition: 0.3s;
                }
                
                .rec-thumb {
                    width: 80px; height: 80px; flex-shrink: 0; 
                    border-radius: 12px; overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .rec-thumb img { width: 100%; height: 100%; object-fit: cover; transition: 0.3s; }
                .rec-item:hover .rec-thumb img { transform: scale(1.1); }

                .rec-info h4 {
                    font-size: 0.95rem; font-weight: 700; color: var(--rd-dark);
                    line-height: 1.4; margin-bottom: 0.5rem;
                    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
                }
                .rec-item:hover h4 { color: var(--rd-red); }

                .rec-date { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }

                .widget-box.promotional {
                    background: #f8fafc; padding: 2rem; border-radius: 20px;
                    text-align: center; border: 1px dashed #cbd5e1;
                }
                .widget-box.promotional h4 { font-weight: 800; margin-bottom: 0.5rem; color: var(--rd-dark); }
                .widget-box.promotional p { font-size: 0.9rem; color: #64748b; margin-bottom: 1.5rem; }
                .btn-sidebar-promo {
                    background: var(--rd-dark); color: white; padding: 0.8rem 1.5rem;
                    border-radius: 100px; text-decoration: none; font-size: 0.85rem; font-weight: 700;
                    display: inline-block; transition: 0.3s;
                }
                .btn-sidebar-promo:hover { background: var(--rd-red); }


                /* LOCKED CONTENT */
                .content-locked-box {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: #f8fafc;
                    border: 1px dashed #da291c;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }
                .lock-icon-lg { color: #da291c; margin-bottom: 0.5rem; }
                .content-locked-box h2 { font-family: 'Outfit', sans-serif; font-size: 1.8rem; color: #0f172a; }
                .content-locked-box p { color: #64748b; max-width: 500px; margin-bottom: 1rem; }
                .btn-login-content {
                    background: #da291c; color: white; padding: 1rem 2rem; border-radius: 100px;
                    text-decoration: none; font-weight: 700; transition: 0.3s;
                }
                .btn-login-content:hover { background: #b91c1c; transform: translateY(-2px); }

                /* FOOTER */
                .read-footer { padding: 4rem 0 8rem; }
                .read-disclaimer-box { 
                    background: #f8fafc; border-left: 6px solid var(--rd-red); padding: 3rem;
                }
                .disc-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: var(--rd-red); font-weight: 900; font-size: 0.85rem; letter-spacing: 2px; }
                .read-disclaimer-box p { color: #64748b; font-size: 1rem; line-height: 1.6; font-style: italic; }

                @media (max-width: 1024px) {
                    .read-container { padding: 0 2rem; }
                    .read-title-lux { font-size: 2.8rem; }
                    
                    /* Stack content on mobile */
                    .content-grid { grid-template-columns: 1fr; gap: 4rem; }
                    
                    .read-meta-box { flex-direction: column; gap: 1rem; }
                    
                    .sidebar-sticky { position: static; }
                    .rec-list { flex-direction: row; overflow-x: auto; gap: 1rem; padding-bottom: 1rem; }
                    .rec-item { min-width: 250px; flex-direction: column; }
                    .rec-thumb { width: 100%; height: 140px; }
                }

                .read-loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 2rem; letter-spacing: 5px; color: var(--rd-dark); }
            `}</style>
        </div>
    );
};

export default BlogDetailPage;

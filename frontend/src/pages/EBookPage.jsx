import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Book, AlertCircle, Download, X, Lock } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, t }) => {
    if (!isOpen) return null;
    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-content">
                <button className="auth-close-btn" onClick={onClose}><X size={24} /></button>
                <div className="auth-icon-circle">
                    <Lock size={32} />
                </div>
                <h2>{t('ebook.limited_access_title')}</h2>
                <p>{t('ebook.limited_access_desc')}</p>
                <div className="auth-actions">
                    <Link to="/member/login" className="btn-modal-login">{t('member.login_btn')}</Link>
                    <Link to="/member/register" className="btn-modal-register">{t('member.reg_btn')}</Link>
                </div>
            </div>
            <style jsx="true">{`
                .auth-modal-overlay {
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(5px);
                    z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 1rem;
                }
                .auth-modal-content {
                    background: white; width: 100%; max-width: 450px; padding: 2.5rem; border-radius: 20px;
                    text-align: center; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes modalPop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .auth-close-btn {
                    position: absolute; top: 1rem; right: 1rem; background: none; border: none;
                    color: #94a3b8; cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: 0.2s;
                }
                .auth-close-btn:hover { background: #f1f5f9; color: #0f172a; }
                
                .auth-icon-circle {
                    width: 70px; height: 70px; background: #fee2e2; color: #da291c;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 1.5rem;
                }
                .auth-modal-content h2 { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 0.8rem; font-family: 'Outfit', sans-serif; }
                .auth-modal-content p { color: #64748b; line-height: 1.6; margin-bottom: 2rem; }
                .auth-actions { display: flex; flex-direction: column; gap: 1rem; }
                
                .btn-modal-login {
                    background: #da291c; color: white; padding: 1rem; border-radius: 12px;
                    font-weight: 700; text-decoration: none; transition: 0.3s;
                }
                .btn-modal-login:hover { background: #b91c1c; transform: translateY(-2px); }
                
                .btn-modal-register {
                    background: white; color: #0f172a; padding: 1rem; border-radius: 12px;
                    font-weight: 700; text-decoration: none; border: 2px solid #e2e8f0; transition: 0.3s;
                }
                .btn-modal-register:hover { border-color: #0f172a; }
            `}</style>
        </div>
    );
};

const EBookPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ebooks, setEbooks] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        // Check for member session
        const storedMember = localStorage.getItem('member_user');
        if (!storedMember) {
            // No auto redirect, just set null and show modal
            setMember(null);
            setTimeout(() => setShowAuthModal(true), 1000); // Show popup after 1s
        } else {
            setMember(JSON.parse(storedMember));
        }
        fetchEbooks();
    }, [navigate]);

    const fetchEbooks = async () => {
        try {
            const resp = await axios.get(`${API_URL}/ebooks`);
            setEbooks(resp.data);
        } catch (err) {
            console.error('Error fetching ebooks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadClick = (id, url) => {
        if (!member) {
            setShowAuthModal(true);
            return;
        }
        trackEbookClick(id, url);
    };

    const trackEbookClick = async (id, url) => {
        try {
            await axios.post(`${API_URL}/analytics/track`, { type: 'ebook', id });
            window.open(url, '_blank');
        } catch (err) {
            console.error('Failed to track ebook click:', err);
            window.open(url, '_blank');
        }
    };

    if (loading) return <div className="ebook-loader">{t('ebook.syncing')}</div>;

    return (
        <div className="ebook-wrapper">
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} t={t} />

            {/* Header / Hero */}
            <header className="ebook-hero">
                <div className="container">
                    <div className="hero-content reveal-up">
                        {member ? (
                            <span className="badge-member">{t('ebook.active_member')}: {member.email}</span>
                        ) : (
                            <span className="badge-guest">{t('ebook.guest_mode')}</span>
                        )}
                        <h1>{t('ebook.hero_title')} <br /><span className="text-stroke">{t('ebook.hero_subtitle')}</span></h1>
                        <p className="hero-desc">
                            {t('ebook.hero_desc')}
                        </p>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <section className="ebook-list-section">
                <div className="container">
                    <div className="section-header reveal-up">
                        <h2>{t('ebook.archive_title')}</h2>
                        <div className="line-divider"></div>
                    </div>

                    <div className="ebook-grid">
                        {ebooks.map((book, idx) => (
                            <div className="ebook-card reveal-up" style={{ transitionDelay: `${idx * 0.1}s` }} key={book.id}>
                                <div className="card-icon-box">
                                    <Book size={40} />
                                </div>
                                <div className="card-content">
                                    <div className="card-meta">
                                        <span className="meta-ver">{book.version}</span>
                                        <span className="meta-cat">{book.category}</span>
                                    </div>
                                    <h3>{book.title}</h3>
                                    <p>{book.description}</p>
                                    <button
                                        className={`btn-download ${!member ? 'locked' : ''}`}
                                        onClick={() => handleDownloadClick(book.id, book.file_url)}
                                        title={!member ? t('ebook.login_to_download') : t('ebook.download_ebook')}
                                    >
                                        {!member ? <Lock size={18} /> : <Download size={18} />}
                                        {t('ebook.download_btn')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Warning */}
            <footer className="ebook-footer">
                <div className="container">
                    <div className="warning-box reveal-up">
                        <AlertCircle size={24} className="text-red" />
                        <p>
                            <strong>{t('ebook.warning_title')}:</strong> {t('ebook.warning_desc')}
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx="true">{`
                .ebook-wrapper {
                    background: #f8fafc;
                    min-height: 100vh;
                    padding-bottom: 5rem;
                }
                .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

                /* HERO */
                .ebook-hero {
                    background: #fff;
                    padding: 8rem 0 4rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .badge-member {
                    display: inline-block;
                    background: #dcfce7;
                    color: #166534;
                    padding: 0.5rem 1rem;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    letter-spacing: 1px;
                }
                .badge-guest {
                    display: inline-block;
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 0.5rem 1rem;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    letter-spacing: 1px;
                }
                .ebook-hero h1 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 3.5rem;
                    font-weight: 900;
                    line-height: 1;
                    color: #0f172a;
                    margin-bottom: 1.5rem;
                }
                .text-stroke {
                    color: transparent;
                    -webkit-text-stroke: 1.5px #0f172a;
                }
                .hero-desc {
                    max-width: 600px;
                    font-size: 1.2rem;
                    color: #64748b;
                    line-height: 1.6;
                }

                /* LIST */
                .ebook-list-section { padding: 4rem 0; }
                .section-header { margin-bottom: 3rem; display: flex; align-items: center; gap: 1.5rem; }
                .section-header h2 { font-size: 2rem; font-weight: 800; color: #0f172a; font-family: 'Outfit', sans-serif;}
                .line-divider { height: 2px; flex: 1; background: #e2e8f0; }

                .ebook-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 2rem;
                }

                .ebook-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                    transition: 0.3s;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .ebook-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.05);
                    border-color: #da291c;
                }

                .card-icon-box {
                    width: 60px;
                    height: 60px;
                    background: #fef2f2;
                    color: #da291c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                }

                .card-meta { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }

                .card-content h3 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: 0.8rem; font-family: 'Outfit'; line-height: 1.3; }
                .card-content p { font-size: 0.95rem; color: #64748b; line-height: 1.5; margin-bottom: 1.5rem; }

                .btn-download {
                    width: 100%;
                    padding: 0.8rem;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: 0.2s;
                    font-size: 0.9rem;
                }
                .btn-download:hover { background: #1e293b; }
                .btn-download.locked { background: #e2e8f0; color: #64748b; cursor: not-allowed; }
                .btn-download.locked:hover { background: #cbd5e1; }

                /* FOOTER WARNING */
                .warning-box {
                    max-width: 800px;
                    margin: 2rem auto;
                    background: #fff;
                    border: 1px solid #fee2e2;
                    border-left: 4px solid #da291c;
                    padding: 1.5rem;
                    border-radius: 8px;
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }
                .text-red { color: #da291c; flex-shrink: 0; }
                .warning-box p { font-size: 0.9rem; color: #7f1d1d; line-height: 1.5; }

                /* ANIMATION */
                .reveal-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
                @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default EBookPage;

import React, { useEffect, useState } from 'react';
import { Shield, Target, Award, Users, FileCheck, ArrowRight, Compass, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FragmentedValues from '../components/FragmentedValues';

const ProfilPage = ({ content }) => {
    const { t } = useTranslation();
    const data = content?.profil_halaman;
    const [activeSection, setActiveSection] = useState('pengantar');

    useEffect(() => {
        window.scrollTo(0, 0);

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.professional-reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [content]);

    if (!data) return null;

    return (
        <div className="professional-profil-page">
            {/* CLEAN INSTITUTIONAL HERO */}
            <header className="prof-hero">
                <div className="container-prof">
                    <div className="hero-content-prof text-center professional-reveal">
                        <span className="prof-label">{t('profil.hero.label')}</span>
                        <h1 className="prof-main-title">
                            {t('profil.hero.title')}
                        </h1>
                        <p className="prof-hero-lead">
                            {t('profil.hero.lead')}
                        </p>
                    </div>
                </div>
                <div className="hero-decoration">
                    <div className="hero-blob"></div>
                </div>
            </header>

            {/* STRUCTURED CONTENT: PENGANTAR & LATAR BELAKANG */}
            <section className="prof-narrative-section">
                <div className="container-prof">
                    <div className="grid-narrative professional-reveal">
                        <div className="narrative-visual">
                            <div className="image-stack">
                                <div className="img-main">
                                    <img src="/assets/hero-bg.png" alt="Ayaka Office" />
                                </div>
                                <div className="img-accent"></div>
                            </div>
                        </div>
                        <div className="narrative-text-box">
                            <div className="narrative-block">
                                <h2 className="section-title-prof">{t('profil.pengantar.title', { defaultValue: data.pengantar?.title })}</h2>
                                <p className="section-p-prof">
                                    {t('profil.pengantar.content', { defaultValue: data.pengantar?.content })}
                                </p>
                            </div>
                            <div className="narrative-divider"></div>
                            <div className="narrative-block mt-12">
                                <h2 className="section-title-prof">{t('profil.latar_belakang.title', { defaultValue: data.latarBelakang?.title })}</h2>
                                <p className="section-p-prof">
                                    {t('profil.latar_belakang.content', { defaultValue: data.latarBelakang?.content })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRESTIGIOUS VISION & MISSION */}
            <section className="prof-vision-section bg-slate-50">
                <div className="container-prof">
                    <div className="vision-card professional-reveal">
                        <div className="vision-header text-center mb-16">
                            <Target className="icon-main-red" size={48} />
                            <h2 className="section-title-prof mt-6">{t('profil.vision.title')}</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="vision-text">
                                <h3 className="sub-title-prof">{t('profil.vision.visi_label')}</h3>
                                <p className="text-xl leading-relaxed text-slate-700 italic">
                                    "{t('profil.visi.content', { defaultValue: data.visi?.content })}"
                                </p>
                            </div>
                            <div className="mission-list space-y-6">
                                <h3 className="sub-title-prof">{t('profil.vision.misi_label')}</h3>
                                {(data.misi?.items || []).map((item, idx) => (
                                    <div key={idx} className="mission-item-prof">
                                        <div className="num-dot">{idx + 1}</div>
                                        <p>{t(`profil.misi.item_${idx}`, { defaultValue: item })}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE VALUES - CLEAN MASONRY */}
            <section className="prof-values-section py-24">
                <div className="container-prof">
                    <div className="text-center mb-20 professional-reveal">
                        <h2 className="section-title-prof">{t('profil.values.title')}</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto mt-4">{t('profil.values.desc')}</p>
                    </div>
                    <div className="professional-reveal">
                        <FragmentedValues items={data.nilai?.items || []} layout="structured" />
                    </div>
                </div>
            </section>

            {/* IMPACT GRID: LEGAL & FOCUS */}
            <section className="prof-impact-section py-24 bg-slate-900 text-white">
                <div className="container-prof">
                    <div className="grid md:grid-cols-2 gap-px bg-slate-800 border border-slate-800 overflow-hidden rounded-2xl">
                        <div className="impact-block-prof bg-slate-900 p-12 md:p-16">
                            <Layers className="text-red-500 mb-8" size={32} />
                            <h3 className="text-2xl font-bold mb-6">{t('profil.fokus.title', { defaultValue: data.fokus?.title })}</h3>
                            <p className="text-slate-400 leading-relaxed text-lg">{t('profil.fokus.content', { defaultValue: data.fokus?.content })}</p>
                        </div>
                        <div className="impact-block-prof bg-slate-900 p-12 md:p-16">
                            <Shield className="text-red-500 mb-8" size={32} />
                            <h3 className="text-2xl font-bold mb-6">{t('profil.legalitas.title', { defaultValue: data.legalitas?.title })}</h3>
                            <p className="text-slate-400 leading-relaxed text-lg">{t('profil.legalitas.content', { defaultValue: data.legalitas?.content })}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="prof-cta py-32 text-center bg-white relative overflow-hidden">
                <div className="container-prof professional-reveal">
                    <h2 className="prof-cta-title">{t('profil.penutup.title', { defaultValue: data.penutup?.title })}</h2>
                    <p className="prof-cta-desc mt-8">{t('profil.penutup.content', { defaultValue: data.penutup?.content })}</p>
                    <div className="mt-12">
                        <button className="btn-prof-primary">
                            {t('btn.hubungi_kami')}
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            <style jsx="true">{`
                .professional-profil-page {
                    background: #fff;
                    font-family: 'Inter', sans-serif;
                    color: #1e293b;
                    overflow-x: hidden;
                }

                .container-prof {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .professional-reveal {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .professional-reveal.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* HERO */
                .prof-hero {
                    padding: 10rem 0 8rem;
                    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
                    position: relative;
                }
                .prof-label {
                    display: inline-block;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    color: #da291c;
                    font-size: 0.8rem;
                    margin-bottom: 2rem;
                    padding: 0.5rem 1.5rem;
                    background: rgba(218, 41, 28, 0.05);
                    border-radius: 100px;
                }
                .prof-main-title {
                    font-size: clamp(2.5rem, 8vw, 4.5rem);
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                    color: #0f172a;
                    max-width: 900px;
                    margin: 0 auto 2.5rem;
                }
                .title-accent { color: #da291c; }
                .prof-hero-lead {
                    font-size: 1.25rem;
                    line-height: 1.6;
                    color: #64748b;
                    max-width: 700px;
                    margin: 0 auto;
                }

                /* NARRATIVE */
                .prof-narrative-section { padding: 8rem 0; }
                .grid-narrative { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: start; }
                
                .image-stack { position: relative; }
                .img-main { border-radius: 20px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.1); }
                .img-main img { width: 100%; height: 500px; object-fit: cover; }
                .img-accent { position: absolute; -bottom: 40px; -right: 40px; width: 200px; height: 200px; background: #da291c; border-radius: 20px; z-index: -1; opacity: 0.1; }

                .section-title-prof {
                    font-size: 2.5rem;
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    color: #0f172a;
                    margin-bottom: 2rem;
                }
                .section-p-prof {
                    font-size: 1.15rem;
                    line-height: 1.8;
                    color: #475569;
                }
                .narrative-divider { width: 60px; height: 2px; background: #e2e8f0; margin: 3rem 0; }

                /* VISION CARD */
                .vision-card {
                    background: #fff;
                    padding: 5rem;
                    border-radius: 30px;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.03);
                    border: 1px solid #f1f5f9;
                }
                .icon-main-red { color: #da291c; margin: 0 auto; }
                .sub-title-prof { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
                
                .mission-item-prof { display: flex; gap: 1.5rem; align-items: flex-start; }
                .num-dot { width: 32px; height: 32px; min-width: 32px; background: #da291c; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; }
                .mission-item-prof p { font-size: 1.1rem; line-height: 1.5; color: #475569; }

                /* CTA */
                .prof-cta-title { font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 900; color: #0f172a; }
                .prof-cta-desc { font-size: 1.2rem; color: #64748b; max-width: 700px; margin: 0 auto; line-height: 1.6; }
                .btn-prof-primary {
                    background: #0f172a;
                    color: #fff;
                    padding: 1.2rem 3.5rem;
                    border-radius: 100px;
                    font-weight: 900;
                    display: inline-flex;
                    align-items: center;
                    gap: 1.5rem;
                    border: none;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .btn-prof-primary:hover { background: #da291c; transform: translateY(-3px); box-shadow: 0 20px 40px rgba(218, 41, 28, 0.2); }

                @media (max-width: 1024px) {
                    .grid-narrative { grid-template-columns: 1fr; gap: 4rem; }
                    .vision-card { padding: 3rem 2rem; }
                }
            `}</style>
        </div>
    );
};

export default ProfilPage;

import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Clock, Send, Shield, Info, Instagram, Facebook, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactPage = ({ content }) => {
    const { t } = useTranslation();
    const data = content?.kontak_halaman;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-revealed');
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.contact-reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [content]);

    if (!data) return <div className="contact-loader">Initializing Concierge...</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = `${API_URL}/communications`;
            await axios.post(apiUrl, formData);
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 5000);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Gagal mengirim pesan. Silakan coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-wrapper">
            {/* 1. HERO - CLEAN & PROFESSIONAL */}
            <header className="contact-header">
                <div className="contact-container">
                    <div className="header-content contact-reveal reveal-up">
                        <span className="brand-tag">{t('contact.hero_tag')}</span>
                        <h1>{t('contact.partnership')}</h1>
                        <p>{t('contact.pengantar')}</p>
                    </div>
                </div>
            </header>

            {/* 2. MAIN SPLIT LAYOUT */}
            <section className="contact-body">
                <div className="contact-container">
                    <div className="contact-grid">

                        {/* LEFT: INFO & MAP */}
                        <div className="contact-info-col contact-reveal reveal-left">
                            <div className="info-block">
                                <h2>{t('contact.info_lembaga')}</h2>
                                <div className="info-list">
                                    <div className="info-item">
                                        <div className="info-icon"><MapPin size={24} /></div>
                                        <div>
                                            <label>{t('contact.alamat')}</label>
                                            <p>{data.infoUtama?.alamat}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><MessageCircle size={24} /></div>
                                        <div>
                                            <label>{t('contact.wa')}</label>
                                            <p>{data.infoUtama?.whatsapp}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><Mail size={24} /></div>
                                        <div>
                                            <label>{t('contact.email')}</label>
                                            <p>{data.infoUtama?.email}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon"><Clock size={24} /></div>
                                        <div>
                                            <label>{t('contact.jam')}</label>
                                            <p>{data.infoUtama?.jamOperasional}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="social-row">
                                    {(data.sosialMedia || []).map((social, idx) => (
                                        <a href={social.link} key={idx} className="social-btn" target="_blank" rel="noopener noreferrer">
                                            {social.platform === 'Instagram' ? <Instagram size={20} /> : <Facebook size={20} />}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* GOOGLE MAPS EMBED */}
                            <div className="map-embed-box">
                                <iframe
                                    title="Office Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126438.2854809817!2d112.56174164670278!3d-7.978639498263722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62822063dc2db%3A0x2177f1899178550!2sMalang%2C%20Malang%20City%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1707530000000!5m2!1sen!2sid"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* RIGHT: FORM */}
                        <div className="contact-form-col contact-reveal reveal-right">
                            <div className="form-card">
                                <div className="form-head">
                                    <h3>{t('contact.kirim_pesan')}</h3>
                                    <p>{t('contact.respon_time')}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="professional-form">
                                    <div className="form-group">
                                        <label>{t('contact.nama_lengkap')}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder={t('contact.placeholder_nama')}
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>{t('contact.email_kontak')}</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder={t('contact.placeholder_email')}
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t('contact.subjek')}</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">{t('contact.pilih_subjek')}</option>
                                                <option value="konsultasi">{t('contact.subjek_konsul')}</option>
                                                <option value="pendaftaran">{t('contact.subjek_daftar')}</option>
                                                <option value="umum">{t('contact.subjek_umum')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('contact.pesan')}</label>
                                        <textarea
                                            name="message"
                                            rows="5"
                                            placeholder={t('contact.placeholder_pesan')}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className={`submit-btn ${isSubmitted ? 'success' : ''}`} disabled={loading}>
                                        {loading ? 'Sending...' : isSubmitted ? (
                                            <><CheckCircle2 size={20} /> {t('btn.terkirim')}</>
                                        ) : (
                                            <><Send size={18} /> {t('btn.kirim')}</>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="privacy-note">
                                <Shield size={16} className="icon-shield" />
                                <p>{t('contact.privasi')}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. FOOTER QUOTE */}
            <footer className="contact-footer contact-reveal reveal-up">
                <div className="contact-container">
                    <div className="footer-quote">
                        <h2>{t('contact.penutup')}</h2>
                        <div className="quote-line"></div>
                    </div>
                </div>
            </footer>

            <style jsx="true">{`
                .contact-wrapper {
                    --c-red: #da291c;
                    --c-dark: #0f172a;
                    --c-gray: #64748b;
                    --c-light: #f8fafc;
                    background: #fff;
                    padding-top: 100px;
                    font-family: 'Inter', sans-serif;
                }

                .contact-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }

                /* ANIMATION */
                .contact-reveal { opacity: 0; transition: all 1s cubic-bezier(0.2, 1, 0.3, 1); }
                .reveal-up { transform: translateY(40px); }
                .reveal-left { transform: translateX(-40px); }
                .reveal-right { transform: translateX(40px); }
                .is-revealed { opacity: 1; transform: translate(0, 0); }

                /* HEADER */
                .contact-header { padding: 5rem 0 4rem; text-align: center; }
                .header-content { max-width: 800px; margin: 0 auto; }
                .brand-tag { font-weight: 800; font-size: 0.85rem; color: var(--c-red); letter-spacing: 3px; margin-bottom: 1.5rem; display: block; }
                .contact-header h1 {
                    font-family: 'Outfit', sans-serif; font-size: 3.5rem; font-weight: 900; color: var(--c-dark);
                    margin-bottom: 1.5rem; line-height: 1.1;
                }
                .contact-header p { font-size: 1.2rem; color: var(--c-gray); line-height: 1.6; }

                /* BODY GRID */
                .contact-body { padding-bottom: 8rem; }
                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 5rem;
                    align-items: start;
                }

                /* LEFT COLUMN */
                .info-block { margin-bottom: 3rem; }
                .info-block h2 { font-family: 'Outfit', sans-serif; font-size: 2rem; color: var(--c-dark); margin-bottom: 2.5rem; }
                
                .info-list { display: flex; flex-direction: column; gap: 2.5rem; }
                .info-item { display: flex; gap: 1.5rem; align-items: flex-start; }
                .info-icon { 
                    width: 50px; height: 50px; background: #fff0f0; color: var(--c-red); 
                    border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .info-item label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 0.3rem; }
                .info-item p { font-size: 1.1rem; font-weight: 600; color: var(--c-dark); line-height: 1.4; }

                .social-row { display: flex; gap: 1rem; margin-top: 3rem; }
                .social-btn {
                    width: 45px; height: 45px; border-radius: 50%; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center; color: var(--c-dark);
                    transition: 0.3s;
                }
                .social-btn:hover { background: var(--c-red); color: white; border-color: var(--c-red); transform: translateY(-3px); }

                .map-embed-box {
                    border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05); height: 300px;
                }
                .map-embed-box iframe { width: 100%; height: 100%; border: 0; }

                /* RIGHT COLUMN */
                .form-card {
                    background: #fff; padding: 3.5rem; border-radius: 30px;
                    border: 1px solid #f1f5f9; box-shadow: 0 20px 60px rgba(0,0,0,0.04);
                }
                .form-head { margin-bottom: 3rem; }
                .form-head h3 { font-family: 'Outfit', sans-serif; font-size: 2rem; color: var(--c-dark); margin-bottom: 0.5rem; }
                .form-head p { color: var(--c-gray); font-size: 1rem; }

                .professional-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                
                .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
                .form-group label { font-size: 0.85rem; font-weight: 700; color: var(--c-dark); }
                .form-group input, .form-group select, .form-group textarea {
                    padding: 1rem 1.2rem; border-radius: 12px; border: 1px solid #e2e8f0;
                    font-size: 1rem; font-family: inherit; color: var(--c-dark); background: #f8fafc;
                    transition: 0.3s; width: 100%;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    background: #fff; border-color: var(--c-red); outline: none; box-shadow: 0 0 0 3px rgba(218, 41, 28, 0.1);
                }

                .submit-btn {
                    margin-top: 1rem; padding: 1.2rem; background: var(--c-dark); color: white;
                    border: none; border-radius: 12px; font-weight: 700; font-size: 1rem;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.8rem;
                    transition: 0.3s;
                }
                .submit-btn:hover { background: var(--c-red); transform: translateY(-2px); }
                .submit-btn.success { background: #166534; pointer-events: none; }
                .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .privacy-note {
                    margin-top: 2rem; display: flex; align-items: center; gap: 0.8rem;
                    padding: 1rem; background: #f0fdf4; border-radius: 12px; border: 1px dashed #bbf7d0;
                }
                .icon-shield { color: #166534; }
                .privacy-note p { font-size: 0.85rem; color: #14532d; font-weight: 500; }

                /* FOOTER */
                .contact-footer { padding: 6rem 0; text-align: center; border-top: 1px solid #f1f5f9; }
                .footer-quote h2 { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 900; color: var(--c-dark); margin-bottom: 2rem; max-width: 800px; margin: 0 auto 2rem;line-height: 1.2; }
                .quote-line { width: 60px; height: 4px; background: var(--c-red); margin: 0 auto; border-radius: 10px; }

                @media (max-width: 1024px) {
                    .contact-grid { grid-template-columns: 1fr; gap: 4rem; }
                    .form-card { padding: 2.5rem; }
                    .contact-header h1 { font-size: 2.8rem; }
                }

                .contact-loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 2rem; letter-spacing: 5px; color: var(--c-dark); }
            `}</style>
        </div>
    );
};

export default ContactPage;

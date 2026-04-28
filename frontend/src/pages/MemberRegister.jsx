import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle } from 'lucide-react';

const MemberRegister = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Get existing pending and active members
        const pending = JSON.parse(localStorage.getItem('pending_members') || '[]');
        const active = JSON.parse(localStorage.getItem('active_members') || '[]');

        // 2. Simple check if email already exists
        if (pending.some(m => m.email === formData.email) || active.some(m => m.email === formData.email)) {
            alert('Email sudah terdaftar!');
            return;
        }

        // 3. Create new member object
        const newMember = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password, // In real app, hash this!
            status: 'Pending',
            date: new Date().toLocaleDateString()
        };

        // 4. Save to mock DB (localStorage)
        localStorage.setItem('pending_members', JSON.stringify([...pending, newMember]));

        // 5. Redirect to Login with Success Message
        navigate('/member/login', {
            state: {
                registrationSuccess: true,
                message: t('member.reg_success')
            }
        });
    };

    return (
        <div className="page-wrapper">
            <section className="register-section">
                <div className="register-container">
                    <div className="register-card reveal-up">
                        <div className="register-header">
                            <img src="/assets/logo ayakan.png" alt="Ayaka Logo" className="brand-logo" />
                            <h2>{t('member.reg_title')}</h2>
                            <p>{t('member.reg_subtitle')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-group">
                                <label>{t('member.name_label')}</label>
                                <div className="input-wrapper">
                                    <User size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder={t('member.name_label')}
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('member.email_label')}</label>
                                <div className="input-wrapper">
                                    <Mail size={20} className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('member.phone_label')}</label>
                                <div className="input-wrapper">
                                    <Phone size={20} className="input-icon" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="0812..."
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('member.password_label')}</label>
                                <div className="input-wrapper">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('member.confirm_password')}</label>
                                <div className="input-wrapper">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-submit">
                                {t('member.reg_btn')} <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="register-footer">
                            <p>{t('member.have_account')} <Link to="/member/login">{t('member.login_link')}</Link></p>
                            <Link to="/" className="back-link">{t('member.back_home')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx="true">{`
                .page-wrapper {
                    min-height: 100vh;
                    background: #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .register-container {
                    width: 100%;
                    max-width: 500px;
                }

                .register-card {
                    background: white;
                    padding: 3rem;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .register-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .brand-logo {
                    height: 50px;
                    margin-bottom: 1rem;
                }

                .register-header h2 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.8rem;
                    color: #0f172a;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                }

                .register-header p {
                    color: #64748b;
                    font-size: 0.95rem;
                }

                .form-group {
                    margin-bottom: 1.25rem;
                }

                .form-group label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 0.5rem;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: 0.9rem 0.9rem 0.9rem 3rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s;
                    outline: none;
                }

                .input-wrapper input:focus {
                    border-color: #da291c;
                    box-shadow: 0 0 0 3px rgba(218, 41, 28, 0.1);
                }

                .btn-submit {
                    width: 100%;
                    padding: 1rem;
                    background: #da291c;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: 0.3s;
                    margin-top: 1rem;
                }

                .btn-submit:hover {
                    background: #b91c1c;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(218, 41, 28, 0.2);
                }

                .register-footer {
                    margin-top: 2rem;
                    text-align: center;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 1.5rem;
                }

                .register-footer p {
                    color: #64748b;
                    font-size: 0.95rem;
                    margin-bottom: 0.5rem;
                }

                .register-footer a {
                    color: #da291c;
                    font-weight: 600;
                    text-decoration: none;
                }

                .back-link {
                    display: inline-block;
                    margin-top: 1rem;
                    font-size: 0.9rem;
                    color: #94a3b8 !important;
                }
            `}</style>
        </div>
    );
};

export default MemberRegister;

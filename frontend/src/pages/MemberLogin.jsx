import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Lock, ArrowRight } from 'lucide-react';

const MemberLogin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (location?.state?.registrationSuccess) {
            setSuccessMsg(location.state.message);
            // Clear state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        setTimeout(() => {
            const activeMembers = JSON.parse(localStorage.getItem('active_members') || '[]');
            const pendingMembers = JSON.parse(localStorage.getItem('pending_members') || '[]');

            const user = activeMembers.find(m => m.email === email && m.password === password);
            const pendingUser = pendingMembers.find(m => m.email === email && m.password === password);

            // Mock admin check for demo if needed
            if (email === 'member@ayaka.com' && password === 'member123') {
                localStorage.setItem('member_token', 'mock-token');
                localStorage.setItem('member_user', JSON.stringify({ name: 'Demo Member', email }));
                navigate('/ebook');
                return;
            }

            if (user) {
                localStorage.setItem('member_token', 'mock-token');
                localStorage.setItem('member_user', JSON.stringify(user));
                navigate('/ebook');
            } else if (pendingUser) {
                setError(t('member.pending_error'));
                setLoading(false);
            } else {
                setError(t('member.login_error'));
                setLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="page-wrapper">
            <section className="login-section">
                <div className="login-container">
                    <div className="login-card-member reveal-up">
                        <div className="brand-header">
                            <img src="/assets/logo ayakan.png" alt="Ayaka Logo" className="brand-logo" />
                            <h2>{t('member.login_title')}</h2>
                            <p>{t('member.login_subtitle')}</p>
                        </div>

                        {successMsg && (
                            <div className="alert-success-box">
                                <span className="success-emoji">🎉</span> {successMsg}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label>{t('member.email_label')}</label>
                                <div className="input-wrapper">
                                    <User size={20} className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? t('member.processing') : t('member.login_btn')} <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>{t('member.no_account')} <Link to="/member/register">{t('member.register_link')}</Link></p>
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
                .login-container { width: 100%; max-width: 450px; }
                .login-card-member {
                    background: white;
                    padding: 3rem;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                }
                .brand-header { text-align: center; margin-bottom: 2.5rem; }
                .brand-logo { height: 60px; margin-bottom: 1.5rem; }
                .brand-header h2 { font-family: 'Outfit', sans-serif; font-size: 1.8rem; color: #0f172a; margin-bottom: 0.5rem; font-weight: 700; }
                .brand-header p { color: #64748b; font-size: 0.95rem; }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; font-size: 0.9rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
                .input-wrapper { position: relative; }
                .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
                .input-wrapper input {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    outline: none;
                }
                .input-wrapper input:focus { border-color: #da291c; }
                .btn-submit {
                    width: 100%;
                    padding: 1rem;
                    background: #da291c;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .error-message { background: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: 8px; font-size: 0.9rem; margin-bottom: 1.5rem; text-align: center; }
                .alert-success-box { background: #f0fdf4; color: #15803d; padding: 1rem; border-radius: 12px; font-size: 0.9rem; margin-bottom: 1.5rem; text-align: center; border: 1px solid #bbf7d0; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .login-footer { margin-top: 2rem; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 1.5rem; }
                .login-footer p { color: #64748b; font-size: 0.95rem; margin-bottom: 0.5rem; }
                .login-footer a { color: #da291c; font-weight: 600; text-decoration: none; }
                .back-link { display: inline-block; margin-top: 1rem; font-size: 0.9rem; color: #94a3b8 !important; }
            `}</style>
        </div>
    );
};

export default MemberLogin;

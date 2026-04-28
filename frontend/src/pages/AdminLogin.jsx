import { API_URL } from '../config';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const apiUrl = `${API_URL}/auth/login`;
            const resp = await axios.post(apiUrl, { username, password, source: 'admins' });

            // Validate if role is Admin or Editor
            if (resp.data.role !== 'Super Admin' && resp.data.role !== 'Editor') {
                setError('Akses ditolak. Gunakan login Penulis.');
                setLoading(false);
                return;
            }

            localStorage.setItem('admin_token', resp.data.token);
            localStorage.setItem('admin_role', resp.data.role);
            localStorage.setItem('admin_username', username);

            navigate('/admin');
        } catch (err) {
            setError('Kredensial tidak valid atau gangguan server.');
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-overlay"></div>
            <div className="login-card-admin fade-in">
                <div className="security-badge">
                    <Shield size={32} />
                </div>

                <div className="header-text">
                    <h1>Admin Authority</h1>
                    <p>Secure Access Control for Ayaka Josei Center</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-field">
                        <label>Username</label>
                        <div className="input-group">
                            <User size={20} className="icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Admin ID"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Secret Key / Password</label>
                        <div className="input-group">
                            <Lock size={20} className="icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <button type="submit" className="btn-admin-login" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Enter Secure Area'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>© 2026 AJC Internal Security. Authorized Personnel Only.</p>
                </div>
            </div>

            <style jsx="true">{`
                .admin-login-page {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0f172a;
                    background-image: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                }

                .login-overlay {
                    position: absolute;
                    inset: 0;
                    background: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
                    opacity: 0.1;
                    pointer-events: none;
                }

                .login-card-admin {
                    width: 100%;
                    max-width: 420px;
                    padding: 3.5rem 2.5rem;
                    background: rgba(30, 41, 59, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    z-index: 10;
                }

                .security-badge {
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, #da291c 0%, #991b1b 100%);
                    color: white;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 10px 20px rgba(218, 41, 28, 0.3);
                }

                .header-text h1 {
                    color: white;
                    font-size: 1.75rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.5px;
                }

                .header-text p {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-bottom: 2.5rem;
                }

                .input-field {
                    text-align: left;
                    margin-bottom: 1.5rem;
                }

                .input-field label {
                    display: block;
                    color: #94a3b8;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                    letter-spacing: 1px;
                }

                .input-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-group .icon {
                    position: absolute;
                    left: 1rem;
                    color: #64748b;
                }

                .input-group input {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .input-group input:focus {
                    border-color: #da291c;
                    box-shadow: 0 0 0 4px rgba(218, 41, 28, 0.15);
                }

                .toggle-btn {
                    position: absolute;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                }

                .error-alert {
                    background: rgba(239, 68, 68, 0.1);
                    border-left: 4px solid #ef4444;
                    color: #f87171;
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    margin-bottom: 1.5rem;
                }

                .btn-admin-login {
                    width: 100%;
                    padding: 1.125rem;
                    background: #da291c;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(218, 41, 28, 0.3);
                }

                .btn-admin-login:hover:not(:disabled) {
                    background: #ef4444;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(218, 41, 28, 0.4);
                }

                .btn-admin-login:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .login-footer {
                    margin-top: 2.5rem;
                    color: #475569;
                    font-size: 0.75rem;
                }

                .fade-in {
                    animation: fadeIn 0.8s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;

import { API_URL } from '../config';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PenTool, Lock, User, Sparkles } from 'lucide-react';

const PenulisLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const apiUrl = `${API_URL}/auth/login`;
            const resp = await axios.post(apiUrl, { username, password, source: 'users' });

            // Check role for Author
            if (resp.data.role !== 'Penulis') {
                setError('Halaman ini khusus untuk Penulis. Silakan gunakan portal Admin.');
                setLoading(false);
                return;
            }

            localStorage.setItem('penulis_token', resp.data.token);
            localStorage.setItem('penulis_role', resp.data.role);
            localStorage.setItem('penulis_username', username);

            navigate('/penulis');
        } catch (err) {
            console.error('Login error:', err);
            if (!err.response) {
                setError('Tidak dapat menghubungi server. Pastikan backend sudah dijalankan (node server.js).');
            } else if (err.response.status === 401) {
                setError('Username atau password salah. Silakan periksa kembali.');
            } else {
                setError(`Gagal log masuk: ${err.response.data.error || 'Terjadi kesalahan sistem.'}`);
            }
            setLoading(false);
        }
    };

    return (
        <div className="penulis-login-page">
            <div className="blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="login-card-penulis reveal">
                <div className="creative-icon">
                    <PenTool size={32} />
                </div>

                <div className="welcome-text">
                    <h1>Portal Penulis</h1>
                    <p>Wujudkan ide Anda menjadi tulisan yang menginspirasi.</p>
                </div>

                <form onSubmit={handleLogin} className="creative-form">
                    <div className="input-box">
                        <User size={18} className="box-icon" />
                        <input
                            type="text"
                            placeholder="Username Penulis"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-box">
                        <Lock size={18} className="box-icon" />
                        <input
                            type="password"
                            placeholder="Kata Sandi"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="btn-penulis" disabled={loading}>
                        {loading ? 'Menghubungkan...' : 'Mulai Menulis'}
                        <Sparkles size={18} />
                    </button>
                </form>

                <div className="links">
                    <a href="/">Kembali ke Website</a>
                </div>
            </div>

            <style jsx="true">{`
                .penulis-login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fdfdfd;
                    position: relative;
                    overflow: hidden;
                    font-family: 'DM Sans', sans-serif;
                }

                .blobs .blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 1;
                    opacity: 0.4;
                }

                .blob-1 {
                    width: 400px;
                    height: 400px;
                    background: #fee2e2;
                    top: -100px;
                    right: -100px;
                }

                .blob-2 {
                    width: 300px;
                    height: 300px;
                    background: #fef9c3;
                    bottom: -50px;
                    left: -50px;
                }

                .login-card-penulis {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 400px;
                    background: white;
                    padding: 3.5rem 2.5rem;
                    border-radius: 32px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                    text-align: center;
                    border: 1px solid #f1f5f9;
                }

                .creative-icon {
                    width: 64px;
                    height: 64px;
                    background: #f8fafc;
                    color: #da291c;
                    margin: 0 auto 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    transform: rotate(-10deg);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                }

                .welcome-text h1 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #1e293b;
                    margin-bottom: 0.75rem;
                }

                .welcome-text p {
                    color: #64748b;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin-bottom: 2.5rem;
                }

                .input-box {
                    position: relative;
                    margin-bottom: 1.25rem;
                    display: flex;
                    align-items: center;
                }

                .box-icon {
                    position: absolute;
                    left: 1.25rem;
                    color: #94a3b8;
                }

                .input-box input {
                    width: 100%;
                    padding: 1rem 1.25rem 1rem 3.5rem;
                    background: #f8fafc;
                    border: 2px solid transparent;
                    border-radius: 16px;
                    font-size: 1rem;
                    color: #334155;
                    transition: all 0.3s;
                }

                .input-box input:focus {
                    background: white;
                    border-color: #da291c;
                    outline: none;
                    box-shadow: 0 10px 20px rgba(218, 41, 28, 0.05);
                }

                .error-text {
                    color: #ef4444;
                    font-size: 0.85rem;
                    margin-bottom: 1.5rem;
                    font-weight: 500;
                }

                .btn-penulis {
                    width: 100%;
                    padding: 1.125rem;
                    background: #334155;
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .btn-penulis:hover {
                    background: #0f172a;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .links {
                    margin-top: 2rem;
                }

                .links a {
                    font-size: 0.9rem;
                    color: #94a3b8;
                    text-decoration: none;
                }

                .reveal {
                    animation: reveal 0.6s ease-out;
                }

                @keyframes reveal {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PenulisLogin;

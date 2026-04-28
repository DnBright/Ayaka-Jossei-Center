import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded admin check for demo purposes
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
    } else {
      setError(t('member.login_error'));
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card reveal-up">
        <div className="login-header">
          <LogIn size={40} className="header-icon" />
          <h2>{t('member.login_title')}</h2>
          <p>{t('member.login_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t('member.name_label')}</label>
            <div className="input-field">
              <User size={18} />
              <input
                type="text"
                placeholder={t('member.name_label')}
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label>{t('member.password_label')}</label>
            <div className="input-field">
              <Lock size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="error-msg animate-shake">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button type="submit" className="btn-login">
            {t('member.login_btn')}
          </button>
        </form>
      </div>

      <style jsx="true">{`
                .login-wrapper {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0f172a;
                    font-family: 'Inter', sans-serif;
                }
                .login-card {
                    background: white;
                    padding: 3rem;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .login-header { text-align: center; margin-bottom: 2rem; }
                .header-icon { color: #ef4444; margin-bottom: 1rem; }
                .login-header h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; }
                .login-header p { color: #64748b; font-size: 0.875rem; }

                .input-group { margin-bottom: 1.5rem; }
                .input-group label { display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; }
                .input-field { position: relative; display: flex; align-items: center; }
                .input-field svg { position: absolute; left: 1rem; color: #94a3b8; }
                .input-field input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    transition: 0.3s;
                }
                .input-field input:focus { outline: none; border-color: #ef4444; ring: 2px solid rgba(239, 68, 68, 0.1); }

                .btn-login {
                    width: 100%;
                    padding: 0.75rem;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .btn-login:hover { background: #dc2626; transform: translateY(-1px); }

                .error-msg { color: #ef4444; font-size: 0.875rem; margin-bottom: 1rem; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
            `}</style>
    </div>
  );
};

export default Login;

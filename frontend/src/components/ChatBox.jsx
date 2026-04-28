import { API_URL } from '../config';
import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, User, Mail, CheckCircle2 } from 'lucide-react';

const ChatBox = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = `${API_URL}/communications`;
            await axios.post(apiUrl, {
                ...formData,
                subject: t('chat.concierge')
            });
            setIsSubmitted(true);
            setLoading(false);
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => {
                setIsSubmitted(false);
                setIsOpen(false);
            }, 3000);
        } catch (error) {
            console.error('Chat error:', error);
            // alert(t('error.failed_send')); // Add error keys if needed
            setLoading(false);
        }
    };

    return (
        <div className="chat-box-widget">
            {/* Toggle Button */}
            {!isOpen && (
                <button onClick={toggleChat} className="chat-toggle-btn shadow-xl shadow-red-500/20">
                    <MessageCircle size={24} />
                    <span className="tooltip-lux">{t('chat.toggle')}</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window-lux shadow-2xl animate-reveal-up">
                    <div className="chat-header-lux">
                        <div className="header-info">
                            <div className="header-dot"></div>
                            <h4>{t('chat.concierge')}</h4>
                        </div>
                        <button onClick={toggleChat} className="close-btn-lux">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-body-lux">
                        {isSubmitted ? (
                            <div className="success-state-lux">
                                <div className="success-icon-box">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <h3>{t('chat.success_title')}</h3>
                                <p>{t('chat.success_desc')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="chat-form-lux">
                                <p className="form-intro">{t('chat.intro')}</p>

                                <div className="input-field-lux">
                                    <User size={16} className="field-icon" />
                                    <input
                                        type="text"
                                        placeholder={t('chat.name_placeholder')}
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="input-field-lux">
                                    <Mail size={16} className="field-icon" />
                                    <input
                                        type="email"
                                        placeholder={t('chat.email_placeholder')}
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="input-field-lux textarea">
                                    <textarea
                                        placeholder={t('chat.message_placeholder')}
                                        rows="4"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button type="submit" disabled={loading} className="send-btn-lux">
                                    {loading ? t('chat.sending') : (
                                        <><span>{t('chat.send')}</span> <Send size={16} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .chat-box-widget {
                    position: fixed;
                    right: 2rem;
                    bottom: 2rem;
                    z-index: 9999;
                    font-family: 'Outfit', sans-serif;
                }

                .chat-toggle-btn {
                    width: 64px;
                    height: 64px;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border: none;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                }

                .chat-toggle-btn:hover {
                    transform: scale(1.1) rotate(5deg);
                }

                .tooltip-lux {
                    position: absolute;
                    right: 80px;
                    background: #0f172a;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    white-space: nowrap;
                    opacity: 0;
                    transform: translateX(10px);
                    transition: all 0.3s;
                    pointer-events: none;
                }

                .chat-toggle-btn:hover {
                    z-index: 10000;
                }

                .chat-toggle-btn:hover .tooltip-lux {
                    opacity: 1;
                    transform: translateX(0);
                }

                .chat-window-lux {
                    width: 380px;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid #f1f5f9;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                }

                .animate-reveal-up {
                    animation: revealUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes revealUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .chat-header-lux {
                    padding: 1.5rem;
                    background: #0f172a;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-info { display: flex; align-items: center; gap: 0.8rem; }
                .header-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
                .header-info h4 { font-size: 1rem; font-weight: 800; margin: 0; }

                .close-btn-lux { background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; transition: 0.3s; }
                .close-btn-lux:hover { color: white; transform: rotate(90deg); }

                .chat-body-lux { padding: 2rem; }

                .form-intro { font-size: 0.9rem; color: #64748b; margin-bottom: 2rem; line-height: 1.5; }

                .input-field-lux { position: relative; margin-bottom: 1.2rem; }
                .field-icon { position: absolute; left: 1rem; top: 1.1rem; color: #94a3b8; }

                .input-field-lux input, .input-field-lux textarea {
                    width: 100%;
                    padding: 0.9rem 1rem 0.9rem 3rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    background: #f8fafc;
                    transition: all 0.3s;
                    box-sizing: border-box;
                    font-family: inherit;
                }

                .input-field-lux.textarea { position: relative; }
                .input-field-lux.textarea textarea { padding: 1rem; resize: none; }

                .input-field-lux input:focus, .input-field-lux textarea:focus {
                    outline: none;
                    background: white;
                    border-color: #ef4444;
                    box-shadow: 0 10px 20px rgba(239, 68, 68, 0.05);
                }

                .send-btn-lux {
                    width: 100%;
                    padding: 1.2rem;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-top: 1rem;
                }

                .send-btn-lux:hover { background: #ef4444; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2); }
                .send-btn-lux:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

                .success-state-lux { text-align: center; padding: 1rem 0; }
                .success-icon-box { margin-bottom: 1.5rem; }
                .success-state-lux h3 { font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem; }
                .success-state-lux p { font-size: 0.9rem; color: #64748b; line-height: 1.6; }

                @media (max-width: 480px) {
                    .chat-window-lux { width: calc(100vw - 4rem); }
                    .chat-box-widget { right: 1.5rem; bottom: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default ChatBox;

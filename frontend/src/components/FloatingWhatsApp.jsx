import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';

const FloatingWhatsApp = () => {
    const [isOpen, setIsOpen] = useState(false);

    const admins = [
        { name: 'Ayaka', number: '6281542007626', role: 'Admin 1' },
        { name: 'Habib', number: '6287779059544', role: 'Admin 2' }
    ];

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="wa-float-container">
            {/* Contact List Modal */}
            <div className={`wa-modal ${isOpen ? 'is-open' : ''}`}>
                <div className="wa-header">
                    <h3>
                        <MessageCircle size={18} className="icon-green" />
                        Hubungi Admin
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="close-btn">
                        <X size={18} />
                    </button>
                </div>

                <div className="wa-list">
                    {admins.map((admin, idx) => (
                        <a
                            key={idx}
                            href={`https://wa.me/${admin.number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wa-item"
                        >
                            <div className="wa-avatar">
                                {admin.name[0]}
                            </div>
                            <div className="wa-info">
                                <p className="wa-role">{admin.role}</p>
                                <p className="wa-name">{admin.name}</p>
                            </div>
                            <ExternalLink size={16} className="wa-link-icon" />
                        </a>
                    ))}
                </div>

                <div className="wa-footer">
                    <p>Balasan biasanya dalam 5-10 menit saat jam kerja.</p>
                </div>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={toggleOpen}
                className={`wa-toggle-btn ${isOpen ? 'is-active' : ''}`}
            >
                {isOpen ? <X color="white" size={24} /> : <MessageCircle color="white" size={28} fill="white" />}

                {!isOpen && <span className="wa-ping"></span>}
            </button>

            <style jsx="true">{`
                .wa-float-container {
                    position: fixed;
                    bottom: 7rem;
                    right: 2rem;
                    z-index: 1001;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 1rem;
                    font-family: system-ui, -apple-system, sans-serif;
                }

                /* MODAL */
                .wa-modal {
                    background: white;
                    border-radius: 1rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    border: 1px solid #f1f5f9;
                    padding: 1rem;
                    width: 18rem;
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                    transform-origin: bottom right;
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .wa-modal.is-open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: auto;
                }

                .wa-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    border-bottom: 1px solid #f1f5f9;
                    padding-bottom: 0.5rem;
                }

                .wa-header h3 {
                    font-weight: 700;
                    color: #1e293b;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 0;
                }

                .icon-green { color: #25D366; }

                .close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #94a3b8;
                    padding: 0.25rem;
                    border-radius: 50%;
                    transition: 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .close-btn:hover { color: #ef4444; background: #fee2e2; }

                /* LIST */
                .wa-list { display: flex; flex-direction: column; gap: 0.75rem; }

                .wa-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    transition: all 0.2s;
                    border: 1px dashed transparent;
                }
                .wa-item:hover {
                    background: #f0fdf4;
                    border-color: #bbf7d0;
                }

                .wa-avatar {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    background: #dcfce7;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #16a34a;
                    font-weight: 700;
                    font-size: 1.1rem;
                    transition: 0.2s;
                }
                .wa-item:hover .wa-avatar { background: #25D366; color: white; }

                .wa-info { flex: 1; }
                .wa-role { font-size: 0.75rem; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
                .wa-name { font-weight: 700; color: #334155; font-size: 0.95rem; margin: 0; }

                .wa-link-icon { color: #cbd5e1; transition: 0.2s; }
                .wa-item:hover .wa-link-icon { color: #25D366; }

                .wa-footer {
                    margin-top: 1rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid #f1f5f9;
                    text-align: center;
                }
                .wa-footer p { font-size: 0.65rem; color: #94a3b8; margin: 0; }

                /* TOGGLE BUTTON */
                .wa-toggle-btn {
                    width: 3.5rem;
                    height: 3.5rem;
                    border-radius: 50%;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    border: none;
                    cursor: pointer;
                    position: relative;
                    background: #25D366;
                }
                .wa-toggle-btn:hover { transform: scale(1.1); background: #20bd5a; }

                .wa-toggle-btn.is-active {
                    background: #1e293b;
                    transform: rotate(90deg);
                }

                .wa-ping {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: #25D366;
                    opacity: 0.75;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    z-index: -1;
                }

                @keyframes ping {
                    75%, 100% { transform: scale(1.5); opacity: 0; }
                }

                @media (max-width: 768px) {
                    .wa-float-container { bottom: 1.5rem; right: 1.5rem; }
                    .wa-modal { width: 16rem; }
                }
            `}</style>
        </div>
    );
};

export default FloatingWhatsApp;

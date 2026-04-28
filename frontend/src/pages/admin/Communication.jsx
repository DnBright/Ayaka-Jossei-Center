import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, CheckCircle, Clock, Trash2, Filter, ChevronRight, MessageSquare, AlertCircle, Inbox, CheckCircle2 } from 'lucide-react';

const Communication = () => {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, unread, replied

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        filterMessages();
    }, [messages, searchTerm, activeTab]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const apiUrl = `http://${window.location.hostname}:5005/api/admin/communications`;
            const resp = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(resp.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setLoading(false);
        }
    };

    const filterMessages = () => {
        let result = [...messages];

        // Tab Filter
        if (activeTab === 'unread') result = result.filter(m => m.status === 'unread');
        if (activeTab === 'replied') result = result.filter(m => m.status === 'replied');

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(term) ||
                m.email.toLowerCase().includes(term) ||
                m.subject.toLowerCase().includes(term) ||
                m.message.toLowerCase().includes(term)
            );
        }

        setFilteredMessages(result);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('admin_token');
            const apiUrl = `http://${window.location.hostname}:5005/api/admin/communications/${id}/status`;
            await axios.patch(apiUrl, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
            if (selectedMessage?.id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Gagal memperbarui status pesan.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const apiUrl = `http://${window.location.hostname}:5005/api/admin/communications/${id}`;
            await axios.delete(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (err) {
            console.error('Error deleting message:', err);
            alert('Gagal menghapus pesan.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'unread': return <span className="status-badge-lux unread">Baru</span>;
            case 'replied': return <span className="status-badge-lux replied">Selesai</span>;
            default: return <span className="status-badge-lux read">Dibaca</span>;
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    // Stats
    const stats = {
        total: messages.length,
        unread: messages.filter(m => m.status === 'unread').length,
        replied: messages.filter(m => m.status === 'replied').length
    };

    return (
        <div className="comm-page-lux">
            {/* Header Stats */}
            <div className="comm-stats-grid mb-6">
                <div className="comm-stat-card shadow-lg shadow-slate-200/50">
                    <div className="stat-icon-lux bg-blue-50 text-blue-600"><Inbox size={20} /></div>
                    <div className="stat-info-lux">
                        <span className="label">Total Pesan</span>
                        <span className="value">{stats.total}</span>
                    </div>
                </div>
                <div className="comm-stat-card shadow-lg shadow-red-200/50">
                    <div className="stat-icon-lux bg-red-50 text-red-600"><AlertCircle size={20} /></div>
                    <div className="stat-info-lux">
                        <span className="label">Belum Dibaca</span>
                        <span className="value">{stats.unread}</span>
                    </div>
                </div>
                <div className="comm-stat-card shadow-lg shadow-green-200/50">
                    <div className="stat-icon-lux bg-green-50 text-green-600"><CheckCircle2 size={20} /></div>
                    <div className="stat-info-lux">
                        <span className="label">Selesai</span>
                        <span className="value">{stats.replied}</span>
                    </div>
                </div>
            </div>

            <div className="comm-main-container flex gap-6 h-[calc(100vh-280px)]">
                {/* Sidebar List */}
                <div className="comm-sidebar glass-card flex flex-col w-1/3 overflow-hidden">
                    <div className="p-4 border-b bg-white/50">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-black text-xl text-slate-800">Inbound</h2>
                            <button onClick={fetchMessages} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <Clock size={16} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, email, atau pesan..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="comm-tabs-lux">
                            <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? 'active' : ''}>Semua</button>
                            <button onClick={() => setActiveTab('unread')} className={activeTab === 'unread' ? 'active' : ''}>Baru</button>
                            <button onClick={() => setActiveTab('replied')} className={activeTab === 'replied' ? 'active' : ''}>Selesai</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-12 text-center text-slate-400">
                                <div className="loader-lux mb-2"></div>
                                <p className="text-sm font-bold">Menyelaraskan data...</p>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="p-12 text-center">
                                <Inbox size={48} className="mx-auto mb-4 text-slate-200" />
                                <p className="text-slate-400 text-sm font-medium">Tidak ada pesan yang ditemukan.</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        if (msg.status === 'unread') handleUpdateStatus(msg.id, 'read');
                                    }}
                                    className={`comm-item-lux ${selectedMessage?.id === msg.id ? 'active' : ''} ${msg.status === 'unread' ? 'is-unread' : ''}`}
                                >
                                    <div className="avatar-lux">
                                        {getInitials(msg.name)}
                                    </div>
                                    <div className="item-content-lux">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="name">{msg.name}</h4>
                                            <span className="time">{new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                        <p className="subject">{msg.subject}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="preview">{msg.message}</p>
                                            {getStatusBadge(msg.status)}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="arrow-lux" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail Content */}
                <div className="comm-content glass-card flex-1 flex flex-col overflow-hidden relative">
                    {selectedMessage ? (
                        <>
                            <div className="p-8 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusBadge(selectedMessage.status)}
                                            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Pesan Masuk • {selectedMessage.id}</span>
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedMessage.subject}</h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(selectedMessage.id)}
                                            className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm"
                                            title="Hapus Pesan"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        {selectedMessage.status !== 'replied' && (
                                            <button
                                                onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
                                            >
                                                <CheckCircle size={20} /> Tandai Selesai
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                                        <User size={14} className="text-slate-400" />
                                        <span className="font-bold text-slate-700">{selectedMessage.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                                        <Mail size={14} className="text-slate-400" />
                                        <span className="font-medium text-slate-600">{selectedMessage.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl ml-auto">
                                        <Clock size={14} className="text-slate-400" />
                                        <span className="font-medium text-slate-500">{formatDate(selectedMessage.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-slate-800 text-lg whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            <div className="p-8 border-t bg-white/80">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800">Respon Efisien</h4>
                                            <p className="text-xs text-slate-400">Gunakan email klien untuk menjawab secara profesional.</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/10"
                                    >
                                        <Mail size={18} /> Balas via Email
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Inbox size={48} className="text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Workflow Komunikasi</h3>
                            <p className="text-slate-400 max-w-xs">Pilih salah satu pesan dari daftar inbound untuk mulai mengelola interaksi Anda.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .comm-page-lux {
                    animation: fadeIn 0.5s ease-out;
                    font-family: 'Outfit', sans-serif;
                }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .comm-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }

                .comm-stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    border: 1px solid #f1f5f9;
                }

                .stat-icon-lux {
                    width: 48px;
                    height: 48px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stat-info-lux .label { display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
                .stat-info-lux .value { display: block; font-size: 1.5rem; font-weight: 900; color: #0f172a; }

                .comm-tabs-lux {
                    display: flex;
                    background: #f1f5f9;
                    padding: 0.3rem;
                    border-radius: 12px;
                    gap: 0.2rem;
                }

                .comm-tabs-lux button {
                    flex: 1;
                    padding: 0.5rem;
                    border: none;
                    background: none;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #64748b;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .comm-tabs-lux button.active {
                    background: white;
                    color: #ef4444;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .comm-item-lux {
                    padding: 1.25rem;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    border-bottom: 1px solid #f8fafc;
                    position: relative;
                }

                .comm-item-lux:hover { background: #f8fafc; }
                .comm-item-lux.active { background: #fef2f2; }
                .comm-item-lux.active::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: #ef4444;
                }

                .avatar-lux {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 900;
                    color: #475569;
                    flex-shrink: 0;
                }

                .comm-item-lux.is-unread .avatar-lux {
                    background: #fee2e2;
                    color: #ef4444;
                }

                .item-content-lux { flex: 1; min-width: 0; }
                .item-content-lux .name { font-size: 0.9rem; font-weight: 900; color: #1e293b; margin: 0; }
                .item-content-lux .time { font-size: 0.7rem; color: #94a3b8; font-weight: 700; }
                .item-content-lux .subject { font-size: 0.8rem; font-weight: 700; color: #475569; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .item-content-lux .preview { font-size: 0.75rem; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; margin-right: 0.5rem; }

                .status-badge-lux {
                    padding: 0.2rem 0.6rem;
                    border-radius: 6px;
                    font-size: 0.65rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-badge-lux.unread { background: #fee2e2; color: #ef4444; }
                .status-badge-lux.read { background: #f1f5f9; color: #64748b; }
                .status-badge-lux.replied { background: #dcfce7; color: #15803d; }

                .arrow-lux { color: #cbd5e1; transition: 0.3s; opacity: 0; transform: translateX(-10px); }
                .comm-item-lux:hover .arrow-lux { opacity: 1; transform: translateX(0); }
                .comm-item-lux.active .arrow-lux { color: #ef4444; opacity: 1; transform: translateX(0); }

                .loader-lux {
                    width: 24px;
                    height: 24px;
                    border: 3px solid #f1f5f9;
                    border-top: 3px solid #ef4444;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }

                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

                @media (max-width: 1024px) {
                    .comm-stats-grid { grid-template-columns: 1fr; }
                    .comm-main-container { flex-direction: column; height: auto; }
                    .comm-sidebar { width: 100%; height: 400px; }
                }
            `}</style>
        </div>
    );
};

export default Communication;

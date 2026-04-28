import { API_URL } from '../../config';
import React from 'react';
import { Users, FileText, BookOpen, MessageSquare, TrendingUp, Calendar, ArrowRight, Star } from 'lucide-react';
import axios from 'axios';

const DashboardOverview = ({ content }) => {
    const path = window.location.pathname;
    const isPenulisPath = path.startsWith('/penulis');
    const keyPrefix = isPenulisPath ? 'penulis_' : 'admin_';

    const role = localStorage.getItem(`${keyPrefix}role`);
    const username = localStorage.getItem(`${keyPrefix}username`) || 'User';
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem(`${keyPrefix}token`);
                // Use a more robust URL approach or relative if proxy is set, 
                // but sticking to the current port pattern for consistency with other parts of the app
                const apiUrl = `${API_URL}/admin/stats`;
                const resp = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (resp.data) {
                    setStats(resp.data);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
                // Optionally set a flag for connection error UI
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [keyPrefix]);

    const adminStats = [
        { label: 'Total Pesan', value: stats?.totalMessages ?? 0, icon: <MessageSquare size={20} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
        { label: 'Pengunjung', value: stats?.totalVisits ?? 0, icon: <Users size={20} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        { label: 'View Artikel', value: stats?.totalPostViews ?? 0, icon: <FileText size={20} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        { label: 'View E-Book', value: stats?.totalEbookViews ?? 0, icon: <BookOpen size={20} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    ];

    const authorStats = [
        { label: 'Artikel Saya', value: stats?.myPosts ?? 0, icon: <FileText size={20} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
        { label: 'View Artikel', value: stats?.myPostViews ?? 0, icon: <Users size={20} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        { label: 'E-Book Materi', value: stats?.myEbooks ?? 0, icon: <BookOpen size={20} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
        { label: 'View E-Book', value: stats?.myEbookViews ?? 0, icon: <TrendingUp size={20} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    ];

    const displayStats = (role === 'Super Admin' || role === 'Editor') ? adminStats : authorStats;

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Dashboard Data...</div>;

    return (
        <div className="dashboard-wrapper">
            {/* 1. Header Area */}
            <div className="dashboard-header-premium">
                <div className="welcome-box">
                    <div className="avatar-preview">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1>Selamat Datang, {username}</h1>
                        <p>Berikut adalah ringkasan performa konten Anda hari ini.</p>
                    </div>
                </div>
                <div className="header-date">
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {/* 2. Stat Cards */}
            <div className="stats-grid-premium">
                {displayStats.map((stat, idx) => (
                    <div key={idx} className="premium-stat-card">
                        <div className="stat-icon-box" style={{ backgroundColor: stat.bg, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <span className="val">{stat.value.toLocaleString()}</span>
                            <span className="lab">{stat.label}</span>
                        </div>
                        <div className="stat-trend">
                            <TrendingUp size={14} />
                            <span>Active</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Detailed Analytics Section */}
            <div className="analytics-details-grid">
                {/* Top Articles Table */}
                <div className="details-card">
                    <div className="card-head">
                        <h3><FileText size={18} /> Performa Artikel Terpopuler</h3>
                        <span className="badge-details">Top 10</span>
                    </div>
                    <div className="table-responsive">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '45%' }}>Judul Artikel</th>
                                    <th style={{ width: '25%' }}>Kategori</th>
                                    <th style={{ width: '15%' }}>Views</th>
                                    <th style={{ width: '15%' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.topPosts?.length > 0 ? stats.topPosts.map(post => (
                                    <tr key={post.id}>
                                        <td className="font-bold text-slate-700">
                                            <div className="title-truncate" title={post.title}>{post.title}</div>
                                        </td>
                                        <td><span className="table-tag">{post.category || 'Uncategorized'}</span></td>
                                        <td className="text-blue-600 font-bold">{post.views}</td>
                                        <td>
                                            <div className="status-cell">
                                                <span className="dot-active"></span>
                                                <span className="status-text">Terbit</span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="text-center py-8 opacity-50">Belum ada data artikel.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top E-Books Table */}
                <div className="details-card">
                    <div className="card-head">
                        <h3><BookOpen size={18} /> Performa E-Book Terpopuler</h3>
                        <span className="badge-details">Top 10</span>
                    </div>
                    <div className="table-responsive">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '60%' }}>Judul E-Book</th>
                                    <th style={{ width: '15%' }}>Views</th>
                                    <th style={{ width: '25%' }}>Interest</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.topEbooks?.length > 0 ? stats.topEbooks.map(ebook => (
                                    <tr key={ebook.id}>
                                        <td className="font-bold text-slate-700">
                                            <div className="title-truncate" title={ebook.title}>{ebook.title}</div>
                                        </td>
                                        <td className="text-purple-600 font-bold">{ebook.views}</td>
                                        <td>
                                            <div className="interest-meter">
                                                <div className="meter-fill" style={{ width: `${Math.min(100, (ebook.views / (stats.totalEbookViews || 1)) * 100)}%`, backgroundColor: '#8b5cf6' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="text-center py-8 opacity-50">Belum ada data e-book.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-wrapper { padding: 1rem 0; }
                
                /* HEADER */
                .dashboard-header-premium {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                }
                .welcome-box { display: flex; align-items: center; gap: 1.5rem; }
                .avatar-preview {
                    width: 60px; height: 60px; 
                    background: linear-gradient(135deg, var(--brand-red), #b91c1c);
                    color: white; border-radius: 18px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.5rem; font-weight: 900;
                    box-shadow: 0 10px 20px rgba(218, 41, 28, 0.2);
                }
                .welcome-box h1 { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem; }
                .welcome-box p { color: #64748b; font-size: 1rem; }
                .header-date { 
                    display: flex; align-items: center; gap: 0.8rem; 
                    background: white; padding: 0.8rem 1.2rem; border-radius: 12px;
                    border: 1px solid #e2e8f0; font-weight: 700; color: #64748b; font-size: 0.9rem;
                }

                /* STAT CARDS */
                .stats-grid-premium {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .premium-stat-card {
                    background: white; padding: 1.5rem; border-radius: 20px;
                    border: 1px solid #f1f5f9; position: relative;
                    transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .premium-stat-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
                .stat-icon-box {
                    width: 44px; height: 44px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 1.2rem;
                }
                .stat-content .val { display: block; font-size: 1.8rem; font-weight: 900; color: #0f172a; margin-bottom: 0.2rem; }
                .stat-content .lab { color: #94a3b8; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.2px; }
                .stat-trend {
                    position: absolute; top: 1.5rem; right: 1.5rem;
                    display: flex; align-items: center; gap: 0.4rem;
                    color: #10b981; font-size: 0.7rem; font-weight: 800;
                }

                /* ANALYTICS DETAILS */
                .analytics-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .details-card { background: white; border-radius: 24px; border: 1px solid #f1f5f9; overflow: hidden; display: flex; flex-direction: column; }
                .card-head { 
                    padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .card-head h3 { font-size: 1rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.8rem; }
                .badge-details { background: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 700; }

                .table-responsive { overflow-x: auto; }
                .premium-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
                .premium-table th { 
                    text-align: left; padding: 1rem 1.5rem; background: #fafafa; 
                    font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; 
                    letter-spacing: 1px; font-weight: 800; border-bottom: 1px solid #f1f5f9; 
                }
                .premium-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #f8fafc; font-size: 0.85rem; vertical-align: middle; }
                .premium-table tr:last-child td { border-bottom: none; }
                
                .title-truncate {
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                    max-width: 100%; font-weight: 700; color: #334155;
                }
                
                .table-tag { background: #eff6ff; color: #3b82f6; padding: 3px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
                .dot-active { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
                .status-cell { display: flex; align-items: center; gap: 8px; }
                .status-text { font-size: 0.75rem; color: #64748b; font-weight: 600; }

                .interest-meter { width: 100%; height: 6px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
                .meter-fill { height: 100%; border-radius: 100px; transition: width 1s ease; }

                @media (max-width: 1400px) {
                    .premium-table th, .premium-table td { padding: 1rem; }
                }

                @media (max-width: 1200px) {
                    .stats-grid-premium { grid-template-columns: 1fr 1fr; }
                    .analytics-details-grid { grid-template-columns: 1fr; }
                }

                @media (max-width: 640px) {
                    .stats-grid-premium { grid-template-columns: 1fr; }
                    .dashboard-header-premium { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default DashboardOverview;

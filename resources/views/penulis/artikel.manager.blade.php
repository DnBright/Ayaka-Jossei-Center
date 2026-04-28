import { API_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Plus, FileText, Edit2, Trash2, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArticleManager = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const path = window.location.pathname;
    const isPenulisPath = path.startsWith('/penulis');
    const keyPrefix = isPenulisPath ? 'penulis_' : 'admin_';

    const role = localStorage.getItem(`${keyPrefix}role`);
    const prefix = (role === 'Super Admin' || role === 'Editor') ? '/admin' : '/penulis';

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const token = localStorage.getItem(`${keyPrefix}token`);
            const apiUrl = `${API_URL}/admin/posts`;
            const resp = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(resp.data);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.')) return;

        try {
            const token = localStorage.getItem(`${keyPrefix}token`);
            const apiUrl = `${API_URL}/admin/posts/${id}`;
            await axios.delete(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Artikel berhasil dihapus');
            fetchArticles(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Gagal menghapus artikel: ' + (err.response?.data?.error || err.message));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'publish': return <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Published</span>;
            case 'pending': return <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending Review</span>;
            default: return <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">Draft</span>;
        }
    };

    const filteredArticles = articles.filter(art =>
        art.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="premium-manager-wrapper">
            <div className="manager-header">
                <div className="header-info">
                    <h2>Artikel & Media Journal</h2>
                    <p>Kelola semua publikasi artikel dan konten berita di platform.</p>
                </div>
                <Link to={`${prefix}/articles/new`} className="btn-premium-action">
                    <Plus size={18} /> Buat Artikel Baru
                </Link>
            </div>

            <div className="manager-filters">
                <div className="search-pill">
                    <Search size={18} className="icon-fade" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan judul artikel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-stats">
                    <span>Showing {filteredArticles.length} Articles</span>
                </div>
            </div>

            <div className="premium-table-container">
                <table className="premium-table-lux">
                    <thead>
                        <tr>
                            <th>Informasi Artikel</th>
                            <th>Kategori</th>
                            <th>Status Publikasi</th>
                            <th>Aktivitas (Views)</th>
                            <th>Terakhir Update</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map(art => (
                            <tr key={art.id}>
                                <td>
                                    <div className="art-title-cell">
                                        <div className="art-icon-box">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <span className="title-main">{art.title}</span>
                                            <span className="slug-sub">/{art.slug}</span>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge-cat">{art.category}</span></td>
                                <td>{getStatusBadge(art.status)}</td>
                                <td>
                                    <div className="views-activity">
                                        <Eye size={14} />
                                        <span className="view-val">{art.views || 0}</span>
                                    </div>
                                </td>
                                <td className="text-slate-400 font-medium">
                                    {new Date(art.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="text-right">
                                    <div className="action-row-lux">
                                        <Link to={`${prefix}/articles/edit/${art.id}`} className="act-btn edit" title="Edit Content">
                                            <Edit2 size={16} />
                                        </Link>
                                        <button
                                            className="act-btn delete"
                                            title="Move to Trash"
                                            onClick={() => handleDelete(art.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredArticles.length === 0 && !loading && (
                    <div className="empty-state-lux">
                        <FileText size={48} />
                        <p>Tidak ada artikel yang ditemukan.</p>
                    </div>
                )}
            </div>

            <style>{`
                .premium-manager-wrapper { padding: 1rem 0; }
                
                .manager-header { 
                    display: flex; justify-content: space-between; align-items: center; 
                    margin-bottom: 2.5rem; 
                }
                .header-info h2 { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 0.3rem; }
                .header-info p { color: #64748b; font-size: 1rem; }
                
                .btn-premium-action {
                    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
                    color: white; padding: 0.8rem 1.5rem; border-radius: 14px;
                    display: flex; align-items: center; gap: 0.8rem;
                    font-weight: 800; font-size: 0.95rem;
                    box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2);
                    transition: all 0.3s;
                }
                .btn-premium-action:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.3); }

                .manager-filters {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 2rem; gap: 2rem;
                }
                .search-pill {
                    flex: 1; display: flex; align-items: center; gap: 1rem;
                    background: white; padding: 0.8rem 1.5rem; border-radius: 100px;
                    border: 1px solid #e2e8f0; transition: 0.3s;
                }
                .search-pill:focus-within { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
                .search-pill input { border: none; outline: none; width: 100%; font-size: 0.9rem; font-weight: 500; color: #0f172a; }
                .icon-fade { color: #94a3b8; }
                .filter-stats { color: #64748b; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }

                .premium-table-container { 
                    background: white; border-radius: 24px; border: 1px solid #f1f5f9; 
                    overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }
                .premium-table-lux { width: 100%; border-collapse: collapse; }
                .premium-table-lux th { 
                    text-align: left; padding: 1.5rem 2rem; background: #fafafa;
                    font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;
                    letter-spacing: 1.5px; font-weight: 800; border-bottom: 1px solid #f1f5f9;
                }
                .premium-table-lux td { padding: 1.5rem 2rem; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
                .premium-table-lux tr:hover { background: #fafafa; }
                
                .art-title-cell { display: flex; align-items: center; gap: 1.2rem; }
                .art-icon-box { 
                    width: 40px; height: 40px; background: #f1f5f9; color: #64748b;
                    border-radius: 10px; display: flex; align-items: center; justify-content: center;
                }
                .title-main { display: block; font-weight: 700; color: #0f172a; font-size: 0.95rem; line-height: 1.4; margin-bottom: 2px; }
                .slug-sub { display: block; font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
                
                .badge-cat { background: #f0f9ff; color: #0ea5e9; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; }
                
                .views-activity { display: flex; align-items: center; gap: 0.5rem; color: #3b82f6; font-weight: 800; font-size: 0.9rem; }
                
                .action-row-lux { display: flex; justify-content: flex-end; gap: 0.8rem; }
                .act-btn { 
                    width: 36px; height: 36px; border-radius: 10px; display: flex;
                    align-items: center; justify-content: center; transition: all 0.2s;
                }
                .act-btn.edit { background: #eff6ff; color: #2563eb; }
                .act-btn.edit:hover { background: #2563eb; color: white; transform: translateY(-2px); }
                .act-btn.delete { background: #fef2f2; color: #ef4444; }
                .act-btn.delete:hover { background: #ef4444; color: white; transform: translateY(-2px); }

                .empty-state-lux { padding: 5rem 0; text-align: center; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .empty-state-lux p { font-weight: 600; font-size: 1.1rem; }
            `}</style>
        </div>
    );
};

export default ArticleManager;

import { API_URL } from '../../../config';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Edit2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BlogEditor = ({ content, refreshContent }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        date: '',
        image: ''
    });

    useEffect(() => {
        if (content && content.blog && content.blog.posts) {
            setArticles(content.blog.posts);
        }
    }, [content]);

    const handleEditClick = (post, index) => {
        setEditingId(index);
        setFormData({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '', // In real app, this might be HTML or Markdown
            category: post.category || '',
            author: post.author || 'Admin',
            date: post.date || new Date().toISOString().split('T')[0],
            image: post.image || ''
        });
    };

    const handleCreateNew = () => {
        setEditingId(-1);
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: '',
            author: 'Admin',
            date: new Date().toISOString().split('T')[0],
            image: ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSavePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simple slug generation
        const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const newPost = {
            ...formData,
            slug: slug,
            id: editingId === -1 ? Date.now() : articles[editingId].id
        };

        let updatedPosts = [...articles];
        if (editingId !== null && editingId !== -1) {
            updatedPosts[editingId] = newPost;
        } else {
            updatedPosts.unshift(newPost); // Add new post to top
        }

        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...content.blog,
                posts: updatedPosts
            };

            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'blog',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Artikel berhasil disimpan!');
            if (refreshContent) refreshContent();
            setArticles(updatedPosts);
            handleCancelEdit();

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Gagal menyimpan artikel.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index) => {
        if (!window.confirm('Hapus artikel ini?')) return;
        setLoading(true);

        const updatedPosts = articles.filter((_, i) => i !== index);

        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...content.blog,
                posts: updatedPosts
            };

            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'blog',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Artikel dihapus.');
            if (refreshContent) refreshContent();
            setArticles(updatedPosts);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Gagal menghapus artikel.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editor-container">
            <div className="editor-header mb-6">
                <Link to="/admin/pages" className="back-link">
                    <ArrowLeft size={20} /> Kembali
                </Link>
                <div className="flex justify-between items-center mt-2">
                    <h2 className="text-xl font-bold">Manajemen Blog</h2>
                    {editingId === null && (
                        <button
                            onClick={handleCreateNew}
                            className="btn-add flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                            <Plus size={16} /> Tulis Artikel Baru
                        </button>
                    )}
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {editingId === null ? (
                // Article List
                <div className="space-y-4">
                    {articles.map((post, idx) => (
                        <div key={idx} className="glass-card p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                {post.image ? (
                                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <FileText size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">{post.title}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditClick(post, idx)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(idx)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-xs text-secondary mt-1">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>{post.category}</span>
                                    <span>•</span>
                                    <span>{post.author}</span>
                                </div>
                                <p className="text-secondary text-sm mt-2 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                    ))}
                    {articles.length === 0 && (
                        <div className="text-center py-12 text-secondary bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            Belum ada artikel.
                        </div>
                    )}
                </div>
            ) : (
                // Edit Form
                <form onSubmit={handleSavePost} className="glass-card p-8">
                    <h3 className="text-lg font-bold mb-6 border-b pb-2">
                        {editingId === -1 ? 'Artikel Baru' : 'Edit Artikel'}
                    </h3>

                    <div className="grid grid-2 gap-6 mb-4">
                        <div className="field-group">
                            <label className="block font-medium mb-1">Judul Artikel</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label className="block font-medium mb-1">Kategori</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Tips, Berita, Info..."
                            />
                        </div>
                    </div>

                    <div className="field-group mb-4">
                        <label className="block font-medium mb-1">URL Gambar Header</label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="field-group mb-4">
                        <label className="block font-medium mb-1">Ringkasan (Excerpt)</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={3}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Teks singkat yang muncul di daftar artikel..."
                        />
                    </div>

                    <div className="field-group mb-6">
                        <label className="block font-medium mb-1">Konten Lengkap</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={12}
                            className="w-full p-3 border rounded-lg font-mono text-sm"
                            placeholder="Tulis konten artikel di sini..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-6 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-save flex items-center gap-2 px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700"
                        >
                            <Save size={18} />
                            {loading ? 'Menyimpan...' : 'Publikasikan'}
                        </button>
                    </div>
                </form>
            )}

            <style>{`
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--secondary);
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }
                .back-link:hover { color: var(--brand-red); }
                .text-brand-red { color: var(--brand-red); }
                .bg-brand-red { background-color: var(--brand-red); }
                input:focus, textarea:focus { outline: 2px solid var(--brand-red); border-color: transparent; }
                .line-clamp-2 {
                     display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default BlogEditor;

import { API_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Image as ImageIcon, Globe, Lock, Calendar, Eye } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../styles/TextEditor.css'; // Custom WP style

const ArticleEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const path = window.location.pathname;
    const isPenulisPath = path.startsWith('/penulis');
    const keyPrefix = isPenulisPath ? 'penulis_' : 'admin_';

    // WordPress-like state
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        status: 'draft',
        access_status: 'public',
        image: ''
    });

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const token = localStorage.getItem(`${keyPrefix}token`);
            const apiUrl = `${API_URL}/admin/posts/${id}`;
            const resp = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e, targetStatus) => {
        if (e) e.preventDefault();
        setLoading(true);

        // Auto-generate slug if empty
        const slug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // Allow overriding status (e.g. "Save Draft" button vs "Publish" button)
        const finalStatus = targetStatus || formData.status;

        const dataToSave = { ...formData, slug, status: finalStatus };

        try {
            const token = localStorage.getItem(`${keyPrefix}token`);
            const apiUrl = id
                ? `${API_URL}/admin/posts/${id}`
                : `${API_URL}/admin/posts`;

            if (id) {
                await axios.put(apiUrl, dataToSave, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(apiUrl, dataToSave, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            const prefix = (localStorage.getItem(`${keyPrefix}role`) === 'Penulis') ? '/penulis' : '/admin';
            navigate(`${prefix}/articles`);
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.error || err.message || 'Gagal menyimpan artikel';
            alert(`Gagal menyimpan artikel: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // Quill Configuration mimics WordPress Classic (TinyMCE)
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'blockquote', 'code-block',
        'align',
        'link', 'image'
    ];

    return (
        <div className="article-editor-wp">
            <style>{`
                .article-editor-wp {
                    min-height: 100vh;
                    background: #f0f0f1; /* WP Admin Background */
                    padding: 2rem;
                }
                @media (max-width: 768px) {
                    .article-editor-wp {
                        padding: 1rem;
                    }
                }
                .wp-input-title {
                    font-size: 1.5rem;
                    border: 1px solid #ddd;
                    padding: 10px 15px;
                    width: 100%;
                    outline: none;
                    margin-bottom: 20px;
                    background: white;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .wp-input-title:focus {
                    border-color: #8c8f94;
                    box-shadow: 0 0 0 1px #8c8f94;
                }
                .wp-meta-box {
                    background: white;
                    border: 1px solid #dcdcde;
                    box-shadow: 0 1px 1px rgba(0,0,0,0.04);
                    margin-bottom: 20px;
                }
                .wp-meta-header {
                    padding: 10px 15px;
                    border-bottom: 1px solid #dcdcde;
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .wp-meta-content {
                    padding: 15px;
                }
                .btn-wp {
                    border: 1px solid #2271b1;
                    background: #2271b1;
                    color: white;
                    padding: 0 12px;
                    height: 32px;
                    line-height: 32px;
                    font-size: 13px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .btn-wp:hover { background: #135e96; }
                
                .btn-wp-secondary {
                    border: 1px solid #dcdcde;
                    background: #f6f7f7;
                    color: #2271b1;
                    padding: 0 12px;
                    height: 32px;
                    line-height: 30px;
                    font-size: 13px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-weight: 500;
                }
                .btn-wp-secondary:hover { background: #f0f0f1; border-color: #c3c4c7; color: #135e96; }

                .btn-wp-danger {
                    color: #b32d2e;
                    background: transparent;
                    border: none;
                    font-size: 13px;
                    text-decoration: underline;
                    cursor: pointer;
                }
            `}</style>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-normal text-slate-800">
                    {id ? 'Edit Post' : 'Add New Post'}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* LEFT COLUMN: Main Editor */}
                <div className="lg:col-span-3">
                    <input
                        type="text"
                        className="wp-input-title"
                        placeholder="Enter title here"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <div className="mb-4">
                        <button className="btn-wp-secondary flex items-center gap-1">
                            <ImageIcon size={14} /> Add Media
                        </button>
                    </div>

                    <div className="bg-white">
                        <ReactQuill
                            theme="snow"
                            value={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            modules={modules}
                            formats={formats}
                            placeholder="Start writing..."
                        />
                    </div>

                    {/* Excerpt Meta Box (Optional but good for SEO) */}
                    <div className="wp-meta-box mt-6">
                        <div className="wp-meta-header">Excerpt</div>
                        <div className="wp-meta-content">
                            <textarea
                                className="w-full border p-2 text-sm text-slate-600 h-20"
                                placeholder="Write a short summary..."
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                            <p className="text-xs text-slate-500 mt-1">Excerpts are optional hand-crafted summaries of your content that can be used in your theme.</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar */}
                <div className="space-y-5">

                    {/* PUBLISH META BOX */}
                    <div className="wp-meta-box">
                        <div className="wp-meta-header">Publish</div>
                        <div className="wp-meta-content space-y-4 text-sm">
                            <div className="flex justify-between">
                                <button type="button" onClick={(e) => handleSave(e, 'draft')} className="btn-wp-secondary">Save Draft</button>
                                <button type="button" className="btn-wp-secondary">Preview</button>
                            </div>

                            <div className="py-2 border-t border-b border-slate-100 space-y-2">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Lock size={14} /> Status: <span className="font-bold">{formData.status}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Globe size={14} /> Visibility:
                                    <select
                                        className="ml-1 border-none bg-transparent font-bold text-blue-600 cursor-pointer focus:outline-none"
                                        value={formData.access_status}
                                        onChange={(e) => setFormData({ ...formData, access_status: e.target.value })}
                                    >
                                        <option value="public">Public</option>
                                        <option value="member">Members Only</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Calendar size={14} /> Publish: <span className="font-bold">Immediately</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-1">
                                <button type="button" className="btn-wp-danger">Move to Trash</button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSave(e, 'publish')}
                                    className="btn-wp"
                                >
                                    {id ? 'Update' : 'Publish'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CATEGORIES META BOX */}
                    <div className="wp-meta-box">
                        <div className="wp-meta-header">Categories</div>
                        <div className="wp-meta-content">
                            <div className="max-h-60 overflow-y-auto border p-3 mb-2 bg-slate-50 rounded-lg">
                                {[
                                    'Berita',
                                    'Tips Karir',
                                    'Budaya Jepang',
                                    'Info Magang',
                                    'Internal Journal'
                                ].map(cat => (
                                    <label key={cat} className="flex items-center gap-3 mb-2 text-sm cursor-pointer hover:text-red-600 font-semibold text-slate-600 transition-colors">
                                        <input
                                            type="radio"
                                            name="category"
                                            className="accent-red-600 w-4 h-4"
                                            checked={formData.category === cat}
                                            onChange={() => setFormData({ ...formData, category: cat })}
                                        />
                                        {cat}
                                    </label>
                                ))}
                                <label className="flex items-center gap-3 mb-2 text-sm cursor-pointer hover:text-red-600 font-semibold text-slate-400 italic">
                                    <input
                                        type="radio"
                                        name="category"
                                        className="accent-red-600 w-4 h-4 text-slate-300"
                                        checked={!['Berita', 'Tips Karir', 'Budaya Jepang', 'Info Magang', 'Internal Journal'].includes(formData.category)}
                                        readOnly
                                    />
                                    Uncategorized / Other
                                </label>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <input
                                    type="text"
                                    placeholder="Add custom..."
                                    className="text-xs border p-1 w-full rounded focus:outline-red-500"
                                    onBlur={(e) => {
                                        if (e.target.value) setFormData({ ...formData, category: e.target.value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* FEATURED IMAGE META BOX */}
                    <div className="wp-meta-box">
                        <div className="wp-meta-header">Featured Image</div>
                        <div className="wp-meta-content">
                            {formData.image ? (
                                <div className="mb-2 group relative">
                                    <img src={formData.image} alt="Featured" className="w-full h-auto border rounded" />
                                    <button
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 text-xs mb-2 border border-dashed border-slate-300">
                                    No image selected
                                </div>
                            )}

                            <div className="mb-2">
                                <input
                                    type="text"
                                    className="w-full border p-1 text-xs"
                                    placeholder="Paste Image URL here..."
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            <button type="button" className="text-blue-600 underline text-xs font-semibold">Set featured image</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ArticleEditor;

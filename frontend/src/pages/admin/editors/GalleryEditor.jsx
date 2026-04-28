import { API_URL } from '../../../config';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GalleryEditor = ({ content, refreshContent }) => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Form state for new item
    const [newItem, setNewItem] = useState({
        src: '',
        category: '',
        caption: ''
    });

    useEffect(() => {
        if (content && content.galeri && content.galeri.items) {
            setGalleryItems(content.galeri.items);
            // Extract unique categories
            const uniqueCats = [...new Set(content.galeri.items.map(item => item.category))];
            setCategories(uniqueCats);
        }
    }, [content]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedItems = [...galleryItems, newItem];

        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...content.galeri,
                items: updatedItems
            };

            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'galeri',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Item galeri berhasil ditambahkan!');
            if (refreshContent) refreshContent();
            setGalleryItems(updatedItems);
            setNewItem({ src: '', category: '', caption: '' });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Gagal menambahkan item.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index) => {
        if (!window.confirm('Hapus item ini dari galeri?')) return;
        setLoading(true);

        const updatedItems = galleryItems.filter((_, i) => i !== index);

        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...content.galeri,
                items: updatedItems
            };

            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'galeri',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Item dihapus.');
            if (refreshContent) refreshContent();
            setGalleryItems(updatedItems);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Gagal menghapus item.');
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
                <h2 className="text-xl font-bold mt-2">Manajemen Galeri</h2>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-2 gap-8">
                {/* Form Add New */}
                <div>
                    <form onSubmit={handleAddItem} className="glass-card p-6 sticky top-24">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Tambah Item Baru</h3>

                        <div className="field-group mb-4">
                            <label className="block font-medium mb-1">URL Gambar / Video</label>
                            <input
                                type="text"
                                value={newItem.src}
                                onChange={(e) => setNewItem({ ...newItem, src: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="https://..."
                                required
                            />
                        </div>

                        <div className="field-group mb-4">
                            <label className="block font-medium mb-1">Kategori</label>
                            <input
                                type="text"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Contoh: Kegiatan, Fasilitas"
                                list="category-list"
                                required
                            />
                            <datalist id="category-list">
                                {categories.map((cat, i) => <option key={i} value={cat} />)}
                            </datalist>
                        </div>

                        <div className="field-group mb-6">
                            <label className="block font-medium mb-1">Caption</label>
                            <input
                                type="text"
                                value={newItem.caption}
                                onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Deskripsi singkat..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-save flex items-center justify-center gap-2 px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            <Plus size={18} /> Tambah ke Galeri
                        </button>
                    </form>
                </div>

                {/* Gallery Grid */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Daftar Item ({galleryItems.length})</h3>
                    <div className="grid grid-2 gap-4">
                        {galleryItems.map((item, idx) => (
                            <div key={idx} className="glass-card p-2 relative group">
                                <div className="aspect-ratio-box bg-slate-100 rounded-lg overflow-hidden relative">
                                    {/* Simple check for image vs video, mostly assume image for now */}
                                    <img
                                        src={item.src}
                                        alt={item.caption}
                                        className="w-full h-32 object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=No+Image' }}
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(idx)}
                                            className="p-1 bg-white text-red-600 rounded shadow hover:bg-red-50"
                                            title="Hapus"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 px-1">
                                    <span className="text-xs font-semibold bg-brand-red text-white px-2 py-0.5 rounded-full">
                                        {item.category}
                                    </span>
                                    <p className="text-xs text-secondary mt-1 truncate">{item.caption || 'Tanpa caption'}</p>
                                </div>
                            </div>
                        ))}
                        {galleryItems.length === 0 && (
                            <div className="col-span-2 text-center py-8 text-secondary border border-dashed rounded-lg">
                                Galeri kosong.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .sticky { position: sticky; }
                .top-24 { top: 6rem; }
                .aspect-ratio-box { position: relative; }
                .group:hover .group-hover\:opacity-100 { opacity: 1; }
            `}</style>
        </div>
    );
};

export default GalleryEditor;

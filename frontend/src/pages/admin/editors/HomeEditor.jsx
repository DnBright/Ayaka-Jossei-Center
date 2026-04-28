import { API_URL } from '../../../config';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomeEditor = ({ content, refreshContent }) => {
    const [formData, setFormData] = useState({
        headline: '',
        subheadline: '',
        ctaText: '',
        welcomeTitle: '',
        welcomeDesc: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Load initial data
    useEffect(() => {
        if (content && content.hero) {
            setFormData({
                headline: content.hero.headline || '',
                subheadline: content.hero.subheadline || '',
                ctaText: content.hero.ctaText || '',
                welcomeTitle: content.hero.welcomeTitle || '', // Assuming these fields exist or will exist
                welcomeDesc: content.hero.welcomeDesc || ''
            });
        }
    }, [content]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'hero',
                content_data: formData,
                is_visible: 1,
                sort_order: 0
            }, {
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Perubahan berhasil disimpan!');
            if (refreshContent) refreshContent();

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating content:', error);
            setMessage('Gagal menyimpan perubahan.');
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
                <h2 className="text-xl font-bold mt-2">Edit Halaman Home (Beranda)</h2>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-card p-8">
                <div className="form-section mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-brand-red border-b pb-2">Hero Section</h3>

                    <div className="field-group mb-4">
                        <label className="block font-medium mb-1">Headline Utama</label>
                        <input
                            type="text"
                            name="headline"
                            value={formData.headline}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Contoh: Wujudkan Mimpi Bekerja di Jepang"
                        />
                        <p className="text-xs text-secondary mt-1">Judul besar yang muncul pertama kali.</p>
                    </div>

                    <div className="field-group mb-4">
                        <label className="block font-medium mb-1">Sub-Headline</label>
                        <textarea
                            name="subheadline"
                            value={formData.subheadline}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Deskripsi singkat di bawah judul utama..."
                        />
                    </div>

                    <div className="field-group mb-4">
                        <label className="block font-medium mb-1">Teks Tombol CTA</label>
                        <input
                            type="text"
                            name="ctaText"
                            value={formData.ctaText}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Contoh: Konsultasi Sekarang"
                        />
                        <p className="text-xs text-secondary mt-1">Label pada tombol ajakan bertindak (Call to Action).</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-save flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

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
                .hover\:bg-red-700:hover { background-color: #b91c1c; }
                input:focus, textarea:focus { outline: 2px solid var(--brand-red); border-color: transparent; }
            `}</style>
        </div>
    );
};

export default HomeEditor;

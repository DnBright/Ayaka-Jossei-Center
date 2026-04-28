import { API_URL } from '../../../config';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AboutEditor = ({ content, refreshContent }) => {
    const [formData, setFormData] = useState({
        description: '',
        visi: '',
        misi: '', // content.tentang.misi might be an array or string, we'll wait to see
        values: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (content && content.tentang) {
            setFormData({
                description: content.tentang.description || '',
                visi: content.tentang.visi || '',
                misi: Array.isArray(content.tentang.misi)
                    ? content.tentang.misi.join('\n')
                    : (content.tentang.misi || ''),
                values: content.tentang.values || ''
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

        // Convert newline separated string back to array for Misi if needed
        const submissionData = {
            ...formData,
            misi: formData.misi.split('\n').filter(item => item.trim() !== '')
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'tentang',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Konten "Tentang Ayaka" berhasil diperbarui!');
            if (refreshContent) refreshContent();

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating about content:', error);
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
                <h2 className="text-xl font-bold mt-2">Edit Halaman Tentang Ayaka</h2>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-card p-8">
                <div className="field-group mb-6">
                    <label className="block font-medium mb-2">Deskripsi Lembaga</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Jelaskan secara singkat tentang Ayaka Josei Center..."
                    />
                </div>

                <div className="grid grid-2 gap-6 mb-6">
                    <div className="field-group">
                        <label className="block font-medium mb-2">Visi</label>
                        <textarea
                            name="visi"
                            value={formData.visi}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Visi lembaga..."
                        />
                    </div>
                    <div className="field-group">
                        <label className="block font-medium mb-2">Misi (Satu per baris)</label>
                        <textarea
                            name="misi"
                            value={formData.misi}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Misi 1&#10;Misi 2&#10;Misi 3"
                        />
                        <p className="text-xs text-secondary mt-1">Pisahkan setiap poin misi dengan baris baru (Enter).</p>
                    </div>
                </div>

                <div className="field-group mb-6">
                    <label className="block font-medium mb-2">Nilai-Nilai Lembaga</label>
                    <textarea
                        name="values"
                        value={formData.values}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Integritas, Profesionalisme, ..."
                    />
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
                input:focus, textarea:focus { outline: 2px solid var(--brand-red); border-color: transparent; }
            `}</style>
        </div>
    );
};

export default AboutEditor;

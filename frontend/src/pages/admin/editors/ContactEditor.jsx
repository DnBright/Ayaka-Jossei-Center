import { API_URL } from '../../../config';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ContactEditor = ({ content, refreshContent }) => {
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        email: '',
        instagram: '',
        mapsUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (content && content.kontak) {
            setFormData({
                address: content.kontak.address || '',
                phone: content.kontak.phone || '',
                email: content.kontak.email || '',
                instagram: content.kontak.instagram || '',
                mapsUrl: content.kontak.mapsUrl || ''
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
            // Assuming contact data is stored in 'kontak' section
            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'kontak',
                content_data: formData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Informasi kontak berhasil diperbarui!');
            if (refreshContent) refreshContent();

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
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
                <h2 className="text-xl font-bold mt-2">Edit Informasi Kontak</h2>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-card p-8">
                <div className="grid grid-2 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-brand-red">Kontak Utama</h3>

                        <div className="field-group mb-4">
                            <label className="block font-medium mb-1">Nomor Telepon / WhatsApp</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="+62 8..."
                            />
                        </div>

                        <div className="field-group mb-4">
                            <label className="block font-medium mb-1">Email Resmi</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="admin@..."
                            />
                        </div>

                        <div className="field-group mb-4">
                            <label className="block font-medium mb-1">Instagram (Username/URL)</label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4 text-brand-red">Lokasi & Alamat</h3>

                        <div className="field-group mb-4">
                            <label className="block font-medium mb-1">Alamat Lengkap</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Jalan..."
                            />
                        </div>

                        <div className="field-group mb-4">
                            <label className="block font-medium mb-1">Google Maps Embed URL</label>
                            <input
                                type="text"
                                name="mapsUrl"
                                value={formData.mapsUrl}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="https://www.google.com/maps/embed?..."
                            />
                            <p className="text-xs text-secondary mt-1">Copy "Embed a map" HTML src dari Google Maps.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6 mt-6 flex justify-end">
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

        </div>
    );
};

export default ContactEditor;

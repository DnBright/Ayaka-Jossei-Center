import { API_URL } from '../../../config';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Edit2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AlumniEditor = ({ content, refreshContent }) => {
    const [alumniList, setAlumniList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        batch: '',
        job: '', // Or company
        testimoni: '',
        image: '',
        status: 'published' // published/draft
    });

    useEffect(() => {
        if (content && content.alumni && content.alumni.items) {
            setAlumniList(content.alumni.items);
        }
    }, [content]);

    const handleEditClick = (alumni, index) => {
        setEditingId(index);
        setFormData({
            name: alumni.name || '',
            batch: alumni.batch || '',
            job: alumni.job || '',
            testimoni: alumni.testimoni || '',
            image: alumni.image || '',
            status: alumni.status || 'published'
        });
    };

    const handleCreateNew = () => {
        setEditingId(-1);
        setFormData({
            name: '',
            batch: '',
            job: '',
            testimoni: '',
            image: '',
            status: 'published'
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newAlumni = { ...formData };
        let updatedList = [...alumniList];

        if (editingId !== null && editingId !== -1) {
            updatedList[editingId] = newAlumni;
        } else {
            updatedList.unshift(newAlumni);
        }

        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...content.alumni,
                items: updatedList
            };

            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'alumni',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Data alumni berhasil disimpan!');
            if (refreshContent) refreshContent();
            setAlumniList(updatedList);
            handleCancelEdit();

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Gagal menyimpan data alumni.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index) => {
        if (!window.confirm('Hapus data alumni ini?')) return;

        const updatedList = alumniList.filter((_, i) => i !== index);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...content.alumni,
                items: updatedList
            };

            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'alumni',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Data alumni dihapus.');
            if (refreshContent) refreshContent();
            setAlumniList(updatedList);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Gagal menghapus data.');
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
                    <h2 className="text-xl font-bold">Manajemen Alumni & Testimoni</h2>
                    {editingId === null && (
                        <button
                            onClick={handleCreateNew}
                            className="btn-add flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                            <Plus size={16} /> Tambah Alumni
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
                <div className="grid grid-2">
                    {alumniList.map((alumni, idx) => (
                        <div key={idx} className="glass-card p-4 flex gap-4 relative group">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                                {alumni.image ? (
                                    <img src={alumni.image} alt={alumni.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">{alumni.name}</h3>
                                <p className="text-xs text-secondary">{alumni.job || 'Alumni'} • Batch {alumni.batch || '-'}</p>
                                <p className="text-sm mt-2 italic text-secondary">"{alumni.testimoni}"</p>
                            </div>

                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-center">
                                <button onClick={() => handleEditClick(alumni, idx)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(idx)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {alumniList.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-secondary bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            Belum ada data alumni.
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSave} className="glass-card p-8">
                    <h3 className="text-lg font-bold mb-6 border-b pb-2">
                        {editingId === -1 ? 'Tambah Alumni' : 'Edit Alumni'}
                    </h3>

                    <div className="grid grid-2 gap-6 mb-4">
                        <div className="field-group">
                            <label className="block font-medium mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label className="block font-medium mb-1">Batch / Angkatan</label>
                            <input
                                type="text"
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Contoh: 12"
                            />
                        </div>
                    </div>

                    <div className="grid grid-2 gap-6 mb-4">
                        <div className="field-group">
                            <label className="block font-medium mb-1">Pekerjaan / Status</label>
                            <input
                                type="text"
                                value={formData.job}
                                onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Contoh: Bekerja di Osaka"
                            />
                        </div>
                        <div className="field-group">
                            <label className="block font-medium mb-1">URL Foto Profil</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="field-group mb-6">
                        <label className="block font-medium mb-1">Testimoni</label>
                        <textarea
                            value={formData.testimoni}
                            onChange={(e) => setFormData({ ...formData, testimoni: e.target.value })}
                            rows={4}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Kesan dan pesan selama di Ayaka..."
                            required
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
                            {loading ? 'Menyimpan...' : 'Simpan Data'}
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
            `}</style>
        </div>
    );
};

export default AlumniEditor;

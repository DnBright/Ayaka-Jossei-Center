import { API_URL } from '../../../config';
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProgramEditor = ({ content, refreshContent }) => {
    // We assume programs are stored in an array within content.program.items
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null); // ID or Index of program being edited

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        stages: ''
    });

    useEffect(() => {
        if (content && content.program && content.program.items) {
            setPrograms(content.program.items);
        }
    }, [content]);

    const handleEditClick = (program, index) => {
        setEditingId(index);
        setFormData({
            title: program.title || '',
            description: program.description || '',
            requirements: Array.isArray(program.requirements) ? program.requirements.join('\n') : (program.requirements || ''),
            stages: Array.isArray(program.stages) ? program.stages.join('\n') : (program.stages || '')
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', requirements: '', stages: '' });
    };

    const handleSaveProgram = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newProgram = {
            title: formData.title,
            description: formData.description,
            requirements: formData.requirements.split('\n').filter(i => i.trim()),
            stages: formData.stages.split('\n').filter(i => i.trim())
        };

        let updatedPrograms = [...programs];
        if (editingId !== null) {
            updatedPrograms[editingId] = newProgram;
        } else {
            updatedPrograms.push(newProgram);
        }

        try {
            const token = localStorage.getItem('token');
            // We update the entire 'program' section with the new items list
            // Assuming the backend expectation is { content_data: { items: [...] } }
            // Or preserving other program metadata if exists
            const submissionData = {
                ...content.program,
                items: updatedPrograms
            };

            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'program',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Data Program berhasil diperbarui!');
            if (refreshContent) refreshContent();
            handleCancelEdit();

            // Optimistic update locally
            setPrograms(updatedPrograms);

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating program:', error);
            setMessage('Gagal menyimpan perubahan.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus program ini?')) return;

        const updatedPrograms = programs.filter((_, i) => i !== index);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...content.program,
                items: updatedPrograms
            };

            await axios.post(`${API_URL}/admin/content`, {
                section_name: 'program',
                content_data: submissionData,
                is_visible: 1,
                sort_order: 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Program berhasil dihapus.');
            if (refreshContent) refreshContent();
            setPrograms(updatedPrograms);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Gagal menghapus program.');
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
                    <h2 className="text-xl font-bold">Manajemen Program</h2>
                    {editingId === null && (
                        <button
                            onClick={() => setEditingId(-1)} // -1 indicates new item
                            className="btn-add flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                            <Plus size={16} /> Tambah Program
                        </button>
                    )}
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* List View */}
            {editingId === null ? (
                <div className="grid grid-2">
                    {programs.map((prog, idx) => (
                        <div key={idx} className="glass-card p-6 relative group">
                            <h3 className="font-bold text-lg mb-2">{prog.title}</h3>
                            <p className="text-secondary text-sm line-clamp-2">{prog.description}</p>

                            <div className="mt-4 flex gap-2">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                    {prog.stages ? prog.stages.length : 0} Tahapan
                                </span>
                            </div>

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEditClick(prog, idx)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(idx)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {programs.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-secondary bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            Belum ada program yang ditambahkan.
                        </div>
                    )}
                </div>
            ) : (
                /* Edit Form */
                <form onSubmit={handleSaveProgram} className="glass-card p-8">
                    <h3 className="text-lg font-bold mb-6 border-b pb-2">
                        {editingId === -1 ? 'Tambah Program Baru' : 'Edit Program'}
                    </h3>

                    <div className="field-group mb-4">
                        <label className="block font-medium mb-1">Nama Program</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                    </div>

                    <div className="field-group mb-4">
                        <label className="block font-medium mb-1">Deskripsi Singkat</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                    </div>

                    <div className="grid grid-2 gap-6 mb-6">
                        <div className="field-group">
                            <label className="block font-medium mb-1">Syarat Umum (Satu per baris)</label>
                            <textarea
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                rows={5}
                                className="w-full p-3 border rounded-lg"
                                placeholder="- Usia minimal 18 tahun&#10;- Lulusan SMA/SMK"
                            />
                        </div>
                        <div className="field-group">
                            <label className="block font-medium mb-1">Tahapan Program (Satu per baris)</label>
                            <textarea
                                value={formData.stages}
                                onChange={(e) => setFormData({ ...formData, stages: e.target.value })}
                                rows={5}
                                className="w-full p-3 border rounded-lg"
                                placeholder="1. Pelatihan Bahasa&#10;2. Wawancara User"
                            />
                        </div>
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
                            {loading ? 'Menyimpan...' : 'Simpan Program'}
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

export default ProgramEditor;

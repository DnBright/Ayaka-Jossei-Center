import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Save, Eye, EyeOff, LogOut } from 'lucide-react';

const AdminDashboard = ({ content, refreshContent }) => {
    const [activeSection, setActiveSection] = useState('hero');
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) navigate('/login');
        if (content && content[activeSection]) {
            setFormData(content[activeSection]);
        }
    }, [content, activeSection, token, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:5005/api/content/${activeSection}`, {
                content_data: formData,
                is_visible: formData.isVisible,
                sort_order: 0 // Default for now
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Konten berhasil diperbarui!');
            refreshContent();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Gagal memperbarui konten');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };


    return (
        <div className="admin-container">
            <aside className="admin-sidebar glass">
                <div className="sidebar-header">
                    <Layout size={24} />
                    <span>Admin AJC</span>
                </div>
                <nav className="sidebar-nav">
                    {Object.keys(content).map((section) => (
                        <button
                            key={section}
                            className={activeSection === section ? 'active' : ''}
                            onClick={() => setActiveSection(section)}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </nav>
                <button className="btn-logout" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            <main className="admin-content">
                <header className="admin-header">
                    <h2>Edit Bagian: {activeSection}</h2>
                    {message && <span className="status-msg fade-in">{message}</span>}
                </header>

                <form className="edit-form glass-card" onSubmit={handleUpdate}>
                    <div className="form-toggles">
                        <label className="toggle-label">
                            Visibilitas Section:
                            <button type="button" className={`btn-toggle ${formData.isVisible ? 'on' : 'off'}`}
                                onClick={() => setFormData({ ...formData, isVisible: formData.isVisible ? 0 : 1 })}>
                                {formData.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                {formData.isVisible ? ' Tampill' : ' Sembunyi'}
                            </button>
                        </label>
                    </div>

                    {Object.keys(formData).map((key) => {
                        if (key === 'isVisible' || key === 'items' || key === 'steps') return null;
                        return (
                            <div key={key} className="field-group">
                                <label>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
                                <textarea
                                    value={formData[key] || ''}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        );
                    })}

                    <button type="submit" className="btn-save">
                        <Save size={18} /> Simpan Perubahan
                    </button>
                </form>
            </main>

            <style jsx="true">{`
        .admin-container { display: flex; min-height: 100vh; background: #fdf2f2; }
        .admin-sidebar { width: 280px; padding: 2rem; display: flex; flex-direction: column; border-right: 1px solid #fee2e2; background: white; }
        .sidebar-header { display: flex; align-items: center; gap: 1rem; font-size: 1.25rem; font-weight: 700; color: var(--accent); margin-bottom: 3rem; }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .sidebar-nav button { text-align: left; padding: 0.75rem 1rem; border-radius: 8px; background: transparent; color: var(--secondary); font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
        .sidebar-nav button.active { background: var(--accent); color: white; }
        .btn-logout { margin-top: 2rem; display: flex; align-items: center; gap: 0.5rem; color: #d32f2f; font-weight: 600; }
        
        .admin-content { flex: 1; padding: 4rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .status-msg { padding: 0.5rem 1rem; background: #dcfce7; color: #166534; border-radius: 8px; font-weight: 500; }
        
        .edit-form { padding: 3rem; border-radius: 20px; }
        .form-toggles { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #fee2e2; }
        .btn-toggle { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 8px; margin-top: 0.5rem; font-weight: 600; }
        .btn-toggle.on { background: #fee2e2; color: var(--accent); }
        .btn-toggle.off { background: #f1f5f9; color: #64748b; }
        
        .field-group { margin-bottom: 1.5rem; }
        .field-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; text-transform: capitalize; color: var(--primary); }
        textarea { width: 100%; padding: 1rem; border: 1px solid #fee2e2; border-radius: 12px; font-size: 1rem; font-family: inherit; resize: vertical; }
        .btn-save { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: var(--accent); color: white; border-radius: 12px; font-weight: 700; margin-top: 1rem; }
      `}</style>
        </div>
    );
};

export default AdminDashboard;

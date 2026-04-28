import React, { useState, useEffect } from 'react';
import { User, Shield, Plus, MoreVertical, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

const UserManager = () => {
    const [activeTab, setActiveTab] = useState('internal');

    // Internal Users (Mock)
    const [internalUsers, setInternalUsers] = useState([
        { id: 1, name: 'Admin Utama', email: 'admin@ayakajosei.com', role: 'Super Admin', status: 'Active' },
        { id: 2, name: 'Editor Konten', email: 'editor@ayakajosei.com', role: 'Editor', status: 'Active' },
        { id: 3, name: 'Viewer Only', email: 'guest@ayakajosei.com', role: 'Viewer', status: 'Inactive' },
    ]);

    // Member Users (LocalStorage)
    const [pendingMembers, setPendingMembers] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);

    useEffect(() => {
        const loadMembers = () => {
            const pending = JSON.parse(localStorage.getItem('pending_members') || '[]');
            const active = JSON.parse(localStorage.getItem('active_members') || '[]');
            setPendingMembers(pending);
            setActiveMembers(active);
        };

        loadMembers();
        window.addEventListener('storage', loadMembers);
        return () => window.removeEventListener('storage', loadMembers);
    }, []);

    const handleApprove = (member) => {
        if (!window.confirm(`Setujui member ${member.name}?`)) return;

        const updatedPending = pendingMembers.filter(m => m.id !== member.id);
        const newMember = { ...member, status: 'Active' };
        const updatedActive = [...activeMembers, newMember];

        setPendingMembers(updatedPending);
        setActiveMembers(updatedActive);

        localStorage.setItem('pending_members', JSON.stringify(updatedPending));
        localStorage.setItem('active_members', JSON.stringify(updatedActive));

        // Force refresh for other components if needed
        window.dispatchEvent(new Event('storage'));
        alert(`Member ${member.name} berhasil disetujui!`);
    };

    const handleReject = (member) => {
        if (!window.confirm(`Tolak member ${member.name}?`)) return;

        const updatedPending = pendingMembers.filter(m => m.id !== member.id);
        setPendingMembers(updatedPending);
        localStorage.setItem('pending_members', JSON.stringify(updatedPending));

        window.dispatchEvent(new Event('storage'));
        alert(`Member ${member.name} ditolak.`);
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'Super Admin': return <span className="flex items-center gap-1 text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded"><Shield size={12} /> Super Admin</span>;
            case 'Editor': return <span className="flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded"><Edit2 size={12} /> Editor</span>;
            case 'Penulis': return <span className="flex items-center gap-1 text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded"><FileText size={12} /> Penulis</span>;
            case 'Member': return <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded"><User size={12} /> Member</span>;
            default: return <span className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded"><User size={12} /> Viewer</span>;
        }
    };

    return (
        <div className="premium-manager-wrapper">
            <div className="manager-header">
                <div className="header-info">
                    <h2>Manajemen Hak Akses & User</h2>
                    <p>Kelola tim internal, editor, dan validasi keanggotaan member Ayaka.</p>
                </div>
                {activeTab === 'internal' && (
                    <button className="btn-premium-action">
                        <Plus size={18} /> Tambah Admin Baru
                    </button>
                )}
            </div>

            {/* PREMIUM TABS */}
            <div className="premium-tabs-lux">
                <button
                    onClick={() => setActiveTab('internal')}
                    className={`tab-item-lux ${activeTab === 'internal' ? 'is-active' : ''}`}
                >
                    Tim Internal Ayaka
                </button>
                <button
                    onClick={() => setActiveTab('members')}
                    className={`tab-item-lux ${activeTab === 'members' ? 'is-active' : ''}`}
                >
                    Antrean Validasi Member
                    {pendingMembers.length > 0 && (
                        <span className="count-badge">{pendingMembers.length}</span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('active_members')}
                    className={`tab-item-lux ${activeTab === 'active_members' ? 'is-active' : ''}`}
                >
                    Database Member Aktif
                </button>
            </div>

            <div className="premium-table-container">
                <table className="premium-table-lux">
                    <thead>
                        <tr>
                            <th>Identitas User</th>
                            <th>Informasi Kontak</th>
                            <th>Otoritas / Status</th>
                            <th className="text-right">Aksi Kelola</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* INTERNAL USERS */}
                        {activeTab === 'internal' && internalUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-profile-cell">
                                        <div className="avatar-lux" style={{ background: 'linear-gradient(45deg, #f1f5f9, #e2e8f0)' }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="name-main">{user.name}</span>
                                            <span className="id-sub">UID-00{user.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-cell">
                                        <span className="email-val">{user.email}</span>
                                    </div>
                                </td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td className="text-right">
                                    <div className="action-row-lux">
                                        <button className="act-btn delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {/* PENDING MEMBERS */}
                        {activeTab === 'members' && (
                            pendingMembers.length > 0 ? pendingMembers.map((member) => (
                                <tr key={member.id} className="row-highlight-warn">
                                    <td>
                                        <div className="user-profile-cell">
                                            <div className="avatar-lux color-warn">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="name-main">{member.name}</span>
                                                <span className="id-sub">Tgl Daftar: {member.date}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-cell">
                                            <span className="email-val">{member.email}</span>
                                            <span className="phone-sub">{member.phone}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge-status-lux warn">Pending Review</span>
                                    </td>
                                    <td className="text-right">
                                        <div className="action-row-lux">
                                            <button
                                                onClick={() => handleApprove(member)}
                                                className="btn-action-lux approve"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(member)}
                                                className="btn-action-lux reject"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="empty-state-cell">Tidak ada antrean validasi saat ini.</td>
                                </tr>
                            )
                        )}

                        {/* ACTIVE MEMBERS */}
                        {activeTab === 'active_members' && activeMembers.map((member) => (
                            <tr key={member.id}>
                                <td>
                                    <div className="user-profile-cell">
                                        <div className="avatar-lux color-success">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="name-main">{member.name}</span>
                                            <span className="id-sub">Member ID: MB-{member.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-cell">
                                        <span className="email-val">{member.email}</span>
                                        <span className="phone-sub">{member.phone}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge-status-lux success">Active Member</span>
                                </td>
                                <td className="text-right">
                                    <div className="action-row-lux">
                                        <button className="act-btn delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                    cursor: pointer; border: none;
                }
                .btn-premium-action:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.3); }

                /* TABS LUX */
                .premium-tabs-lux { 
                    display: flex; gap: 2rem; border-bottom: 2px solid #f1f5f9; 
                    margin-bottom: 2.5rem; padding-bottom: 2px;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }
                .premium-tabs-lux::-webkit-scrollbar { display: none; } /* Hide scrollbar but keep functionality */

                @media (max-width: 768px) {
                    .premium-tabs-lux { gap: 1rem; }
                    .tab-item-lux { font-size: 0.9rem; white-space: nowrap; }
                }
                
                .tab-item-lux { 
                    background: none; border: none; padding: 0.8rem 0;
                    font-size: 1rem; font-weight: 700; color: #94a3b8;
                    cursor: pointer; position: relative; transition: all 0.3s;
                    display: flex; align-items: center; gap: 0.8rem;
                }
                .tab-item-lux:hover { color: #0f172a; }
                .tab-item-lux.is-active { color: #ef4444; }
                .tab-item-lux.is-active::after {
                    content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 3px;
                    background: #ef4444; border-radius: 10px;
                }
                
                .count-badge {
                    background: #ef4444; color: white; border-radius: 100px;
                    padding: 2px 8px; font-size: 0.65rem; font-weight: 800;
                    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
                }

                /* TABLE LUX */
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
                
                .user-profile-cell { display: flex; align-items: center; gap: 1.2rem; }
                .avatar-lux { 
                    width: 44px; height: 44px; border-radius: 14px; 
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 1.1rem; color: #475569;
                }
                .avatar-lux.color-warn { background: #fff7ed; color: #f97316; }
                .avatar-lux.color-success { background: #f0fdf4; color: #22c55e; }
                
                .name-main { display: block; font-weight: 700; color: #0f172a; font-size: 0.95rem; margin-bottom: 2px; }
                .id-sub { display: block; font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
                
                .contact-cell .email-val { display: block; color: #0f172a; font-weight: 600; font-size: 0.9rem; }
                .contact-cell .phone-sub { display: block; color: #64748b; font-size: 0.75rem; margin-top: 2px; }
                
                .badge-status-lux { 
                    padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
                }
                .badge-status-lux.warn { background: #fff7ed; color: #f97316; }
                .badge-status-lux.success { background: #f0fdf4; color: #22c55e; }
                
                .action-row-lux { display: flex; justify-content: flex-end; gap: 0.8rem; }
                .act-btn { 
                    width: 36px; height: 36px; border-radius: 10px; display: flex; transition: 0.2s;
                    align-items: center; justify-content: center; cursor: pointer; border: none;
                }
                .act-btn.delete { background: #fef2f2; color: #ef4444; }
                .act-btn.delete:hover { background: #ef4444; color: white; transform: translateY(-2px); }

                .btn-action-lux { 
                    padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 700; font-size: 0.8rem; 
                    cursor: pointer; transition: 0.2s; border: none;
                }
                .btn-action-lux.approve { background: #22c55e; color: white; }
                .btn-action-lux.approve:hover { background: #16a34a; transform: translateY(-2px); }
                .btn-action-lux.reject { background: #f1f5f9; color: #64748b; }
                .btn-action-lux.reject:hover { background: #e2e8f0; color: #0f172a; }

                .empty-state-cell { padding: 4rem 2rem; text-align: center; color: #94a3b8; font-weight: 600; font-style: italic; }
                .row-highlight-warn { background: rgba(255, 247, 237, 0.3) !important; }
            `}</style>
        </div>
    );
};

export default UserManager;

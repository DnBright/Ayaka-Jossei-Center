import { API_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Bell, User, Search, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminHeader = ({ title, onToggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPenulisPath = location.pathname.startsWith('/penulis');
    const keyPrefix = isPenulisPath ? 'penulis_' : 'admin_';

    const [username, setUsername] = useState('User');
    const [role, setRole] = useState('Guest');
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        // Load User Info
        const storedName = localStorage.getItem(`${keyPrefix}username`);
        const storedRole = localStorage.getItem(`${keyPrefix}role`);
        if (storedName) setUsername(storedName);
        if (storedRole) setRole(storedRole);

        // Load Unread Count (Only for Admins/Editors)
        if (!isPenulisPath) {
            fetchUnreadCount();
        }
    }, [isPenulisPath, keyPrefix]);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) return;
            const apiUrl = `${API_URL}/admin/communications/unread-count`;
            const resp = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(resp.data.count);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(`${keyPrefix}token`);
        localStorage.removeItem(`${keyPrefix}role`);
        localStorage.removeItem(`${keyPrefix}username`);
        navigate(isPenulisPath ? '/penulis/login' : '/admin/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
        // Implement search logic if needed, or redirect to a search results page
    };

    return (
        <header className="admin-header glass">
            <div className="header-content">
                <div className="header-left">
                    <button className="mobile-menu-btn" onClick={onToggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <h2 className="page-title">{title}</h2>
                </div>

                <div className="header-actions">
                    <form onSubmit={handleSearch} className="search-bar desktop-only">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    <div className="action-buttons">
                        {!isPenulisPath && (
                            <button
                                className="icon-btn"
                                onClick={() => navigate('/admin/communications')}
                                title="Pesan Masuk"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                            </button>
                        )}

                        <div className="profile-container-lux">
                            <div
                                className={`user-profile ${showProfileMenu ? 'active' : ''}`}
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <div className="avatar">
                                    <User size={20} />
                                </div>
                                <div className="user-info desktop-only">
                                    <span className="name">{username}</span>
                                    <span className="role">{role}</span>
                                </div>
                                <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'rotate' : ''} desktop-only`} />
                            </div>

                            {showProfileMenu && (
                                <div className="profile-dropdown-lux shadow-2xl animate-fade-in-up">
                                    <div className="dropdown-header">
                                        <p className="logged-as">Masuk sebagai</p>
                                        <p className="user-name">{username}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-item logout text-red-600">
                                        <LogOut size={16} />
                                        <span>Keluar Sesi</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .admin-header {
          height: var(--admin-header-height);
          position: sticky;
          top: 0;
          z-index: 1001; /* Higher than sidebar */
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #f1f5f9;
          padding: 0 3rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .header-content {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1600px;
          margin: 0 auto;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .mobile-menu-btn {
            display: none;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 8px;
            border-radius: 12px;
            cursor: pointer;
            color: #0f172a;
            transition: all 0.2s;
        }

        .mobile-menu-btn:hover {
            background: #f1f5f9;
            color: #ef4444;
        }

        @media (max-width: 1024px) {
            .admin-header { padding: 0 1.5rem; }
            .mobile-menu-btn { display: flex; }
            .desktop-only { display: none !important; }
        }

        @media (max-width: 640px) {
            .admin-header { padding: 0 1rem; }
            .page-title { font-size: 1.1rem; }
            .header-actions { gap: 1rem; }
        }

        .page-title {
          font-size: 1.4rem;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 2.5rem;
        }

        .search-bar {
            position: relative;
            display: flex;
            align-items: center;
        }

        .search-icon {
            position: absolute;
            left: 16px;
            color: #94a3b8;
        }

        .search-bar input {
            padding: 0.7rem 1.5rem 0.7rem 3rem;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            width: 300px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s;
        }

        .search-bar input:focus {
            outline: none;
            border-color: #ef4444;
            background: white;
            width: 350px;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .action-buttons {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .icon-btn {
            position: relative;
            background: white;
            color: #64748b;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #f1f5f9;
            transition: all 0.2s;
            cursor: pointer;
        }

        .icon-btn:hover {
            background: #f8fafc;
            color: #ef4444;
            transform: translateY(-2px);
            border-color: #fee2e2;
        }

        .badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            font-size: 0.65rem;
            width: 18px;
            height: 18px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
        }

        .profile-container-lux {
            position: relative;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 16px;
            cursor: pointer;
            transition: 0.2s;
            border: 1px solid transparent;
        }
        
        .user-profile:hover, .user-profile.active { 
            background: white; 
            border-color: #f1f5f9;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .avatar {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            color: #ef4444;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            border: 1px solid #fee2e2;
        }

        .user-info {
            display: flex;
            flex-direction: column;
        }

        .user-info .name {
            font-size: 0.9rem;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
        }

        .user-info .role {
            font-size: 0.7rem;
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .chevron {
            color: #94a3b8;
            transition: transform 0.3s;
        }

        .chevron.rotate { transform: rotate(180deg); }

        .profile-dropdown-lux {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            width: 220px;
            background: white;
            border-radius: 20px;
            border: 1px solid #f1f5f9;
            padding: 1rem;
            z-index: 1002;
        }

        .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header { margin-bottom: 0.8rem; }
        .logged-as { font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .user-name { font-size: 0.9rem; font-weight: 800; color: #1e293b; }

        .dropdown-divider { height: 1px; background: #f1f5f9; margin: 0.8rem -1rem; }

        .dropdown-item {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.8rem;
            border: none;
            background: none;
            font-size: 0.9rem;
            font-weight: 700;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            color: #475569;
        }

        .dropdown-item:hover { background: #f8fafc; color: #0f172a; }
        .dropdown-item.logout:hover { background: #fef2f2; color: #da291c; }
      `}</style>
        </header>
    );
};

export default AdminHeader;

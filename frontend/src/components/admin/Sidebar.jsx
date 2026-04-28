import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const path = window.location.pathname;
    const isPenulisPath = path.startsWith('/penulis');
    const keyPrefix = isPenulisPath ? 'penulis_' : 'admin_';

    const currentRole = localStorage.getItem(`${keyPrefix}role`);
    localStorage.removeItem(`${keyPrefix}token`);
    localStorage.removeItem(`${keyPrefix}role`);
    localStorage.removeItem(`${keyPrefix}username`);

    if (isPenulisPath) {
      navigate('/penulis/login');
    } else {
      navigate('/admin/login');
    }
  };

  const path = window.location.pathname;
  const isPenulisPath = path.startsWith('/penulis');
  const keyPrefix = isPenulisPath ? 'penulis_' : 'admin_';
  const role = localStorage.getItem(`${keyPrefix}role`) || 'Viewer';
  const prefix = (role === 'Super Admin' || role === 'Editor') ? '/admin' : '/penulis';

  const adminItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { path: '/admin/articles', icon: <FileText size={20} />, label: 'Artikel & Berita' },
    { path: '/admin/ebooks', icon: <FileText size={20} />, label: 'E-Book Materi' },
    { path: '/admin/pages', icon: <LayoutDashboard size={20} />, label: 'Halaman & Konten' },
    { path: '/admin/media', icon: <Image size={20} />, label: 'Media & Galeri' },
    { path: '/admin/communications', icon: <MessageSquare size={20} />, label: 'Komunikasi' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'User & Role' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Pengaturan' },
  ];

  const authorItems = [
    { path: '/penulis', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { path: '/penulis/articles', icon: <FileText size={20} />, label: 'Artikel' },
    { path: '/penulis/ebooks', icon: <FileText size={20} />, label: 'E-Book' },
    { path: '/penulis/media', icon: <Image size={20} />, label: 'Media' },
    { path: '/penulis/profile', icon: <Users size={20} />, label: 'Profil Saya' },
  ];

  const navItems = (role === 'Super Admin' || role === 'Editor') ? adminItems : authorItems;

  return (
    <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <span className="brand-red">Ayaka</span> Josei Center
        </div>
        {/* Mobile Close Button */}
        <button className="mobile-close" onClick={onClose}>
            <X size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <style>{`
        .admin-sidebar {
          width: var(--admin-sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          background: #0f172a; /* Dark sleek sidebar */
          color: rgba(255,255,255,0.7);
          z-index: 50;
          box-shadow: 10px 0 40px rgba(0,0,0,0.1);
          border-right: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 1024px) {
            .admin-sidebar {
                transform: translateX(-100%);
            }
            .admin-sidebar.mobile-open {
                transform: translateX(0);
            }
            .mobile-close {
                display: flex !important;
            }
        }

        .mobile-close {
            display: none;
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
        }

        .sidebar-header {
          padding: 2.5rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo-section {
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 1.6rem;
            color: white;
            letter-spacing: -1px;
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .brand-red { color: #ef4444; }

        .sidebar-nav {
          flex: 1;
          padding: 2rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding: 0.9rem 1.2rem;
          border-radius: 14px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
          padding-left: 1.5rem;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%);
          color: white;
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        }

        .sidebar-footer {
          padding: 2rem;
          background: rgba(0,0,0,0.2);
        }

        .btn-logout {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 14px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          font-weight: 700;
          transition: all 0.3s;
          cursor: pointer;
        }

        .btn-logout:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
        }

        /* Scrollbar styling */
        .sidebar-nav::-webkit-scrollbar { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </aside>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const path = window.location.pathname;
    const isPenulisPath = path.startsWith('/penulis');
    const keyPrefix = isPenulisPath ? 'penulis_' : 'admin_';

    const token = localStorage.getItem(`${keyPrefix}token`);

    if (!token) {
        return <Navigate to={isPenulisPath ? "/penulis/login" : "/admin/login"} replace />;
    }

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={`admin-main ${sidebarOpen ? 'sidebar-pushed' : ''}`}>
                <AdminHeader 
                    title="Dashboard Overview" 
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <div className="admin-content-wrapper">
                    <Outlet />
                </div>
            </div>

            <style>{`
                /* GLOBAL ADMIN VARIABLES & RESETS */
                :root {
                    --admin-bg: #f1f5f9;
                    --admin-sidebar-width: 280px;
                    --admin-header-height: 80px;
                    --brand-red: #da291c;
                    --brand-dark: #0f172a;
                }

                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: var(--admin-bg);
                    font-family: 'DM Sans', 'Inter', sans-serif;
                    overflow-x: hidden;
                }

                .sidebar-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 45;
                    backdrop-filter: blur(4px);
                    transition: opacity 0.3s;
                }

                .admin-main {
                    flex: 1;
                    margin-left: var(--admin-sidebar-width);
                    display: flex;
                    flex-direction: column;
                    width: calc(100% - var(--admin-sidebar-width));
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .admin-content-wrapper {
                    padding: 2rem;
                    flex: 1;
                    max-width: 1600px;
                    margin: 0 auto;
                    width: 100%;
                }

                @media (max-width: 1024px) {
                    .admin-main {
                        margin-left: 0;
                        width: 100%;
                    }
                    .admin-content-wrapper {
                        padding: 1.5rem;
                    }
                }

                @media (max-width: 640px) {
                    .admin-content-wrapper {
                        padding: 1rem;
                    }
                }

                /* STANDARDIZED ADMIN COMPONENTS */
                
                /* 1. Cards */
                .glass-card, .admin-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .admin-card:hover {
                   box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025); 
                }

                /* 2. Typography */
                h1, h2, h3 { color: var(--brand-dark); font-weight: 700; letter-spacing: -0.02em; }
                h2 { font-size: 1.5rem; margin-bottom: 1rem; }
                p { color: #64748b; }

                /* 3. Forms & Inputs */
                .field-group { margin-bottom: 1.5rem; }
                .field-group label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 0.5rem;
                }
                input[type="text"], input[type="email"], input[type="password"], textarea, select {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    background: #f8fafc;
                    color: #0f172a;
                }
                input:focus, textarea:focus, select:focus {
                    background: white;
                    border-color: var(--brand-red);
                    box-shadow: 0 0 0 3px rgba(218, 41, 28, 0.1);
                    outline: none;
                }

                /* 4. Buttons */
                button { cursor: pointer; font-weight: 600; transition: all 0.2s; }
                .btn-primary, .bg-brand-red {
                    background: linear-gradient(135deg, #da291c 0%, #b91c1c 100%);
                    color: white;
                    border: none;
                    box-shadow: 0 4px 10px rgba(218, 41, 28, 0.2);
                }
                .btn-primary:hover, .bg-brand-red:hover {
                    box-shadow: 0 8px 20px rgba(218, 41, 28, 0.3);
                    transform: translateY(-1px);
                }

                /* 5. Utility */
                .text-brand-red { color: var(--brand-red); }
                .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
                .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
                
                @media (max-width: 640px) {
                    .admin-content-wrapper {
                        padding: 1rem;
                    }
                }

                /* Responsive Tables Global */
                .premium-table-container {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }
                .premium-table-lux {
                    min-width: 800px; /* Force scroll on small screens */
                }
                @media (max-width: 1024px) {
                    .premium-table-lux { min-width: 700px; }
                }

                /* Responsive Grids & Wrappers */
                .manager-header {
                    flex-direction: column;
                    align-items: flex-start !important;
                    gap: 1.5rem;
                }
                @media (min-width: 768px) {
                    .manager-header {
                        flex-direction: row;
                        align-items: center !important;
                    }
                }

                .manager-filters {
                    flex-direction: column;
                    align-items: stretch !important;
                    gap: 1rem !important;
                }
                @media (min-width: 768px) {
                    .manager-filters {
                        flex-direction: row;
                        align-items: center !important;
                    }
                }

                /* 6. Form Grids */
                .premium-form-grid {
                    grid-template-columns: 1fr !important;
                }
                @media (min-width: 768px) {
                    .premium-form-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                .field-group.full-width {
                    grid-column: span 1 !important;
                }
                @media (min-width: 768px) {
                    .field-group.full-width {
                        grid-column: span 2 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;

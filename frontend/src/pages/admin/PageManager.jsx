import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Edit3 } from 'lucide-react';

const PageManager = () => {
    const pages = [
        { id: 'hero', title: 'Home (Beranda)', desc: 'Headline, Subheadline, CTA', path: '/admin/pages/home' },
        { id: 'tentang', title: 'Tentang Ayaka', desc: 'Visi, Misi, Nilai Lembaga', path: '/admin/pages/about' },
        { id: 'program', title: 'Program', desc: 'Daftar Program & Kurikulum', path: '/admin/pages/program' },
        { id: 'galeri', title: 'Galeri', desc: 'Foto & Video Kegiatan', path: '/admin/pages/gallery' },
        { id: 'blog', title: 'Blog / Artikel', desc: 'Berita & Artikel Terkini', path: '/admin/pages/blog' },
        { id: 'alumni', title: 'Alumni', desc: 'Data Alumni & Testimoni', path: '/admin/pages/alumni' },
        { id: 'kontak', title: 'Kontak', desc: 'Informasi Kontak & Lokasi', path: '/admin/pages/contact' },
    ];

    return (
        <div className="premium-manager-wrapper">
            <div className="manager-header">
                <div className="header-info">
                    <h2>Manajemen Konten Halaman</h2>
                    <p>Pilih dan modifikasi konten visual maupun tekstual pada setiap halaman website.</p>
                </div>
            </div>

            <div className="premium-page-grid">
                {pages.map((page) => (
                    <Link key={page.id} to={page.path} className="page-card-lux group">
                        <div className="page-icon-lux">
                            <FileText size={24} />
                        </div>
                        <div className="page-content-lux">
                            <h3>{page.title}</h3>
                            <p>{page.desc}</p>
                        </div>
                        <div className="page-arrow-lux">
                            <ChevronRight size={20} />
                        </div>
                    </Link>
                ))}
            </div>

            <style>{`
                .premium-manager-wrapper { padding: 1rem 0; }
                
                .manager-header { 
                    display: flex; justify-content: space-between; align-items: center; 
                    margin-bottom: 3rem; 
                }
                .header-info h2 { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 0.3rem; }
                .header-info p { color: #64748b; font-size: 1rem; }

                .premium-page-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                .page-card-lux {
                    background: white; border-radius: 20px; padding: 1.8rem;
                    display: flex; align-items: center; gap: 1.5rem;
                    border: 1px solid #f1f5f9; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none; color: inherit;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }

                .page-card-lux:hover {
                    transform: translateY(-5px);
                    border-color: #fee2e2;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
                }

                .page-icon-lux {
                    width: 56px; height: 56px; background: #fdf2f2;
                    color: #ef4444; border-radius: 16px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s;
                }
                .page-card-lux:hover .page-icon-lux {
                    background: #ef4444; color: white; scale: 1.05;
                }

                .page-content-lux { flex: 1; }
                .page-content-lux h3 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
                .page-content-lux p { font-size: 0.85rem; color: #64748b; font-weight: 500; }

                .page-arrow-lux {
                    color: #cbd5e1; transition: all 0.3s; transform: translateX(-10px); opacity: 0;
                }
                .page-card-lux:hover .page-arrow-lux {
                    opacity: 1; transform: translateX(0); color: #ef4444;
                }

                @media (max-width: 640px) {
                    .premium-page-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default PageManager;

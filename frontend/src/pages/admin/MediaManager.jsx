import React, { useState } from 'react';
import { Upload, Image, Trash2, Search, Filter } from 'lucide-react';

const MediaManager = () => {
    // Simulated media data
    const [mediaItems, setMediaItems] = useState([
        { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1528659526084-59de817f5413?auto=format&fit=crop&q=80', name: 'Tokyo Street.jpg', size: '2.4 MB', date: '2024-01-15' },
        { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80', name: 'Student Batch 1.jpg', size: '1.8 MB', date: '2024-02-01' },
        { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?auto=format&fit=crop&q=80', name: 'Classroom.jpg', size: '3.1 MB', date: '2024-02-10' },
        { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80', name: 'Japan Flag.jpg', size: '1.2 MB', date: '2024-03-05' },
    ]);

    const handleUpload = () => {
        alert('Fitur upload akan diimplementasikan dengan backend.');
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus file ini?')) {
            setMediaItems(items => items.filter(item => item.id !== id));
        }
    };

    return (
        <div className="premium-media-wrapper">
            <div className="media-header">
                <div className="header-info">
                    <h2>Media Library Ayaka</h2>
                    <p>Kelola koleksi aset visual, dokumentasi, dan media konten edukasi.</p>
                </div>
                <button
                    onClick={handleUpload}
                    className="btn-premium-upload"
                >
                    <Upload size={18} /> Upload Media Baru
                </button>
            </div>

            {/* PREMIUM TOOLBAR */}
            <div className="premium-toolbar-lux">
                <div className="search-box-lux">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Telusuri aset media..."
                        className="search-input-lux"
                    />
                </div>
                <div className="filter-actions-lux">
                    <button className="filter-btn-lux">
                        <Filter size={18} /> Filter
                    </button>
                    <div className="view-toggle-lux">
                        <div className="toggle-bg"></div>
                        <button className="toggle-item-lux active"><Image size={16} /></button>
                    </div>
                </div>
            </div>

            {/* MEDIA GRID LUX */}
            <div className="premium-media-grid">
                {mediaItems.map((item) => (
                    <div key={item.id} className="media-card-lux group">
                        <div className="media-preview-lux">
                            <img src={item.url} alt={item.name} />
                            <div className="media-overlay-lux">
                                <div className="overlay-actions">
                                    <button className="icon-btn-lux preview" title="Preview Full">
                                        <Image size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="icon-btn-lux delete"
                                        title="Hapus Permanen"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="media-info-lux">
                            <span className="file-name" title={item.name}>{item.name}</span>
                            <div className="file-meta">
                                <span>{item.size}</span>
                                <span className="meta-dot"></span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .premium-media-wrapper { padding: 1rem 0; }
                
                .media-header { 
                    display: flex; justify-content: space-between; align-items: center; 
                    margin-bottom: 2.5rem; 
                }
                .header-info h2 { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 0.3rem; }
                .header-info p { color: #64748b; font-size: 1rem; }
                
                .btn-premium-upload {
                    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
                    color: white; padding: 0.8rem 1.5rem; border-radius: 14px;
                    display: flex; align-items: center; gap: 0.8rem;
                    font-weight: 800; font-size: 0.95rem;
                    box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2);
                    transition: all 0.3s;
                    cursor: pointer; border: none;
                }
                .btn-premium-upload:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.3); }

                /* TOOLBAR LUX */
                .premium-toolbar-lux {
                    background: white; border-radius: 20px; padding: 1rem 1.5rem;
                    border: 1px solid #f1f5f9; display: flex; justify-content: space-between;
                    align-items: center; margin-bottom: 2.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }
                .search-box-lux { position: relative; width: 320px; }
                .search-icon { position: absolute; left: 1.2rem; top: 1rem; color: #94a3b8; }
                .search-input-lux {
                    width: 100%; border: 1px solid #e2e8f0; border-radius: 12px;
                    padding: 0.8rem 1rem 0.8rem 3.2rem; font-size: 0.9rem; font-weight: 500;
                    transition: all 0.3s; background: #f8fafc;
                }
                .search-input-lux:focus { outline: none; border-color: #ef4444; background: white; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.05); }

                .filter-actions-lux { display: flex; align-items: center; gap: 1.5rem; }
                .filter-btn-lux {
                    display: flex; align-items: center; gap: 0.6rem;
                    background: #f1f5f9; border: none; padding: 0.7rem 1.2rem;
                    border-radius: 12px; font-weight: 700; color: #475569; font-size: 0.9rem;
                    cursor: pointer; transition: all 0.2s;
                }
                .filter-btn-lux:hover { background: #e2e8f0; color: #0f172a; }

                /* MEDIA GRID */
                .premium-media-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 2rem;
                }
                .media-card-lux {
                    background: white; border-radius: 24px; overflow: hidden;
                    border: 1px solid #f1f5f9; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }
                .media-card-lux:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                
                .media-preview-lux { aspect-ratio: 16/10; position: relative; overflow: hidden; background: #f8fafc; }
                .media-preview-lux img { width: 100%; height: 100%; object-cover: cover; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
                .media-card-lux:hover .media-preview-lux img { scale: 1.1; }

                .media-overlay-lux {
                    position: absolute; inset: 0; background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(2px); opacity: 0; transition: all 0.3s;
                    display: flex; items-center: center; justify-content: center;
                }
                .media-card-lux:hover .media-overlay-lux { opacity: 1; display: flex; align-items: center; }
                
                .overlay-actions { display: flex; gap: 1rem; }
                .icon-btn-lux {
                    width: 44px; height: 44px; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .icon-btn-lux.preview { background: white; color: #0f172a; }
                .icon-btn-lux.preview:hover { scale: 1.1; background: #ef4444; color: white; }
                .icon-btn-lux.delete { background: rgba(239, 68, 68, 0.9); color: white; }
                .icon-btn-lux.delete:hover { scale: 1.1; background: #ef4444; box-shadow: 0 8px 15px rgba(239, 68, 68, 0.3); }

                .media-info-lux { padding: 1.2rem; }
                .file-name { 
                    display: block; font-weight: 700; color: #0f172a; font-size: 0.9rem; 
                    margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .file-meta { display: flex; align-items: center; gap: 0.6rem; color: #94a3b8; font-size: 0.75rem; font-weight: 600; }
                .meta-dot { width: 3px; height: 3px; background: #cbd5e1; border-radius: 50%; }

                @media (max-width: 768px) {
                    .media-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                    .premium-toolbar-lux { flex-direction: column; gap: 1rem; padding: 1.2rem; }
                    .search-box-lux { width: 100%; }
                    .filter-actions-lux { width: 100%; justify-content: space-between; }
                    .premium-media-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
                }
                @media (max-width: 480px) {
                    .premium-media-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default MediaManager;

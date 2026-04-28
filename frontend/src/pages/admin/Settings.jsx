import React, { useState } from 'react';
import { Save, Globe, Share2, Layout } from 'lucide-react';

const Settings = () => {
    const [loading, setLoading] = useState(false);

    // Simulated state
    const [settings, setSettings] = useState({
        siteTitle: 'Ayaka Josei Center',
        siteDescription: 'Lembang Pelatihan Kerja dan Bahasa Jepang Terpercaya',
        footerText: '© 2024 Ayaka Josei Center. All rights reserved.',
        facebook: 'https://facebook.com/ayakajosei',
        instagram: 'https://instagram.com/ayakajosei',
        logoUrl: '/logo.png' // hypothetical
    });

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500); // Simulate API call
    };

    return (
        <div className="settings-container max-w-4xl">
            <div className="mb-6">
                <h2 className="text-xl font-bold">Pengaturan Umum</h2>
                <p className="text-secondary text-sm">Konfigurasi dasar website dan SEO.</p>
            </div>

            <form onSubmit={handleSave} className="grid gap-6">
                {/* General Info */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Globe size={20} className="text-brand-red" /> Identitas Website
                    </h3>
                    <div className="grid gap-4">
                        <div className="field-group">
                            <label className="block font-medium mb-1">Judul Website (Title Tag)</label>
                            <input
                                type="text"
                                name="siteTitle"
                                value={settings.siteTitle}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                        <div className="field-group">
                            <label className="block font-medium mb-1">Deskripsi Meta (SEO)</label>
                            <textarea
                                name="siteDescription"
                                value={settings.siteDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Share2 size={20} className="text-brand-red" /> Social Media Links
                    </h3>
                    <div className="grid grid-2 gap-4">
                        <div className="field-group">
                            <label className="block font-medium mb-1">Facebook URL</label>
                            <input
                                type="text"
                                name="facebook"
                                value={settings.facebook}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                        <div className="field-group">
                            <label className="block font-medium mb-1">Instagram URL</label>
                            <input
                                type="text"
                                name="instagram"
                                value={settings.instagram}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Layout size={20} className="text-brand-red" /> Footer
                    </h3>
                    <div className="field-group">
                        <label className="block font-medium mb-1">Teks Copyright</label>
                        <input
                            type="text"
                            name="footerText"
                            value={settings.footerText}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-save flex items-center gap-2 px-8 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 font-bold"
                    >
                        <Save size={18} />
                        {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </form>

            <style>{`
                .text-brand-red { color: var(--brand-red); }
                .bg-brand-red { background-color: var(--brand-red); }
                input:focus, textarea:focus { outline: 2px solid var(--brand-red); border-color: transparent; }
            `}</style>
        </div>
    );
};

export default Settings;

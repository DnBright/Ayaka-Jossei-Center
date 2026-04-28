import React from 'react';
import { User, Key, Shield } from 'lucide-react';

const AuthorProfile = () => {
    return (
        <div className="author-profile">
            <h2 className="text-xl font-bold mb-6">Profil Saya</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="glass-card p-6 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <User size={48} />
                        </div>
                        <h3 className="font-bold text-lg">{localStorage.getItem('username') || 'Penulis Ayaka'}</h3>
                        <div className="inline-block px-3 py-1 bg-brand-red text-white text-xs font-bold rounded-full mt-2">
                            {localStorage.getItem('role') || 'Penulis'}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-bold border-b pb-3 mb-4 flex items-center gap-2">
                            <Shield size={18} /> Detail Akun
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="field">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap</label>
                                <input type="text" className="w-full p-2 border rounded-lg" defaultValue="Team Ayaka" />
                            </div>
                            <div className="field">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
                                <input type="text" className="w-full p-2 border rounded-lg" defaultValue={localStorage.getItem('username') || ''} readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="font-bold border-b pb-3 mb-4 flex items-center gap-2">
                            <Key size={18} /> Keamanan
                        </h3>
                        <div className="space-y-4">
                            <div className="field">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Ganti Password</label>
                                <input type="password" title="password" className="w-full p-2 border rounded-lg" placeholder="Password Baru..." />
                            </div>
                            <button className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold">Update Profil</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; }
                .text-brand-red { color: #da291c; }
                .bg-brand-red { background: #da291c; }
            `}</style>
        </div>
    );
};

export default AuthorProfile;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Kept for now
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/LandingPage';
// import AdminDashboard from './pages/AdminDashboard'; // Deprecated
import AdminLayout from './layouts/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import PageManager from './pages/admin/PageManager';
import HomeEditor from './pages/admin/editors/HomeEditor';
import AboutEditor from './pages/admin/editors/AboutEditor';
import ProgramEditor from './pages/admin/editors/ProgramEditor';
import GalleryEditor from './pages/admin/editors/GalleryEditor';
import BlogEditor from './pages/admin/editors/BlogEditor';
import AlumniEditor from './pages/admin/editors/AlumniEditor';
import ContactEditor from './pages/admin/editors/ContactEditor';
import MediaManager from './pages/admin/MediaManager';
import Communication from './pages/admin/Communication';
import UserManager from './pages/admin/UserManager';
import Settings from './pages/admin/Settings';
import AdminLogin from './pages/AdminLogin';
import PenulisLogin from './pages/PenulisLogin';
import MemberLogin from './pages/MemberLogin';
import MemberRegister from './pages/MemberRegister';
import EBookPage from './pages/EBookPage';
import ProfilPage from './pages/ProfilPage';
import ProgramPage from './pages/ProgramPage';
import GaleriPage from './pages/GaleriPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AlumniPage from './pages/AlumniPage';
import ContactPage from './pages/ContactPage';
import SplashLoader from './components/SplashLoader';

// AUTHOR / CMS PAGES
import ArticleManager from './pages/admin/ArticleManager';
import ArticleEditor from './pages/admin/ArticleEditor';
import EBookManager from './pages/admin/EBookManager';
import AuthorProfile from './pages/admin/AuthorProfile';

import { API_URL } from './config';



// MEMBER GUARD COMPONENT
const MemberGuard = ({ children }) => {
  const token = localStorage.getItem('member_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// ROLE GUARD COMPONENT
const RoleGuard = ({ children, allowedRoles }) => {
  const path = window.location.pathname;
  const isPenulisPath = path.startsWith('/penulis');
  const keyPrefix = isPenulisPath ? 'penulis_' : 'admin_';

  const role = localStorage.getItem(`${keyPrefix}role`);
  const token = localStorage.getItem(`${keyPrefix}token`);

  if (!token) {
    if (isPenulisPath) return <Navigate to="/penulis/login" replace />;
    if (path.startsWith('/admin')) return <Navigate to="/admin/login" replace />;
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If they have the role for the OTHER portal, maybe they are just in the wrong place
    // but for now let's just redirect to their own portal or login
    if (role === 'Penulis') return <Navigate to="/penulis" replace />;
    if (role === 'Super Admin' || role === 'Editor') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(null);
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    // Handle RTL orientation based on language
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const resp = await axios.get(`${API_URL}/content`);
      setContent(resp.data);
    } catch (err) {
      console.error('Error fetching content:', err);
    }
  };

  if (!splashFinished) {
    return <SplashLoader onComplete={() => setSplashFinished(true)} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout content={content} />}>
            <Route path="/" element={<LandingPage content={content} />} />
            <Route path="/profil" element={<ProfilPage content={content} />} />
            <Route path="/program" element={<ProgramPage content={content} />} />
            <Route path="/galeri" element={<GaleriPage content={content} />} />
            <Route path="/blog" element={<BlogPage content={content} />} />
            <Route path="/blog/:slug" element={<BlogDetailPage content={content} />} />
            <Route path="/alumni" element={<AlumniPage content={content} />} />
            <Route path="/kontak" element={<ContactPage content={content} />} />
            <Route path="/login" element={<MemberLogin />} />
            <Route path="/ebook" element={<MemberGuard><EBookPage /></MemberGuard>} />
          </Route>

          {/* Member Auth Routes */}
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/register" element={<MemberRegister />} />

          {/* ADMIN ROUTES (Super Admin & Editor) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={['Super Admin', 'Editor']}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<DashboardOverview content={content} />} />
            <Route path="pages" element={<PageManager />} />
            <Route path="pages/home" element={<HomeEditor content={content} refreshContent={fetchContent} />} />
            <Route path="pages/about" element={<AboutEditor content={content} refreshContent={fetchContent} />} />
            <Route path="pages/program" element={<ProgramEditor content={content} refreshContent={fetchContent} />} />
            <Route path="pages/gallery" element={<GalleryEditor content={content} refreshContent={fetchContent} />} />
            <Route path="pages/blog" element={<BlogEditor content={content} refreshContent={fetchContent} />} />
            <Route path="pages/alumni" element={<AlumniEditor content={content} refreshContent={fetchContent} />} />
            <Route path="pages/contact" element={<ContactEditor content={content} refreshContent={fetchContent} />} />

            <Route path="articles" element={<ArticleManager />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/edit/:id" element={<ArticleEditor />} />
            <Route path="ebooks" element={<EBookManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="communications" element={<Communication />} />
            <Route path="users" element={<UserManager />} />
            <Route path="settings" element={<Settings />} />
            {/* Catch-all to fix white screen on old bookmarked URLs like /admin/dashboard */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* PENULIS ROUTES (Author) */}
          <Route path="/penulis/login" element={<PenulisLogin />} />
          <Route
            path="/penulis"
            element={
              <RoleGuard allowedRoles={['Penulis']}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<DashboardOverview content={content} />} />
            <Route path="articles" element={<ArticleManager />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/edit/:id" element={<ArticleEditor />} />
            <Route path="ebooks" element={<EBookManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="profile" element={<AuthorProfile />} />
            <Route path="*" element={<Navigate to="/penulis" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [member, setMember] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check member session
    const checkMember = () => {
      const stored = localStorage.getItem('member_user');
      if (stored) setMember(JSON.parse(stored));
      else setMember(null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('storage', checkMember); // Listen for storage changes

    // Initial check
    checkMember();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkMember);
    };
  }, [location]); // Re-check on location change (login/logout)

  const handleLogout = () => {
    localStorage.removeItem('member_user');
    localStorage.removeItem('member_token');
    setMember(null);
    navigate('/');
  };

  const navItems = [
    { name: t('nav.home'), href: '/', isAnchor: false },
    { name: t('nav.profil'), href: '/profil', isAnchor: false },
    { name: t('nav.program'), href: '/program', isAnchor: false },
    { name: t('nav.galeri'), href: '/galeri', isAnchor: false },
    { name: t('nav.blog'), href: '/blog', isAnchor: false },
    ...(member ? [{ name: t('nav.ebook'), href: '/ebook', isAnchor: false }] : []),
    { name: t('nav.alumni'), href: '/alumni', isAnchor: false },
    { name: t('nav.kontak'), href: '/kontak', isAnchor: false },
  ];

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'nav-scrolled' : 'nav-hero'}`}>
      <div className="container nav-container">

        {/* 1. LOGO SECTION (ISOLATED) */}
        <Link to="/" className="logo-pill">
          <img
            src="/assets/logo ayakan.png"
            alt="Ayaka Josei Center"
            className="logo-img"
          />
        </Link>

        {/* 2. NAVIGATION PILL (FLOATING ISLAND) */}
        <div className="nav-pill-wrapper desktop-only">
          <div className="nav-pill">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`pill-link ${active ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. MEMBER ACTION (Desktop) */}
        <div className="nav-actions desktop-only">
          {member ? (
            <div className="member-menu">
              <span className="member-name">Hi, {member.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-member-action" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/member/login" className="btn-auth-login">
                {t('nav.masuk')}
              </Link>
              <Link to="/member/register" className="btn-auth-register">
                {t('nav.daftar')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`mobile-toggle-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-overlay ${isOpen ? 'is-open' : ''}`} onClick={() => setIsOpen(false)}>
        <aside className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <span className="brand-primary" style={{ color: 'var(--brand-red)' }}>AYAKA</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={28} />
            </button>
          </div>
          <div className="drawer-links">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`drawer-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="drawer-divider"></div>

            {member ? (
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="drawer-link logout-link">
                <LogOut size={18} /> {t('nav.logout')}
              </button>
            ) : (
              <Link to="/member/login" className="drawer-link login-link" onClick={() => setIsOpen(false)}>
                <LogIn size={18} /> {t('nav.login_member')}
              </Link>
            )}
          </div>
        </aside>
      </div>

      <style jsx="true">{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none; /* Let clicks pass through empty space */
        }

        .nav-hero {
          background: transparent;
        }

        .nav-scrolled {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          padding: 0.75rem 0;
        }
        
        .container { pointer-events: auto; } /* Re-enable clicks on content */

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          gap: 2.5rem;
        }

        /* LOGO PILL */
        .logo-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          background: #fff;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
          height: 50px; /* Fixed height for consistency */
        }
        .logo-pill:hover { transform: scale(1.05); }

        .logo-img {
          height: 35px; /* Adjust based on logo aspect ratio */
          width: auto;
          object-fit: contain;
        }

        .brand-primary { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.4rem; letter-spacing: -1px; }

        /* NAV PILL (THE FLOATING ISLAND) */
        .nav-pill {
          background: #ffffff;
          padding: 0.5rem 0.5rem;
          border-radius: 100px;
          display: flex;
          gap: 0.25rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          pointer-events: auto;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .pill-link {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          transition: all 0.3s ease;
          position: relative;
          white-space: nowrap;
        }

        .pill-link:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        /* ACTIVE STATE INDICATOR */
        .pill-link.active {
          background: #0f172a; /* Dark pill for active */
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.2);
        }

        /* AUTH ACTIONS */
        .auth-buttons {
            display: flex;
            gap: 1rem;
            align-items: center;
            pointer-events: auto;
        }

        .btn-auth-login {
            color: #334155;
            font-size: 0.9rem;
            font-weight: 700;
            text-decoration: none;
            transition: 0.3s;
            padding: 0.6rem 1.2rem;
            border: 1px solid #e2e8f0;
            border-radius: 100px;
            background: #ffffff;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .btn-auth-login:hover { 
            color: #da291c; 
            border-color: #da291c; 
            background: #fff0f0; 
        }

        .btn-auth-register {
            background: linear-gradient(135deg, #da291c 0%, #b91c1c 100%);
            color: white;
            padding: 0.7rem 1.8rem;
            border-radius: 100px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 700;
            transition: 0.3s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .btn-auth-register:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 25px rgba(218, 41, 28, 0.4); 
        }

        .member-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 0.4rem 0.4rem 0.4rem 1rem;
          border-radius: 100px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          pointer-events: auto;
        }
        .member-name { font-size: 0.85rem; font-weight: 700; color: #0f172a; }
        .btn-member-action {
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: 0.2s;
        }
        .btn-member-action:hover { background: #fee2e2; color: #da291c; }

        /* MOBILE STYLES */
        .mobile-toggle-btn {
          pointer-events: auto;
          background: #fff;
          padding: 12px;
          border-radius: 50%;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          color: #0f172a;
          border: none;
          display: flex;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
        }
        
        .hamburger-line { width: 24px; height: 2px; background: currentColor; transition: 0.3s; }
        .active .hamburger-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .active .hamburger-line:nth-child(2) { opacity: 0; }
        .active .hamburger-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .desktop-only { display: none; }
        @media (min-width: 1024px) {
          .desktop-only { display: block; }
          .mobile-toggle-btn { display: none !important; }
          .mobile-overlay { display: none !important; }
        }

        /* DRAWER */
        .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; opacity: 0; visibility: hidden; transition: 0.3s; pointer-events: auto; }
        .mobile-overlay.is-open { opacity: 1; visibility: visible; }
        
        .mobile-drawer {
          position: fixed; top: 0; right: 0; width: 80%; max-width: 320px; height: 100vh;
          background: white; padding: 2rem; transform: translateX(100%); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .is-open .mobile-drawer { transform: translateX(0); }

        .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .close-btn { background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        
        .drawer-links { display: flex; flex-direction: column; gap: 0.5rem; }
        .drawer-link {
          font-size: 1.1rem; font-weight: 700; color: #334155; text-decoration: none; padding: 1rem; border-radius: 12px;
          display: flex; align-items: center; gap: 0.8rem;
        }
        .drawer-link.active {
          background: var(--brand-red); color: white;
        }

        .drawer-divider { height: 1px; background: #e2e8f0; margin: 1rem 0; }
        .login-link { color: #da291c; background: #fef2f2; }
        .logout-link { color: #64748b; }
      `}</style>
    </nav>
  );
};

export default Navbar;

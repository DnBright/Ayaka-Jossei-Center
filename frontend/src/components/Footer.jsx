import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = ({ content }) => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img
            src="/assets/logo ayakan.png"
            alt="Ayaka Josei Center"
            className="footer-logo-img"
          />
          <h3>Ayaka Josei Center</h3>
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="footer-links">
          <h4>{t('footer.nav')}</h4>
          <ul>
            <li><a href="#home">{t('nav.home')}</a></li>
            <li><a href="#profil">{t('nav.profil')}</a></li>
            <li><a href="#program">{t('nav.program')}</a></li>
            <li><a href="#galeri">{t('nav.galeri')}</a></li>
            <li><a href="#blog">{t('nav.blog')}</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>{t('footer.contact_legal')}</h4>
          <div className="contact-item">
            <Mail size={18} />
            <span>{content?.email || 'admin@ayakajoseicenter.com'}</span>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <span>{content?.phone || '+62 812 3456 789'}</span>
          </div>
          <div className="contact-item">
            <MapPin size={18} />
            <span>{content?.address || 'Jakarta, Indonesia'}</span>
          </div>
          <p className="legal-text">{content?.legal || 'PT Ayaka Global Indonesia • Izin SO No. 123/2026'}</p>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <p>&copy; {new Date().getFullYear()} Ayaka Josei Center. {t('footer.all_rights')}</p>
      </div>

      <style jsx="true">{`
        .footer {
          background: #1a1a1a;
          color: white;
          padding: 6rem 0 2rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }
        @media (min-width: 768px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
        }
        h3, h4 { color: white; margin-bottom: 1.5rem; font-family: 'Outfit', sans-serif; font-weight: 800; }
        p { color: #94a3b8; line-height: 1.6; }
        ul { list-style: none; }
        ul li { margin-bottom: 0.75rem; }
        ul li a { color: #94a3b8; text-decoration: none; transition: color 0.3s ease; font-weight: 500; }
        ul li a:hover { color: var(--brand-red); }
        ul li a:hover { color: var(--brand-red); }
        .footer-logo-img { height: 60px; width: auto; margin-bottom: 1.5rem; }
        .legal-text { font-size: 0.75rem; color: #64748b; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; font-weight: 600; }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #94a3b8;
          margin-bottom: 1rem;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 2rem;
          color: #64748b;
          font-size: 0.875rem;
        }
        .text-center { text-align: center; }
      `}</style>
    </footer>
  );
};

export default Footer;

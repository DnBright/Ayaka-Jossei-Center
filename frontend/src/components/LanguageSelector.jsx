import React, { useState } from 'react';
import { Globe, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(i18n.language || 'id');

    const languages = [
        { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
        { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'ko', name: 'Korean', flag: '🇰🇷' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' }
    ];

    const handleLanguageChange = (langCode) => {
        setSelectedLang(langCode);
        setIsOpen(false);

        // Change language using i18n
        i18n.changeLanguage(langCode);

        // Store in localStorage
        localStorage.setItem('preferred_language', langCode);
    };

    const currentLang = languages.find(lang => lang.code === selectedLang) || languages.find(lang => lang.code === 'id') || languages[0];

    return (
        <div className="language-selector-container">
            <div className={`language-menu ${isOpen ? 'is-open' : ''}`}>
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`lang-option ${selectedLang === lang.code ? 'active' : ''}`}
                    >
                        <span className="flag">{lang.flag}</span>
                        <span className="lang-name">{lang.name}</span>
                    </button>
                ))}
            </div>

            <button
                className="language-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select Language"
            >
                <Globe size={20} />
                <span className="current-lang">{currentLang.flag} {currentLang.name}</span>
                <ChevronUp size={16} className={`chevron ${isOpen ? 'rotated' : ''}`} />
            </button>

            <style jsx="true">{`
                .language-selector-container {
                    position: fixed;
                    bottom: 2rem;
                    left: 2rem;
                    z-index: 999;
                }

                .language-toggle {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.875rem 1.25rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 100px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #0f172a;
                }

                .language-toggle:hover {
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
                    transform: translateY(-2px);
                    border-color: #cbd5e1;
                }

                .current-lang {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .chevron {
                    transition: transform 0.3s;
                }

                .chevron.rotated {
                    transform: rotate(180deg);
                }

                .language-menu {
                    position: absolute;
                    bottom: calc(100% + 1rem);
                    left: 0;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                    padding: 0.5rem;
                    min-width: 200px;
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .language-menu.is-open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: auto;
                }

                .lang-option {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #475569;
                    text-align: left;
                }

                .lang-option:hover {
                    background: #f8fafc;
                    color: #0f172a;
                }

                .lang-option.active {
                    background: linear-gradient(135deg, #da291c 0%, #b91c1c 100%);
                    color: white;
                    font-weight: 700;
                }

                .flag {
                    font-size: 1.25rem;
                    line-height: 1;
                }

                .lang-name {
                    flex: 1;
                }

                @media (max-width: 768px) {
                    .language-selector-container {
                        bottom: 1rem;
                        left: 1rem;
                    }

                    .language-toggle {
                        padding: 0.75rem 1rem;
                        font-size: 0.85rem;
                    }

                    .current-lang {
                        display: none;
                    }

                    .language-menu {
                        min-width: 180px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LanguageSelector;

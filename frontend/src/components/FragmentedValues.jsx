import React from 'react';
import { Shield, Award, Users, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FragmentedValues = ({ items, layout = 'fragmented' }) => {
    const { t } = useTranslation();
    const icons = [<Shield />, <Award />, <Users />, <Sparkles />];

    if (layout === 'structured') {
        return (
            <div className="structured-values-grid">
                {items.map((val, idx) => (
                    <div key={idx} className="structured-value-card">
                        <div className="structured-icon-box">{icons[idx % icons.length]}</div>
                        <div className="structured-content">
                            <h3>{t(`profil.values.item_${idx}.title`, { defaultValue: val.label || val.title })}</h3>
                            <p>{t(`profil.values.item_${idx}.desc`, { defaultValue: val.desc || val.content })}</p>
                        </div>
                    </div>
                ))}
                <style jsx="true">{`
                    .structured-values-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 2rem;
                    }
                    .structured-value-card {
                        background: #fff;
                        padding: 2.5rem;
                        border-radius: 20px;
                        border: 1px solid #f1f5f9;
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    .structured-value-card:hover {
                        border-color: #da291c;
                        transform: translateY(-10px);
                        box-shadow: 0 40px 80px rgba(0,0,0,0.05);
                    }
                    .structured-icon-box {
                        width: 70px;
                        height: 70px;
                        background: rgba(218, 41, 28, 0.05);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #da291c;
                        margin-bottom: 2rem;
                        transition: 0.3s;
                    }
                    .structured-value-card:hover .structured-icon-box {
                        background: #da291c;
                        color: #fff;
                    }
                    .structured-content h3 {
                        font-size: 1.5rem;
                        font-weight: 900;
                        color: #0f172a;
                        margin-bottom: 1rem;
                    }
                    .structured-content p {
                        font-size: 1rem;
                        line-height: 1.6;
                        color: #64748b;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="fragmented-container">
            {items.map((val, idx) => (
                <div key={idx} className={`value-fragment frag-${idx + 1} page-reveal reveal-up`}>
                    <div className="frag-icon-wrap">{icons[idx % icons.length]}</div>
                    <div className="frag-content">
                        <h3>{t(`profil.values.item_${idx}.title`, { defaultValue: val.label || val.title })}</h3>
                        <p>{t(`profil.values.item_${idx}.desc`, { defaultValue: val.desc || val.content })}</p>
                    </div>
                </div>
            ))}

            <style jsx="true">{`
                .fragmented-container {
                    position: relative;
                    height: 800px;
                    margin: 5rem 0;
                }
                .value-fragment {
                    position: absolute;
                    background: white;
                    padding: clamp(2rem, 5vw, 3rem);
                    border-radius: 4px;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.06);
                    border: 1px solid #f1f5f9;
                    max-width: 350px;
                    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: default;
                }
                .value-fragment:hover {
                    transform: scale(1.05) !important;
                    z-index: 50;
                    box-shadow: 0 60px 120px rgba(0,0,0,0.1);
                }
                .frag-icon-wrap {
                    width: 70px;
                    height: 70px;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #f1f5f9;
                    margin-bottom: 2rem;
                    position: relative;
                    color: #da291c;
                }
                .frag-icon-wrap::after {
                    content: '';
                    position: absolute;
                    inset: -5px;
                    border: 1px solid #da291c;
                    opacity: 0.2;
                }
                .frag-content h3 {
                    font-size: clamp(1.2rem, 5vw, 1.5rem);
                    font-weight: 900;
                    margin-bottom: 0.75rem;
                }
                .frag-content p {
                    font-size: clamp(0.85rem, 3vw, 0.95rem);
                    color: #64748b;
                    line-height: 1.5;
                }

                .frag-1 { top: 10%; left: 5%; transform: rotate(-2deg); }
                .frag-2 { top: 45%; left: 40%; transform: rotate(3deg); }
                .frag-3 { top: 15%; right: 5%; transform: rotate(1deg); }
                .frag-4 { bottom: 10%; right: 15%; transform: rotate(-3deg); }

                @media (max-width: 1024px) {
                    .fragmented-container { height: auto; display: flex; flex-direction: column; gap: 2rem; margin: 3rem 0; padding: 0 5%; }
                    .value-fragment { position: relative; inset: 0 !important; transform: none !important; max-width: 100%; padding: 2rem; }
                    .frag-icon-wrap { margin-bottom: 1rem; }
                }

                @media (max-width: 640px) {
                    .value-fragment { padding: 1.5rem; border-radius: 20px; }
                }
            `}</style>
        </div>
    );
};

export default FragmentedValues;

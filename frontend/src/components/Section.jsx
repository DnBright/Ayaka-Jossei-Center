import React from 'react';

const Section = ({ id, title, children, className = "", centered = false }) => {
    return (
        <section id={id} className={`section ${className}`}>
            <div className="container">
                {title && (
                    <div className={`section-header ${centered ? 'text-center' : ''}`}>
                        <h2>{title}</h2>
                        <div className="underline"></div>
                    </div>
                )}
                <div className="section-content">
                    {children}
                </div>
            </div>

            <style jsx="true">{`
        .section-header {
          margin-bottom: 4rem;
        }
        .text-center {
          text-align: center;
        }
        .text-center .underline {
          margin-left: auto;
          margin-right: auto;
        }
        h2 {
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 1rem;
        }
        .underline {
          width: 60px;
          height: 4px;
          background: var(--accent);
          border-radius: 2px;
        }
      `}</style>
        </section>
    );
};

export default Section;

'use client';

import { MouseEvent } from 'react';

interface Contact {
  name: string;
  phone: string;
  role: string;
}

interface ContactCardsProps {
  contacts: Contact[];
}

export default function ContactCards({ contacts }: ContactCardsProps) {
  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.borderColor = 'rgba(212,175,55,0.7)';
    target.style.boxShadow = '0 0 30px rgba(212,175,55,0.1)';
    target.style.transform = 'translateY(-4px)';
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.borderColor = 'rgba(212,175,55,0.2)';
    target.style.boxShadow = 'none';
    target.style.transform = 'translateY(0)';
  };

  return (
    <div
      className="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
      }}
    >
      {contacts.map((c, i) => (
        <a key={i} href={`tel:${c.phone.replace(/\s/g, '')}`} style={{ textDecoration: 'none' }}>
          <div
            style={{
              border: '1px solid rgba(212,175,55,0.2)',
              borderTop: '3px solid #C9A84C',
              background: 'rgba(201,168,76,0.03)',
              padding: '24px 20px',
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p
              style={{
                fontFamily: 'Space Mono',
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: '#C9A84C',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              {c.role}
            </p>

            <p
              style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: '1.2rem',
                color: '#fff',
                marginBottom: '12px',
                lineHeight: 1.3,
              }}
            >
              {c.name}
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.25)',
                padding: '6px 14px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-.54a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span
                style={{
                  fontFamily: 'Space Mono',
                  fontSize: '11px',
                  color: '#C9A84C',
                  letterSpacing: '0.05em',
                }}
              >
                {c.phone}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

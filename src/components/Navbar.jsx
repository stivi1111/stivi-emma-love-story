import React, { useState } from 'react';
import { Heart, Sun, Moon, Volume2, VolumeX, Menu, X } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, isSoundOn, toggleSound }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Tempo Insieme', href: '#counter' },
    { name: 'La Nostra Storia', href: '#timeline' },
    { name: 'Cosa Facciamo?', href: '#date-wheel' },
    { name: 'Mappa del Cuore', href: '#memory-map' },
    { name: 'Abbraccio', href: '#virtual-hug' },
    { name: 'Countdown', href: '#countdowns' },
    { name: 'Foto Album', href: '#gallery' },
    { name: 'Note d\'Amore', href: '#notes' },
    { name: 'Bucket List', href: '#bucketlist' }
  ];

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }} className="animate-heartbeat">
            <Heart size={22} color="#ffffff" fill="#ffffff" />
          </div>
          <div>
            <span className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Stivi <span style={{ color: 'var(--accent-blush)' }}>&</span> Emma
            </span>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Love Story
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', gap: '18px', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--accent-blush)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Controls (Theme & Sound & Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleSound}
            title={isSoundOn ? "Disattiva Audio Ambient" : "Attiva Audio Ambient"}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '10px',
              cursor: 'pointer',
              color: 'var(--accent-blush)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? "Passa a Tema Chiaro" : "Passa a Tema Scuro"}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '10px',
              cursor: 'pointer',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '10px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-light)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}

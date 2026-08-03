import React, { useState } from 'react';
import { Heart, Sun, Moon, Volume2, VolumeX, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, isSoundOn, toggleSound }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navGroups = [
    { name: 'Home', href: '#hero' },
    {
      name: 'Il Nostro Amore 💖',
      items: [
        { name: 'Tempo Insieme ⏳', href: '#counter' },
        { name: 'La Nostra Storia 📖', href: '#timeline' },
        { name: 'Mappa del Cuore 📍', href: '#memory-map' }
      ]
    },
    {
      name: 'Momenti & Giochi ✨',
      items: [
        { name: 'Cosa Facciamo Stasera? 🎡', href: '#date-wheel' },
        { name: 'Abbraccio Virtuale 🫂', href: '#virtual-hug' },
        { name: 'Countdown Eventi 🎂', href: '#countdowns' }
      ]
    },
    {
      name: 'Ricordi 📸',
      items: [
        { name: 'Foto Album 🖼️', href: '#gallery' },
        { name: 'Note d\'Amore 💌', href: '#notes' },
        { name: 'Bucket List ✈️', href: '#bucketlist' }
      ]
    }
  ];

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }} className="animate-heartbeat">
            <Heart size={20} color="#ffffff" fill="#ffffff" />
          </div>
          <div>
            <span className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Stivi <span style={{ color: 'var(--accent-blush)' }}>&</span> Emma
            </span>
          </div>
        </a>

        {/* Streamlined Desktop Grouped Navigation */}
        <nav style={{ display: 'none', gap: '20px', alignItems: 'center' }} className="desktop-nav">
          {navGroups.map((group, idx) => {
            if (!group.items) {
              return (
                <a
                  key={group.name}
                  href={group.href}
                  style={{
                    textDecoration: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--accent-rose)'; e.target.style.background = 'rgba(255, 77, 109, 0.08)'; }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
                >
                  {group.name}
                </a>
              );
            }

            return (
              <div
                key={group.name}
                style={{ position: 'relative' }}
                onMouseEnter={() => setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-rose)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {group.name}
                  <ChevronDown size={14} style={{ transform: activeDropdown === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === idx && (
                  <div className="glass-card" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '210px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 110
                  }}>
                    {group.items.map((sub) => (
                      <a
                        key={sub.name}
                        href={sub.href}
                        style={{
                          textDecoration: 'none',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                          padding: '10px 14px',
                          borderRadius: '8px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 77, 109, 0.1)'; e.target.style.color = 'var(--accent-rose)'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-primary)'; }}
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleSound}
            title={isSoundOn ? "Disattiva Audio Ambient" : "Attiva Audio Ambient"}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '9px',
              cursor: 'pointer',
              color: 'var(--accent-blush)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
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
              padding: '9px',
              cursor: 'pointer',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
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
              padding: '9px',
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
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {navGroups.map((group) => {
            if (!group.items) {
              return (
                <a
                  key={group.name}
                  href={group.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700 }}
                >
                  {group.name}
                </a>
              );
            }
            return (
              <div key={group.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase' }}>
                  {group.name}
                </div>
                {group.items.map((sub) => (
                  <a
                    key={sub.name}
                    href={sub.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ textDecoration: 'none', color: 'var(--text-primary)', paddingLeft: '12px', fontSize: '0.95rem' }}
                  >
                    {sub.name}
                  </a>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}

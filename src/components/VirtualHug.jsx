import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';

const HUG_MESSAGES = [
  "Ti mando un abbraccio forte forte! Ricordati che sono sempre qui per te. 🫂💖",
  "Niente panico, un abbraccio stretto in arrivo solo per te! 🧸✨",
  "Chiudi gli occhi per 3 secondi e senti quanto ti amo! 💓",
  "Sei la mia persona preferita. Un bacio ed un abbraccio gigante! 💋🫂"
];

export default function VirtualHug() {
  const [hugCount, setHugCount] = useState(() => {
    return parseInt(localStorage.getItem('stivi_emma_hug_count') || '0', 10);
  });

  const [activeMessage, setActiveMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('stivi_emma_hug_count', hugCount.toString());
  }, [hugCount]);

  const sendVirtualHug = () => {
    setHugCount(prev => prev + 1);

    const randomMsg = HUG_MESSAGES[Math.floor(Math.random() * HUG_MESSAGES.length)];
    setActiveMessage(randomMsg);

    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff4d6d', '#e63946', '#ffb7c5', '#d4af37']
    });
  };

  return (
    <section id="virtual-hug" style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-card" style={{
        padding: '40px 28px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255, 77, 109, 0.12), rgba(212, 175, 55, 0.12))',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-blush)',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '12px'
        }}>
          <Sparkles size={16} /> Nei Momenti No o quando vi mancate
        </div>

        <h2 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '12px' }}>
          <span className="gradient-text font-serif">Ho Bisogno di un Abbraccio</span> <span className="emoji-color">🫂❤️</span>
        </h2>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 28px' }}>
          Stai avendo una giornata pesante o ti manca il tuo amore? Premi il pulsante per ricevere subito un abbraccio virtuale!
        </p>

        {/* Big Interactive Heart Hug Button */}
        <button
          onClick={sendVirtualHug}
          style={{
            background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '18px 42px',
            fontSize: '1.2rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={26} fill="#ffffff" className="animate-heartbeat" /> Invia un Abbraccio <span className="emoji-color">🫂</span>
        </button>

        {/* Hug Counter */}
        <div style={{ marginTop: '20px', fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Totale Abbracci Virtuali Inviati: <strong style={{ color: 'var(--accent-rose)', fontSize: '1.1rem' }}>{hugCount}</strong> <span className="emoji-color">🫂</span>
        </div>

        {/* Active Hug Pop-up Message */}
        {activeMessage && (
          <div className="glass-card" style={{
            marginTop: '28px',
            padding: '20px 24px',
            background: 'var(--bg-card)',
            animation: 'pulseGlow 2s ease-in-out infinite'
          }}>
            <p className="font-handwriting" style={{ fontSize: '1.75rem', color: 'var(--accent-rose)' }}>
              "{activeMessage}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

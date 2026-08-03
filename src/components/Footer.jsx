import React from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  const triggerEasterEgg = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#ff4d6d', '#e63946', '#d4af37', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      padding: '48px 24px 32px',
      textAlign: 'center',
      marginTop: '60px',
      background: 'var(--bg-card)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={triggerEasterEgg}
          className="animate-heartbeat"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)'
          }}
          title="Fai brillare il nostro amore! ✨"
        >
          <Heart size={24} fill="#ffffff" color="#ffffff" />
        </button>

        <h3 className="font-serif gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700 }}>
          Stivi & Emma
        </h3>

        <p className="font-handwriting" style={{ fontSize: '1.4rem', color: 'var(--accent-blush)' }}>
          "Per sempre, insieme a te."
        </p>

        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Fatto con il cuore 💖 | Stivi & Emma Love Story © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

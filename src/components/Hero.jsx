import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Calendar, ChevronDown, Edit3, Check } from 'lucide-react';

export default function Hero({ startDate, setStartDate }) {
  const [customQuote, setCustomQuote] = useState(() => {
    return localStorage.getItem('stivi_emma_custom_quote') || 'Scrivi qui la vostra frase speciale o citazione del cuore... ✨';
  });
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [tempQuote, setTempQuote] = useState(customQuote);

  useEffect(() => {
    localStorage.setItem('stivi_emma_custom_quote', customQuote);
  }, [customQuote]);

  const triggerLoveConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#e63946', '#ffb7c5', '#d4af37']
    });
  };

  const saveQuote = () => {
    if (tempQuote.trim()) {
      setCustomQuote(tempQuote.trim());
    }
    setIsEditingQuote(false);
  };

  return (
    <section id="hero" style={{
      position: 'relative',
      padding: '80px 24px 60px',
      textAlign: 'center',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* Top Floating Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--bg-card)',
        padding: '8px 18px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '28px',
        fontSize: '0.9rem',
        color: 'var(--accent-rose)',
        fontWeight: 600
      }}>
        <Sparkles size={16} className="animate-glow" />
        <span>Il Sito Ufficiale di Stivi & Emma</span>
      </div>

      {/* Main Title */}
      <h1 className="font-serif gradient-text" style={{
        fontSize: 'clamp(3rem, 8vw, 5.5rem)',
        fontWeight: 700,
        lineHeight: 1.1,
        marginBottom: '16px',
        letterSpacing: '-1px'
      }}>
        Stivi <span style={{ fontFamily: 'var(--font-handwriting)', fontWeight: 400, color: 'var(--accent-rose)' }}>&</span> Emma
      </h1>

      <p style={{
        fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
        color: 'var(--text-secondary)',
        marginBottom: '32px',
        maxWidth: '650px',
        margin: '0 auto 32px'
      }}>
        Il nostro spazio personale per custodire le foto reali, i ricordi veri, le note d'amore ed i nostri sogni.
      </p>

      {/* Real Customizable Love Quote / Slogan Card */}
      <div className="glass-card" style={{
        padding: '24px 32px',
        maxWidth: '650px',
        margin: '0 auto 40px',
        position: 'relative'
      }}>
        {!isEditingQuote ? (
          <div>
            <p className="font-handwriting" style={{
              fontSize: '1.85rem',
              color: 'var(--accent-blush)',
              marginBottom: '12px',
              lineHeight: 1.4
            }}>
              "{customQuote}"
            </p>
            <button
              onClick={() => { setTempQuote(customQuote); setIsEditingQuote(true); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Edit3 size={14} /> Modifica la vostra frase del cuore
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea
              value={tempQuote}
              onChange={(e) => setTempQuote(e.target.value)}
              rows={3}
              placeholder="Inserisci la vostra frase vera..."
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={saveQuote}
                style={{
                  background: 'var(--accent-rose)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '8px 20px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Check size={16} /> Salva Frase
              </button>
              <button
                onClick={() => setIsEditingQuote(false)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-full)',
                  padding: '8px 20px',
                  cursor: 'pointer'
                }}
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
        <button
          onClick={triggerLoveConfetti}
          style={{
            background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '14px 32px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={20} fill="#ffffff" /> Festeggia l'Amore 🎉
        </button>

        <a
          href="#gallery"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-full)',
            padding: '14px 32px',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          Carica o Guarda le Foto 📸
        </a>
      </div>

      {/* Relationship Start Date Adjuster */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--bg-card)',
        padding: '12px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        fontSize: '0.95rem',
        color: 'var(--text-secondary)'
      }}>
        <Calendar size={18} color="var(--accent-rose)" />
        <span style={{ fontWeight: 600 }}>Data di inizio della vostra storia vera:</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        />
      </div>

      <div style={{ marginTop: '40px' }} className="animate-float">
        <a href="#counter" style={{ color: 'var(--text-muted)' }}>
          <ChevronDown size={28} />
        </a>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw } from 'lucide-react';

const DEFAULT_IDEAS = [
  { id: 1, text: 'Pizza & Serie TV 🍕🎬', icon: '🍕' },
  { id: 2, text: 'Cena a base di Sushi 🍣', icon: '🍣' },
  { id: 3, text: 'Passeggiata al tramonto & Gelato 🍦', icon: '🍦' },
  { id: 4, text: 'Cucinare una ricetta nuova insieme 🍝', icon: '🍝' },
  { id: 5, text: 'Serata Giochi da Tavolo / Carte 🃏', icon: '🃏' },
  { id: 6, text: 'Drink & Chiacchiere al lume di candela 🍷', icon: '🍷' },
  { id: 7, text: 'Pic-nic al parco / mare 🧺', icon: '🧺' },
  { id: 8, text: 'Coccole & Film romantico 🍿', icon: '🍿' }
];

export default function DateWheel() {
  const [ideas] = useState(DEFAULT_IDEAS);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedIdea(null);

    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * ideas.length);
      setSelectedIdea(ideas[randomIndex]);
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        setIsSpinning(false);
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff4d6d', '#d4af37', '#ffffff']
        });
      }
    }, 100);
  };

  return (
    <section id="date-wheel" style={{ padding: '60px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-blush)',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '8px'
        }}>
          <Sparkles size={16} /> Risolvi-Serata di Coppia
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          <span className="gradient-text font-serif">Cosa Facciamo Stasera?</span> <span className="emoji-color">🎡✨</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Gira la ruota e lasciate che il destino scelga la vostra serata speciale!
        </p>
      </div>

      <div className="glass-card" style={{
        padding: '40px 28px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--bg-card), rgba(255, 77, 109, 0.06))'
      }}>
        {/* Selected Outcome Display */}
        <div style={{
          minHeight: '160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          {selectedIdea ? (
            <div style={{ animation: isSpinning ? 'none' : 'pulseGlow 2s ease-in-out infinite' }}>
              <div style={{ fontSize: '4rem', marginBottom: '12px' }} className="emoji-color">{selectedIdea.icon}</div>
              <h3 className="font-serif" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                {selectedIdea.text}
              </h3>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '3.5rem', marginBottom: '12px' }} className="animate-float emoji-color">🎡</div>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                Clicca sul pulsante qui sotto per girare la ruota delle idee!
              </p>
            </div>
          )}
        </div>

        {/* Spin Action Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          style={{
            background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '16px 40px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: isSpinning ? 'wait' : 'pointer',
            boxShadow: 'var(--shadow-glow)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            opacity: isSpinning ? 0.7 : 1,
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={20} className={isSpinning ? 'animate-spin' : ''} />
          {isSpinning ? 'Girando la ruota...' : 'Gira la Ruota! 🎡'}
        </button>

        {/* Ideas Badges */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '36px',
          maxWidth: '650px'
        }}>
          {ideas.map((idea) => (
            <span
              key={idea.id}
              style={{
                fontSize: '0.85rem',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-secondary)'
              }}
            >
              {idea.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

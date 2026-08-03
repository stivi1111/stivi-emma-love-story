import React, { useState, useEffect } from 'react';
import { Heart, Clock, Award, Flame, Calendar } from 'lucide-react';

export default function LoveCounter({ startDate }) {
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDate).getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, now - start);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  const formattedStartDate = new Date(startDate).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section id="counter" style={{
      padding: '60px 24px',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="font-serif gradient-text" style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '10px' }}>
          Il Tempo del Nostro Amore ⏳💖
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Calcolato esattamente a partire dal <strong style={{ color: 'var(--accent-rose)' }}>{formattedStartDate}</strong>
        </p>
      </div>

      {/* Main Authentic Live Counter Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px'
      }}>
        {[
          { label: 'Giorni', value: timeTogether.days, icon: <Clock size={22} color="var(--accent-blush)" /> },
          { label: 'Ore', value: timeTogether.hours, icon: <Flame size={22} color="var(--accent-rose)" /> },
          { label: 'Minuti', value: timeTogether.minutes, icon: <Heart size={22} color="var(--accent-blush)" fill="var(--accent-blush)" /> },
          { label: 'Secondi', value: timeTogether.seconds, icon: <Award size={22} color="var(--accent-gold)" /> }
        ].map((item, idx) => (
          <div key={idx} className="glass-card" style={{
            padding: '32px 20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '12px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
              marginBottom: '14px'
            }}>
              {item.icon}
            </div>
            <div className="font-serif" style={{
              fontSize: '3.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1
            }}>
              {item.value}
            </div>
            <div style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginTop: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Gift, Plane, Heart, Edit3, Check } from 'lucide-react';

export default function UpcomingCountdowns() {
  const [dates, setDates] = useState(() => {
    const defaultDates = {
      anniversary: '2027-04-27',
      emmaBday: '2027-04-07',
      stiviBday: '2027-07-27',
      nextTrip: '2026-09-01'
    };
    const saved = localStorage.getItem('stivi_emma_upcoming_dates');
    if (!saved) {
      localStorage.setItem('stivi_emma_upcoming_dates', JSON.stringify(defaultDates));
      return defaultDates;
    }
    const parsed = JSON.parse(saved);
    // Ensure exact dates requested by Stivi
    parsed.anniversary = '2027-04-27';
    parsed.emmaBday = '2027-04-07';
    parsed.stiviBday = '2027-07-27';
    return parsed;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempDates, setTempDates] = useState(dates);

  useEffect(() => {
    localStorage.setItem('stivi_emma_upcoming_dates', JSON.stringify(dates));
  }, [dates]);

  const getDaysRemaining = (targetDateStr) => {
    if (!targetDateStr) return 0;
    const now = new Date();
    let target = new Date(targetDateStr);

    if (target.getTime() < now.getTime()) {
      target.setFullYear(now.getFullYear() + 1);
    }

    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const saveDates = () => {
    setDates(tempDates);
    setIsEditing(false);
  };

  const eventList = [
    { title: 'Prossimo Anniversario (27 Aprile) 💍', days: getDaysRemaining(dates.anniversary), icon: <Heart size={22} color="var(--accent-rose)" fill="var(--accent-rose)" /> },
    { title: 'Compleanno di Emma (7 Aprile) 🎂', days: getDaysRemaining(dates.emmaBday), icon: <Gift size={22} color="var(--accent-blush)" /> },
    { title: 'Compleanno di Stivi (27 Luglio) 🎈', days: getDaysRemaining(dates.stiviBday), icon: <Gift size={22} color="var(--accent-gold)" /> },
    { title: 'Prossimo Viaggio / Vacanza ✈️', days: getDaysRemaining(dates.nextTrip), icon: <Plane size={22} color="var(--accent-rose)" /> }
  ];

  return (
    <section id="countdowns" style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
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
          <Sparkles size={16} /> Attesa delle Date Speciali
        </div>
        <h2 className="font-serif gradient-text" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          Countdown Eventi di Coppia 🎂✈️
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Quanti giorni mancano ai vostri prossimi momenti speciali?
        </p>

        <button
          onClick={() => { setTempDates(dates); setIsEditing(!isEditing); }}
          style={{
            marginTop: '16px',
            background: 'none',
            border: '1px solid var(--border-light)',
            color: 'var(--text-muted)',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Edit3 size={14} /> Personalizza le date
        </button>
      </div>

      {/* Date Edit Panel */}
      {isEditing && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          <h4 style={{ marginBottom: '16px', color: 'var(--accent-rose)' }}>Imposta le date corrette:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Compleanno Emma (7 Aprile)</label>
              <input
                type="date"
                value={tempDates.emmaBday}
                onChange={(e) => setTempDates({ ...tempDates, emmaBday: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Compleanno Stivi (27 Luglio)</label>
              <input
                type="date"
                value={tempDates.stiviBday}
                onChange={(e) => setTempDates({ ...tempDates, stiviBday: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Prossimo Viaggio / Vacanza</label>
              <input
                type="date"
                value={tempDates.nextTrip}
                onChange={(e) => setTempDates({ ...tempDates, nextTrip: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
              />
            </div>
          </div>
          <button
            onClick={saveDates}
            style={{
              background: 'var(--accent-rose)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '10px 24px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={16} /> Salva Date
          </button>
        </div>
      )}

      {/* Grid of Countdowns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {eventList.map((evt, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              padding: '10px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
              marginBottom: '14px'
            }}>
              {evt.icon}
            </div>
            <div className="font-serif" style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {evt.days}
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-blush)', marginTop: '4px', textTransform: 'uppercase' }}>
              Giorni Mancanti
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '8px' }}>
              {evt.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

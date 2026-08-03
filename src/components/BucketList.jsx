import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle, Plus, Sparkles, Trophy, Trash2 } from 'lucide-react';
import { pushFullCloudPayload } from '../utils/cloudSync';

export default function BucketList() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_bucketlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    localStorage.setItem('stivi_emma_real_bucketlist', JSON.stringify(items));
  }, [items]);

  const toggleItem = async (id) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const nextState = !item.completed;
        if (nextState) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#ff4d6d', '#d4af37', '#ffffff']
          });
        }
        return { ...item, completed: nextState };
      }
      return item;
    });

    setItems(updated);
    localStorage.setItem('stivi_emma_real_bucketlist', JSON.stringify(updated));
    await pushFullCloudPayload();
  };

  const deleteItem = async (id, e) => {
    if (e) e.stopPropagation();
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('stivi_emma_real_bucketlist', JSON.stringify(updated));
    await pushFullCloudPayload();
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newItemText.trim(),
      completed: false
    };

    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('stivi_emma_real_bucketlist', JSON.stringify(updated));
    setNewItemText('');

    await pushFullCloudPayload();
  };

  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <section id="bucketlist" style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
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
          <Sparkles size={16} /> I Vostri Sogni Reali Sincronizzati ☁️
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700 }}>
          <span className="gradient-text font-serif">Bucket List di Coppia</span> <span className="emoji-color">✈️💖</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Inserite le vostre avventure: si sincronizzano all'istante su PC, iPhone ed Android!
        </p>
      </div>

      {/* Progress Bar Card */}
      {items.length > 0 && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color="var(--accent-gold)" /> Obiettivi Realizzati
            </span>
            <span style={{ fontWeight: 700, color: 'var(--accent-rose)', fontSize: '1.1rem' }}>
              {completedCount} su {items.length} ({progressPercent}%)
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '14px',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-blush), var(--accent-rose), var(--accent-gold))',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>
      )}

      {/* Responsive Mobile-Optimized Add Item Form */}
      <form
        onSubmit={handleAddItem}
        className="glass-card"
        style={{
          padding: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '28px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <input
          type="text"
          placeholder="Inserisci un sogno vero (es. Viaggio in Giappone)..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          style={{
            flex: '1 1 240px',
            minWidth: 0,
            width: '100%',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          style={{
            flex: '1 1 140px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
            color: '#ffffff',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxSizing: 'border-box'
          }}
        >
          <Plus size={18} /> Salva & Sincronizza ☁️
        </button>
      </form>

      {/* Checklist Stream */}
      {items.length === 0 ? (
        <div className="glass-card" style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', width: '100%', boxSizing: 'border-box' }}>
          Nessun obiettivo inserito ancora. Aggiungete il vostro primo sogno di coppia qui sopra!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              onClick={() => toggleItem(item.id)}
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                opacity: item.completed ? 0.75 : 1,
                gap: '12px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                  {item.completed ? (
                    <CheckCircle2 size={24} color="var(--accent-rose)" fill="rgba(230,57,70,0.15)" />
                  ) : (
                    <Circle size={24} color="var(--text-muted)" />
                  )}
                </button>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  textDecoration: item.completed ? 'line-through' : 'none',
                  wordBreak: 'break-word'
                }}>
                  {item.text}
                </span>
              </div>

              <button
                onClick={(e) => deleteItem(item.id, e)}
                title="Elimina"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

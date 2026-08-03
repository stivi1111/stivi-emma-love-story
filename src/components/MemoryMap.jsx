import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Sparkles, X, Trash2, Navigation } from 'lucide-react';

export default function MemoryMap() {
  const [places, setPlaces] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_places');
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [newPlace, setNewPlace] = useState({
    title: '',
    cityName: '',
    category: 'Primo Incontro',
    note: ''
  });

  useEffect(() => {
    localStorage.setItem('stivi_emma_real_places', JSON.stringify(places));
  }, [places]);

  const handleAddPlace = (e) => {
    e.preventDefault();
    if (!newPlace.title || !newPlace.cityName) return;

    const item = {
      id: Date.now(),
      ...newPlace
    };

    setPlaces([item, ...places]);
    setNewPlace({ title: '', cityName: '', category: 'Primo Incontro', note: '' });
    setShowModal(false);
  };

  const deletePlace = (id) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  return (
    <section id="memory-map" style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
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
          <Sparkles size={16} /> Mappa delle Emozioni
        </div>
        <h2 className="font-serif gradient-text" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          I Luoghi del Nostro Cuore 🗺️📍
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          I posti speciali dove abbiamo vissuto i momenti più importanti del nostro amore.
        </p>

        <button
          onClick={() => setShowModal(true)}
          style={{
            marginTop: '20px',
            background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
            color: '#ffffff',
            border: 'none',
            padding: '12px 28px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Plus size={18} /> Aggiungi un Luogo del Cuore 📍
        </button>
      </div>

      {/* Places Stream */}
      {places.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <MapPin size={40} color="var(--accent-rose)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Nessun luogo ancora aggiunto</h4>
          <p style={{ fontSize: '0.95rem' }}>Clicca sul pulsante in alto per inserire il vostro primo luogo del cuore (es. dove vi siete dati il primo bacio o dove avete fatto il primo viaggio!)</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {places.map((place) => (
            <div key={place.id} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
              <button
                onClick={() => deletePlace(place.id)}
                title="Elimina"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{
                  padding: '8px',
                  borderRadius: '50%',
                  background: 'rgba(255, 77, 109, 0.15)',
                  color: 'var(--accent-rose)'
                }}>
                  <MapPin size={20} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-rose)', letterSpacing: '1px' }}>
                  {place.category}
                </span>
              </div>

              <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {place.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', color: 'var(--accent-blush)', fontWeight: 600, marginBottom: '10px' }}>
                <Navigation size={14} /> {place.cityName}
              </div>

              {place.note && (
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  "{place.note}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Place Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <form onSubmit={handleAddPlace} className="glass-card" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            background: 'var(--bg-card)'
          }}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h3 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '20px', color: 'var(--accent-rose)' }}>
              Aggiungi un Luogo del Cuore 📍
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                placeholder="Titolo (es. Dove ci siamo dati il primo bacio)"
                value={newPlace.title}
                onChange={(e) => setNewPlace({ ...newPlace, title: e.target.value })}
                required
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              />

              <input
                type="text"
                placeholder="Città o Indirizzo (es. Roma, Terrazza del Pincio)"
                value={newPlace.cityName}
                onChange={(e) => setNewPlace({ ...newPlace, cityName: e.target.value })}
                required
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              />

              <select
                value={newPlace.category}
                onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="Primo Incontro">Primo Incontro</option>
                <option value="Primo Bacio">Primo Bacio</option>
                <option value="Primo Viaggio">Primo Viaggio</option>
                <option value="Ristorante Preferito">Ristorante Preferito</option>
                <option value="Posto del Cuore">Posto del Cuore</option>
              </select>

              <textarea
                placeholder="Cosa rende speciale questo luogo per voi?"
                value={newPlace.note}
                onChange={(e) => setNewPlace({ ...newPlace, note: e.target.value })}
                rows={3}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  resize: 'none'
                }}
              />

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Salva Luogo 📍
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Sparkles, X, Trash2, Navigation, ExternalLink, Search, LocateFixed, Check } from 'lucide-react';

export default function MemoryMap() {
  const [places, setPlaces] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_places');
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [newPlace, setNewPlace] = useState({
    title: '',
    cityName: '',
    category: 'Primo Incontro',
    note: ''
  });

  useEffect(() => {
    localStorage.setItem('stivi_emma_real_places', JSON.stringify(places));
  }, [places]);

  // Live Autocomplete search using Photon / Nominatim Geocoding API
  const handleCityInputChange = async (val) => {
    setNewPlace(prev => ({ ...prev, cityName: val }));

    if (val.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=5`);
      const data = await res.json();
      if (data && data.features) {
        const results = data.features.map(f => {
          const p = f.properties;
          const name = [p.name, p.street, p.city || p.town || p.county, p.country].filter(Boolean).join(', ');
          return {
            displayName: name,
            shortName: p.name || val,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0]
          };
        });
        setSuggestions(results);
      }
    } catch (e) {
      console.log('Search autocomplete error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSuggestion = (sugg) => {
    setNewPlace(prev => ({
      ...prev,
      cityName: sugg.displayName,
      title: prev.title || `Ricordo a ${sugg.shortName}`
    }));
    setSuggestions([]);
  };

  // Find Current GPS Location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalizzazione non è supportata dal tuo browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data && data.features && data.features.length > 0) {
          const p = data.features[0].properties;
          const name = [p.name, p.street, p.city || p.town, p.country].filter(Boolean).join(', ');
          setNewPlace(prev => ({
            ...prev,
            cityName: name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            title: prev.title || `Posizione Attuale (${p.city || 'Qui'})`
          }));
        }
      } catch (e) {
        setNewPlace(prev => ({
          ...prev,
          cityName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          title: prev.title || 'Posizione Attuale'
        }));
      }
    });
  };

  const handleAddPlace = (e) => {
    e.preventDefault();
    if (!newPlace.title || !newPlace.cityName) return;

    const query = newPlace.cityName.trim();
    const encodedQuery = encodeURIComponent(query);

    const item = {
      id: Date.now(),
      title: newPlace.title.trim(),
      cityName: query,
      category: newPlace.category,
      note: newPlace.note.trim(),
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
      embedUrl: `https://maps.google.com/maps?q=${encodedQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`
    };

    setPlaces([item, ...places]);
    setNewPlace({ title: '', cityName: '', category: 'Primo Incontro', note: '' });
    setSuggestions([]);
    setShowModal(false);
  };

  const deletePlace = (id) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  return (
    <section id="memory-map" style={{ padding: '60px 20px', maxWidth: '1050px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
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
          <Sparkles size={16} /> Ricerca Automatica dei Luoghi
        </div>
        <h2 className="font-serif gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700 }}>
          I Luoghi del Nostro Cuore 🗺️📍
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          Digita poche lettere per trovare automaticamente qualsiasi posto o usa la tua posizione attuale!
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
          <Search size={18} /> Cerca & Aggiungi Luogo Automatico 🔍
        </button>
      </div>

      {/* Places Stream */}
      {places.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', width: '100%', boxSizing: 'border-box' }}>
          <MapPin size={42} color="var(--accent-rose)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Nessun luogo ancora inserito</h4>
          <p style={{ fontSize: '0.95rem' }}>Clicca sul pulsante in alto: digita es. "Colosseo" o "Duomo" ed il sistema trovera automaticamente il posto per te!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '24px',
          width: '100%'
        }}>
          {places.map((place) => (
            <div key={place.id} className="glass-card" style={{ overflow: 'hidden', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
              <button
                onClick={() => deletePlace(place.id)}
                title="Elimina"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(4px)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <Trash2 size={16} />
              </button>

              <div style={{ position: 'relative', width: '100%', height: '180px', background: '#e5e3df' }}>
                <iframe
                  title={place.title}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={place.embedUrl}
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--accent-rose)',
                    background: 'rgba(230, 57, 70, 0.1)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {place.category}
                  </span>
                </div>

                <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {place.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--accent-blush)', fontWeight: 600, marginBottom: '12px' }}>
                  <Navigation size={14} /> {place.cityName}
                </div>

                {place.note && (
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    "{place.note}"
                  </p>
                )}

                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--accent-rose)',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <ExternalLink size={16} /> Apri su Google Maps 🗺️
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Place Modal with Automatic Suggestions */}
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
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            background: 'var(--bg-card)',
            boxSizing: 'border-box'
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

            <h3 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '6px', color: 'var(--accent-rose)' }}>
              Cerca Luogo Automatico 🔍
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Inizia a digitare il nome del posto e seleziona il suggerimento automatico!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Autocomplete Input */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Cerca Luogo o Indirizzo
                  </label>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-blush)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <LocateFixed size={14} /> Usa mia posizione 📍
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Digita es. 'Colosseo Roma', 'Duomo Milano'..."
                    value={newPlace.cityName}
                    onChange={(e) => handleCityInputChange(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      paddingRight: '40px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '14px' }} />
                </div>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="glass-card" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '6px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 10,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '6px'
                  }}>
                    {suggestions.map((sugg, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestion(sugg)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 77, 109, 0.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <MapPin size={16} color="var(--accent-rose)" />
                        <span>{sugg.displayName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Titolo del Ricordo
                </label>
                <input
                  type="text"
                  placeholder="es. Dove ci siamo conosciuti"
                  value={newPlace.title}
                  onChange={(e) => setNewPlace({ ...newPlace, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Categoria
                </label>
                <select
                  value={newPlace.category}
                  onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Primo Incontro">Primo Incontro</option>
                  <option value="Primo Bacio">Primo Bacio</option>
                  <option value="Primo Viaggio">Primo Viaggio</option>
                  <option value="Ristorante Preferito">Ristorante Preferito</option>
                  <option value="Posto del Cuore">Posto del Cuore</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Nota o Dettagli (Opzionale)
                </label>
                <textarea
                  placeholder="Scrivi qualcosa di bello su questo posto..."
                  value={newPlace.note}
                  onChange={(e) => setNewPlace({ ...newPlace, note: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

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
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                Salva Luogo Automatico 🗺️
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

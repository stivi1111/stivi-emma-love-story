import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Sparkles, X, Trash2, Navigation, ExternalLink, Search, LocateFixed, Map as MapIcon } from 'lucide-react';

export default function MemoryMap() {
  const [places, setPlaces] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_places');
    return saved ? JSON.parse(saved) : [];
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [newPlace, setNewPlace] = useState({
    title: '',
    cityName: '',
    category: 'Primo Incontro',
    note: '',
    lat: 41.8902,
    lon: 12.4922
  });

  useEffect(() => {
    localStorage.setItem('stivi_emma_real_places', JSON.stringify(places));
  }, [places]);

  // Live Autocomplete search using Photon Geocoding API (Returns exact lat & lon!)
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
      title: prev.title || `Ricordo a ${sugg.shortName}`,
      lat: sugg.lat,
      lon: sugg.lon
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
        let name = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        let short = 'Posizione Attuale';
        if (data && data.features && data.features.length > 0) {
          const p = data.features[0].properties;
          name = [p.name, p.street, p.city || p.town, p.country].filter(Boolean).join(', ');
          short = p.city || p.name || 'Qui';
        }
        setNewPlace(prev => ({
          ...prev,
          cityName: name,
          title: prev.title || `Posizione Attuale (${short})`,
          lat: latitude,
          lon: longitude
        }));
      } catch (e) {
        setNewPlace(prev => ({
          ...prev,
          cityName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          title: prev.title || 'Posizione Attuale',
          lat: latitude,
          lon: longitude
        }));
      }
    });
  };

  const handleAddPlace = (e) => {
    e.preventDefault();
    if (!newPlace.title || !newPlace.cityName) return;

    const query = newPlace.cityName.trim();
    const encodedQuery = encodeURIComponent(query);
    const lat = newPlace.lat || 41.8902;
    const lon = newPlace.lon || 12.4922;

    // OpenStreetMap Embed URL (100% Free, Cross-Origin Allowed, Never Blocked on PC/Mac/iPhone!)
    const bbox = `${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}`;
    const openStreetMapEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

    const item = {
      id: Date.now(),
      title: newPlace.title.trim(),
      cityName: query,
      category: newPlace.category,
      note: newPlace.note.trim(),
      lat,
      lon,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
      appleMapsUrl: `https://maps.apple.com/?q=${encodedQuery}`,
      embedUrl: openStreetMapEmbed
    };

    setPlaces([item, ...places]);
    setNewPlace({ title: '', cityName: '', category: 'Primo Incontro', note: '', lat: 41.8902, lon: 12.4922 });
    setSuggestions([]);
  };

  const deletePlace = (id) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  return (
    <section id="memory-map" style={{ padding: '60px 20px', maxWidth: '1050px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-blush)',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '8px'
        }}>
          <Sparkles size={16} /> Mappa Universale 100% Garantita (PC, Mac, iPhone & Android)
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700 }}>
          <span className="gradient-text font-serif">I Luoghi del Nostro Cuore</span> <span className="emoji-color">🗺️📍</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          Mappa interattiva senza blocchi! Funziona su qualsiasi computer, iPhone o telefono Android.
        </p>
      </div>

      {/* Prominent Automatic Search Box */}
      <div className="glass-card" style={{
        maxWidth: '750px',
        margin: '0 auto 40px',
        padding: '28px',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, var(--bg-card), rgba(255, 77, 109, 0.05))',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '4px' }}>
          Cerca & Aggiungi Luogo Automatico <span className="emoji-color">🔍📍</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Inizia a digitare il nome del luogo (es. Colosseo Roma, Duomo Milano) e seleziona la scelta!
        </p>

        <form onSubmit={handleAddPlace} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                <LocateFixed size={14} /> Usa mia posizione <span className="emoji-color">📍</span>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Titolo Ricordo
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
          </div>

          <div>
            <textarea
              placeholder="Nota o dettaglio speciale sul posto (Opzionale)..."
              value={newPlace.note}
              onChange={(e) => setNewPlace({ ...newPlace, note: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                padding: '10px 16px',
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
              padding: '14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Plus size={18} /> Salva Luogo sulla Mappa <span className="emoji-color">🗺️</span>
          </button>
        </form>
      </div>

      {/* Places Stream Grid */}
      {places.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', width: '100%', boxSizing: 'border-box' }}>
          <MapPin size={42} color="var(--accent-rose)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Nessun luogo ancora inserito</h4>
          <p style={{ fontSize: '0.95rem' }}>Digita nel riquadro in alto es. "Colosseo" o "Duomo" ed il sistema trovera automaticamente il posto per te!</p>
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
                  zIndex: 3
                }}
              >
                <Trash2 size={16} />
              </button>

              {/* Universal Interactive Map Frame (OpenStreetMap - 100% Guaranteed cross-origin embed) */}
              <div style={{ position: 'relative', width: '100%', height: '190px', background: '#e5e3df' }}>
                <iframe
                  title={place.title}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, width: '100%', height: '100%' }}
                  src={place.embedUrl || `https://www.openstreetmap.org/export/embed.html?bbox=12.48%2C41.88%2C12.50%2C41.90&layer=mapnik&marker=41.8902%2C12.4922`}
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

                {/* Direct Google Maps & Apple Maps Navigation Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    <MapIcon size={16} /> Apri su Google Maps <span className="emoji-color">🗺️</span>
                  </a>

                  <a
                    href={place.appleMapsUrl || `https://maps.apple.com/?q=${encodeURIComponent(place.cityName)}`}
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
                      background: 'rgba(0, 122, 255, 0.08)',
                      border: '1px solid rgba(0, 122, 255, 0.2)',
                      color: '#007aff',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <ExternalLink size={16} /> Apri su Apple Maps (iPhone) <span className="emoji-color">🍎</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

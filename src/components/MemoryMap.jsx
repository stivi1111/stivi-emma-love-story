import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Heart, Sparkles, Navigation, Search, Trash2, Cloud } from 'lucide-react';
import { saveAndSyncCloud, pullFromCloud, registerDeletedId } from '../utils/cloudSync';

export default function MemoryMap() {
  const [places, setPlaces] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_places');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const [newPlaceNotes, setNewPlaceNotes] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState('Primo Incontro');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState(null);

  // Exact LoveNotes sync pattern
  useEffect(() => {
    const handleCloudSynced = () => {
      const saved = localStorage.getItem('stivi_emma_real_places');
      if (saved) {
        setPlaces(JSON.parse(saved));
      }
    };
    window.addEventListener('stivi_emma_cloud_synced', handleCloudSynced);
    return () => window.removeEventListener('stivi_emma_cloud_synced', handleCloudSynced);
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizzazione luoghi in corso...');
    const res = await pullFromCloud();
    if (res.data && res.data.places) {
      setPlaces(res.data.places);
      setSyncStatus('Luoghi Sincronizzati! ☁️✨');
    }
    setIsSyncing(false);
    setTimeout(() => setSyncStatus(''), 3000);
  };

  useEffect(() => {
    if (places.length > 0 && !selectedPlace) {
      setSelectedPlace(places[0]);
    }
  }, [places]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=it`);
      const data = await res.json();
      if (data && data.features) {
        setSearchResults(data.features);
      }
    } catch (e) {
      console.log('Search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (feature) => {
    const name = feature.properties.name || feature.properties.street || feature.properties.city || 'Luogo Speciale';
    const city = feature.properties.city || feature.properties.state || feature.properties.country || '';
    const lat = feature.geometry.coordinates[1];
    const lon = feature.geometry.coordinates[0];

    setSelectedSearchResult({
      name: city ? `${name}, ${city}` : name,
      lat,
      lon
    });
    setSearchResults([]);
    setSearchQuery(city ? `${name}, ${city}` : name);
    setShowAddForm(true);
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    if (!selectedSearchResult) return;

    const newPlace = {
      id: Date.now(),
      name: selectedSearchResult.name,
      lat: selectedSearchResult.lat,
      lon: selectedSearchResult.lon,
      category: newPlaceCategory,
      notes: newPlaceNotes || 'Un posto unico nel nostro cuore ✨',
      date: new Date().toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })
    };

    const updated = [newPlace, ...places];
    setPlaces(updated);
    setSelectedPlace(newPlace);
    setNewPlaceNotes('');
    setSearchQuery('');
    setSelectedSearchResult(null);
    setShowAddForm(false);

    setIsSyncing(true);
    await saveAndSyncCloud('stivi_emma_real_places', updated);
    setIsSyncing(false);
    setSyncStatus('Luogo Salvato e Sincronizzato! ☁️💖');
    setTimeout(() => setSyncStatus(''), 3000);
  };

  const deletePlace = async (id, e) => {
    if (e) e.stopPropagation();
    registerDeletedId(id);
    const updated = places.filter(p => p.id !== id);
    setPlaces(updated);
    if (selectedPlace && selectedPlace.id === id) {
      setSelectedPlace(updated[0] || null);
    }
    await saveAndSyncCloud('stivi_emma_real_places', updated);
  };

  return (
    <section id="map" style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
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
          <Sparkles size={16} /> Ricerca Automatica & Mappa Reale Sincronizzata ☁️
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          <span className="gradient-text font-serif">I Luoghi del Nostro Cuore</span> <span className="emoji-color">🗺️📍</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Cerca qualsiasi luogo nel mondo: si aggiunge alla mappa e si sincronizza in tempo reale tra tutti i dispositivi!
        </p>

        {/* Sync Status Button - Exact same as LoveNotes */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              color: 'var(--accent-rose)',
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Cloud size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Sincronizzo Luoghi...' : 'Sincronizza Luoghi con il Cloud ☁️'}
          </button>
          {syncStatus && (
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
              {syncStatus}
            </span>
          )}
        </div>
      </div>

      {/* Prominent Automatic Place Search Box */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', position: 'relative' }}>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={20} color="var(--accent-blush)" /> Ricerca Automatica del Luogo 🔍
        </h4>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Scrivi il nome di una città, ristorante, parco o via (es. Colosseo Roma, Firenze...)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />

          {isSearching && (
            <div style={{ position: 'absolute', right: '16px', top: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Ricerca...
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="glass-card" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 100,
              marginTop: '6px',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-glow)',
              maxHeight: '250px',
              overflowY: 'auto'
            }}>
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSearchResult(res)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <MapPin size={16} color="var(--accent-rose)" />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {res.properties.name || res.properties.street || res.properties.city}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {[res.properties.city, res.properties.state, res.properties.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Form */}
        {showAddForm && selectedSearchResult && (
          <form onSubmit={handleAddPlace} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255, 77, 109, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-rose)', fontWeight: 600 }}>
              📍 Luogo Selezionato: {selectedSearchResult.name}
            </div>

            <select
              value={newPlaceCategory}
              onChange={(e) => setNewPlaceCategory(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="Primo Incontro">Primo Incontro 💖</option>
              <option value="Primo Bacio">Primo Bacio 💋</option>
              <option value="Primo Viaggio">Primo Viaggio ✈️</option>
              <option value="Posto del Cuore">Posto del Cuore ✨</option>
              <option value="Ristorante Preferito">Ristorante Preferito 🍝</option>
            </select>

            <input
              type="text"
              placeholder="Aggiungi una nota o ricordo per questo posto..."
              value={newPlaceNotes}
              onChange={(e) => setNewPlaceNotes(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            />

            <button
              type="submit"
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} /> Salva & Sincronizza Luogo sulla Mappa ☁️
            </button>
          </form>
        )}
      </div>

      {/* Main Interactive Map & Places Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Map Embed Frame */}
        <div className="glass-card" style={{ height: '420px', padding: 0, overflow: 'hidden', position: 'relative' }}>
          {selectedPlace ? (
            <iframe
              title="Interactive Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPlace.lon - 0.02}%2C${selectedPlace.lat - 0.02}%2C${selectedPlace.lon + 0.02}%2C${selectedPlace.lat + 0.02}&layer=mapnik&marker=${selectedPlace.lat}%2C${selectedPlace.lon}`}
              style={{ border: 0 }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Nessun luogo ancora selezionato
            </div>
          )}
        </div>

        {/* Places List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
          {places.map((place) => (
            <div
              key={place.id}
              className="glass-card"
              onClick={() => setSelectedPlace(place)}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                borderLeft: selectedPlace?.id === place.id ? '4px solid var(--accent-blush)' : 'none',
                position: 'relative'
              }}
            >
              <button
                onClick={(e) => deletePlace(place.id, e)}
                title="Elimina luogo"
                style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <MapPin size={18} color="var(--accent-rose)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{place.name}</h4>
              </div>

              <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontWeight: 600, display: 'inline-block', marginBottom: '6px' }}>
                {place.category}
              </span>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{place.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

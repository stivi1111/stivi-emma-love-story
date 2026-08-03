import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Plus, X, Sparkles, Trash2, Cloud } from 'lucide-react';
import { saveAndSyncCloud, pullFromCloud, registerDeletedId } from '../utils/cloudSync';

export default function StoryTimeline() {
  const [timelineItems, setTimelineItems] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_timeline');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const [newItem, setNewItem] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    tag: 'Ricordo Reale'
  });

  // Exact LoveNotes sync pattern
  useEffect(() => {
    const handleCloudSynced = () => {
      const saved = localStorage.getItem('stivi_emma_real_timeline');
      if (saved) {
        setTimelineItems(JSON.parse(saved));
      }
    };
    window.addEventListener('stivi_emma_cloud_synced', handleCloudSynced);
    return () => window.removeEventListener('stivi_emma_cloud_synced', handleCloudSynced);
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizzazione ricordi in corso...');
    const res = await pullFromCloud();
    if (res.data && res.data.timeline) {
      setTimelineItems(res.data.timeline);
      setSyncStatus('Ricordi Sincronizzati! ☁️✨');
    }
    setIsSyncing(false);
    setTimeout(() => setSyncStatus(''), 3000);
  };

  const handleAddTimelineItem = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.description) return;

    const itemToAdd = {
      id: Date.now(),
      ...newItem
    };

    const updated = [itemToAdd, ...timelineItems];
    setTimelineItems(updated);
    setNewItem({ title: '', date: '', location: '', description: '', tag: 'Ricordo Reale' });
    setShowAddModal(false);

    setIsSyncing(true);
    await saveAndSyncCloud('stivi_emma_real_timeline', updated);
    setIsSyncing(false);
    setSyncStatus('Ricordo Salvato e Sincronizzato! ☁️💖');
    setTimeout(() => setSyncStatus(''), 3000);
  };

  const deleteItem = async (id, e) => {
    if (e) e.stopPropagation();
    registerDeletedId(id);
    const updated = timelineItems.filter(item => item.id !== id);
    setTimelineItems(updated);
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
    }
    await saveAndSyncCloud('stivi_emma_real_timeline', updated);
  };

  return (
    <section id="timeline" style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
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
          <Sparkles size={16} /> I Vostri Ricordi Veri Sincronizzati ☁️
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          <span className="gradient-text font-serif">La Nostra Storia Reale</span> <span className="emoji-color">📖💖</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Inserisci le tappe ed i momenti reali: compaiono in automatico su tutti i dispositivi!
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
            {isSyncing ? 'Sincronizzo Ricordi...' : 'Sincronizza Ricordi con il Cloud ☁️'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
              color: '#ffffff',
              border: 'none',
              padding: '8px 22px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Plus size={16} /> Inserisci Tappa ✍️
          </button>
        </div>
        {syncStatus && (
          <div style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
            {syncStatus}
          </div>
        )}
      </div>

      {/* Timeline Stream */}
      {timelineItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Heart size={40} color="var(--accent-blush)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Nessuna tappa ancora inserita</h4>
          <p style={{ fontSize: '0.95rem' }}>Clicca sul pulsante qui sopra per aggiungere il vostro primo ricordo (es. dove vi siete conosciuti, il primo viaggio insieme, ecc.)</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          <div style={{
            position: 'absolute',
            left: '28px',
            top: '20px',
            bottom: '20px',
            width: '3px',
            background: 'linear-gradient(to bottom, var(--accent-blush), var(--accent-gold-soft))',
            borderRadius: '2px'
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {timelineItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 2,
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  <Heart size={18} fill="#ffffff" color="#ffffff" />
                </div>

                <div
                  className="glass-card"
                  onClick={() => setSelectedItem(item)}
                  style={{
                    flex: 1,
                    padding: '24px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={(e) => deleteItem(item.id, e)}
                    title="Elimina questo ricordo"
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

                  <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                    {item.date && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {item.date}
                      </span>
                    )}
                    {item.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {item.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Real Timeline Modal */}
      {showAddModal && (
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
          <form onSubmit={handleAddTimelineItem} className="glass-card" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            background: 'var(--bg-card)'
          }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
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
              Inserisci un Ricordo Reale 📖
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                placeholder="Titolo (es. Il nostro primo viaggio a Roma)"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                required
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Data reale (es. 12 Maggio 2024)"
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
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
                  placeholder="Luogo (es. Firenze)"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <textarea
                placeholder="Cosa è successo quel giorno ed i dettagli veri..."
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                required
                rows={4}
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
                Salva & Sincronizza Ricordo 💖☁️
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

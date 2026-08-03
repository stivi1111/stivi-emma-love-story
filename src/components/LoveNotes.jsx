import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Send, Trash2, Cloud } from 'lucide-react';
import { saveAndSyncCloud, pullFromCloud } from '../utils/cloudSync';

export default function LoveNotes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [newAuthor, setNewAuthor] = useState('Stivi');
  const [newText, setNewText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // Listen to live cloud sync events and update state immediately
  useEffect(() => {
    const handleCloudSynced = () => {
      const saved = localStorage.getItem('stivi_emma_real_notes');
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    };

    window.addEventListener('stivi_emma_cloud_synced', handleCloudSynced);
    return () => window.removeEventListener('stivi_emma_cloud_synced', handleCloudSynced);
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizzazione in corso...');
    const res = await pullFromCloud();
    if (res.data && res.data.notes) {
      setNotes(res.data.notes);
      setSyncStatus('Sincronizzato col Cloud! ☁️✨');
    }
    setIsSyncing(false);
    setTimeout(() => setSyncStatus(''), 3000);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const noteObj = {
      id: Date.now(),
      author: newAuthor,
      text: newText.trim(),
      date: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updatedNotes = [noteObj, ...notes];
    setNotes(updatedNotes);
    setNewText('');

    setIsSyncing(true);
    await saveAndSyncCloud('stivi_emma_real_notes', updatedNotes);
    setIsSyncing(false);
    setSyncStatus('Pubblicato & Sincronizzato! ☁️💖');
    setTimeout(() => setSyncStatus(''), 3000);
  };

  const deleteNote = async (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    await saveAndSyncCloud('stivi_emma_real_notes', updated);
  };

  return (
    <section id="notes" style={{ padding: '60px 24px', maxWidth: '900px', margin: '0 auto' }}>
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
          <Sparkles size={16} /> I Vostri Pensieri Veri • Sincronizzati PC & Cellulare ☁️
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          <span className="gradient-text font-serif">Note & Dediche d'Amore</span> <span className="emoji-color">💌💖</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Scrivetevi messaggi e dediche reali: si sincronizzano automaticamente tra PC, iPhone ed Android!
        </p>

        {/* Sync Status Button */}
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
            {isSyncing ? 'Sincronizzo...' : 'Sincronizza con il Cloud ☁️'}
          </button>
          {syncStatus && (
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
              {syncStatus}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Add Real Note Form */}
        <form onSubmit={handleAddNote} className="glass-card" style={{ padding: '28px' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Scrivi una nuova dedica reale <span className="emoji-color">✍️</span>
          </h4>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', maxWidth: '360px' }}>
            <button
              type="button"
              onClick={() => setNewAuthor('Stivi')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: newAuthor === 'Stivi' ? 'var(--accent-blush)' : 'var(--bg-primary)',
                color: newAuthor === 'Stivi' ? '#ffffff' : 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Da Stivi <span className="emoji-color">🧑</span>
            </button>
            <button
              type="button"
              onClick={() => setNewAuthor('Emma')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: newAuthor === 'Emma' ? 'var(--accent-blush)' : 'var(--bg-primary)',
                color: newAuthor === 'Emma' ? '#ffffff' : 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Da Emma <span className="emoji-color">👩</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Scrivi qui il vostro messaggio vero..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={isSyncing}
              style={{
                padding: '14px 28px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Send size={18} /> Invia & Sincronizza ☁️
            </button>
          </div>
        </form>

        {/* Submitted Notes Stream */}
        {notes.length === 0 ? (
          <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nessun messaggio ancora presente. Scrivete qui la vostra prima dedica d'amore!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {notes.map((note) => (
              <div key={note.id} className="glass-card" style={{ padding: '20px 24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-rose)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={16} fill="var(--accent-blush)" /> {note.author}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{note.date}</span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      title="Elimina nota"
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="font-handwriting" style={{ color: 'var(--text-primary)', fontSize: '1.6rem', lineHeight: 1.4 }}>
                  "{note.text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

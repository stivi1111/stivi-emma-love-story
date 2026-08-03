import React, { useState, useEffect } from 'react';
import { Heart, Upload, Sparkles, X, Trash2, Link as LinkIcon, Cloud } from 'lucide-react';
import { saveAndSyncCloud, pullFromCloud, registerDeletedId } from '../utils/cloudSync';
import { compressImage } from '../utils/imageCompressor';

export default function PhotoGallery() {
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_photos');
    return saved ? JSON.parse(saved) : [];
  });

  const [activePhoto, setActivePhoto] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);

  // Exact LoveNotes pattern: Listen to live cloud sync events and update state immediately
  useEffect(() => {
    const handleCloudSynced = () => {
      const saved = localStorage.getItem('stivi_emma_real_photos');
      if (saved) {
        setPhotos(JSON.parse(saved));
      }
    };

    window.addEventListener('stivi_emma_cloud_synced', handleCloudSynced);
    return () => window.removeEventListener('stivi_emma_cloud_synced', handleCloudSynced);
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizzazione foto in corso...');
    const res = await pullFromCloud();
    if (res.data && res.data.photos) {
      setPhotos(res.data.photos);
      setSyncStatus('Foto Sincronizzate! ☁️✨');
    }
    setIsSyncing(false);
    setTimeout(() => setSyncStatus(''), 3000);
  };

  const toggleLike = async (photoId, e) => {
    if (e) e.stopPropagation();
    const updated = photos.map(p => {
      if (p.id === photoId) {
        const isLiked = p.isLiked;
        return {
          ...p,
          isLiked: !isLiked,
          likes: isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    });
    setPhotos(updated);
    await saveAndSyncCloud('stivi_emma_real_photos', updated);
  };

  const deletePhoto = async (photoId, e) => {
    if (e) e.stopPropagation();
    registerDeletedId(photoId);
    const updated = photos.filter(p => p.id !== photoId);
    setPhotos(updated);
    if (activePhoto && activePhoto.id === photoId) {
      setActivePhoto(null);
    }
    await saveAndSyncCloud('stivi_emma_real_photos', updated);
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsSyncing(true);
    setSyncStatus('Ottimizzazione ed invio al Cloud...');
    const fileList = Array.from(files);
    const newPhotoItems = [];

    for (const file of fileList) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const compressedUrl = await compressImage(file);
        const newPhoto = {
          id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          title: file.name.replace(/\.[^/.]+$/, "") || 'Foto Stivi & Emma',
          url: compressedUrl,
          caption: 'La nostra foto reale 💖',
          likes: 1,
          isLiked: true
        };
        newPhotoItems.push(newPhoto);
      } catch (err) {
        console.log('Image compression error:', err);
      }
    }

    if (newPhotoItems.length > 0) {
      const updatedPhotos = [...newPhotoItems, ...photos];
      setPhotos(updatedPhotos);
      await saveAndSyncCloud('stivi_emma_real_photos', updatedPhotos);
      setSyncStatus('Foto Caricate e Sincronizzate! ☁️💖');
      setTimeout(() => setSyncStatus(''), 3000);
    }
    setIsSyncing(false);
  };

  const handleAddPhotoByUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const newPhoto = {
      id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: urlTitle.trim() || 'Foto Stivi & Emma',
      url: urlInput.trim(),
      caption: 'La nostra foto reale 💖',
      likes: 1,
      isLiked: true
    };

    const updatedPhotos = [newPhoto, ...photos];
    setPhotos(updatedPhotos);
    setUrlInput('');
    setUrlTitle('');
    setShowUrlModal(false);

    setIsSyncing(true);
    await saveAndSyncCloud('stivi_emma_real_photos', updatedPhotos);
    setIsSyncing(false);
    setSyncStatus('Foto Pubblicata e Sincronizzata! ☁️💖');
    setTimeout(() => setSyncStatus(''), 3000);
  };

  return (
    <section id="gallery" style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
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
          <Sparkles size={16} /> Le Vostre Foto Reali Sincronizzate ☁️
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          <span className="gradient-text font-serif">Galleria Fotografica</span> <span className="emoji-color">📸💖</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          Carica le foto vere dal cellulare o dal PC: si ottimizzano e sincronizzano all'istante dappertutto!
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
            {isSyncing ? 'Sincronizzo Foto...' : 'Sincronizza Foto con il Cloud ☁️'}
          </button>
          <button
            onClick={() => setShowUrlModal(true)}
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
            <LinkIcon size={16} /> Link Foto 🔗
          </button>
        </div>
        {syncStatus && (
          <div style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
            {syncStatus}
          </div>
        )}
      </div>

      {/* Prominent Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className="glass-card"
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          marginBottom: '36px',
          border: dragOver ? '2px dashed var(--accent-blush)' : '2px dashed var(--border-light)',
          background: dragOver ? 'rgba(255, 77, 109, 0.08)' : 'var(--bg-card)',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        onClick={() => document.getElementById('photo-input').click()}
      >
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255, 77, 109, 0.12)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-rose)',
          marginBottom: '14px'
        }}>
          <Upload size={28} className={isSyncing ? 'animate-spin' : ''} />
        </div>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          {isSyncing ? 'Ottimizzazione & Sincronizzazione Foto in corso...' : 'Carica foto dal dispositivo (Sincronizzate) ✨'}
        </h4>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Trascina le foto qui o clicca per caricarle dal tuo dispositivo
        </p>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.05rem' }}>Nessuna foto ancora caricata. Usa il riquadro qui sopra per inserire le prime foto di Stivi ed Emma!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="glass-card"
              onClick={() => setActivePhoto(photo)}
              style={{
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '230px', overflow: 'hidden' }}>
                <img
                  src={photo.url}
                  alt={photo.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Heart Like Button */}
                <button
                  onClick={(e) => toggleLike(photo.id, e)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(6px)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 12px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Heart size={16} fill={photo.isLiked ? 'var(--accent-blush)' : 'none'} color={photo.isLiked ? 'var(--accent-blush)' : '#ffffff'} />
                  <span>{photo.likes}</span>
                </button>

                {/* Delete Photo Button */}
                <button
                  onClick={(e) => deletePhoto(photo.id, e)}
                  title="Elimina foto"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(6px)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <h4 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {photo.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo by URL Modal */}
      {showUrlModal && (
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
          <form onSubmit={handleAddPhotoByUrl} className="glass-card" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            background: 'var(--bg-card)'
          }}>
            <button
              type="button"
              onClick={() => setShowUrlModal(false)}
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

            <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--accent-rose)' }}>
              Aggiungi Foto via URL Link 🔗
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                placeholder="Titolo della foto (es. Tramonto al mare)"
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              />
              <input
                type="url"
                placeholder="Incolla l'indirizzo web dell'immagine (http/https)..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                required
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
                  padding: '12px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--accent-blush), var(--accent-rose))',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Salva & Sincronizza Foto ☁️
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lightbox Viewer */}
      {activePhoto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: '20px'
        }}>
          <div style={{ maxWidth: '800px', width: '100%', position: 'relative', textAlign: 'center' }}>
            <button
              onClick={() => setActivePhoto(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <X size={32} />
            </button>

            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
            />

            <div style={{ marginTop: '16px', color: '#ffffff' }}>
              <h3 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: 700 }}>{activePhoto.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

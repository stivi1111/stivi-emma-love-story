import React, { useState, useEffect } from 'react';
import { Heart, Upload, Sparkles, X, Trash2 } from 'lucide-react';

export default function PhotoGallery() {
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_real_photos');
    return saved ? JSON.parse(saved) : [];
  });

  const [activePhoto, setActivePhoto] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    localStorage.setItem('stivi_emma_real_photos', JSON.stringify(photos));
  }, [photos]);

  const toggleLike = (photoId, e) => {
    if (e) e.stopPropagation();
    setPhotos(photos.map(p => {
      if (p.id === photoId) {
        const isLiked = p.isLiked;
        return {
          ...p,
          isLiked: !isLiked,
          likes: isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const deletePhoto = (photoId, e) => {
    if (e) e.stopPropagation();
    setPhotos(photos.filter(p => p.id !== photoId));
    if (activePhoto && activePhoto.id === photoId) {
      setActivePhoto(null);
    }
  };

  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: 'photo_' + Date.now() + Math.random().toString(36).substr(2, 4),
          title: file.name.replace(/\.[^/.]+$/, "") || 'Foto Stivi & Emma',
          url: e.target.result,
          caption: 'La nostra foto reale 💖',
          likes: 1,
          isLiked: true
        };
        setPhotos(prev => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    });
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
          <Sparkles size={16} /> Le Vostre Foto Reali
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          <span className="gradient-text font-serif">Galleria Fotografica</span> <span className="emoji-color">📸💖</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          Trascina o carica le vostre foto direttamente dal tuo dispositivo per creare l'album reale di Stivi ed Emma!
        </p>
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
          <Upload size={28} />
        </div>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Carica qui le foto vere di Stivi & Emma <span className="emoji-color">✨</span>
        </h4>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Trascina le foto qui o clicca per sfogliare i file dal tuo computer
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

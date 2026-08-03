import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoveCounter from './components/LoveCounter';
import StoryTimeline from './components/StoryTimeline';
import DateWheel from './components/DateWheel';
import MemoryMap from './components/MemoryMap';
import VirtualHug from './components/VirtualHug';
import UpcomingCountdowns from './components/UpcomingCountdowns';
import PhotoGallery from './components/PhotoGallery';
import LoveNotes from './components/LoveNotes';
import BucketList from './components/BucketList';
import FloatingHearts from './components/FloatingHearts';
import Footer from './components/Footer';
import { pullFullCloudPayload } from './utils/cloudSync';
import { Cloud, RefreshCw } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('stivi_emma_theme') || 'light';
  });

  const [startDate, setStartDate] = useState(() => {
    return localStorage.getItem('stivi_emma_start_date') || '2023-04-27';
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Adesso');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stivi_emma_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('stivi_emma_start_date', startDate);
  }, [startDate]);

  const triggerGlobalSync = async () => {
    setIsSyncing(true);
    await pullFullCloudPayload();
    setLastSyncTime(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setIsSyncing(false);
  };

  // Robust Mobile & Desktop Realtime Cloud Sync
  useEffect(() => {
    triggerGlobalSync();

    const interval = setInterval(triggerGlobalSync, 3000);

    const handleActive = () => {
      triggerGlobalSync();
    };

    window.addEventListener('focus', handleActive);
    window.addEventListener('pageshow', handleActive);
    window.addEventListener('online', handleActive);
    document.addEventListener('visibilitychange', handleActive);

    const handleCloudEvent = () => {
      const newStart = localStorage.getItem('stivi_emma_start_date');
      if (newStart) setStartDate(newStart);
    };

    window.addEventListener('stivi_emma_cloud_synced', handleCloudEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleActive);
      window.removeEventListener('pageshow', handleActive);
      window.removeEventListener('online', handleActive);
      window.removeEventListener('stivi_emma_cloud_synced', handleCloudEvent);
      document.removeEventListener('visibilitychange', handleActive);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <FloatingHearts />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Floating Cloud Sync Pill */}
      <button
        onClick={triggerGlobalSync}
        title="Clicca per sincronizzare subito con tutti i dispositivi"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-full)',
          padding: '10px 18px',
          color: 'var(--accent-rose)',
          boxShadow: 'var(--shadow-glow)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}
      >
        <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
        <span>{isSyncing ? 'Sincronizzo...' : `Cloud OK (${lastSyncTime})`}</span>
      </button>

      <main>
        <Hero startDate={startDate} setStartDate={setStartDate} />
        <LoveCounter startDate={startDate} />
        <StoryTimeline />
        <DateWheel />
        <MemoryMap />
        <VirtualHug />
        <UpcomingCountdowns />
        <PhotoGallery />
        <LoveNotes />
        <BucketList />
      </main>
      <Footer />
    </div>
  );
}

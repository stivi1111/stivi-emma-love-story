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

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('stivi_emma_theme') || 'light';
  });

  const [startDate, setStartDate] = useState(() => {
    return localStorage.getItem('stivi_emma_start_date') || '2023-04-27';
  });

  const [syncVersion, setSyncVersion] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stivi_emma_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('stivi_emma_start_date', startDate);
  }, [startDate]);

  // Zero-Cache Realtime Cloud Sync across PC, iPhone & Android (Polls every 2.5s + on Tab Focus)
  useEffect(() => {
    const handleSync = async () => {
      await pullFullCloudPayload();
    };

    handleSync();
    const interval = setInterval(handleSync, 2500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleSync();
      }
    };

    const handleCloudEvent = () => {
      setSyncVersion(v => v + 1);
      const newStart = localStorage.getItem('stivi_emma_start_date');
      if (newStart) setStartDate(newStart);
    };

    window.addEventListener('stivi_emma_cloud_synced', handleCloudEvent);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('stivi_emma_cloud_synced', handleCloudEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div key={syncVersion} style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <FloatingHearts />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
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

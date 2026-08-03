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
import { pullFromCloud } from './utils/cloudSync';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('stivi_emma_theme') || 'light';
  });

  const [startDate, setStartDate] = useState(() => {
    return localStorage.getItem('stivi_emma_start_date') || '2023-04-27';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stivi_emma_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('stivi_emma_start_date', startDate);
  }, [startDate]);

  // Global Auto Cloud Pull on App Startup across PC & Mobile
  useEffect(() => {
    const syncOnStart = async () => {
      await pullFromCloud();
    };
    syncOnStart();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
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

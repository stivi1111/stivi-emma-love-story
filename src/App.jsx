import React, { useState, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
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
import Footer from './components/Footer';

export default function App() {
  // Theme toggle state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('stivi_emma_theme') || 'light';
  });

  // Anniversary / Start date state: default 27 Aprile 2023 (2023-04-27)
  const [startDate, setStartDate] = useState(() => {
    const saved = localStorage.getItem('stivi_emma_start_date');
    if (!saved || saved === '2024-02-14') {
      localStorage.setItem('stivi_emma_start_date', '2023-04-27');
      return '2023-04-27';
    }
    return saved;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stivi_emma_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('stivi_emma_start_date', startDate);
  }, [startDate]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Ambient Floating Hearts Background */}
      <FloatingHearts />

      {/* Navigation Bar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

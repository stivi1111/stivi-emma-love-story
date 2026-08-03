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

  // Sound toggle state
  const [isSoundOn, setIsSoundOn] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stivi_emma_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('stivi_emma_start_date', startDate);
  }, [startDate]);

  // Ambient Web Audio Synthesizer toggle
  useEffect(() => {
    if (!isSoundOn) return;

    let audioCtx;
    let osc;
    let gainNode;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      osc = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
    } catch (e) {
      console.log('Audio init failed:', e);
    }

    return () => {
      if (osc) osc.stop();
      if (audioCtx) audioCtx.close();
    };
  }, [isSoundOn]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSound = () => {
    setIsSoundOn(prev => !prev);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Ambient Floating Hearts Background */}
      <FloatingHearts />

      {/* Navigation Bar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isSoundOn={isSoundOn}
        toggleSound={toggleSound}
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

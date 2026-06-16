'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Globe3D from '@/components/Globe3D';
import CommandCenter from '@/components/CommandCenter';
import SatelliteTracker from '@/components/SatelliteTracker';
import ConflictMonitor from '@/components/ConflictMonitor';
import AircraftTracker from '@/components/AircraftTracker';
import MaritimeTracker from '@/components/MaritimeTracker';
import CyberMonitor from '@/components/CyberMonitor';
import AIAnalyst from '@/components/AIAnalyst';
import Footer from '@/components/Footer';
import { Globe, Satellite, Crosshair, Plane, Ship, Shield, Brain, ChevronDown, ChevronUp, Activity } from 'lucide-react';

type Section = 'globe' | 'command' | 'satellite' | 'conflict' | 'aircraft' | 'maritime' | 'cyber' | 'ai';

interface SectionConfig {
  id: Section;
  title: string;
  icon: React.ElementType;
  color: string;
  component: React.ReactNode;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('globe');
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections: SectionConfig[] = [
    { id: 'globe', title: '3D EARTH GLOBE', icon: Globe, color: 'text-x7-blue', component: <Globe3D /> },
    { id: 'command', title: 'COMMAND CENTER', icon: Activity, color: 'text-x7-military', component: <CommandCenter /> },
    { id: 'satellite', title: 'SATELLITE TRACKING', icon: Satellite, color: 'text-x7-blue', component: <SatelliteTracker /> },
    { id: 'conflict', title: 'CONFLICT MONITOR', icon: Crosshair, color: 'text-x7-red', component: <ConflictMonitor /> },
    { id: 'aircraft', title: 'AIRCRAFT INTELLIGENCE', icon: Plane, color: 'text-x7-orange', component: <AircraftTracker /> },
    { id: 'maritime', title: 'MARITIME WATCH', icon: Ship, color: 'text-x7-military', component: <MaritimeTracker /> },
    { id: 'cyber', title: 'CYBER WARFARE', icon: Shield, color: 'text-x7-red', component: <CyberMonitor /> },
    { id: 'ai', title: 'AI STRATEGIC ANALYST', icon: Brain, color: 'text-x7-military', component: <AIAnalyst /> },
  ];

  const scrollToSection = (id: Section) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-x7-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-x7-blue/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-t-x7-blue rounded-full animate-spin" />
            <div className="absolute inset-4 border-2 border-x7-military/20 rounded-full" />
            <div className="absolute inset-4 border-2 border-b-x7-military rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
            <Globe className="absolute inset-0 m-auto w-8 h-8 text-x7-blue animate-pulse" />
          </div>
          <h1 className="font-display text-2xl tracking-wider text-white mb-2">
            X7 <span className="text-x7-blue">GEOINT</span>
          </h1>
          <p className="text-sm font-mono text-x7-text-muted animate-pulse">
            INITIALIZING COMMAND CENTER...
          </p>
          <div className="mt-4 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-x7-blue rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <div className="mt-6 text-[10px] font-mono text-x7-text-muted space-y-1">
            <p>LOADING OSINT FEEDS...</p>
            <p>CONNECTING SATELLITE NETWORK...</p>
            <p>INITIALIZING AI ANALYTICS...</p>
            <p>ESTABLISHING SECURE CONNECTION...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-x7-black bg-grid-pattern">
      <Header />

      {/* Section Navigation */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`group relative p-2 rounded border transition-all ${
              activeSection === section.id
                ? 'bg-x7-blue/20 border-x7-blue'
                : 'bg-x7-dark/50 border-x7-border/30 hover:border-x7-blue/30'
            }`}
          >
            <section.icon className={`w-4 h-4 ${activeSection === section.id ? section.color : 'text-x7-text-muted'}`} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-x7-dark border border-x7-border/50 rounded text-[10px] font-mono text-x7-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {section.title}
            </span>
          </button>
        ))}
      </div>

      <main className="pt-16">
        {/* Hero / Globe Section */}
        <section id="globe" className="relative h-screen">
          <div className="absolute inset-0">
            <Globe3D />
          </div>

          {/* Hero Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
            <div className="max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h1 className="font-display text-4xl md:text-6xl font-bold tracking-wider mb-2">
                  <span className="text-white">X7</span>{' '}
                  <span className="text-x7-blue">GEOINT</span>
                </h1>
                <p className="text-lg font-mono text-x7-text-muted tracking-widest">
                  COMMAND CENTER
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-x7-text-muted">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  REAL-TIME INTELLIGENCE FEEDS ACTIVE
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-x7-text-muted">
                  <span className="w-2 h-2 bg-x7-blue rounded-full animate-pulse" />
                  24/7 GLOBAL MONITORING
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-x7-text-muted">
                  <span className="w-2 h-2 bg-x7-red rounded-full animate-pulse" />
                  AI-POWERED THREAT ANALYSIS
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => scrollToSection('command')}
                className="pointer-events-auto flex flex-col items-center gap-2 text-x7-text-muted hover:text-x7-blue transition-colors"
              >
                <span className="text-[10px] font-mono tracking-widest">ACCESS COMMAND CENTER</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </button>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="max-w-[1920px] mx-auto px-4 py-8 space-y-8">
          <section id="command">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-x7-military" />
              <h2 className="font-display text-lg tracking-wider text-x7-military">COMMAND CENTER</h2>
              <div className="flex-1 h-px bg-x7-border/30" />
            </div>
            <CommandCenter />
          </section>

          <section id="satellite">
            <div className="flex items-center gap-3 mb-4">
              <Satellite className="w-5 h-5 text-x7-blue" />
              <h2 className="font-display text-lg tracking-wider text-x7-blue">SATELLITE TRACKING CENTER</h2>
              <div className="flex-1 h-px bg-x7-border/30" />
            </div>
            <SatelliteTracker />
          </section>

          <section id="conflict">
            <div className="flex items-center gap-3 mb-4">
              <Crosshair className="w-5 h-5 text-x7-red" />
              <h2 className="font-display text-lg tracking-wider text-x7-red">GLOBAL CONFLICT MONITOR</h2>
              <div className="flex-1 h-px bg-x7-border/30" />
            </div>
            <ConflictMonitor />
          </section>

          <section id="aircraft">
            <div className="flex items-center gap-3 mb-4">
              <Plane className="w-5 h-5 text-x7-orange" />
              <h2 className="font-display text-lg tracking-wider text-x7-orange">LIVE AIRCRAFT INTELLIGENCE</h2>
              <div className="flex-1 h-px bg-x7-border/30" />
            </div>
            <AircraftTracker />
          </section>

          <section id="maritime">
            <div className="flex items-center gap-3 mb-4">
              <Ship className="w-5 h-5 text-x7-military" />
              <h2 className="font-display text-lg tracking-wider text-x7-military">MARITIME INTELLIGENCE</h2>
              <div className="flex-1 h-px bg-x7-border/30" />
            </div>
            <MaritimeTracker />
          </section>

          <section id="cyber">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-x7-red" />
              <h2 className="font-display text-lg tracking-wider text-x7-red">CYBER WARFARE MONITOR</h2>
              <div className="flex-1 h-px bg-x7-border/30" />
            </div>
            <CyberMonitor />
          </section>

          <section id="ai">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-x7-military" />
              <h2 className="font-display text-lg tracking-wider text-x7-military">X7 STRATEGIC AI ANALYST</h2>
              <div className="flex-1 h-px bg-x7-border/30" />
            </div>
            <AIAnalyst />
          </section>
        </div>
      </main>

      <Footer />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-3 bg-x7-dark border border-x7-border/50 rounded hover:border-x7-blue/50 transition-colors"
          >
            <ChevronUp className="w-5 h-5 text-x7-blue" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

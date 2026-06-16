'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, AlertTriangle, Bell, Menu, X, Radio, Clock, Activity } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [systemStatus, setSystemStatus] = useState('ONLINE');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'COMMAND CENTER', href: '#', active: true },
    { name: 'SATELLITE', href: '#satellite' },
    { name: 'CONFLICT', href: '#conflict' },
    { name: 'AIRCRAFT', href: '#aircraft' },
    { name: 'MARITIME', href: '#maritime' },
    { name: 'CYBER', href: '#cyber' },
    { name: 'ANALYTICS', href: '#analytics' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-x7-black/95 backdrop-blur-xl border-b border-x7-border/50">
      <div className="scan-overlay">
        <div className="scan-line" />
      </div>

      <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Globe className="w-8 h-8 text-x7-blue" />
            <div className="absolute inset-0 bg-x7-blue/20 blur-lg rounded-full" />
          </div>
          <div>
            <h1 className="font-display text-lg tracking-wider text-white">
              X7 <span className="text-x7-blue">GEOINT</span>
            </h1>
            <p className="text-[10px] font-mono text-x7-text-muted tracking-widest">
              COMMAND CENTER v2.4.1
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`px-4 py-2 text-xs font-mono tracking-wider transition-all duration-300 border-b-2 ${
                item.active
                  ? 'text-x7-blue border-x7-blue bg-x7-blue/5'
                  : 'text-x7-text-muted border-transparent hover:text-x7-text hover:border-x7-border'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-x7-military/10 border border-x7-military/30 rounded">
            <Activity className="w-3 h-3 text-x7-military" />
            <span className="text-xs font-mono text-x7-military">{systemStatus}</span>
          </div>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-x7-text-muted">
            <Clock className="w-3 h-3" />
            <span>{formatDate(currentTime)} UTC</span>
          </div>

          {/* Radio Status */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-x7-blue animate-pulse" />
            <span className="text-[10px] font-mono text-x7-blue">LIVE FEED</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-x7-gray/50 rounded transition-colors">
            <Bell className="w-5 h-5 text-x7-text-muted" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-x7-red text-white text-[10px] font-mono rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Alert Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-x7-red/10 border border-x7-red/30 rounded animate-pulse">
            <AlertTriangle className="w-3 h-3 text-x7-red" />
            <span className="text-xs font-mono text-x7-red">ALERT LEVEL: ORANGE</span>
          </div>

          {/* Mobile Menu */}
          <button
            className="lg:hidden p-2 hover:bg-x7-gray/50 rounded transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-x7-dark border-t border-x7-border/50 overflow-hidden"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-sm font-mono tracking-wider transition-colors ${
                    item.active
                      ? 'text-x7-blue bg-x7-blue/5 border-l-2 border-x7-blue'
                      : 'text-x7-text-muted hover:text-x7-text hover:bg-x7-gray/30'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

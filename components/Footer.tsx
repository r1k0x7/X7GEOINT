'use client';

import { Globe, Shield, Radio, Activity, Clock, Database, Server, Wifi } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-x7-border/50 bg-x7-black/95 backdrop-blur-xl">
      <div className="max-w-[1920px] mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Status */}
          <div className="flex items-center gap-6 text-[10px] font-mono text-x7-text-muted">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-green-400" />
              <span>SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-x7-blue" />
              <span>OSINT FEEDS: 24/24</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-3 h-3 text-x7-military" />
              <span>REDIS CACHE: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-x7-orange" />
              <span>WS: CONNECTED</span>
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-x7-blue" />
            <span className="text-xs font-display tracking-wider text-x7-text-muted">
              X7 <span className="text-x7-blue">GEOINT</span> COMMAND CENTER
            </span>
          </div>

          {/* Right - Version */}
          <div className="text-[10px] font-mono text-x7-text-muted">
            v2.4.1 | BUILD 2026.06.16 | CLASSIFIED // NOFORN
          </div>
        </div>
      </div>
    </footer>
  );
}


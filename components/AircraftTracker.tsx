'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Radar, MapPin, ArrowUp, Gauge, Radio, Navigation, Crosshair, Filter, Eye, Target } from 'lucide-react';
import { mockAircraft } from '@/lib/mock-data';
import type { AircraftData } from '@/types';

export default function AircraftTracker() {
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftData | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'Military', 'AWACS', 'Tanker', 'ISR', 'Drone', 'Commercial'];

  const filteredAircraft = categoryFilter === 'ALL'
    ? mockAircraft
    : mockAircraft.filter(a => a.category === categoryFilter);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AWACS': return <Radar className="w-4 h-4 text-x7-blue" />;
      case 'Tanker': return <ArrowUp className="w-4 h-4 text-x7-military" />;
      case 'ISR': return <Eye className="w-4 h-4 text-x7-orange" />;
      case 'Drone': return <Crosshair className="w-4 h-4 text-x7-red" />;
      case 'Military': return <Target className="w-4 h-4 text-x7-red" />;
      default: return <Plane className="w-4 h-4 text-x7-text-muted" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Aircraft Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-4 h-4 text-x7-blue" />
            <span className="text-[10px] font-mono text-x7-text-muted">TRACKED</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-blue">12,453</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-x7-red" />
            <span className="text-[10px] font-mono text-x7-text-muted">MILITARY</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-red">1,247</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-x7-orange" />
            <span className="text-[10px] font-mono text-x7-text-muted">ISR/DRONE</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-orange">342</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Radar className="w-4 h-4 text-x7-military" />
            <span className="text-[10px] font-mono text-x7-text-muted">AWACS</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-military">18</p>
        </div>
      </div>

      <div className="hud-panel p-4">
        <div className="hud-title">AIRCRAFT INTELLIGENCE</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 text-xs font-mono border rounded transition-all ${
                categoryFilter === c
                  ? 'bg-x7-blue/20 border-x7-blue text-x7-blue'
                  : 'bg-x7-gray/20 border-x7-border/30 text-x7-text-muted hover:border-x7-blue/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Aircraft List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredAircraft.map((ac, i) => (
              <motion.div
                key={ac.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedAircraft(ac)}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedAircraft?.id === ac.id
                    ? 'bg-x7-blue/10 border-x7-blue/50'
                    : 'bg-x7-gray/10 border-x7-border/30 hover:bg-x7-gray/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(ac.category)}
                    <div>
                      <p className="text-xs font-mono text-x7-text">{ac.callsign}</p>
                      <p className="text-[10px] font-mono text-x7-text-muted">{ac.type}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    ac.category === 'Military' || ac.category === 'Drone' || ac.category === 'ISR'
                      ? 'bg-x7-red/20 text-x7-red'
                      : 'bg-x7-blue/20 text-x7-blue'
                  }`}>
                    {ac.category.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-x7-text-muted">
                  <div>ALT: {ac.altitude.toLocaleString()}ft</div>
                  <div>SPD: {ac.speed}kts</div>
                  <div>HDG: {ac.heading}°</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Aircraft Detail */}
          <div className="hud-panel p-4">
            <div className="hud-title">AIRCRAFT DETAILS</div>
            {selectedAircraft ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  {getCategoryIcon(selectedAircraft.category)}
                  <div>
                    <h3 className="text-sm font-mono text-x7-text">{selectedAircraft.callsign}</h3>
                    <p className="text-xs font-mono text-x7-text-muted">{selectedAircraft.type} | {selectedAircraft.country}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">CALLSIGN</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedAircraft.callsign}</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">SQUAWK</p>
                    <p className="text-sm font-mono text-x7-orange">{selectedAircraft.squawk}</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">LATITUDE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedAircraft.latitude.toFixed(4)}°</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">LONGITUDE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedAircraft.longitude.toFixed(4)}°</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">ALTITUDE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedAircraft.altitude.toLocaleString()} ft</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">SPEED</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedAircraft.speed} kts</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">HEADING</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedAircraft.heading}°</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">CATEGORY</p>
                    <p className="text-sm font-mono text-x7-orange">{selectedAircraft.category.toUpperCase()}</p>
                  </div>
                </div>

                <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                  <p className="text-[10px] font-mono text-x7-text-muted mb-1">ROUTE</p>
                  <p className="text-sm font-mono text-x7-text">{selectedAircraft.origin} → {selectedAircraft.destination}</p>
                </div>

                <button className="w-full py-2 bg-x7-blue/20 border border-x7-blue text-x7-blue text-xs font-mono rounded hover:bg-x7-blue/30 transition-all">
                  TRACK AIRCRAFT
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-x7-text-muted">
                <p className="text-sm font-mono">SELECT AIRCRAFT</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

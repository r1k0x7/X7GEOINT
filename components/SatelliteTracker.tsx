'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Orbit, Radio, Crosshair, Clock, MapPin, Activity, ArrowUpRight, Eye } from 'lucide-react';
import { mockSatellites } from '@/lib/mock-data';
import type { SatelliteData } from '@/types';

export default function SatelliteTracker() {
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [trackingMode, setTrackingMode] = useState(false);

  const filters = ['ALL', 'ISS', 'Starlink', 'Military', 'Spy', 'Weather', 'Navigation'];

  const filteredSatellites = filter === 'ALL' 
    ? mockSatellites 
    : mockSatellites.filter(s => s.type === filter);

  const getSatelliteIcon = (type: string) => {
    switch (type) {
      case 'ISS': return <Radio className="w-4 h-4 text-x7-blue" />;
      case 'Starlink': return <Satellite className="w-4 h-4 text-x7-blue" />;
      case 'Military': return <Crosshair className="w-4 h-4 text-x7-red" />;
      case 'Spy': return <Eye className="w-4 h-4 text-x7-orange" />;
      case 'Weather': return <Activity className="w-4 h-4 text-yellow-400" />;
      case 'Navigation': return <MapPin className="w-4 h-4 text-x7-military" />;
      default: return <Satellite className="w-4 h-4 text-x7-text-muted" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Satellite Filters */}
      <div className="hud-panel p-4">
        <div className="hud-title">SATELLITE TRACKING CENTER</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-mono border rounded transition-all ${
                filter === f
                  ? 'bg-x7-blue/20 border-x7-blue text-x7-blue'
                  : 'bg-x7-gray/20 border-x7-border/30 text-x7-text-muted hover:border-x7-blue/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Satellite List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredSatellites.map((sat, i) => (
              <motion.div
                key={sat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedSatellite(sat)}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedSatellite?.id === sat.id
                    ? 'bg-x7-blue/10 border-x7-blue/50'
                    : 'bg-x7-gray/10 border-x7-border/30 hover:bg-x7-gray/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSatelliteIcon(sat.type)}
                    <div>
                      <p className="text-xs font-mono text-x7-text">{sat.name}</p>
                      <p className="text-[10px] font-mono text-x7-text-muted">{sat.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      sat.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {sat.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono text-x7-text-muted">
                  <div>ALT: {sat.altitude}km</div>
                  <div>VEL: {(sat.velocity / 1000).toFixed(1)}km/s</div>
                  <div>INC: {sat.inclination}°</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Satellite Detail */}
          <div className="hud-panel p-4">
            <div className="hud-title">SATELLITE DETAILS</div>
            {selectedSatellite ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  {getSatelliteIcon(selectedSatellite.type)}
                  <div>
                    <h3 className="text-sm font-mono text-x7-text">{selectedSatellite.name}</h3>
                    <p className="text-xs font-mono text-x7-text-muted">{selectedSatellite.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">LATITUDE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedSatellite.latitude.toFixed(4)}°</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">LONGITUDE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedSatellite.longitude.toFixed(4)}°</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">ALTITUDE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedSatellite.altitude} km</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">VELOCITY</p>
                    <p className="text-sm font-mono text-x7-blue">{(selectedSatellite.velocity / 1000).toFixed(2)} km/s</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">ORBIT PERIOD</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedSatellite.orbitPeriod} min</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">INCLINATION</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedSatellite.inclination}°</p>
                  </div>
                </div>

                <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                  <p className="text-[10px] font-mono text-x7-text-muted mb-1">NEXT PASS</p>
                  <p className="text-sm font-mono text-x7-orange">{selectedSatellite.nextPass}</p>
                </div>

                <button 
                  onClick={() => setTrackingMode(!trackingMode)}
                  className={`w-full py-2 text-xs font-mono border rounded transition-all ${
                    trackingMode 
                      ? 'bg-x7-red/20 border-x7-red text-x7-red' 
                      : 'bg-x7-blue/20 border-x7-blue text-x7-blue hover:bg-x7-blue/30'
                  }`}
                >
                  {trackingMode ? 'STOP TRACKING' : 'INITIATE TRACKING'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-x7-text-muted">
                <p className="text-sm font-mono">SELECT SATELLITE TO VIEW DETAILS</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orbit Visualization Placeholder */}
      <div className="hud-panel p-4">
        <div className="hud-title">ORBIT VISUALIZATION</div>
        <div className="relative h-64 bg-x7-black border border-x7-border/30 rounded overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-x7-blue/30 relative">
              <div className="absolute inset-2 rounded-full border border-x7-military/20" />
              <div className="absolute inset-4 rounded-full border border-x7-orange/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-x7-blue rounded-full shadow-[0_0_20px_rgba(0,212,255,0.5)]" />
              {/* Orbiting dots */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-x7-red rounded-full animate-pulse" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-green-400 rounded-full" />
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-x7-orange rounded-full" />
            </div>
          </div>
          <div className="absolute top-2 left-2 text-[10px] font-mono text-x7-text-muted">
            <div>LEO: 200-2000km</div>
            <div>MEO: 2000-35786km</div>
            <div>GEO: 35786km</div>
          </div>
          <div className="absolute bottom-2 right-2 flex gap-2 text-[10px] font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-x7-blue rounded-full" /> ISS</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-x7-red rounded-full" /> SPY</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full" /> GPS</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-x7-orange rounded-full" /> MIL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

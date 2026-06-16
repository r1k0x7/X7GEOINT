'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ship, Anchor, Navigation, MapPin, Gauge, Radio, AlertTriangle, Crosshair, Waves, Route } from 'lucide-react';
import { mockVessels } from '@/lib/mock-data';
import type { VesselData } from '@/types';

export default function MaritimeTracker() {
  const [selectedVessel, setSelectedVessel] = useState<VesselData | null>(null);
  const [typeFilter, setTypeFilter] = useState('ALL');

  const types = ['ALL', 'Aircraft Carrier', 'Destroyer', 'Submarine', 'Tanker', 'LNG', 'Cargo'];
  const chokepoints = [
    { name: 'Strait of Hormuz', status: 'HIGH TRAFFIC', color: 'text-x7-orange' },
    { name: 'Malacca Strait', status: 'NORMAL', color: 'text-x7-military' },
    { name: 'Bab el-Mandeb', status: 'RESTRICTED', color: 'text-x7-red' },
    { name: 'Suez Canal', status: 'NORMAL', color: 'text-x7-military' },
    { name: 'Panama Canal', status: 'NORMAL', color: 'text-x7-military' },
  ];

  const filteredVessels = typeFilter === 'ALL'
    ? mockVessels
    : mockVessels.filter(v => v.type === typeFilter);

  const getVesselIcon = (type: string) => {
    switch (type) {
      case 'Aircraft Carrier': return <Ship className="w-4 h-4 text-x7-red" />;
      case 'Destroyer': return <Crosshair className="w-4 h-4 text-x7-red" />;
      case 'Submarine': return <Waves className="w-4 h-4 text-x7-blue" />;
      case 'Tanker': return <Gauge className="w-4 h-4 text-x7-orange" />;
      case 'LNG': return <Anchor className="w-4 h-4 text-yellow-400" />;
      default: return <Ship className="w-4 h-4 text-x7-text-muted" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Maritime Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Ship className="w-4 h-4 text-x7-blue" />
            <span className="text-[10px] font-mono text-x7-text-muted">TRACKED</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-blue">89,342</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair className="w-4 h-4 text-x7-red" />
            <span className="text-[10px] font-mono text-x7-text-muted">WARSHIPS</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-red">1,847</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Anchor className="w-4 h-4 text-x7-orange" />
            <span className="text-[10px] font-mono text-x7-text-muted">TANKERS</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-orange">12,453</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-mono text-x7-text-muted">ALERTS</span>
          </div>
          <p className="text-2xl font-display font-bold text-yellow-400">23</p>
        </div>
      </div>

      {/* Chokepoint Monitor */}
      <div className="hud-panel p-4">
        <div className="hud-title">CHOKEPOINT MONITOR</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {chokepoints.map((cp) => (
            <div key={cp.name} className="p-3 bg-x7-gray/20 border border-x7-border/30 rounded text-center">
              <p className="text-[10px] font-mono text-x7-text-muted mb-1">{cp.name.toUpperCase()}</p>
              <p className={`text-xs font-mono font-bold ${cp.color}`}>{cp.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hud-panel p-4">
        <div className="hud-title">MARITIME INTELLIGENCE</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-mono border rounded transition-all ${
                typeFilter === t
                  ? 'bg-x7-military/20 border-x7-military text-x7-military'
                  : 'bg-x7-gray/20 border-x7-border/30 text-x7-text-muted hover:border-x7-military/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Vessel List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredVessels.map((vessel, i) => (
              <motion.div
                key={vessel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedVessel(vessel)}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedVessel?.id === vessel.id
                    ? 'bg-x7-military/10 border-x7-military/50'
                    : 'bg-x7-gray/10 border-x7-border/30 hover:bg-x7-gray/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getVesselIcon(vessel.type)}
                    <div>
                      <p className="text-xs font-mono text-x7-text">{vessel.name}</p>
                      <p className="text-[10px] font-mono text-x7-text-muted">{vessel.type}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    vessel.type === 'Aircraft Carrier' || vessel.type === 'Destroyer' || vessel.type === 'Submarine'
                      ? 'bg-x7-red/20 text-x7-red'
                      : 'bg-x7-military/20 text-x7-military'
                  }`}>
                    {vessel.flag}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-x7-text-muted">
                  <div>SPD: {vessel.speed}kts</div>
                  <div>HDG: {vessel.heading}°</div>
                  <div>STATUS: {vessel.status.toUpperCase()}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Vessel Detail */}
          <div className="hud-panel p-4">
            <div className="hud-title">VESSEL DETAILS</div>
            {selectedVessel ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  {getVesselIcon(selectedVessel.type)}
                  <div>
                    <h3 className="text-sm font-mono text-x7-text">{selectedVessel.name}</h3>
                    <p className="text-xs font-mono text-x7-text-muted">{selectedVessel.type} | {selectedVessel.flag}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">MMSI</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedVessel.mmsi}</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">TYPE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedVessel.type.toUpperCase()}</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">LATITUDE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedVessel.latitude.toFixed(4)}°</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">LONGITUDE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedVessel.longitude.toFixed(4)}°</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">SPEED</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedVessel.speed} kts</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">HEADING</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedVessel.heading}°</p>
                  </div>
                </div>

                <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                  <p className="text-[10px] font-mono text-x7-text-muted mb-1">DESTINATION</p>
                  <p className="text-sm font-mono text-x7-orange">{selectedVessel.destination}</p>
                </div>

                <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                  <p className="text-[10px] font-mono text-x7-text-muted mb-1">STATUS</p>
                  <p className="text-sm font-mono text-x7-military">{selectedVessel.status.toUpperCase()}</p>
                </div>

                <button className="w-full py-2 bg-x7-military/20 border border-x7-military text-x7-military text-xs font-mono rounded hover:bg-x7-military/30 transition-all">
                  TRACK VESSEL
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-x7-text-muted">
                <p className="text-sm font-mono">SELECT VESSEL</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

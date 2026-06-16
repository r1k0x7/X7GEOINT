'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, MapPin, Flame, Skull, Clock, Filter, ArrowUpRight, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { mockConflicts } from '@/lib/mock-data';
import { getThreatLevel } from '@/lib/utils';
import type { ConflictEvent } from '@/types';

export default function ConflictMonitor() {
  const [selectedConflict, setSelectedConflict] = useState<ConflictEvent | null>(null);
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState(0);

  const regions = ['ALL', 'Ukraine', 'Middle East', 'South China Sea', 'Africa', 'Arctic'];

  const filteredConflicts = mockConflicts.filter(c => {
    if (regionFilter !== 'ALL' && c.region !== regionFilter) return false;
    if (c.severity < severityFilter) return false;
    return true;
  });

  const totalCasualties = mockConflicts.reduce((sum, c) => sum + c.casualties, 0);
  const avgSeverity = mockConflicts.reduce((sum, c) => sum + c.severity, 0) / mockConflicts.length;

  return (
    <div className="space-y-4">
      {/* Conflict Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair className="w-4 h-4 text-x7-red" />
            <span className="text-[10px] font-mono text-x7-text-muted">ACTIVE ZONES</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-red">{mockConflicts.length}</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Skull className="w-4 h-4 text-x7-orange" />
            <span className="text-[10px] font-mono text-x7-text-muted">CASUALTIES</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-orange">{totalCasualties.toLocaleString()}</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-mono text-x7-text-muted">AVG SEVERITY</span>
          </div>
          <p className="text-2xl font-display font-bold text-yellow-400">{avgSeverity.toFixed(1)}</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-x7-red" />
            <span className="text-[10px] font-mono text-x7-text-muted">TREND</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-red">+23%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="hud-panel p-4">
        <div className="hud-title">CONFLICT MONITOR</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 text-xs font-mono border rounded transition-all ${
                regionFilter === r
                  ? 'bg-x7-red/20 border-x7-red text-x7-red'
                  : 'bg-x7-gray/20 border-x7-border/30 text-x7-text-muted hover:border-x7-red/30'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Conflict List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredConflicts.map((conflict, i) => {
              const threat = getThreatLevel(conflict.severity);
              return (
                <motion.div
                  key={conflict.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedConflict(conflict)}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    selectedConflict?.id === conflict.id
                      ? 'bg-x7-red/10 border-x7-red/50'
                      : 'bg-x7-gray/10 border-x7-border/30 hover:bg-x7-gray/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-x7-red" />
                      <span className="text-xs font-mono text-x7-text">{conflict.location}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${threat.className}`}>
                      {threat.level}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-x7-text-muted mb-2 line-clamp-2">
                    {conflict.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-x7-text-muted">
                    <span className="flex items-center gap-1">
                      <Skull className="w-3 h-3" /> {conflict.casualties.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {conflict.timestamp.split('T')[1].substring(0, 5)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {conflict.source}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Conflict Detail / Heatmap */}
          <div className="space-y-4">
            <div className="hud-panel p-4">
              <div className="hud-title">ZONE DETAILS</div>
              {selectedConflict ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-x7-red" />
                    <div>
                      <h3 className="text-sm font-mono text-x7-text">{selectedConflict.location}</h3>
                      <p className="text-xs font-mono text-x7-text-muted">{selectedConflict.coordinates.join(', ')}</p>
                    </div>
                  </div>

                  <div className="p-2 bg-x7-red/10 border border-x7-red/30 rounded">
                    <p className="text-xs font-mono text-x7-red">{selectedConflict.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                      <p className="text-[10px] font-mono text-x7-text-muted">TYPE</p>
                      <p className="text-xs font-mono text-x7-text">{selectedConflict.type.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                      <p className="text-[10px] font-mono text-x7-text-muted">SEVERITY</p>
                      <p className="text-xs font-mono text-x7-red">{selectedConflict.severity}/100</p>
                    </div>
                    <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                      <p className="text-[10px] font-mono text-x7-text-muted">CASUALTIES</p>
                      <p className="text-xs font-mono text-x7-orange">{selectedConflict.casualties.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                      <p className="text-[10px] font-mono text-x7-text-muted">SOURCE</p>
                      <p className="text-xs font-mono text-x7-blue">{selectedConflict.source}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-x7-text-muted">
                  <p className="text-sm font-mono">SELECT CONFLICT ZONE</p>
                </div>
              )}
            </div>

            {/* Mini Heatmap */}
            <div className="hud-panel p-4">
              <div className="hud-title">CONFLICT HEATMAP</div>
              <div className="relative h-48 bg-x7-black border border-x7-border/30 rounded overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  {/* Simplified world map dots */}
                  {mockConflicts.map((conflict, i) => (
                    <div
                      key={conflict.id}
                      className="absolute w-3 h-3 rounded-full animate-pulse"
                      style={{
                        left: `${((conflict.coordinates[1] + 180) / 360) * 100}%`,
                        top: `${((90 - conflict.coordinates[0]) / 180) * 100}%`,
                        backgroundColor: conflict.severity > 80 ? '#e63946' : conflict.severity > 60 ? '#ff6b35' : '#fbbf24',
                        boxShadow: `0 0 10px ${conflict.severity > 80 ? '#e63946' : conflict.severity > 60 ? '#ff6b35' : '#fbbf24'}`,
                      }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-x7-red" /> CRITICAL</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-x7-orange" /> HIGH</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> ELEVATED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

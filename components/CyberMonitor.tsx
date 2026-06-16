'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, AlertTriangle, Activity, Zap, Server, Wifi, Eye, Bug, Fingerprint, Radio } from 'lucide-react';
import { mockCyberThreats } from '@/lib/mock-data';
import { getThreatLevel } from '@/lib/utils';
import type { CyberThreat } from '@/types';

export default function CyberMonitor() {
  const [selectedThreat, setSelectedThreat] = useState<CyberThreat | null>(null);
  const [typeFilter, setTypeFilter] = useState('ALL');

  const types = ['ALL', 'DDoS', 'Ransomware', 'Malware', 'Phishing', 'NationState', 'APT'];

  const filteredThreats = typeFilter === 'ALL'
    ? mockCyberThreats
    : mockCyberThreats.filter(t => t.type === typeFilter);

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'DDoS': return <Zap className="w-4 h-4 text-x7-red" />;
      case 'Ransomware': return <Lock className="w-4 h-4 text-x7-red" />;
      case 'Malware': return <Bug className="w-4 h-4 text-x7-orange" />;
      case 'Phishing': return <Eye className="w-4 h-4 text-yellow-400" />;
      case 'NationState': return <Globe className="w-4 h-4 text-x7-red" />;
      case 'APT': return <Fingerprint className="w-4 h-4 text-x7-red" />;
      default: return <Shield className="w-4 h-4 text-x7-text-muted" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Cyber Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-x7-red" />
            <span className="text-[10px] font-mono text-x7-text-muted">THREATS (24H)</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-red">1,247</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-x7-orange" />
            <span className="text-[10px] font-mono text-x7-text-muted">COUNTRIES</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-orange">43</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-mono text-x7-text-muted">TARGETS</span>
          </div>
          <p className="text-2xl font-display font-bold text-yellow-400">892</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="w-4 h-4 text-x7-blue" />
            <span className="text-[10px] font-mono text-x7-text-muted">ACTIVE MON</span>
          </div>
          <p className="text-2xl font-display font-bold text-x7-blue">2.4M</p>
        </div>
      </div>

      {/* Live Attack Map Visualization */}
      <div className="hud-panel p-4">
        <div className="hud-title">LIVE ATTACK MAP</div>
        <div className="relative h-48 bg-x7-black border border-x7-border/30 rounded overflow-hidden">
          <div className="absolute inset-0">
            {/* Simulated attack lines */}
            {mockCyberThreats.map((threat, i) => (
              <div key={threat.id} className="absolute">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: threat.severity > 80 ? '#e63946' : threat.severity > 60 ? '#ff6b35' : '#fbbf24',
                    boxShadow: `0 0 15px ${threat.severity > 80 ? '#e63946' : threat.severity > 60 ? '#ff6b35' : '#fbbf24'}`,
                    left: `${20 + i * 20}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                />
                <div 
                  className="absolute w-20 h-px bg-gradient-to-r from-transparent to-x7-red/50"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    transform: `rotate(${45 + i * 30}deg)`,
                    transformOrigin: 'left center',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-x7-text-muted">
            <div>MONITORING: AlienVault OTX | AbuseIPDB | VirusTotal</div>
            <div>REAL-TIME FEED ACTIVE</div>
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <div className="flex items-center gap-1 text-[10px] font-mono text-x7-red">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE
            </div>
          </div>
        </div>
      </div>

      <div className="hud-panel p-4">
        <div className="hud-title">CYBER WARFARE MONITOR</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-mono border rounded transition-all ${
                typeFilter === t
                  ? 'bg-x7-red/20 border-x7-red text-x7-red'
                  : 'bg-x7-gray/20 border-x7-border/30 text-x7-text-muted hover:border-x7-red/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Threat List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredThreats.map((threat, i) => {
              const threatInfo = getThreatLevel(threat.severity);
              return (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedThreat(threat)}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    selectedThreat?.id === threat.id
                      ? 'bg-x7-red/10 border-x7-red/50'
                      : 'bg-x7-gray/10 border-x7-border/30 hover:bg-x7-gray/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getThreatIcon(threat.type)}
                      <div>
                        <p className="text-xs font-mono text-x7-text">{threat.type}</p>
                        <p className="text-[10px] font-mono text-x7-text-muted">{threat.origin} → {threat.target}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${threatInfo.className}`}>
                      {threat.severity}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-x7-text-muted line-clamp-2">
                    {threat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Threat Detail */}
          <div className="hud-panel p-4">
            <div className="hud-title">THREAT DETAILS</div>
            {selectedThreat ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  {getThreatIcon(selectedThreat.type)}
                  <div>
                    <h3 className="text-sm font-mono text-x7-text">{selectedThreat.type}</h3>
                    <p className="text-xs font-mono text-x7-text-muted">ID: {selectedThreat.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">ORIGIN</p>
                    <p className="text-sm font-mono text-x7-red">{selectedThreat.origin}</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">TARGET</p>
                    <p className="text-sm font-mono text-x7-orange">{selectedThreat.target}</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">SEVERITY</p>
                    <p className="text-sm font-mono text-x7-red">{selectedThreat.severity}/100</p>
                  </div>
                  <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <p className="text-[10px] font-mono text-x7-text-muted">TYPE</p>
                    <p className="text-sm font-mono text-x7-blue">{selectedThreat.type.toUpperCase()}</p>
                  </div>
                </div>

                <div className="p-2 bg-x7-red/10 border border-x7-red/30 rounded">
                  <p className="text-xs font-mono text-x7-red">{selectedThreat.description}</p>
                </div>

                <div className="p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                  <p className="text-[10px] font-mono text-x7-text-muted mb-2">INDICATORS OF COMPROMISE</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedThreat.indicators.map((ioc, i) => (
                      <span key={i} className="px-2 py-1 text-[10px] font-mono bg-x7-gray/50 border border-x7-border/30 rounded text-x7-blue">
                        {ioc}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-2 bg-x7-red/20 border border-x7-red text-x7-red text-xs font-mono rounded hover:bg-x7-red/30 transition-all">
                  INITIATE COUNTERMEASURES
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-x7-text-muted">
                <p className="text-sm font-mono">SELECT THREAT</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

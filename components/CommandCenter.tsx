'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Satellite, Plane, Ship, Radio, AlertTriangle, Shield, 
  Activity, TrendingUp, TrendingDown, Minus, Zap, Lock, Eye,
  Crosshair, Target, Radar, Database, Server, Wifi, Cpu
} from 'lucide-react';
import { getThreatLevel, formatNumber } from '@/lib/utils';
import { mockSystemStatus, mockAlerts, mockRiskAssessments } from '@/lib/mock-data';
import type { Alert, SystemStatus } from '@/types';

function StatusBadge({ status }: { status: SystemStatus['status'] }) {
  const colors = {
    online: 'bg-green-500/20 text-green-400 border-green-500/30',
    degraded: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-mono border rounded ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}

function AlertBadge({ level }: { level: Alert['level'] }) {
  const colors = {
    green: 'text-green-400 border-green-400/30 bg-green-400/10',
    yellow: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    orange: 'text-x7-orange border-x7-orange/30 bg-x7-orange/10',
    red: 'text-x7-red border-x7-red/30 bg-x7-red/10 animate-pulse',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-mono border rounded ${colors[level]}`}>
      {level.toUpperCase()}
    </span>
  );
}

export default function CommandCenter() {
  const [activeAlerts, setActiveAlerts] = useState(mockAlerts.filter(a => !a.acknowledged));
  const [systemModules, setSystemModules] = useState(mockSystemStatus);
  const [selectedRegion, setSelectedRegion] = useState('GLOBAL');

  const threatScore = 68;
  const threatInfo = getThreatLevel(threatScore);

  const globalStats = [
    { label: 'ACTIVE CONFLICTS', value: 6, icon: Crosshair, color: 'text-x7-red', trend: 'up' },
    { label: 'TRACKED SATELLITES', value: 2847, icon: Satellite, color: 'text-x7-blue', trend: 'stable' },
    { label: 'LIVE AIRCRAFT', value: 12453, icon: Plane, color: 'text-x7-orange', trend: 'up' },
    { label: 'MARITIME VESSELS', value: 89342, icon: Ship, color: 'text-x7-military', trend: 'down' },
    { label: 'CYBER THREATS', value: 234, icon: Lock, color: 'text-x7-red', trend: 'up' },
    { label: 'EARTHQUAKES (24H)', value: 47, icon: Activity, color: 'text-yellow-400', trend: 'stable' },
  ];

  const quickModules = [
    { name: 'EARTH GLOBE', icon: Globe, status: 'ONLINE', color: 'text-x7-blue' },
    { name: 'CONFLICT MONITOR', icon: Target, status: 'ALERT', color: 'text-x7-red' },
    { name: 'SATELLITE TRACKER', icon: Satellite, status: 'ONLINE', color: 'text-x7-blue' },
    { name: 'AIRCRAFT INTEL', icon: Plane, status: 'ONLINE', color: 'text-x7-orange' },
    { name: 'MARITIME WATCH', icon: Ship, status: 'ONLINE', color: 'text-x7-military' },
    { name: 'EARTHQUAKE MONITOR', icon: Activity, status: 'ONLINE', color: 'text-yellow-400' },
    { name: 'WEATHER CENTER', icon: Zap, status: 'ONLINE', color: 'text-x7-blue' },
    { name: 'CYBER WARFARE', icon: Lock, status: 'WARNING', color: 'text-x7-red' },
    { name: 'NEWS INTEL', icon: Eye, status: 'ONLINE', color: 'text-x7-text' },
    { name: 'AI ANALYST', icon: Cpu, status: 'PROCESSING', color: 'text-x7-military' },
  ];

  return (
    <div className="space-y-4">
      {/* Global Threat Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Threat Score */}
        <div className="hud-panel p-4">
          <div className="hud-title">GLOBAL THREAT INDEX</div>
          <div className="flex items-center justify-between">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#1a1a2e" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={threatInfo.color}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - threatScore / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-bold" style={{ color: threatInfo.color }}>
                  {threatScore}
                </span>
                <span className="text-[10px] font-mono text-x7-text-muted">/100</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className={`threat-indicator ${threatInfo.className}`}>
                <AlertTriangle className="w-4 h-4" />
                {threatInfo.level}
              </div>
              <div className="text-xs font-mono text-x7-text-muted">
                <div>TREND: <span className="text-x7-red flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</span></div>
                <div>LAST UPDATE: 2m ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="hud-panel p-4">
          <div className="hud-title">ACTIVE ALERTS ({activeAlerts.length})</div>
          <div className="space-y-2 max-h-[140px] overflow-y-auto">
            {activeAlerts.slice(0, 4).map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 p-2 bg-x7-gray/30 border border-x7-border/30 rounded"
              >
                <AlertBadge level={alert.level} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-x7-text truncate">{alert.title}</p>
                  <p className="text-[10px] text-x7-text-muted truncate">{alert.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="hud-panel p-4">
          <div className="hud-title">SYSTEM HEALTH</div>
          <div className="space-y-2 max-h-[140px] overflow-y-auto">
            {systemModules.map((module) => (
              <div key={module.module} className="flex items-center justify-between p-1.5">
                <div className="flex items-center gap-2">
                  <Server className="w-3 h-3 text-x7-text-muted" />
                  <span className="text-xs font-mono text-x7-text">{module.module}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-x7-text-muted">{module.latency}ms</span>
                  <StatusBadge status={module.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {globalStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="hud-panel p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] font-mono text-x7-text-muted tracking-wider">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className={`text-xl font-display font-bold ${stat.color}`}>
                {formatNumber(stat.value)}
              </span>
              {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-x7-red" />}
              {stat.trend === 'down' && <TrendingDown className="w-3 h-3 text-x7-military" />}
              {stat.trend === 'stable' && <Minus className="w-3 h-3 text-x7-text-muted" />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Module Access */}
      <div className="hud-panel p-4">
        <div className="hud-title">MODULES</div>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
          {quickModules.map((mod) => (
            <button
              key={mod.name}
              className="flex flex-col items-center gap-2 p-3 bg-x7-gray/20 border border-x7-border/30 rounded hover:bg-x7-gray/40 hover:border-x7-blue/30 transition-all group"
            >
              <mod.icon className={`w-5 h-5 ${mod.color} group-hover:scale-110 transition-transform`} />
              <span className="text-[9px] font-mono text-x7-text-muted text-center leading-tight">{mod.name}</span>
              <span className={`text-[8px] font-mono ${mod.status === 'ONLINE' ? 'text-green-400' : mod.status === 'WARNING' ? 'text-yellow-400' : 'text-x7-red'}`}>
                {mod.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Country Risk Index */}
      <div className="hud-panel p-4">
        <div className="hud-title">COUNTRY RISK INDEX</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockRiskAssessments.map((country) => {
            const threat = getThreatLevel(country.overallScore);
            return (
              <div key={country.country} className="flex items-center gap-3 p-2 bg-x7-gray/20 border border-x7-border/30 rounded">
                <div className="w-10 h-10 rounded bg-x7-gray/50 flex items-center justify-center">
                  <span className="text-sm font-display font-bold" style={{ color: threat.color }}>
                    {country.overallScore}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-x7-text">{country.country.toUpperCase()}</span>
                    <span className={`text-[10px] font-mono ${threat.className} px-1.5 py-0.5 rounded`}>
                      {threat.level}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-x7-gray/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${country.overallScore}%`, backgroundColor: threat.color }}
                    />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-mono text-x7-text-muted">POL:{country.politicalRisk}</span>
                    <span className="text-[9px] font-mono text-x7-text-muted">MIL:{country.militaryRisk}</span>
                    <span className="text-[9px] font-mono text-x7-text-muted">CYB:{country.cyberRisk}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

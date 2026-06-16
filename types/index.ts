export interface SatelliteData {
  id: string;
  name: string;
  type: 'ISS' | 'Starlink' | 'Military' | 'Spy' | 'Weather' | 'Navigation';
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  orbitPeriod: number;
  inclination: number;
  nextPass: string;
  status: 'active' | 'inactive' | 'degraded';
}

export interface ConflictEvent {
  id: string;
  location: string;
  coordinates: [number, number];
  type: 'armed_conflict' | 'civil_unrest' | 'terrorism' | 'border_dispute' | 'cyber_attack';
  severity: number;
  casualties: number;
  timestamp: string;
  description: string;
  source: string;
  region: string;
}

export interface AircraftData {
  id: string;
  callsign: string;
  type: string;
  category: 'Military' | 'Commercial' | 'Cargo' | 'ISR' | 'AWACS' | 'Tanker' | 'Drone';
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  country: string;
  origin: string;
  destination: string;
  squawk: string;
}

export interface VesselData {
  id: string;
  name: string;
  type: 'Aircraft Carrier' | 'Destroyer' | 'Submarine' | 'Tanker' | 'LNG' | 'Cargo' | 'Warship';
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  flag: string;
  destination: string;
  status: 'underway' | 'anchored' | 'moored' | 'unknown';
  mmsi: string;
}

export interface EarthquakeData {
  id: string;
  magnitude: number;
  location: string;
  coordinates: [number, number];
  depth: number;
  timestamp: string;
  alert: 'green' | 'yellow' | 'orange' | 'red';
}

export interface WeatherData {
  location: string;
  coordinates: [number, number];
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  condition: string;
  visibility: number;
}

export interface CyberThreat {
  id: string;
  type: 'DDoS' | 'Ransomware' | 'Malware' | 'Phishing' | 'NationState' | 'APT';
  origin: string;
  target: string;
  severity: number;
  timestamp: string;
  description: string;
  indicators: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  url: string;
}

export interface RiskAssessment {
  country: string;
  overallScore: number;
  politicalRisk: number;
  economicRisk: number;
  militaryRisk: number;
  cyberRisk: number;
  terrorismRisk: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: string;
}

export interface SystemStatus {
  module: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
  uptime: string;
  lastUpdate: string;
}

export interface Alert {
  id: string;
  level: 'green' | 'yellow' | 'orange' | 'red';
  title: string;
  description: string;
  timestamp: string;
  region: string;
  acknowledged: boolean;
}


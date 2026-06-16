# X7 GEOINT COMMAND CENTER

## Professional Geospatial Intelligence Platform

A cutting-edge, military-grade command center interface for real-time global intelligence monitoring, featuring 3D Earth visualization, OSINT integration, satellite tracking, conflict monitoring, and AI-powered analytics.

## 🎯 Features

### Core Modules
- **3D Earth Globe** - Interactive WebGL globe with satellite orbits, threat markers, and atmospheric effects
- **Command Center Dashboard** - Global threat index, system health, active alerts, country risk assessment
- **Satellite Tracking Center** - ISS, Starlink, military, spy, weather, and navigation satellite tracking
- **Global Conflict Monitor** - Real-time conflict zones, heatmaps, casualty tracking, severity analysis
- **Live Aircraft Intelligence** - Military aircraft, AWACS, tankers, ISR, drone tracking via ADS-B
- **Maritime Intelligence** - Warships, carriers, submarines, tankers, LNG fleet tracking with chokepoint monitoring
- **Cyber Warfare Monitor** - Live DDoS, ransomware, malware, nation-state activity tracking
- **X7 Strategic AI Analyst** - AI-powered risk prediction, conflict analysis, geopolitical forecasting

### Design System
- **Theme**: Military Command Center / Cyber Intelligence
- **Colors**: Dark Black (#050505), Military Green, Neon Blue, Orange Alert, Red Critical
- **Typography**: JetBrains Mono, Inter, Orbitron
- **Animations**: Radar sweep, scan lines, pulsing threats, data streams, Framer Motion transitions
- **HUD Elements**: Panel corners, status indicators, threat badges, grid overlays

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 3.4
- **3D Graphics**: Three.js + React Three Fiber + React Three Drei
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **State**: Zustand (ready for integration)

## 📁 Project Structure

```
x7-geoint-command-center/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page with all sections
│   └── globals.css         # Global styles, HUD components, animations
├── components/
│   ├── Header.tsx          # Navigation header with status
│   ├── Globe3D.tsx         # Interactive 3D Earth with Three.js
│   ├── CommandCenter.tsx   # Main dashboard module
│   ├── SatelliteTracker.tsx # Satellite tracking center
│   ├── ConflictMonitor.tsx # Conflict monitoring
│   ├── AircraftTracker.tsx # Aircraft intelligence
│   ├── MaritimeTracker.tsx # Maritime intelligence
│   ├── CyberMonitor.tsx    # Cyber warfare monitor
│   ├── AIAnalyst.tsx       # AI strategic analyst
│   └── Footer.tsx          # System status footer
├── lib/
│   ├── utils.ts            # Utility functions
│   └── mock-data.ts        # Comprehensive mock data
├── types/
│   └── index.ts            # TypeScript interfaces
├── public/                 # Static assets
├── tailwind.config.ts      # Custom theme configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 OSINT Data Sources (Integration Ready)

### Conflict & Geopolitics
- ACLED (Armed Conflict Location & Event Data)
- GDELT (Global Database of Events, Language, and Tone)
- ReliefWeb
- Crisis24

### Satellite
- Sentinel Hub / Copernicus
- NASA EarthData / FIRMS
- Landsat / EOSDIS

### Aviation
- OpenSky Network
- ADS-B Exchange

### Maritime
- AISStream
- VesselFinder
- MarineTraffic API

### Weather
- NOAA
- OpenWeather
- Windy API

### Seismic
- USGS Earthquake API

### Space
- CelesTrak / Space-Track
- N2YO

### Cyber
- AlienVault OTX
- AbuseIPDB
- VirusTotal

### Internet
- Cloudflare Radar
- RIPE Atlas

## 🎨 Design Philosophy

The X7 GEOINT Command Center is designed to emulate the aesthetic of:
- NATO Command Centers
- Bloomberg Terminals
- Palantir Gotham
- Military Intelligence Dashboards

Every element serves the purpose of rapid information assimilation under high-stress conditions, with clear visual hierarchy, color-coded threat levels, and real-time data streams.

## 🔒 Security Classification

```
CLASSIFICATION: UNCLASSIFIED // FOR DEMO PURPOSES
Distribution: NOFORN (Not Releasable to Foreign Nationals)
```

## 📜 License

Proprietary - X7 Intelligence Systems

---

Built with precision for global intelligence operations.

'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Earth Sphere Component
function EarthSphere({ rotationSpeed = 0.001 }: { rotationSpeed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Create earth texture programmatically
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Ocean base
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGradient.addColorStop(0, '#1a3a5c');
    oceanGradient.addColorStop(0.5, '#0d2137');
    oceanGradient.addColorStop(1, '#1a3a5c');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Continents (simplified)
    ctx.fillStyle = '#2d4a35';
    // North America
    ctx.beginPath();
    ctx.ellipse(200, 150, 120, 80, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // South America
    ctx.beginPath();
    ctx.ellipse(260, 300, 60, 100, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Europe/Asia
    ctx.beginPath();
    ctx.ellipse(550, 140, 200, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    // Africa
    ctx.beginPath();
    ctx.ellipse(520, 280, 80, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    // Australia
    ctx.beginPath();
    ctx.ellipse(800, 320, 50, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Cloud texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, 512, 256);

    // Draw cloud patches
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const radius = Math.random() * 30 + 10;
      const opacity = Math.random() * 0.3 + 0.1;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.2;
    }
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
          emissive="#0d2137"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshStandardMaterial
          color="#00d4ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Satellite Orbit Lines
function SatelliteOrbit({ radius = 2.5, speed = 0.5, inclination = 0, color = '#00d4ff' }) {
  const orbitRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Mesh>(null);

  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }
    return points;
  }, [radius]);

  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.x = inclination;
      orbitRef.current.rotation.y += speed * 0.005;
    }
  });

  return (
    <group ref={orbitRef}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={orbitPoints.length}
            array={new Float32Array(orbitPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </line>
      <mesh ref={satelliteRef} position={[radius, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// Threat Markers on Globe
function ThreatMarkers() {
  const markers = [
    { lat: 50.45, lon: 30.52, color: '#e63946', size: 0.08, label: 'UKRAINE' },
    { lat: 31.5, lon: 34.47, color: '#e63946', size: 0.1, label: 'GAZA' },
    { lat: 23.5, lon: 121.0, color: '#ff6b35', size: 0.06, label: 'TAIWAN STRAIT' },
    { lat: 15.5, lon: 32.56, color: '#ff6b35', size: 0.07, label: 'SUDAN' },
    { lat: 35.69, lon: 51.39, color: '#ff6b35', size: 0.06, label: 'IRAN' },
  ];

  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  return (
    <group>
      {markers.map((marker, i) => {
        const pos = latLonToVector3(marker.lat, marker.lon, 2.05);
        return (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[marker.size, 16, 16]} />
              <meshStandardMaterial
                color={marker.color}
                emissive={marker.color}
                emissiveIntensity={3}
                transparent
                opacity={0.8}
              />
            </mesh>
            <Html distanceFactor={10}>
              <div className="bg-x7-black/90 border border-x7-red/50 px-2 py-1 rounded text-[10px] font-mono text-x7-red whitespace-nowrap">
                {marker.label}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// Scene setup
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, 0, 0]} intensity={0.5} color="#00d4ff" />

      <EarthSphere rotationSpeed={0.0005} />
      <ThreatMarkers />

      {/* ISS Orbit */}
      <SatelliteOrbit radius={2.3} speed={1.2} inclination={0.9} color="#00d4ff" />
      {/* GPS Orbit */}
      <SatelliteOrbit radius={2.8} speed={0.3} inclination={0.96} color="#4a7c59" />
      {/* Spy Satellite Orbit */}
      <SatelliteOrbit radius={3.2} speed={0.1} inclination={0} color="#ff6b35" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Globe3D() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-x7-black">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-x7-blue/30 border-t-x7-blue rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-sm text-x7-blue animate-pulse">
              INITIALIZING GLOBE SYSTEM...
            </p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>

      {/* Overlay HUD Elements */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="hud-panel p-3">
          <div className="hud-title">GLOBE STATUS</div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="status-dot status-online" />
              <span className="text-x7-military">SYSTEM ONLINE</span>
            </div>
            <div className="text-x7-text-muted">LAT: 00.000° N</div>
            <div className="text-x7-text-muted">LON: 000.000° E</div>
            <div className="text-x7-text-muted">ZOOM: 1.0x</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="hud-panel p-3">
          <div className="hud-title">ACTIVE THREATS</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-x7-red animate-pulse" />
              <span className="text-xs font-mono text-x7-red">2 CRITICAL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-x7-orange" />
              <span className="text-xs font-mono text-x7-orange">3 HIGH</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-xs font-mono text-yellow-400">1 ELEVATED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

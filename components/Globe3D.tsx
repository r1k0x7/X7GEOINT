'use client';

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// ========== MOBILE DETECTION ==========
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// ========== TEXTURE URLs ==========
const TEXTURE_URLS = {
  day: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  night: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  specular: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
  clouds: 'https://unpkg.com/three-globe/example/img/earth-clouds.png',
  bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
};

// ========== REALISTIC EARTH SHADER ==========
function EarthMaterial({ dayTexture, nightTexture, specularTexture, bumpTexture, isMobile }: {
  dayTexture: THREE.Texture;
  nightTexture: THREE.Texture;
  specularTexture: THREE.Texture;
  bumpTexture: THREE.Texture;
  isMobile: boolean;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uDayTexture: { value: dayTexture },
    uNightTexture: { value: nightTexture },
    uSpecularTexture: { value: specularTexture },
    uBumpTexture: { value: bumpTexture },
    uSunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
    uTime: { value: 0 },
    uCloudIntensity: { value: isMobile ? 0.6 : 0.8 },
  }), [dayTexture, nightTexture, specularTexture, bumpTexture, isMobile]);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uDayTexture;
    uniform sampler2D uNightTexture;
    uniform sampler2D uSpecularTexture;
    uniform sampler2D uBumpTexture;
    uniform vec3 uSunDirection;
    uniform float uTime;
    uniform float uCloudIntensity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 sunDir = normalize(uSunDirection);
      vec3 normal = normalize(vNormal);

      // Day/night mixing based on sun angle
      float sunDot = dot(normal, sunDir);
      float mixAmount = smoothstep(-0.25, 0.25, sunDot);

      // Sample textures
      vec4 dayColor = texture2D(uDayTexture, vUv);
      vec4 nightColor = texture2D(uNightTexture, vUv);
      vec4 specularColor = texture2D(uSpecularTexture, vUv);

      // Mix day and night
      vec3 color = mix(nightColor.rgb, dayColor.rgb, mixAmount);

      // Specular reflection on oceans
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 reflectDir = reflect(-sunDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      float specularMask = specularColor.r;
      color += spec * specularMask * 0.5 * mixAmount;

      // Atmospheric fresnel glow at edges
      float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
      fresnel = pow(fresnel, 3.0);
      vec3 atmosphereColor = vec3(0.3, 0.6, 1.0) * fresnel * 0.8;
      color += atmosphereColor * mixAmount;

      // Twilight zone (reddish tint at terminator)
      float twilight = smoothstep(-0.35, -0.1, sunDot) * smoothstep(0.15, -0.1, sunDot);
      vec3 twilightColor = vec3(1.0, 0.4, 0.2);
      color = mix(color, twilightColor, twilight * 0.3);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
    />
  );
}

// ========== ATMOSPHERE GLOW ==========
function AtmosphereMaterial() {
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewDir = normalize(cameraPosition - (modelMatrix * vec4(vPosition, 1.0)).xyz);
      vec3 normal = normalize(vNormal);
      float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
      fresnel = pow(fresnel, 2.0);
      vec3 atmosphereColor = vec3(0.2, 0.5, 1.0);
      float alpha = fresnel * 0.6;
      gl_FragColor = vec4(atmosphereColor, alpha);
    }
  `;

  return (
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent
      side={THREE.BackSide}
      depthWrite={false}
      blending={THREE.AdditiveBlending}
    />
  );
}

// ========== SATELLITE 3D MODEL ==========
function SatelliteModel({ position, color, type }: { position: [number, number, number]; color: string; type: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.5 : 1}
    >
      {/* Satellite body */}
      <mesh>
        <boxGeometry args={[0.06, 0.04, 0.08]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.08, 0, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.08, 0.01, 0.04]} />
        <meshStandardMaterial color="#1a3a5c" emissive="#0044aa" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.08, 0, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.08, 0.01, 0.04]} />
        <meshStandardMaterial color="#1a3a5c" emissive="#0044aa" emissiveIntensity={0.5} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.06]} />
        <meshStandardMaterial color="#888888" metalness={0.9} />
      </mesh>
      {/* Glow effect */}
      <mesh scale={[0.15, 0.15, 0.15]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      {/* Label */}
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-x7-black/90 border border-x7-blue/50 px-2 py-1 rounded text-[10px] font-mono text-x7-blue whitespace-nowrap pointer-events-none">
            {type}
          </div>
        </Html>
      )}
    </group>
  );
}

// ========== SHIP 3D MODEL ==========
function ShipModel({ position, color, name, type }: { position: [number, number, number]; color: string; name: string; type: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.3 : 1}
    >
      {/* Ship hull */}
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.015, 0.12]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Ship superstructure */}
      <mesh position={[0, 0.015, -0.02]}>
        <boxGeometry args={[0.03, 0.02, 0.04]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      {/* Radar/comm tower */}
      <mesh position={[0, 0.03, -0.02]}>
        <cylinderGeometry args={[0.003, 0.003, 0.02]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.9} />
      </mesh>
      {/* Wake trail (glowing) */}
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.03, 0.06]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Glow */}
      <mesh scale={[0.1, 0.1, 0.1]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      {/* Label */}
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-x7-black/90 border border-x7-military/50 px-2 py-1 rounded text-[10px] font-mono text-x7-military whitespace-nowrap pointer-events-none">
            {name} | {type}
          </div>
        </Html>
      )}
    </group>
  );
}

// ========== ORBIT TRAIL ==========
function OrbitTrail({ radius, color, segments = 64 }: { radius: number; color: string; segments?: number }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius, segments]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.15} />
    </line>
  );
}

// ========== SATELLITE ORBIT SYSTEM ==========
function SatelliteOrbitSystem({ radius, speed, color, type, isMobile }: {
  radius: number;
  speed: number;
  color: string;
  type: string;
  isMobile: boolean;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    if (orbitRef.current) {
      angleRef.current += speed * delta * 0.5;
      const x = Math.cos(angleRef.current) * radius;
      const z = Math.sin(angleRef.current) * radius;
      orbitRef.current.position.set(x, 0, z);
      orbitRef.current.rotation.y = -angleRef.current;
    }
  });

  return (
    <group>
      {!isMobile && <OrbitTrail radius={radius} color={color} />}
      <group ref={orbitRef}>
        <SatelliteModel position={[0, 0, 0]} color={color} type={type} />
      </group>
    </group>
  );
}

// ========== MARITIME TRACKER ON GLOBE ==========
function MaritimeTrackerOnGlobe() {
  const ships = [
    { lat: 36.9, lon: -75.3, name: 'USS GERALD R. FORD', type: 'Aircraft Carrier', color: '#e63946' },
    { lat: 35.2, lon: 139.7, name: 'USS ARLEIGH BURKE', type: 'Destroyer', color: '#e63946' },
    { lat: 26.0, lon: 56.0, name: 'LNG SAKURA', type: 'LNG Tanker', color: '#ff6b35' },
    { lat: 30.0, lon: 32.5, name: 'EVER GIVEN', type: 'Cargo', color: '#4a7c59' },
    { lat: 12.0, lon: 43.0, name: 'HMS QUEEN ELIZABETH', type: 'Aircraft Carrier', color: '#e63946' },
    { lat: 1.3, lon: 103.8, name: 'MAERSK LINE', type: 'Container', color: '#4a7c59' },
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
      {ships.map((ship, i) => {
        const pos = latLonToVector3(ship.lat, ship.lon, 2.06);
        return (
          <ShipModel
            key={i}
            position={[pos.x, pos.y, pos.z]}
            color={ship.color}
            name={ship.name}
            type={ship.type}
          />
        );
      })}
    </group>
  );
}

// ========== THREAT MARKERS ==========
function ThreatMarkers() {
  const markers = [
    { lat: 50.45, lon: 30.52, color: '#e63946', label: 'UKRAINE' },
    { lat: 31.5, lon: 34.47, color: '#e63946', label: 'GAZA' },
    { lat: 23.5, lon: 121.0, color: '#ff6b35', label: 'TAIWAN STRAIT' },
    { lat: 15.5, lon: 32.56, color: '#ff6b35', label: 'SUDAN' },
    { lat: 35.69, lon: 51.39, color: '#ff6b35', label: 'IRAN' },
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
        const pos = latLonToVector3(marker.lat, marker.lon, 2.08);
        return (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial
                color={marker.color}
                emissive={marker.color}
                emissiveIntensity={5}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[0.06, 0.08, 32]} />
              <meshBasicMaterial
                color={marker.color}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ========== EARTH SCENE ==========
function EarthScene({ isMobile }: { isMobile: boolean }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const [dayMap, nightMap, specularMap, bumpMap, cloudMap] = useLoader(
    THREE.TextureLoader,
    [TEXTURE_URLS.day, TEXTURE_URLS.night, TEXTURE_URLS.specular, TEXTURE_URLS.bump, TEXTURE_URLS.clouds]
  );

  useEffect(() => {
    [dayMap, nightMap, specularMap, bumpMap, cloudMap].forEach(tex => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
    });
  }, [dayMap, nightMap, specularMap, bumpMap, cloudMap]);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0005;
    if (groupRef.current) groupRef.current.rotation.y += 0.0001;
  });

  // Mobile: lower geometry detail
  const earthSegments = isMobile ? 64 : 128;
  const cloudSegments = isMobile ? 32 : 64;

  return (
    <group ref={groupRef}>
      {/* Earth - 1:1 scale, radius = 2 units */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, earthSegments, earthSegments]} />
        <EarthMaterial
          dayTexture={dayMap}
          nightTexture={nightMap}
          specularTexture={specularMap}
          bumpTexture={bumpMap}
          isMobile={isMobile}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[2, 32, 32]} />
        <AtmosphereMaterial />
      </mesh>

      {/* Clouds */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[2, cloudSegments, cloudSegments]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={isMobile ? 0.6 : 0.8}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner atmosphere */}
      <mesh scale={[1.005, 1.005, 1.005]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ========== MAIN SCENE ==========
function Scene() {
  const isMobile = useIsMobile();
  const { camera } = useThree();

  // Mobile: closer camera, reduced stars
  useEffect(() => {
    if (isMobile) {
      camera.position.set(0, 0, 5);
    } else {
      camera.position.set(0, 0, 6);
    }
  }, [isMobile, camera]);

  return (
    <>
      <ambientLight intensity={isMobile ? 0.15 : 0.1} />
      <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, 0, 0]} intensity={0.3} color="#4488ff" />

      <Suspense fallback={null}>
        <EarthScene isMobile={isMobile} />
      </Suspense>

      <ThreatMarkers />
      <MaritimeTrackerOnGlobe />

      {/* Satellites with 3D models and orbit trails */}
      <SatelliteOrbitSystem radius={2.4} speed={1.2} color="#00d4ff" type="ISS / LEO" isMobile={isMobile} />
      <SatelliteOrbitSystem radius={2.9} speed={0.3} color="#4a7c59" type="GPS / MEO" isMobile={isMobile} />
      <SatelliteOrbitSystem radius={3.3} speed={0.1} color="#ff6b35" type="SPY / GEO" isMobile={isMobile} />

      <Stars
        radius={200}
        depth={100}
        count={isMobile ? 3000 : 8000}
        factor={6}
        saturation={0}
        fade
        speed={0.5}
      />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={isMobile ? 3 : 3.5}
        maxDistance={isMobile ? 10 : 12}
        autoRotate
        autoRotateSpeed={isMobile ? 0.2 : 0.3}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={isMobile ? 0.5 : 1}
        touchAction="pan-y"
      />
    </>
  );
}

// ========== FALLBACK ==========
function GlobeFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-x7-blue/30 border-t-x7-blue rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-sm text-x7-blue animate-pulse">LOADING EARTH TEXTURES...</p>
      </div>
    </div>
  );
}

// ========== MAIN COMPONENT ==========
export default function Globe3D() {
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <GlobeFallback />;

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 5 : 6], fov: 45 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
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
            <div className="text-x7-text-muted">TEXTURE: NASA BLUE MARBLE</div>
            <div className="text-x7-text-muted">SCALE: 1:1 EARTH</div>
            {isMobile && <div className="text-x7-blue">MODE: MOBILE OPTIMIZED</div>}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="hud-panel p-3">
          <div className="hud-title">ACTIVE TRACKERS</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-x7-red animate-pulse" />
              <span className="text-xs font-mono text-x7-red">2 CRITICAL ZONES</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-x7-blue" />
              <span className="text-xs font-mono text-x7-blue">3 SATELLITES</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-x7-military" />
              <span className="text-xs font-mono text-x7-military">6 MARITIME</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hint */}
      {isMobile && (
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <div className="hud-panel p-2">
            <p className="text-[10px] font-mono text-x7-text-muted">👆 DRAG TO ROTATE • PINCH TO ZOOM</p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// ─────────────────────────────────────────────────────────────────────────────
// Color Presets Definition
// ─────────────────────────────────────────────────────────────────────────────
const PRESETS = {
  sunset: {
    name: "Sunset Amber",
    backLightColor: "#ff5e00",      // Vibrant neon orange
    secondaryLightColor: "#9a00ff",  // Vivid purple
    transmissionColor: "#ffffff",
    roughness: 0.12,
    thickness: 1.2,
    chromaticAberration: 0.08,
    waveSpeed: 0.8,
    waveAmplitude: 0.65,
  },
  cyber: {
    name: "Cyber Neon",
    backLightColor: "#00f3ff",      // Tech cyan
    secondaryLightColor: "#ff007c",  // Hot pink
    transmissionColor: "#e0f7fc",
    roughness: 0.05,
    thickness: 0.8,
    chromaticAberration: 0.15,
    waveSpeed: 1.2,
    waveAmplitude: 0.9,
  },
  emerald: {
    name: "Emerald Ice",
    backLightColor: "#00ff88",      // Mint neon green
    secondaryLightColor: "#0088ff",  // Ice blue
    transmissionColor: "#e8fced",
    roughness: 0.18,
    thickness: 1.6,
    chromaticAberration: 0.04,
    waveSpeed: 0.6,
    waveAmplitude: 0.5,
  },
  obsidian: {
    name: "Obsidian Glass",
    backLightColor: "#ffffff",      // Pure white backlight
    secondaryLightColor: "#333333",  // Faint white secondary
    transmissionColor: "#111111",    // Smoked tint
    roughness: 0.25,
    thickness: 2.2,
    chromaticAberration: 0.02,
    waveSpeed: 0.4,
    waveAmplitude: 0.4,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// StackedCubes - The R3F component rendering the instanced beveled boxes
// ─────────────────────────────────────────────────────────────────────────────
function StackedCubes({ config }) {
  const meshRef = useRef();
  
  // Recreate the geometry only if shape configuration changes
  const geometry = useMemo(() => {
    // Width, Height, Depth, Segments, Bevel Radius
    return new RoundedBoxGeometry(1.5, 0.14, 1.5, 3, 0.04);
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Animate the instances in the frame loop
  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = clock.getElapsedTime();
    const count = config.count;
    const spacing = config.spacing;

    for (let i = 0; i < count; i++) {
      // Stack vertically centered around Y = 0
      const y = (i - (count - 1) / 2) * spacing;
      dummy.position.set(0, y, 0);

      // Helical wave rotation: continuous base rotation + wave twist
      const baseRot = t * config.baseRotationSpeed;
      const wave = Math.sin(t * config.waveSpeed + i * config.waveOffset) * config.waveAmplitude;
      dummy.rotation.set(0, baseRot + wave, 0);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      key={config.count} // Force rebuild when count changes to avoid buffer mismatch
      ref={meshRef}
      args={[geometry, null, config.count]}
      castShadow
      receiveShadow
    >
      <MeshTransmissionMaterial
        // Physical settings
        transmission={1.0}
        thickness={config.thickness}
        roughness={config.roughness}
        ior={1.5}
        chromaticAberration={config.chromaticAberration}
        anisotropy={0.3}
        distortion={0.0}
        temporalDistortion={0.0}
        
        // Color & reflections
        color={config.transmissionColor}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        
        // Quality optimization
        resolution={512}
        samples={8}
        backside={true}
      />
    </instancedMesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SceneRoot - The R3F Canvas and environment setup
// ─────────────────────────────────────────────────────────────────────────────
function SceneRoot({ config }) {
  return (
    <Canvas
      shadows
      dpr={1}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[0, 1.5, 7.5]} fov={45} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minPolarAngle={0.2}
      />

      <ambientLight color={'#ff0000'} intensity={0.8} />

      {/* Stacked glass cubes */}
      <group position={[0, 0.2, 0]}>
        <StackedCubes config={config} />
      </group>

      <Environment preset="city" environmentIntensity={0.25} />

   
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function CubesPage() {
  const [activePreset, setActivePreset] = useState("sunset");
  const [panelOpen, setPanelOpen] = useState(true);

  // Core scene configuration state
  const [config, setConfig] = useState({
    count: 20,
    spacing: 0.26,
    transmissionColor: PRESETS.sunset.transmissionColor,
    backLightColor: PRESETS.sunset.backLightColor,
    secondaryLightColor: PRESETS.sunset.secondaryLightColor,
    thickness: PRESETS.sunset.thickness,
    roughness: PRESETS.sunset.roughness,
    chromaticAberration: PRESETS.sunset.chromaticAberration,
    screenChromaticAberration: 0.0025,
    baseRotationSpeed: 0.25,
    waveSpeed: PRESETS.sunset.waveSpeed,
    waveOffset: 0.24,
    waveAmplitude: PRESETS.sunset.waveAmplitude,
  });

  // Apply preset updates dynamically
  const applyPreset = (key) => {
    setActivePreset(key);
    const p = PRESETS[key];
    setConfig((prev) => ({
      ...prev,
      backLightColor: p.backLightColor,
      secondaryLightColor: p.secondaryLightColor,
      transmissionColor: p.transmissionColor,
      roughness: p.roughness,
      thickness: p.thickness,
      chromaticAberration: p.chromaticAberration,
      waveSpeed: p.waveSpeed,
      waveAmplitude: p.waveAmplitude,
    }));
  };

  // State handles for sliders
  const handleConfigChange = (key, val) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none">
      
      {/* 3D Scene Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <SceneRoot config={config} />
      </div>

      {/* Stylized Dark Gradient Background Overlay for Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* Premium Header Overlay */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-black tracking-widest uppercase">
            TSL TRANSMISSION
          </h1>
        </div>
        <p className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
          Glass Refraction & Waves Simulation
        </p>
      </div>

      {/* floating Control Panel Toggle Button (for cleaner viewport viewing) */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="absolute top-8 right-8 z-20 pointer-events-auto flex items-center justify-center p-3 rounded-full bg-neutral-900/80 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-all cursor-pointer shadow-xl text-neutral-300"
        title="Toggle Settings Panel"
      >
        {panelOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        )}
      </button>

      {/* Control Panel */}
      <div
        className={`absolute top-24 right-8 z-10 w-96 max-h-[80vh] overflow-y-auto pointer-events-auto rounded-2xl bg-neutral-950/75 backdrop-blur-xl border border-white/10 p-6 shadow-2xl transition-all duration-300 ${
          panelOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12 pointer-events-none"
        }`}
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex flex-col gap-6">
          {/* Section: Presets */}
          <div>
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
              VIBE PRESET
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PRESETS).map((key) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                    activePreset === key
                      ? "bg-white text-black border-white shadow-md shadow-white/10"
                      : "bg-neutral-900/50 hover:bg-neutral-800/80 text-neutral-300 border-neutral-800"
                  }`}
                >
                  {PRESETS[key].name}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section: Geometry / Layout */}
          <div>
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4">
              GEOMETRY & SPACING
            </div>
            <div className="flex flex-col gap-4">
              {/* Cube Count */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Cubes Count</span>
                  <span className="text-neutral-400">{config.count}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={config.count}
                  onChange={(e) => handleConfigChange("count", parseInt(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Vertical Spacing */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Vertical Spacing</span>
                  <span className="text-neutral-400">{config.spacing.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.45"
                  step="0.01"
                  value={config.spacing}
                  onChange={(e) => handleConfigChange("spacing", parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section: Transmission Material */}
          <div>
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4">
              GLASS MATERIAL
            </div>
            <div className="flex flex-col gap-4">
              {/* Thickness */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Refractive Thickness</span>
                  <span className="text-neutral-400">{config.thickness.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="4.0"
                  step="0.1"
                  value={config.thickness}
                  onChange={(e) => handleConfigChange("thickness", parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Roughness */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Surface Roughness</span>
                  <span className="text-neutral-400">{config.roughness.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="0.80"
                  step="0.01"
                  value={config.roughness}
                  onChange={(e) => handleConfigChange("roughness", parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Material Chromatic Aberration */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Material Dispersion (RGB split)</span>
                  <span className="text-neutral-400">{config.chromaticAberration.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="0.40"
                  step="0.01"
                  value={config.chromaticAberration}
                  onChange={(e) => handleConfigChange("chromaticAberration", parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section: Wave Motion & Physics */}
          <div>
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4">
              WAVE MOTION
            </div>
            <div className="flex flex-col gap-4">
              {/* Wave Speed */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Wave Propagation Speed</span>
                  <span className="text-neutral-400">{config.waveSpeed.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={config.waveSpeed}
                  onChange={(e) => handleConfigChange("waveSpeed", parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Wave Amplitude */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Wave Amplitude (Twist)</span>
                  <span className="text-neutral-400">{config.waveAmplitude.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="2.00"
                  step="0.05"
                  value={config.waveAmplitude}
                  onChange={(e) => handleConfigChange("waveAmplitude", parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Base Spin Speed */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Base Column Spin Speed</span>
                  <span className="text-neutral-400">{config.baseRotationSpeed.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1.50"
                  max="1.50"
                  step="0.05"
                  value={config.baseRotationSpeed}
                  onChange={(e) => handleConfigChange("baseRotationSpeed", parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Section: Screen Post-processing */}
          <div>
            <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4">
              POST PROCESSING
            </div>
            <div className="flex flex-col gap-4">
              {/* Screen Chromatic Aberration */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-medium">
                  <span>Screen Chromatic Aberration</span>
                  <span className="text-neutral-400">{(config.screenChromaticAberration * 1000).toFixed(1)}px</span>
                </div>
                <input
                  type="range"
                  min="0.0000"
                  max="0.0070"
                  step="0.0002"
                  value={config.screenChromaticAberration}
                  onChange={(e) => handleConfigChange("screenChromaticAberration", parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Subtle Interaction Guide */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none opacity-40 text-[9px] font-bold tracking-widest text-center uppercase">
        Drag to rotate camera • Pinch/Scroll to zoom
      </div>

    </div>
  );
}

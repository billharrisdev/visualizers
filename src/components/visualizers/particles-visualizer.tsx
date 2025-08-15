"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// Postprocessing (loaded from three/examples)
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { useAudioEngine } from "./_shared/use-audio-engine";
import { TRACKS } from "./_shared/tracks";

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

export default function ParticlesVisualizer() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { analyser, ctx, play, pause, stop, isPlaying, setVolume } = useAudioEngine({ fftSize: 1024, smoothingTimeConstant: 0.7 });
  const [track, setTrack] = useState(0);
  const [gain, setGain] = useState(0.7);

  // three.js refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const instancedRef = useRef<THREE.InstancedMesh | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const baseScalesRef = useRef<Float32Array | null>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const positionsInitRef = useRef(false);
  // Postprocessing refs
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);

  // Config state
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [bloom, setBloom] = useState(true);
  const [focusDist, setFocusDist] = useState(0); // world Z around which focus is sharp
  const [focusSpread, setFocusSpread] = useState(60); // larger = shallower DOF effect
  const configRef = useRef({ quality: 'medium' as 'low' | 'medium' | 'high', bloom: true, focusDist: 0, focusSpread: 60 });
  useEffect(() => { configRef.current = { quality, bloom, focusDist, focusSpread }; }, [quality, bloom, focusDist, focusSpread]);
  const animRef = useRef<number | null>(null);

  useEffect(() => setVolume(gain), [gain, setVolume]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight || 480;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

  const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 140);
    cameraRef.current = camera;

    // Lighting for spheres
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);
    const pointLight = new THREE.PointLight(0x3b82f6, 1.2, 600);
    pointLight.position.set(50, 120, 160);
    scene.add(pointLight);

  const SPHERE_COUNT = quality === 'low' ? 400 : quality === 'high' ? 1600 : 900; // adaptive count
    const positions = new Float32Array(SPHERE_COUNT * 3);
    const velocities = new Float32Array(SPHERE_COUNT * 3);
    const baseScales = new Float32Array(SPHERE_COUNT);
    const range = 95;
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() * 2 - 1) * range;
      positions[i3 + 1] = (Math.random() * 2 - 1) * range;
      positions[i3 + 2] = (Math.random() * 2 - 1) * range;
      velocities[i3] = (Math.random() * 2 - 1) * 0.25;
      velocities[i3 + 1] = (Math.random() * 2 - 1) * 0.25;
      velocities[i3 + 2] = (Math.random() * 2 - 1) * 0.25;
      baseScales[i] = 0.4 + Math.random() * 1.1; // base radius factor
    }
    velocitiesRef.current = velocities;
    baseScalesRef.current = baseScales;

  const sphereSegments = quality === 'high' ? 24 : 16;
  const sphereGeo = new THREE.SphereGeometry(1, sphereSegments, sphereSegments);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: new THREE.Color(0x1d4ed8).multiplyScalar(0.4),
      roughness: 0.3,
      metalness: 0.15,
    });
  const instanced = new THREE.InstancedMesh(sphereGeo, sphereMat, SPHERE_COUNT);
    instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instanced);
    instancedRef.current = instanced;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const i3 = i * 3;
      dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      const s = baseScales[i];
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;

    // Postprocessing pipeline
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.75, 0.4, 0.85);
    composer.addPass(bloomPass);
    composerRef.current = composer;
    bloomPassRef.current = bloomPass;

    const onResize = () => {
      if (!rendererRef.current || !cameraRef.current || !mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 480;
      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      if (composerRef.current) composerRef.current.setSize(w, h);
      if (bloomPassRef.current) bloomPassRef.current.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);

      // Update particle dynamics using audio bands
  const instanced = instancedRef.current!;
      const velocities = velocitiesRef.current!;
      const baseScales = baseScalesRef.current!;
      const matrix = new THREE.Matrix4();
      const dummy = new THREE.Object3D();
      if (!positionsRef.current) positionsRef.current = new Float32Array(instanced.count * 3);
      const positions = positionsRef.current;
      if (!positionsInitRef.current) {
        for (let i = 0; i < instanced.count; i++) {
          instanced.getMatrixAt(i, matrix);
          matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
          const i3 = i * 3;
          positions[i3] = dummy.position.x;
          positions[i3 + 1] = dummy.position.y;
          positions[i3 + 2] = dummy.position.z;
        }
        positionsInitRef.current = true;
      }
      const range = 95;

      let bass = 0, mids = 0, highs = 0;
      if (analyser && ctx) {
        const bins = analyser.frequencyBinCount;
        const data = new Uint8Array(bins);
        analyser.getByteFrequencyData(data);
        const nyq = ctx.sampleRate / 2;
        const idx = (f: number) => Math.max(0, Math.min(bins - 1, Math.round((f / nyq) * bins)));
        const avg = (lo: number, hi: number) => {
          const a = idx(lo), b = idx(hi);
          let sum = 0, count = 0;
          for (let i = a; i <= b; i++) { sum += data[i]; count++; }
          return count ? sum / (count * 255) : 0;
        };
        bass = avg(20, 150);
        mids = avg(150, 2000);
        highs = avg(2000, 8000);
      }

      const speedScale = 0.5 + mids * 2.0;
  const { bloom: bloomOn, focusDist: fDist, focusSpread: fSpread } = configRef.current;
  const spread = Math.max(5, fSpread);
  for (let i = 0; i < instanced.count; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3] * speedScale;
        positions[i3 + 1] += velocities[i3 + 1] * speedScale;
        positions[i3 + 2] += velocities[i3 + 2] * speedScale;
        // wrap
        if (positions[i3] > range) positions[i3] = -range; else if (positions[i3] < -range) positions[i3] = range;
        if (positions[i3 + 1] > range) positions[i3 + 1] = -range; else if (positions[i3 + 1] < -range) positions[i3 + 1] = range;
        if (positions[i3 + 2] > range) positions[i3 + 2] = -range; else if (positions[i3 + 2] < -range) positions[i3 + 2] = range;
        const depth = positions[i3 + 2];
        const focusFactor = Math.exp(-Math.pow((depth - fDist) / spread, 2)); // gaussian falloff
        const s = baseScales[i] * (1 + bass * 1.6) * (0.4 + 0.6 * focusFactor);
        dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;

      // Color & emissive modulation
      const mat = instanced.material as THREE.MeshStandardMaterial;
      const targetColor = new THREE.Color().setHSL(0.58 - clamp01(highs) * 0.18, 0.75, 0.55 + 0.15 * highs);
      mat.color.lerp(targetColor, 0.15);
      mat.emissiveIntensity = 0.3 + mids * 1.1;
      mat.emissive = new THREE.Color().setHSL(0.58 - highs * 0.2, 0.9, 0.35 + highs * 0.25);

      if (bloomPassRef.current) bloomPassRef.current.strength = bloomOn ? 0.9 + bass * 0.6 : 0.0;

      instanced.rotation.y += 0.0008 + highs * 0.008;
      instanced.rotation.x += 0.0003 + bass * 0.002;
      if (composerRef.current) composerRef.current.render(); else renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        const el = rendererRef.current.domElement;
        el.parentElement?.removeChild(el);
      }
      if (instancedRef.current) {
        instancedRef.current.geometry.dispose();
        (instancedRef.current.material as THREE.Material).dispose();
      }
      if (composerRef.current) {
        composerRef.current.passes.length = 0;
      }
      composerRef.current = null;
      scene.clear();
    };
  }, [analyser, ctx, quality]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Track</label>
          <select
            className="border rounded-md px-3 py-2 bg-background"
            value={track}
            onChange={(e) => setTrack(Number(e.target.value))}
            disabled={isPlaying}
          >
            {TRACKS.map((t, i) => (
              <option key={t.file} value={i}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Quality</label>
          <select
            className="border rounded-md px-3 py-2 bg-background"
            value={quality}
            onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
            disabled={isPlaying}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="border rounded-md px-3 py-2 hover:bg-accent" onClick={() => play(TRACKS[track].file)} disabled={isPlaying}>Play</button>
          <button className="border rounded-md px-3 py-2 hover:bg-accent" onClick={pause} disabled={!isPlaying}>Pause</button>
          <button className="border rounded-md px-3 py-2 hover:bg-accent" onClick={stop}>Stop</button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Volume</label>
          <input type="range" min={0} max={1} step={0.01} value={gain} onChange={(e) => setGain(Number(e.target.value))} className="w-40"/>
          <span className="text-xs text-muted-foreground tabular-nums">{Math.round(gain*100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Bloom</label>
          <input type="checkbox" checked={bloom} onChange={(e) => setBloom(e.target.checked)} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Focus Z</label>
          <input type="range" min={-100} max={100} step={1} value={focusDist} onChange={(e)=>setFocusDist(Number(e.target.value))} />
          <span className="text-xs text-muted-foreground w-8 text-right">{focusDist}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Spread</label>
          <input type="range" min={10} max={120} step={5} value={focusSpread} onChange={(e)=>setFocusSpread(Number(e.target.value))} />
          <span className="text-xs text-muted-foreground w-8 text-right">{focusSpread}</span>
        </div>
      </div>

      <div className="border rounded-lg p-3 bg-muted/20">
        <div ref={mountRef} className="w-full h-[480px]" />
      </div>
    </div>
  );
}

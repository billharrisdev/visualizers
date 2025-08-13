"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
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
  const pointsRef = useRef<THREE.Points | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
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

    const PARTICLE_COUNT = 2000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    const range = 100; // cube half-size
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() * 2 - 1) * range;
      positions[i3 + 1] = (Math.random() * 2 - 1) * range;
      positions[i3 + 2] = (Math.random() * 2 - 1) * range;

      velocities[i3 + 0] = (Math.random() * 2 - 1) * 0.2;
      velocities[i3 + 1] = (Math.random() * 2 - 1) * 0.2;
      velocities[i3 + 2] = (Math.random() * 2 - 1) * 0.2;
    }
    velocitiesRef.current = velocities;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(0x60a5fa), // blue-400
      size: 1.8,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    const onResize = () => {
      if (!rendererRef.current || !cameraRef.current || !mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 480;
      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);

      // Update particle dynamics using audio bands
      const positions = (points.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
      const array = positions.array as Float32Array;
      const velocities = velocitiesRef.current!;
      const range = 100;

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
      for (let i = 0; i < array.length; i += 3) {
        array[i + 0] += velocities[i + 0] * speedScale;
        array[i + 1] += velocities[i + 1] * speedScale;
        array[i + 2] += velocities[i + 2] * speedScale;

        // wrap inside cube
        for (let k = 0; k < 3; k++) {
          if (array[i + k] > range) array[i + k] = -range;
          else if (array[i + k] < -range) array[i + k] = range;
        }
      }
      positions.needsUpdate = true;

      const ptsMat = points.material as THREE.PointsMaterial;
      ptsMat.size = 1.8 + bass * 4.0; // bass drives size
      const color = new THREE.Color().setHSL(0.58 - clamp01(highs) * 0.15, 0.8, 0.6 + 0.2 * highs);
      ptsMat.color.copy(color);

      points.rotation.y += 0.001 + highs * 0.01;

      renderer.render(scene, camera);
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
      points.geometry.dispose();
      (points.material as THREE.Material).dispose();
      scene.clear();
    };
  }, [analyser, ctx]);

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
      </div>

      <div className="border rounded-lg p-3 bg-muted/20">
        <div ref={mountRef} className="w-full h-[480px]" />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioEngine } from "./_shared/use-audio-engine";
import { TRACKS } from "./_shared/tracks";

// Krumhansl key profiles (normalized rough values)
const KRUM_MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const KRUM_MINOR = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

// Note names (C..B)
const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;

function rotate(arr: number[], k: number) {
  const n = arr.length; const out = new Array(n);
  for (let i=0;i<n;i++) out[(i+k)%n] = arr[i];
  return out as number[];
}

function normalize(v: number[]) {
  const sum = v.reduce((a,b)=>a+b,0) || 1;
  return v.map(x => x / sum);
}

export default function ChromagramVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { analyser, play, pause, stop, isPlaying, setVolume, ctx } = useAudioEngine({ fftSize: 4096, smoothingTimeConstant: 0.8 });
  const [track, setTrack] = useState(0);
  const [gain, setGain] = useState(0.7);
  const [smoothing, setSmoothing] = useState(0.7);

  useEffect(() => setVolume(gain), [gain, setVolume]);

  // Precompute mapping from FFT bins to pitch class using log frequency
  const mapping = useMemo(() => {
    if (!analyser) return null;
    const sampleRate = ctx?.sampleRate ?? 44100;
    const bins = analyser.frequencyBinCount;
    const binToPc: number[] = new Array(bins).fill(-1);
    for (let i = 1; i < bins; i++) {
      const freq = (i * sampleRate) / (analyser.fftSize);
      if (freq < 27.5 || freq > 5000) continue; // ignore very low/high
      const midi = 69 + 12 * Math.log2(freq / 440);
      const pc = ((Math.round(midi) % 12) + 12) % 12;
      binToPc[i] = pc;
    }
    return binToPc;
  }, [analyser, ctx]);

  const chromaSmoothRef = useRef<number[]>(new Array(12).fill(0));
  const keyRef = useRef<string | null>(null);
  const hueForPc = (pc: number) => (pc * 30) % 360; // 12*30=360

  useEffect(() => {
    if (!analyser || !mapping) return;
    const canvas = canvasRef.current!;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const bins = analyser.frequencyBinCount;
    const bytes = new Uint8Array(bins);

    const draw = () => {
      if (!analyser) return;
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(bytes);

      // accumulate into 12 pitch classes
      const chroma = new Array(12).fill(0);
      for (let i = 0; i < bins; i++) {
        const pc = mapping[i];
        if (pc < 0) continue;
        chroma[pc] += bytes[i] / 255;
      }
      const chromaNorm = normalize(chroma);

      // Exponential smoothing
      for (let i = 0; i < 12; i++) {
        chromaSmoothRef.current[i] = chromaSmoothRef.current[i] * smoothing + chromaNorm[i] * (1 - smoothing);
      }

      // Key detection: max correlation to rotated Krumhansl profiles
      const majorN = normalize(KRUM_MAJOR);
      const minorN = normalize(KRUM_MINOR);
      let bestScore = -Infinity; let bestKey = "C"; let bestMode = "maj";
      for (let shift = 0; shift < 12; shift++) {
        const maj = rotate(majorN, shift);
        const min = rotate(minorN, shift);
        let sMaj = 0, sMin = 0;
        for (let i = 0; i < 12; i++) {
          sMaj += chromaSmoothRef.current[i] * maj[i];
          sMin += chromaSmoothRef.current[i] * min[i];
        }
        if (sMaj > bestScore) { bestScore = sMaj; bestKey = NOTES[shift]; bestMode = "maj"; }
        if (sMin > bestScore) { bestScore = sMin; bestKey = NOTES[shift]; bestMode = "min"; }
      }
      keyRef.current = `${bestKey} ${bestMode}`;

      // draw ring
      const w = canvas.width, h = canvas.height;
      ctx2d.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const rOuter = Math.min(w, h) * 0.42;
      const rInner = rOuter * 0.55;

      ctx2d.save();
      ctx2d.translate(cx, cy);
      for (let pc = 0; pc < 12; pc++) {
        const theta0 = ((pc) / 12) * Math.PI * 2;
        const theta1 = ((pc + 1) / 12) * Math.PI * 2;
        const val = chromaSmoothRef.current[pc];
        const amp = Math.min(1, val * 3);
        const r = rInner + (rOuter - rInner) * amp;
        ctx2d.beginPath();
        ctx2d.moveTo(rInner * Math.cos(theta0), rInner * Math.sin(theta0));
        ctx2d.arc(0, 0, r, theta0, theta1);
        ctx2d.lineTo(rInner * Math.cos(theta1), rInner * Math.sin(theta1));
        ctx2d.closePath();
        ctx2d.fillStyle = `hsl(${hueForPc(pc)} 80% ${Math.round(35 + amp * 35)}%)`;
        ctx2d.fill();

        // labels
        ctx2d.save();
        const mid = (theta0 + theta1) / 2;
        const lr = rOuter + 18;
        ctx2d.translate(lr * Math.cos(mid), lr * Math.sin(mid));
        ctx2d.rotate(mid + Math.PI / 2);
        ctx2d.fillStyle = "#94a3b8"; // slate-400
        ctx2d.font = "12px sans-serif";
        ctx2d.textAlign = "center";
  ctx2d.fillText(NOTES[pc], 0, 0);
        ctx2d.restore();
      }
      ctx2d.restore();

      // center label
      ctx2d.fillStyle = "#e5e7eb"; // gray-200
      ctx2d.font = "bold 22px sans-serif";
      ctx2d.textAlign = "center";
      ctx2d.fillText(keyRef.current || "", w / 2, h / 2 + 8);
    };

    requestAnimationFrame(draw);
  }, [analyser, mapping, smoothing]);

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
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Smoothing</label>
          <input type="range" min={0.3} max={0.95} step={0.01} value={smoothing} onChange={(e) => setSmoothing(Number(e.target.value))} className="w-40"/>
          <span className="text-xs text-muted-foreground tabular-nums">{smoothing.toFixed(2)}</span>
        </div>
      </div>

      <div className="border rounded-lg p-3 bg-muted/20">
        <canvas ref={canvasRef} width={900} height={420} className="w-full h-[420px]" />
      </div>
    </div>
  );
}

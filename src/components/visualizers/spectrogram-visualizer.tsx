"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioEngine } from "./_shared/use-audio-engine";
import { TRACKS } from "./_shared/tracks";

// Perceptual Viridis colormap with 5 stops and linear interpolation
const VIRIDIS_STOPS = [
  { t: 0.0, rgb: [68, 1, 84] },     // #440154
  { t: 0.25, rgb: [59, 82, 139] },  // #3b528b
  { t: 0.5, rgb: [33, 145, 140] },  // #21918c
  { t: 0.75, rgb: [94, 201, 98] },  // #5ec962
  { t: 1.0, rgb: [253, 231, 37] },  // #fde725
];
function viridisColor(t: number) {
  const x = Math.max(0, Math.min(1, t));
  let i = 0;
  while (i < VIRIDIS_STOPS.length - 1 && x > VIRIDIS_STOPS[i + 1].t) i++;
  const a = VIRIDIS_STOPS[i], b = VIRIDIS_STOPS[Math.min(i + 1, VIRIDIS_STOPS.length - 1)];
  const span = Math.max(1e-6, b.t - a.t);
  const u = (x - a.t) / span;
  const r = Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * u);
  const g = Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * u);
  const bb = Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * u);
  return `rgb(${r}, ${g}, ${bb})`;
}

// Utilities for piano rendering and frequency/note mapping
const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
const isBlack = (m: number) => [1, 3, 6, 8, 10].includes((m % 12 + 12) % 12);
const noteName = (m: number) => {
  const N = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]; return `${N[(m%12+12)%12]}${Math.floor(m/12)-1}`;
};

export default function SpectrogramVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pianoRef = useRef<HTMLCanvasElement | null>(null);
  const { analyser, ctx, play, pause, stop, isPlaying, setVolume } = useAudioEngine({ fftSize: 2048, smoothingTimeConstant: 0.6 });
  const [track, setTrack] = useState(0);
  const [gain, setGain] = useState(0.7);

  useEffect(() => setVolume(gain), [gain, setVolume]);

  const freqToY = useMemo(() => {
    return (f: number, height: number, sampleRate: number) => {
      const fMin = 20, fMax = sampleRate / 2;
      const frac = Math.log(f / fMin) / Math.log(fMax / fMin);
      const clamped = Math.max(0, Math.min(1, frac));
      return Math.round((1 - clamped) * (height - 1));
    };
  }, []);

  // Draw static piano once or when sizing/context changes
  useEffect(() => {
    if (!ctx) return;
    const piano = pianoRef.current; if (!piano) return;
    const g = piano.getContext("2d"); if (!g) return;
    const w = piano.width, h = piano.height;
    g.clearRect(0,0,w,h);
    // white key background
    g.fillStyle = "#f8fafc"; g.fillRect(0,0,w,h);
    // draw white keys bands
    const mLo = 21; // A0
    const mHi = 108; // C8
    // compute semitone height via two adjacent notes
    for (let m = mLo; m <= mHi; m++) {
      const yTop = freqToY(midiToFreq(m+1), h, ctx.sampleRate);
      const yBot = freqToY(midiToFreq(m), h, ctx.sampleRate);
      if (!isBlack(m)) {
        g.fillStyle = "#e5e7eb"; g.fillRect(0, yTop, w, yBot - yTop);
        g.strokeStyle = "#cbd5e1"; g.lineWidth = 1; g.beginPath(); g.moveTo(0.5, yTop + 0.5); g.lineTo(w-0.5, yTop + 0.5); g.stroke();
      }
    }
    // black keys overlay
    for (let m = mLo; m <= mHi; m++) {
      if (isBlack(m)) {
        const yTop = freqToY(midiToFreq(m+1), h, ctx.sampleRate);
        const yBot = freqToY(midiToFreq(m), h, ctx.sampleRate);
        const bw = Math.floor(w * 0.6);
        const x = Math.floor((w - bw) / 2);
        g.fillStyle = "#0f172a"; // slate-900
        g.fillRect(x, yTop, bw, yBot - yTop);
      }
    }
    // octave/C labels
    g.fillStyle = "#334155"; g.font = "11px sans-serif"; g.textAlign = "center";
    for (let m = mLo; m <= mHi; m++) {
      if ((m % 12 + 12) % 12 === 0) { // C notes
        const yTop = freqToY(midiToFreq(m+1), h, ctx.sampleRate);
        const yBot = freqToY(midiToFreq(m), h, ctx.sampleRate);
        const y = Math.round((yTop + yBot) / 2);
        g.fillText(noteName(m), Math.floor(w/2), y + 4);
      }
    }
    // border
    g.strokeStyle = "#94a3b8"; g.lineWidth = 1; g.strokeRect(0.5, 0.5, w-1, h-1);
  }, [ctx, freqToY]);

  useEffect(() => {
    if (!analyser || !ctx) return;
    const canvas = canvasRef.current!;
    const c2d = canvas.getContext("2d");
    if (!c2d) return;

    const width = canvas.width;
    const height = canvas.height;

    const bufferLength = analyser.frequencyBinCount;
    const data = new Float32Array(bufferLength);

  const draw = () => {
      if (!analyser || !ctx) return;
      // scroll left by 1 px
      const img = c2d.getImageData(1, 0, width-1, height);
      c2d.putImageData(img, 0, 0);

      // fetch new spectrum
      analyser.getFloatFrequencyData(data); // in dB, around [-100, -30]

      // write rightmost column
      for (let y = 0; y < height; y++) {
        // map y -> frequency bin (log scale)
        const frac = 1 - y / (height - 1);
        const fMin = 20, fMax = ctx.sampleRate / 2;
        const f = fMin * Math.pow(fMax / fMin, frac);
        const bin = Math.min(bufferLength - 1, Math.max(0, Math.round((f / (ctx.sampleRate/2)) * bufferLength)));
        const db = data[bin];
    let norm = (db + 100) / 70; // map [-100..-30] -> [0..1]
    norm = Math.max(0, Math.min(1, norm));
    // slight gamma to lift quiet detail
    const gamma = 0.8; const t = Math.pow(norm, gamma);
    c2d.fillStyle = viridisColor(t);
        c2d.fillRect(width-1, y, 1, 1);
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
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

      <div className="border rounded-lg p-3 bg-muted/20 overflow-x-auto">
        <div className="flex items-start gap-2">
          <canvas ref={canvasRef} width={900} height={360} className="w-full h-[360px]" />
          <canvas ref={pianoRef} width={64} height={360} className="h-[360px] w-[64px]" />
        </div>
      </div>
    </div>
  );
}

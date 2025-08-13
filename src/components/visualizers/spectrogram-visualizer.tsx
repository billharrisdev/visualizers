"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioEngine } from "./_shared/use-audio-engine";
import { TRACKS } from "./_shared/tracks";

// Simple turbo colormap approximation (0..1)
function turboColor(t: number) {
  // clamp
  const x = Math.max(0, Math.min(1, t));
  // piecewise polynomial approximation (compact)
  const r = Math.round(255 * (34.61*x - 59.75*x*x + 32.27*x*x*x));
  const g = Math.round(255 * (0.0 + 2.86*x + 0.0*x*x));
  const b = Math.round(255 * (13.36*x - 13.36*x*x + 0.0*x*x*x));
  return `rgb(${Math.max(0,r)}, ${Math.max(0,Math.min(255,g))}, ${Math.max(0,b)})`;
}

export default function SpectrogramVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { analyser, ctx, play, pause, stop, isPlaying, setVolume } = useAudioEngine({ fftSize: 2048, smoothingTimeConstant: 0.6 });
  const [track, setTrack] = useState(0);
  const [gain, setGain] = useState(0.7);

  useEffect(() => setVolume(gain), [gain, setVolume]);

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
        const norm = (db + 100) / 70; // rough normalize [-100..-30] -> [0..1]
        c2d.fillStyle = turboColor(norm);
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

      <div className="border rounded-lg p-3 bg-muted/20">
        <canvas ref={canvasRef} width={900} height={360} className="w-full h-[360px]" />
      </div>
    </div>
  );
}

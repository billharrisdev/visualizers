"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioEngine } from "./_shared/use-audio-engine";
import { TRACKS } from "./_shared/tracks";

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function foldBpm(bpm: number, min=80, max=180) {
  while (bpm < min) bpm *= 2;
  while (bpm > max) bpm /= 2;
  return bpm;
}

export default function BeatGridVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { analyser, ctx, play, pause, stop, isPlaying, setVolume } = useAudioEngine({ fftSize: 2048, smoothingTimeConstant: 0.8 });
  const [track, setTrack] = useState(0);
  const [gain, setGain] = useState(0.7);
  const [sensitivity, setSensitivity] = useState(1.5); // threshold multiplier
  const [timelineSec, setTimelineSec] = useState(8); // history window for markers

  const fluxHistoryRef = useRef<number[]>([]);
  const prevSpecRef = useRef<Float32Array | null>(null);
  const onsetsRef = useRef<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);
  const [bpmConfidence, setBpmConfidence] = useState<number | null>(null);
  const [bpmStdDev, setBpmStdDev] = useState<number | null>(null);
  const flashRef = useRef(0); // frames remaining for strobe

  // Tap tempo
  const tapTimesRef = useRef<number[]>([]);
  const [tapBpm, setTapBpm] = useState<number | null>(null);
  const [gridLockToTap, setGridLockToTap] = useState<boolean>(false);
  const baseBeatTimeRef = useRef<number | null>(null); // reference time for grid phase

  useEffect(() => setVolume(gain), [gain, setVolume]);

  // This animation loop intentionally depends on a stable subset; adding more deps would restart it every frame.
  useEffect(() => {
    if (!analyser || !ctx) return;
    const canvas = canvasRef.current!;
    const c2d = canvas.getContext("2d");
    if (!c2d) return;

    const width = canvas.width;
    const height = canvas.height;

    const bins = analyser.frequencyBinCount;
    const spec = new Float32Array(bins);

    const draw = () => {
      if (!analyser || !ctx) return;
      requestAnimationFrame(draw);

      // get current spectrum (use magnitude 0..1)
      const bytes = new Uint8Array(bins);
      analyser.getByteFrequencyData(bytes);
      for (let i = 0; i < bins; i++) spec[i] = bytes[i] / 255;

      // spectral flux = sum(max(0, spec - prevSpec))
      let flux = 0;
      const prev = prevSpecRef.current ?? spec;
      for (let i = 0; i < bins; i++) {
        const d = spec[i] - prev[i];
        if (d > 0) flux += d;
      }
      prevSpecRef.current = spec.slice(0);

      // history and adaptive threshold
      const hist = fluxHistoryRef.current;
      hist.push(flux);
      if (hist.length > 120) hist.shift(); // ~4s at 30fps-ish
      const mean = hist.reduce((a, b) => a + b, 0) / Math.max(1, hist.length);
      const thresh = mean * sensitivity;

      // peak pick: simple local max and above threshold
      const isPeak = hist.length > 2 && hist[hist.length - 2] > hist[hist.length - 3] && hist[hist.length - 2] > flux && hist[hist.length - 2] > thresh;
  if (isPeak) {
        const t = performance.now() / 1000;
        onsetsRef.current.push(t);
        // keep last ~12s
        const cutoff = t - 12;
        onsetsRef.current = onsetsRef.current.filter(x => x >= cutoff);
        flashRef.current = 6; // frames of flash

        // BPM from IOI histogram
        const onsets = onsetsRef.current;
        const iois: number[] = [];
        for (let i = 1; i < onsets.length; i++) {
          const d = onsets[i] - onsets[i - 1];
          if (d > 0.2 && d < 2.0) iois.push(d); // 30–300 BPM range raw
        }
        if (iois.length >= 2) {
          // cluster by 20ms bins
          const binSize = 0.02;
          const counts = new Map<number, number>();
          for (const d of iois) {
            const key = Math.round(d / binSize) * binSize;
            counts.set(key, (counts.get(key) || 0) + 1);
          }
          let bestD = 0, bestC = -1;
          for (const [d, c] of counts) {
            if (c > bestC) { bestC = c; bestD = d; }
          }
          if (bestD > 0) {
            const candidate = foldBpm(60 / bestD);
            setBpm(Math.round(candidate));
    // confidence and variance
    const total = Array.from(counts.values()).reduce((a,b)=>a+b,0) || 1;
    setBpmConfidence(Math.max(0, Math.min(1, bestC / total)));
    // std dev of BPM samples (folded)
    const bpms = iois.map(d => foldBpm(60 / d));
    const mean = bpms.reduce((a,b)=>a+b,0) / bpms.length;
    const variance = bpms.reduce((a,b)=>a+(b-mean)*(b-mean),0) / bpms.length;
    setBpmStdDev(Math.sqrt(variance));
          }
        }
      }

      // draw background and grid
      c2d.clearRect(0, 0, width, height);
      const isFlash = flashRef.current > 0; if (flashRef.current > 0) flashRef.current--;
      c2d.fillStyle = isFlash ? "rgba(239,68,68,0.25)" : "rgba(0,0,0,0.08)"; // red-500 flash overlay
      c2d.fillRect(0, 0, width, height);

      // dynamic beat grid lines with phase lock
      const gridBeatsAcross = 8; // show 8 beats across
      const beatSpacing = width / gridBeatsAcross;
      const gridBpm = (gridLockToTap && tapBpm) ? tapBpm : (bpm ?? 120);
      const beatPeriod = 60 / gridBpm;
      const nowSec = performance.now() / 1000;
      // choose phase anchor: tap or last onset
      const anchor = gridLockToTap ? (baseBeatTimeRef.current ?? nowSec) : (onsetsRef.current[onsetsRef.current.length-1] ?? nowSec);
      const phase = ((nowSec - anchor) / beatPeriod) % 1;
      c2d.strokeStyle = "rgba(100,116,139,0.35)"; // slate-500
      c2d.lineWidth = 1;
      // draw main beat lines
      for (let k = -1; k <= gridBeatsAcross + 1; k++) {
        const x = Math.round(((k - phase) * beatSpacing)) + 0.5;
        if (x < 0 || x > width) continue;
        c2d.beginPath(); c2d.moveTo(x, 0); c2d.lineTo(x, height); c2d.stroke();
      }
      // subdivisions (quarters)
      c2d.strokeStyle = "rgba(100,116,139,0.2)";
      for (let k = -1; k <= gridBeatsAcross + 1; k++) {
        for (let q = 1; q < 4; q++) {
          const x = Math.round(((k - phase + q/4) * beatSpacing)) + 0.5;
          if (x < 0 || x > width) continue;
          c2d.beginPath(); c2d.moveTo(x, 0); c2d.lineTo(x, height); c2d.stroke();
        }
      }

      // flux meter
      const fluxNorm = clamp(flux / (thresh || 1e-6), 0, 2);
      const meterW = Math.min(width - 40, 300), meterH = 12;
      c2d.fillStyle = "#e5e7eb"; // gray-200
      c2d.fillRect(20, height - 32, meterW, meterH);
  c2d.fillStyle = "#22c55e"; // green-500
  c2d.fillRect(20, height - 32, meterW * Math.min(fluxNorm / 2, 1), meterH);
  // threshold marker at 1.0x (half bar)
  c2d.strokeStyle = "#ef4444"; // red-500
  c2d.lineWidth = 2;
  const threshX = 20 + meterW * 0.5;
  c2d.beginPath(); c2d.moveTo(threshX + 0.5, height - 36); c2d.lineTo(threshX + 0.5, height - 18); c2d.stroke();
      c2d.fillStyle = "#9ca3af";
      c2d.font = "12px sans-serif";
      c2d.fillText(`Flux ${(flux).toFixed(3)}  Thresh ${(thresh).toFixed(3)}`, 20, height - 40);

      // BPM readout
      c2d.fillStyle = "#3b82f6"; // blue-500
      c2d.font = "bold 24px sans-serif";
      c2d.textAlign = "right";
      c2d.fillText(`${bpm ?? "--"} BPM`, width - 16, 36);
      c2d.textAlign = "left";
      // Confidence bar
      if (bpmConfidence != null) {
        const barX = width - 180, barY = 50, barW = 160, barH = 8;
        c2d.fillStyle = "#1f2937"; c2d.fillRect(barX, barY, barW, barH);
        c2d.fillStyle = "#3b82f6"; c2d.fillRect(barX, barY, barW * bpmConfidence, barH);
        c2d.fillStyle = "#93c5fd"; c2d.font = "12px sans-serif";
        c2d.fillText(`Confidence ${(bpmConfidence*100).toFixed(0)}%`, barX, barY - 2);
      }
      if (bpmStdDev != null) {
        c2d.fillStyle = "#93c5fd"; c2d.font = "12px sans-serif";
        c2d.fillText(`StdDev ${bpmStdDev.toFixed(1)} BPM`, width - 180, 84);
      }

      // Onset markers history timeline (bottom 40px) and floating age dots (top)
      const now = performance.now() / 1000;
      const T = timelineSec;
      const y0 = height - 1;
      c2d.strokeStyle = "#64748b"; // slate-500
      c2d.beginPath();
      c2d.moveTo(20, y0 - 18); c2d.lineTo(width - 20, y0 - 18); c2d.stroke();
      for (const t of onsetsRef.current) {
        const dt = now - t;
        if (dt < 0 || dt > T) continue;
        const x = 20 + (1 - dt / T) * (width - 40);
        c2d.strokeStyle = "#f87171"; // red-400
        c2d.beginPath(); c2d.moveTo(x + 0.5, y0 - 26); c2d.lineTo(x + 0.5, y0 - 10); c2d.stroke();
      }
      // floating dots at top showing recent onsets, fade by age
      for (const t of onsetsRef.current) {
        const dt = now - t; if (dt < 0 || dt > T) continue;
        const alpha = Math.max(0, 1 - dt / T);
        const x = 20 + (1 - dt / T) * (width - 40);
        c2d.fillStyle = `rgba(248,113,113,${alpha.toFixed(3)})`; // red-400 with fade
        const r = 4 + 4 * (1 - dt / T);
        c2d.beginPath(); c2d.arc(x, 16, r, 0, Math.PI*2); c2d.fill();
      }
    };

    requestAnimationFrame(draw);
  }, [analyser, ctx, sensitivity, bpm, gridLockToTap, tapBpm, timelineSec, bpmConfidence, bpmStdDev]);

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
          <button
            className="border rounded-md px-3 py-2 hover:bg-accent"
            onClick={() => {
              const t = performance.now() / 1000;
              const taps = tapTimesRef.current;
              if (taps.length === 0 || t - taps[taps.length - 1] > 2.5) {
                tapTimesRef.current = [t];
                setTapBpm(null);
                if (gridLockToTap) baseBeatTimeRef.current = t;
                return;
              }
              taps.push(t);
              // keep last 8 taps
              if (taps.length > 8) taps.shift();
              const iois = taps.slice(1).map((x, i) => x - taps[i]).filter(d => d > 0.2 && d < 2.0);
              if (iois.length) {
                const bpms = iois.map(d => foldBpm(60 / d));
                const mean = bpms.reduce((a,b)=>a+b,0) / bpms.length;
                setTapBpm(Math.round(mean));
                if (gridLockToTap) baseBeatTimeRef.current = t;
              }
            }}
          >Tap</button>
          <div className="text-xs text-muted-foreground tabular-nums">Tap: {tapBpm ?? "--"} BPM</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Grid Lock to Tap</label>
          <input type="checkbox" checked={gridLockToTap} onChange={(e)=>{ setGridLockToTap(e.target.checked); if (e.target.checked) baseBeatTimeRef.current = performance.now()/1000; }} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Volume</label>
          <input type="range" min={0} max={1} step={0.01} value={gain} onChange={(e) => setGain(Number(e.target.value))} className="w-40"/>
          <span className="text-xs text-muted-foreground tabular-nums">{Math.round(gain*100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Sensitivity</label>
          <input type="range" min={1.0} max={2.5} step={0.05} value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className="w-40"/>
          <span className="text-xs text-muted-foreground tabular-nums">{sensitivity.toFixed(2)}×</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Timeline</label>
          <input type="range" min={4} max={12} step={1} value={timelineSec} onChange={(e) => setTimelineSec(Number(e.target.value))} className="w-40"/>
          <span className="text-xs text-muted-foreground tabular-nums">{timelineSec}s</span>
        </div>
      </div>

      <div className="border rounded-lg p-3 bg-muted/20">
        <canvas ref={canvasRef} width={900} height={260} className="w-full h-[260px]" />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioEngine } from "./_shared/use-audio-engine";
import { TRACKS } from "./_shared/tracks";

// Krumhansl key profiles (normalized rough values)
const KRUM_MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const KRUM_MINOR = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;

function rotate(arr: number[], k: number) {
  const n = arr.length; const out = new Array(n);
  for (let i=0;i<n;i++) out[(i+k)%n] = arr[i];
  return out as number[];
}
function normalize(v: number[]) {
  const sum = v.reduce((a,b)=>a+b,0) || 1; return v.map(x => x / sum);
}

export default function ChromagramVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { analyser, play, pause, stop, isPlaying, setVolume, ctx } = useAudioEngine({ fftSize: 4096, smoothingTimeConstant: 0.8 });
  const [track, setTrack] = useState(0);
  const [gain, setGain] = useState(0.7);
  const [smoothing, setSmoothing] = useState(0.7);
  const [showChords, setShowChords] = useState(true);
  const showChordsRef = useRef(true);
  useEffect(() => { showChordsRef.current = showChords; }, [showChords]);
  useEffect(() => setVolume(gain), [gain, setVolume]);

  const mapping = useMemo(() => {
    if (!analyser) return null;
    const sampleRate = ctx?.sampleRate ?? 44100;
    const bins = analyser.frequencyBinCount; const binToPc: number[] = new Array(bins).fill(-1);
    for (let i = 1; i < bins; i++) {
      const freq = (i * sampleRate) / (analyser.fftSize);
      if (freq < 27.5 || freq > 5000) continue;
      const midi = 69 + 12 * Math.log2(freq / 440);
      binToPc[i] = ((Math.round(midi) % 12) + 12) % 12;
    }
    return binToPc;
  }, [analyser, ctx]);

  const chromaSmoothRef = useRef<number[]>(new Array(12).fill(0));
  const keyRef = useRef<string | null>(null);
  const confRef = useRef<{mode: 'maj'|'min', major: number, minor: number}>({ mode: 'maj', major: 0, minor: 0 });
  const hueForPc = (pc: number) => (pc * 30) % 360;
  const romanForDegree = (deg: number, mode: 'maj'|'min') => {
    const numeralsMaj = ["I","ii","iii","IV","V","vi","vii°"];
    const numeralsMin = ["i","ii°","III","iv","v","VI","VII"];
    return (mode==='maj'?numeralsMaj:numeralsMin)[deg % 7];
  };
  const circleOfFifthsIndex = (pc: number) => (pc * 7) % 12; // move by fifths

  useEffect(() => {
    if (!analyser || !mapping) return;
    const canvas = canvasRef.current!; const g = canvas.getContext('2d'); if (!g) return;
    const bins = analyser.frequencyBinCount; const bytes = new Uint8Array(bins);

    const draw = () => {
      if (!analyser) return; requestAnimationFrame(draw);
      analyser.getByteFrequencyData(bytes);

      // chroma accumulation
      const chroma = new Array(12).fill(0);
      for (let i=0;i<bins;i++) { const pc = mapping[i]; if (pc < 0) continue; chroma[pc] += bytes[i]/255; }
      const chromaNorm = normalize(chroma);
      for (let i=0;i<12;i++) chromaSmoothRef.current[i] = chromaSmoothRef.current[i]*smoothing + chromaNorm[i]*(1-smoothing);

      // key detection
      const majorN = normalize(KRUM_MAJOR), minorN = normalize(KRUM_MINOR);
      let bestScore = -Infinity, bestKey: typeof NOTES[number] = 'C', bestMode: 'maj'|'min' = 'maj', bestShift = 0;
      for (let shift=0; shift<12; shift++) {
        const maj = rotate(majorN, shift), min = rotate(minorN, shift);
        let sMaj=0, sMin=0; for (let i=0;i<12;i++){ sMaj += chromaSmoothRef.current[i]*maj[i]; sMin += chromaSmoothRef.current[i]*min[i]; }
        if (sMaj > bestScore) { bestScore = sMaj; bestKey = NOTES[shift]; bestMode = 'maj'; bestShift = shift; }
        if (sMin > bestScore) { bestScore = sMin; bestKey = NOTES[shift]; bestMode = 'min'; bestShift = shift; }
      }
      keyRef.current = `${bestKey} ${bestMode}`;
      const majRot = rotate(majorN, bestShift), minRot = rotate(minorN, bestShift);
      let majCorr=0, minCorr=0; for (let i=0;i<12;i++){ majCorr += chromaSmoothRef.current[i]*majRot[i]; minCorr += chromaSmoothRef.current[i]*minRot[i]; }
      confRef.current = { mode: bestMode, major: majCorr, minor: minCorr };

      // draw
      const w = canvas.width, h = canvas.height; g.clearRect(0,0,w,h);
      const cx = w/2, cy = h/2; const rOuter = Math.min(w,h)*0.42, rInner = rOuter*0.55;
      g.save(); g.translate(cx, cy);
      for (let pc=0; pc<12; pc++) {
        const t0 = (pc/12)*Math.PI*2, t1 = ((pc+1)/12)*Math.PI*2; const val = chromaSmoothRef.current[pc]; const amp = Math.min(1, val*3);
        const r = rInner + (rOuter - rInner) * amp;
        g.beginPath(); g.moveTo(rInner*Math.cos(t0), rInner*Math.sin(t0)); g.arc(0,0,r,t0,t1); g.lineTo(rInner*Math.cos(t1), rInner*Math.sin(t1)); g.closePath();
        g.fillStyle = `hsl(${hueForPc(pc)} 80% ${Math.round(35 + amp*35)}%)`; g.fill();
        // labels
        g.save(); const mid=(t0+t1)/2, lr=rOuter+18; g.translate(lr*Math.cos(mid), lr*Math.sin(mid)); g.rotate(mid+Math.PI/2);
        g.fillStyle = '#94a3b8'; g.font = '12px sans-serif'; g.textAlign = 'center'; g.fillText(NOTES[pc], 0, 0); g.restore();
      }
      // chord overlay (roman numerals around)
      if (showChordsRef.current) {
        const triad = bestMode === 'maj' ? [0,4,7] : [0,3,7];
        for (const off of triad) { const pc = (bestShift + off) % 12; const theta = ((pc+0.5)/12)*Math.PI*2; const r=rOuter+6;
          g.fillStyle = '#f59e0b'; g.beginPath(); g.arc(r*Math.cos(theta), r*Math.sin(theta), 4, 0, Math.PI*2); g.fill(); }
        // roman numerals at scale degrees around the ring
        const degreesMaj = [0,2,4,5,7,9,11];
        const degreesMin = [0,2,3,5,7,8,10];
        const degrees = bestMode==='maj' ? degreesMaj : degreesMin;
        g.save(); g.translate(cx, cy); g.fillStyle = '#cbd5e1'; g.font = '11px sans-serif'; g.textAlign = 'center';
        for (let i=0;i<7;i++) {
          const pc = (bestShift + degrees[i]) % 12; const theta = ((pc)/12)*Math.PI*2; const rr = rOuter + 28;
          g.save(); g.translate(rr*Math.cos(theta), rr*Math.sin(theta)); g.rotate(theta + Math.PI/2);
          g.fillText(romanForDegree(i, bestMode), 0, 0);
          g.restore();
        }
        g.restore();
      }
      // circle-of-fifths highlight path
      g.save(); g.translate(cx, cy); g.strokeStyle = 'rgba(59,130,246,0.35)'; g.lineWidth = 2;
      g.beginPath();
      for (let i=0;i<12;i++) {
        const pc = (bestShift + circleOfFifthsIndex(i)) % 12; const th = ((pc)/12)*Math.PI*2; const rr = rOuter + 12;
        const x = rr*Math.cos(th), y = rr*Math.sin(th);
        if (i===0) g.moveTo(x,y); else g.lineTo(x,y);
      }
      g.closePath(); g.stroke(); g.restore();
      g.restore();

      // center label + confidence bars
      g.fillStyle = '#e5e7eb'; g.font = 'bold 22px sans-serif'; g.textAlign = 'center'; g.fillText(keyRef.current || '', w/2, h/2+8);
      const conf = confRef.current; const total=(conf.major+conf.minor)||1; const mMaj=conf.major/total, mMin=conf.minor/total;
      const barW=140, barH=8, barY=h/2+28; g.fillStyle='#1f2937'; g.fillRect(w/2-barW/2, barY, barW, barH);
      g.fillStyle='#22c55e'; g.fillRect(w/2-barW/2, barY, barW*mMaj, barH);
      g.fillStyle='#ef4444'; g.fillRect(w/2-barW/2+barW*mMaj, barY, barW*mMin, barH);
      g.fillStyle='#9ca3af'; g.font='12px sans-serif'; g.fillText(`maj ${(mMaj*100).toFixed(0)}% / min ${(mMin*100).toFixed(0)}%`, w/2, barY-2);
    };

    requestAnimationFrame(draw);
  }, [analyser, mapping, smoothing]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Track</label>
          <select className="border rounded-md px-3 py-2 bg-background" value={track} onChange={(e)=>setTrack(Number(e.target.value))} disabled={isPlaying}>
            {TRACKS.map((t,i)=> <option key={t.file} value={i}>{t.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="border rounded-md px-3 py-2 hover:bg-accent" onClick={()=>play(TRACKS[track].file)} disabled={isPlaying}>Play</button>
          <button className="border rounded-md px-3 py-2 hover:bg-accent" onClick={pause} disabled={!isPlaying}>Pause</button>
          <button className="border rounded-md px-3 py-2 hover:bg-accent" onClick={stop}>Stop</button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Volume</label>
          <input type="range" min={0} max={1} step={0.01} value={gain} onChange={(e)=>setGain(Number(e.target.value))} className="w-40"/>
          <span className="text-xs text-muted-foreground tabular-nums">{Math.round(gain*100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Smoothing</label>
          <input type="range" min={0.3} max={0.95} step={0.01} value={smoothing} onChange={(e)=>setSmoothing(Number(e.target.value))} className="w-40"/>
          <span className="text-xs text-muted-foreground tabular-nums">{smoothing.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Chords</label>
          <input type="checkbox" checked={showChords} onChange={(e)=>setShowChords(e.target.checked)} />
        </div>
      </div>

      <div className="border rounded-lg p-3 bg-muted/20">
        <canvas ref={canvasRef} width={900} height={420} className="w-full h-[420px]" />
      </div>
    </div>
  );
}

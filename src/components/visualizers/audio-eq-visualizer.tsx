"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAssetPath } from "@/lib/asset-path";

type Track = {
  label: string;
  file: string;
  genre: string;
};

const TRACKS: Track[] = [
  { label: "Rock – Take the Lead (Kevin MacLeod)", file: "/audio/kevin-macleod_take-the-lead.mp3", genre: "Rock" },
  { label: "Jazz – George Street Shuffle (Kevin MacLeod)", file: "/audio/kevin-macleod_george-street-shuffle.mp3", genre: "Jazz" },
  { label: "Metal – Metalmania (Kevin MacLeod)", file: "/audio/kevin-macleod_metalmania.mp3", genre: "Metal" },
  { label: "Industrial – Industrial Music Box (Kevin MacLeod)", file: "/audio/kevin-macleod_industrial-music-box.mp3", genre: "Industrial" },
];

// Basic 10-band EQ center frequencies (Hz)
const BANDS = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export default function AudioEqVisualizer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [peaks, setPeaks] = useState<number[]>(Array(BANDS.length).fill(0));
  const [volume, setVolume] = useState(0.7);

  // WebAudio nodes
  const ctxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const bandMap = useMemo(() => {
    // Precompute FFT bin ranges for each band
    return BANDS.map((center, i) => {
      const next = BANDS[i + 1] ?? 22050;
      return { low: center / Math.SQRT2, high: next / Math.SQRT2 };
    });
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const setupGraph = async () => {
    let ctx = ctxRef.current;
    if (!ctx) {
      type AudioContextCtor = new () => AudioContext;
      const Ctor: AudioContextCtor =
        (window as unknown as { AudioContext?: AudioContextCtor }).AudioContext ||
        (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext!;
      ctx = new Ctor();
      ctxRef.current = ctx;
    }
    const audio = audioRef.current!;
    if (!srcRef.current) {
      srcRef.current = ctx.createMediaElementSource(audio);
    }
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8; // gentle smoothing
      analyserRef.current = analyser;
    }

    if (!gainRef.current) {
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gainRef.current = gain;
    }

    // Wiring: source -> gain -> destination (for audio)
    // and source -> analyser (for visualization)
    srcRef.current.disconnect();
    srcRef.current.connect(gainRef.current);
    gainRef.current.connect(ctx.destination);
    srcRef.current.connect(analyserRef.current);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const { width, height } = canvas;
    ctx2d.clearRect(0, 0, width, height);

    // Get frequency data
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const nyquist = (ctxRef.current?.sampleRate || 44100) / 2;
    const binFreq = (i: number) => (i / bufferLength) * nyquist;

    const bandValues: number[] = BANDS.map(() => 0);
    const bandCounts: number[] = BANDS.map(() => 0);

    for (let i = 0; i < bufferLength; i++) {
      const f = binFreq(i);
      const v = dataArray[i] / 255; // 0..1
      for (let b = 0; b < bandMap.length; b++) {
        const { low, high } = bandMap[b];
        if (f >= low && f < high) {
          bandValues[b] += v;
          bandCounts[b]++;
          break;
        }
      }
    }

    const averages = bandValues.map((sum, i) => (bandCounts[i] ? sum / bandCounts[i] : 0));

    // Peak hold with decay
    const newPeaks = [...peaks];
    for (let i = 0; i < averages.length; i++) {
      newPeaks[i] = Math.max(averages[i], newPeaks[i] - 0.01); // slow decay
    }
    setPeaks(newPeaks);

    const barWidth = width / BANDS.length;
    for (let i = 0; i < BANDS.length; i++) {
      const val = averages[i];
      const peak = newPeaks[i];
      const h = val * (height - 20);
      const ph = peak * (height - 20);
      const x = i * barWidth + 6;

      // Bar
      ctx2d.fillStyle = "#3b82f6"; // blue-500
      ctx2d.fillRect(x, height - h - 10, barWidth - 12, h);

      // Peak marker
      ctx2d.fillStyle = "#ef4444"; // red-500
      ctx2d.fillRect(x, height - ph - 12, barWidth - 12, 2);

      // Label
      ctx2d.fillStyle = "#6b7280"; // gray-500
      ctx2d.font = "10px sans-serif";
      ctx2d.textAlign = "center";
      ctx2d.fillText(formatBand(BANDS[i]), x + (barWidth - 12) / 2, height - 2);
    }

    requestAnimationFrame(draw);
  };

  const formatBand = (hz: number) => (hz >= 1000 ? `${hz / 1000}k` : `${hz}`);

  const play = async () => {
    await setupGraph();
  const audio = audioRef.current!;
  audio.src = getAssetPath(TRACKS[selected].file);
    await audio.play();
    setIsPlaying(true);
    requestAnimationFrame(draw);
  };

  const pause = () => {
    const audio = audioRef.current;
    audio?.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    // Update gain on volume changes
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      // Cleanup context to avoid leaks during HMR/nav
      try {
        analyserRef.current?.disconnect();
        gainRef.current?.disconnect();
        srcRef.current?.disconnect();
        ctxRef.current?.close();
      } catch {}
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Track</label>
          <select
            className="border rounded-md px-3 py-2 bg-background"
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
            disabled={isPlaying}
          >
            {TRACKS.map((t, i) => (
              <option key={t.file} value={i}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button onClick={play} disabled={isPlaying}>Play</Button>
          <Button onClick={pause} disabled={!isPlaying}>Pause</Button>
          <Button onClick={stop}>Stop</Button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-40"
          />
          <span className="text-xs text-muted-foreground tabular-nums">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <div className="border rounded-lg p-3 bg-muted/20">
        <canvas ref={canvasRef} width={900} height={260} className="w-full h-[260px]" />
      </div>

      <p className="text-xs text-muted-foreground">
        Tracks by Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0. See Credits.
      </p>
    </div>
  );
}

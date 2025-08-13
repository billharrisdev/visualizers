"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAssetPath } from "@/lib/asset-path";

export type AudioEngineOptions = {
  fftSize?: number; // power of two, e.g., 2048
  smoothingTimeConstant?: number; // 0..1
};

export function useAudioEngine(opts: AudioEngineOptions = {}) {
  const { fftSize = 2048, smoothingTimeConstant = 0.8 } = opts;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

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

  const ensureGraph = useCallback(async () => {
    let ctx = ctxRef.current;
    if (!ctx) {
      type AudioContextCtor = new () => AudioContext;
      const Ctor: AudioContextCtor =
        (window as unknown as { AudioContext?: AudioContextCtor }).AudioContext ||
        (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext!;
      ctx = new Ctor();
      ctxRef.current = ctx;
    }

    if (!srcRef.current) {
      srcRef.current = ctx.createMediaElementSource(audioRef.current!);
    }
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      analyserRef.current = analyser;
    }
    if (!gainRef.current) {
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gainRef.current = gain;
    }

    // Reconnect to ensure topology
    srcRef.current.disconnect();
    gainRef.current.disconnect();
    analyserRef.current.disconnect();

    srcRef.current.connect(gainRef.current);
    gainRef.current.connect(ctx.destination);
    srcRef.current.connect(analyserRef.current);
  }, [fftSize, smoothingTimeConstant, volume]);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  const play = useCallback(async (file: string) => {
    await ensureGraph();
    const audio = audioRef.current!;
    audio.src = getAssetPath(file);
    await audio.play();
    setIsPlaying(true);
  }, [ensureGraph]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      try {
        analyserRef.current?.disconnect();
        gainRef.current?.disconnect();
        srcRef.current?.disconnect();
        ctxRef.current?.close();
      } catch {}
    };
  }, []);

  return {
    audio: audioRef.current,
    ctx: ctxRef.current,
    analyser: analyserRef.current,
    isPlaying,
    volume,
    setVolume,
    play,
    pause,
    stop,
  } as const;
}

export function binFrequency(index: number, analyser: AnalyserNode, ctx: AudioContext) {
  const nyquist = ctx.sampleRate / 2;
  return (index / analyser.frequencyBinCount) * nyquist;
}

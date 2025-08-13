"use client";

import AudioEqVisualizer from "@/components/visualizers/audio-eq-visualizer";

export default function Page() {
  return (
    <section className="py-8 container max-w-5xl">
      <h1 className="text-3xl font-bold mb-4">Audio EQ Visualizer</h1>
      <p className="text-muted-foreground mb-6">
        Simple frequency band visualizer with momentary peaks. Select a track and press Play.
      </p>
      <AudioEqVisualizer />
      <div className="mt-6 text-sm text-muted-foreground">
        <p>
          Credits: Tracks by Kevin MacLeod (incompetech.com), licensed under
          <a className="text-primary underline ml-1" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.
          See <a className="text-primary underline ml-1" href="/docs/audio-credits" target="_blank" rel="noreferrer">audio credits</a>.
        </p>
      </div>
    </section>
  );
}

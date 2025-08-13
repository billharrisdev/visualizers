"use client";
import ParticlesVisualizer from "@/components/visualizers/particles-visualizer";

export default function Page() {
  return (
    <section className="py-8 container max-w-5xl">
      <h1 className="text-3xl font-bold mb-4">3D Particle Field</h1>
  <p className="text-muted-foreground mb-6">three.js particles reacting to bass/mids/highs.</p>
  <ParticlesVisualizer />
    </section>
  );
}

"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import { visualizers as allVisualizers, type Visualizer } from "@/lib/data"
import VisualizerCard from "./visualizer-card"

type VisualizerListProps = {
  initialVisualizers: Visualizer[];
  section?: "sort" | "search";
};

export default function VisualizerList({ initialVisualizers, section }: VisualizerListProps) {
  const source = useMemo(
    () => (section ? allVisualizers.filter(v => v.section === section) : allVisualizers),
    [section]
  )

  const [visualizers, setVisualizers] = useState<Visualizer[]>(initialVisualizers)
  const [page, setPage] = useState(2) // Start from page 2, as page 1 is initial
  const [hasNextPage, setHasNextPage] = useState(initialVisualizers.length < source.length)
  const { ref, inView } = useInView()

  const loadMoreVisualizers = useCallback(async () => {
    const start = (page - 1) * 8
    const end = start + 8
    const newVisualizers = source.slice(start, end)
    setVisualizers((prev) => [...prev, ...newVisualizers])
    setHasNextPage(end < source.length)
    setPage((prev) => prev + 1)
  }, [page, source])

  useEffect(() => {
    if (inView && hasNextPage) {
      loadMoreVisualizers()
    }
  }, [inView, hasNextPage, loadMoreVisualizers])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visualizers.map((visualizer) => (
          <VisualizerCard key={visualizer.id} visualizer={visualizer} />
        ))}
      </div>
      {hasNextPage && (
        <div ref={ref} className="text-center p-4">
          Loading more...
        </div>
      )}
    </>
  )
}

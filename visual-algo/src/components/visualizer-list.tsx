"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { type Visualizer } from "@/lib/data"
import VisualizerCard from "./visualizer-card"

type VisualizerListProps = {
  initialVisualizers: Visualizer[];
};

export default function VisualizerList({ initialVisualizers }: VisualizerListProps) {
  const [visualizers, setVisualizers] = useState<Visualizer[]>(initialVisualizers)
  const [page, setPage] = useState(2) // Start from page 2, as page 1 is initial
  const [hasNextPage, setHasNextPage] = useState(true)
  const { ref, inView } = useInView()

  const loadMoreVisualizers = async () => {
    const response = await fetch(`/api/visualizers?page=${page}&limit=8`)
    const data = await response.json()
    setVisualizers((prev) => [...prev, ...data.visualizers])
    setHasNextPage(data.hasNextPage)
    setPage((prev) => prev + 1)
  }

  useEffect(() => {
    if (inView && hasNextPage) {
      loadMoreVisualizers()
    }
  }, [inView, hasNextPage])

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

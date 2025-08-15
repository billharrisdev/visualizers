import Link from "next/link"
import Image from "next/image"
import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Visualizer } from "@/lib/data"
import { getAssetPath } from "@/lib/asset-path"
import { blurForPreview } from "@/lib/blur"

type VisualizerCardProps = {
  visualizer: Visualizer;
};

export default function VisualizerCard({ visualizer }: VisualizerCardProps) {
  // Internal Next.js route: let Next/link handle basePath automatically to avoid double prefix.
  const href = visualizer.href
  const [imgErrored, setImgErrored] = useState(false)
  const handleError = useCallback(() => setImgErrored(true), [])
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-3">
          <CardTitle>{visualizer.title}</CardTitle>
          {visualizer.preview && (
            <div className="relative w-full h-36 rounded-md overflow-hidden bg-muted">
              {!imgErrored ? (
                <Image
                  // Previews are static assets, still need basePath prefixing.
                  src={getAssetPath(visualizer.preview)}
                  alt={`${visualizer.title} preview`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                  placeholder="blur"
                  blurDataURL={blurForPreview(visualizer.preview)}
                  onError={handleError}
                />
              ) : (
                <div
                  role="img"
                  aria-label={`${visualizer.title} preview unavailable`}
                  className="flex items-center justify-center w-full h-full text-[10px] uppercase tracking-wide text-muted-foreground bg-gradient-to-br from-muted/40 to-muted/20"
                >
                  Preview unavailable
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{visualizer.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

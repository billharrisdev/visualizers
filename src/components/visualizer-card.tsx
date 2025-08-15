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
  // Ensure links work correctly when the site is hosted under a basePath (GitHub Pages deployment)
  const href = getAssetPath(visualizer.href)
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
                // Fallback to native img if Next/Image path resolution fails in production
                <img
                  src={getAssetPath(visualizer.preview)}
                  alt={`${visualizer.title} preview`}
                  className="object-contain w-full h-full"
                  loading="lazy"
                />
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

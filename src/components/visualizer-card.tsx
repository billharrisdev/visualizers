import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Visualizer } from "@/lib/data"
import { getAssetPath } from "@/lib/asset-path"

const BLUR =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>'
  );

type VisualizerCardProps = {
  visualizer: Visualizer;
};

export default function VisualizerCard({ visualizer }: VisualizerCardProps) {
  return (
    <Link href={visualizer.href}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-3">
          <CardTitle>{visualizer.title}</CardTitle>
          {visualizer.preview && (
            <div className="relative w-full h-36 rounded-md overflow-hidden bg-muted">
              <Image
                src={getAssetPath(visualizer.preview)}
                alt={`${visualizer.title} preview`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                placeholder="blur"
                blurDataURL={BLUR}
              />
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

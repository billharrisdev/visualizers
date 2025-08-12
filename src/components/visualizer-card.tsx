import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Visualizer } from "@/lib/data"
import { getAssetPath } from "@/lib/asset-path"

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
              <img
                src={getAssetPath(visualizer.preview)}
                alt={`${visualizer.title} preview`}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
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

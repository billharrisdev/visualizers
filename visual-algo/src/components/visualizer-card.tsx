import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Visualizer } from "@/lib/data"

type VisualizerCardProps = {
  visualizer: Visualizer;
};

export default function VisualizerCard({ visualizer }: VisualizerCardProps) {
  return (
    <Link href={visualizer.href}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{visualizer.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{visualizer.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

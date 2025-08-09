import { NextResponse } from "next/server"
import { visualizers } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "8")

  const start = (page - 1) * limit
  const end = start + limit

  const paginatedVisualizers = visualizers.slice(start, end)

  return NextResponse.json({
    visualizers: paginatedVisualizers,
    hasNextPage: end < visualizers.length,
  })
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-xl">
          Visual-Algo
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/more-algorithms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            More Algorithms
          </Link>
        </div>
      </div>
    </header>
  )
}

"use client"

import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-background border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-6">
        <Link href="/" className="font-bold text-xl">
          Visual-Algo
        </Link>
        <nav>
          <Link href="/more-algorithms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            More Algorithms
          </Link>
        </nav>
      </div>
    </header>
  )
}

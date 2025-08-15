"use client"

import Link from "next/link"
import ThemeToggle from "@/components/theme/theme-toggle"

export default function Header() {
  return (
    <header className="bg-background border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-6">
        <Link href="/" className="font-bold text-xl">
          Visual-Algo
        </Link>
        <nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}

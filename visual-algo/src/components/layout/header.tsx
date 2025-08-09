"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { data: session } = useSession()

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
          <Link href="/protected" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Protected
          </Link>
          <nav>
            {session ? (
              <div className="flex items-center gap-4">
                <span>Welcome, {session.user?.name}</span>
                <Button onClick={() => signOut()}>Sign Out</Button>
              </div>
            ) : (
              <Button onClick={() => signIn()}>Sign In</Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

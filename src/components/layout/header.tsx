'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Home className="h-5 w-5" />
          <span>耐震診断くん</span>
        </Link>
        <nav className="ml-auto flex gap-4 text-sm">
          <Link href="/simple" className="hover:underline">
            簡易診断
          </Link>
          <Link href="/detailed/building-info" className="hover:underline">
            精密診断
          </Link>
          <Link href="/report" className="hover:underline">
            レポート
          </Link>
        </nav>
      </div>
    </header>
  )
}

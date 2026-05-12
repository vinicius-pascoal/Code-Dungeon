import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className="bg-panel text-primaryText border-b border-border">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-md bg-magic flex items-center justify-center text-bg font-bold">CD</div>
          <div className="text-lg font-semibold">Code Dungeon</div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/levels" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-floor text-primaryText border border-border hover:bg-wall transition-colors">Fases</Link>
          <Link href="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-floor text-primaryText border border-border hover:bg-wall transition-colors">Jogar</Link>
        </nav>
      </div>
    </header>
  )
}

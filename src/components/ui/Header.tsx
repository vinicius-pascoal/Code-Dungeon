import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-magic flex items-center justify-center text-bg font-bold">CD</div>
          <div className="text-lg font-semibold">Code Dungeon</div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/levels" className="btn">Fases</Link>
          <Link href="/" className="btn">Jogar</Link>
        </nav>
      </div>
    </header>
  )
}

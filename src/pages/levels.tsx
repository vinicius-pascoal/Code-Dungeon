import Link from 'next/link'
import { levels } from '../data/levels'

export default function Levels() {
  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Fases</h1>
        <Link href="/" className="px-3 py-1 bg-border rounded">
          Voltar
        </Link>
      </header>

      <div className="grid gap-4">
        {levels.map((l) => (
          <div key={l.id} className="panel p-4 rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{l.name}</div>
              <div className="text-sm text-secondaryText">{l.description}</div>
              <div className="mt-1 text-xs text-secondaryText">Objetivo: {l.objective}</div>
            </div>
            <div className="space-x-2">
              <Link href={`/game?level=${l.id}`} className="px-3 py-1 bg-magic rounded">
                Jogar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

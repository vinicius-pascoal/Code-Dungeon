import Link from 'next/link'
import { levelOne } from '../data/levels/level-01'

export default function Levels() {
  const levels = [levelOne]

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
            </div>
            <div className="space-x-2">
              <Link href="/game" className="px-3 py-1 bg-magic rounded">
                Jogar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

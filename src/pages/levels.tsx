import Link from 'next/link'
import { getLevelById, worlds } from '../data/levels'

export default function Levels() {
  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Fases</h1>
        <Link href="/" className="px-3 py-1 bg-border rounded">
          Voltar
        </Link>
      </header>

      <div className="grid gap-6">
        {worlds.map((world) => {
          const worldLevels = world.levelIds.map((levelId) => getLevelById(levelId))

          return (
            <section key={world.id} className="space-y-3">
              <div className="panel rounded p-4 border border-border">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{world.name}</h2>
                    <p className="text-sm text-secondaryText">{world.description}</p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-secondaryText">
                    Tema: {world.theme}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 pl-0 md:pl-4">
                {worldLevels.map((level) => (
                  <div key={level.id} className="panel p-4 rounded flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">Fase {level.id} - {level.name}</div>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${level.isPlayable !== false ? 'bg-success/20 text-success' : 'bg-border text-secondaryText'}`}>
                          {level.isPlayable !== false ? 'Jogável' : 'Em breve'}
                        </span>
                      </div>
                      <div className="text-sm text-secondaryText">{level.description}</div>
                      <div className="mt-1 text-xs text-secondaryText">Objetivo: {level.objective}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-secondaryText">
                        {(level.concepts ?? []).map((concept) => (
                          <span key={concept} className="rounded-full bg-black/30 px-2 py-1">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-x-2">
                      {level.isPlayable !== false ? (
                        <Link href={`/game?level=${level.id}`} className="px-3 py-1 bg-magic rounded">
                          Jogar
                        </Link>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded bg-border text-secondaryText">
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

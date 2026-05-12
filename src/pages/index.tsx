import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [showHow, setShowHow] = useState(false)

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl p-8 panel rounded-md text-center">
        <h1 className="text-4xl font-bold mb-2">Code Dungeon</h1>
        <p className="text-secondaryText mb-6">Explore dungeons by writing code.</p>

        <div className="space-x-3 mb-6">
          <Link href="/game" className="px-4 py-2 bg-magic text-bg rounded font-medium">
            Jogar
          </Link>

          <button onClick={() => setShowHow(true)} className="px-4 py-2 bg-border rounded">
            Como jogar
          </button>

          <Link href="/levels" className="px-4 py-2 bg-border rounded">
            Fases
          </Link>
        </div>

        <div className="text-left text-sm p-3 bg-black/20 rounded">
          <strong>Objetivo do MVP:</strong> escrever comandos simples e executar a sequência para
          mover o personagem até a saída.
        </div>
      </div>

      {showHow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-6 panel rounded-md">
            <h2 className="text-xl font-semibold mb-2">Como jogar</h2>
            <p className="text-sm text-secondaryText mb-3">
              Escreva comandos como <code>moveForward();</code> e pressione <strong>Executar</strong>.
              O personagem seguirá os comandos em sequência. Em caso de erro, a execução será
              interrompida e uma mensagem aparecerá no console.
            </p>
            <div className="flex justify-end">
              <button onClick={() => setShowHow(false)} className="px-3 py-1 bg-magic rounded">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

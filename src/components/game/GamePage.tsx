import React, { useState } from 'react'
import DungeonGrid from './DungeonGrid'
import { levelOne } from '../../data/levels/level-01'
import { parseCommands } from '../../utils/commandParser'
import { executeCommands } from '../../utils/commandExecutor'

export default function GamePage() {
  const [code, setCode] = useState('moveForward();')
  const [logs, setLogs] = useState<string[]>([])
  const [player, setPlayer] = useState(levelOne.playerStart)
  const [running, setRunning] = useState(false)

  function addLog(line: string) {
    setLogs((s) => [...s, line])
  }

  async function onRun() {
    setLogs([])
    const parsed = parseCommands(code)
    if ((parsed as any).error) {
      addLog((parsed as any).error)
      return
    }
    const commands = (parsed as any).commands as string[]
    setRunning(true)
    await executeCommands(
      commands,
      levelOne,
      ({ command, player: p }) => {
        addLog(`${command} executado`)
        setPlayer({ ...p })
      },
      (err) => {
        addLog(`Erro: ${err}`)
        setRunning(false)
      },
      (final) => {
        addLog('Execução finalizada')
        setPlayer({ ...final })
        setRunning(false)
      }
    )
  }

  function onReset() {
    setPlayer(levelOne.playerStart)
    setLogs([])
    setRunning(false)
  }

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Code Dungeon — Prototype</h1>
        <div className="space-x-2">
          <button onClick={onReset} className="px-3 py-1 bg-border rounded">Resetar</button>
          <button onClick={onRun} disabled={running} className="px-3 py-1 bg-magic rounded">Executar</button>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-4">
        <DungeonGrid level={levelOne} playerX={player.x} playerY={player.y} />

        <div className="panel p-4 rounded-md">
          <h2 className="font-semibold mb-2">Editor</h2>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-48 p-2 bg-panel text-primaryText rounded" />

          <h3 className="mt-4 font-semibold">Console</h3>
          <div className="mt-2 p-2 bg-black/40 rounded h-40 overflow-auto">
            {logs.map((l, i) => (
              <div key={i} className="text-sm">{l}</div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

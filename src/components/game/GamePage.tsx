import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import DungeonGrid from './DungeonGrid'
import { getLevelById } from '../../data/levels'
import { parseCommands } from '../../utils/commandParser'
import { executeCommands } from '../../utils/commandExecutor'
import { Enemy, TileType } from '../../types/game'

function cloneGrid(grid: TileType[][]) {
  return grid.map((row) => [...row])
}

function cloneEnemies(enemies: Enemy[]) {
  return enemies.map((enemy) => ({ ...enemy }))
}

function starterCode(levelId: number) {
  switch (levelId) {
    case 1:
      return 'moveForward();\nmoveForward();'
    case 2:
      return 'moveForward();\nmoveForward();\nturnRight();\nmoveForward();\nmoveForward();'
    case 3:
      return 'moveForward();\nmoveForward();\nturnLeft();\nmoveForward();\nmoveForward();'
    case 5:
      return 'moveForward();\nturnRight();\nmoveForward();\nturnLeft();\nmoveForward();\nmoveForward();'
    case 6:
      return 'attack();\nmoveForward();\nmoveForward();\nmoveForward();'
    case 7:
      return 'grabKey();\nopenDoor();\nmoveForward();\nmoveForward();'
    case 8:
      return 'openChest();\nmoveForward();\nmoveForward();\nmoveForward();'
    case 9:
      return 'moveForward();\nmoveForward();\nturnRight();\nmoveForward();\nturnLeft();\nmoveForward();\nmoveForward();'
    case 10:
      return 'grabKey();\nturnRight();\nmoveForward();\nmoveForward();\nattack();\nturnLeft();\nopenDoor();\nmoveForward();'
    default:
      return 'moveForward();'
  }
}

export default function GamePage() {
  const router = useRouter()
  const selectedLevel = useMemo(() => {
    const rawLevel = Array.isArray(router.query.level) ? router.query.level[0] : router.query.level
    const parsedLevel = Number(rawLevel ?? 1)
    return getLevelById(Number.isFinite(parsedLevel) ? parsedLevel : 1)
  }, [router.query.level])

  const [code, setCode] = useState(starterCode(selectedLevel.id))
  const [logs, setLogs] = useState<string[]>([])
  const [player, setPlayer] = useState(selectedLevel.playerStart)
  const [grid, setGrid] = useState(() => cloneGrid(selectedLevel.grid))
  const [enemies, setEnemies] = useState(() => cloneEnemies(selectedLevel.enemies))
  const [running, setRunning] = useState(false)

  useEffect(() => {
    setCode(starterCode(selectedLevel.id))
    setLogs([])
    setPlayer(selectedLevel.playerStart)
    setGrid(cloneGrid(selectedLevel.grid))
    setEnemies(cloneEnemies(selectedLevel.enemies))
    setRunning(false)
  }, [selectedLevel])

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
      selectedLevel,
      ({ command, player: p, grid: nextGrid, enemies: nextEnemies }) => {
        addLog(`${command} executado`)
        setPlayer({ ...p })
        setGrid(nextGrid)
        setEnemies(nextEnemies)
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
    setPlayer(selectedLevel.playerStart)
    setGrid(cloneGrid(selectedLevel.grid))
    setEnemies(cloneEnemies(selectedLevel.enemies))
    setLogs([])
    setRunning(false)
    setCode(starterCode(selectedLevel.id))
  }

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Code Dungeon — Fase {selectedLevel.id}</h1>
          <p className="text-sm text-secondaryText">{selectedLevel.name}</p>
        </div>
        <div className="space-x-2">
          <button onClick={onReset} className="px-3 py-1 bg-border rounded">Resetar</button>
          <button onClick={onRun} disabled={running} className="px-3 py-1 bg-magic rounded">Executar</button>
        </div>
      </header>

      <main className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="panel p-4 rounded-md">
            <h2 className="font-semibold mb-2">Objetivo</h2>
            <p className="text-sm text-secondaryText">{selectedLevel.objective}</p>
            <div className="mt-3 text-sm">
              <span className="text-secondaryText">Comandos disponíveis: </span>
              <span>{selectedLevel.availableCommands.join(', ')}</span>
            </div>
          </div>

          <DungeonGrid level={selectedLevel} playerX={player.x} playerY={player.y} enemies={enemies} />
        </div>

        <div className="panel p-4 rounded-md">
          <h2 className="font-semibold mb-2">Editor</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-56 p-2 bg-panel text-primaryText rounded"
          />

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

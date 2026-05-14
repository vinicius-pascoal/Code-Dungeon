import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import DungeonGrid from './DungeonGrid'
import Legend from './Legend'
import VictoryModal from './VictoryModal'
import ErrorModal from './ErrorModal'
import CodeEditor from './CodeEditor'
import { getLevelById, levels } from '../../data/levels'
import { parseCommands } from '../../utils/commandParser'
import { executeCommands } from '../../utils/commandExecutor'
import { Enemy, TileType } from '../../types/game'

function cloneGrid(grid: TileType[][]) {
  return grid.map((row) => [...row])
}

function cloneEnemies(enemies: Enemy[]) {
  return enemies.map((enemy) => ({ ...enemy }))
}

type ExecutionErrorInfo = {
  title: string
  reason: string
  suggestion: string
  commandLabel?: string
}

function parseErrorInfo(message: string): ExecutionErrorInfo {
  const commandMatch = message.match(/comando\s+(\d+):\s*([a-zA-Z0-9_]+\(\))/i)
  const commandLabel = commandMatch ? `Comando ${commandMatch[1]}: ${commandMatch[2]}` : undefined

  if (message.includes('Nenhum comando detectado')) {
    return {
      title: 'Nada para executar',
      reason: 'O editor não contém comandos válidos para rodar.',
      suggestion: 'Escreva pelo menos um comando permitido, como moveForward();.',
    }
  }

  if (message.includes('Comando inválido')) {
    return {
      title: 'Comando inválido',
      reason: message,
      suggestion: 'Use apenas os comandos liberados para a fase atual.',
      commandLabel,
    }
  }

  if (message.includes('fora do mapa')) {
    return {
      title: 'Movimento fora do mapa',
      reason: message,
      suggestion: 'Revise a rota e evite caminhar além dos limites da fase.',
      commandLabel,
    }
  }

  if (message.includes('Parede à frente')) {
    return {
      title: 'Parede bloqueando o caminho',
      reason: message,
      suggestion: 'Vire antes de avançar ou repense a sequência de comandos.',
      commandLabel,
    }
  }

  if (message.includes('espinhos')) {
    return {
      title: 'Você pisou em espinhos',
      reason: message,
      suggestion: 'Interrompa o avanço direto e busque uma rota segura.',
      commandLabel,
    }
  }

  if (message.includes('inimigo')) {
    return {
      title: 'Inimigo bloqueando o caminho',
      reason: message,
      suggestion: 'Use attack() antes de tentar avançar.',
      commandLabel,
    }
  }

  if (message.includes('chave')) {
    return {
      title: 'Chave necessária',
      reason: message,
      suggestion: 'Colete a chave primeiro com grabKey().',
      commandLabel,
    }
  }

  if (message.includes('porta')) {
    return {
      title: 'Porta bloqueada',
      reason: message,
      suggestion: 'Garanta que há uma porta à frente e que você possui chave.',
      commandLabel,
    }
  }

  if (message.includes('baú')) {
    return {
      title: 'Baú indisponível',
      reason: message,
      suggestion: 'Posicione o personagem em frente ao baú antes de abrir.',
      commandLabel,
    }
  }

  return {
    title: 'Erro na execução',
    reason: message,
    suggestion: 'Revise a sequência de comandos e tente novamente.',
    commandLabel,
  }
}

function calculateStars(commandCount: number, levelId: number) {
  const level = levels.find((item) => item.id === levelId)
  if (!level) {
    return 1
  }

  if (commandCount <= level.starRules.threeStars) {
    return 3
  }

  if (commandCount <= level.starRules.twoStars) {
    return 2
  }

  return 1
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
  const levelIsPlayable = selectedLevel.isPlayable !== false

  const getInitialCode = () => {
    if (typeof window !== 'undefined') {
      const savedCode = localStorage.getItem(`code-dungeon-level-${selectedLevel.id}`)
      if (savedCode) {
        return savedCode
      }
    }
    return starterCode(selectedLevel.id)
  }

  const [code, setCode] = useState(getInitialCode())
  const [logs, setLogs] = useState<string[]>([])
  const [player, setPlayer] = useState(selectedLevel.playerStart)
  const [grid, setGrid] = useState(() => cloneGrid(selectedLevel.grid))
  const [enemies, setEnemies] = useState(() => cloneEnemies(selectedLevel.enemies))
  const [commandCount, setCommandCount] = useState(0)
  const [running, setRunning] = useState(false)
  const [victoryState, setVictoryState] = useState<{ open: boolean; stars: number }>({
    open: false,
    stars: 0,
  })
  const [errorState, setErrorState] = useState<{
    open: boolean
    title: string
    reason: string
    suggestion: string
    commandLabel?: string
  }>({
    open: false,
    title: '',
    reason: '',
    suggestion: '',
  })

  // Salvar código quando muda
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`code-dungeon-level-${selectedLevel.id}`, code)
    }
  }, [code, selectedLevel.id])

  // Resetar apenas o estado do jogo quando muda de nível
  useEffect(() => {
    const savedCode = typeof window !== 'undefined' ? localStorage.getItem(`code-dungeon-level-${selectedLevel.id}`) : null
    if (savedCode) {
      setCode(savedCode)
    } else {
      setCode(starterCode(selectedLevel.id))
    }
    setLogs([])
    setPlayer(selectedLevel.playerStart)
    setGrid(cloneGrid(selectedLevel.grid))
    setEnemies(cloneEnemies(selectedLevel.enemies))
    setCommandCount(0)
    setRunning(false)
    setVictoryState({ open: false, stars: 0 })
    setErrorState({ open: false, title: '', reason: '', suggestion: '' })
  }, [selectedLevel])

  function addLog(line: string) {
    setLogs((s) => [...s, line])
  }

  async function onRun() {
    if (!levelIsPlayable) {
      setErrorState({
        open: true,
        title: 'Fase em desenvolvimento',
        reason: 'Este nível faz parte de um mundo futuro e ainda não está jogável.',
        suggestion: 'Escolha uma fase marcada como Jogável na tela de mundos.',
      })
      return
    }

    setLogs([])
    setVictoryState({ open: false, stars: 0 })
    setErrorState({ open: false, title: '', reason: '', suggestion: '' })
    setCommandCount(0)
    const parsed = parseCommands(code)
    if ((parsed as any).error) {
      const errorInfo = parseErrorInfo((parsed as any).error)
      setErrorState({ open: true, ...errorInfo })
      addLog(errorInfo.reason)
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
        setCommandCount((current) => current + 1)
      },
      (err) => {
        const errorInfo = parseErrorInfo(err)
        setErrorState({ open: true, ...errorInfo })
        addLog(errorInfo.reason)
        setRunning(false)
      },
      ({ player: final, won }) => {
        setPlayer({ ...final })
        setRunning(false)
        if (won) {
          const stars = calculateStars(commands.length, selectedLevel.id)
          setVictoryState({ open: true, stars })
          addLog('Fase concluída com sucesso')
          return
        }

        addLog('Execução finalizada')
      }
    )
  }

  function onReset() {
    setPlayer(selectedLevel.playerStart)
    setGrid(cloneGrid(selectedLevel.grid))
    setEnemies(cloneEnemies(selectedLevel.enemies))
    setCommandCount(0)
    setLogs([])
    setRunning(false)
    setVictoryState({ open: false, stars: 0 })
    setErrorState({ open: false, title: '', reason: '', suggestion: '' })
  }

  function onRetryFromModal() {
    onReset()
  }

  const nextLevel = levels.find((level) => level.id === selectedLevel.id + 1)

  return (
    <div className="flex flex-col h-screen bg-bg">
      <VictoryModal
        isOpen={victoryState.open}
        levelName={selectedLevel.name}
        stars={victoryState.stars}
        commandCount={commandCount}
        onRetry={onRetryFromModal}
        nextLevelHref={nextLevel ? `/game?level=${nextLevel.id}` : undefined}
      />

      <ErrorModal
        isOpen={errorState.open}
        title={errorState.title}
        commandLabel={errorState.commandLabel}
        reason={errorState.reason}
        suggestion={errorState.suggestion}
        onRetry={onRetryFromModal}
      />

      <header className="flex items-center justify-between px-6 py-4 bg-panel border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">Code Dungeon — Fase {selectedLevel.id}</h1>
          <p className="text-sm text-secondaryText">{selectedLevel.name}</p>
        </div>
        <div className="space-x-2">
          <button onClick={() => router.push('/levels')} className="px-3 py-1.5 bg-floor text-primaryText border border-border rounded-md hover:bg-wall transition-colors">Niveis</button>
          <button onClick={onReset} className="px-3 py-1.5 bg-floor text-primaryText border border-border rounded-md hover:bg-wall transition-colors">Resetar</button>
          <button onClick={onRun} disabled={running} className="px-3 py-1.5 bg-magic text-bg border border-magic rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50">Executar</button>
        </div>
      </header>

      {!levelIsPlayable ? (
        <div className="px-6 py-3 border border-border bg-black/20 text-sm text-secondaryText">
          Esta fase é um preview do próximo mundo. Ela já aparece na lista para organizar a progressão,
          mas ainda está bloqueada enquanto os recursos de loops, if e funções são ampliados.
        </div>
      ) : null}

      <main className="flex-1 grid grid-cols-2 gap-3 p-3 overflow-hidden">
        {/* Grid - top left */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <div className="panel p-3 rounded-md flex-shrink-0">
            <h2 className="font-semibold text-sm mb-2">Objetivo</h2>
            <p className="text-xs text-secondaryText">{selectedLevel.objective}</p>
            <div className="mt-2 text-xs">
              <span className="text-secondaryText">Comandos: </span>
              <span>{selectedLevel.availableCommands.join(', ')}</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <DungeonGrid level={selectedLevel} playerX={player.x} playerY={player.y} enemies={enemies} />
          </div>
        </div>

        {/* Editor - top right */}
        <div className="panel p-3 rounded-md flex flex-col overflow-hidden">
          <h2 className="font-semibold text-sm mb-2">Editor</h2>
          <div className="flex-1 overflow-hidden">
            <CodeEditor value={code} onChange={setCode} disabled={running} />
          </div>
        </div>

        {/* Bottom row */}
      </main>

      <div className="grid grid-cols-2 gap-3 p-3 h-40 flex-shrink-0">
        {/* Legend - bottom left */}
        <div className="overflow-auto">
          <Legend />
        </div>

        {/* Console - bottom right */}
        <div className="panel p-3 rounded-md overflow-auto">
          <h3 className="font-semibold text-sm mb-2">Console</h3>
          <div className="font-mono text-xs space-y-1">
            {logs.map((l, i) => (
              <div key={i} className="text-slate-300 leading-relaxed">{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

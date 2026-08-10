import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import DungeonGrid from './DungeonGrid'
import Legend from './Legend'
import VictoryModal from './VictoryModal'
import ErrorModal from './ErrorModal'
import DocumentationModal from './DocumentationModal'
import CodeEditor from './CodeEditor'
import { getLevelById, levels } from '../../data/levels'
import { isSimpleCommandList, parseCommands } from '../../utils/commandParser'
import { executeCommands } from '../../utils/commandExecutor'
import { parseAdvancedCode } from '../../utils/advancedParser'
import { executeAdvancedCommands } from '../../utils/advancedExecutor'
import type { Expression, Program, Statement } from '../../utils/ast'
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

const STAR_COUNTED_COMMANDS = new Set(['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'look', 'print'])
const LANGUAGE_FEATURE_LABELS: Record<string, string> = {
  if: 'if',
  else: 'else',
  while: 'while (...)',
  for: 'for (...)',
  function: 'function name(...)',
  var: 'var',
  let: 'let',
  const: 'const',
  return: 'return',
}

function formatAvailableCommand(cmd: string) {
  return LANGUAGE_FEATURE_LABELS[cmd] ?? `${cmd}()`
}

function countExpressionCommands(expr?: Expression): number {
  if (!expr) return 0

  switch (expr.type) {
    case 'CallExpression':
      return (STAR_COUNTED_COMMANDS.has(expr.callee.name) ? 1 : 0) + expr.arguments.reduce((sum, arg) => sum + countExpressionCommands(arg), 0)
    case 'BinaryExpression':
    case 'LogicalExpression':
      return countExpressionCommands(expr.left) + countExpressionCommands(expr.right)
    case 'UnaryExpression':
      return countExpressionCommands(expr.argument)
    case 'AssignmentExpression':
      return countExpressionCommands(expr.left) + countExpressionCommands(expr.right)
    default:
      return 0
  }
}

function countStatementCommands(stmt: Statement): number {
  switch (stmt.type) {
    case 'ExpressionStatement':
      return countExpressionCommands(stmt.expression)
    case 'VariableDeclaration':
      return countExpressionCommands(stmt.value)
    case 'BlockStatement':
      return stmt.body.reduce((sum, child) => sum + countStatementCommands(child), 0)
    case 'IfStatement':
      return countExpressionCommands(stmt.condition)
        + countStatementCommands(stmt.consequent)
        + (stmt.alternate ? countStatementCommands(stmt.alternate) : 0)
    case 'WhileStatement':
      return countExpressionCommands(stmt.condition) + countStatementCommands(stmt.body)
    case 'ForStatement':
      return (stmt.init && (stmt.init as any).type === 'VariableDeclaration'
        ? countStatementCommands(stmt.init as Statement)
        : countExpressionCommands(stmt.init as Expression | undefined))
        + countExpressionCommands(stmt.condition)
        + countExpressionCommands(stmt.update)
        + countStatementCommands(stmt.body)
    case 'FunctionDeclaration':
      return countStatementCommands(stmt.body)
    case 'ReturnStatement':
      return countExpressionCommands(stmt.argument)
    default:
      return 0
  }
}

function countAdvancedCommands(program: Program) {
  return program.body.reduce((sum, stmt) => sum + countStatementCommands(stmt), 0)
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
    case 11:
      return 'let steps = 0;\n\nturnLeft();\nmoveForward();\nturnRight();\n\nwhile (steps < 3) {\n  moveForward();\n  steps++;\n}'
    case 12:
      return 'for (let i = 0; i < 2; i++) {\n  moveForward();\n}\nturnRight();\nfor (let i = 0; i < 3; i++) {\n  moveForward();\n}'
    case 999:
      return '// 🌀 Labirinto Procedural\n// Explore e encontre a saída!\n// Todas as funcionalidades estão disponíveis.\n\nfor (let i = 0; i < 5; i++) {\n  moveForward();\n}'
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
  const [docOpen, setDocOpen] = useState(false)
  const [introOpen, setIntroOpen] = useState(false)
  const [introLines, setIntroLines] = useState<string[]>([])

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
    // Construir texto introdutório para o nível atual
    const buildIntro = (lvl: any) => {
      const lines: string[] = []
      if (lvl.description) lines.push(lvl.description)
      if (lvl.objective) lines.push(`Objetivo: ${lvl.objective}`)

      const tiles = new Set<string>()
      for (const row of lvl.grid) {
        for (const t of row) {
          if (t !== 'FLOOR' && t !== 'WALL') tiles.add(t)
        }
      }

      if ((lvl.enemies ?? []).length > 0) tiles.add('ENEMY')

      const mechanics: string[] = []
      if (tiles.has('SPIKE')) mechanics.push('Células com espinhos: evite pisar nelas.')
      if (tiles.has('KEY') || tiles.has('DOOR')) mechanics.push('Chaves e portas: use `grabKey()` e `openDoor()` para desbloquear caminhos.')
      if (tiles.has('CHEST')) mechanics.push('Baús: abra com `openChest()` para obter itens.')
      if (tiles.has('ENEMY')) mechanics.push('Inimigos: use `attack()` para derrotá-los antes de avançar.')
      if (lvl.availableCommands?.includes('look')) mechanics.push('Comando `look()`: permite ler o tile à frente e tomar decisões.')

      if (mechanics.length) {
        lines.push('Mecânicas nesta fase:')
        for (const m of mechanics) lines.push(`- ${m}`)
      }

      // Descrições curtas para cada comando disponível
      const cmdDescriptions: Record<string, string> = {
        moveForward: 'Avança uma casa à frente (moveForward()).',
        turnLeft: 'Gira 90° à esquerda (turnLeft()).',
        turnRight: 'Gira 90° à direita (turnRight()).',
        attack: 'Ataca o inimigo na célula à frente (attack()).',
        grabKey: 'Coleta uma chave na célula atual (grabKey()).',
        openDoor: 'Abre a porta à frente se você tiver chave (openDoor()).',
        openChest: 'Abre o baú à frente (openChest()).',
        look: 'Retorna o tipo do tile à frente (look()).',
        print: 'Imprime valores no console para depuração (print(x)).',
        while: 'Repete um bloco enquanto a condicao for verdadeira.',
        for: 'Repete um bloco com contador de inicio, condicao e atualizacao.',
        if: 'Executa um bloco quando a condicao for verdadeira.',
        else: 'Define o caminho alternativo de um if.',
        function: 'Agrupa comandos reutilizaveis.',
        var: 'Declara uma variavel.',
        let: 'Declara uma variavel de controle.',
        const: 'Declara um valor constante.',
        return: 'Retorna um valor de uma funcao.',
      }

      if (lvl.availableCommands && lvl.availableCommands.length) {
        lines.push('Recursos disponiveis:')
        for (const cmd of lvl.availableCommands) {
          const desc = cmdDescriptions[cmd] ?? ''
          lines.push(`- ${formatAvailableCommand(cmd)}: ${desc}`)
        }
      }

      return lines
    }

    setIntroLines(buildIntro(selectedLevel))
    setIntroOpen(true)
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

    // Detectar se o código é apenas uma lista de comandos simples do tipo `cmd();`.
    // Se não for, usar o parser/executor avançado (cobre expressões, print(args), comparações, etc.).
    const simpleCommandsOnly = isSimpleCommandList(code)
    const usesAdvanced = !simpleCommandsOnly

    try {
      setRunning(true)

      if (usesAdvanced) {
        // Usar novo parser e executor
        const program = parseAdvancedCode(code)
        const sourceCommandCount = countAdvancedCommands(program)
        let commandsExecuted = 0

        await executeAdvancedCommands(
          program,
          selectedLevel,
          ({ command, player: p, grid: nextGrid, enemies: nextEnemies, message }) => {
            if (message) addLog(String(message))
            addLog(`${command} executado`)
            setPlayer({ ...p })
            setGrid(nextGrid)
            setEnemies(nextEnemies)
            commandsExecuted += 1
            setCommandCount(commandsExecuted)
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
              setCommandCount(sourceCommandCount)
              const stars = calculateStars(sourceCommandCount, selectedLevel.id)
              setVictoryState({ open: true, stars })
              addLog('Fase concluída com sucesso')
              return
            }
            addLog('Execução finalizada')
          }
        )
      } else {
        // Usar parser simples original
        const parsed = parseCommands(code, selectedLevel.availableCommands)
        if ((parsed as any).error) {
          const errorInfo = parseErrorInfo((parsed as any).error)
          setErrorState({ open: true, ...errorInfo })
          addLog(errorInfo.reason)
          setRunning(false)
          return
        }
        const commands = (parsed as any).commands as string[]

        await executeCommands(
          commands,
          selectedLevel,
          ({ command, player: p, grid: nextGrid, enemies: nextEnemies, message }) => {
            if (message) addLog(String(message))
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
    } catch (error) {
      const errorInfo = parseErrorInfo(error instanceof Error ? error.message : String(error))
      setErrorState({ open: true, ...errorInfo })
      addLog(errorInfo.reason)
      setRunning(false)
    }
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

      <DocumentationModal isOpen={docOpen} onClose={() => setDocOpen(false)} />

      {introOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-panel/95 shadow-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-magic">Novidades da fase</p>
                <h3 className="mt-2 text-lg font-black text-primaryText">{selectedLevel.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIntroOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-floor text-primaryText transition hover:border-magic/60 hover:bg-wall"
                aria-label="Fechar modal"
              >
                X
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-secondaryText">
              {introLines.map((line, i) => (
                <p key={i} className={line.startsWith('- ') ? 'ml-3' : ''}>{line}</p>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={() => setIntroOpen(false)} className="px-4 py-2 rounded-md bg-magic text-bg font-semibold">Entendi — começar</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-4 bg-panel border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">Code Dungeon — Fase {selectedLevel.id}</h1>
          <p className="text-sm text-secondaryText">{selectedLevel.name}</p>
        </div>
        <div className="space-x-2">
          <button onClick={() => setDocOpen(true)} className="px-3 py-1.5 bg-floor text-primaryText border border-border rounded-md hover:bg-wall transition-colors">? Ajuda</button>
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

      <main className="flex-1 min-h-0 overflow-hidden p-3">
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
          <section className="flex min-h-0 flex-col gap-4 overflow-hidden">
            <div className="panel flex-shrink-0 rounded-xl border border-white/5 bg-panel/95 p-4 shadow-[0_18px_50px_rgba(2,6,23,0.35)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-magic">Leitura da fase</p>
                  <h2 className="mt-2 text-sm font-semibold text-primaryText">Objetivo</h2>
                  <p className="mt-1 text-sm leading-relaxed text-secondaryText">{selectedLevel.objective}</p>
                </div>

                <div className="min-w-0 flex-1 rounded-xl border border-white/5 bg-black/20 p-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-primaryText">Recursos disponíveis</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedLevel.availableCommands.map((cmd: string) => (
                      <span
                        key={cmd}
                        className="rounded-md border border-magic/50 bg-magic/15 px-2.5 py-1 text-xs font-mono text-magic transition-colors hover:bg-magic/25"
                      >
                        {formatAvailableCommand(cmd)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-white/5 bg-panel/90 shadow-[0_18px_50px_rgba(2,6,23,0.35)]">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-primaryText">Mapa da fase</h2>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-white/5 bg-black/15 p-2">
                  <DungeonGrid
                    level={selectedLevel}
                    playerX={player.x}
                    playerY={player.y}
                    playerDirection={player.direction}
                    enemies={enemies}
                    isRunning={running}
                    hideWalls={false}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/5 bg-panel/95 shadow-[0_18px_50px_rgba(2,6,23,0.35)]">
            <div className="flex-shrink-0 border-b border-white/5 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-magic">Área de código</p>
              <h2 className="mt-1 text-sm font-semibold text-primaryText">Editor</h2>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden p-3">
              <CodeEditor value={code} onChange={setCode} disabled={running} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

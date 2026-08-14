import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import DungeonGrid from './DungeonGrid'
import VictoryModal from './VictoryModal'
import ErrorModal from './ErrorModal'
import DocumentationModal from './DocumentationModal'
import CodeEditor from './CodeEditor'
import PixelButton from '../ui/PixelButton'
import PixelFrame from '../ui/PixelFrame'
import PixelIcon from '../ui/PixelIcon'
import PixelPanel from '../ui/PixelPanel'
import { UI_SPRITES } from '../../game/ui/uiSprites'
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
    <div className="pixel-app flex min-h-screen flex-col overflow-hidden">
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
        <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <PixelPanel
            variant="modal"
            className="relative w-full max-w-2xl"
            eyebrow="Novidades da fase"
            title={selectedLevel.name}
            headerAction={
              <PixelButton
                type="button"
                icon="reset"
                variant="ghost"
                size="sm"
                onClick={() => setIntroOpen(false)}
                aria-label="Fechar modal"
              >
                Fechar
              </PixelButton>
            }
          >
            <div className="space-y-2 text-sm leading-6 text-secondaryText">
              {introLines.map((line, i) => (
                <p key={i} className={line.startsWith('- ') ? 'ml-3 font-mono text-xs text-primaryText' : ''}>{line}</p>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <PixelButton type="button" icon="play" variant="primary" onClick={() => setIntroOpen(false)}>
                Entendi
              </PixelButton>
            </div>
          </PixelPanel>
        </div>
      )}

      {!levelIsPlayable ? (
        <div className="border-b-2 border-border bg-black px-4 py-3 text-sm text-secondaryText">
          Esta fase e um preview do proximo mundo. Ela ja aparece na lista para organizar a progressao,
          mas ainda esta bloqueada enquanto os recursos de loops, if e funcoes sao ampliados.
        </div>
      ) : null}

      <main className="min-h-0 flex-1 overflow-auto p-3">
        <div className="mx-auto grid min-h-full max-w-[1500px] gap-3 lg:grid-rows-[auto_minmax(0,1fr)_auto]">
          <PixelPanel variant="hud" className="shrink-0" bodyClassName="p-3">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-primaryText bg-black">
                  <PixelIcon sprite={UI_SPRITES.icons.target} scale={1} />
                </div>
                <div className="min-w-0">
                  <p className="pixel-eyebrow">Objetivo da fase</p>
                  <p className="text-sm leading-6 text-secondaryText">{selectedLevel.objective}</p>
                </div>
              </div>

              <div className="min-w-0">
                <p className="pixel-eyebrow">Recursos disponiveis</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLevel.availableCommands.map((cmd: string) => (
                    <span key={cmd} className="pixel-command-chip">
                      {formatAvailableCommand(cmd)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </PixelPanel>

          <div className="grid min-h-[520px] gap-3 lg:min-h-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
            <PixelPanel variant="default" title="Dungeon" eyebrow="Mapa da fase" className="min-h-[440px] overflow-hidden" bodyClassName="h-[calc(100%-4.5rem)] p-3">
              <PixelFrame className="min-h-[360px]">
                <DungeonGrid
                  level={selectedLevel}
                  grid={grid}
                  playerX={player.x}
                  playerY={player.y}
                  playerDirection={player.direction}
                  enemies={enemies}
                  isRunning={running}
                  hideWalls={false}
                />
              </PixelFrame>
            </PixelPanel>

            <PixelPanel
              variant="editor"
              title="Editor"
              eyebrow="Area de codigo"
              className="min-h-[440px] overflow-hidden"
              bodyClassName="h-[calc(100%-4.5rem)] p-3"
              headerAction={
                <div className="pixel-type flex items-center gap-2 text-xs text-secondaryText">
                  <PixelIcon sprite={UI_SPRITES.icons.save} scale={1} />
                  Salvo
                </div>
              }
            >
              <CodeEditor value={code} onChange={setCode} disabled={running} />
            </PixelPanel>
          </div>

          <div className="grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex flex-wrap gap-2">
              <PixelButton type="button" icon="play" variant="primary" onClick={onRun} disabled={running}>
                {running ? 'Executando' : 'Executar'}
              </PixelButton>
              <PixelButton type="button" icon="reset" variant="danger" onClick={onReset}>
                Resetar
              </PixelButton>
              <PixelButton type="button" icon="help" onClick={() => setDocOpen(true)}>
                Ajuda
              </PixelButton>
              <PixelButton href="/levels" icon="list">
                Fases
              </PixelButton>
            </div>

            <PixelPanel variant="console" title="Console" className="min-h-[128px]" bodyClassName="max-h-40 overflow-auto p-3">
              <div className="font-mono text-xs leading-6 text-secondaryText">
                {logs.length ? (
                  logs.map((line, index) => (
                    <div key={`${line}-${index}`}>
                      <span className="text-primaryText">&gt;</span> {line}
                    </div>
                  ))
                ) : (
                  <div><span className="text-primaryText">&gt;</span> aguardando execucao</div>
                )}
              </div>
            </PixelPanel>
          </div>
        </div>
      </main>
    </div>
  )
}

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
import { getIntroLines, localizeLevel, useI18n } from '../../i18n'
import { isSimpleCommandList, parseCommands } from '../../utils/commandParser'
import { executeCommands } from '../../utils/commandExecutor'
import { parseAdvancedCode } from '../../utils/advancedParser'
import { executeAdvancedCommands } from '../../utils/advancedExecutor'
import type { Expression, Program, Statement } from '../../utils/ast'
import { Enemy, PlayerAnimationState, TileType } from '../../types/game'
import { INITIAL_SPIKES_ACTIVE } from '../../game/tiles/spikeConfig'

function cloneGrid(grid: TileType[][]) {
  return grid.map((row) => [...row])
}

function cloneEnemies(enemies: Enemy[]) {
  return enemies.map((enemy) => ({ ...enemy }))
}

function cellKey(x: number, y: number) {
  return `${x}-${y}`
}

function createInitialRevealedCells(level: ReturnType<typeof getLevelById>) {
  return new Set([cellKey(level.playerStart.x, level.playerStart.y)])
}

function createHiddenCellKeys(level: ReturnType<typeof getLevelById>) {
  return new Set((level.hiddenCells ?? []).map(({ x, y }) => cellKey(x, y)))
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

  if (message.includes('Celula vazia')) {
    return {
      title: 'Celula vazia',
      reason: message,
      suggestion: 'Esse espaco nao tem tile para caminhar. Use look() e escolha outra rota.',
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

function parseLocalizedErrorInfo(message: string, t: (key: string, params?: Record<string, string | number>) => string): ExecutionErrorInfo {
  const commandMatch = message.match(/comando\s+(\d+):\s*([a-zA-Z0-9_]+\(\))/i)
  const commandLabel = commandMatch ? t('error.commandLabel', { index: commandMatch[1], command: commandMatch[2] }) : undefined
  const normalized = message
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  const build = (key: string): ExecutionErrorInfo => ({
    title: t(`error.${key}.title`),
    reason: t(`error.${key}.reason`),
    suggestion: t(`error.${key}.suggestion`),
    commandLabel,
  })

  if (normalized.includes('nenhum comando detectado')) {
    return {
      title: t('error.empty.title'),
      reason: t('error.empty.reason'),
      suggestion: t('error.empty.suggestion'),
    }
  }

  if (normalized.includes('comando inv')) return build('invalid')
  if (normalized.includes('fora do mapa') || normalized.includes('out_of_bounds')) return build('outOfBounds')
  if (normalized.includes('parede') || normalized.includes('wall')) return build('wall')
  if (normalized.includes('celula vazia') || normalized.includes('void')) return build('void')
  if (normalized.includes('espinhos') || normalized.includes('spike')) return build('spike')
  if (normalized.includes('inimigo') || normalized.includes('enemy')) return build('enemy')
  if (normalized.includes('chave') || normalized.includes('key')) return build('key')
  if (normalized.includes('porta') || normalized.includes('door')) return build('door')
  if (normalized.includes('bau') || normalized.includes('chest')) return build('chest')

  return {
    title: t('error.generic.title'),
    reason: message,
    suggestion: t('error.generic.suggestion'),
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

function formatRequirementList(commands: string[]) {
  return commands.map(formatAvailableCommand).join(', ')
}

function collectExpressionFeatures(expr: Expression | undefined, used: Set<string>) {
  if (!expr) return

  switch (expr.type) {
    case 'CallExpression':
      used.add(expr.callee.name)
      for (const arg of expr.arguments) collectExpressionFeatures(arg, used)
      break
    case 'BinaryExpression':
    case 'LogicalExpression':
      collectExpressionFeatures(expr.left, used)
      collectExpressionFeatures(expr.right, used)
      break
    case 'UnaryExpression':
      collectExpressionFeatures(expr.argument, used)
      break
    case 'AssignmentExpression':
      collectExpressionFeatures(expr.right, used)
      break
    default:
      break
  }
}

function collectStatementFeatures(stmt: Statement, used: Set<string>) {
  switch (stmt.type) {
    case 'ExpressionStatement':
      collectExpressionFeatures(stmt.expression, used)
      break
    case 'VariableDeclaration':
      used.add('let')
      collectExpressionFeatures(stmt.value, used)
      break
    case 'BlockStatement':
      for (const child of stmt.body) collectStatementFeatures(child, used)
      break
    case 'IfStatement':
      used.add('if')
      collectExpressionFeatures(stmt.condition, used)
      collectStatementFeatures(stmt.consequent, used)
      if (stmt.alternate) {
        used.add('else')
        collectStatementFeatures(stmt.alternate, used)
      }
      break
    case 'WhileStatement':
      used.add('while')
      collectExpressionFeatures(stmt.condition, used)
      collectStatementFeatures(stmt.body, used)
      break
    case 'ForStatement':
      used.add('for')
      if (stmt.init) {
        if ((stmt.init as any).type === 'VariableDeclaration') {
          collectStatementFeatures(stmt.init as Statement, used)
        } else {
          collectExpressionFeatures(stmt.init as Expression, used)
        }
      }
      collectExpressionFeatures(stmt.condition, used)
      collectExpressionFeatures(stmt.update, used)
      collectStatementFeatures(stmt.body, used)
      break
    case 'FunctionDeclaration':
      used.add('function')
      collectStatementFeatures(stmt.body, used)
      break
    case 'ReturnStatement':
      used.add('return')
      collectExpressionFeatures(stmt.argument, used)
      break
    default:
      break
  }
}

function collectProgramFeatures(program: Program) {
  const used = new Set<string>()
  for (const stmt of program.body) collectStatementFeatures(stmt, used)
  return used
}

function getMissingRequiredCommands(requiredCommands: string[] | undefined, usedCommands: Set<string>) {
  return (requiredCommands ?? []).filter((cmd) => !usedCommands.has(cmd))
}

function buildRequirementError(missingCommands: string[]): ExecutionErrorInfo {
  const formatted = formatRequirementList(missingCommands)
  return {
    title: 'Recurso obrigatorio',
    reason: `Esta fase exige: ${formatted}.`,
    suggestion: 'Inclua os recursos obrigatorios na solucao e execute novamente.',
  }
}

function buildLocalizedRequirementError(
  missingCommands: string[],
  t: (key: string, params?: Record<string, string | number>) => string
): ExecutionErrorInfo {
  const formatted = formatRequirementList(missingCommands)
  return {
    title: t('game.requirementTitle'),
    reason: t('game.requirementReason', { items: formatted }),
    suggestion: t('game.requirementSuggestion'),
  }
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
      return 'if (look() == "ENEMY") {\n  attack();\n}\n\nmoveForward();\nmoveForward();\ngrabKey();\nopenChest();\nturnLeft();\nmoveForward();\nopenDoor();'
    case 12:
      return 'if (look() == "KEY") {\n  moveForward();\n} else {\n  turnRight();\n}\n\ngrabKey();\nmoveForward();\nmoveForward();\nturnLeft();\nopenChest();\nturnRight();\nopenDoor();\nmoveForward();\nturnLeft();\nmoveForward();'
    case 13:
      return 'if (look() == "KEY") {\n  moveForward();\n} else {\n  turnRight();\n}\n\ngrabKey();\nmoveForward();\n\nif (look() == "ENEMY") {\n  attack();\n}\n\nmoveForward();\nturnLeft();\nopenChest();\nturnRight();\nopenDoor();'
    case 14:
      return 'moveForward();\ngrabKey();\n\nlet steps = 0;\nwhile (steps < 2) {\n  moveForward();\n  steps++;\n}\n\nattack();\nmoveForward();\n\nsteps = 0;\nwhile (steps < 2) {\n  moveForward();\n  steps++;\n}\n\nturnLeft();\nopenChest();\nmoveForward();\nopenDoor();'
    case 15:
      return 'moveForward();\ngrabKey();\n\nfor (let i = 0; i < 2; i++) {\n  moveForward();\n}\n\nattack();\nmoveForward();\nturnLeft();\n\nfor (let i = 0; i < 2; i++) {\n  moveForward();\n}\n\nturnLeft();\nfor (let i = 0; i < 3; i++) {\n  moveForward();\n}\n\nopenChest();\nturnRight();\nmoveForward();\nopenDoor();'
    case 16:
      return 'function step() {\n  moveForward();\n}\n\nfunction loot() {\n  openChest();\n}\n\nfunction unlock() {\n  openDoor();\n}\n\ngrabKey();\nstep();'
    case 17:
      return 'function step() {\n  moveForward();\n}\n\nfunction collect() {\n  grabKey();\n}\n\nfunction loot() {\n  openChest();\n}\n\nfunction unlock() {\n  openDoor();\n}\n\nstep();\nstep();\ncollect();'
    case 18:
      return 'function step() {\n  moveForward();\n}\n\nfunction clearAndStep() {\n  attack();\n  moveForward();\n}\n\nfunction loot() {\n  openChest();\n}\n\nfunction unlock() {\n  openDoor();\n}\n\ngrabKey();'
    case 19:
      return 'function walk(times) {\n  for (let i = 0; i < times; i++) {\n    moveForward();\n  }\n}\n\nfunction clearAndStep() {\n  if (look() == "ENEMY") {\n    attack();\n  } else {\n    print(look());\n  }\n  moveForward();\n}\n\nfunction loot() {\n  openChest();\n}\n\nfunction unlock() {\n  openDoor();\n}\n\ngrabKey();'
    case 999:
      return '// 🌀 Labirinto Procedural\n// Explore e encontre a saída!\n// Todas as funcionalidades estão disponíveis.\n\nfor (let i = 0; i < 5; i++) {\n  moveForward();\n}'
    default:
      return 'moveForward();'
  }
}

export default function GamePage() {
  const router = useRouter()
  const { locale, t } = useI18n()
  const selectedBaseLevel = useMemo(() => {
    const rawLevel = Array.isArray(router.query.level) ? router.query.level[0] : router.query.level
    const parsedLevel = Number(rawLevel ?? 1)
    return getLevelById(Number.isFinite(parsedLevel) ? parsedLevel : 1)
  }, [router.query.level])
  const selectedLevel = useMemo(() => localizeLevel(selectedBaseLevel, locale), [locale, selectedBaseLevel])
  const hiddenCellKeys = useMemo(() => createHiddenCellKeys(selectedBaseLevel), [selectedBaseLevel])
  const levelIsPlayable = selectedBaseLevel.isPlayable !== false

  const getInitialCode = () => {
    if (typeof window !== 'undefined') {
      const savedCode = localStorage.getItem(`code-dungeon-level-${selectedBaseLevel.id}`)
      if (savedCode) {
        return savedCode
      }
    }
    return starterCode(selectedBaseLevel.id)
  }

  const [code, setCode] = useState(getInitialCode())
  const [logs, setLogs] = useState<string[]>([])
  const [player, setPlayer] = useState(selectedBaseLevel.playerStart)
  const [playerAnimationState, setPlayerAnimationState] = useState<PlayerAnimationState>('idle')
  const [grid, setGrid] = useState(() => cloneGrid(selectedBaseLevel.grid))
  const [enemies, setEnemies] = useState(() => cloneEnemies(selectedBaseLevel.enemies))
  const [revealedCells, setRevealedCells] = useState(() => createInitialRevealedCells(selectedBaseLevel))
  const [spikesActive, setSpikesActive] = useState(INITIAL_SPIKES_ACTIVE)
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
      localStorage.setItem(`code-dungeon-level-${selectedBaseLevel.id}`, code)
    }
  }, [code, selectedBaseLevel.id])

  // Resetar apenas o estado do jogo quando muda de nível
  useEffect(() => {
    const savedCode = typeof window !== 'undefined' ? localStorage.getItem(`code-dungeon-level-${selectedBaseLevel.id}`) : null
    if (savedCode) {
      setCode(savedCode)
    } else {
      setCode(starterCode(selectedBaseLevel.id))
    }
    setLogs([])
    setPlayer(selectedBaseLevel.playerStart)
    setPlayerAnimationState('idle')
    setGrid(cloneGrid(selectedBaseLevel.grid))
    setEnemies(cloneEnemies(selectedBaseLevel.enemies))
    setRevealedCells(createInitialRevealedCells(selectedBaseLevel))
    setSpikesActive(INITIAL_SPIKES_ACTIVE)
    setCommandCount(0)
    setRunning(false)
    setVictoryState({ open: false, stars: 0 })
    setErrorState({ open: false, title: '', reason: '', suggestion: '' })
    setIntroLines(getIntroLines(selectedLevel, locale, t))
    setIntroOpen(true)
  }, [locale, selectedBaseLevel, selectedLevel, t])

  function addLog(line: string) {
    setLogs((s) => [...s, line])
  }

  async function onRun() {
    if (!levelIsPlayable) {
      setErrorState({
        open: true,
        title: t('game.devTitle'),
        reason: t('game.devReason'),
        suggestion: t('game.devSuggestion'),
      })
      return
    }

    setLogs([])
    setVictoryState({ open: false, stars: 0 })
    setErrorState({ open: false, title: '', reason: '', suggestion: '' })
    setCommandCount(0)
    setPlayerAnimationState('idle')
    setSpikesActive(INITIAL_SPIKES_ACTIVE)
    setRevealedCells(createInitialRevealedCells(selectedBaseLevel))

    // Detectar se o código é apenas uma lista de comandos simples do tipo `cmd();`.
    // Se não for, usar o parser/executor avançado (cobre expressões, print(args), comparações, etc.).
    const simpleCommandsOnly = isSimpleCommandList(code)
    const usesAdvanced = !simpleCommandsOnly

    try {
      setRunning(true)

      if (usesAdvanced) {
        // Usar novo parser e executor
        const program = parseAdvancedCode(code)
        const usedCommands = collectProgramFeatures(program)
        const missingCommands = getMissingRequiredCommands(selectedBaseLevel.requiredCommands, usedCommands)
        if (missingCommands.length) {
          const errorInfo = buildLocalizedRequirementError(missingCommands, t)
          setErrorState({ open: true, ...errorInfo })
          addLog(errorInfo.reason)
          setRunning(false)
          return
        }

        const sourceCommandCount = countAdvancedCommands(program)
        let commandsExecuted = 0

        await executeAdvancedCommands(
          program,
          selectedBaseLevel,
          ({ command, player: p, grid: nextGrid, enemies: nextEnemies, spikesActive: nextSpikesActive, message }) => {
            if (message) addLog(String(message))
            addLog(t('game.commandExecuted', { command }))
            setPlayer({ ...p })
            setPlayerAnimationState(command === 'moveForward' ? 'walk' : 'idle')
            setGrid(nextGrid)
            setEnemies(nextEnemies)
            setRevealedCells((current) => new Set(current).add(cellKey(p.x, p.y)))
            setSpikesActive(nextSpikesActive)
            commandsExecuted += 1
            setCommandCount(commandsExecuted)
          },
          (err) => {
            const errorInfo = parseLocalizedErrorInfo(err, t)
            setErrorState({ open: true, ...errorInfo })
            addLog(errorInfo.reason)
            setPlayerAnimationState('idle')
            setRunning(false)
          },
          ({ player: final, won }) => {
            setPlayer({ ...final })
            setPlayerAnimationState('idle')
            setRunning(false)
            if (won) {
              setCommandCount(sourceCommandCount)
              const stars = calculateStars(sourceCommandCount, selectedBaseLevel.id)
              setVictoryState({ open: true, stars })
              addLog(t('game.completedLog'))
              return
            }
            addLog(t('game.finishedLog'))
          }
        )
      } else {
        // Usar parser simples original
        const parsed = parseCommands(code, selectedBaseLevel.availableCommands)
        if ((parsed as any).error) {
          const errorInfo = parseLocalizedErrorInfo((parsed as any).error, t)
          setErrorState({ open: true, ...errorInfo })
          addLog(errorInfo.reason)
          setRunning(false)
          return
        }
        const commands = (parsed as any).commands as string[]
        const usedCommands = new Set(commands)
        const missingCommands = getMissingRequiredCommands(selectedBaseLevel.requiredCommands, usedCommands)
        if (missingCommands.length) {
          const errorInfo = buildLocalizedRequirementError(missingCommands, t)
          setErrorState({ open: true, ...errorInfo })
          addLog(errorInfo.reason)
          setRunning(false)
          return
        }

        await executeCommands(
          commands,
          selectedBaseLevel,
          ({ command, player: p, grid: nextGrid, enemies: nextEnemies, spikesActive: nextSpikesActive, message }) => {
            if (message) addLog(String(message))
            addLog(t('game.commandExecuted', { command }))
            setPlayer({ ...p })
            setPlayerAnimationState(command === 'moveForward' ? 'walk' : 'idle')
            setGrid(nextGrid)
            setEnemies(nextEnemies)
            setRevealedCells((current) => new Set(current).add(cellKey(p.x, p.y)))
            setSpikesActive(nextSpikesActive)
            setCommandCount((current) => current + 1)
          },
          (err) => {
            const errorInfo = parseLocalizedErrorInfo(err, t)
            setErrorState({ open: true, ...errorInfo })
            addLog(errorInfo.reason)
            setPlayerAnimationState('idle')
            setRunning(false)
          },
          ({ player: final, won }) => {
            setPlayer({ ...final })
            setPlayerAnimationState('idle')
            setRunning(false)
            if (won) {
              const stars = calculateStars(commands.length, selectedBaseLevel.id)
              setVictoryState({ open: true, stars })
              addLog(t('game.completedLog'))
              return
            }

            addLog(t('game.finishedLog'))
          }
        )
      }
    } catch (error) {
      const errorInfo = parseLocalizedErrorInfo(error instanceof Error ? error.message : String(error), t)
      setErrorState({ open: true, ...errorInfo })
      addLog(errorInfo.reason)
      setPlayerAnimationState('idle')
      setRunning(false)
    }
  }

  function onReset() {
    setPlayer(selectedBaseLevel.playerStart)
    setPlayerAnimationState('idle')
    setGrid(cloneGrid(selectedBaseLevel.grid))
    setEnemies(cloneEnemies(selectedBaseLevel.enemies))
    setRevealedCells(createInitialRevealedCells(selectedBaseLevel))
    setSpikesActive(INITIAL_SPIKES_ACTIVE)
    setCommandCount(0)
    setLogs([])
    setRunning(false)
    setVictoryState({ open: false, stars: 0 })
    setErrorState({ open: false, title: '', reason: '', suggestion: '' })
  }

  function onRetryFromModal() {
    onReset()
  }

  const nextLevel = levels.find((level) => level.id === selectedBaseLevel.id + 1)

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

      <DocumentationModal
        isOpen={docOpen}
        onClose={() => setDocOpen(false)}
        availableCommands={selectedBaseLevel.availableCommands}
      />

      {introOpen && (
        <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <PixelPanel
            variant="modal"
            className="relative w-full max-w-2xl"
            eyebrow={t('game.introEyebrow')}
            title={selectedLevel.name}
            headerAction={
              <PixelButton
                type="button"
                icon="reset"
                variant="ghost"
                size="sm"
                onClick={() => setIntroOpen(false)}
                aria-label={t('common.close')}
              >
                {t('common.close')}
              </PixelButton>
            }
          >
            <div className="space-y-2 text-xs leading-6 text-secondaryText max-h-80 overflow-y-auto">
              {introLines.map((line, i) => {
                const isCodeLine = line.includes(';') || line.endsWith('{') || line === '}' || line.startsWith('  ')
                const isExampleLabel = line === t('game.example')

                return (
                  <p
                    key={i}
                    className={
                      isCodeLine
                        ? 'whitespace-pre-wrap border border-border/70 bg-bg px-2 py-1 font-mono text-[10px] leading-5 text-primaryText'
                        : isExampleLabel
                          ? 'pixel-type pt-2 text-[10px] text-primaryText'
                          : line.startsWith('- ')
                            ? 'ml-3 font-mono text-[10px] text-primaryText'
                            : ''
                    }
                  >
                    {line}
                  </p>
                )
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <PixelButton type="button" icon="play" variant="primary" onClick={() => setIntroOpen(false)}>
                {t('common.understood')}
              </PixelButton>
            </div>
          </PixelPanel>
        </div>
      )}

      {!levelIsPlayable ? (
        <div className="border-b-2 border-border bg-black px-4 py-3 text-xs leading-6 text-secondaryText">
          {t('game.previewBanner')}
        </div>
      ) : null}

      <main className="min-h-0 flex-1 overflow-hidden p-2 sm:p-3">
        <div className="mx-auto grid h-full min-h-0 max-w-[1500px] grid-rows-[auto_minmax(0,1fr)_auto] gap-2 sm:gap-3">
          <PixelPanel variant="hud" className="min-h-0 shrink-0 overflow-hidden" bodyClassName="p-2 sm:p-3">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-primaryText bg-black">
                  <PixelIcon sprite={UI_SPRITES.icons.target} scale={1} />
                </div>
                <div className="min-w-0">
                  <p className="pixel-eyebrow">{t('game.phaseGoal')}</p>
                  <p className="text-xs leading-6 text-secondaryText">{selectedLevel.objective}</p>
                </div>
              </div>

              <div className="min-w-0">
                <p className="pixel-eyebrow">{t('game.availableFeatures')}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBaseLevel.availableCommands.map((cmd: string) => (
                    <span key={cmd} className="pixel-command-chip">
                      {formatAvailableCommand(cmd)}
                    </span>
                  ))}
                </div>
                {selectedBaseLevel.requiredCommands?.length ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="pixel-eyebrow">{t('game.required')}</span>
                    {selectedBaseLevel.requiredCommands.map((cmd: string) => (
                      <span key={cmd} className="border border-primaryText bg-black px-2 py-1 font-mono text-[10px] font-black uppercase text-primaryText">
                        {formatAvailableCommand(cmd)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </PixelPanel>

          <div className="grid min-h-0 grid-rows-[minmax(0,0.72fr)_minmax(0,1.28fr)] gap-2 sm:gap-3 lg:grid-cols-[minmax(280px,0.82fr)_minmax(360px,1.18fr)] lg:grid-rows-none">
            <PixelPanel variant="default" title={t('game.dungeon')} eyebrow={t('game.mapEyebrow')} className="min-h-0 overflow-hidden" bodyClassName="h-[calc(100%-4.5rem)] min-h-0 p-1.5 sm:p-2">
              <PixelFrame className="min-h-0 compact">
                <DungeonGrid
                  level={selectedBaseLevel}
                  grid={grid}
                  playerX={player.x}
                  playerY={player.y}
                  playerDirection={player.direction}
                  playerAnimationState={playerAnimationState}
                  enemies={enemies}
                  isRunning={running}
                  hideWalls={selectedBaseLevel.hideWalls ?? false}
                  hiddenCellKeys={hiddenCellKeys}
                  revealedCells={revealedCells}
                  spikesActive={spikesActive}
                />
              </PixelFrame>
            </PixelPanel>

            <PixelPanel
              variant="editor"
              title={t('game.editor')}
              eyebrow={t('game.codeArea')}
              className="flex h-full min-h-0 max-h-full flex-col overflow-hidden"
              bodyClassName="flex min-h-0 max-h-full flex-1 overflow-hidden p-2 sm:p-3"
              headerAction={
                <div className="pixel-type flex items-center gap-2 text-[10px] text-secondaryText">
                  <PixelIcon sprite={UI_SPRITES.icons.save} scale={1} />
                  {t('common.saved')}
                </div>
              }
            >
              <CodeEditor value={code} onChange={setCode} disabled={running} />
            </PixelPanel>
          </div>

          <div className="grid min-h-0 gap-2 sm:gap-3 xl:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex min-h-0 flex-wrap content-start gap-2">
              <PixelButton type="button" icon="play" variant="primary" onClick={onRun} disabled={running}>
                {running ? t('common.running') : t('common.run')}
              </PixelButton>
              <PixelButton type="button" icon="reset" variant="danger" onClick={onReset}>
                {t('common.reset')}
              </PixelButton>
              <PixelButton type="button" icon="help" onClick={() => setDocOpen(true)}>
                {t('common.help')}
              </PixelButton>
              <PixelButton href="/levels" icon="list">
                {t('common.levels')}
              </PixelButton>
            </div>

            <PixelPanel variant="console" title={t('game.console')} className="min-h-0 overflow-hidden" bodyClassName="max-h-24 min-h-0 overflow-y-auto p-2 sm:p-3">
              <div className="font-mono text-[10px] leading-5 text-secondaryText">
                {logs.length ? (
                  logs.map((line, index) => (
                    <div key={`${line}-${index}`}>
                      <span className="text-primaryText">&gt;</span> {line}
                    </div>
                  ))
                ) : (
                  <div><span className="text-primaryText">&gt;</span> {t('game.waiting')}</div>
                )}
              </div>
            </PixelPanel>
          </div>
        </div>
      </main>
    </div>
  )
}

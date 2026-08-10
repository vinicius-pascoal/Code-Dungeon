import {
  Program,
  Statement,
  Expression,
  BlockStatement,
  VariableDeclaration,
  IfStatement,
  WhileStatement,
  ForStatement,
  FunctionDeclaration,
  ReturnStatement,
  ExpressionStatement,
  BinaryExpression,
  UnaryExpression,
  CallExpression,
  AssignmentExpression,
  Identifier,
  Literal,
  LogicalExpression,
} from './ast'
import { Direction, Enemy, GameState, Level, PlayerState, TileType } from '../types/game'

type StepCallback = (info: {
  command: string
  player: PlayerState
  grid: TileType[][]
  enemies: Enemy[]
  message?: string
}) => void

type Context = {
  variables: Map<string, any>
  functions: Map<string, FunctionDeclaration>
  returnValue?: any
  shouldReturn: boolean
  shouldBreak: boolean
  shouldContinue: boolean
}

const GAME_COMMANDS = ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'look']
const MAX_LOOP_ITERATIONS = 1000
const COMMAND_STEP_DELAY_MS = 300

class ExecutionHalted extends Error {
  constructor() {
    super('Execution halted')
    this.name = 'ExecutionHalted'
  }
}

function stopExecution(onError: (msg: string) => void, message: string): never {
  onError(message)
  throw new ExecutionHalted()
}

function cloneGrid(grid: TileType[][]) {
  return grid.map((row) => [...row])
}

function cloneEnemies(enemies: Enemy[]) {
  return enemies.map((enemy) => ({ ...enemy }))
}

function deltaFor(direction: string) {
  switch (direction) {
    case 'UP':
      return { dx: 0, dy: -1 }
    case 'DOWN':
      return { dx: 0, dy: 1 }
    case 'LEFT':
      return { dx: -1, dy: 0 }
    case 'RIGHT':
    default:
      return { dx: 1, dy: 0 }
  }
}

function turnLeft(dir: Direction): Direction {
  const order = ['UP', 'LEFT', 'DOWN', 'RIGHT']
  const i = order.indexOf(dir)
  return order[(i + 1) % 4] as Direction
}

function turnRight(dir: Direction): Direction {
  const order = ['UP', 'RIGHT', 'DOWN', 'LEFT']
  const i = order.indexOf(dir)
  return order[(i + 1) % 4] as Direction
}

function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') return value.length > 0
  return !!value
}

function toNumber(value: any): number {
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'string') {
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  }
  return 0
}

function collectImplicitAllowedCommands(program: Program): Set<string> {
  const implicitCommands = new Set<string>()

  const visitStatement = (stmt: Statement | undefined) => {
    if (!stmt) return

    switch (stmt.type) {
      case 'VariableDeclaration':
        implicitCommands.add('let')
        break
      case 'WhileStatement':
        implicitCommands.add('while')
        visitStatement(stmt.body)
        break
      case 'ForStatement':
        implicitCommands.add('for')
        if (stmt.init && (stmt.init as any).type === 'VariableDeclaration') {
          implicitCommands.add('let')
        }
        visitStatement(stmt.body)
        break
      case 'IfStatement':
        implicitCommands.add('if')
        visitStatement(stmt.consequent)
        if (stmt.alternate) visitStatement(stmt.alternate)
        break
      case 'FunctionDeclaration':
        implicitCommands.add('function')
        visitStatement(stmt.body)
        break
      case 'BlockStatement':
        for (const child of stmt.body) visitStatement(child)
        break
      case 'ReturnStatement':
        implicitCommands.add('return')
        break
      default:
        break
    }
  }

  for (const stmt of program.body) {
    visitStatement(stmt)
  }

  return implicitCommands
}

export async function executeAdvancedCommands(
  program: Program,
  level: Level,
  onStep: StepCallback,
  onError: (msg: string) => void,
  onComplete: (result: { player: PlayerState; won: boolean }) => void
) {
  const implicitAllowedCommands = collectImplicitAllowedCommands(program)
  const allowedCommands = new Set([...(level.availableCommands ?? []), ...implicitAllowedCommands])
  const state: GameState = {
    grid: cloneGrid(level.grid),
    player: { ...level.playerStart },
    enemies: cloneEnemies(level.enemies),
  }

  const context: Context = {
    variables: new Map(),
    functions: new Map(),
    shouldReturn: false,
    shouldBreak: false,
    shouldContinue: false,
  }

  const enemyAt = (x: number, y: number) => state.enemies.find((enemy) => !enemy.defeated && enemy.x === x && enemy.y === y)
  const tileAt = (x: number, y: number) => state.grid[y]?.[x]
  const setTile = (x: number, y: number, tile: TileType) => {
    if (state.grid[y]) {
      state.grid[y][x] = tile
    }
  }

  const executeCommand = async (cmd: string) => {
    if (!allowedCommands.has(cmd)) {
      stopExecution(onError, `Comando inválido: ${cmd}()`)
    }

    let commandResult: any = true
    let commandMessage: string | undefined

    switch (cmd) {
      case 'moveForward': {
        const { dx, dy } = deltaFor(state.player.direction)
        const nx = state.player.x + dx
        const ny = state.player.y + dy
        const row = state.grid[ny]
        if (!row || !row[nx]) {
          stopExecution(onError, `Tentativa de mover para fora do mapa: ${cmd}()`)
        }
        if (enemyAt(nx, ny)) {
          stopExecution(onError, `Existe um inimigo à frente: ${cmd}()`)
        }
        const tile = row[nx]
        if (tile === 'WALL') {
          stopExecution(onError, `Parede à frente: ${cmd}()`)
        }
        if (tile === 'DOOR') {
          stopExecution(onError, `Porta fechada à frente: ${cmd}()`)
        }
        if (tile === 'SPIKE') {
          stopExecution(onError, `Você pisou em espinhos: ${cmd}()`)
        }
        state.player.x = nx
        state.player.y = ny
        break
      }
      case 'look': {
        const { dx, dy } = deltaFor(state.player.direction)
        const nx = state.player.x + dx
        const ny = state.player.y + dy
        const row = state.grid[ny]
        if (!row || row[nx] === undefined) {
          commandResult = 'OUT_OF_BOUNDS'
          commandMessage = commandResult
          break
        }
        const enemy = enemyAt(nx, ny)
        if (enemy) {
          commandResult = 'ENEMY'
          commandMessage = commandResult
          break
        }
        const tile = row[nx]
        // Normalizar retorno como string maiúscula sem espaços
        commandResult = (String(tile ?? 'UNKNOWN')).trim().toUpperCase()
        commandMessage = commandResult
        break
      }
      case 'turnLeft':
        state.player.direction = turnLeft(state.player.direction)
        break
      case 'turnRight':
        state.player.direction = turnRight(state.player.direction)
        break
      case 'attack': {
        const { dx, dy } = deltaFor(state.player.direction)
        const nx = state.player.x + dx
        const ny = state.player.y + dy
        const enemy = enemyAt(nx, ny)
        const tile = tileAt(nx, ny)
        if (!enemy) {
          stopExecution(onError, `Nenhum inimigo à frente: ${cmd}()`)
        }
        if (tile === 'WALL' || tile === 'DOOR' || tile === 'CHEST') {
          stopExecution(onError, `Não foi possível atacar o objeto à frente: ${cmd}()`)
        }
        enemy.defeated = true
        break
      }
      case 'grabKey': {
        const tile = tileAt(state.player.x, state.player.y)
        if (tile !== 'KEY') {
          stopExecution(onError, `Nenhuma chave na posição atual: ${cmd}()`)
        }
        setTile(state.player.x, state.player.y, 'FLOOR')
        state.player.keys += 1
        break
      }
      case 'openDoor': {
        const { dx, dy } = deltaFor(state.player.direction)
        const nx = state.player.x + dx
        const ny = state.player.y + dy
        const tile = tileAt(nx, ny)
        if (tile !== 'DOOR') {
          stopExecution(onError, `Nenhuma porta à frente: ${cmd}()`)
        }
        if (state.player.keys < 1) {
          stopExecution(onError, `Você precisa de uma chave para abrir a porta: ${cmd}()`)
        }
        setTile(nx, ny, 'OPEN_DOOR')
        state.player.keys -= 1
        break
      }
      case 'openChest': {
        const { dx, dy } = deltaFor(state.player.direction)
        const nx = state.player.x + dx
        const ny = state.player.y + dy
        const tile = tileAt(nx, ny)
        if (tile !== 'CHEST') {
          stopExecution(onError, `Nenhum baú à frente: ${cmd}()`)
        }
        setTile(nx, ny, 'OPEN_CHEST')
        state.player.openedChests += 1
        break
      }
      default:
        stopExecution(onError, `Comando desconhecido: ${cmd}()`)
    }

    onStep({
      command: cmd,
      player: { ...state.player },
      grid: cloneGrid(state.grid),
      enemies: cloneEnemies(state.enemies),
      message: commandMessage,
    })

    await new Promise((r) => setTimeout(r, COMMAND_STEP_DELAY_MS))

    if (state.grid[state.player.y] && state.grid[state.player.y][state.player.x] === 'EXIT') {
      return 'exit'
    }

    return commandResult
  }

  try {
    // Primeira passagem: registrar funções
    for (const stmt of program.body) {
      if (stmt.type === 'FunctionDeclaration') {
        if (!allowedCommands.has('function')) {
          stopExecution(onError, 'Comando inválido: function')
        }
        context.functions.set(stmt.name, stmt)
      }
    }

    // Segunda passagem: executar programa
    for (const stmt of program.body) {
      if (stmt.type !== 'FunctionDeclaration') {
        const result = await executeStatement(stmt, state, context, executeCommand, onError, onStep, allowedCommands)
        if (result === 'exit') {
          onComplete({ player: state.player, won: true })
          return
        }
        if (result === false) return
      }
    }

    onComplete({ player: state.player, won: false })
  } catch (error) {
    if (error instanceof ExecutionHalted) return
    onError(`Erro ao executar: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function executeStatement(
  stmt: Statement,
  state: GameState,
  context: Context,
  executeCommand: (cmd: string) => Promise<any>,
  onError: (msg: string) => void,
  onStep?: StepCallback,
  allowedCommands: Set<string> = new Set()
): Promise<any> {
  if (context.shouldReturn || context.shouldBreak || context.shouldContinue) {
    return true
  }

  switch (stmt.type) {
    case 'ExpressionStatement': {
      const result = await executeExpression((stmt as ExpressionStatement).expression, context, executeCommand, onError, state, onStep, allowedCommands)
      return result === 'exit' ? result : true
    }

    case 'VariableDeclaration': {
      if (!allowedCommands.has('let') && !allowedCommands.has('var') && !allowedCommands.has('const')) {
        stopExecution(onError, 'Comando inválido: let')
      }
      const decl = stmt as VariableDeclaration
      let value = 0
      if (decl.value) {
        value = await evaluateExpression(decl.value, context, executeCommand, onError, state, onStep, allowedCommands)
      }
      context.variables.set(decl.name, value)
      return true
    }

    case 'BlockStatement': {
      const block = stmt as BlockStatement
      for (const s of block.body) {
        const result = await executeStatement(s, state, context, executeCommand, onError, onStep, allowedCommands)
        if (result === 'exit' || result === false || context.shouldReturn || context.shouldBreak || context.shouldContinue) {
          return result
        }
      }
      return true
    }

    case 'IfStatement': {
      if (!allowedCommands.has('if')) {
        stopExecution(onError, 'Comando inválido: if')
      }
      const ifStmt = stmt as IfStatement
      const condition = await evaluateExpression(ifStmt.condition, context, executeCommand, onError, state, onStep, allowedCommands)
      if (toBoolean(condition)) {
        return await executeStatement(ifStmt.consequent, state, context, executeCommand, onError, onStep, allowedCommands)
      } else if (ifStmt.alternate) {
        return await executeStatement(ifStmt.alternate, state, context, executeCommand, onError, onStep, allowedCommands)
      }
      return true
    }

    case 'WhileStatement': {
      if (!allowedCommands.has('while')) {
        stopExecution(onError, 'Comando inválido: while')
      }
      const whileStmt = stmt as WhileStatement
      let iterations = 0
      while (toBoolean(await evaluateExpression(whileStmt.condition, context, executeCommand, onError, state, onStep, allowedCommands))) {
        iterations += 1
        if (iterations > MAX_LOOP_ITERATIONS) {
          stopExecution(onError, `Loop interrompido: limite de ${MAX_LOOP_ITERATIONS} iterações atingido.`)
        }
        context.shouldContinue = false
        const result = await executeStatement(whileStmt.body, state, context, executeCommand, onError, onStep, allowedCommands)
        if (result === 'exit' || result === false || context.shouldReturn || context.shouldBreak) {
          if (context.shouldBreak) {
            context.shouldBreak = false
            return true
          }
          return result
        }
      }
      return true
    }

    case 'ForStatement': {
      if (!allowedCommands.has('for')) {
        stopExecution(onError, 'Comando inválido: for')
      }
      const forStmt = stmt as ForStatement
      if (forStmt.init) {
        if ((forStmt.init as any).type === 'VariableDeclaration') {
          const result = await executeStatement(forStmt.init as VariableDeclaration, state, context, executeCommand, onError, onStep, allowedCommands)
          if (result === false) return false
        } else {
          await evaluateExpression(forStmt.init as Expression, context, executeCommand, onError, state, onStep, allowedCommands)
        }
      }

      let iterations = 0
      while (!forStmt.condition || toBoolean(await evaluateExpression(forStmt.condition, context, executeCommand, onError, state, onStep, allowedCommands))) {
        iterations += 1
        if (iterations > MAX_LOOP_ITERATIONS) {
          stopExecution(onError, `Loop interrompido: limite de ${MAX_LOOP_ITERATIONS} iterações atingido.`)
        }
        context.shouldContinue = false
        const result = await executeStatement(forStmt.body, state, context, executeCommand, onError, onStep, allowedCommands)
        if (result === 'exit' || result === false || context.shouldReturn || context.shouldBreak) {
          if (context.shouldBreak) {
            context.shouldBreak = false
            return true
          }
          return result
        }

        if (forStmt.update) {
          await evaluateExpression(forStmt.update, context, executeCommand, onError, state, onStep, allowedCommands)
        }
      }
      return true
    }

    case 'ReturnStatement': {
      if (!allowedCommands.has('return')) {
        stopExecution(onError, 'Comando inválido: return')
      }
      const retStmt = stmt as ReturnStatement
      if (retStmt.argument) {
        context.returnValue = await evaluateExpression(retStmt.argument, context, executeCommand, onError, state, onStep, allowedCommands)
      }
      context.shouldReturn = true
      return true
    }

    default:
      return true
  }
}

async function executeExpression(
  expr: Expression,
  context: Context,
  executeCommand: (cmd: string) => Promise<any>,
  onError: (msg: string) => void,
  state?: GameState,
  onStep?: StepCallback,
  allowedCommands: Set<string> = new Set()
): Promise<any> {
  if (expr.type === 'CallExpression') {
    const call = expr as CallExpression
    const calleeName = call.callee.name

    // Função print(...) — avalia argumentos e emite via onStep.message
    if (calleeName === 'print') {
      if (!allowedCommands.has('print')) {
        stopExecution(onError, 'Comando inválido: print()')
      }
      const args = await Promise.all(call.arguments.map((arg) => evaluateExpression(arg, context, executeCommand, onError, state, onStep, allowedCommands)))
      const text = args.map((a) => String(a)).join(' ')
      if (onStep && state) {
        onStep({ command: 'print', player: { ...state.player }, grid: cloneGrid(state.grid), enemies: cloneEnemies(state.enemies), message: text })
      }
      return 0
    }

    // Verificar se é um comando do jogo (sem argumentos)
    if (GAME_COMMANDS.includes(calleeName)) {
      return await executeCommand(calleeName)
    }

    // Verificar se é uma função definida
    if (context.functions.has(calleeName)) {
      const func = context.functions.get(calleeName)!
      const newContext: Context = {
        variables: new Map(context.variables),
        functions: context.functions,
        shouldReturn: false,
        shouldBreak: false,
        shouldContinue: false,
      }

      const args = await Promise.all(call.arguments.map((arg) => evaluateExpression(arg, context, executeCommand, onError, state, onStep, allowedCommands)))
      for (let i = 0; i < func.params.length; i++) {
        newContext.variables.set(func.params[i], args[i] ?? undefined)
      }

      await executeStatement(func.body, state ?? { grid: [], player: {} as any, enemies: [] }, newContext, executeCommand, onError, onStep, allowedCommands)

      const result = newContext.returnValue
      return result ?? 0
    }

    stopExecution(onError, `Função não encontrada: ${calleeName}()`)
  }

  return await evaluateExpression(expr, context, executeCommand, onError, state, onStep, allowedCommands)
}

async function evaluateExpression(
  expr: Expression,
  context: Context,
  executeCommand?: (cmd: string) => Promise<any>,
  onError?: (msg: string) => void,
  state?: GameState,
  onStep?: StepCallback,
  allowedCommands: Set<string> = new Set()
): Promise<any> {
  switch (expr.type) {
    case 'Literal':
      return (expr as Literal).value

    case 'Identifier':
      return context.variables.get((expr as Identifier).name) ?? 0

    case 'BinaryExpression': {
      const binExpr = expr as BinaryExpression
      const left = await evaluateExpression(binExpr.left, context, executeCommand, onError, state, onStep, allowedCommands)
      const right = await evaluateExpression(binExpr.right, context, executeCommand, onError, state, onStep, allowedCommands)

      switch (binExpr.operator) {
        case '+':
          return toNumber(left) + toNumber(right)
        case '-':
          return toNumber(left) - toNumber(right)
        case '*':
          return toNumber(left) * toNumber(right)
        case '/':
          return toNumber(right) !== 0 ? toNumber(left) / toNumber(right) : 0
        case '%':
          return toNumber(left) % toNumber(right)
        case '==':
          if (typeof left === 'string' && typeof right === 'string') {
            return left.trim().toUpperCase() == right.trim().toUpperCase()
          }
          return left == right
        case '!=':
          if (typeof left === 'string' && typeof right === 'string') {
            return left.trim().toUpperCase() != right.trim().toUpperCase()
          }
          return left != right
        case '<':
          return toNumber(left) < toNumber(right)
        case '>':
          return toNumber(left) > toNumber(right)
        case '<=':
          return toNumber(left) <= toNumber(right)
        case '>=':
          return toNumber(left) >= toNumber(right)
        default:
          return 0
      }
    }

    case 'UnaryExpression': {
      const unExpr = expr as UnaryExpression
      const arg = await evaluateExpression(unExpr.argument, context, executeCommand, onError, state, onStep, allowedCommands)

      switch (unExpr.operator) {
        case '-':
          return -toNumber(arg)
        case '!':
          return !toBoolean(arg)
        case '++': {
          if (unExpr.argument.type === 'Identifier') {
            const name = (unExpr.argument as Identifier).name
            const val = toNumber(context.variables.get(name) ?? 0)
            if (unExpr.prefix) {
              context.variables.set(name, val + 1)
              return val + 1
            } else {
              context.variables.set(name, val + 1)
              return val
            }
          }
          return 0
        }
        case '--': {
          if (unExpr.argument.type === 'Identifier') {
            const name = (unExpr.argument as Identifier).name
            const val = toNumber(context.variables.get(name) ?? 0)
            if (unExpr.prefix) {
              context.variables.set(name, val - 1)
              return val - 1
            } else {
              context.variables.set(name, val - 1)
              return val
            }
          }
          return 0
        }
        default:
          return 0
      }
    }

    case 'AssignmentExpression': {
      const assgnExpr = expr as AssignmentExpression
      const right = await evaluateExpression(assgnExpr.right, context, executeCommand, onError, state, onStep, allowedCommands)
      const name = assgnExpr.left.name
      const current = toNumber(context.variables.get(name) ?? 0)

      let result
      switch (assgnExpr.operator) {
        case '=':
          result = right
          break
        case '+=':
          result = current + toNumber(right)
          break
        case '-=':
          result = current - toNumber(right)
          break
        case '*=':
          result = current * toNumber(right)
          break
        case '/=':
          result = toNumber(right) !== 0 ? current / toNumber(right) : 0
          break
        default:
          result = right
      }

      context.variables.set(name, result)
      return result
    }

    case 'LogicalExpression': {
      const logExpr = expr as LogicalExpression
      const left = toBoolean(await evaluateExpression(logExpr.left, context, executeCommand, onError, state, onStep, allowedCommands))

      if (logExpr.operator === '&&') {
        if (!left) return false
        return toBoolean(await evaluateExpression(logExpr.right, context, executeCommand, onError, state, onStep, allowedCommands))
      }

      if (logExpr.operator === '||') {
        if (left) return true
        return toBoolean(await evaluateExpression(logExpr.right, context, executeCommand, onError, state, onStep, allowedCommands))
      }

      return false
    }

    case 'CallExpression':
      if (!executeCommand || !onError) return 0
      return await executeExpression(expr as CallExpression, context, executeCommand, onError, state, onStep, allowedCommands)

    default:
      return 0
  }
}

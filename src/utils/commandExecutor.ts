import { Direction, Enemy, GameState, Level, PlayerState, TileType } from '../types/game'

type StepCallback = (info: {
  command: string
  player: PlayerState
  grid: TileType[][]
  enemies: Enemy[]
  message?: string
}) => void

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

export async function executeCommands(
  commands: string[],
  level: Level,
  onStep: StepCallback,
  onError: (msg: string) => void,
  onComplete: (result: { player: PlayerState; won: boolean }) => void
) {
  const state: GameState = {
    grid: cloneGrid(level.grid),
    player: { ...level.playerStart },
    enemies: cloneEnemies(level.enemies),
  }

  const enemyAt = (x: number, y: number) => state.enemies.find((enemy) => !enemy.defeated && enemy.x === x && enemy.y === y)

  const tileAt = (x: number, y: number) => state.grid[y]?.[x]

  const setTile = (x: number, y: number, tile: TileType) => {
    if (state.grid[y]) {
      state.grid[y][x] = tile
    }
  }

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i]
    let lookMessage: string | undefined = undefined

    if (cmd === 'moveForward') {
      const { dx, dy } = deltaFor(state.player.direction)
      const nx = state.player.x + dx
      const ny = state.player.y + dy
      const row = state.grid[ny]
      if (!row || !row[nx]) {
        onError(`Tentativa de mover para fora do mapa no comando ${i + 1}: ${cmd}()`)
        return
      }
      if (enemyAt(nx, ny)) {
        onError(`Existe um inimigo à frente no comando ${i + 1}: ${cmd}()`)
        return
      }
      const tile = row[nx]
      if (tile === 'WALL') {
        onError(`Parede à frente no comando ${i + 1}: ${cmd}()`)
        return
      }
      if (tile === 'DOOR') {
        onError(`Porta fechada à frente no comando ${i + 1}: ${cmd}()`)
        return
      }
      if (tile === 'SPIKE') {
        onError(`Você pisou em espinhos no comando ${i + 1}: ${cmd}()`)
        return
      }
      state.player.x = nx
      state.player.y = ny
    } else if (cmd === 'turnLeft') {
      state.player.direction = turnLeft(state.player.direction)
    } else if (cmd === 'turnRight') {
      state.player.direction = turnRight(state.player.direction)
    } else if (cmd === 'look' || cmd === 'print') {
      const { dx, dy } = deltaFor(state.player.direction)
      const nx = state.player.x + dx
      const ny = state.player.y + dy
      const row = state.grid[ny]
      if (!row || row[nx] === undefined) {
        lookMessage = 'OUT_OF_BOUNDS'
      } else {
        const enemy = enemyAt(nx, ny)
        if (enemy) {
          lookMessage = 'ENEMY'
        } else {
          // Normalizar para facilitar comparações no código do usuário
          lookMessage = String(row[nx]).trim().toUpperCase()
        }
      }
    } else if (cmd === 'attack') {
      const { dx, dy } = deltaFor(state.player.direction)
      const nx = state.player.x + dx
      const ny = state.player.y + dy
      const enemy = enemyAt(nx, ny)
      const tile = tileAt(nx, ny)
      if (!enemy) {
        onError(`Nenhum inimigo à frente no comando ${i + 1}: ${cmd}()`)
        return
      }
      if (tile === 'WALL' || tile === 'DOOR' || tile === 'CHEST') {
        onError(`Não foi possível atacar o objeto à frente no comando ${i + 1}: ${cmd}()`)
        return
      }
      enemy.defeated = true
    } else if (cmd === 'grabKey') {
      const tile = tileAt(state.player.x, state.player.y)
      if (tile !== 'KEY') {
        onError(`Nenhuma chave na posição atual no comando ${i + 1}: ${cmd}()`)
        return
      }
      setTile(state.player.x, state.player.y, 'FLOOR')
      state.player.keys += 1
    } else if (cmd === 'openDoor') {
      const { dx, dy } = deltaFor(state.player.direction)
      const nx = state.player.x + dx
      const ny = state.player.y + dy
      const tile = tileAt(nx, ny)
      if (tile !== 'DOOR') {
        onError(`Nenhuma porta à frente no comando ${i + 1}: ${cmd}()`)
        return
      }
      if (state.player.keys < 1) {
        onError(`Você precisa de uma chave para abrir a porta no comando ${i + 1}: ${cmd}()`)
        return
      }
      setTile(nx, ny, 'OPEN_DOOR')
      state.player.keys -= 1
    } else if (cmd === 'openChest') {
      const { dx, dy } = deltaFor(state.player.direction)
      const nx = state.player.x + dx
      const ny = state.player.y + dy
      const tile = tileAt(nx, ny)
      if (tile !== 'CHEST') {
        onError(`Nenhum baú à frente no comando ${i + 1}: ${cmd}()`)
        return
      }
      setTile(nx, ny, 'OPEN_CHEST')
      state.player.openedChests += 1
    } else {
      onError(`Comando não suportado no executor: ${cmd}()`)
      return
    }

    onStep({
      command: cmd,
      player: { ...state.player },
      grid: cloneGrid(state.grid),
      enemies: cloneEnemies(state.enemies),
      message: lookMessage,
    })

    // Vitória?
    if (state.grid[state.player.y] && state.grid[state.player.y][state.player.x] === 'EXIT') {
      onComplete({ player: state.player, won: true })
      return
    }

    // Pequena espera para animação
    await new Promise((r) => setTimeout(r, 300))
  }

  onComplete({ player: state.player, won: false })
}

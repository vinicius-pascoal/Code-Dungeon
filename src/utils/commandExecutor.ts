import { Level, PlayerState } from '../types/game'

type StepCallback = (info: { command: string; player: PlayerState; message?: string }) => void

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

function turnLeft(dir: string) {
  const order = ['UP', 'LEFT', 'DOWN', 'RIGHT']
  const i = order.indexOf(dir)
  return order[(i + 1) % 4]
}

function turnRight(dir: string) {
  const order = ['UP', 'RIGHT', 'DOWN', 'LEFT']
  const i = order.indexOf(dir)
  return order[(i + 1) % 4]
}

export async function executeCommands(
  commands: string[],
  level: Level,
  onStep: StepCallback,
  onError: (msg: string) => void,
  onComplete: (player: PlayerState) => void
) {
  let player = { ...level.playerStart }

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i]

    if (cmd === 'moveForward') {
      const { dx, dy } = deltaFor(player.direction)
      const nx = player.x + dx
      const ny = player.y + dy
      const row = level.grid[ny]
      if (!row || !row[nx]) {
        onError(`Tentativa de mover para fora do mapa no comando ${i + 1}: ${cmd}()`)
        return
      }
      const tile = row[nx]
      if (tile === 'WALL') {
        onError(`Parede à frente no comando ${i + 1}: ${cmd}()`)
        return
      }
      if (tile === 'SPIKE') {
        onError(`Você pisou em espinhos no comando ${i + 1}: ${cmd}()`)
        return
      }
      player.x = nx
      player.y = ny
    } else if (cmd === 'turnLeft') {
      player.direction = turnLeft(player.direction)
    } else if (cmd === 'turnRight') {
      player.direction = turnRight(player.direction)
    } else {
      onError(`Comando não suportado no executor: ${cmd}()`)
      return
    }

    onStep({ command: cmd, player })

    // Vitória?
    if (level.grid[player.y] && level.grid[player.y][player.x] === 'EXIT') {
      onComplete(player)
      return
    }

    // Pequena espera para animação
    await new Promise((r) => setTimeout(r, 300))
  }

  onComplete(player)
}

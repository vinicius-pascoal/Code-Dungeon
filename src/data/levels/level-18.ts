import { Level } from '../../types/game'

export const levelEighteen: Level = {
  id: 18,
  worldId: 5,
  name: 'Funcoes e Planejamento',
  description: 'Aplique pensamento modular com combate, espinhos, bau e porta.',
  objective: 'Crie funcoes pequenas para limpar inimigos e atravessar a rota ate a saida.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'function', 'return', 'print'],
  playerStart: {
    x: 1,
    y: 4,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'WALL', 'FLOOR', 'WALL'],
    ['WALL', 'FLOOR', 'WALL', 'WALL', 'CHEST', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'DOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 4, y: 4, defeated: false }],
  starRules: { threeStars: 10, twoStars: 14 },
  concepts: ['functions', 'planning', 'combat', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['function', 'attack', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}

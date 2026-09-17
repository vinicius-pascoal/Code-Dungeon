import { Level } from '../../types/game'

export const levelFourteen: Level = {
  id: 14,
  worldId: 4,
  name: 'Contador na Passarela',
  description: 'Um corredor longo agora tem espinhos, patrulha, bau e porta trancada.',
  objective: 'Use while com variavel de controle para repetir trechos e interagir no momento certo.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'while', 'let', 'print'],
  playerStart: {
    x: 1,
    y: 3,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'EXIT', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'DOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'CHEST', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'FLOOR', 'FLOOR', 'FLOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 5, y: 3, defeated: false }],
  starRules: { threeStars: 13, twoStars: 17 },
  concepts: ['loops', 'while', 'counter', 'spikes', 'combat', 'keys', 'doors', 'chests'],
  requiredCommands: ['while', 'let', 'attack', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}

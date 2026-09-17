import { Level } from '../../types/game'

export const levelEighteen: Level = {
  id: 18,
  worldId: 5,
  name: 'Funcoes e Planejamento',
  description: 'Agora a funcao tambem precisa encapsular uma acao composta: atacar e avancar.',
  objective: 'Crie funcoes para caminhar e limpar inimigos enquanto cruza espinhos, abre o bau e chega na saida.',
  availableCommands: ['moveForward', 'turnLeft', 'turnRight', 'attack', 'grabKey', 'openDoor', 'openChest', 'function', 'return', 'print'],
  playerStart: {
    x: 1,
    y: 2,
    direction: 'RIGHT',
    keys: 0,
    openedChests: 0,
  },
  grid: [
    ['VOID', 'VOID', 'VOID', 'WALL', 'WALL', 'WALL', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'CHEST', 'EXIT', 'WALL'],
    ['WALL', 'FLOOR', 'KEY', 'SPIKE', 'FLOOR', 'DOOR', 'WALL'],
    ['WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL'],
  ],
  enemies: [{ x: 4, y: 2, defeated: false }],
  starRules: { threeStars: 9, twoStars: 12 },
  concepts: ['functions', 'planning', 'void', 'combat', 'spikes', 'keys', 'doors', 'chests'],
  requiredCommands: ['function', 'attack', 'grabKey', 'openDoor', 'openChest'],
  isPlayable: true,
}

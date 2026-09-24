import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAdvancedCode } from './advancedParser'
import { executeAdvancedCommands } from './advancedExecutor'
import { executeCommands } from './commandExecutor'
import { isSimpleCommandList } from './commandParser'
import { levelFourteen } from '../data/levels/level-14'
import { levelFive } from '../data/levels/level-05'
import type { Level, TileType } from '../types/game'

function createLevel(availableCommands: string[], grid: TileType[][] = [['FLOOR', 'FLOOR', 'FLOOR', 'FLOOR']]): Level {
  return {
    id: 999,
    worldId: 1,
    name: 'Test level',
    description: 'Test level',
    objective: 'Test objective',
    availableCommands,
    playerStart: { x: 0, y: 0, direction: 'RIGHT', keys: 0, openedChests: 0 },
    grid,
    enemies: [],
    starRules: { threeStars: 1, twoStars: 2 },
    concepts: [],
    isPlayable: true,
  }
}

test('simple command detection should reject advanced multiline programs', () => {
  assert.equal(isSimpleCommandList('moveForward();\nturnRight();\nmoveForward();'), true)
  assert.equal(isSimpleCommandList('let steps = 0;\nmoveForward();\nwhile (steps < 3) {\n  moveForward();\n  steps++;\n}'), false)
})

test('elif should execute the first matching branch', async () => {
  const program = parseAdvancedCode('if (false) { moveForward(); } elif (true) { moveForward(); }')
  const level = createLevel(['moveForward', 'if', 'elif'], [['FLOOR', 'EXIT']])
  let won = false

  await executeAdvancedCommands(
    program,
    level,
    () => undefined,
    (message) => {
      throw new Error(message)
    },
    (result) => {
      won = result.won
    }
  )

  assert.equal(won, true)
})

test('level 5 requires await turns to lower the spike', async () => {
  let errorMessage = ''

  await executeCommands(
    ['moveForward', 'moveForward', 'await', 'moveForward'],
    levelFive,
    () => undefined,
    (message) => {
      errorMessage = message
    },
    () => undefined
  )

  assert.match(errorMessage, /espinhos/)

  const commands = ['moveForward', 'moveForward', 'await', 'await', 'moveForward', 'moveForward', 'moveForward']
  let won = false
  await executeCommands(
    commands,
    levelFive,
    () => undefined,
    (message) => {
      throw new Error(message)
    },
    (result) => {
      won = result.won
    }
  )

  assert.equal(won, true)
})

test('while loop with counter variable should execute multiple iterations', async () => {
  const program = parseAdvancedCode('let steps = 0; while (steps < 3) { moveForward(); steps++; }')
  const level = createLevel(['moveForward', 'while', 'let'])

  let executedCommands = 0
  await executeAdvancedCommands(
    program,
    level,
    () => {
      executedCommands += 1
    },
    () => {
      throw new Error('execution failed')
    },
    () => undefined
  )

  assert.equal(executedCommands, 3)
})

test('unavailable advanced language feature should be rejected', async () => {
  const program = parseAdvancedCode('let steps = 0; while (steps < 1) { moveForward(); steps++; }')
  const level = createLevel(['moveForward', 'let'])
  let errorMessage = ''

  await executeAdvancedCommands(
    program,
    level,
    () => undefined,
    (message) => {
      errorMessage = message
    },
    () => undefined
  )

  assert.match(errorMessage, /while/)
})

test('level 14 while loop should run every command until exit', async () => {
  const program = parseAdvancedCode(`
    moveForward();
    grabKey();

    let steps = 0;

    while (steps < 2) {
      moveForward();
      steps++;
    }

    attack();
    moveForward();

    steps = 0;
    while (steps < 2) {
      moveForward();
      steps++;
    }

    turnLeft();
    openChest();
    moveForward();
    openDoor();
    moveForward();
    turnLeft();

    steps = 0;

    while (steps < 6) {
      moveForward();
      steps++;
    }
  `)
  let completed = false
  const commands: string[] = []
  await executeAdvancedCommands(
    program,
    levelFourteen,
    ({ command }) => {
      commands.push(command)
    },
    () => {
      throw new Error('execution failed')
    },
    ({ won }) => {
      completed = true
      assert.equal(won, true)
    }
  )

  assert.equal(completed, true)
  assert.deepEqual(commands, [
    'moveForward',
    'grabKey',
    'moveForward',
    'moveForward',
    'attack',
    'moveForward',
    'moveForward',
    'moveForward',
    'turnLeft',
    'openChest',
    'moveForward',
    'openDoor',
    'moveForward',
    'turnLeft',
    'moveForward',
    'moveForward',
    'moveForward',
    'moveForward',
    'moveForward',
    'moveForward',
  ])
})

test('for loop with let initializer should execute multiple iterations', async () => {
  const program = parseAdvancedCode('for (let i = 0; i < 3; i++) { moveForward(); }')
  const level = createLevel(['moveForward', 'for', 'let'])

  let executedCommands = 0
  await executeAdvancedCommands(
    program,
    level,
    () => {
      executedCommands += 1
    },
    () => {
      throw new Error('execution failed')
    },
    () => undefined
  )

  assert.equal(executedCommands, 3)
})

test('active spikes block movement until two turns deactivate them', async () => {
  const level = createLevel(['moveForward', 'look'], [['FLOOR', 'SPIKE', 'FLOOR']])
  let errorMessage = ''

  await executeCommands(
    ['moveForward'],
    level,
    () => undefined,
    (message) => {
      errorMessage = message
    },
    () => undefined
  )

  assert.match(errorMessage, /espinhos/)

  const spikeStates: boolean[] = []
  let finalX = 0

  await executeCommands(
    ['look', 'look', 'moveForward'],
    level,
    ({ spikesActive }) => {
      spikeStates.push(spikesActive)
    },
    (message) => {
      throw new Error(message)
    },
    ({ player }) => {
      finalX = player.x
    }
  )

  assert.deepEqual(spikeStates, [true, false, false])
  assert.equal(finalX, 1)
})

test('void tiles are readable but not walkable', async () => {
  const level = createLevel(['moveForward', 'look'], [['FLOOR', 'VOID', 'FLOOR']])
  let lookMessage = ''
  let errorMessage = ''

  await executeCommands(
    ['look'],
    level,
    ({ message }) => {
      if (message) lookMessage = message
    },
    (message) => {
      throw new Error(message)
    },
    () => undefined
  )

  await executeCommands(
    ['moveForward'],
    level,
    () => undefined,
    (message) => {
      errorMessage = message
    },
    () => undefined
  )

  assert.equal(lookMessage, 'VOID')
  assert.match(errorMessage, /Celula vazia/)
})

test('look should identify whether a spike is raised or lowered', async () => {
  const level = createLevel(['look'], [['FLOOR', 'SPIKE']])
  const lookResults: string[] = []

  await executeCommands(
    ['look', 'look', 'look'],
    level,
    ({ message }) => {
      if (message) lookResults.push(message)
    },
    (message) => {
      throw new Error(message)
    },
    () => undefined
  )

  assert.deepEqual(lookResults, ['SPIKE_UP', 'SPIKE_UP', 'SPIKE_DOWN'])
})

test('custom functions should propagate victory when they step onto exit', async () => {
  const program = parseAdvancedCode('function step() { moveForward(); } step();')
  const level = createLevel(['moveForward', 'function'], [['FLOOR', 'EXIT']])
  let won = false

  await executeAdvancedCommands(
    program,
    level,
    () => undefined,
    (message) => {
      throw new Error(message)
    },
    (result) => {
      won = result.won
    }
  )

  assert.equal(won, true)
})

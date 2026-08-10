import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAdvancedCode } from './advancedParser'
import { executeAdvancedCommands } from './advancedExecutor'
import { isSimpleCommandList } from './commandParser'
import { levelEleven } from '../data/levels/level-11'
import type { Level } from '../types/game'

function createLevel(availableCommands: string[]): Level {
  return {
    id: 999,
    worldId: 1,
    name: 'Test level',
    description: 'Test level',
    objective: 'Test objective',
    availableCommands,
    playerStart: { x: 0, y: 0, direction: 'RIGHT', keys: 0, openedChests: 0 },
    grid: [['FLOOR', 'FLOOR', 'FLOOR', 'FLOOR']],
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

test('while loop with counter variable should execute multiple iterations', async () => {
  const program = parseAdvancedCode('let steps = 0; while (steps < 3) { moveForward(); steps++; }')
  const level = createLevel(['moveForward', 'while'])

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

test('level 11 starter loop should run every command until exit', async () => {
  const program = parseAdvancedCode(`
    let steps = 0;

    turnLeft();
    moveForward();
    turnRight();

    while (steps < 3) {
      moveForward();
      steps++;
    }
  `)
  let completed = false
  const commands: string[] = []
  await executeAdvancedCommands(
    program,
    levelEleven,
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
  assert.deepEqual(commands, ['turnLeft', 'moveForward', 'turnRight', 'moveForward', 'moveForward', 'moveForward'])
})

test('for loop with let initializer should execute multiple iterations', async () => {
  const program = parseAdvancedCode('for (let i = 0; i < 3; i++) { moveForward(); }')
  const level = createLevel(['moveForward', 'for'])

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

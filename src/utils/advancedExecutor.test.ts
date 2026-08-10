import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAdvancedCode } from './advancedParser'
import { executeAdvancedCommands } from './advancedExecutor'
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

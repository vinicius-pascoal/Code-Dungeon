const COMMAND_RE = /([a-zA-Z0-9_]+)\s*\(\s*\)\s*;?/g
const SIMPLE_COMMAND_LIST_RE = /^\s*(?:[a-zA-Z0-9_]+\s*\(\s*\)\s*;?\s*)+$/

export const RESERVED_COMMANDS = [
  'moveForward',
  'turnLeft',
  'turnRight',
  'attack',
  'grabKey',
  'openDoor',
  'openChest',
]

const DEFAULT_ALLOWED = new Set(RESERVED_COMMANDS)

export function isSimpleCommandList(code: string) {
  return SIMPLE_COMMAND_LIST_RE.test(code)
}

export function parseCommands(code: string, allowedCommands?: string[]) {
  const cmds: string[] = []
  let m: RegExpExecArray | null
  while ((m = COMMAND_RE.exec(code)) !== null) {
    const name = m[1]
    cmds.push(name)
  }

  // Validate against allowedCommands (if provided) or default set
  const allowedSet = allowedCommands ? new Set(allowedCommands) : DEFAULT_ALLOWED
  for (const c of cmds) {
    if (!allowedSet.has(c)) {
      return { error: `Comando inválido: ${c}()` }
    }
  }

  if (cmds.length === 0) {
    return { error: 'Nenhum comando detectado.' }
  }

  return { commands: cmds }
}

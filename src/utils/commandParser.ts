const COMMAND_RE = /([a-zA-Z0-9_]+)\s*\(\s*\)\s*;?/g

const ALLOWED = new Set([
  'moveForward',
  'turnLeft',
  'turnRight',
  'attack',
  'grabKey',
  'openDoor',
  'openChest',
])

export function parseCommands(code: string) {
  const cmds: string[] = []
  let m: RegExpExecArray | null
  while ((m = COMMAND_RE.exec(code)) !== null) {
    const name = m[1]
    cmds.push(name)
  }

  // Validate
  for (const c of cmds) {
    if (!ALLOWED.has(c)) {
      return { error: `Comando inválido: ${c}()` }
    }
  }

  if (cmds.length === 0) {
    return { error: 'Nenhum comando detectado.' }
  }

  return { commands: cmds }
}

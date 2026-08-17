import type { Direction, PlayerAnimationState } from '../../types/game'

type DirectionalAnimationConfig = {
  frames: readonly string[]
  frameDuration: number
  loop: true
}

type SingleAnimationConfig = {
  frames: readonly string[]
  frameDuration: number
  loop: false
}

export type PlayerAnimationConfig = DirectionalAnimationConfig | SingleAnimationConfig

const framePaths = (folder: string, prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => `/assets/personagem/${folder}/${prefix}_${index + 1}.png`)

export const PLAYER_ANIMATIONS = {
  idle: {
    down: {
      frames: framePaths('Idle', 'Ghost_idle_down', 6),
      frameDuration: 100,
      loop: true,
    },
    up: {
      frames: framePaths('Idle', 'Ghost_idle_up', 6),
      frameDuration: 100,
      loop: true,
    },
    side: {
      frames: framePaths('Idle', 'Ghost_idle_side', 6),
      frameDuration: 100,
      loop: true,
    },
  },
  walk: {
    down: {
      frames: framePaths('Walk', 'Ghost_walk_down', 6),
      frameDuration: 100,
      loop: true,
    },
    up: {
      frames: framePaths('Walk', 'Ghost_walk_up', 6),
      frameDuration: 100,
      loop: true,
    },
    side: {
      frames: framePaths('Walk', 'Ghost_walk_side', 6),
      frameDuration: 100,
      loop: true,
    },
  },
  hit: {
    frames: framePaths('Hit', 'Ghost_hit', 4),
    frameDuration: 100,
    loop: false,
  },
  death: {
    frames: framePaths('Death', 'Ghost_death', 14),
    frameDuration: 100,
    loop: false,
  },
} as const

export const ALL_PLAYER_ANIMATION_FRAMES = [
  ...PLAYER_ANIMATIONS.idle.down.frames,
  ...PLAYER_ANIMATIONS.idle.up.frames,
  ...PLAYER_ANIMATIONS.idle.side.frames,
  ...PLAYER_ANIMATIONS.walk.down.frames,
  ...PLAYER_ANIMATIONS.walk.up.frames,
  ...PLAYER_ANIMATIONS.walk.side.frames,
  ...PLAYER_ANIMATIONS.hit.frames,
  ...PLAYER_ANIMATIONS.death.frames,
]

export function resolvePlayerAnimationConfig(
  animationState: PlayerAnimationState,
  direction: Direction
): PlayerAnimationConfig {
  if (animationState === 'hit' || animationState === 'death') {
    return PLAYER_ANIMATIONS[animationState]
  }

  if (direction === 'UP') return PLAYER_ANIMATIONS[animationState].up
  if (direction === 'DOWN') return PLAYER_ANIMATIONS[animationState].down
  return PLAYER_ANIMATIONS[animationState].side
}

export function shouldFlipPlayerSprite(direction: Direction) {
  return direction === 'LEFT'
}

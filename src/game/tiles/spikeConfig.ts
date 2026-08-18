import type { TileType } from '../../types/game'

export const SPIKE_SPRITE_CONFIG = {
  src: '/assets/tilesets/spikes.png',
  frameCount: 6,
  frameWidth: 20,
  frameHeight: 20,
  frameDurationMs: 50,
} as const

export const INITIAL_SPIKES_ACTIVE = true
export const SPIKE_TURNS_PER_STATE = 2

export function advanceSpikeTurn(spikesActive: boolean, spikeTurnCount: number) {
  const nextTurnCount = spikeTurnCount + 1

  if (nextTurnCount < SPIKE_TURNS_PER_STATE) {
    return { spikesActive, spikeTurnCount: nextTurnCount }
  }

  return { spikesActive: !spikesActive, spikeTurnCount: 0 }
}

export function isSpikeDangerous(tile: TileType | undefined, spikesActive: boolean) {
  return tile === 'SPIKE' && spikesActive
}

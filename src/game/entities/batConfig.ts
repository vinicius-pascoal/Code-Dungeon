export const BAT_SPRITE_CONFIG = {
  src: '/assets/inimigos/bat.png',
  frameWidth: 20,
  frameHeight: 20,
  frameCount: 8,
  frameDuration: 120,
  sheetWidth: 160,
  sheetHeight: 20,
} as const

export const BAT_ANIMATION_DURATION =
  BAT_SPRITE_CONFIG.frameCount * BAT_SPRITE_CONFIG.frameDuration

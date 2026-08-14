import type { UiSpriteRect } from './uiConfig'

export const UI_SPRITES = {
  icons: {
    play: { x: 213, y: 9, width: 21, height: 22 },
    pause: { x: 213, y: 33, width: 21, height: 22 },
    reset: { x: 213, y: 57, width: 21, height: 22 },
    help: { x: 213, y: 81, width: 21, height: 22 },
    save: { x: 241, y: 10, width: 18, height: 20 },
    target: { x: 265, y: 33, width: 23, height: 22 },
    left: { x: 292, y: 33, width: 22, height: 22 },
    right: { x: 292, y: 9, width: 22, height: 22 },
    list: { x: 340, y: 81, width: 24, height: 22 },
  },
  stars: {
    one: { x: 10, y: 116, width: 22, height: 20 },
    two: { x: 9, y: 140, width: 46, height: 20 },
    three: { x: 9, y: 164, width: 63, height: 20 },
  },
  frames: {
    gameCornerTopLeft: { x: 272, y: 119, width: 18, height: 18 },
    gameCornerTopRight: { x: 432, y: 119, width: 18, height: 18 },
    gameCornerBottomLeft: { x: 272, y: 190, width: 18, height: 18 },
    gameCornerBottomRight: { x: 432, y: 190, width: 18, height: 18 },
    bannerMedallion: { x: 99, y: 118, width: 27, height: 27 },
  },
  decor: {
    swordShield: { x: 12, y: 13, width: 61, height: 17 },
    smallDivider: { x: 15, y: 96, width: 56, height: 7 },
  },
  loader: {
    frame1: { x: 93, y: 233, width: 18, height: 15 },
    frame2: { x: 118, y: 233, width: 18, height: 15 },
    frame3: { x: 144, y: 233, width: 18, height: 15 },
    frame4: { x: 170, y: 233, width: 18, height: 15 },
  },
} as const satisfies Record<string, Record<string, UiSpriteRect>>

export type UiIconName = keyof typeof UI_SPRITES.icons
export type UiStarName = keyof typeof UI_SPRITES.stars

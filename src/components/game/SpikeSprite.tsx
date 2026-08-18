import React, { useEffect, useRef, useState } from 'react'
import { SPIKE_SPRITE_CONFIG } from '../../game/tiles/spikeConfig'

type Props = {
  active: boolean
  size: number
  fill?: boolean
  className?: string
  ariaLabel?: string
}

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function SpikeSprite({ active, size, fill, className, ariaLabel }: Props) {
  const lastFrame = SPIKE_SPRITE_CONFIG.frameCount - 1
  const [frame, setFrame] = useState(active ? lastFrame : 0)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      setFrame(active ? lastFrame : 0)
      return
    }

    const frames = active
      ? Array.from({ length: SPIKE_SPRITE_CONFIG.frameCount }, (_, index) => index)
      : Array.from({ length: SPIKE_SPRITE_CONFIG.frameCount }, (_, index) => lastFrame - index)

    let frameIndex = 0
    setFrame(frames[frameIndex])

    const timer = window.setInterval(() => {
      frameIndex += 1
      setFrame(frames[frameIndex])

      if (frameIndex >= frames.length - 1) {
        window.clearInterval(timer)
      }
    }, SPIKE_SPRITE_CONFIG.frameDurationMs)

    return () => window.clearInterval(timer)
  }, [active, lastFrame])

  const width = fill ? '100%' : `${size}px`
  const height = fill ? '100%' : `${size}px`
  const backgroundSize = fill
    ? `${SPIKE_SPRITE_CONFIG.frameCount * 100}% 100%`
    : `${SPIKE_SPRITE_CONFIG.frameCount * size}px ${size}px`
  const backgroundPosition = fill
    ? `${(frame / lastFrame) * 100}% 0%`
    : `-${frame * size}px 0`

  return (
    <div
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={joinClassNames('dungeon-sprite-tile', className)}
      style={{
        width,
        height,
        backgroundImage: `url("${SPIKE_SPRITE_CONFIG.src}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize,
        backgroundPosition,
      }}
    />
  )
}

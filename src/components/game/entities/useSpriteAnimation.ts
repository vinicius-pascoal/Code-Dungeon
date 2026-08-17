import { useEffect, useRef, useState } from 'react'

type SpriteAnimationOptions = {
  frames: readonly string[]
  frameDuration: number
  loop: boolean
  animationKey: string
  reducedMotion?: boolean
  onComplete?: () => void
}

export function useSpriteAnimation({
  frames,
  frameDuration,
  loop,
  animationKey,
  reducedMotion = false,
  onComplete,
}: SpriteAnimationOptions) {
  const [frameIndex, setFrameIndex] = useState(0)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    setFrameIndex(0)
    completedRef.current = false
  }, [animationKey])

  useEffect(() => {
    if (reducedMotion || frames.length <= 1) {
      return
    }

    if (!loop && frameIndex >= frames.length - 1) {
      if (completedRef.current) return

      const timer = window.setTimeout(() => {
        completedRef.current = true
        onCompleteRef.current?.()
      }, frameDuration)

      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(() => {
      setFrameIndex((current) => {
        const next = current + 1
        if (next >= frames.length) {
          return loop ? 0 : frames.length - 1
        }

        return next
      })
    }, frameDuration)

    return () => window.clearTimeout(timer)
  }, [animationKey, frameDuration, frameIndex, frames.length, loop, reducedMotion])

  return frames[Math.min(frameIndex, Math.max(0, frames.length - 1))] ?? ''
}

'use client'

import { animate } from '@motionone/dom'

type AnimatableElement = HTMLElement | SVGElement
type AnimationOptions = NonNullable<Parameters<typeof animate>[2]>
type AnimationControls = import('@motionone/types').AnimationControls

const activeAnimations = new WeakMap<AnimatableElement, AnimationControls>()

const hoverInKeyframes = { scale: 1.01 }
const hoverOutKeyframes = { scale: 1 }
const tapKeyframes = { scale: 0.985 }

const hoverInOptions: AnimationOptions = {
  duration: 0.18,
  easing: [0.2, 0, 0, 1],
}
const hoverOutOptions: AnimationOptions = {
  duration: 0.16,
  easing: [0.17, 0, 0.2, 1],
}
const tapOptions: AnimationOptions = {
  duration: 0.12,
  easing: [0.2, 0, 0, 1],
}

const DISABLE_SELECTOR =
  '[data-disable-motion], [data-disable-motion="true"], [data-disable-motion="1"]'

function shouldSkipMotion(element: AnimatableElement | null) {
  if (!element) return true
  return Boolean(element.closest(DISABLE_SELECTOR))
}

function runAnimation(
  element: AnimatableElement | null,
  keyframes: Record<string, number>,
  options: AnimationOptions
) {
  if (shouldSkipMotion(element)) return

  const target = element as AnimatableElement
  const previous = activeAnimations.get(target)
  previous?.stop()

  const controls = animate(target, keyframes, options)
  activeAnimations.set(target, controls)

  controls.finished
    .catch(() => {
      // ignore interrupted animations
    })
    .finally(() => {
      if (activeAnimations.get(target) === controls) {
        activeAnimations.delete(target)
      }
    })
}

export function animateHoverStart(element: AnimatableElement | null) {
  runAnimation(element, hoverInKeyframes, hoverInOptions)
}

export function animateHoverEnd(element: AnimatableElement | null) {
  runAnimation(element, hoverOutKeyframes, hoverOutOptions)
}

export function animateTap(element: AnimatableElement | null) {
  runAnimation(element, tapKeyframes, tapOptions)
}

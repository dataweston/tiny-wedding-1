'use client'

import { animate } from '@motionone/dom'

type AnimatableElement = HTMLElement | SVGElement
type AnimationOptions = NonNullable<Parameters<typeof animate>[2]>
type AnimationKeyframes = Parameters<typeof animate>[1]
type AnimationControls = import('@motionone/types').AnimationControls

const activeAnimations = new WeakMap<AnimatableElement, AnimationControls>()

const MOTION_STATE = {
  REST: 'rest',
  HOVER: 'hover',
  ACTIVE: 'active',
} as const

const HOVER_SCALE = 1.01
const REST_SCALE = 1
const TAP_SCALE = 0.985

const hoverInKeyframes: AnimationKeyframes = { scale: HOVER_SCALE }
const hoverOutKeyframes: AnimationKeyframes = { scale: REST_SCALE }

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

function getMotionState(element: AnimatableElement | null) {
  if (!element) return MOTION_STATE.REST
  return (element.getAttribute('data-motion-state') as typeof MOTION_STATE[keyof typeof MOTION_STATE]) ?? MOTION_STATE.REST
}

function setMotionState(element: AnimatableElement | null, state: typeof MOTION_STATE[keyof typeof MOTION_STATE]) {
  if (!element) return
  element.setAttribute('data-motion-state', state)
}

function runAnimation(
  element: AnimatableElement | null,
  keyframes: AnimationKeyframes,
  options: AnimationOptions
) {
  if (shouldSkipMotion(element)) return null

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

  return controls
}

export function animateHoverStart(element: AnimatableElement | null) {
  if (!element) return
  if (getMotionState(element) === MOTION_STATE.HOVER) return
  setMotionState(element, MOTION_STATE.HOVER)
  runAnimation(element, hoverInKeyframes, hoverInOptions)
}

export function animateHoverEnd(element: AnimatableElement | null) {
  if (!element) return
  if (getMotionState(element) === MOTION_STATE.REST) return
  setMotionState(element, MOTION_STATE.REST)
  runAnimation(element, hoverOutKeyframes, hoverOutOptions)
}

export function animateTap(element: AnimatableElement | null) {
  if (!element) return
  setMotionState(element, MOTION_STATE.ACTIVE)

  const controls = runAnimation(element, { scale: TAP_SCALE }, tapOptions)

  controls
    ?.finished.then(() => {
      if (getMotionState(element) !== MOTION_STATE.ACTIVE) return

      const stillHovering = element.matches(':hover')
      const targetState = stillHovering ? MOTION_STATE.HOVER : MOTION_STATE.REST
      const targetScale = stillHovering ? HOVER_SCALE : REST_SCALE
      const targetOptions = stillHovering ? hoverInOptions : hoverOutOptions
      setMotionState(element, targetState)
      runAnimation(element, { scale: targetScale }, targetOptions)
    })
    .catch(() => {
      // Swallow cancellation rejections
    })
}

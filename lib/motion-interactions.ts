'use client'

import { animate } from '@motionone/dom'

type AnimatableElement = HTMLElement | SVGElement
type AnimationOptions = NonNullable<Parameters<typeof animate>[2]>

const hoverInKeyframes = { scale: 1.012, y: -1 }
const hoverOutKeyframes = { scale: 1, y: 0 }
const tapKeyframes = { scale: 0.988 }

const hoverInOptions: AnimationOptions = {
  duration: 0.25,
  easing: [0.16, 1, 0.3, 1],
}
const hoverOutOptions: AnimationOptions = {
  duration: 0.2,
  easing: [0.4, 0, 0.2, 1],
}
const tapOptions: AnimationOptions = {
  duration: 0.18,
  easing: [0.4, 0, 0.2, 1],
}

const DISABLE_SELECTOR =
  '[data-disable-motion], [data-disable-motion=\"true\"], [data-disable-motion=\"1\"]'

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
  animate(element as Element, keyframes, options)
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

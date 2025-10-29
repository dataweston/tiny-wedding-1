'use client'

import { animate } from '@motionone/dom'

type AnimatableElement = HTMLElement | SVGElement
type AnimationOptions = NonNullable<Parameters<typeof animate>[2]>

const hoverInKeyframes = { scale: 1.03, y: -2 }
const hoverOutKeyframes = { scale: 1, y: 0 }
const tapKeyframes = { scale: 0.97 }

const hoverInOptions: AnimationOptions = { duration: 0.2, easing: 'ease-out' }
const hoverOutOptions: AnimationOptions = { duration: 0.2, easing: 'ease-in' }
const tapOptions: AnimationOptions = { duration: 0.15 }

function runAnimation(
  element: AnimatableElement | null,
  keyframes: Record<string, number>,
  options: AnimationOptions
) {
  if (!element) return
  animate(element, keyframes, options)
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

/**
 * Material 3 Motion Helpers
 * Using Motion library with emphasized easing curves
 */

import { animate, scroll, inView, stagger } from 'motion'

type AnimateTarget = Parameters<typeof animate>[0]
type AnimateKeyframes = Parameters<typeof animate>[1]
type AnimateOptions = Parameters<typeof animate>[2]
type InViewOptionsType = NonNullable<Parameters<typeof inView>[2]>

// M3 Emphasized Easing Curves
export const EASING = {
  emphasized: [0.2, 0, 0, 1],
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1],
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15],
  standard: [0.2, 0, 0, 1],
  standardDecelerate: [0, 0, 0, 1],
  standardAccelerate: [0.3, 0, 1, 1],
  legacy: [0.4, 0, 0.2, 1],
} as const

// M3 Duration Tokens
export const DURATION = {
  short1: 0.05,
  short2: 0.1,
  short3: 0.15,
  short4: 0.2,
  medium1: 0.25,
  medium2: 0.3,
  medium3: 0.35,
  medium4: 0.4,
  long1: 0.45,
  long2: 0.5,
  long3: 0.55,
  long4: 0.6,
  extraLong1: 0.7,
  extraLong2: 0.8,
  extraLong3: 0.9,
  extraLong4: 1.0,
} as const

/**
 * Fade in animation with emphasized easing
 */
export function fadeIn(
  element: AnimateTarget,
  options?: {
    duration?: number
    delay?: number
  }
) {
  const keyframes: AnimateKeyframes = [
    { opacity: 0 },
    { opacity: 1 },
  ]

  const animateOptions: AnimateOptions = {
    duration: options?.duration ?? DURATION.medium2,
    delay: options?.delay,
    ease: EASING.emphasized,
  }

  return animate(element, keyframes, animateOptions)
}

/**
 * Fade out animation
 */
export function fadeOut(
  element: AnimateTarget,
  options?: {
    duration?: number
    delay?: number
  }
) {
  const keyframes: AnimateKeyframes = [
    { opacity: 1 },
    { opacity: 0 },
  ]

  const animateOptions: AnimateOptions = {
    duration: options?.duration ?? DURATION.medium2,
    delay: options?.delay,
    ease: EASING.emphasized,
  }

  return animate(element, keyframes, animateOptions)
}

/**
 * Slide up reveal with emphasized decelerate
 */
export function slideUpReveal(
  element: AnimateTarget,
  options?: {
    distance?: number
    duration?: number
    delay?: number
  }
) {
  const distance = options?.distance ?? 40

  const keyframes: AnimateKeyframes = [
    { opacity: 0, transform: `translateY(${distance}px)` },
    { opacity: 1, transform: 'translateY(0)' },
  ]

  const animateOptions: AnimateOptions = {
    duration: options?.duration ?? DURATION.medium4,
    delay: options?.delay,
    ease: EASING.emphasizedDecelerate,
  }

  return animate(element, keyframes, animateOptions)
}

/**
 * Scale fade in (for cards, modals)
 */
export function scaleFadeIn(
  element: AnimateTarget,
  options?: {
    from?: number
    duration?: number
    delay?: number
  }
) {
  const from = options?.from ?? 0.9

  const keyframes: AnimateKeyframes = [
    { opacity: 0, transform: `scale(${from})` },
    { opacity: 1, transform: 'scale(1)' },
  ]

  const animateOptions: AnimateOptions = {
    duration: options?.duration ?? DURATION.medium3,
    delay: options?.delay,
    ease: EASING.emphasizedDecelerate,
  }

  return animate(element, keyframes, animateOptions)
}

/**
 * Container transform (shared element transition)
 */
export function containerTransform(
  fromElement: Element,
  toElement: Element,
  options?: {
    duration?: number
  }
) {
  const fromRect = fromElement.getBoundingClientRect()
  const toRect = toElement.getBoundingClientRect()

  const scaleX = fromRect.width / toRect.width
  const scaleY = fromRect.height / toRect.height
  const translateX = fromRect.left - toRect.left
  const translateY = fromRect.top - toRect.top

  const keyframes: AnimateKeyframes = [
    {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
    },
    {
      transform: 'translate(0, 0) scale(1, 1)',
    },
  ]

  const animateOptions: AnimateOptions = {
    duration: options?.duration ?? DURATION.medium4,
    ease: EASING.emphasized,
  }

  return animate(toElement, keyframes, animateOptions)
}

/**
 * Stagger animation for lists/grids
 */
export function staggerReveal(
  elements: AnimateTarget,
  options?: {
    stagger?: number
    duration?: number
  }
) {
  const keyframes: AnimateKeyframes = [
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ]

  const animateOptions: AnimateOptions = {
    duration: options?.duration ?? DURATION.medium2,
    delay: stagger(options?.stagger ?? 0.05),
    ease: EASING.emphasizedDecelerate,
  }

  return animate(elements, keyframes, animateOptions)
}

/**
 * Scroll-triggered reveal with IntersectionObserver
 */
export function scrollReveal(
  selector: string,
  options?: {
    threshold?: number
    rootMargin?: string
    animateOnce?: boolean
  }
) {
  const elements = document.querySelectorAll(selector)
  const threshold = options?.threshold ?? 0.1
  const rootMargin = (options?.rootMargin ?? '0px 0px -10% 0px') as InViewOptionsType['margin']
  const animateOnce = options?.animateOnce ?? true

  elements.forEach((element) => {
    inView(
      element,
      (viewElement: Element, entry: IntersectionObserverEntry) => {
        slideUpReveal(viewElement)

        // Return cleanup function if we want to repeat on scroll
        if (!animateOnce) {
          return () => fadeOut(viewElement, { duration: DURATION.short4 })
        }
      },
      {
        amount: threshold,
        margin: rootMargin,
      } satisfies InViewOptionsType
    )
  })
}

/**
 * Parallax scroll effect
 */
export function parallaxScroll(
  element: Element,
  options?: {
    speed?: number
    offset?: [string, string]
  }
) {
  const speed = options?.speed ?? 0.5
  const offset = options?.offset ?? ['0px', '100px']

  const keyframes: AnimateKeyframes = [
    { transform: `translateY(${offset[0]})` },
    { transform: `translateY(${offset[1]})` },
  ]

  scroll(
    animate(element, keyframes),
    {
      target: element,
      offset: ['start end', 'end start'],
    }
  )
}

/**
 * Hover scale (for cards/buttons)
 */
export function hoverScale(
  element: Element,
  options?: {
    scale?: number
    duration?: number
  }
) {
  const scale = options?.scale ?? 1.02
  const duration = options?.duration ?? DURATION.short3

  element.addEventListener('mouseenter', () => {
    const enterKeyframes: AnimateKeyframes = [
      { transform: 'scale(1)' },
      { transform: `scale(${scale})` },
    ]
    animate(element, enterKeyframes, { duration, ease: EASING.emphasized })
  })

  element.addEventListener('mouseleave', () => {
    const leaveKeyframes: AnimateKeyframes = [
      { transform: `scale(${scale})` },
      { transform: 'scale(1)' },
    ]
    animate(element, leaveKeyframes, { duration, ease: EASING.emphasized })
  })
}

/**
 * Page transition helper
 */
export function pageTransition(options?: {
  onEnter?: () => void
  onExit?: () => void
}) {
  const transitionContainer = document.querySelector('[data-page-transition]')

  if (!transitionContainer) return

  // Exit animation
  return {
    exit: () => {
      options?.onExit?.()
      return fadeOut(transitionContainer, { duration: DURATION.medium2 })
    },
    enter: () => {
      options?.onEnter?.()
      return fadeIn(transitionContainer, { duration: DURATION.medium2 })
    },
  }
}

/**
 * Check if motion should be reduced
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Conditionally apply animation based on motion preference
 */
export function withMotionCheck<T extends (...args: any[]) => any>(
  animationFn: T
): T {
  return ((...args: Parameters<T>) => {
    if (prefersReducedMotion()) {
      return null
    }
    return animationFn(...args)
  }) as T
}

// Export wrapped versions that respect prefers-reduced-motion
export const safeAnimate = {
  fadeIn: withMotionCheck(fadeIn),
  fadeOut: withMotionCheck(fadeOut),
  slideUpReveal: withMotionCheck(slideUpReveal),
  scaleFadeIn: withMotionCheck(scaleFadeIn),
  staggerReveal: withMotionCheck(staggerReveal),
  containerTransform: withMotionCheck(containerTransform),
}

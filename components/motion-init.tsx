'use client'

import { useEffect } from 'react'
import { scrollReveal } from '@/theme/motion'

/**
 * Client component to initialize scroll-triggered animations
 * Uses data-scroll-reveal attribute on sections
 */
export function MotionInit() {
  useEffect(() => {
    // Initialize scroll reveal for all sections with data-scroll-reveal
    scrollReveal('[data-scroll-reveal]', {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px',
      animateOnce: true
    })
  }, [])

  return null
}

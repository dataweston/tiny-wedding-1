'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  animateHoverEnd,
  animateHoverStart,
  animateTap,
} from '@/lib/motion-interactions'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, ...props }, ref) => {
    const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> =
      React.useCallback(
        (event) => {
          animateHoverStart(event.currentTarget)
          onMouseEnter?.(event)
        },
        [onMouseEnter]
      )

    const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> =
      React.useCallback(
        (event) => {
          animateHoverEnd(event.currentTarget)
          onMouseLeave?.(event)
        },
        [onMouseLeave]
      )

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> =
      React.useCallback(
        (event) => {
          animateTap(event.currentTarget)
          onMouseDown?.(event)
        },
        [onMouseDown]
      )

    const handleMouseUp: React.MouseEventHandler<HTMLDivElement> =
      React.useCallback(
        (event) => {
          onMouseUp?.(event)
        },
        [onMouseUp]
      )

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border bg-card text-card-foreground shadow transition-transform will-change-transform',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

/**
 * Material Design 3 Color Scheme Generator
 * Generates light and dark theme tokens from a brand seed color
 */

import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  Scheme,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  DynamicScheme
} from '@material/material-color-utilities'

// Brand seed color - wedding rose/pink
const BRAND_SEED_HEX = '#E91E63' // Rose 500 from current branding

interface ColorTokens {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  shadow: string
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  surfaceDim: string
  surfaceBright: string
  surfaceContainerLowest: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  surfaceContainerHighest: string
}

const dynamicColorFallbacks: Partial<Record<keyof ColorTokens, (dynamicScheme: DynamicScheme) => number>> = {
  surfaceDim: (dynamicScheme) => dynamicScheme.surfaceDim,
  surfaceBright: (dynamicScheme) => dynamicScheme.surfaceBright,
  surfaceContainerLowest: (dynamicScheme) => dynamicScheme.surfaceContainerLowest,
  surfaceContainerLow: (dynamicScheme) => dynamicScheme.surfaceContainerLow,
  surfaceContainer: (dynamicScheme) => dynamicScheme.surfaceContainer,
  surfaceContainerHigh: (dynamicScheme) => dynamicScheme.surfaceContainerHigh,
  surfaceContainerHighest: (dynamicScheme) => dynamicScheme.surfaceContainerHighest
}

function getSchemeArgbValue(scheme: Scheme, dynamicScheme: DynamicScheme, key: keyof ColorTokens): number {
  const directValue = (scheme as unknown as Record<string, unknown>)[key]
  if (typeof directValue === 'number') {
    return directValue
  }

  const fallback = dynamicColorFallbacks[key]
  if (fallback) {
    return fallback(dynamicScheme)
  }

  throw new Error(`Color token "${key}" is not available on Scheme or dynamic fallbacks`)
}

function schemeToTokens(scheme: Scheme, seedArgb: number, isDark: boolean): ColorTokens {
  const dynamicScheme = new SchemeTonalSpot(Hct.fromInt(seedArgb), isDark, 0)
  return {
    primary: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'primary')),
    onPrimary: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onPrimary')),
    primaryContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'primaryContainer')),
    onPrimaryContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onPrimaryContainer')),
    secondary: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'secondary')),
    onSecondary: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onSecondary')),
    secondaryContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'secondaryContainer')),
    onSecondaryContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onSecondaryContainer')),
    tertiary: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'tertiary')),
    onTertiary: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onTertiary')),
    tertiaryContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'tertiaryContainer')),
    onTertiaryContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onTertiaryContainer')),
    error: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'error')),
    onError: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onError')),
    errorContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'errorContainer')),
    onErrorContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onErrorContainer')),
    background: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'background')),
    onBackground: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onBackground')),
    surface: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surface')),
    onSurface: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onSurface')),
    surfaceVariant: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surfaceVariant')),
    onSurfaceVariant: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'onSurfaceVariant')),
    outline: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'outline')),
    outlineVariant: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'outlineVariant')),
    shadow: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'shadow')),
    scrim: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'scrim')),
    inverseSurface: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'inverseSurface')),
    inverseOnSurface: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'inverseOnSurface')),
    inversePrimary: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'inversePrimary')),
    surfaceDim: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surfaceDim')),
    surfaceBright: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surfaceBright')),
    surfaceContainerLowest: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surfaceContainerLowest')),
    surfaceContainerLow: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surfaceContainerLow')),
    surfaceContainer: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surfaceContainer')),
    surfaceContainerHigh: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surfaceContainerHigh')),
    surfaceContainerHighest: hexFromArgb(getSchemeArgbValue(scheme, dynamicScheme, 'surfaceContainerHighest')),
  }
}

export function generateMaterialTheme(seedHex: string = BRAND_SEED_HEX) {
  const seedArgb = argbFromHex(seedHex)
  const theme = themeFromSourceColor(seedArgb)

  return {
    light: schemeToTokens(theme.schemes.light, seedArgb, false),
    dark: schemeToTokens(theme.schemes.dark, seedArgb, true),
    seed: seedHex
  }
}

// Generate and export tokens
export const materialTheme = generateMaterialTheme()

// Helper to generate CSS custom properties
export function generateCSSVariables(tokens: ColorTokens, prefix: string = '--md-sys-color') {
  return Object.entries(tokens)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `  ${prefix}-${cssKey}: ${value};`
    })
    .join('\n')
}

// For use in build scripts
if (require.main === module) {
  const theme = generateMaterialTheme()
  console.log('=== Material 3 Theme Generated ===')
  console.log('Seed Color:', theme.seed)
  console.log('\nLight Theme Sample:')
  console.log('Primary:', theme.light.primary)
  console.log('Secondary:', theme.light.secondary)
  console.log('Tertiary:', theme.light.tertiary)
  console.log('\nDark Theme Sample:')
  console.log('Primary:', theme.dark.primary)
  console.log('Secondary:', theme.dark.secondary)
  console.log('Tertiary:', theme.dark.tertiary)
}

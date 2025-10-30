/**
 * Material Design 3 Color Scheme Generator
 * Generates light and dark theme tokens from a brand seed color
 */

import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  Scheme,
  hexFromArgb
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

function schemeToTokens(scheme: Scheme): ColorTokens {
  return {
    primary: hexFromArgb(scheme.primary),
    onPrimary: hexFromArgb(scheme.onPrimary),
    primaryContainer: hexFromArgb(scheme.primaryContainer),
    onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
    secondary: hexFromArgb(scheme.secondary),
    onSecondary: hexFromArgb(scheme.onSecondary),
    secondaryContainer: hexFromArgb(scheme.secondaryContainer),
    onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
    tertiary: hexFromArgb(scheme.tertiary),
    onTertiary: hexFromArgb(scheme.onTertiary),
    tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
    onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
    error: hexFromArgb(scheme.error),
    onError: hexFromArgb(scheme.onError),
    errorContainer: hexFromArgb(scheme.errorContainer),
    onErrorContainer: hexFromArgb(scheme.onErrorContainer),
    background: hexFromArgb(scheme.background),
    onBackground: hexFromArgb(scheme.onBackground),
    surface: hexFromArgb(scheme.surface),
    onSurface: hexFromArgb(scheme.onSurface),
    surfaceVariant: hexFromArgb(scheme.surfaceVariant),
    onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
    outline: hexFromArgb(scheme.outline),
    outlineVariant: hexFromArgb(scheme.outlineVariant),
    shadow: hexFromArgb(scheme.shadow),
    scrim: hexFromArgb(scheme.scrim),
    inverseSurface: hexFromArgb(scheme.inverseSurface),
    inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
    inversePrimary: hexFromArgb(scheme.inversePrimary),
    surfaceDim: hexFromArgb(scheme.surfaceDim),
    surfaceBright: hexFromArgb(scheme.surfaceBright),
    surfaceContainerLowest: hexFromArgb(scheme.surfaceContainerLowest),
    surfaceContainerLow: hexFromArgb(scheme.surfaceContainerLow),
    surfaceContainer: hexFromArgb(scheme.surfaceContainer),
    surfaceContainerHigh: hexFromArgb(scheme.surfaceContainerHigh),
    surfaceContainerHighest: hexFromArgb(scheme.surfaceContainerHighest),
  }
}

export function generateMaterialTheme(seedHex: string = BRAND_SEED_HEX) {
  const seedArgb = argbFromHex(seedHex)
  const theme = themeFromSourceColor(seedArgb)

  return {
    light: schemeToTokens(theme.schemes.light),
    dark: schemeToTokens(theme.schemes.dark),
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

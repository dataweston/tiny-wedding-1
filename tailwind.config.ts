import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			// Material 3 Color Tokens
  			primary: {
  				DEFAULT: 'var(--md-sys-color-primary)',
  				foreground: 'var(--md-sys-color-on-primary)',
  				container: 'var(--md-sys-color-primary-container)',
  				'container-foreground': 'var(--md-sys-color-on-primary-container)'
  			},
  			secondary: {
  				DEFAULT: 'var(--md-sys-color-secondary)',
  				foreground: 'var(--md-sys-color-on-secondary)',
  				container: 'var(--md-sys-color-secondary-container)',
  				'container-foreground': 'var(--md-sys-color-on-secondary-container)'
  			},
  			tertiary: {
  				DEFAULT: 'var(--md-sys-color-tertiary)',
  				foreground: 'var(--md-sys-color-on-tertiary)',
  				container: 'var(--md-sys-color-tertiary-container)',
  				'container-foreground': 'var(--md-sys-color-on-tertiary-container)'
  			},
  			error: {
  				DEFAULT: 'var(--md-sys-color-error)',
  				foreground: 'var(--md-sys-color-on-error)',
  				container: 'var(--md-sys-color-error-container)',
  				'container-foreground': 'var(--md-sys-color-on-error-container)'
  			},
  			background: 'var(--md-sys-color-background)',
  			foreground: 'var(--md-sys-color-on-background)',
  			surface: {
  				DEFAULT: 'var(--md-sys-color-surface)',
  				foreground: 'var(--md-sys-color-on-surface)',
  				variant: 'var(--md-sys-color-surface-variant)',
  				'variant-foreground': 'var(--md-sys-color-on-surface-variant)',
  				dim: 'var(--md-sys-color-surface-dim)',
  				bright: 'var(--md-sys-color-surface-bright)',
  				'container-lowest': 'var(--md-sys-color-surface-container-lowest)',
  				'container-low': 'var(--md-sys-color-surface-container-low)',
  				container: 'var(--md-sys-color-surface-container)',
  				'container-high': 'var(--md-sys-color-surface-container-high)',
  				'container-highest': 'var(--md-sys-color-surface-container-highest)'
  			},
  			outline: {
  				DEFAULT: 'var(--md-sys-color-outline)',
  				variant: 'var(--md-sys-color-outline-variant)'
  			},
  			// Legacy mappings for existing components
  			border: 'var(--md-sys-color-outline-variant)',
  			input: 'var(--md-sys-color-surface-variant)',
  			ring: 'var(--md-sys-color-primary)',
  			destructive: {
  				DEFAULT: 'var(--md-sys-color-error)',
  				foreground: 'var(--md-sys-color-on-error)'
  			},
  			muted: {
  				DEFAULT: 'var(--md-sys-color-surface-variant)',
  				foreground: 'var(--md-sys-color-on-surface-variant)'
  			},
  			accent: {
  				DEFAULT: 'var(--md-sys-color-tertiary)',
  				foreground: 'var(--md-sys-color-on-tertiary)'
  			},
  			popover: {
  				DEFAULT: 'var(--md-sys-color-surface-container)',
  				foreground: 'var(--md-sys-color-on-surface)'
  			},
  			card: {
  				DEFAULT: 'var(--md-sys-color-surface-container)',
  				foreground: 'var(--md-sys-color-on-surface)'
  			}
  		},
  		borderRadius: {
  			none: 'var(--md-sys-shape-corner-none)',
  			xs: 'var(--md-sys-shape-corner-extra-small)',
  			sm: 'var(--md-sys-shape-corner-small)',
  			DEFAULT: 'var(--md-sys-shape-corner-medium)',
  			md: 'var(--md-sys-shape-corner-medium)',
  			lg: 'var(--md-sys-shape-corner-large)',
  			xl: 'var(--md-sys-shape-corner-extra-large)',
  			full: 'var(--md-sys-shape-corner-full)'
  		},
  		spacing: {
  			0: 'var(--md-sys-spacing-0)',
  			1: 'var(--md-sys-spacing-1)',
  			2: 'var(--md-sys-spacing-2)',
  			3: 'var(--md-sys-spacing-3)',
  			4: 'var(--md-sys-spacing-4)',
  			5: 'var(--md-sys-spacing-5)',
  			6: 'var(--md-sys-spacing-6)',
  			7: 'var(--md-sys-spacing-7)',
  			8: 'var(--md-sys-spacing-8)'
  		},
  		fontSize: {
  			'display-large': ['var(--md-sys-typescale-display-large-size)', {
  				lineHeight: 'var(--md-sys-typescale-display-large-line-height)',
  				fontWeight: 'var(--md-sys-typescale-display-large-weight)'
  			}],
  			'display-medium': ['var(--md-sys-typescale-display-medium-size)', {
  				lineHeight: 'var(--md-sys-typescale-display-medium-line-height)',
  				fontWeight: 'var(--md-sys-typescale-display-medium-weight)'
  			}],
  			'headline-large': ['var(--md-sys-typescale-headline-large-size)', {
  				lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
  				fontWeight: 'var(--md-sys-typescale-headline-large-weight)'
  			}],
  			'title-large': ['var(--md-sys-typescale-title-large-size)', {
  				lineHeight: 'var(--md-sys-typescale-title-large-line-height)',
  				fontWeight: 'var(--md-sys-typescale-title-large-weight)'
  			}],
  			'title-medium': ['var(--md-sys-typescale-title-medium-size)', {
  				lineHeight: 'var(--md-sys-typescale-title-medium-line-height)',
  				fontWeight: 'var(--md-sys-typescale-title-medium-weight)'
  			}],
  			'body-large': ['var(--md-sys-typescale-body-large-size)', {
  				lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
  				fontWeight: 'var(--md-sys-typescale-body-large-weight)'
  			}],
  			'body-medium': ['var(--md-sys-typescale-body-medium-size)', {
  				lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
  				fontWeight: 'var(--md-sys-typescale-body-medium-weight)'
  			}]
  		},
  		fontFamily: {
  			'expressive': ['Roboto Flex', 'sans-serif'],
  			'baseline': ['Roboto', 'sans-serif']
  		},
  		transitionTimingFunction: {
  			'emphasized': 'var(--md-sys-motion-easing-emphasized)',
  			'emphasized-decelerate': 'var(--md-sys-motion-easing-emphasized-decelerate)',
  			'emphasized-accelerate': 'var(--md-sys-motion-easing-emphasized-accelerate)'
  		},
  		boxShadow: {
  			'elevation-1': 'var(--md-sys-elevation-1)',
  			'elevation-2': 'var(--md-sys-elevation-2)',
  			'elevation-3': 'var(--md-sys-elevation-3)',
  			'elevation-4': 'var(--md-sys-elevation-4)',
  			'elevation-5': 'var(--md-sys-elevation-5)'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

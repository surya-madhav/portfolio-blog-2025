import type { Config } from "tailwindcss";
import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  plugins: [tailwindcssAnimate, typography],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      colors: {
        // Core system colors using CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // Semantic status colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))'
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))'
        },
        // Perplexity Brand Colors
        perplexity: {
          // Core Brand Colors
          offblack: '#091717',
          'paper-white': '#FBFAF4',
          'true-turquoise': '#20808D',
          // Secondary Blues
          'inky-blue': '#13343B',
          peacock: {
            DEFAULT: '#2E565E',
            75: '#628085',
            50: '#96AAAE',
            20: '#D5DDD9',
            10: '#EAEEEF'
          },
          'plex-blue': '#1FB8CD',
          sky: '#BADEDD',
          // Product Colors
          'deepest-slate': '#2A2A32',
          'vintage-white': '#F3F3EE',
          'site-white': '#FCFCF9',
          // Accent Colors
          ecru: '#E4E3D4',
          apricot: '#FFD2A6',
          'terra-cotta': '#A84B2F',
          boysenberry: '#944464'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'var(--font-geist-mono)', 'monospace']
      },
      fontSize: {
        // Type scale based on 1.25 ratio
        'display': ['3.815rem', { lineHeight: '1.2' }],
        'h1': ['3.052rem', { lineHeight: '1.3' }],
        'h2': ['2.441rem', { lineHeight: '1.35' }],
        'h3': ['1.953rem', { lineHeight: '1.4' }],
        'h4': ['1.563rem', { lineHeight: '1.45' }],
        'h5': ['1.25rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.8rem', { lineHeight: '1.5' }]
      },
      spacing: {
        // Consistent 8px grid system
        'base': '8px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        // Additional animations for design system
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'slide-in': {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out'
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'hsl(var(--foreground))',
              '--tw-prose-headings': 'hsl(var(--foreground))',
              '--tw-prose-links': 'hsl(var(--primary))',
              '--tw-prose-bold': 'hsl(var(--foreground))',
              '--tw-prose-counters': 'hsl(var(--muted-foreground))',
              '--tw-prose-bullets': 'hsl(var(--muted-foreground))',
              '--tw-prose-hr': 'hsl(var(--border))',
              '--tw-prose-quotes': 'hsl(var(--foreground))',
              '--tw-prose-quote-borders': 'hsl(var(--border))',
              '--tw-prose-captions': 'hsl(var(--muted-foreground))',
              '--tw-prose-code': 'hsl(var(--foreground))',
              '--tw-prose-pre-code': 'hsl(var(--muted-foreground))',
              '--tw-prose-pre-bg': 'hsl(var(--muted))',
              '--tw-prose-th-borders': 'hsl(var(--border))',
              '--tw-prose-td-borders': 'hsl(var(--border))',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
    'border-info',
    'bg-info/30',
    // Theme-specific classes
    'data-[theme=dark]:bg-card',
    'data-[theme=light]:bg-background',
    // Perplexity brand colors
    'bg-perplexity-true-turquoise',
    'bg-perplexity-plex-blue',
    'bg-perplexity-peacock',
    'text-perplexity-true-turquoise',
    // Typography classes
    'text-h1',
    'text-h2',
    'text-h3',
    'text-h4',
    'text-h5',
    'text-body',
    'text-small',
    // Button sizes
    'h-12',
    'h-8',
    'w-8',
    'w-12',
    // Status colors
    'bg-success',
    'bg-warning',
    'bg-info',
    'text-success-foreground',
    'text-warning-foreground',
    'text-info-foreground',
    'hover:bg-success/90',
    'hover:bg-warning/90',
    'hover:bg-info/90',
  ],
} satisfies Config;

export default config;

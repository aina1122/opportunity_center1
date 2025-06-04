/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7dc7fc',
          400: '#38a8f8',
          500: '#0e8be8',
          600: '#026dc4',
          700: '#0358a1',
          800: '#074985',
          900: '#0a3c6e',
          950: '#07264a',
        },
        secondary: {
          50: '#fff8f0',
          100: '#ffedd8',
          200: '#ffd7b0',
          300: '#ffba7d',
          400: '#ff9549',
          500: '#ff6b10',
          600: '#ff4d03',
          700: '#cc3506',
          800: '#a12a0d',
          900: '#82250e',
          950: '#460f05',
        },
        accent: {
          50: '#eefbf3',
          100: '#d6f5e3',
          200: '#b0eacc',
          300: '#7dd8ad',
          400: '#4abf8a',
          500: '#2ca770',
          600: '#1e875a',
          700: '#1a6c4a',
          800: '#18553c',
          900: '#154732',
          950: '#0b281c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            color: 'inherit',
            a: {
              color: 'var(--tw-prose-links)',
              '&:hover': {
                color: 'var(--tw-prose-links-hover)',
              },
              textDecoration: 'none',
            },
            h1: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
              fontWeight: '700',
            },
            h2: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
              fontWeight: '600',
            },
            h3: {
              fontFamily: 'Montserrat, system-ui, sans-serif',
              fontWeight: '600',
            },
            code: {
              color: 'var(--tw-prose-code)',
              fontWeight: '400',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
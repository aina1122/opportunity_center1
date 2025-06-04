/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f9',
          100: '#cce1f3',
          200: '#99c2e7',
          300: '#66a4db',
          400: '#3385cf',
          500: '#0055a4',
          600: '#004483',
          700: '#003362',
          800: '#002241',
          900: '#001121',
        },
        accent: {
          50: '#fffbe6',
          100: '#fff7cc',
          200: '#ffef99',
          300: '#ffe766',
          400: '#ffdf33',
          500: '#ffd700',
          600: '#ccac00',
          700: '#998100',
          800: '#665600',
          900: '#332b00',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.800'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            h1: {
              fontFamily: theme('fontFamily.heading'),
              color: theme('colors.neutral.900'),
            },
            h2: {
              fontFamily: theme('fontFamily.heading'),
              color: theme('colors.neutral.900'),
            },
            h3: {
              fontFamily: theme('fontFamily.heading'),
              color: theme('colors.neutral.900'),
            },
            h4: {
              fontFamily: theme('fontFamily.heading'),
              color: theme('colors.neutral.900'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
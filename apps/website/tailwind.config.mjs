/* eslint-disable import/no-anonymous-default-export */
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        gray: colors.neutral,
        coolgray: colors.gray,
      },
      cursor: {
        menu: 'context-menu',
      },
      fontFamily: {
        mono: ['Space Grotesk', ...defaultTheme.fontFamily.mono],
        serif: defaultTheme.fontFamily.serif,
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      lineHeight: {
        'super-tight': '0.94',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
          },
        },
        base: {
          css: {
            fontSize: '1.0625rem',
          },
        },
      }),
    },
  },
}

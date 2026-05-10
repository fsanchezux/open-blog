import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/app/(frontend)/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#f2f2f0',
        card: '#ffffff',
        ink: '#0a0a0a',
        muted: '#6b6b6b',
        line: '#e5e5e2',
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [typography],
}

export default config

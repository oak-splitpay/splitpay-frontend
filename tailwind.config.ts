import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stellar: '#001F54',
        'stellar-light': '#1A5490',
      },
    },
  },
  plugins: [],
}
export default config

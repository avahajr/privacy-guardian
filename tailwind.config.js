import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      typography:{
        DEFAULT: {
          css: {
            '#policy-text': {
              'h1': {
                "font-size": "2rem",
                "font-weight": "bold",
              },
              'h2': {
                "font-size": "1.5rem",
                "font-weight": "bold",
              },
              'h3': {
                "font-size": "1.25rem",
                "font-weight": "bold",
              },
              'h4': {
                "font-size": "1rem",
                "font-weight": "bold",
              }
            }
          }
        }
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

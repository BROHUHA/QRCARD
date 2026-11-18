/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#E8E7E2',
          light: '#F2F1EC',
          dark: '#DDDCD6',
          deep: '#CFCFC9',
        },
        ink: {
          DEFAULT: '#0E0D0C',
          muted: '#5A5955',
          faint: '#8E8D88',
          border: '#1C1B1A',
        },
        vermilion: {
          DEFAULT: '#FF331F',
          hover: '#E62916',
          light: '#FFF0EE',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '"Space Grotesk"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', '"Space Grotesk"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #0E0D0C',
        'brutal': '4px 4px 0px #0E0D0C',
        'brutal-lg': '6px 6px 0px #0E0D0C',
        'brutal-red': '4px 4px 0px #FF331F',
      },
      animation: {
        'scanline': 'scanline 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%, 100%': { top: '0%', opacity: '0.8' },
          '50%': { top: '100%', opacity: '0.8' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}

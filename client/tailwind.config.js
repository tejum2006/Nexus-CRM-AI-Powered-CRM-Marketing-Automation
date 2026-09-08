/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        // Deep backgrounds for Nexus
        obsidian: {
          950: '#050507',
          900: '#0a0a0c',
          800: '#121217',
          700: '#1a1a21',
          600: '#23232c',
          500: '#2c2c36',
          400: '#383844',
          300: '#464654',
        },
        // Primary luxurious gold
        gold: {
          50:  '#fffbf0',
          100: '#fef3d3',
          200: '#fde3a2',
          300: '#fbd069',
          400: '#f8ba33',
          500: '#f3a20e',
          600: '#d78108',
          700: '#b25e0a',
          800: '#8e480f',
          900: '#753b10',
        },
        // Accent: Electric Blue
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        // Accent: Neon Green/Jade
        green: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-shine': 'linear-gradient(135deg, #f8ba33 0%, #fbd069 40%, #f3a20e 60%, #d78108 100%)',
        'dark-surface': 'linear-gradient(145deg, rgba(18, 18, 23, 0.8) 0%, rgba(10, 10, 12, 0.9) 100%)',
        'glass-panel': 'linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'gold-glow':    '0 0 20px rgba(248, 186, 51, 0.25), 0 0 60px rgba(248, 186, 51, 0.08)',
        'gold-sm':      '0 0 8px rgba(248, 186, 51, 0.3)',
        'blue-glow':    '0 0 16px rgba(59, 130, 246, 0.25)',
        'green-glow':   '0 0 16px rgba(34, 197, 94, 0.25)',
        'obsidian-lg':  '0 25px 50px -12px rgba(0,0,0,0.8)',
        'card':         '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover':   '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(248,186,51,0.2)',
        'inner-glow':   'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      borderColor: {
        'gold-dim':     'rgba(248, 186, 51, 0.25)',
        'gold-mid':     'rgba(248, 186, 51, 0.45)',
        'white-dim':    'rgba(255, 255, 255, 0.06)',
        'white-subtle': 'rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

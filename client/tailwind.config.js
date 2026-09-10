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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        nexus: {
          // Deep Black & Navy (Backgrounds)
          950: '#030712', // Deepest black/navy (Page background)
          900: '#111827', // Card background (Lighter to contrast against 950)
          800: '#1F2937', // Hover state
          700: '#374151', // Inputs
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB', // Muted text
          200: '#E5E7EB',
          100: '#F3F4F6', // Primary text
          50:  '#F9FAFB',
        },
        electric: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Primary Electric Blue
          600: '#2563eb', // Hover
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a', // Royal Blue Accent
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Primary Gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'electric-glow': 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
        'dark-surface': 'linear-gradient(180deg, #0B1120 0%, #030712 100%)',
        'radial-mesh': 'radial-gradient(circle at 50% 0%, rgba(30, 58, 138, 0.18) 0%, rgba(3, 7, 18, 1) 70%)',
        'radial-glow-top': 'radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.15) 0%, rgba(3, 7, 18, 0) 70%)',
      },
      boxShadow: {
        'electric-sm': '0 0 10px rgba(59, 130, 246, 0.15)',
        'electric-md': '0 4px 20px rgba(59, 130, 246, 0.25)',
        'electric-glow': '0 0 30px rgba(59, 130, 246, 0.4)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.25)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 10px 30px -10px rgba(0, 0, 0, 0.6)',
        'glass-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 15px 35px -10px rgba(59, 130, 246, 0.2)',
        'card': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 8px 24px -4px rgba(0, 0, 0, 0.4)',
        'card-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 12px 32px -4px rgba(59, 130, 246, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

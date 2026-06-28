/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ─── KunaPet Brand Colors ────────────────────────────────────────────────
      colors: {
        brand: {
          // Rojo-naranja principal (CTAs, highlights, logo)
          primary:   '#e23d28',
          'primary-hover': '#c73320',
          'primary-light': 'rgba(226, 61, 40, 0.10)',

          // Verde oscuro secundario (éxito, confirmación, área proveedor)
          secondary:   '#006D44',
          'secondary-hover': '#005233',
          'secondary-light': 'rgba(0, 109, 68, 0.10)',

          // Ámbar/dorado (advertencias, badges, rol proveedor)
          accent:   '#e0b020',
          'accent-hover': '#c89a10',
          'accent-light': 'rgba(224, 176, 32, 0.15)',

          // Emerald (proveedores, éxito, online)
          emerald:   '#059669',
          'emerald-hover': '#047857',
        },

        // ─── Neutrales de la plataforma ────────────────────────────────────────
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary:  '#F5F4F0',
          border:    '#E5E7EB',
          'border-light': '#F3F4F6',
        },

        // ─── Semánticos ────────────────────────────────────────────────────────
        success: { DEFAULT: '#16a34a', light: '#dcfce7', text: '#15803d' },
        warning: { DEFAULT: '#d97706', light: '#fef3c7', text: '#92400e' },
        danger:  { DEFAULT: '#dc2626', light: '#fee2e2', text: '#991b1b' },
        info:    { DEFAULT: '#2563eb', light: '#dbeafe', text: '#1d4ed8' },
      },

      // ─── Tipografía ──────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'black': '900',
      },

      // ─── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        'xl':   '0.75rem',
        '2xl':  '1rem',
        '3xl':  '1.5rem',
        '4xl':  '2rem',
        'pill': '9999px',
      },

      // ─── Sombras ─────────────────────────────────────────────────────────────
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)',
        'modal':   '0 25px 50px rgba(0,0,0,0.25)',
        'brand':   '0 4px 14px rgba(226, 61, 40, 0.35)',
        'brand-sm':'0 2px 8px rgba(226, 61, 40, 0.25)',
        'emerald': '0 4px 14px rgba(5, 150, 105, 0.30)',
      },

      // ─── Animaciones ─────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in':       'fade-in 0.3s ease-out both',
        'fade-in-scale': 'fade-in-scale 0.25s ease-out both',
        'slide-up':      'slide-up 0.35s ease-out both',
        'shimmer':       'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}

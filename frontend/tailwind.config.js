/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    "./index.html",
    "./src/api/**/*.{js,jsx}",
    "./src/assets/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/pages/**/*.{js,jsx}",
    "./src/*.{js,jsx}",
    "./src/website_fx/src/**/*.{js,jsx}",
    "!./src/website_fx/node_modules/**",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        dark: {
          900: 'var(--theme-bgPrimary, #0A0E14)',
          800: 'var(--theme-bgSecondary, #0D1117)',
          700: 'var(--theme-bgCard, #161B22)',
          600: 'var(--theme-bgHover, #1F2937)',
          500: '#21262D',
        },
        accent: {
          green: 'var(--theme-primary, #0080FF)',
          blue: 'var(--theme-primary, #0080FF)',
          cyan: 'var(--theme-accent, #00BFFF)',
          orange: 'var(--theme-warning, #F59E0B)',
        },
        theme: {
          primary: 'var(--theme-primary, #0080FF)',
          secondary: 'var(--theme-secondary, #00BFFF)',
          accent: 'var(--theme-accent, #00BFFF)',
          success: 'var(--theme-success, #10B981)',
          error: 'var(--theme-error, #EF4444)',
          warning: 'var(--theme-warning, #F59E0B)',
          buy: 'var(--theme-buyColor, #0080FF)',
          sell: 'var(--theme-sellColor, #EF4444)',
          profit: 'var(--theme-profitColor, #10B981)',
          loss: 'var(--theme-lossColor, #EF4444)',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

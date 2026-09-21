/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003c84',
          dark: '#00275a',
          light: '#d8e2ff',
          container: '#003c84',
          'on-container': '#82a9f8',
        },
        accent: {
          DEFAULT: '#43ccd1',
          light: '#75f6fb',
          dark: '#00696c',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f5f7fa',
          container: '#f0eded',
          'container-low': '#f6f3f2',
          'container-high': '#eae7e7',
          'container-lowest': '#ffffff',
          'container-highest': '#e5e2e1',
          dim: '#dcd9d9',
          bright: '#fcf9f8',
        },
        'on-surface': '#1c1b1b',
        'on-surface-variant': '#434751',
        'text-muted': '#5c6470',
        border: '#e2e6ec',
        outline: '#737782',
        'outline-variant': '#c3c6d2',
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          border: 'rgba(245, 158, 11, 0.3)',
        },
        error: {
          DEFAULT: '#ef4444',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
        },
        'tertiary-fixed': '#ffdbcd',
        'on-tertiary-fixed-variant': '#7a3008',
        'secondary-fixed': '#75f6fb',
        'on-secondary-fixed-variant': '#004f52',
        'primary-fixed': '#d8e2ff',
        'on-primary-fixed-variant': '#12458d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

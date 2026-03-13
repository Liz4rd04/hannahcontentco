import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#dceaff',
          200: '#bdd8ff',
          300: '#93c0ff',
          400: '#659fff',
          500: '#3f7eff',
          600: '#2a63f3',
          700: '#214cd7',
          800: '#213fae',
          900: '#223b89',
          950: '#182655',
        },
        surface: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
    },
  },
  plugins: [],
};
export default config;

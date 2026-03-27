/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e53935',
          dark: '#0b0b0c'
        }
      },
      boxShadow: {
        'outer-glow': '0 10px 30px rgba(229,57,53,0.12)'
      }
    }
  },
  plugins: [],
}

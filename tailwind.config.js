/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'stan-avatar': "url('./assets/newremove.png')",
        'dan-avatar': "url('./assets/810438.jpeg')",
        'auth-image': "url('./assets/bg.jpg')"

      },
      fontFamily: {
        'sans': 'Inter'
      }
    },
  },
  plugins: [],
}


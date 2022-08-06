/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(0, 0%, 5%)",
        secondary: "hsl(0, 0%, 12%)",
        other: "hsl(0, 0%, 15%)",
        accent: "hsl(0, 0%, 19%)",
        highlight: "hsl(345, 100%, 43%)",
        modal: "hsl(0, 0%, 5%,0.7)",
        modalDark: "hsl(0, 0%, 5%,0.8)",
      },
      fontSize: {
        xs: ".5rem",
        sm: ".7rem",
        base: ".85rem",
      },
      boxShadow: {
        form: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hoverColor: "rgb(247, 240, 240)",
        bgCl: "#fafafa",
        primary_bg: "rgb(255,255,255)",
        elevated_border: "rgb(219,219,219)",
        secondary_text: "rgb(142, 142, 142)",
        bordercl: "rgb(47,51,54)",
        homeCl: "rgba(225,225,225,0.85)",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
      "3xl": "1920px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};

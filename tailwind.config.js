/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /text-rarity-(1|2|3|4|5)/,
    },
    {
      pattern: /bg-rarity-(1|2|3|4|5)/,
    },
    "text-pyro",
    "text-hydro",
    "text-electro",
    "text-dendro",
    "text-geo",
    "text-cryo",
    "text-anemo",
    "bg-pyro",
    "bg-hydro",
    "bg-electro",
    "bg-dendro",
    "bg-geo",
    "bg-cryo",
    "bg-anemo",
  ],
  theme: {
    screens: {
      sm: "440px",
      md1: "610px",
      md2: "769px",
      lg: "1025px",
    },
    colors: {
      transparent: colors.transparent,
      light: {
        100: "#ffffff", // root
        400: "#e0e0e0",
        600: "#cccccc",
        800: "#b8b8b8",
        900: "#adadad",
      },
      dark: {
        300: "#535582",
        500: "#2c315c",
        700: "#151a40",
        900: "#050926",
      },
      black: "#000000",
      red: {
        100: "#ff8d8c",
        200: "#ff7370",
        // 300: "#ff4a47",
        400: "#ff221f",
        // 500: "#f50400",
        600: "#cc0300", // root
        700: "#a30300",
        800: "#7a0200",
        // 900: "#520100"
        rose: "#f43f5e",
      },
      green: {
        // 200: "#89fba9",
        300: "#62f98e", // root
      },
      blue: {
        400: "#60a5fa",
      },
      orange: {
        // 400: "#fba64b",
        500: "#fa8a12",
      },
      yellow: {
        200: "#f5df8f",
        300: "#f5dc6e", // modified from #f1d46a
        400: "#edc73d", // root
      },
      pyro: "#ff504a",
      hydro: "#2eaaff",
      dendro: "#49e03e",
      electro: "#cd77ff",
      anemo: "#48ffce",
      cryo: "#75faff",
      geo: "#ffc558",
      rarity: {
        1: "#808080",
        2: "#49e03e",
        3: "#8bb6ff",
        4: "#e32eff",
        5: "#ffd700",
      },
    },
    extend: {
      spacing: {
        13: "3.25rem",
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        circle: "50%",
        "2.5xl": "1.25rem",
      },
      boxShadow: {
        common: "rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px",
        "white-glow": "0 0 3px #b8b8b8",
      },
      flexBasis: {
        "1/8": "12.5%",
      },
      fontSize: {
        "1.5xl": "1.375rem",
        "2.5xl": [
          "1.75rem",
          {
            lineHeight: 1.2,
          },
        ],
        "3.5xl": "2rem",
      },
      lineHeight: {
        base: 1.35,
      },
      width: {
        18: "4.5rem",
        68: "17rem",
        75: "18.75rem",
      },
      minWidth: {
        13: "3.25rem",
      },
      maxWidth: {
        "1/3": "33.333333%",
        "1/5": "20%",
        "1/6": "16.666666%",
        "1/8": "12.5%",
      },
      height: {
        18: "4.5rem",
        "98/100": "98%",
      },
      transformOrigin: {
        "bottom-center": "bottom center",
      },
      scale: {
        180: "1.8",
      },
      transitionProperty: {
        size: "height, width",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "440px",
      md1: "610px",
      md2: "769px",
      lg: "1025px",
    },
    extend: {
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        common:
          "rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px",
      },
      fontSize: {
        "1.5xl": [
          "1.375rem",
          {
            lineHeight: "1.235",
          },
        ],
      },
      colors: {
        default: "#ebebeb",
        lesser: "#b9b9b9",
        darkblue: {
          1: "#050926",
          2: "#151a40",
          3: "#2c315c",
        },
        darkred: "#cd212a",
        lightred: "#ff8d8c",
        gold: "#ffd700",
        lightgold: "#ffdc4e",
        green: "#62f98e",
        orange: "#fa8a12",
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
      backgroundImage: {
        "gradient-5": "linear-gradient(to bottom, #a68746, #c5a03c, #e3bb2c)",
        "gradient-4": "linear-gradient(to bottom, #7e4da6, #9b4cc6, #bd44e4)",
        "gradient-3": "linear-gradient(to bottom, #5d8fa8, #72aae3, #8bb6ff)",
        "gradient-2": "linear-gradient(to bottom, #5ca862, #61c370, #63dd7e)",
        "gradient-1": "linear-gradient(to bottom, #6c6969, #8c8989, #9c9a9a)",
      },
      maxWidth: {
        95: "95%",
      },
    },
  },
  plugins: [],
};

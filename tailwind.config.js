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
      spacing: {
        13: "3.25rem",
      },
      margin: {
        "3px": "3px",
      },
      padding: {
        "3px": "3px",
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        circle: "50%",
      },
      boxShadow: {
        common:
          "rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px",
        "white-glow": "0 0 3px white",
      },
      fontSize: {
        "1.5xl": "1.375rem",
        "3.5xl": "2rem",
        h1: [
          "2rem",
          {
            lineHeight: "1.167",
          },
        ],
        h2: [
          "1.75rem",
          {
            lineHeight: "1.2",
          },
        ],
        h3: [
          "1.5rem",
          {
            lineHeight: "1.167",
          },
        ],
        h4: [
          "1.375rem",
          {
            lineHeight: "1.235",
          },
        ],
        h5: [
          "1.25rem",
          {
            lineHeight: "1.334",
          },
        ],
        h6: [
          "1.125rem",
          {
            lineHeight: "1.6",
          },
        ],
        "subtitle-1": [
          "0.875rem",
          {
            lineHeight: "1.43",
          },
        ],
      },
      lineHeight: {
        base: 1.35,
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
        darkerred: "#8a1200",
        lightred: "#ff8d8c",
        gold: "#ffd700",
        lightgold: "#ffdc4e",
        dullyellow: "#f0e873",
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
      width: {
        15: "3.75rem",
        18: "4.5rem",
        34: "8.5rem",
        68: "17rem",
        75: "18.75rem",
      },
      minWidth: {
        13: "3.25rem",
      },
      maxWidth: {
        95: "95%",
        "1/3": "33.333333%",
        "1/5": "20%",
        "1/6": "16.666666%",
        "1/8": "12.5%",
      },
      height: {
        18: "4.5rem",
        "98/100": "98%",
      },
    },
  },
  plugins: [],
};

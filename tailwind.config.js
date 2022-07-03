/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      red: "#cd212a",
      green: "#62f98e",
      orange: "#fa8a12",
    },
    extend: {
      colors: {
        default: "#ebebeb",
        darkblue: {
          1: "#050926",
          2: "#151a40",
          3: "#2c315c",
        },
        lightRed: "#ff8d8c",
        gold: "#ffd700",
        lightGold: "#ffdc4e",
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
    },
  },
  plugins: [],
};

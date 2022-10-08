import type { DataMonster } from "./types";

const monsters: DataMonster[] = [
  { code: 0, title: "Custom Target", resistance: { base: 10 } },
  {
    code: 1,
    title: "Group 1",
    names: [
      "Slime",
      "Hilichurl",
      "Specter",
      "Abyss Mage",
      "Abyss Herald",
      "Abyss Lector",
      "Eye of the Storm",
      "Hypostasis",
      "Dvalin",
      "Andrius",
      "Maguu Kenki",
      "Thunder Manifestation",
    ],
    resistance: { base: 10 },
  },
  {
    code: 2,
    title: "Group 2",
    names: ["Mitachurl", "Ruin Cruiser", "Ruin Destroyer"],
    resistance: { base: 10, phys: 30 },
  },
  {
    code: 3,
    title: "Group 3",
    names: ["Ruin Hunter", "Ruin Defender", "Ruin Scout"],
    resistance: { base: 10, phys: 50 },
  },
  {
    code: 4,
    title: "Group 4",
    names: ["Treasure Hoarders", "Nobushi", "Kairagi", "Low-tier Eremites"],
    resistance: { base: 10, phys: -20 },
  },
  {
    code: 5,
    title: "Samachurl",
    resistance: { base: 10 },
    variant: {
      types: ["dendro", "anemo", "geo", "hydro", "cryo", "electro"],
      change: 40,
    },
  },
  {
    code: 6,
    title: "Lawachurl",
    resistance: { base: 10, phys: 50 },
    variant: {
      types: ["geo", "cryo", "electro"],
      change: 60,
    },
  },
  {
    code: 7,
    title: "Ruin Guard / Ruin Grader",
    resistance: { base: 10, phys: 70 },
  },
  {
    code: 8,
    title: "Perpetual Mechanical Array",
    resistance: { base: 10, phys: 70 },
    states: { label: "stunned", changes: { base: -50 } },
  },
  {
    code: 9,
    title: "Whopperflower",
    resistance: { base: 35, phys: 35 },
    variant: {
      types: ["pyro", "cryo", "electro"],
      change: 40,
    },
    states: { label: "stunned", changes: { base: -25 } },
  },
  {
    code: 10,
    title: "Regisvine",
    resistance: { base: 110, phys: 130 },
    variant: {
      types: ["pyro", "cryo", "electro"],
      change: 60,
    },
    states: { label: "stunned", changes: { base: -100 } },
  },
  {
    code: 11,
    title: "Hydro Mimic",
    resistance: { base: 15 },
    variant: {
      types: [
        { label: "Boar/Ferret", value: "pyro" },
        { label: "Crane/Raptor", value: "electro" },
        { label: "Crab/Mallard", value: "cryo" },
        { label: "Finch/Frog", value: "geo" },
      ],
      change: -55,
    },
  },
  {
    code: 15,
    title: "Geovishap Hatchling",
    resistance: { base: 10, phys: 30, geo: 50 },
  },
  {
    code: 16,
    title: "Geovishap",
    resistance: { base: 10, phys: 30, geo: 50 },
    variant: {
      types: ["pyro", "hydro", "cryo", "electro"],
      change: 20,
    },
  },
  {
    code: 17,
    title: "Primo Geovishap",
    resistance: { base: 10, phys: 30, geo: 50 },
    variant: {
      types: ["pyro", "hydro", "cryo", "electro"],
      change: 20,
    },
    states: { label: "countered (5s)", changes: { base: -50 } },
  },
  {
    code: 19,
    title: "Rifthound Whelp",
    resistance: { base: 20 },
    states: { label: "enraged", changes: { variant: -30 } },
  },
  {
    code: 21,
    title: "Rifthound",
    resistance: { base: 25 },
    states: { label: "enraged", changes: { variant: -65 } },
  },
  {
    code: 22,
    title: "Golden Wolflord",
    resistance: { base: 25 },
    states: { label: "after Shield Phase", changes: { geo: -45 } },
  },
  {
    code: 23,
    title: "Bathysmal Vishap Hatchling",
    resistance: { base: 10, phys: 30 },
    variant: {
      types: ["electro", "hydro", "cryo"],
      change: 10,
    },
  },
  {
    code: 24,
    title: "Bathysmal Vishaps Boss",
    resistance: { base: 10, phys: 30 },
    variant: {
      types: ["electro", "cryo"],
      change: 20,
    },
  },
  {
    code: 25,
    title: "Fatui Skirmisher",
    resistance: { base: 10, phys: -20 },
    states: { label: "Armored", changes: { base: 100 } },
  },

  {
    code: 26,
    title: "Fatui Elites",
    resistance: { base: 10, phys: -20 },
    variant: {
      types: [
        { label: "Fatui Pyro Agent", value: "pyro" },
        { label: "Fatui Electro Cicin Mage", value: "electro" },
        { label: "Fatui Cryo Cicin Mage", value: "cryo" },
        { label: "Mirror Maiden", value: "hydro" },
      ],
      change: 40,
    },
  },
  {
    code: 27,
    title: "Shadowy Husks",
    resistance: { base: 10, phys: 30 },
    variant: {
      types: ["pyro", "hydro", "cryo"],
      change: 20,
    },
  },
  {
    code: 34,
    title: "Black Serpent Knight: Windcutter",
    resistance: { base: 10, phys: 30, anemo: 50 },
  },
  {
    code: 35,
    title: "Mid-tier Eremites",
    names: ["Desert Clearwater", "Sunfrost", "Daythunder"],
    resistance: { base: 10, phys: -20 },
    states: { label: "stunned", changes: { variant: -60 } },
  },
  {
    code: 36,
    title: "High-tier Eremites",
    names: ["Galehunter", "Stone Enchanter"],
    resistance: { base: 10, phys: -20 },
    states: [
      { label: "enhanced", changes: { base: 50 } },
      { label: "stunned", changes: { variant: -60 } },
    ],
  },
  {
    code: 28,
    title: "Childe Phase 1",
    resistance: { base: 0, hydro: 50 },
    states: { label: "stunned", changes: { base: -30 } },
  },
  {
    code: 29,
    title: "Childe Phase 2",
    resistance: { base: 0, electro: 50 },
    states: { label: "stunned", changes: { base: -50 } },
  },
  {
    code: 30,
    title: "Childe Phase 3",
    resistance: { base: 0, hydro: 70, electro: 70 },
  },
  {
    code: 31,
    title: "Signora Phase 1 (Cryo)",
    resistance: { base: 10, cryo: 40 },
  },
  {
    code: 32,
    title: "Signora Phase 2 (Pyro)",
    resistance: { base: 10, pyro: 60 },
  },
  {
    code: 33,
    title: "The Shogun",
    resistance: { base: 10 },
    states: { label: "stunned", changes: { base: -60 } },
  },
];

export default monsters;

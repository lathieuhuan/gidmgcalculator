import type { DataMonster } from "./types";

const monsters: DataMonster[] = [
  { code: 0, title: "Custom Target", resistance: { base: 10 } },
  {
    code: 1,
    title: "Group 1",
    subtitle: "All RES: 10",
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
    subtitle: "All RES: 10, Physical RES: 30",
    names: ["Mitachurl", "Ruin Cruiser", "Ruin Destroyer"],
    resistance: { base: 10, phys: 30 },
  },
  {
    code: 3,
    title: "Group 3",
    subtitle: "All RES: 10, Physical RES: 50",
    names: ["Ruin Hunter", "Ruin Defender", "Ruin Scout"],
    resistance: { base: 10, phys: 50 },
  },
  {
    code: 4,
    title: "Group 4",
    subtitle: "All RES: 10, Physical RES: -20",
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
    code: 37,
    title: "Small Fungus (not dendro)",
    resistance: { base: 10, dendro: 10 },
    variant: {
      types: ["pyro", "hydro", "electro", "cryo", "geo", "anemo"],
      change: 10,
    },
  },
  {
    code: 38,
    title: "Floating Dendro Fungus",
    resistance: { base: 10, dendro: 25 },
  },
  {
    code: 39,
    title: "Large Fungus (not dendro)",
    resistance: { base: 10, dendro: 20 },
    variant: {
      types: ["pyro", "hydro", "electro", "cryo", "geo", "anemo"],
      change: 20,
    },
  },
  {
    code: 40,
    title: "Winged Dendroshroom",
    resistance: { base: 10, dendro: 40 },
  },
  {
    code: 41,
    title: "Jadeplume Terrorshroom",
    resistance: { base: 25, dendro: 80 },
    inputConfigs: {
      label: "Stunned",
      changes: { base: -25 },
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
    inputConfigs: { label: "Stunned", changes: { base: -50 } },
  },
  {
    code: 12,
    title: "Ruin Serpent",
    resistance: { base: 10, phys: 70 },
    inputConfigs: { label: "Charging", changes: { base: 300 } },
  },
  {
    code: 42,
    title: "Ruin Drake",
    resistance: { base: 10, phys: 50 },
    inputConfigs: {
      label: "Absorbed element",
      type: "select",
      options: ["pyro", "hydro", "electro", "cryo", "geo", "anemo", "dendro"],
      optionChange: 40,
    },
  },
  {
    code: 43,
    title: "Aeonblight Drake",
    resistance: { base: 10, phys: 70 },
    inputConfigs: {
      label: "Absorbed element",
      type: "select",
      options: ["pyro", "hydro", "electro", "cryo", "geo", "anemo", "dendro"],
      optionChange: 60,
    },
  },
  {
    code: 20,
    title: "Primal Construct",
    resistance: { base: 10 },
    inputConfigs: { label: "Invisible", changes: { base: 50 } },
  },
  {
    code: 18,
    title: "ASIMON",
    resistance: { base: 10 },
    inputConfigs: { label: "Invisible", changes: { base: 200 } },
  },
  {
    code: 9,
    title: "Whopperflower",
    resistance: { base: 35, phys: 35 },
    variant: {
      types: ["pyro", "electro", "cryo"],
      change: 40,
    },
    inputConfigs: { label: "Stunned", changes: { base: -25 } },
  },
  {
    code: 10,
    title: "Regisvine",
    resistance: { base: 110, phys: 130 },
    variant: {
      types: ["pyro", "electro", "cryo"],
      change: 60,
    },
    inputConfigs: { label: "Stunned", changes: { base: -100 } },
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
      types: ["pyro", "hydro", "electro", "cryo"],
      change: 20,
    },
  },
  {
    code: 17,
    title: "Primo Geovishap",
    resistance: { base: 10, phys: 30, geo: 50 },
    variant: {
      types: ["pyro", "hydro", "electro", "cryo"],
      change: 20,
    },
    inputConfigs: { label: "Countered (5s)", changes: { base: -50 } },
  },
  {
    code: 19,
    title: "Rifthound Whelp",
    resistance: { base: 20 },
    variant: {
      types: ["electro", "geo"],
    },
    inputConfigs: { label: "Enraged", changes: { variant: -30 } },
  },
  {
    code: 21,
    title: "Rifthound",
    resistance: { base: 25 },
    variant: {
      types: ["electro", "geo"],
    },
    inputConfigs: { label: "Enraged", changes: { variant: -65 } },
  },
  {
    code: 22,
    title: "Golden Wolflord",
    resistance: { base: 25 },
    inputConfigs: { label: "After shield phase", changes: { geo: -45 } },
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
    inputConfigs: { label: "Armored", changes: { base: 100 } },
  },

  {
    code: 26,
    title: "Fatui Elites",
    resistance: { base: 10, phys: -20 },
    variant: {
      types: [
        { label: "Fatui Pyro Agent", value: "pyro" },
        { label: "Mirror Maiden", value: "hydro" },
        { label: "Fatui Electro Cicin Mage", value: "electro" },
        { label: "Fatui Cryo Cicin Mage", value: "cryo" },
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
    resistance: { base: 10, phys: -20 },
    variant: {
      types: [
        { label: "Desert Clearwater", value: "hydro" },
        { label: "Daythunder", value: "electro" },
        { label: "Sunfrost", value: "cryo" },
      ],
    },
    inputConfigs: { label: "Stunned", changes: { variant: -60 } },
  },
  {
    code: 36,
    title: "High-tier Eremites",
    resistance: { base: 10, phys: -20 },
    variant: {
      types: [
        { label: "Galehunter", value: "anemo" },
        { label: "Stone Enchanter", value: "geo" },
      ],
    },
    inputConfigs: {
      label: "Status",
      type: "select",
      options: [
        { label: "Enhanced", changes: { base: 50 } },
        { label: "Stunned", changes: { variant: -60 } },
      ],
    },
  },
  {
    code: 28,
    title: "Childe Phase 1",
    resistance: { base: 0, hydro: 50 },
    inputConfigs: { label: "Stunned", changes: { base: -30 } },
  },
  {
    code: 29,
    title: "Childe Phase 2",
    resistance: { base: 0, electro: 50 },
    inputConfigs: { label: "Stunned", changes: { base: -50 } },
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
    inputConfigs: { label: "Stunned", changes: { base: -60 } },
  },
  {
    code: 14,
    title: "False God of Wisdom (Phase 1)",
    resistance: { base: 10, electro: 50 },
  },
  {
    code: 13,
    title: "False God of Wisdom (Phase 2)",
    resistance: { base: 30, electro: 90 },
    inputConfigs: {
      label: "Status",
      type: "select",
      options: [
        { label: "Shielded", changes: { base: 200 } },
        { label: "Stunned", changes: { base: -170 } },
      ],
    },
  },
];

export default monsters;

import type { AppArtifact } from "@Src/types";
import { EModAffect } from "@Src/constants";

const fontaineSets: AppArtifact[] = [
  {
    code: 40,
    name: "Golden Troupe",
    variants: [4, 5],
    flower: {
      name: "Flower",
      icon: "https://images2.imgbox.com/03/ec/BOIJmvU5_o.png",
    },
    plume: {
      name: "Plume",
      icon: "https://images2.imgbox.com/57/a9/W8nhGIh5_o.png",
    },
    sands: {
      name: "Sands",
      icon: "https://images2.imgbox.com/a2/40/1OX9MKOW_o.png",
    },
    goblet: {
      name: "Goblet",
      icon: "https://images2.imgbox.com/fc/bf/E4GhjlA9_o.png",
    },
    circlet: {
      name: "Circlet",
      icon: "https://images2.imgbox.com/8d/07/qRBikoYo_o.png",
    },
    descriptions: [
      "Increases {Elemental Skill DMG}#[k] by {20%}#[v].",
      "Increases {Elemental Skill DMG}#[k] by {25%}#[v].",
      `When not on the field, {Elemental Skill DMG}#[k] will be further increased by {25%}#[v]. This effect will be
      cleared 2s after taking the field.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 20,
          target: "attPattBonus",
          path: "ES.pct_",
        },
      },
      {
        description: [1, 2],
        artBonuses: {
          value: 25,
          target: "attPattBonus",
          path: "ES.pct_",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        description: 2,
        affect: EModAffect.SELF,
        artBonuses: {
          value: 25,
          target: "attPattBonus",
          path: "ES.pct_",
        },
      },
    ],
  },
  {
    code: 39,
    name: "Marechaussee Hunter",
    variants: [4, 5],
    flower: {
      name: "Flower",
      icon: "https://images2.imgbox.com/62/6f/3vMF9DVE_o.png",
    },
    plume: {
      name: "Plume",
      icon: "https://images2.imgbox.com/c6/d2/lNSN6z4U_o.png",
    },
    sands: {
      name: "Sands",
      icon: "https://images2.imgbox.com/0c/4d/gyOO33rv_o.png",
    },
    goblet: {
      name: "Goblet",
      icon: "https://images2.imgbox.com/e0/c3/virjS4hm_o.png",
    },
    circlet: {
      name: "Circlet",
      icon: "https://images2.imgbox.com/73/4b/C6Hhb7dB_o.png",
    },
    descriptions: [
      "Increases {Normal and Charged Attack DMG}#[k] by {15%}#[v].",
      "When current HP changes, {CRIT Rate}#[k] will be increased by {12%}#[v] for 5s. Max {3}#[m] stacks.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 15,
          target: "attPattBonus",
          path: ["NA.pct_", "CA.pct_"],
        },
      },
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        artBonuses: {
          value: 12,
          stacks: {
            type: "input",
          },
          target: "totalAttr",
          path: "cRate_",
        },
      },
    ],
  },
];

export default fontaineSets;

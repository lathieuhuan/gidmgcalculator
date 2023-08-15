import type { AppArtifact } from "@Src/types";
import { EModAffect } from "@Src/constants";

const purpleOnlySets: AppArtifact[] = [
  {
    code: 21,
    name: "Resolution of Sojourner",
    variants: [4],
    flower: {
      name: "Heart of Comradeship",
      icon: "f/fc/Item_Heart_of_Comradeship",
    },
    plume: {
      name: "Feather of Homecoming",
      icon: "f/f0/Item_Feather_of_Homecoming",
    },
    sands: {
      name: "Sundial of the Sojourner",
      icon: "9/93/Item_Sundial_of_the_Sojourner",
    },
    goblet: {
      name: "Goblet of the Sojourner",
      icon: "0/06/Item_Goblet_of_the_Sojourner",
    },
    circlet: {
      name: "Crown of Parting",
      icon: "2/25/Item_Crown_of_Parting",
    },
    descriptions: ["{ATK}#[k] +{18%}#[v].", "Increases {Charged Attack CRIT Rate}#[k] by {30%}#[v]."],
    setBonuses: [
      {
        artBonuses: {
          value: 18,
          target: "totalAttr",
          path: "atk_",
        },
      },
      {
        artBonuses: {
          value: 30,
          target: "attPattBonus",
          path: "CA.cRate_",
        },
      },
    ],
  },
  {
    code: 22,
    name: "Tiny Miracle",
    variants: [4],
    flower: {
      name: "Tiny Miracle's Flower",
      icon: "6/68/Item_Tiny_Miracle%27s_Flower",
    },
    plume: {
      name: "Tiny Miracle's Feather",
      icon: "8/89/Item_Tiny_Miracle%27s_Feather",
    },
    sands: {
      name: "Tiny Miracle's Hourglass",
      icon: "1/14/Item_Tiny_Miracle%27s_Hourglass",
    },
    goblet: {
      name: "Tiny Miracle's Goblet",
      icon: "5/52/Item_Tiny_Miracle%27s_Goblet",
    },
    circlet: {
      name: "Tiny Miracle's Earrings",
      icon: "7/73/Item_Tiny_Miracle%27s_Earrings",
    },
    descriptions: [
      "All Elemental RES increased by 20%.",
      "Incoming Elemental DMG increases corresponding Elemental RES by 30% for 10s. Can only occur once every 10s.",
    ],
  },
  {
    code: 23,
    name: "Berserker",
    variants: [4],
    flower: {
      name: "Berserker's Rose",
      icon: "c/c1/Item_Berserker%27s_Rose",
    },
    plume: {
      name: "Berserker's Indigo Feather",
      icon: "1/10/Item_Berserker%27s_Indigo_Feather",
    },
    sands: {
      name: "Berserker's Timepiece",
      icon: "5/5c/Item_Berserker%27s_Timepiece",
    },
    goblet: {
      name: "Berserker's Bone Goblet",
      icon: "d/da/Item_Berserker%27s_Bone_Goblet",
    },
    circlet: {
      name: "Berserker's Battle Mask",
      icon: "5/5e/Item_Berserker%27s_Battle_Mask",
    },
    descriptions: [
      "{CRIT Rate}#[k] +{12%}#[v]",
      "When HP is below 70%, {CRIT Rate}#[k] increases by an additional {24%}#[v].",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 12,
          target: "totalAttr",
          path: "cRate_",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        artBonuses: [
          {
            value: 24,
            target: "totalAttr",
            path: "cRate_",
          },
        ],
      },
    ],
  },
  {
    code: 24,
    name: "Instructor",
    variants: [4],
    flower: {
      name: "Instructor's Brooch",
      icon: "3/35/Item_Instructor%27s_Brooch",
    },
    plume: {
      name: "Instructor's Feather Accessory",
      icon: "a/af/Item_Instructor%27s_Feather_Accessory",
    },
    sands: {
      name: "Instructor's Pocket Watch",
      icon: "4/41/Item_Instructor%27s_Pocket_Watch",
    },
    goblet: {
      name: "Instructor's Tea Cup",
      icon: "a/ad/Item_Instructor%27s_Tea_Cup",
    },
    circlet: {
      name: "Instructor's Cap",
      icon: "d/da/Item_Instructor%27s_Cap",
    },
    descriptions: [
      "Increases {Elemental Mastery}#[k] by {80}#[v].",
      "Upon triggering an Elemental Reaction, increases all party members' {Elemental Mastery}#[k] by {120}#[v] for 8s.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 80,
          target: "totalAttr",
          path: "em",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        description: 1,
        artBonuses: [
          {
            value: 120,
            target: "totalAttr",
            path: "em",
          },
        ],
      },
    ],
  },
  {
    code: 25,
    name: "The Exile",
    variants: [4],
    flower: {
      name: "Exile's Flower",
      icon: "f/f9/Item_Exile%27s_Flower",
    },
    plume: {
      name: "Exile's Feather",
      icon: "4/4d/Item_Exile%27s_Feather",
    },
    sands: {
      name: "Exile's Pocket Watch",
      icon: "e/e4/Item_Exile%27s_Pocket_Watch",
    },
    goblet: {
      name: "Exile's Goblet",
      icon: "6/6a/Item_Exile%27s_Goblet",
    },
    circlet: {
      name: "Exile's Circlet",
      icon: "b/b3/Item_Exile%27s_Circlet",
    },
    descriptions: [
      "{Energy Recharge}#[k] +{20%}#[v].",
      "Using an Elemental Burst regenerates 2 Energy for all party members (excluding the wearer) every 2s for 6s. This effect cannot stack.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 20,
          target: "totalAttr",
          path: "er_",
        },
      },
    ],
  },
  {
    code: 26,
    name: "Defender's Will",
    variants: [4],
    flower: {
      name: "Guardian's Flower",
      icon: "6/63/Item_Guardian%27s_Flower",
    },
    plume: {
      name: "Guardian's Sigil",
      icon: "f/ff/Item_Guardian%27s_Sigil",
    },
    sands: {
      name: "Guardian's Clock",
      icon: "5/51/Item_Guardian%27s_Clock",
    },
    goblet: {
      name: "Guardian's Vessel",
      icon: "2/2b/Item_Guardian%27s_Vessel",
    },
    circlet: {
      name: "Guardian's Band",
      icon: "c/c4/Item_Guardian%27s_Band",
    },
    descriptions: [
      "{DEF}#[k] +{30%}#[v].",
      "For each different element present in your own party, the wearer's Elemental RES to that corresponding element is increased by 30%.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 30,
          target: "totalAttr",
          path: "def",
        },
      },
    ],
  },
  {
    code: 27,
    name: "Brave Heart",
    variants: [4],
    flower: {
      name: "Medal of the Brave",
      icon: "9/9e/Item_Medal_of_the_Brave",
    },
    plume: {
      name: "Prospect of the Brave",
      icon: "2/2f/Item_Prospect_of_the_Brave",
    },
    sands: {
      name: "Fortitude of the Brave",
      icon: "e/ed/Item_Fortitude_of_the_Brave",
    },
    goblet: {
      name: "Outset of the Brave",
      icon: "4/49/Item_Outset_of_the_Brave",
    },
    circlet: {
      name: "Crown of the Brave",
      icon: "b/b3/Item_Crown_of_the_Brave",
    },
    descriptions: [
      "{ATK}#[k] +{18%}#[v].",
      "Increases {DMG}#[k] by {30%}#[v] against opponents with more than 50% HP.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 18,
          target: "totalAttr",
          path: "atk_",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        artBonuses: [
          {
            value: 30,
            target: "attPattBonus",
            path: "all.pct_",
          },
        ],
      },
    ],
  },
  {
    code: 28,
    name: "Martial Artist",
    variants: [4],
    flower: {
      name: "Martial Artist's Red Flower",
      icon: "a/a7/Item_Martial_Artist%27s_Red_Flower",
    },
    plume: {
      name: "Martial Artist's Feather Accessory",
      icon: "6/6e/Item_Martial_Artist%27s_Feather_Accessory",
    },
    sands: {
      name: "Martial Artist's Water Hourglass",
      icon: "0/06/Item_Martial_Artist%27s_Water_Hourglass",
    },
    goblet: {
      name: "Martial Artist's Wine Cup",
      icon: "8/8d/Item_Martial_Artist%27s_Wine_Cup",
    },
    circlet: {
      name: "Martial Artist's Bandana",
      icon: "4/4c/Item_Martial_Artist%27s_Bandana",
    },
    descriptions: [
      "Increases {Normal Attack and Charged Attack DMG}#[k] by {15%}#[v].",
      "After using Elemental Skill, increases {Normal Attack and Charged Attack DMG}#[k] by {25%}#[v] for 8s.",
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
        affect: EModAffect.SELF,
        description: 1,
        artBonuses: [
          {
            value: 25,
            target: "attPattBonus",
            path: ["NA.pct_", "CA.pct_"],
          },
        ],
      },
    ],
  },
  {
    code: 29,
    name: "Gambler",
    variants: [4],
    flower: {
      name: "Gambler's Brooch",
      icon: "3/39/Item_Gambler%27s_Brooch",
    },
    plume: {
      name: "Gambler's Feather Accessory",
      icon: "b/bf/Item_Gambler%27s_Feather_Accessory",
    },
    sands: {
      name: "Gambler's Pocket Watch",
      icon: "f/f7/Item_Gambler%27s_Pocket_Watch",
    },
    goblet: {
      name: "Gambler's Dice Cup",
      icon: "f/fd/Item_Gambler%27s_Dice_Cup",
    },
    circlet: {
      name: "Gambler's Earrings",
      icon: "4/43/Item_Gambler%27s_Earrings",
    },
    descriptions: [
      "Increases {Elemental Skill DMG}#[k] by {20%}#[v].",
      "Defeating an opponent has 100% chance to remove Elemental Skill CD. Can only occur once every 15s.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 20,
          target: "attPattBonus",
          path: "ES.pct_",
        },
      },
    ],
  },
  {
    code: 30,
    name: "Scholar",
    variants: [4],
    flower: {
      name: "Scholar's Bookmark",
      icon: "e/e5/Item_Scholar%27s_Bookmark",
    },
    plume: {
      name: "Scholar's Quill Pen",
      icon: "5/52/Item_Scholar%27s_Quill_Pen",
    },
    sands: {
      name: "Scholar's Clock",
      icon: "0/01/Item_Scholar%27s_Clock",
    },
    goblet: {
      name: "Scholar's Ink Cup",
      icon: "6/66/Item_Scholar%27s_Ink_Cup",
    },
    circlet: {
      name: "Scholar's Lens",
      icon: "9/93/Item_Scholar%27s_Lens",
    },
    descriptions: [
      "{Energy Recharge}#[k] +{20%}#[v].",
      "Gaining Elemental Particles or Orbs gives 3 Energy to all party members who have a bow or a catalyst equipped. Can only occur once every 3s.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 20,
          target: "totalAttr",
          path: "er_",
        },
      },
    ],
  },
];

export default purpleOnlySets;

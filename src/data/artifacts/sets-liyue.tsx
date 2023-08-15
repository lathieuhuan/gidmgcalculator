import type { AppArtifact } from "@Src/types";
import { EModAffect } from "@Src/constants";

const liyueSets: AppArtifact[] = [
  {
    code: 5,
    name: "Noblesse Oblige",
    variants: [4, 5],
    flower: {
      name: "Royal Flora",
      icon: "7/71/Item_Royal_Flora",
    },
    plume: {
      name: "Royal Plume",
      icon: "e/ee/Item_Royal_Plume",
    },
    sands: {
      name: "Royal Pocket Watch",
      icon: "1/1a/Item_Royal_Pocket_Watch",
    },
    goblet: {
      name: "Royal Silver Urn",
      icon: "9/9c/Item_Royal_Silver_Urn",
    },
    circlet: {
      name: "Royal Masque",
      icon: "e/eb/Item_Royal_Masque",
    },
    descriptions: [
      "Increases {Elemental Burst DMG}#[k] by {20%}#[v].",
      "Using an Elemental Burst increases all party members' {ATK}#[k] by {20%}#[v] for 12s. This effect cannot stack.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 20,
          target: "attPattBonus",
          path: "EB.pct_",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.PARTY,
        artBonuses: {
          value: 20,
          target: "totalAttr",
          path: "atk_",
        },
      },
    ],
  },
  {
    code: 6,
    name: "Bloodstained Chivalry",
    variants: [4, 5],
    flower: {
      name: "Bloodstained Flower of Iron",
      icon: "5/5b/Item_Bloodstained_Flower_of_Iron",
    },
    plume: {
      name: "Bloodstained Black Plume",
      icon: "5/5c/Item_Bloodstained_Black_Plume",
    },
    sands: {
      name: "Bloodstained Final Hour",
      icon: "8/8c/Item_Bloodstained_Final_Hour",
    },
    goblet: {
      name: "Bloodstained Chevalier's Goblet",
      icon: "4/4f/Item_Bloodstained_Chevalier%27s_Goblet",
    },
    circlet: {
      name: "Bloodstained Iron Mask",
      icon: "0/0c/Item_Bloodstained_Iron_Mask",
    },
    descriptions: [
      "Increase {Physical DMG}#[k] by {25%}#[v].",
      "After defeating an opponent, increases {Charged Attack DMG}#[k] by {50%}#[v], and reduces its Stamina cost to 0 for 10s.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 25,
          target: "totalAttr",
          path: "phys",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.SELF,
        artBonuses: {
          value: 50,
          target: "attPattBonus",
          path: "CA.pct_",
        },
      },
    ],
  },
  {
    code: 7,
    name: "Crimson Witch of Flames",
    variants: [4, 5],
    flower: {
      name: "Witch's Flower of Blaze",
      icon: "0/0f/Item_Witch%27s_Flower_of_Blaze",
    },
    plume: {
      name: "Witch's Ever-Burning Plume",
      icon: "b/b3/Item_Witch%27s_Ever-Burning_Plume",
    },
    sands: {
      name: "Witch's End Time",
      icon: "1/14/Item_Witch%27s_End_Time",
    },
    goblet: {
      name: "Witch's Heart Flames",
      icon: "b/ba/Item_Witch%27s_Heart_Flames",
    },
    circlet: {
      name: "Witch's Scorching Hat",
      icon: "e/ea/Item_Witch%27s_Scorching_Hat",
    },
    descriptions: [
      "Increase {Pyro DMG Bonus}#[k] by {15%}#[v].",
      `Increases {Overloaded, Burning, and Burngeon DMG}#[k] by {40%}#[v]. Increases {Vaporize and Melt DMG}#[k] by
      {15%}#[v].`,
      `Using an Elemental Skill increases the {2-Piece Set Bonus}#[k] by {50%}#[v] of its starting value for 10s. Max
      {3}#[m] stacks.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 15,
          target: "totalAttr",
          path: "pyro",
        },
      },
      {
        description: [1, 2],
        artBonuses: [
          {
            value: 40,
            target: "rxnBonus",
            path: ["overloaded.pct_", "burning.pct_", "burgeon.pct_"],
          },
          {
            value: 15,
            target: "rxnBonus",
            path: ["melt.pct_", "vaporize.pct_"],
          },
        ],
      },
    ],
    buffs: [
      {
        index: 0,
        description: 2,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        artBonuses: {
          value: 7.5,
          target: "totalAttr",
          stacks: {
            type: "input",
          },
          path: "pyro",
        },
      },
    ],
  },
  {
    code: 8,
    name: "Lavawalker",
    variants: [4, 5],
    flower: {
      name: "Lavawalker's Resolution",
      icon: "b/b5/Item_Lavawalker%27s_Resolution",
    },
    plume: {
      name: "Lavawalker's Salvation",
      icon: "0/0a/Item_Lavawalker%27s_Salvation",
    },
    sands: {
      name: "Lavawalker's Torment",
      icon: "3/3f/Item_Lavawalker%27s_Torment",
    },
    goblet: {
      name: "Lavawalker's Epiphany",
      icon: "1/1b/Item_Lavawalker%27s_Epiphany",
    },
    circlet: {
      name: "Lavawalker's Wisdom",
      icon: "6/63/Item_Lavawalker%27s_Wisdom",
    },
    descriptions: [
      "Pyro RES increased by 40%.",
      "Increases {DMG}#[k] against opponents affected by Pyro by {35%}#[v].",
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.SELF,
        artBonuses: {
          value: 35,
          target: "attPattBonus",
          path: "all.pct_",
        },
      },
    ],
  },
  {
    code: 9,
    name: "Archaic Petra",
    variants: [4, 5],
    flower: {
      name: "Flower of Creviced Cliff",
      icon: "9/9f/Item_Flower_of_Creviced_Cliff",
    },
    plume: {
      name: "Feather of Jagged Peaks",
      icon: "a/a5/Item_Feather_of_Jagged_Peaks",
    },
    sands: {
      name: "Sundial of Enduring Jade",
      icon: "1/1d/Item_Sundial_of_Enduring_Jade",
    },
    goblet: {
      name: "Goblet of Chiseled Crag",
      icon: "0/02/Item_Goblet_of_Chiseled_Crag",
    },
    circlet: {
      name: "Mask of Solitude Basalt",
      icon: "0/09/Item_Mask_of_Solitude_Basalt",
    },
    descriptions: [
      "Increases {Geo DMG Bonus}#[k] by {15%}#[v]",
      `Upon obtaining an Elemental Shard created through a Crystallize Reaction, all party members gain {35%}#[v]
      {DMG Bonus}#[k] for {that particular element}#[k] for 10s. Only one form of Elemental DMG Bonus can be gained
      in this manner at any one time.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 15,
          target: "totalAttr",
          path: "geo",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.PARTY,
        inputConfigs: [
          {
            label: "Element",
            type: "anemoable",
          },
        ],
        artBonuses: {
          value: 35,
          target: "totalAttr",
          path: "input_element",
        },
      },
    ],
  },
  {
    code: 10,
    name: "Retracing Bolide",
    variants: [4, 5],
    flower: {
      name: "Summer Night's Bloom",
      icon: "a/a6/Item_Summer_Night%27s_Bloom",
    },
    plume: {
      name: "Summer Night's Finale",
      icon: "e/ec/Item_Summer_Night%27s_Finale",
    },
    sands: {
      name: "Summer Night's Moment",
      icon: "3/34/Item_Summer_Night%27s_Moment",
    },
    goblet: {
      name: "Summer Night's Waterballoon",
      icon: "1/10/Item_Summer_Night%27s_Waterballoon",
    },
    circlet: {
      name: "Summer Night's Mask",
      icon: "8/8a/Item_Summer_Night%27s_Mask",
    },
    descriptions: [
      "Increases {Shield Strength}#[k] by {35%}#[v].",
      "While protected by a shield, gain an additional {40%}#[v] {Normal and Charged Attack DMG}#[k].",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 35,
          target: "totalAttr",
          path: "shieldS_",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.SELF,
        artBonuses: {
          value: 40,
          target: "attPattBonus",
          path: ["NA.pct_", "CA.pct_"],
        },
      },
    ],
  },
  {
    code: 11,
    name: "Pale Flame",
    variants: [4, 5],
    flower: {
      name: "Stainless Bloom",
      icon: "e/e7/Item_Stainless_Bloom",
    },
    plume: {
      name: "Wise Doctor's Pinion",
      icon: "e/e8/Item_Wise_Doctor%27s_Pinion",
    },
    sands: {
      name: "Moment of Cessation",
      icon: "8/85/Item_Moment_of_Cessation",
    },
    goblet: {
      name: "Surpassing Cup",
      icon: "4/4b/Item_Surpassing_Cup",
    },
    circlet: {
      name: "Mocking Mask",
      icon: "2/23/Item_Mocking_Mask",
    },
    descriptions: [
      "Increases {Physical DMG}#[k] by {25%}#[v].",
      `When an Elemental Skill hits an opponent, {ATK}#[k] is increased by {9%}#[k] for 7s. This effect stacks up to
      {2}#[m] times and can be triggered once every 0.3s. Once 2 stacks are reached, the {2-set effect}#[k] is
      increased by {100%}#[v].`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 25,
          target: "totalAttr",
          path: "phys",
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
            max: 2,
          },
        ],
        artBonuses: [
          {
            value: 9,
            stacks: {
              type: "input",
            },
            target: "totalAttr",
            path: "atk_",
          },
          {
            value: 25,
            target: "totalAttr",
            path: "phys",
            checkInput: 2,
          },
        ],
      },
    ],
  },
  {
    code: 12,
    name: "Tenacity of the Millelith",
    variants: [4, 5],
    flower: {
      name: "Flower of Accolades",
      icon: "5/51/Item_Flower_of_Accolades",
    },
    plume: {
      name: "Ceremonial War-Plume",
      icon: "8/86/Item_Ceremonial_War-Plume",
    },
    sands: {
      name: "Orichalceous Time-Dial",
      icon: "9/92/Item_Orichalceous_Time-Dial",
    },
    goblet: {
      name: "Noble's Pledging Vessel",
      icon: "f/f4/Item_Noble%27s_Pledging_Vessel",
    },
    circlet: {
      name: "General's Ancient Helm",
      icon: "b/b9/Item_General%27s_Ancient_Helm",
    },
    descriptions: [
      "Increases {HP}#[k] by {20%}#[v].",
      `When an Elemental Skill hits an opponent, the {ATK}#[k] of all nearby party members is increased by {20%}#[v]
      and their {Shield Strength}#[k] is increased by {30%}#[v] for 3s. This effect can be triggered once every 0.5s.
      This effect can still be triggered even when the character who is using this artifact set is not on the field.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 20,
          target: "totalAttr",
          path: "hp_",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.PARTY,
        artBonuses: [
          {
            value: 20,
            target: "totalAttr",
            path: "atk_",
          },
          {
            value: 30,
            target: "totalAttr",
            path: "shieldS_",
          },
        ],
      },
    ],
  },
];

export default liyueSets;

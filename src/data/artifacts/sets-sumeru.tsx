import type { AppArtifact } from "@Src/types";
import { EModAffect } from "@Src/constants";

const sumeruSets: AppArtifact[] = [
  {
    code: 38,
    name: "Nymph's Dream",
    variants: [4, 5],
    flower: {
      name: "Odyssean Flower",
      icon: "7/7b/Item_Odyssean_Flower",
    },
    plume: {
      name: "Wicked Mage's Plumule",
      icon: "e/ea/Item_Wicked_Mage%27s_Plumule",
    },
    sands: {
      name: "Nymph's Constancy",
      icon: "6/66/Item_Nymph%27s_Constancy",
    },
    goblet: {
      name: "Heroes' Tea Party",
      icon: "e/e7/Item_Heroes%27_Tea_Party",
    },
    circlet: {
      name: "Fell Dragon's Monocle",
      icon: "f/ff/Item_Fell_Dragon%27s_Monocle",
    },
    descriptions: [
      "Increase {Hydro DMG Bonus}#[k] by {15%}#[v].",
      `When Normal, Charged, or Plunging Attacks, Elemental Skills or Elemental Bursts hit an opponent, each attack
      type can provide 1 stack of Nymph's Croix for 8s. Max 5 stacks. Each stack's duration is counted independently.`,
      `While 1, 2, or 3 or more Nymph's Croix stacks are in effect, {ATK}#[k] is increased by
      {7%}#[v]/{16%}#[v]/{25%}#[v], and {Hydro DMG}#[k] is increased by {4%}#[v]/{9%}#[v]/{15%}#[v].`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 15,
          target: "totalAttr",
          path: "hydro",
        },
      },
      {
        description: [1, 2],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 2,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        artBonuses: [
          {
            value: [7, 16, 25],
            target: "totalAttr",
            path: "atk_",
          },
          {
            value: [4, 9, 15],
            target: "totalAttr",
            path: "hydro",
          },
        ],
      },
    ],
  },
  {
    code: 37,
    name: "Dewflower's Glow",
    variants: [4, 5],
    flower: {
      name: "Stamen of Khvarena's Origin",
      icon: "c/c5/Item_Stamen_of_Khvarena%27s_Origin",
    },
    plume: {
      name: "Vibrant Pinion",
      icon: "0/09/Item_Vibrant_Pinion",
    },
    sands: {
      name: "Ancient Abscission",
      icon: "d/d4/Item_Ancient_Abscission",
    },
    goblet: {
      name: "Feast of Boundless Joy",
      icon: "9/99/Item_Feast_of_Boundless_Joy",
    },
    circlet: {
      name: "Heart of Khvarena's Brilliance",
      icon: "f/fa/Item_Heart_of_Khvarena%27s_Brilliance",
    },
    descriptions: [
      "Increases {HP}#[k] by {20%}#[v].",
      "Increases {Elemental Skill and Elemental Burst DMG}#[k] by {10%}#[v].",
      `When the equipping character takes DMG, Increases {Elemental Skill and Elemental Burst DMG}#[k] by {8%}#[v] for
      5s. Max {5}#[m] stacks.`,
      `The duration of each stack is counted independently. These stacks will continue to take effect even when the
      equipping character is not on the field.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 20,
          target: "totalAttr",
          path: "hp_",
        },
      },
      {
        description: [1, 2, 3],
        artBonuses: {
          value: 10,
          target: "attPattBonus",
          path: ["ES.pct_", "EB.pct_"],
        },
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 2,
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        artBonuses: {
          value: 8,
          stacks: {
            type: "input",
          },
          target: "attPattBonus",
          path: ["ES.pct_", "EB.pct_"],
        },
      },
    ],
  },
  {
    code: 36,
    name: "Desert Pavilion Chronicle",
    variants: [4, 5],
    flower: {
      name: "The First Days of the City of Kings",
      icon: "0/01/Item_The_First_Days_of_the_City_of_Kings",
    },
    plume: {
      name: "End of the Golden Realm",
      icon: "4/49/Item_End_of_the_Golden_Realm",
    },
    sands: {
      name: "Timepiece of the Lost Path",
      icon: "4/45/Item_Timepiece_of_the_Lost_Path",
    },
    goblet: {
      name: "Defender of the Enchanting Dream",
      icon: "5/57/Item_Defender_of_the_Enchanting_Dream",
    },
    circlet: {
      name: "Legacy of the Desert High-Born",
      icon: "0/0c/Item_Legacy_of_the_Desert_High-Born",
    },
    descriptions: [
      "Increases {Anemo DMG Bonus}#[k] by {15%}#[v].",
      `When Charged Attacks hit opponents, the equipping character's {Normal Attack SPD}#[k] will increase by
      {10%}#[v] while {Normal, Charged, and Plunging Attack DMG}#[k] will increase by {40%}#[v] for 15s.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 15,
          target: "totalAttr",
          path: "anemo",
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
            value: 10,
            target: "totalAttr",
            path: "naAtkSpd_",
          },
          {
            value: 40,
            target: "attPattBonus",
            path: ["NA.pct_", "CA.pct_", "PA.pct_"],
          },
        ],
      },
    ],
  },
  {
    code: 35,
    name: "Flower of Paradise Lost",
    variants: [4, 5],
    flower: {
      name: "Moon Maiden's Myriad",
      icon: "8/8f/Item_Ay-Khanoum%27s_Myriad",
    },
    plume: {
      name: "Wilting Feast",
      icon: "f/f1/Item_Wilting_Feast",
    },
    sands: {
      name: "A Moment Congealed",
      icon: "3/33/Item_A_Moment_Congealed",
    },
    goblet: {
      name: "Secret-Keeper's Magic Bottle",
      icon: "6/6f/Item_Secret-Keeper%27s_Magic_Bottle",
    },
    circlet: {
      name: "Amethyst Crown",
      icon: "0/09/Item_Amethyst_Crown",
    },
    descriptions: [
      "Increases {Elemental Mastery}#[k] by {80}#[v].",
      "The equipping character's {Bloom, Hyperbloom, and Burgeon reaction DMG}#[k] are increased by {40%}#[v].",
      `When the equipping character triggers Bloom, Hyperbloom, or Burgeon, they will gain another {10%}#[v]
      {DMG bonus}#[k] to those reations for 10s. Max {4}#[m] stacks.`,
      `This effect can only be triggered once per second. The character who equips this can still trigger its effects
      when not on the field.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 80,
          target: "totalAttr",
          path: "em",
        },
      },
      {
        description: [1, 2, 3],
        artBonuses: {
          value: 40,
          target: "rxnBonus",
          path: ["bloom.pct_", "hyperbloom.pct_", "burgeon.pct_"],
        },
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 2,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        artBonuses: {
          value: 10,
          stacks: {
            type: "input",
          },
          target: "rxnBonus",
          path: ["bloom.pct_", "hyperbloom.pct_", "burgeon.pct_"],
        },
      },
    ],
  },
  {
    code: 33,
    name: "Deepwood Memories",
    variants: [4, 5],
    flower: {
      name: "Labyrinth Wayfarer",
      icon: "a/ab/Item_Labyrinth_Wayfarer",
    },
    plume: {
      name: "Scholar of Vines",
      icon: "0/0f/Item_Scholar_of_Vines",
    },
    sands: {
      name: "A Time of Insight",
      icon: "7/7c/Item_A_Time_of_Insight",
    },
    goblet: {
      name: "Lamp of the Lost",
      icon: "c/cd/Item_Lamp_of_the_Lost",
    },
    circlet: {
      name: "Laurel Coronet",
      icon: "b/b8/Item_Laurel_Coronet",
    },
    descriptions: [
      "Increases {Dendro DMG Bonus}#[k] by {15%}#[v].",
      `After Elemental Skills or Bursts hit opponents, the targets' {Dendro RES}#[k] will be decreased by {30%}#[v]
      for 8s. This effect can be triggered even if the equipping character is not on the field.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 15,
          target: "totalAttr",
          path: "dendro",
        },
      },
    ],
    debuffs: [
      {
        index: 0,
        description: 1,
        penalties: {
          value: 30,
          path: "dendro",
        },
      },
    ],
  },
  {
    code: 34,
    name: "Gilded Dreams",
    variants: [4, 5],
    flower: {
      name: "Dreaming Steelbloom",
      icon: "0/0c/Item_Dreaming_Steelbloom",
    },
    plume: {
      name: "Feather of Judgment",
      icon: "1/1b/Item_Feather_of_Judgment",
    },
    sands: {
      name: "The Sunken Years",
      icon: "9/92/Item_The_Sunken_Years",
    },
    goblet: {
      name: "Honeyed Final Feast",
      icon: "f/fa/Item_Honeyed_Final_Feast",
    },
    circlet: {
      name: "Shadow of the Sand King",
      icon: "2/2b/Item_Shadow_of_the_Sand_King",
    },
    descriptions: [
      "Increases {Elemental Mastery}#[k]  by {80}#[v].",
      `Within 8s of triggering an Elemental Reaction,`,
      `the character equipping this will obtain buffs based on the Elemental Type of the other party members.`,
      `{ATK}#[k] is increased by {14%}#[v] for each party member whose Elemental Type is the same as the equipping
      character, and {Elemental Mastery}#[k] is increased by {50}#[v] for every party member with a different Elemental
      Type.`,
      `Each of the aforementioned buffs will count up to 3 characters. This effect can be triggered once every 8s. The
      character who equips this can still trigger its effects when not on the field.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 80,
          target: "totalAttr",
          path: "em",
        },
      },
      {
        description: [1, 2, 3, 4],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: [1, 3],
        artBonuses: [
          {
            value: 14,
            stacks: {
              type: "vision",
              element: "same_excluded",
            },
            target: "totalAttr",
            path: "atk_",
          },
          {
            value: 50,
            stacks: {
              type: "vision",
              element: "different",
            },
            target: "totalAttr",
            path: "em",
          },
        ],
      },
    ],
  },
];

export default sumeruSets;

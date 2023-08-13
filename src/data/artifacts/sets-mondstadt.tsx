import type { AppArtifact } from "@Src/types";
import { EModAffect } from "@Src/constants";

const mondstadtSets: AppArtifact[] = [
  {
    code: 13,
    name: "Gladiator's Finale",
    variants: [4, 5],
    flower: {
      name: "Gladiator's Nostalgia",
      icon: "b/b1/Item_Gladiator%27s_Nostalgia",
    },
    plume: {
      name: "Gladiator's Destiny",
      icon: "9/94/Item_Gladiator%27s_Destiny",
    },
    sands: {
      name: "Gladiator's Longing",
      icon: "0/0c/Item_Gladiator%27s_Longing",
    },
    goblet: {
      name: "Gladiator's Intoxication",
      icon: "6/6d/Item_Gladiator%27s_Intoxication",
    },
    circlet: {
      name: "Gladiator's Triumphus",
      icon: "9/9b/Item_Gladiator%27s_Triumphus",
    },
    descriptions: [
      "{ATK}#[k] +{18%}#[v].",
      "If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their {Normal Attack DMG}#[k] by {35%}#[v].",
    ],
    setBonuses: [
      {
        bonuses: {
          value: 18,
          target: "totalAttr",
          path: "atk_",
        },
      },
      {
        bonuses: {
          value: 35,
          target: "attPattBonus",
          path: "NA.pct_",
          weaponTypes: ["sword", "claymore", "polearm"],
        },
      },
    ],
  },
  {
    code: 14,
    name: "Wanderer's Troupe",
    variants: [4, 5],
    flower: {
      name: "Troupe's Dawnlight",
      icon: "a/ad/Item_Troupe%27s_Dawnlight",
    },
    plume: {
      name: "Bard's Arrow Feather",
      icon: "4/4e/Item_Bard%27s_Arrow_Feather",
    },
    sands: {
      name: "Concert's Final Hour",
      icon: "9/9e/Item_Concert%27s_Final_Hour",
    },
    goblet: {
      name: "Wanderer's String Kettle",
      icon: "0/06/Item_Wanderer%27s_String-Kettle",
    },
    circlet: {
      name: "Conductor's Top Hat",
      icon: "8/81/Item_Conductor%27s_Top_Hat",
    },
    descriptions: [
      "Increases {Elemental Mastery}#[k] by {80}#[v].",
      "Increases {Charged Attack DMG}#[k] by {35%}#[v] if the character uses a Catalyst or Bow.",
    ],
    setBonuses: [
      {
        bonuses: {
          value: 80,
          target: "totalAttr",
          path: "em",
        },
      },
      {
        bonuses: {
          value: 35,
          target: "attPattBonus",
          path: "CA.pct_",
          weaponTypes: ["catalyst", "bow"],
        },
      },
    ],
  },
  {
    code: 15,
    name: "Viridescent Venerer",
    variants: [4, 5],
    flower: {
      name: "In Remembrance of Viridescent Fields",
      icon: "9/90/Item_In_Remembrance_of_Viridescent_Fields",
    },
    plume: {
      name: "Viridescent Arrow Feather",
      icon: "4/41/Item_Viridescent_Arrow_Feather",
    },
    sands: {
      name: "Viridescent Venerer's Determination",
      icon: "8/8f/Item_Viridescent_Venerer%27s_Determination",
    },
    goblet: {
      name: "Viridescent Venerer's Vessel",
      icon: "f/ff/Item_Viridescent_Venerer%27s_Vessel",
    },
    circlet: {
      name: "Viridescent Venerer's Diadem",
      icon: "8/8b/Item_Viridescent_Venerer%27s_Diadem",
    },
    descriptions: [
      "Anemo DMG Bonus +{15%}#[v].",
      "Increases {Swirl DMG}#[k] by {60%}#[v].",
      "Decreases opponent's {Elemental RES}#[k] to the element infused in the Swirl by {40%}#[v] for 10s.",
    ],
    setBonuses: [
      {
        bonuses: {
          value: 15,
          target: "totalAttr",
          path: "anemo",
        },
      },
      {
        bonuses: {
          value: 60,
          target: "rxnBonus",
          path: "swirl.pct_",
        },
      },
    ],
    debuffs: [
      {
        index: 0,
        description: 2,
        inputConfigs: [
          {
            label: "Element swirled",
            type: "anemoable",
          },
        ],
        penalties: {
          value: 40,
          path: "input_element",
        },
      },
    ],
  },
  {
    code: 16,
    name: "Maiden Beloved",
    variants: [4, 5],
    flower: {
      name: "Maiden's Distant Love",
      icon: "d/dc/Item_Maiden%27s_Distant_Love",
    },
    plume: {
      name: "Maiden's Heart-stricken Infatuation",
      icon: "7/7b/Item_Maiden%27s_Heart-Stricken_Infatuation",
    },
    sands: {
      name: "Maiden's Passing Youth",
      icon: "9/93/Item_Maiden%27s_Passing_Youth",
    },
    goblet: {
      name: "Maiden's Fleeting Leisure",
      icon: "2/23/Item_Maiden%27s_Fleeting_Leisure",
    },
    circlet: {
      name: "Maiden's Fading Beauty",
      icon: "8/82/Item_Maiden%27s_Fading_Beauty",
    },
    descriptions: [
      "Character {Healing Effectiveness}#[k] +{15%}#[v].",
      "Using an Elemental Skill or Burst increases healing received by all party members by 20% for 10s.",
    ],
    setBonuses: [
      {
        bonuses: {
          value: 15,
          target: "totalAttr",
          path: "healB_",
        },
      },
    ],
  },
  {
    code: 17,
    name: "Thundering Fury",
    variants: [4, 5],
    flower: {
      name: "Thunderbird's Mercy",
      icon: "5/57/Item_Thunderbird%27s_Mercy",
    },
    plume: {
      name: "Survivor of Catastrophe",
      icon: "e/e9/Item_Survivor_of_Catastrophe",
    },
    sands: {
      name: "Hourglass of Thunder",
      icon: "9/94/Item_Hourglass_of_Thunder",
    },
    goblet: {
      name: "Omen of Thunderstorm",
      icon: "c/cd/Item_Omen_of_Thunderstorm",
    },
    circlet: {
      name: "Thunder Summoner's Crown",
      icon: "a/a5/Item_Thunder_Summoner%27s_Crown",
    },
    descriptions: [
      "{Electro DMG Bonus}#[k] +{15%}#[v].",
      `Increases damage caused by {Overloaded, Electro-Charged, Superconduct and Hyperbloom}#[k] by {40%}#[v], and the
      DMG Bonus conferred by {Aggravate}#[k] is increased by {20%}#[v]. When Quicken or the aforementioned Elemental
      Reactions are triggered, Elemental Skill CD is decreased by 1s. Can only occur once every 0.8s.`,
    ],
    setBonuses: [
      {
        bonuses: {
          value: 15,
          target: "totalAttr",
          path: "electro",
        },
      },
      {
        bonuses: [
          {
            value: 40,
            target: "rxnBonus",
            path: ["overloaded.pct_", "electroCharged.pct_", "superconduct.pct_", "hyperbloom.pct_"],
          },
          {
            value: 20,
            target: "rxnBonus",
            path: "aggravate.pct_",
          },
        ],
      },
    ],
  },
  {
    code: 18,
    name: "Thundersoother",
    variants: [4, 5],
    flower: {
      name: "Thundersoother's Heart",
      icon: "e/ef/Item_Thundersoother%27s_Heart",
    },
    plume: {
      name: "Thundersoother's Plume",
      icon: "c/cb/Item_Thundersoother%27s_Plume",
    },
    sands: {
      name: "Hour of Soothing Thunder",
      icon: "b/b7/Item_Hour_of_Soothing_Thunder",
    },
    goblet: {
      name: "Thundersoother's Goblet",
      icon: "8/87/Item_Thundersoother%27s_Goblet",
    },
    circlet: {
      name: "Thundersoother's Diadem",
      icon: "1/14/Item_Thundersoother%27s_Diadem",
    },
    descriptions: [
      "Electro RES increased by 40%.",
      "Increases {DMG}#[k] against opponents affected by Electro by {35%}#[v].",
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.SELF,
        bonuses: {
          value: 35,
          target: "attPattBonus",
          path: "all.pct_",
        },
      },
    ],
  },
  {
    code: 19,
    name: "Blizzard Strayer",
    variants: [4, 5],
    flower: {
      name: "Snowswept Memory",
      icon: "6/69/Item_Snowswept_Memory",
    },
    plume: {
      name: "Icebreaker's Resolve",
      icon: "d/d6/Item_Icebreaker%27s_Resolve",
    },
    sands: {
      name: "Frozen Homeland's Demise",
      icon: "5/58/Item_Frozen_Homeland%27s_Demise",
    },
    goblet: {
      name: "Frost-Weaved Dignity",
      icon: "6/6a/Item_Frost-Weaved_Dignity",
    },
    circlet: {
      name: "Broken Rime's Echo",
      icon: "d/df/Item_Broken_Rime%27s_Echo",
    },
    descriptions: [
      "{Cryo DMG Bonus}#[k] +{15%}#[v].",
      "When a character attacks an opponent affected by Cryo, their {CRIT Rate}#[k] is increased by {20%}#[v].",
      "If the opponent is Frozen, {CRIT Rate}#[k] is increased by an additional {20%}#[v].",
    ],
    setBonuses: [
      {
        bonuses: {
          value: 15,
          target: "totalAttr",
          path: "cryo",
        },
      },
      {
        description: [1, 2],
      },
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.SELF,
        bonuses: {
          value: 20,
          target: "totalAttr",
          path: "cRate_",
        },
      },
      {
        index: 1,
        description: 2,
        affect: EModAffect.SELF,
        bonuses: {
          value: 20,
          target: "totalAttr",
          path: "cRate_",
        },
      },
    ],
  },
  {
    code: 20,
    name: "Heart of Depth",
    variants: [4, 5],
    flower: {
      name: "Gilded Corsage",
      icon: "4/40/Item_Gilded_Corsage",
    },
    plume: {
      name: "Gust of Nostalgia",
      icon: "9/92/Item_Gust_of_Nostalgia",
    },
    sands: {
      name: "Copper Compass",
      icon: "8/83/Item_Copper_Compass",
    },
    goblet: {
      name: "Goblet of Thundering Deep",
      icon: "9/9c/Item_Goblet_of_Thundering_Deep",
    },
    circlet: {
      name: "Wine-Stained Tricorne",
      icon: "a/a6/Item_Wine-Stained_Tricorne",
    },
    descriptions: [
      "{Hydro DMG Bonus}#[k] +{15%}#[v]",
      "After using an Elemental Skill, increases {Normal Attack and Charged Attack DMG}#[k] {30%}#[v] for 15s.",
    ],
    setBonuses: [
      {
        bonuses: {
          value: 15,
          target: "totalAttr",
          path: "hydro",
        },
      },
    ],
    buffs: [
      {
        index: 0,
        description: 1,
        affect: EModAffect.SELF,
        bonuses: {
          value: 30,
          target: "attPattBonus",
          path: ["NA.pct_", "CA.pct_"],
        },
      },
    ],
  },
];

export default mondstadtSets;

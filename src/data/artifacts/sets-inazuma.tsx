import type { AppArtifact } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { NCPA_PERCENTS } from "@Data/constants";

const inazumaSets: AppArtifact[] = [
  {
    code: 32,
    name: "Echoes of an Offering",
    variants: [4, 5],
    flower: {
      name: "Soulscent Bloom",
      icon: "6/64/Item_Soulscent_Bloom",
    },
    plume: {
      name: "Jade Leaf",
      icon: "9/97/Item_Jade_Leaf",
    },
    sands: {
      name: "Symbol of Felicitation",
      icon: "0/03/Item_Symbol_of_Felicitation",
    },
    goblet: {
      name: "Chalice of the Font",
      icon: "8/89/Item_Chalice_of_the_Font",
    },
    circlet: {
      name: "Flowing Rings",
      icon: "5/53/Item_Flowing_Rings",
    },
    descriptions: [
      "Increases {ATK}#[k] by {18%}#[v].",
      `When Normal Attacks hit opponents, there is a 36% chance that it will trigger Valley Rite, which will increase
      {Normal Attack DMG}#[k] by {70%}#[v] {ATK}#[k].`,
      `This effect will be dispelled 0.05s after a Normal Attack deals DMG.`,
      `If a Normal Attack fails to trigger Valley Rite, the odds of it triggering the next time will increase by 20%.`,
      `This trigger can occur once every 0.2s.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 18,
          target: "totalAttr",
          path: "atk_",
        },
      },
      {
        description: [1, 2, 3, 4],
      },
    ],
    buffs: [
      {
        index: 0,
        description: [1, 3],
        affect: EModAffect.SELF,
        artBonuses: {
          value: 0.7,
          stacks: {
            type: "attribute",
            field: "atk",
          },
          target: "attPattBonus",
          path: "NA.flat",
        },
      },
    ],
  },
  {
    code: 31,
    name: "Vermillion Hereafter",
    variants: [4, 5],
    flower: {
      name: "Flowering Life",
      icon: "1/11/Item_Flowering_Life",
    },
    plume: {
      name: "Feather of Nascent Light",
      icon: "a/a7/Item_Feather_of_Nascent_Light",
    },
    sands: {
      name: "Solar Relic",
      icon: "1/12/Item_Solar_Relic",
    },
    goblet: {
      name: "Moment of the Pact",
      icon: "7/77/Item_Moment_of_the_Pact",
    },
    circlet: {
      name: "Thundering Poise",
      icon: "0/0e/Item_Thundering_Poise",
    },
    descriptions: [
      "Increases {ATK}#[k] by {18%}#[v].",
      `After using an Elemental Burst, this character will gain the Nascent Light effect, increasing their {ATK}#[k]
      by {8%}#[v] for 16s. When the character's HP decreases, Their {ATK}#[k] will further increase by {10%}#[v]. This
      increase can occur this way a maximum of {4}#[m] times.`,
      `This effect can be triggered once every 0.8s. Nascent
      Light will be dispelled when the character leaves the field. If an Elemental Burst is used again during the
      duration of Nascent Light, the original Nascent Light will be dispelled.`,
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
        description: 1,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            initialValue: 0,
            max: 4,
          },
        ],
        artBonuses: {
          initialValue: 8,
          value: 10,
          stacks: {
            type: "input",
          },
          target: "totalAttr",
          path: "atk_",
        },
      },
    ],
  },
  {
    code: 1,
    name: "Emblem of Severed Fate",
    variants: [4, 5],
    flower: {
      name: "Magnificent Tsuba",
      icon: "5/53/Item_Magnificent_Tsuba",
    },
    plume: {
      name: "Sundered Feather",
      icon: "d/d6/Item_Sundered_Feather",
    },
    sands: {
      name: "Storm Cage",
      icon: "e/e5/Item_Storm_Cage",
    },
    goblet: {
      name: "Scarlet Vessel",
      icon: "0/00/Item_Scarlet_Vessel",
    },
    circlet: {
      name: "Ornate Kabuto",
      icon: "0/04/Item_Ornate_Kabuto",
    },
    descriptions: [
      "Increases {Energy Recharge}#[k] by {20%}#[v].",
      `Increases {Elemental Burst DMG}#[k] by {25%}#[v] of {Energy Recharge}#[k]. A maximum of {75%}#[m] bonus DMG can
      be obtained in this way.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 20,
          target: "totalAttr",
          path: "er_",
        },
      },
      {
        artBonuses: {
          value: 0.25,
          stacks: {
            type: "attribute",
            field: "er_",
          },
          target: "attPattBonus",
          path: "EB.pct_",
          max: 75,
        },
      },
    ],
  },
  {
    code: 2,
    name: "Shimenawa's Reminiscence",
    variants: [4, 5],
    flower: {
      name: "Entangling Bloom",
      icon: "c/c2/Item_Entangling_Bloom",
    },
    plume: {
      name: "Shaft of Remembrance",
      icon: "4/41/Item_Shaft_of_Remembrance",
    },
    sands: {
      name: "Morning Dew's Moment",
      icon: "9/92/Item_Morning_Dew%27s_Moment",
    },
    goblet: {
      name: "Hopeful Heart",
      icon: "8/86/Item_Hopeful_Heart",
    },
    circlet: {
      name: "Capricious Visage",
      icon: "8/8f/Item_Capricious_Visage",
    },
    descriptions: [
      "Increases {ATK}#[k] by {18%}#[v].",
      `When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and
      {Normal, Charged, and Plunging Attack DMG}#[k] is increased by {50%}#[v] for 10s.`,
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
        description: 1,
        affect: EModAffect.SELF,
        artBonuses: {
          value: 50,
          target: "attPattBonus",
          path: [...NCPA_PERCENTS],
        },
      },
    ],
  },
  {
    code: 3,
    name: "Husk of Opulent Dreams",
    variants: [4, 5],
    flower: {
      name: "Bloom Times",
      icon: "2/2b/Item_Bloom_Times",
    },
    plume: {
      name: "Plume of Luxury",
      icon: "2/2d/Item_Plume_of_Luxury",
    },
    sands: {
      name: "Song of Life",
      icon: "4/4f/Item_Song_of_Life",
    },
    goblet: {
      name: "Calabash of Awakening",
      icon: "6/63/Item_Calabash_of_Awakening",
    },
    circlet: {
      name: "Skeletal Hat",
      icon: "8/84/Item_Skeletal_Hat",
    },
    descriptions: [
      "Increases {DEF}#[k] by {30%}#[v].",
      `A character equipped with this Artifact set will obtain the Curiosity effect in the following conditions: When
      on the field, the character gains 1 stack after hitting an opponent with a Geo attack, triggering a maximum of
      once every 0.3s. When off the field, the character gains 1 stack every 3s.`,
      "Curiosity can stack up to {4}#[m] times, each providing {6%}#[v] {DEF}#[k] and a {6%}#[v] {Geo DMG Bonus}#[k].",
      "When 6 seconds pass without gaining a Curiosity stack, 1 stack is lost.",
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 30,
          target: "totalAttr",
          path: "def_",
        },
      },
      {
        description: [1, 2, 3],
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
            max: 4,
          },
        ],
        artBonuses: {
          value: 6,
          stacks: {
            type: "input",
          },
          target: "totalAttr",
          path: ["def_", "geo"],
        },
      },
    ],
  },
  {
    code: 4,
    name: "Ocean-Hued Clam",
    variants: [4, 5],
    flower: {
      name: "Sea-Dyed Blossom",
      icon: "5/58/Item_Sea-Dyed_Blossom",
    },
    plume: {
      name: "Deep Palace's Plume",
      icon: "3/33/Item_Deep_Palace%27s_Plume",
    },
    sands: {
      name: "Cowry of Parting",
      icon: "e/ed/Item_Cowry_of_Parting",
    },
    goblet: {
      name: "Pearl Cage",
      icon: "f/fc/Item_Pearl_Cage",
    },
    circlet: {
      name: "Crown of Watatsumi",
      icon: "6/60/Item_Crown_of_Watatsumi",
    },
    descriptions: [
      "Increases {Healing Bonus}#[k] by {15%}#[v].",
      `When the character equipping this artifact set heals a character in the party, a Sea-Dyed Foam will appear
      for 3 seconds, accumulating the amount of HP recovered from healing (including overflow healing). At the end
      of the duration, the Sea-Dyed Foam will explode, dealing DMG to nearby opponents based on 90% of the
      accumulated healing. (This DMG is calculated similarly to Reactions such as Electro-Charged, and
      Superconduct, but it is not affected by Elemental Mastery, Character Levels, or Reaction DMG Bonuses). Only
      one Sea-Dyed Foam can be produced every 3.5 seconds. Each Sea-Dyed Foam can accumulate up to 30,000 HP
      (including overflow healing). There can be no more than one Sea-Dyed Foam active at any given time. This
      effect can still be triggered even when the character who is using this artifact set is not on the field.`,
    ],
    setBonuses: [
      {
        artBonuses: {
          value: 15,
          target: "totalAttr",
          path: "healB_",
        },
      },
    ],
  },
];

export default inazumaSets;

import type { DataArtifact } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { findByCode } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";

const liyueSets: DataArtifact[] = [
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Elemental Burst DMG</Green> <Green b>+20%</Green>.
          </>
        ),
        applyBuff: makeModApplier("attPattBonus", "EB.pct", 20),
      },
      {
        desc: (
          <>
            Using an Elemental Burst increases all party members' <Green>ATK</Green> by{" "}
            <Green b>20%</Green> for 12s. This effect cannot stack.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(liyueSets, 5)!.setBonuses[1].desc,
        affect: EModAffect.PARTY,
        applyBuff: makeModApplier("totalAttr", "atk_", 20),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Physical DMG</Green> <Green b>+25%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "phys", 25),
      },
      {
        desc: (
          <>
            After defeating an opponent, increases <Green>Charged Attack DMG</Green> by{" "}
            <Green b>50%</Green>, and reduces its Stamina cost to 0 for 10s.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(liyueSets, 6)!.setBonuses[1].desc,
        affect: EModAffect.SELF,
        applyBuff: makeModApplier("attPattBonus", "CA.pct", 50),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Pyro DMG Bonus</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "pyro", 15),
      },
      {
        get desc() {
          return (
            <>
              Increases <Green>Overloaded, Burning, and Burngeon DMG</Green> by <Green b>40%</Green>
              . Increases <Green>Vaporize and Melt DMG</Green> by <Green b>15%</Green>{" "}
              {this.xtraDesc![0]}
            </>
          );
        },
        xtraDesc: [
          <>
            Using an Elemental Skill increases the <Green>2-Piece Set Bonus</Green> by{" "}
            <Green b>50%</Green> of its starting value for 10s. Max <Green b>3</Green>{" "}
            <Green>stacks</Green>.
          </>,
        ],
        applyBuff: makeModApplier(
          "rxnBonus",
          ["overloaded.pct", "burning.pct", "burgeon.pct", "melt.pct", "vaporize.pct"],
          [40, 40, 40, 15, 15]
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(liyueSets, 7)!.setBonuses[1].xtraDesc![0],
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
          applyModifier(desc, totalAttr, "pyro", 7.5 * (inputs[0] || 0), tracker);
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
    setBonuses: [
      {
        desc: <>Pyro RES increased by 40%.</>,
      },
      {
        desc: (
          <>
            Increases <Green>DMG</Green> against opponents affected by Pyro by <Green b>35%</Green>.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(liyueSets, 8)!.setBonuses[1].desc,
        affect: EModAffect.SELF,
        applyBuff: makeModApplier("attPattBonus", "all.pct", 35),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Geo DMG Bonus</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "geo", 15),
      },
      {
        desc: (
          <>
            Upon obtaining an Elemental Shard created through a Crystallize Reaction, all party
            members gain <Green b>35%</Green> <Green>DMG Bonus</Green> for{" "}
            <Green>that particular element</Green> for 10s. Only one form of Elemental DMG Bonus can
            be gained in this manner at any one time.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(liyueSets, 9)!.setBonuses[1].desc,
        affect: EModAffect.PARTY,
        inputConfigs: [
          {
            label: "Element",
            type: "anemoable",
          },
        ],
        applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
          const elmtIndex = inputs[0] || 0;
          applyModifier(desc, totalAttr, VISION_TYPES[elmtIndex], 35, tracker);
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
    setBonuses: [
      {
        desc: (
          <>
            Increases <Green>Shield Strength</Green> by <Green b>35%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "shStr", 35),
      },
      {
        desc: (
          <>
            While protected by a shield, gain an additional <Green b>40%</Green>{" "}
            <Green>Normal and Charged Attack DMG</Green>.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(liyueSets, 10)!.setBonuses[1].desc,
        affect: EModAffect.SELF,
        applyBuff: makeModApplier("attPattBonus", ["NA.pct", "CA.pct"], 40),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Physical DMG</Green> <Green b>+25%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "phys", 25),
      },
      {
        desc: (
          <>
            When an Elemental Skill hits an opponent, <Green>ATK</Green> is increased by{" "}
            <Green b>9%</Green> for 7s. This effect stacks up to <Green b>2</Green>{" "}
            <Green>times</Green> and can be triggered once every 0.3s. Once 2 stacks are reached,
            the <Green>2-set effect</Green> is increased by <Green b>100%</Green>.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(liyueSets, 11)!.setBonuses[1].desc,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
          const stacks = inputs[0] || 0;
          applyModifier(desc, totalAttr, "atk_", 9 * stacks, tracker);

          if (stacks === 2) {
            applyModifier(desc, totalAttr, "phys", 25, tracker);
          }
        },
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>HP</Green> <Green b>+20%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "hp_", 20),
      },
      {
        desc: (
          <>
            When an Elemental Skill hits an opponent, the <Green>ATK</Green> of all nearby party
            members is increased by <Green b>20%</Green> and their <Green>Shield Strength</Green> is
            increased by <Green b>30%</Green> for 3s. This effect can be triggered once every 0.5s.
            This effect can still be triggered even when the character who is using this artifact
            set is not on the field.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        desc: () => findByCode(liyueSets, 12)!.setBonuses[1].desc,
        affect: EModAffect.PARTY,
        applyBuff: makeModApplier("totalAttr", ["atk_", "shStr"], [20, 30]),
      },
    ],
  },
];

export default liyueSets;

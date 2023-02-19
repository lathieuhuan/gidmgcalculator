import type { DataArtifact } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { findByCode } from "@Src/utils";
import { makeModApplier } from "@Src/utils/calculation";

const purpleOnlySets: DataArtifact[] = [
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>ATK</Green> <Green b>+18%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "atk_", 18),
      },
      {
        desc: (
          <>
            Increases <Green>Charged Attack CRIT Rate</Green> by <Green b>30%</Green>.
          </>
        ),
        applyBuff: makeModApplier("attPattBonus", "CA.cRate_", 30),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>All Elemental RES</Green> increased by <Green b>20%</Green>.
          </>
        ),
      },
      {
        desc: (
          <>
            Incoming Elemental DMG increases <Green>corresponding Elemental RES</Green> by{" "}
            <Green b>30%</Green> for 10s. Can only occur once every 10s.
          </>
        ),
      },
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>CRIT Rate</Green> <Green b>+12%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "cRate_", 12),
      },
      {
        desc: (
          <>
            When HP is below 70%, <Green>CRIT Rate</Green> increases by an additional{" "}
            <Green b>24%</Green>.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => findByCode(purpleOnlySets, 23)?.setBonuses[1].desc,
        applyBuff: makeModApplier("totalAttr", "cRate_", 24),
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
    setBonuses: [
      {
        desc: (
          <>
            Increases <Green>Elemental Mastery</Green> by <Green b>80</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "em", 80),
      },
      {
        desc: (
          <>
            Upon triggering an Elemental Reaction, increases all party members'{" "}
            <Green>Elemental Mastery</Green> by <Green b>120</Green> for 8s.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        desc: () => findByCode(purpleOnlySets, 24)?.setBonuses[1].desc,
        applyBuff: makeModApplier("totalAttr", "em", 120),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Energy Recharge</Green> <Green b>+20%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "er_", 20),
      },
      {
        desc: (
          <>
            Using an Elemental Burst regenerates <Green b>2</Green> <Green>Energy</Green> for all
            party members (excluding the wearer) every 2s for 6s. This effect cannot stack.
          </>
        ),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>DEF</Green> <Green b>+30%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "def_", 30),
      },
      {
        desc: (
          <>
            For each different element present in your own party, the wearer's{" "}
            <Green>Elemental RES</Green> to that <Green>corresponding element</Green> is increased
            by <Green b>30%</Green>.
          </>
        ),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>ATK</Green> <Green b>+18%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "atk_", 18),
      },
      {
        desc: (
          <>
            Increases <Green>DMG</Green> by <Green b>30%</Green> against opponents with more than
            50% HP.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => findByCode(purpleOnlySets, 27)?.setBonuses[1].desc,
        applyBuff: makeModApplier("attPattBonus", "all.pct", 30),
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
    setBonuses: [
      {
        desc: (
          <>
            Increases <Green>Normal Attack and Charged Attack DMG</Green> by <Green b>15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("attPattBonus", ["NA.pct", "CA.pct"], 15),
      },
      {
        desc: (
          <>
            After using Elemental Skill, increases{" "}
            <Green>Normal Attack and Charged Attack DMG</Green> by <Green b>25%</Green> for 8s.
          </>
        ),
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => findByCode(purpleOnlySets, 28)?.setBonuses[1].desc,
        applyBuff: makeModApplier("attPattBonus", ["NA.pct", "CA.pct"], 25),
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
    setBonuses: [
      {
        desc: (
          <>
            Increases <Green>Elemental Skill DMG</Green> by <Green b>20%</Green>.
          </>
        ),
        applyBuff: makeModApplier("attPattBonus", "ES.pct", 20),
      },
      {
        desc: (
          <>
            Defeating an opponent has <Green b>100%</Green> <Green>chance</Green> to remove{" "}
            <Green>Elemental Skill CD</Green>. Can only occur once every 15s.
          </>
        ),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Energy Recharge</Green> <Green b>+20%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "er_", 20),
      },
      {
        desc: (
          <>
            Gaining Elemental Particles or Orbs gives <Green b>3</Green> <Green>Energy</Green> to
            all party members who have a bow or a catalyst equipped. Can only occur once every 3s.
          </>
        ),
      },
    ],
  },
];

export default purpleOnlySets;

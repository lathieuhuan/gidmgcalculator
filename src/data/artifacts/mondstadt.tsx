import type { AttackElement, DataArtifact } from "@Src/types";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { Green } from "@Styled/DataDisplay";
import { findByCode } from "@Src/utils";
import { EModAffect } from "@Src/constants";

const mondstadt: DataArtifact[] = [
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>ATK</Green> <Green b>+18%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "atk", 18),
      },
      {
        desc: (
          <>
            If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their{" "}
            <Green>Normal Attack DMG</Green> by <Green b>35%</Green>.
          </>
        ),
        applyBuff: ({ attPattBonus, charData, desc, tracker }) => {
          const supported = ["sword", "claymore", "polearm"];
          if (attPattBonus && supported.includes(charData.weapon)) {
            applyModifier(desc, attPattBonus, "NA.pct", 35, tracker);
          }
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
            Increases <Green>Charged Attack DMG</Green> by <Green b>35%</Green> if the character
            uses a Catalyst or Bow.
          </>
        ),
        applyBuff: ({ attPattBonus, charData, desc, tracker }) => {
          if (attPattBonus && ["Catalyst", "Bow"].includes(charData.weapon)) {
            applyModifier(desc, attPattBonus, "CA.pct", 35, tracker);
          }
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Anemo DMG Bonus</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "anemo", 15),
      },
      {
        desc: (
          <>
            Increases <Green>Swirl DMG</Green> by <Green b>60%</Green>. Decreases opponent's{" "}
            <Green>Elemental RES</Green> to the element infused in the Swirl by <Green b>40%</Green>{" "}
            for 10s.
          </>
        ),
        applyBuff: makeModApplier("rxnBonus", "swirl", 60),
      },
    ],
    debuffs: [
      {
        desc: () => (
          <>
            Decreases opponent's <Green>Elemental RES</Green> to the element infused in the Swirl by{" "}
            <Green b>40%</Green> for 10s.
          </>
        ),
        labels: ["Element swirled"],
        inputTypes: ["swirl"],
        applyDebuff: ({ resistReduct, inputs, desc, tracker }) => {
          const key = inputs![0] as AttackElement;
          if (key in resistReduct) {
            applyModifier(desc, resistReduct, key, 40, tracker);
          }
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
    setBonuses: [
      {
        desc: (
          <>
            Character <Green>Healing Effectiveness</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "healBn", 15),
      },
      {
        desc: (
          <>
            Using an Elemental Skill or Burst increases healing received by all party members by 20%
            for 10s.
          </>
        ),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Electro DMG Bonus</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "electro", 15),
      },
      {
        desc: (
          <>
            Increases damage caused by <Green>Overloaded, Electro-Charged and Superconduct</Green>{" "}
            by <Green b>40%</Green>. Triggering such effects decreases Elemental Skill CD by 1s. Can
            only occur once every 0.8s.
          </>
        ),
        applyBuff: makeModApplier(
          "rxnBonus",
          ["overloaded", "electroCharged", "superconduct"],
          40
        ),
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
    setBonuses: [
      {
        desc: <>Electro RES increased by 40%.</>,
      },
      {
        desc: (
          <>
            Increases <Green>DMG</Green> against opponents affected by Electro by{" "}
            <Green b>35%</Green>.
          </>
        ),
      },
    ],
    buffs: [
      {
        desc: () => findByCode(mondstadt, 18)!.setBonuses[1].desc,
        affect: EModAffect.SELF,
        applyBuff: makeModApplier("attPattBonus", "all.pct", 35),
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Cryo DMG Bonus</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "cryo", 15),
      },
      {
        desc: (
          <>
            When a character attacks an opponent affected by Cryo, their <Green>CRIT Rate</Green> is
            increased by <Green b>20%</Green>. If the opponent is Frozen, <Green>CRIT Rate</Green>{" "}
            is increased by an additional <Green b>20%</Green>.
          </>
        ),
      },
    ],
    buffs: [
      {
        desc: () => (
          <>
            When a character attacks an opponent affected by Cryo, their <Green>CRIT Rate</Green> is
            increased by <Green b>20%</Green>.
          </>
        ),
        affect: EModAffect.SELF,
        applyBuff: ({ totalAttr, desc, tracker }) => {
          const noteDesc = `${desc} on affected by Cryo`;
          applyModifier(noteDesc, totalAttr, "cRate", 20, tracker);
        },
      },
      {
        desc: () => (
          <>
            If the opponent is Frozen, <Green>CRIT Rate</Green> is increased by an additional{" "}
            <Green b>20%</Green>.
          </>
        ),
        affect: EModAffect.SELF,
        applyBuff: ({ totalAttr, desc, tracker }) => {
          applyModifier(`${desc} on frozen`, totalAttr, "cRate", 20, tracker);
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
    setBonuses: [
      {
        desc: (
          <>
            <Green>Hydro DMG Bonus</Green> <Green b>+15%</Green>.
          </>
        ),
        applyBuff: makeModApplier("totalAttr", "hydro", 15),
      },
      {
        desc: (
          <>
            After using an Elemental Skill, increases{" "}
            <Green>Normal Attack and Charged Attack DMG</Green> by <Green b>30%</Green> for 15s.
          </>
        ),
      },
    ],
    buffs: [
      {
        desc: () => findByCode(mondstadt, 20)!.setBonuses[1].desc,
        affect: EModAffect.SELF,
        applyBuff: makeModApplier("attPattBonus", ["NA.pct", "CA.pct"], 30),
      },
    ],
  },
];

export default mondstadt;

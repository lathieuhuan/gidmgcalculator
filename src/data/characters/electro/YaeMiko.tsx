import type { DataCharacter } from "@Src/types";
import { Green, Red } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const YaeMiko: DataCharacter = {
  code: 49,
  name: "Yae Miko",
  icon: "5/57/Character_Yae_Miko_Thumb",
  sideIcon: "2/25/Character_Yae_Miko_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "catalyst",
  stats: [
    [807, 26, 44],
    [2095, 69, 115],
    [2787, 91, 153],
    [4170, 137, 229],
    [4662, 153, 256],
    [5364, 176, 294],
    [6020, 197, 330],
    [6729, 220, 369],
    [7220, 236, 396],
    [7936, 260, 435],
    [8428, 276, 462],
    [9151, 300, 502],
    [9643, 316, 529],
    [10372, 340, 569],
  ],
  bonusStat: { type: "cRate", value: 4.8 },
  NAsConfig: {
    name: "Spiritfox Sin-Eater",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 39.66 },
        { name: "2-Hit", multFactors: 38.52 },
        { name: "3-Hit", multFactors: 56.89 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 142.89 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Yakan Evocation: Sesshou Sakura",
      image: "9/93/Talent_Yakan_Evocation_Sesshou_Sakura",
      xtraLvAtCons: 3,
      stats: [
        { name: "Sesshou Sakura DMG Lv.1", multFactors: 60.67 },
        { name: "DMG Lv. 2", multFactors: 75.84 },
        { name: "DMG Lv. 3", multFactors: 94.8 },
        { name: "DMG Lv. 4", multFactors: 118.5 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "14s" },
      //   { name: "CD", value: "4s" },
      // ],
    },
    EB: {
      name: "Great Secret Art: Tenko Kenshin",
      image: "9/93/Talent_Great_Secret_Art_Tenko_Kenshin",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", multFactors: 260 },
        { name: "Tenko Thunderbolt DMG", multFactors: 333.82 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "22s" }],
      energyCost: 90,
    },
  },
  passiveTalents: [
    { name: "The Shrine's Sacred Shade", image: "6/68/Talent_The_Shrine%27s_Sacred_Shade" },
    { name: "Enlightened Blessing", image: "b/ba/Talent_Enlightened_Blessing" },
    { name: "Meditation of a Yako", image: "e/e5/Talent_Meditations_of_a_Yako" },
  ],
  constellation: [
    { name: "Yakan Offering", image: "4/4e/Constellation_Yakan_Offering" },
    { name: "Fox's Mooncall", image: "5/55/Constellation_Fox%27s_Mooncall" },
    { name: "The Seven Glamours", image: "a/aa/Constellation_The_Seven_Glamours" },
    { name: "Sakura Channeling", image: "7/70/Constellation_Sakura_Channeling" },
    { name: "Mischievous Teasing", image: "a/ac/Constellation_Mischievous_Teasing" },
    { name: "Forbidden Art: Daisesshou", image: "c/cd/Constellation_Forbidden_Art_Daisesshou" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: ({ totalAttr }) => (
        <>
          Every point of <Green>Elemental Mastery</Green> Yae Miko possesses will increase Sesshou
          Sakura <Green>[ES] DMG</Green> by <Green b>0.15%</Green>.{" "}
          <Red>DMG Bonus: {(totalAttr.em * 15) / 100}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct", (totalAttr.em * 15) / 100, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 2,
      src: EModSrc.C4,
      desc: () => (
        <>
          When Sesshou Sakura thunderbolt [EB] hit opponents, the <Green>Electro DMG Bonus</Green>{" "}
          of all nearby party members is increased by <Green b>20%</Green> for 5s.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "electro", 20),
    },
    {
      index: 3,
      src: EModSrc.C6,
      desc: () => (
        <>
          Sesshou Sakura's attacks will ignore <Green b>60%</Green> of the opponents'{" "}
          <Green>DEF</Green>.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("attPattBonus", "ES.defIgnore", 60),
    },
  ],
};

export default YaeMiko;

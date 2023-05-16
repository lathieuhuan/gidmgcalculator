import type { DataCharacter, GetTalentBuffFn } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons, talentBuff } from "../utils";

const getA4TAlentBuff = (index: number): GetTalentBuffFn => {
  return ({ totalAttr, char }) => {
    const buffValue = Math.round(totalAttr.em * (index ? 0.25 : 0.75));

    return talentBuff([checkAscs[4](char), "flat", [true, 4], buffValue]);
  };
};

const Shinobu: DataCharacter = {
  code: 52,
  name: "Shinobu",
  GOOD: "KukiShinobu",
  icon: "b/b3/Kuki_Shinobu_Icon",
  sideIcon: "7/7d/Kuki_Shinobu_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weaponType: "sword",
  stats: [
    [1030, 18, 63],
    [2647, 46, 162],
    [3417, 59, 209],
    [5118, 88, 313],
    [5665, 98, 346],
    [6516, 113, 398],
    [7245, 125, 443],
    [8096, 140, 495],
    [8643, 149, 528],
    [9493, 164, 580],
    [10040, 174, 613],
    [10891, 188, 665],
    [11438, 198, 699],
    [12289, 212, 751],
  ],
  bonusStat: { type: "hp_", value: 6 },
  NAsConfig: {
    name: "Shinobu's Shadowsword",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 48.76 },
        { name: "2-Hit", multFactors: 44.55 },
        { name: "3-Hit", multFactors: 59.34 },
        { name: "4-Hit", multFactors: 76.11 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: [55.63, 66.77] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Sanctifying Ring",
      image: "d/d7/Talent_Sanctifying_Ring",
      stats: [
        { name: "Skill DMG", multFactors: 75.71 },
        {
          name: "Grass Ring of Sanctification Healing",
          notAttack: "healing",
          multFactors: { root: 3, attributeType: "hp" },
          flatFactor: 289,
          getTalentBuff: getA4TAlentBuff(0),
        },
        {
          name: "Grass Ring of Sanctification DMG",
          multFactors: 25.24,
          getTalentBuff: getA4TAlentBuff(1),
        },
        {
          name: "Thundergrass Mark (C4)",
          multFactors: { root: 9.7, attributeType: "hp", scale: 0 },
          attPatt: "none",
        },
      ],
      // getExtraStats: () => [
      //   { name: "Activation Cost", value: "30% Current HP" },
      //   { name: "Duration", value: "12s" },
      //   { name: "CD", value: "15s" },
      // ],
    },
    EB: {
      name: "Gyoei Narukami Kariyama Rite",
      image: "4/47/Talent_Gyoei_Narukami_Kariyama_Rite",
      stats: [
        { name: "Single Instance DMG", multFactors: 3.6 },
        { name: "Total DMG (HP > 50%)", multFactors: 25.23 },
        { name: "Total DMG", multFactors: 43.26 },
      ],
      multAttributeType: "hp",
      // getExtraStats: () => [
      //   { name: "Duration", value: "2s/3.5s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Breaking Free", image: "c/c7/Talent_Breaking_Free" },
    { name: "Heart's Repose", image: "1/13/Talent_Heart%27s_Repose" },
    { name: "Protracted Prayers", image: "5/5e/Talent_Protracted_Prayers" },
  ],
  constellation: [
    { name: "To Cloister Compassion", image: "4/4c/Constellation_To_Cloister_Compassion" },
    { name: "To Forsake Fortune", image: "a/a8/Constellation_To_Forsake_Fortune" },
    { name: "To Sequester Sorrow", image: "e/e4/Constellation_To_Sequester_Sorrow" },
    { name: "To Sever Sealing", image: "d/db/Constellation_To_Sever_Sealing" },
    { name: "To Cease Courtesies", image: "6/6f/Constellation_To_Cease_Courtesies" },
    { name: "To Ward Weakness", image: "9/9f/Constellation_To_Ward_Weakness" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          Sanctifying Ring's [ES] abilities are boosted:
          <br />• <Green>Healing amount</Green> will be increased by <Green b>75%</Green> of{" "}
          <Green>Elemental Mastery</Green>.
          <br />• <Green>DMG</Green> dealt is increased by <Green b>25%</Green> of <Green>Elemental Mastery</Green>.
        </>
      ),
      isGranted: checkAscs[4],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Shinobu's HP is not higher than 50%, her <Green>Healing Bonus</Green> is increased by{" "}
          <Green b>15%</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "healB_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Shinobu's HP drops below 25%, she will gain <Green b>150</Green> <Green>Elemental Mastery</Green> for
          15s. This effect will trigger once every 60s.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "em", 150),
    },
  ],
};

export default Shinobu;

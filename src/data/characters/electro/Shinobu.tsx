import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Shinobu: DefaultAppCharacter = {
  code: 52,
  name: "Shinobu",
  GOOD: "KukiShinobu",
  icon: "b/b3/Kuki_Shinobu_Icon",
  sideIcon: "7/7d/Kuki_Shinobu_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
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
  bonusStat: {
    type: "hp_",
    value: 6,
  },
  calcListConfig: {
    EB: { multAttributeType: "hp" },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 48.76 },
      { name: "2-Hit", multFactors: 44.55 },
      { name: "3-Hit", multFactors: 59.34 },
      { name: "4-Hit", multFactors: 76.11 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: [55.63, 66.77],
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 75.71 },
      {
        id: "ES.0",
        name: "Grass Ring of Sanctification Healing",
        type: "healing",
        multFactors: { root: 3, attributeType: "hp" },
        flatFactor: 289,
      },
      {
        id: "ES.1",
        name: "Grass Ring of Sanctification DMG",
        multFactors: 25.24,
      },
      {
        name: "Thundergrass Mark (C4)",
        multFactors: { root: 9.7, attributeType: "hp", scale: 0 },
        attPatt: "none",
      },
    ],
    EB: [
      { name: "Single Instance DMG", multFactors: 3.6 },
      { name: "Total DMG (HP > 50%)", multFactors: 25.23 },
      { name: "Total DMG", multFactors: 43.26 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Shinobu's Shadowsword",
    },
    ES: {
      name: "Sanctifying Ring",
      image: "d/d7/Talent_Sanctifying_Ring",
    },
    EB: {
      name: "Gyoei Narukami Kariyama Rite",
      image: "4/47/Talent_Gyoei_Narukami_Kariyama_Rite",
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
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(
          exclBuff(EModSrc.A4, "ES.0", "flat", Math.round(totalAttr.em * 0.25)),
          exclBuff(EModSrc.A4, "ES.1", "flat", Math.round(totalAttr.em * 0.75))
        );
      },
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

export default Shinobu as AppCharacter;

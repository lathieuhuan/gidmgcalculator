import type { DataCharacter } from "@Src/types";
import { Green } from "@Components";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Xiangling: DataCharacter = {
  code: 21,
  name: "Xiangling",
  icon: "3/39/Xiangling_Icon",
  sideIcon: "b/b0/Xiangling_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "polearm",
  stats: [
    [912, 19, 56],
    [2342, 48, 144],
    [3024, 63, 186],
    [4529, 94, 279],
    [5013, 104, 308],
    [5766, 119, 355],
    [6411, 133, 394],
    [7164, 148, 441],
    [7648, 158, 470],
    [8401, 174, 517],
    [8885, 184, 546],
    [9638, 200, 593],
    [10122, 210, 623],
    [10875, 225, 669],
  ],
  bonusStat: { type: "em", value: 24 },
  NAsConfig: {
    name: "Dough-Fu",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 42.05 },
        { name: "2-Hit", multFactors: 42.14 },
        { name: "3-Hit (1/2)", multFactors: 26.06 },
        { name: "4-Hit (1/4)", multFactors: 14.1 },
        { name: "5-Hit", multFactors: 71.04 },
        {
          name: "Additional Hit (C2)",
          multFactors: { root: 75, scale: 0 },
          attElmt: "pyro",
          attPatt: "none",
        },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 121.69 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Guoba Attack",
      image: "a/a9/Talent_Guoba_Attack",
      stats: [{ name: "Flame DMG (1/4)", multFactors: 111.28 }],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
    },
    EB: {
      name: "Pyronado",
      image: "2/29/Talent_Pyronado",
      stats: [
        { name: "1-Hit Swing", multFactors: 72 },
        { name: "2-Hit Swing", multFactors: 88 },
        { name: "3-Hit Swing", multFactors: 109.6 },
        { name: "Pyronado DMG", multFactors: 112 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "10s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Crossfire", image: "3/3e/Talent_Crossfire" },
    { name: "Beware, It's Super Hot!", image: "4/49/Talent_Beware%2C_It%27s_Super_Hot%21" },
    { name: "Chef de Cuisine", image: "4/4e/Talent_Chef_de_Cuisine" },
  ],
  constellation: [
    {
      name: "Crispy Outside, Tender Inside",
      image: "7/78/Constellation_Crispy_Outside%2C_Tender_Inside",
    },
    { name: "Oil Meets Fire", image: "4/40/Constellation_Oil_Meets_Fire" },
    { name: "Deepfry", image: "2/24/Constellation_Deepfry" },
    { name: "Slowbake", image: "7/7b/Constellation_Slowbake" },
    { name: "Guoba Mad", image: "a/a2/Constellation_Guoba_Mad" },
    { name: "Condensed Pyronado", image: "8/8a/Constellation_Condensed_Pyronado" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.ONE_UNIT,
      desc: () => (
        <>
          Picking up a chili pepper increases <Green>ATK</Green> by <Green b>10%</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 10),
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          For the duration of Pyronado, all party members receive a <Green b>15%</Green> <Green>Pyro DMG Bonus</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "pyro", 15),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      desc: () => (
        <>
          Opponents hit by Guoba's attacks have their <Green>Pyro RES</Green> reduced by <Green b>15%</Green> for 6s.
        </>
      ),
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 15),
    },
  ],
};

export default Xiangling;

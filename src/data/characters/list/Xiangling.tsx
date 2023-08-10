import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Xiangling: DefaultAppCharacter = {
  code: 21,
  name: "Xiangling",
  icon: "3/39/Xiangling_Icon",
  sideIcon: "b/b0/Xiangling_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  bonusStat: {
    type: "em",
    value: 24,
  },
  calcList: {
    NA: [
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
    CA: [
      {
        name: "Charged Attack",
        multFactors: 121.69,
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      {
        name: "Flame DMG (1/4)",
        multFactors: 111.28,
      },
    ],
    EB: [
      { name: "1-Hit Swing", multFactors: 72 },
      { name: "2-Hit Swing", multFactors: 88 },
      { name: "3-Hit Swing", multFactors: 109.6 },
      { name: "Pyronado DMG", multFactors: 112 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Dough-Fu",
    },
    ES: {
      name: "Guoba Attack",
      image: "a/a9/Talent_Guoba_Attack",
    },
    EB: {
      name: "Pyronado",
      image: "2/29/Talent_Pyronado",
    },
  },
  passiveTalents: [
    { name: "Crossfire", image: "3/3e/Talent_Crossfire" },
    { name: "Beware, It's Super Hot!", image: "4/49/Talent_Beware%2C_It%27s_Super_Hot%21" },
    { name: "Chef de Cuisine", image: "4/4e/Talent_Chef_de_Cuisine" },
  ],
  constellation: [
    { name: "Crispy Outside, Tender Inside", image: "7/78/Constellation_Crispy_Outside%2C_Tender_Inside" },
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
      description: `Picking up a chili pepper increases {ATK}#[gr] by {10%}#[b,gr] for 10s.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 10),
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `For the duration of Pyronado, all party members receive a {15%}#[b,gr] {Pyro DMG Bonus}#[gr].`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "pyro", 15),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      description: `Opponents hit by Guoba's attacks have their {Pyro RES}#[gr] reduced by {15%}#[b,gr] for 6s.`,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 15),
    },
  ],
};

export default Xiangling as AppCharacter;

import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Klee: DefaultAppCharacter = {
  code: 23,
  name: "Klee",
  icon: "9/9c/Klee_Icon",
  sideIcon: "b/ba/Klee_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `Explosive Spark increases the next {Charged Attack DMG}#[gr] by {50%}#[b,gr].`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("attPattBonus", "CA.pct_", 50),
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `When Sparks 'n' Splash [EB] is used, all party members will gain a {10%}#[b,gr]
      {Pyro DMG Bonus}#[gr] for 25s.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "pyro", 10),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `On hit, Jumpy Dumpty's [ES] mines decreases opponents' {DEF}#[gr] by {23%}#[b,gr] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "def", 23),
    },
  ],
};

export default Klee as AppCharacter;

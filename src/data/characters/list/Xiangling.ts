import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
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
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.ONE_UNIT,
      description: `Picking up a chili pepper increases {ATK}#[k] by {10%}#[v] for 10s.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 10),
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `For the duration of Pyronado, all party members receive a {15%}#[v] {Pyro DMG Bonus}#[k].`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "pyro", 15),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      description: `Opponents hit by Guoba's attacks have their {Pyro RES}#[k] reduced by {15%}#[v] for 6s.`,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 15),
    },
  ],
};

export default Xiangling as AppCharacter;

import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
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

export default Xiangling as AppCharacter;

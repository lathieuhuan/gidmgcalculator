import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Xingqiu: DefaultAppCharacter = {
  code: 17,
  name: "Xingqiu",
  icon: "d/d4/Xingqiu_Icon",
  sideIcon: "f/fc/Xingqiu_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  innateBuffs: [
    {
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      desc: () => (
        <>
          Xingqiu gains a <Green b>20%</Green> <Green>Hydro DMG Bonus</Green>.
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "hydro", 20),
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          During Guhua Sword: Raincutter [EB], Guhua Sword: Fatal Rainscreen <Green>[ES] DMG</Green> is increased by{" "}
          <Green b>50%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "ES.multPlus", 50),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => (
        <>
          Decreases the <Green>Hydro RES</Green> of opponents hit by sword rain attacks by <Green b>15%</Green> for 4s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 15),
    },
  ],
};

export default Xingqiu as AppCharacter;

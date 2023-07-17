import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
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
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Explosive Spark is consumed by the next <Green>Charged Attacks</Green>, which costs no Stamina and deals{" "}
          <Green b>50%</Green> increased <Green>DMG</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("attPattBonus", "CA.pct_", 50),
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When Sparks 'n' Splash [EB] is used, all party members will gain a <Green b>10%</Green>{" "}
          <Green>Pyro DMG Bonus</Green> for 25s.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "pyro", 10),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => (
        <>
          On hit, Jumpy Dumpty's [ES] mines decreases opponents' <Green>DEF</Green> by <Green b>23%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "def", 23),
    },
  ],
};

export default Klee as AppCharacter;

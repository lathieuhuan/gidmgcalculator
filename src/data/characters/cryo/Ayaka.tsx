import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Cryo, Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Ayaka: DefaultAppCharacter = {
  code: 37,
  name: "Ayaka",
  GOOD: "KamisatoAyaka",
  icon: "5/51/Kamisato_Ayaka_Icon",
  sideIcon: "2/2b/Kamisato_Ayaka_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 80,
  buffs: [
    {
      index: 0,
      src: "Alternate Sprint",
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Ayaka reappears from Senho form, she gains a <Cryo>Cryo Infusion</Cryo> for a brief period.
        </>
      ),
      infuseConfig: {
        overwritable: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After using Kamisato Art: Hyouka [ES], Ayaka's <Green>Normal and Charged attack DMG</Green> is increased by{" "}
          <Green b>30%</Green> for 6s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("attPattBonus", ["NA.pct_", "CA.pct_"], 30),
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When the Cryo application at the end of Kamisato Art: Senho hits an opponent, Ayaka gains <Green b>18%</Green>{" "}
          <Green>Cryo DMG Bonus</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "cryo", 18),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Ayaka gains Usurahi Butou every 10s, increasing her <Green>Charged Attack DMG</Green> by <Green b>298%</Green>
          .
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "CA.pct_", 298),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Opponents damaged by Frostflake Seki no To [~EB] will have their <Green>DEF</Green> decreased by{" "}
          <Green b>30%</Green> for 6s.
        </>
      ),
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "def", 30),
    },
  ],
};

export default Ayaka as AppCharacter;

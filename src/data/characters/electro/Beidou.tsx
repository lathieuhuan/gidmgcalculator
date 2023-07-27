import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Beidou: DefaultAppCharacter = {
  code: 6,
  name: "Beidou",
  icon: "e/e1/Beidou_Icon",
  sideIcon: "8/84/Beidou_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After unleashing Tidecaller [ES] with its maximum DMG Bonus, Beidou's{" "}
          <Green>Normal and Charged Attacks DMG</Green> and <Green>ATK SPD</Green> are increased by <Green b>15%</Green>{" "}
          for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, ["NA.pct_", "CA.pct_"], 15, tracker);
        applyModifier(desc, totalAttr, ["naAtkSpd_", "caAtkSpd_"], 15, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      desc: () => (
        <>
          During the duration of Stormbreaker [EB], the <Green>Electro RES</Green> of surrounding opponents is decreased
          by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyDebuff: makeModApplier("resistReduct", "electro", 15),
    },
  ],
};

export default Beidou as AppCharacter;

import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Collei: DefaultAppCharacter = {
  code: 55,
  name: "Collei",
  icon: "a/a2/Collei_Icon",
  sideIcon: "0/04/Collei_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When in the party and not on the field, Collei's <Green>Energy Recharge</Green> is increased by{" "}
          <Green b>20%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "er_", 20),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.TEAMMATE,
      desc: () => (
        <>
          Using Trump-Card Kitty [EB] will increase all nearby characters' <Green>Elemental Mastery</Green> (excluding
          Collei) by <Green b>60</Green> for 12s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "em", 60),
    },
  ],
};

export default Collei as AppCharacter;

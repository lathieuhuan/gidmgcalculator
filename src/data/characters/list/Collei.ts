import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
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
      description: `When in the party and not on the field, Collei's {Energy Recharge}#[gr] is increased by {20%}#[b,gr].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "er_", 20),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.TEAMMATE,
      description: `Using Trump-Card Kitty [EB] will increase all nearby characters' {Elemental Mastery}#[gr] (excluding
      Collei) by {60}#[b,gr] for 12s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "em", 60),
    },
  ],
};

export default Collei as AppCharacter;

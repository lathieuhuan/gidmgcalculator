import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, genExclusiveBuff } from "../utils";

const Diona: DefaultAppCharacter = {
  code: 24,
  name: "Diona",
  icon: "4/40/Diona_Icon",
  sideIcon: "e/e1/Diona_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Increases Icy Paws {[ES] DMG}#[gr] by {15%}#[b,gr], and increases its shield's {DMG Absorption}#[gr]
      by {15%}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: ({ attPattBonus, calcItemBuffs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 15, tracker);
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C2, "ES.0", "pct_", 15));
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      description: `When characters within Signature Mix's radius have more than 50% HP, their {Elemental Mastery}#[gr]
      is increased by {200}#[b,gr].`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "em", 200),
    },
  ],
};

export default Diona as AppCharacter;

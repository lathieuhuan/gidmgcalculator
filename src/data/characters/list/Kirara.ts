import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs } from "../utils";

const Kirara: DefaultAppCharacter = {
  code: 71,
  name: "Kirara",
  icon: "https://images2.imgbox.com/4c/09/DLJYSuy8_o.png",
  sideIcon: "1/1b/Kirara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "dendro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Every 1,000 Max HP Kirara possesses will increase the Meow-teor Kick {[ES] DMG}#[gr] by {0.4%}#[b,gr],
      and the Secret Art: Surprise Dispatch {[EB] DMG}#[gr] by {0.3%}#[b,gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const stacks = totalAttr.hp / 1000;
        const ESBuffValue = round(stacks * 0.4, 1);
        const EBBuffValue = round(stacks * 0.3, 1);
        applyModifier(desc, attPattBonus, ["ES.pct_", "EB.pct_"], [ESBuffValue, EBBuffValue], tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      description: `All nearby party members will gain {12%}#[b,gr] {All Elemental DMG Bonus}#[gr] within 15s after
      Kirara uses her Elemental Skill or Burst.`,
      applyBuff: makeModApplier("totalAttr", [...VISION_TYPES], 12),
    },
  ],
};

export default Kirara as AppCharacter;

import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Shinobu: DefaultAppCharacter = {
  code: 52,
  name: "Shinobu",
  icon: "b/b3/Kuki_Shinobu_Icon",
  sideIcon: "7/7d/Kuki_Shinobu_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Sanctifying Ring's [ES] abilities are boosted:
      <br />• {Healing amount}#[k] will be increased by {75%}#[v] of {Elemental Mastery}#[k].
      <br />• {DMG}#[k] dealt is increased by {25%}#[v] of {Elemental Mastery}#[k].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(
          genExclusiveBuff(EModSrc.A4, "ES.0", "flat", Math.round(totalAttr.em * 0.25)),
          genExclusiveBuff(EModSrc.A4, "ES.1", "flat", Math.round(totalAttr.em * 0.75))
        );
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `When Shinobu's HP is not higher than 50%, her {Healing Bonus}#[k] is increased by {15%}#[v].`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "healB_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `When Shinobu's HP drops below 25%, she will gain {150}#[v] {Elemental Mastery}#[k] for 15s. This
      effect will trigger once every 60s.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "em", 150),
    },
  ],
};

export default Shinobu as AppCharacter;

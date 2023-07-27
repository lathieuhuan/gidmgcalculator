import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Shinobu: DefaultAppCharacter = {
  code: 52,
  name: "Shinobu",
  GOOD: "KukiShinobu",
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
      desc: () => (
        <>
          Sanctifying Ring's [ES] abilities are boosted:
          <br />• <Green>Healing amount</Green> will be increased by <Green b>75%</Green> of{" "}
          <Green>Elemental Mastery</Green>.
          <br />• <Green>DMG</Green> dealt is increased by <Green b>25%</Green> of <Green>Elemental Mastery</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(
          exclBuff(EModSrc.A4, "ES.0", "flat", Math.round(totalAttr.em * 0.25)),
          exclBuff(EModSrc.A4, "ES.1", "flat", Math.round(totalAttr.em * 0.75))
        );
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Shinobu's HP is not higher than 50%, her <Green>Healing Bonus</Green> is increased by{" "}
          <Green b>15%</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "healB_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Shinobu's HP drops below 25%, she will gain <Green b>150</Green> <Green>Elemental Mastery</Green> for
          15s. This effect will trigger once every 60s.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "em", 150),
    },
  ],
};

export default Shinobu as AppCharacter;

import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green, Red } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const YaeMiko: DefaultAppCharacter = {
  code: 49,
  name: "Yae Miko",
  GOOD: "YaeMiko",
  icon: "b/ba/Yae_Miko_Icon",
  sideIcon: "9/97/Yae_Miko_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "catalyst",
  EBcost: 90,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: ({ totalAttr }) => (
        <>
          Every point of <Green>Elemental Mastery</Green> Yae Miko possesses will increase Sesshou Sakura{" "}
          <Green>[ES] DMG</Green> by <Green b>0.15%</Green>. <Red>DMG bonus: {(totalAttr.em * 15) / 100}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", (totalAttr.em * 15) / 100, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When Sesshou Sakura thunderbolt [ES] hit opponents, the <Green>Electro DMG Bonus</Green> of all nearby party
          members is increased by <Green b>20%</Green> for 5s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "electro", 20),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Sesshou Sakura's attacks will ignore <Green b>60%</Green> of the opponents' <Green>DEF</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "ES.defIgn_", 60),
    },
  ],
};

export default YaeMiko as AppCharacter;

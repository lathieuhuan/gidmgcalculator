import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const YaeMiko: DefaultAppCharacter = {
  code: 49,
  name: "Yae Miko",
  icon: "b/ba/Yae_Miko_Icon",
  sideIcon: "9/97/Yae_Miko_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "catalyst",
  EBcost: 90,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Every point of Yae Miko's {Elemental Mastery}#[gr] will increase Sesshou Sakura
      {[ES] DMG}#[gr] by {0.15%}#[b,gr].`,
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
      description: `When Sesshou Sakura thunderbolt [ES] hit opponents, the {Electro DMG Bonus}#[gr] of all nearby party
      members is increased by {20%}#[b,gr] for 5s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "electro", 20),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `Sesshou Sakura's attacks will ignore {60%}#[b,gr] of the opponents' {DEF}#[gr].`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "ES.defIgn_", 60),
    },
  ],
};

export default YaeMiko as AppCharacter;

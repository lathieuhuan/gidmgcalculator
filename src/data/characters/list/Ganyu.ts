import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Ganyu: DefaultAppCharacter = {
  code: 28,
  name: "Ganyu",
  icon: "7/79/Ganyu_Icon",
  sideIcon: "3/3a/Ganyu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `After firing a Frostflake Arrow, the {CRIT Rate}#[gr] of subsequent {Frostflake Arrows}#[gr] and
      their resulting {bloom effects}#[gr] is increased by {20%}#[b,gr] for 5s.`,
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A1, "CA.0", "cRate_", 20));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Celestial Shower [EB] grants a {20%}#[b,gr] {Cryo DMG Bonus}#[gr] to active members in the AoE.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "cryo", 20),
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `Opponents within Celestial Shower [EB] take increased DMG which begins at {5%}#[b,gr] and increases
      by {5%}#[b,gr] every 3s. Maximum {25%}#[r].`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct_", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      description: `Charge Level 2 Frostflake Arrows or Frostflake Arrow Blooms decrease opponents' {Cryo RES}#[gr] by
      {15%}#[b,gr] for 6s upon hit.`,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "cryo", 15),
    },
  ],
};

export default Ganyu as AppCharacter;

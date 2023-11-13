import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Freminet: DefaultAppCharacter = {
  code: 74,
  name: "Freminet",
  icon: "e/ee/Freminet_Icon",
  sideIcon: "2/21/Freminet_Side_Icon",
  rarity: 4,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    ES: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.C1,
      description: `The {CRIT Rate}#[k] of {Shattering Pressure}#[k] will be increased by {15%}#[v].`,
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C1, "ES.1", "cRate_", 15));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Stalking mode [~EB]",
      affect: EModAffect.SELF,
      description: `{Frost}#[k] released by Freminet's Normal Attacks deal {200%}#[v] of their original DMG.`,
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff("Stalking mode", "ES.0", "multPlus", 100));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `When Freminet triggers Shatter against opponents, {Shattering Pressure DMG}#[k] [~ES] will be
      increased by {40%}#[v] for 5s.`,
      isGranted: checkAscs[4],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A4, "ES.1", "pct_", 40));
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his {ATK}#[k] will be
      increased by {9%}#[v] for 6s. Max {2}#[m] stacks.`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 2,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 9 * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his {CRIT DMG}#[k] will
      be increased by {12%}#[v] for 6s. Max {3}#[m] stacks.`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 12 * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "cDmg_", buffValue, tracker);
      },
    },
  ],
};

export default Freminet as AppCharacter;

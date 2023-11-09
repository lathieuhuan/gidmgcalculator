import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, NCPA_PERCENTS } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Thoma: DefaultAppCharacter = {
  code: 43,
  name: "Thoma",
  icon: "5/5b/Thoma_Icon",
  sideIcon: "e/e9/Thoma_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `{Fiery Collapse DMG}#[gr] [~EB] is increased by {2.2%}#[b,gr] of Thoma's {Max HP}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A4, "EB.0", "flat", applyPercent(totalAttr.hp, 2.2)));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `When your active character obtains or refreshes a Blazing Barrier, this character's
      {Shield Strength}#[gr] will increase by {5%}#[b,gr] for 6s. Max {5}#[r] stacks.`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      isGranted: checkCons[6],
      description: `When a Blazing Barrier is obtained or refreshed, all party members'
      {Normal, Charged, and Plunging Attack DMG}#[gr] is increased by {15%}#[b,gr] for 6s.`,
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("attPattBonus", [...NCPA_PERCENTS], 15),
    },
  ],
};

export default Thoma as AppCharacter;

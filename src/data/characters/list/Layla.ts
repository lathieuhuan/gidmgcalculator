import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Layla: DefaultAppCharacter = {
  code: 61,
  name: "Layla",
  icon: "1/1a/Layla_Icon",
  sideIcon: "2/23/Layla_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `{Shooting Star DMG}#[gr] [~ES] is increased by {1.5%}#[b,gr] of Layla's {Max HP}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A4, "ES.0", "flat", applyPercent(totalAttr.hp, 1.5)));
      },
    },
    {
      src: EModSrc.C1,
      description: `The {Shield Absorption}#[gr] of the Curtain of Slumber [~ES] is increased by {20%}#[b,gr].`,
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C1, "ES.1", "pct_", 20));
      },
    },
    {
      src: EModSrc.C6,
      description: `Increases {Shooting Star DMG}#[gr] [~ES] and {Starlight Slug DMG}#[gr] [~EB] by {40%}#[b,gr].`,
      isGranted: checkCons[6],
      applyBuff: ({ attPattBonus, calcItemBuffs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "EB.pct_", 40, tracker);
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C6, "ES.0", "pct_", 40));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Each time the Curtain of Slumber [~ES] gains a Night Star, the {Shield Strength}#[gr] of the
      character is increased by {6%}#[b,gr]. Max {4}#[r] stacks.`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 6 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `When Nights of Formal Focus [ES] starts to fire off Shooting Stars, it will increases
      {Normal and Charged Attack DMG}#[gr] of nearby party members based on {5%}#[b,gr] of Layla's {Max HP}#[gr].`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Max HP",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: ({ fromSelf, totalAttr, attPattBonus, inputs, desc, tracker }) => {
        const maxHP = fromSelf ? totalAttr.hp : inputs[0] || 0;
        const buffValue = applyPercent(maxHP, 5);
        applyModifier(desc, attPattBonus, ["NA.flat", "CA.flat"], buffValue, tracker);
      },
    },
  ],
};

export default Layla as AppCharacter;

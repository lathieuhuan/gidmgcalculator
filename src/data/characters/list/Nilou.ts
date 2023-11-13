import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { countVision, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

function getA4BuffValue(maxHP: number) {
  const stacks = maxHP / 1000 - 30;
  return stacks > 0 ? round(Math.min(stacks * 9, 400), 1) : 0;
}

const Nilou: DefaultAppCharacter = {
  code: 60,
  name: "Nilou",
  icon: "5/58/Nilou_Icon",
  sideIcon: "c/c3/Nilou_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.C1,
      isGranted: checkCons[1],
      description: `{Watery moon DMG}#[gr] is increased by {65%}#[b,gr].`,
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C1, "ES.0", "pct_", 65));
      },
    },
    {
      src: EModSrc.C6,
      description: `For every 1,000 points of Max HP, Nilou's {CRIT Rate}#[gr] is increased by {0.6%}#[b,gr] (max
      {30%}#[r]) and her {CRIT DMG}#[gr] is increase by {1.2%}#[b,gr] (max {60%}#[r]).`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const baseValue = round(Math.min((totalAttr.hp / 1000) * 0.6, 30), 1);
        const buffValues = [baseValue, baseValue * 2];
        applyModifier(desc, totalAttr, ["cRate_", "cDmg_"], buffValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Golden Chalice's Bounty",
      affect: EModAffect.PARTY,
      description: `Increases characters' {Elemental Mastery}#[gr] by {100}#[b,gr] for 10s whenever they are hit
      by Dendro attacks. Also, triggering Bloom reaction will create Bountiful Cores instead of Dendro Cores.
      <br />• At {A4}#[g], each 1,000 points of Nilou {Max HP}#[gr] above 30,000 will cause
      {Bountiful Cores DMG}#[gr] to increase by {9%}#[b,gr]. Maximum {400%}#[r].`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          label: "Max HP (A4)",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        const { dendro, hydro, ...others } = countVision(partyData, charData);
        if (dendro && hydro && !Object.keys(others).length) {
          applyModifier(desc, totalAttr, "em", 100, tracker);
        }
      },
      applyFinalBuff: ({ fromSelf, totalAttr, rxnBonus, inputs, char, desc, tracker }) => {
        if (fromSelf ? checkAscs[4](char) : inputs[0]) {
          const buffValue = getA4BuffValue(fromSelf ? totalAttr.hp : inputs[0]);
          applyModifier(desc, rxnBonus, "bloom.pct_", buffValue, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `After the third dance step of Pirouette state [~ES] hits opponents, Dance of the Lotus: Distant Dreams,
      Listening Spring {[EB] DMG}#[gr] will be increased by {50%}#[b,gr] for 8s.`,
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 50),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `After characters affected by the Golden Chalice's Bounty deal Hydro DMG to opponents, that opponent's
      {Hydro RES}#[gr] will be decreased by {35%}#[b,gr] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 35),
    },
    {
      index: 1,
      src: EModSrc.C2,
      description: `After a triggered Bloom reaction deals DMG to opponents, their {Dendro RES}#[gr] will be decreased by
      {35%}#[b,gr] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "dendro", 35),
    },
  ],
};

export default Nilou as AppCharacter;

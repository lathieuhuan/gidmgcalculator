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
      description: `{Watery moon DMG}#[k] is increased by {65%}#[v].`,
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C1, "ES.0", "pct_", 65));
      },
    },
    {
      src: EModSrc.C6,
      description: `For every 1,000 points of Max HP, Nilou's {CRIT Rate}#[k] is increased by {0.6%}#[v] (max
      {30%}#[m]) and her {CRIT DMG}#[k] is increase by {1.2%}#[v] (max {60%}#[m]).`,
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
      description: `Increases characters' {Elemental Mastery}#[k] by {100}#[v] for 10s whenever they are hit
      by Dendro attacks. Also, triggering Bloom reaction will create Bountiful Cores instead of Dendro Cores.
      <br />• At {A4}#[ms], each 1,000 points of Nilou {Max HP}#[k] above 30,000 will cause
      {Bountiful Cores DMG}#[k] to increase by {9%}#[v]. Maximum {400%}#[m].`,
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
      Listening Spring {[EB] DMG}#[k] will be increased by {50%}#[v] for 8s.`,
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 50),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `After characters affected by the Golden Chalice's Bounty deal Hydro DMG to opponents, that opponent's
      {Hydro RES}#[k] will be decreased by {35%}#[v] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 35),
    },
    {
      index: 1,
      src: EModSrc.C2,
      description: `After a triggered Bloom reaction deals DMG to opponents, their {Dendro RES}#[k] will be decreased by
      {35%}#[v] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "dendro", 35),
    },
  ],
};

export default Nilou as AppCharacter;

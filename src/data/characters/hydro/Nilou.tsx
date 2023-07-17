import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Lightgold, Red, Rose } from "@Src/pure-components";
import { countVision, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, talentBuff } from "../utils";

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
  innateBuffs: [
    {
      src: EModSrc.C1,
      isGranted: checkCons[1],
      desc: () => (
        <>
          <Green>Watery moon DMG</Green> is increased by <Green b>65%</Green>.
        </>
      ),
      applyBuff: ({ calcItemBonuses }) => {
        calcItemBonuses.push({
          ids: "ES.0",
          bonus: talentBuff([true, "pct_", [false, 1], 65]),
        });
      },
    },
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          For every 1,000 points of Max HP, Nilou's <Green>CRIT Rate</Green> is increased by <Green b>0.6%</Green> (max{" "}
          <Rose>30%</Rose>) and her <Green>CRIT DMG</Green> is increase by <Green b>1.2%</Green> (max <Rose>60%</Rose>).
        </>
      ),
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
      desc: ({ toSelf, totalAttr, inputs }) => (
        <>
          Increases characters' <Green>Elemental Mastery</Green> by <Green b>100</Green> for 10s whenever they are hit
          by Dendro attacks. Also, triggering Bloom reaction will create Bountiful Cores instead of Dendro Cores.
          <br />• At <Lightgold>A4</Lightgold>, each 1,000 points of Nilou <Green>Max HP</Green> above 30,000 will cause{" "}
          <Green>Bountiful Cores DMG</Green> to increase by <Green>9%</Green>. Maximum <Rose>400%</Rose>.{" "}
          <Red>DMG bonus: {getA4BuffValue(toSelf ? totalAttr.hp : inputs[0] ?? 0)}%.</Red>
        </>
      ),
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
        const { dendro, hydro, ...rest } = countVision(partyData, charData);

        if (dendro && hydro && !Object.keys(rest).length) {
          applyModifier(desc, totalAttr, "em", 100, tracker);
        }
      },
      applyFinalBuff: ({ toSelf, totalAttr, rxnBonus, inputs, char, desc, tracker }) => {
        if (toSelf ? checkAscs[4](char) : inputs[0]) {
          const buffValue = getA4BuffValue(toSelf ? totalAttr.hp : inputs[0]);
          applyModifier(desc, rxnBonus, "bloom.pct_", buffValue, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After the third dance step of Pirouette state [~ES] hits opponents, Dance of the Lotus: Distant Dreams,
          Listening Spring <Green>[EB] DMG</Green> will be increased by <Green b>50%</Green> for 8s.
        </>
      ),
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 50),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => (
        <>
          After characters affected by the Golden Chalice's Bounty deal Hydro DMG to opponents, that opponent's{" "}
          <Green>Hydro RES</Green> will be decreased by <Green b>35%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 35),
    },
    {
      index: 1,
      src: EModSrc.C2,
      desc: () => (
        <>
          After a triggered Bloom reaction deals DMG to opponents, their <Green>Dendro RES</Green> will be decreased by{" "}
          <Green b>35%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "dendro", 35),
    },
  ],
};

export default Nilou as AppCharacter;

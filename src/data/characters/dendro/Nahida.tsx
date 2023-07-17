import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Rose } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, talentBuff } from "../utils";

function getEBBuff(char: CharInfo, partyData: PartyData) {
  const level = finalTalentLv({ char, charData: Nahida as AppCharacter, talentType: "EB", partyData });
  const pyroCount = partyData.reduce(
    (result, data) => (data?.vision === "pyro" ? result + 1 : result),
    checkCons[1](char) ? 1 : 0
  );
  const root = pyroCount === 1 ? 14.88 : pyroCount >= 2 ? 22.32 : 0;
  return {
    value: round(root * TALENT_LV_MULTIPLIERS[2][level], 2),
    pyroCount,
  };
}

const Nahida: DefaultAppCharacter = {
  code: 62,
  name: "Nahida",
  icon: "f/f9/Nahida_Icon",
  sideIcon: "2/22/Nahida_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "catalyst",
  EBcost: 50,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          Each point of Nahida's <Green>Elemental Mastery</Green> beyond 200 will grant <Green b>0.1%</Green>{" "}
          <Green>Bonus DMG</Green> (max <Rose>80%</Rose>) and <Green b>0.03%</Green> <Green>CRIT Rate</Green> (max{" "}
          <Rose>24%</Rose>) to <Green>Tri-Karma Purification</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBonuses, totalAttr }) => {
        const excessEM = Math.max(totalAttr.em - 200, 0);

        calcItemBonuses.push({
          ids: "ES.0",
          bonus: talentBuff(
            [true, "pct_", [true, 4], Math.min(excessEM / 10, 80)],
            [true, "cRate_", [true, 4], Math.min(round(excessEM * 0.03, 1), 24)]
          ),
        });
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => {
        const { value, pyroCount } = getEBBuff(char, partyData);
        return (
          <>
            Within the Shrine of Maya, <Green>Tri-Karma Purification DMG</Green> is increased by{" "}
            <Green b>{value}%</Green> ({pyroCount} Pyro teammates).
          </>
        );
      },
      applyFinalBuff: ({ calcItemBonuses, char, partyData }) => {
        const { value, pyroCount } = getEBBuff(char, partyData);

        if (value) {
          calcItemBonuses.push({
            ids: "ES.0",
            bonus: talentBuff([true, "pct_", `${EModSrc.EB} / ${pyroCount} Pyro teammates`, value]),
          });
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          The Elemental Mastery of the active character within the Shrine of Maya will be increased by{" "}
          <Green>25%</Green> of the <Green>Elemental Mastery</Green> of the party member with the highest Elemental
          Mastery. Maximum <Rose>250</Rose> Elemental Mastery.
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          label: "Highest Elemental Mastery",
          type: "text",
          max: 9999,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", Math.min((inputs[0] || 0) * 0.25, 250), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          <Green>Burning, Bloom, Hyperbloom, Burgeon Reaction DMG</Green> can score CRIT Hits. <Green>CRIT Rate</Green>{" "}
          and <Green>CRIT DMG</Green> are fixed at <Green b>20%</Green> and <Green b>100%</Green> respectively.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: ({ rxnBonus, desc, tracker }) => {
        applyModifier(
          desc,
          rxnBonus,
          ["burning.cRate_", "bloom.cRate_", "hyperbloom.cRate_", "burgeon.cRate_"],
          20,
          tracker
        );
        applyModifier(
          desc,
          rxnBonus,
          ["burning.cDmg_", "bloom.cDmg_", "hyperbloom.cDmg_", "burgeon.cDmg_"],
          100,
          tracker
        );
      },
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When 1/2/3/(4 or more) nearby opponents are affected by Seeds of Skandha [~ES], Nahida's{" "}
          <Green>Elemental Mastery</Green> will be increased by <Green b>100/120/140/160</Green>.
        </>
      ),
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Number of the affected",
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", (inputs[0] || 0) * 20 + 80, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Within 8s of being affected by Quicken, Aggravate, Spread, <Green>DEF</Green> is decreased by{" "}
          <Green b>30%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "def", 30),
    },
  ],
};

export default Nahida as AppCharacter;

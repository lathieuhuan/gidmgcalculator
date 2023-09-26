import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { countVision, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff, getTalentMultiplier } from "../utils";

function getEBBonus(args: DescriptionSeedGetterArgs) {
  let { pyro = 0 } = countVision(args.partyData);
  if (checkCons[1](args.char)) pyro++;
  const [level, mult] = getTalentMultiplier(
    { talentType: "EB", root: pyro === 1 ? 14.88 : pyro >= 2 ? 22.32 : 0 },
    Nahida as AppCharacter,
    args
  );
  return {
    level: level,
    value: mult,
    pyroCount: pyro,
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
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Each point of Nahida's {Elemental Mastery}#[gr] beyond 200 will grant {0.1%}#[b,gr]
      {Bonus DMG}#[gr] (max {80%}#[r]) and {0.03%}#[b,gr] {CRIT Rate}#[gr] (max {24%}#[r]) to
      {Tri-Karma Purification}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        const excessEM = Math.max(totalAttr.em - 200, 0);
        calcItemBuffs.push(
          genExclusiveBuff(EModSrc.A4, "ES.0", "pct_", Math.min(excessEM / 10, 80)),
          genExclusiveBuff(EModSrc.A4, "ES.0", "cRate_", Math.min(round(excessEM * 0.03, 1), 24))
        );
      },
    },
  ],
  dsGetters: [(args) => `${getEBBonus(args).value}%`, (args) => `${getEBBonus(args).pyroCount}`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Within the Shrine of Maya, {Tri-Karma Purification DMG}#[gr] is increased by {@0}#[b,gr] based on the number of
      {Pyro}#[pyro] party members ({@1}#[]).`,
      applyFinalBuff: (obj) => {
        const { level, value, pyroCount } = getEBBonus(obj);

        if (value) {
          obj.calcItemBuffs.push(
            genExclusiveBuff(`${EModSrc.EB} Lv.${level} / ${pyroCount} Pyro teammates`, "ES.0", "pct_", value)
          );
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `The Elemental Mastery of the active character within the Shrine of Maya will be increased by
      {25%}#[b,gr] of the {Elemental Mastery}#[gr] (upto {250}#[r]) of the party member with the highest Elemental Mastery.`,
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
      description: `{Burning, Bloom, Hyperbloom, Burgeon Reaction DMG}#[gr] can score CRIT Hits. {CRIT Rate}#[gr] and
      {CRIT DMG}#[gr] are fixed at {20%}#[b,gr] and {100%}#[b,gr] respectively.`,
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
      description: `When 1/2/3/(4 or more) nearby opponents are affected by Seeds of Skandha [~ES], Nahida's
      {Elemental Mastery}#[gr] will be increased by {100}#[b,gr]/{120}#[b,gr]/{140}#[b,gr]/{160}#[b,gr].`,
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
      description: `When opponents marked by Seeds of Skandha [~ES] are affected by Quicken, Aggravate, Spread,
      their {DEF}#[gr] is decreased by {30%}#[b,gr] for 8s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "def", 30),
    },
  ],
};

export default Nahida as AppCharacter;

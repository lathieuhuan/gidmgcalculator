import type {
  AppCharacter,
  BuffDescriptionArgs,
  CharInfo,
  DefaultAppCharacter,
  PartyData,
  TotalAttribute,
} from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier, type AttackPatternPath } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const getBuffValue = {
  ES: (args: BuffDescriptionArgs) => {
    const level = args.toSelf
      ? finalTalentLv({
          char: args.char,
          charData: Raiden as AppCharacter,
          talentType: "ES",
          partyData: args.partyData,
        })
      : args.inputs[0] || 0;
    const mult = Math.min(0.21 + level / 100, 0.3);

    return {
      desc: `${level} / ${round(mult, 2)}% * ${args.charData.EBcost} Energy Cost`,
      value: round(args.charData.EBcost * mult, 1),
    };
  },
  EB: (char: CharInfo, partyData: PartyData, totalEnergy = 0, electroEnergy = 0) => {
    const isshinBonusMults = [0, 0.73, 0.78, 0.84, 0.91, 0.96, 1.02, 1.09, 1.16, 1.23, 1.31, 1.38, 1.45, 1.54];
    const level = finalTalentLv({
      char,
      charData: Raiden as AppCharacter,
      talentType: "EB",
      partyData,
    });
    let extraEnergy = 0;

    if (checkCons[1](char) && electroEnergy <= totalEnergy) {
      extraEnergy += electroEnergy * 0.8 + (totalEnergy - electroEnergy) * 0.2;
    }

    const stackPerEnergy = Math.min(Math.ceil(14.5 + level * 0.5), 20);
    const countResolve = (energyCost: number) => Math.round(energyCost * stackPerEnergy) / 100;
    const stacks = countResolve(totalEnergy + extraEnergy);

    return {
      stackPerEnergy,
      stacks: Math.min(round(stacks, 2), 60),
      extraStacks: countResolve(extraEnergy),
      musouBonus: round(3.89 * TALENT_LV_MULTIPLIERS[2][level], 2),
      isshinBonus: isshinBonusMults[level],
    };
  },
  A4: (totalAttr: TotalAttribute) => {
    return round((totalAttr.er_ - 100) * 0.4, 1);
  },
};

const Raiden: DefaultAppCharacter = {
  code: 40,
  name: "Raiden Shogun",
  GOOD: "RaidenShogun",
  icon: "2/24/Raiden_Shogun_Icon",
  sideIcon: "c/c7/Raiden_Shogun_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "polearm",
  EBcost: 90,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [1005, 26, 61],
    [2606, 68, 159],
    [3468, 91, 212],
    [5189, 136, 317],
    [5801, 152, 355],
    [6675, 174, 408],
    [7491, 196, 458],
    [8373, 219, 512],
    [8985, 235, 549],
    [9875, 258, 604],
    [10487, 274, 641],
    [11388, 298, 696],
    [12000, 314, 734],
    [12907, 337, 789],
  ],
  bonusStat: {
    type: "er_",
    value: 8,
  },
  calcListConfig: {
    EB: { multScale: 4 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 39.65 },
      { name: "2-Hit", multFactors: 39.73 },
      { name: "3-Hit", multFactors: 49.88 },
      { name: "4-Hit (1/2)", multFactors: 28.98 },
      { name: "5-Hit", multFactors: 65.45 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 99.59,
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 117.2 },
      { name: "Coordinated ATK DMG", multFactors: 42 },
    ],
    EB: [
      { id: "EB.0", name: "Musou no Hitotachi", multFactors: { root: 400.8, scale: 2 } },
      { id: "EB.1", name: "1-Hit", multFactors: 44.74 },
      { id: "EB.2", name: "2-Hit", multFactors: 43.96 },
      { id: "EB.3", name: "3-Hit", multFactors: 53.82 },
      { id: "EB.4", name: "4-Hit", multFactors: [30.89, 30.98] },
      { id: "EB.5", name: "5-Hit", multFactors: 73.94 },
      { id: "EB.6", name: "Charged Attack", multFactors: [61.6, 74.36] },
      { id: "EB.7", name: "Plunge DMG", multFactors: { root: 63.93, scale: 1 } },
      { id: "EB.8", name: "Low Plunge", multFactors: { root: 127.84, scale: 1 } },
      { id: "EB.9", name: "High Plunge", multFactors: { root: 159.68, scale: 1 } },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Origin",
    },
    ES: {
      name: "Transcendence: Baleful Omen",
      image: "3/3c/Talent_Transcendence_Baleful_Omen",
    },
    EB: {
      name: "Secret Art: Musou Shinsetsu",
      image: "e/e0/Talent_Secret_Art_Musou_Shinsetsu",
    },
  },
  passiveTalents: [
    { name: "Wishes Unnumbered", image: "b/bc/Talent_Wishes_Unnumbered" },
    { name: "Enlightened One", image: "b/b7/Talent_Enlightened_One" },
    { name: "All-Preserver", image: "0/0e/Talent_All-Preserver" },
  ],
  constellation: [
    { name: "Ominous Inscription", image: "2/24/Constellation_Ominous_Inscription" },
    { name: "Steelbreaker", image: "4/4e/Constellation_Steelbreaker" },
    { name: "Shinkage Bygones", image: "4/4d/Constellation_Shinkage_Bygones" },
    { name: "Pledge of Propriety", image: "c/c4/Constellation_Pledge_of_Propriety" },
    { name: "Shogun's Descent", image: "8/85/Constellation_Shogun%27s_Descent" },
    { name: "Wishbearer", image: "5/5e/Constellation_Wishbearer" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Each 1% above 100% {Energy Recharge}#[gr] grants the Raiden Shogun {0.4%}#[b,gr]
      {Electro DMG Bonus}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const buffValue = getBuffValue.A4(totalAttr);
        applyModifier(desc, totalAttr, "electro", buffValue, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.PARTY,
      description: `Eye of Stormy Judgment increases {Elemental Burst DMG}#[gr] based on the {Energy Cost}#[gr] of
      the Elemental Burst during the eye's duration.`,
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const result = getBuffValue.ES(obj);
        const desc = `${obj.desc} / Lv. ${result.desc}`;
        applyModifier(desc, obj.attPattBonus, "EB.pct_", result.value, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Musou no Hitotachi and Musou Isshin's attacks {[EB] DMG}#[gr] will be increased based on the number
      of Chakra Desiderata's Resolve stacks consumed.
      <br />Grants an {Electro Infusion}#[electro] which cannot be overridden.
      <br />• At {C1}#[g], increases {Resolve}#[gr] gained from Electro characters by {80%}#[b,gr], from characters of
      other visions by {20%}#[b,gr].
      <br />• At {C2}#[g], the Raiden Shogun's attacks ignore {60%}#[b,gr] of opponents' {DEF}#[gr].`,
      inputConfigs: [
        { label: "Total Energy spent", type: "text", max: 999 },
        { label: "Energy spent by Electro characters (C1)", type: "text", max: 999 },
      ],
      applyBuff: ({ char, attPattBonus, calcItemBuffs, inputs, partyData, desc, tracker }) => {
        const buffValue = getBuffValue.EB(char, partyData, inputs[0], inputs[1]);
        const { stacks, musouBonus, isshinBonus } = buffValue;

        if (stacks) {
          const musouDesc = `${stacks} Resolve, ${musouBonus}% extra multiplier each`;
          const isshinDesc = `${stacks} Resolve, ${isshinBonus}% extra multiplier each`;
          const ids = Array.from({ length: 9 }).map((_, i) => `EB.${i + 1}`);

          calcItemBuffs.push(
            exclBuff(musouDesc, "EB.0", "mult_", round(stacks * musouBonus, 2)),
            exclBuff(isshinDesc, ids, "mult_", round(stacks * isshinBonus, 2))
          );
        }

        if (checkCons[2](char)) {
          const fields: AttackPatternPath[] = ["NA.defIgn_", "CA.defIgn_", "PA.defIgn_", "ES.defIgn_", "EB.defIgn_"];
          applyModifier(desc, attPattBonus, fields, 60, tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.TEAMMATE,
      description: `When the Musou Isshin state expires, all nearby party members (excluding the Raiden Shogun) gain
      {30%}#[b,gr] {ATK}#[gr] for 10s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 30),
    },
  ],
};

export default Raiden as AppCharacter;

import type {
  CharData,
  CharInfo,
  DataCharacter,
  GetTalentBuffFn,
  ModifierCtrl,
  ModifierInput,
  PartyData,
  TotalAttribute,
} from "@Src/types";
import { Electro, Green, Lightgold, Red } from "@Components/atoms";
import { ATTACK_PATTERNS, EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { round1, round2 } from "@Src/utils";
import {
  finalTalentLv,
  applyModifier,
  makeModApplier,
  type AttackPatternPath,
} from "@Src/utils/calculation";
import { checkAscs, checkCons, findInput, modIsActivated } from "../utils";

export const isshinBonusMults = [
  0, 0.73, 0.78, 0.84, 0.91, 0.96, 1.02, 1.09, 1.16, 1.23, 1.31, 1.38, 1.45, 1.54,
];

const countResolve = (energyCost: number, level: number) => {
  return Math.round(energyCost * Math.min(Math.ceil(14.5 + level * 0.5), 20)) / 100;
};

const getEBTalentBuff = (bonusType: "musouBonus" | "isshinBonus"): GetTalentBuffFn => {
  return ({ char, selfBuffCtrls, partyData }) => {
    if (modIsActivated(selfBuffCtrls, 1)) {
      const buffValue = getBuffValue.EB(char, selfBuffCtrls, partyData);
      if (buffValue.stacks) {
        return {
          mult: {
            desc: `Bonus from ${buffValue.stacks} Resolve, each gave ${buffValue[bonusType]}% extra multiplier`,
            value: round2(buffValue.stacks * buffValue[bonusType]),
          },
        };
      }
    }
    return {};
  };
};

const getBuffValue = {
  ES: (
    toSelf: boolean,
    char: CharInfo,
    { EBcost }: CharData,
    inputs: ModifierInput[],
    partyData: PartyData
  ) => {
    const level = toSelf
      ? finalTalentLv({ char, talents: Raiden.activeTalents, talentType: "ES", partyData })
      : inputs[0] || 0;
    const mult = Math.min(0.21 + level / 100, 0.3);
    return [round1(EBcost * mult), `${level} / ${round2(mult)}% * ${EBcost} Energy Cost`] as const;
  },
  EB: (char: CharInfo, selfBuffCtrls: ModifierCtrl[], partyData: PartyData) => {
    const level = finalTalentLv({
      char,
      talents: Raiden.activeTalents,
      talentType: "EB",
      partyData,
    });
    const totalEnergySpent = findInput(selfBuffCtrls, 1, 0);
    const electroEnergySpent = findInput(selfBuffCtrls, 1, 1);
    let bonusEnergySpent = 0;

    if (checkCons[1](char) && electroEnergySpent < totalEnergySpent) {
      bonusEnergySpent += electroEnergySpent * 0.8 + (totalEnergySpent - electroEnergySpent) * 0.2;
    }

    let stacks = countResolve(totalEnergySpent + bonusEnergySpent, level);
    return {
      stacks: Math.min(round2(stacks), 60),
      extraStacks: round2(countResolve(bonusEnergySpent, level)),
      musouBonus: 3.89 * TALENT_LV_MULTIPLIERS[2][level],
      isshinBonus: isshinBonusMults[level],
    };
  },
  A4: (totalAttr: TotalAttribute) => {
    return round1((totalAttr.er - 100) * 0.4);
  },
  C1: (char: CharInfo, selfBuffCtrls: ModifierCtrl[], partyData: PartyData, EBlevel?: number) => {
    const electroEC = +findInput(selfBuffCtrls, 3, 0); // EC = energyCost
    const otherEC = +findInput(selfBuffCtrls, 1, 0) - electroEC;

    if (otherEC < 0) {
      return 0;
    }
    const level =
      EBlevel ||
      finalTalentLv({ char, talents: Raiden.activeTalents, talentType: "EB", partyData });
    const electroResolve = countResolve(electroEC, level);
    const otherResolve = countResolve(otherEC, level);
    return round1(electroResolve * 0.8 + otherResolve * 0.2);
  },
};

const Raiden: DataCharacter = {
  code: 40,
  name: "Raiden Shogun",
  GOOD: "RaidenShogun",
  icon: "5/52/Character_Raiden_Shogun_Thumb",
  sideIcon: "9/95/Character_Raiden_Shogun_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "polearm",
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
  bonusStat: { type: "er", value: 8 },
  NAsConfig: {
    name: "Origin",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 39.65 },
        { name: "2-Hit", multBase: 39.73 },
        { name: "3-Hit", multBase: 49.88 },
        { name: "4-Hit (1/2)", multBase: 28.98 },
        { name: "5-Hit", multBase: 65.45 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: 99.59 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Transcendence: Baleful Omen",
      image: "3/3c/Talent_Transcendence_Baleful_Omen",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", multBase: 117.2 },
        { name: "Coordinated ATK DMG", multBase: 42 },
      ],
      // getExtraStats: (lv) => [
      //   { name: "Duration", value: "25s" },
      //   { name: "Elemental Burst DMG Bonus", value: Math.min(21 + lv, 30) / 100 + "% per Energy" },
      //   { name: "CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Secret Art: Musou Shinsetsu",
      image: "e/e0/Talent_Secret_Art_Musou_Shinsetsu",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "Musou no Hitotachi",
          multBase: 400.8,
          getTalentBuff: getEBTalentBuff("musouBonus"),
        },
        {
          name: "1-Hit",
          multBase: 44.74,
          multType: 4,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "2-Hit",
          multBase: 43.96,
          multType: 4,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "3-Hit",
          multBase: 53.82,
          multType: 4,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "4-Hit (1/2)",
          multBase: 30.89,
          multType: 4,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "5-Hit",
          multBase: 73.94,
          multType: 4,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "Charged Attack",
          multBase: [61.6, 74.36],
          multType: 4,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "Plunge DMG",
          multBase: 63.93,
          multType: 1,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "Low Plunge",
          multBase: 127.84,
          multType: 1,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "High Plunge",
          multBase: 159.68,
          multType: 1,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
      ],
      // getExtraStats: (lv) => [
      //   {
      //     name: "Resolve Bonus",
      //     value:
      //       `${round2(3.89 * TALENT_LV_MULTIPLIERS[2][lv])}% Initial/` +
      //       `${isshinBonusMults[lv]}% ATK DMG per Stack`,
      //   },
      //   {
      //     name: "Resolve Stacks Gained",
      //     value: Math.min(Math.ceil(14.5 + lv * 0.5), 20) / 100 + " per Energy Consumed",
      //   },
      //   { name: "Charged Attack Stamina Cost", value: 20 },
      //   { name: "Musshou Isshin Energy Restoration", value: Math.min(15 + lv, 25) / 10 },
      //   { name: "Musshou Isshin Duration", value: "7s" },
      //   { name: "CD", value: "18s" },
      // ],
      energyCost: 90,
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
      desc: ({ totalAttr }) => (
        <>
          Each 1% above 100% <Green>Energy Recharge</Green> grants the Raiden Shogun{" "}
          <Green b>0.4%</Green> <Green>Electro DMG Bonus</Green>.{" "}
          <Red>Electro DMG Bonus: {getBuffValue.A4(totalAttr)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, desc, tracker }) => {
        const buffValue = getBuffValue.A4(totalAttr);
        applyModifier(desc, totalAttr, "electro", buffValue, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      desc: ({ toSelf, char, charData, inputs, partyData }) => (
        <>
          Eye of Stormy Judgment increases <Green>Elemental Burst DMG</Green> based on the{" "}
          <Green>Energy Cost</Green> of the Elemental Burst during the eye's duration.{" "}
          <Red>
            DMG Bonus: {getBuffValue.ES(toSelf, char, charData, inputs, partyData)[0]}
            %.
          </Red>
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "text",
          initialValue: 1,
          max: 13,
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const { toSelf, char, charData, inputs, partyData } = obj;
        const result = getBuffValue.ES(toSelf, char, charData, inputs, partyData);
        const desc = `${obj.desc} / Lv. ${result[1]}`;
        applyModifier(desc, obj.attPattBonus, "EB.pct", result[0], obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      desc: ({ char, charBuffCtrls, partyData }) => {
        const { stacks, extraStacks } = getBuffValue.EB(char, charBuffCtrls, partyData);
        return (
          <>
            Musou no Hitotachi and Musou Isshin's attacks <Green>[EB] DMG</Green> will be increased
            based on the number of Chakra Desiderata's Resolve stacks consumed.{" "}
            <Red>Total Resolve: {stacks}.</Red>
            <br />
            Normal, Charged, and Plunging Attacks will be <Green>infused</Green> with{" "}
            <Electro>Electro DMG</Electro>, which cannot be overridden.
            <br />• At <Lightgold>C1</Lightgold>, increases <Green>Resolve</Green> gained from
            Electro characters by <Green b>80%</Green>, from characters of other visions by{" "}
            <Green b>20%</Green>. <Red>Extra Resolve: {extraStacks}</Red>
          </>
        );
      },
      affect: EModAffect.SELF,
      inputConfigs: [
        { label: "Total Energy spent", type: "text", max: 999 },
        { label: "Energy spent by Electro characters (C1)", type: "text", max: 999 },
      ],
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 4,
      src: EModSrc.C4,
      desc: () => (
        <>
          When the Musou Isshin state expires, all nearby party members (excluding the Raiden
          Shogun) gain <Green b>30%</Green> <Green>ATK</Green> for 10s.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.TEAMMATE,
      applyBuff: makeModApplier("totalAttr", "atk_", 30),
    },
    {
      index: 5,
      src: EModSrc.C2,
      desc: () => (
        <>
          Under the Musou Isshin state, the Raiden Shogun's attacks ignore <Green b>60%</Green> of
          opponents' <Green>DEF</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: ({ attPattBonus, desc, tracker }) => {
        const fields = ATTACK_PATTERNS.map((t) => `${t}.defIgnore`) as AttackPatternPath[];
        applyModifier(desc, attPattBonus, fields, 60, tracker);
      },
    },
  ],
};

export default Raiden;

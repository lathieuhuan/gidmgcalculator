import type {
  CalcCharData,
  CharInfo,
  DataCharacter,
  GetTalentBuffFn,
  ModifierCtrl,
  ModifierInput,
  PartyData,
  TotalAttribute,
} from "@Src/types";
import { Electro, Green, Red } from "@Src/styled-components";
import { ATTACK_PATTERNS, EModAffect, NORMAL_ATTACKS } from "@Src/constants";
import { EModifierSrc, MEDIUM_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { finalTalentLv, round1, round2 } from "@Src/utils";
import { applyModifier, AttackPatternPath, getInput, makeModApplier } from "@Src/calculators/utils";
import { checkAscs, checkCons, findInput, modIsActivated } from "../utils";

export const isshinBonusMults = [
  0, 0.73, 0.78, 0.84, 0.91, 0.96, 1.02, 1.09, 1.16, 1.23, 1.31, 1.38, 1.45, 1.54,
];

const countResolve = (energyCost: number, level: number) => {
  return Math.round(energyCost * Math.min(Math.ceil(14.5 + level * 0.5), 20)) / 100;
};

const getEBTalentBuff = (index: number): GetTalentBuffFn => {
  return ({ char, selfBuffCtrls, partyData }) => {
    if (modIsActivated(selfBuffCtrls, 1)) {
      const value = getBuffValue.EB(char, selfBuffCtrls, partyData).map(round2);
      if (value[0]) {
        return {
          mult: {
            desc: `Bonus from ${value[0]} Resolve, each gave ${value[index]}% extra multiplier`,
            value: round2(value[0] * value[index]),
          },
        };
      }
    }
  };
};

const getBuffValue = {
  ES: (
    toSelf: boolean,
    char: CharInfo,
    { EBcost }: CalcCharData,
    inputs: ModifierInput[] | undefined,
    partyData: PartyData
  ) => {
    const level = toSelf ? finalTalentLv(char, "ES", partyData) : getInput(inputs, 0, 0);
    const mult = Math.min(0.21 + level / 100, 0.3);
    return [round1(EBcost * mult), `${level} / ${round2(mult)}% * ${EBcost} Energy Cost`] as const;
  },
  EB: (char: CharInfo, selfBuffCtrls: ModifierCtrl[], partyData: PartyData) => {
    const level = finalTalentLv(char, "EB", partyData);
    let stacks = countResolve(+findInput(selfBuffCtrls, 1, 0), level);

    if (checkCons[1](char) && modIsActivated(selfBuffCtrls, 3)) {
      stacks += getBuffValue.C1(char, selfBuffCtrls, partyData, level);
    }
    stacks = Math.min(round2(stacks), 60);
    return [stacks, 3.89 * TALENT_LV_MULTIPLIERS[2][level], isshinBonusMults[level]];
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
    const level = EBlevel || finalTalentLv(char, "EB", partyData);
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
  weapon: "polearm",
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
        { name: "1-Hit", baseMult: 39.65 },
        { name: "2-Hit", baseMult: 39.73 },
        { name: "3-Hit", baseMult: 49.88 },
        { name: "4-Hit (1/2)", baseMult: 28.98 },
        { name: "5-Hit", baseMult: 65.45 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: 99.59 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Transcendence: Baleful Omen",
      image: "3/3c/Talent_Transcendence_Baleful_Omen",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", baseMult: 117.2 },
        { name: "Coordinated ATK DMG", baseMult: 42 },
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
        { name: "Musou no Hitotachi", baseMult: 400.8, getTalentBuff: getEBTalentBuff(1) },
        { name: "1-Hit", baseMult: 44.74, multType: 4, getTalentBuff: getEBTalentBuff(2) },
        { name: "2-Hit", baseMult: 43.96, multType: 4, getTalentBuff: getEBTalentBuff(2) },
        { name: "3-Hit", baseMult: 53.82, multType: 4, getTalentBuff: getEBTalentBuff(2) },
        { name: "4-Hit (1/2)", baseMult: 30.89, multType: 4, getTalentBuff: getEBTalentBuff(2) },
        { name: "5-Hit", baseMult: 73.94, multType: 4, getTalentBuff: getEBTalentBuff(2) },
        {
          name: "Charged Attack",
          baseMult: [61.6, 74.36],
          multType: 4,
          getTalentBuff: getEBTalentBuff(2),
        },
        { name: "Plunge DMG", baseMult: 63.93, multType: 1, getTalentBuff: getEBTalentBuff(2) },
        { name: "Low Plunge", baseMult: 127.84, multType: 1, getTalentBuff: getEBTalentBuff(2) },
        { name: "High Plunge", baseMult: 159.68, multType: 1, getTalentBuff: getEBTalentBuff(2) },
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
  buffs: [
    {
      index: 0,
      src: EModifierSrc.ES,
      desc: ({ toSelf, char, charData, inputs, partyData }) => (
        <>
          Eye of Stormy Judgment increases <Green>Elemental Burst DMG</Green> based on the{" "}
          <Green>Energy Cost</Green> of the Elemental Burst during the Eye's duration.{" "}
          <Red>
            Elemental Burst DMG Bonus:{" "}
            {getBuffValue.ES(toSelf, char, charData, inputs, partyData)[0]}
            %.
          </Red>
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfig: {
        labels: ["Elemental Skill Level"],
        renderTypes: ["text"],
        initialValues: [1],
        maxValues: [13],
      },
      applyBuff: (obj) => {
        const { toSelf, char, charData, inputs, partyData } = obj;
        const result = getBuffValue.ES(toSelf, char, charData, inputs, partyData);
        const desc = `${obj.desc} / Lv. ${result[1]}`;
        applyModifier(desc, obj.attPattBonus, "EB.pct", result[0], obj.tracker);
      },
    },
    {
      index: 1,
      src: EModifierSrc.EB,
      desc: ({ char, charBuffCtrls, partyData }) => {
        return (
          <>
            The DMG dealt by Musou no Hitotachi and Musou Isshin's attacks will be increased based
            on the number of Chakra Desiderata's Resolve stacks consumed when this skill is used.{" "}
            <Red>Total Resolve: {getBuffValue.EB(char, charBuffCtrls, partyData)[0]}.</Red>
            <br />
            Normal, Charged, and Plunging Attacks will be <Green>infused</Green> with{" "}
            <Electro>Electro DMG</Electro>, which cannot be overridden.
          </>
        );
      },
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Total Energy Spent"],
        renderTypes: ["text"],
        initialValues: [0],
        maxValues: [999],
      },
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModifierSrc.A4,
      desc: ({ totalAttr }) => (
        <>
          Each <Green b>1%</Green> above 100% <Green>Energy Recharge</Green> that the Raiden Shogun
          possesses grants her:
          <br />• <Green b>0.4%</Green> <Green>Electro DMG Bonus</Green>.{" "}
          <Red>Electro DMG Bonus: {getBuffValue.A4(totalAttr)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      applyBuff: ({ totalAttr, desc, tracker }) => {
        const buffValue = getBuffValue.A4(totalAttr);
        applyModifier(desc, totalAttr, "electro", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModifierSrc.C1,
      desc: ({ char, charBuffCtrls, partyData }) => (
        <>
          When <Electro>Electro</Electro> characters use their Elemental Bursts, the{" "}
          <Green>Resolve</Green> gained is increased by <Green b>80%</Green>. When characters of
          other Elemental Types use their Elemental Bursts, the <Green>Resolve</Green> gained is
          increased by <Green b>20%</Green>.{" "}
          <Red>Extra Resolve: {getBuffValue.C1(char, charBuffCtrls, partyData)}.</Red>
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Energy Spent by Electro Characters (part of total)"],
        renderTypes: ["text"],
        initialValues: [0],
        maxValues: [999],
      },
    },
    {
      index: 4,
      src: EModifierSrc.C4,
      desc: () => (
        <>
          When the Musou Isshin state expires, all nearby party members (excluding the Raiden
          Shogun) gain <Green b>30%</Green> <Green>bonus ATK</Green> for 10s.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.TEAMMATE,
      applyBuff: makeModApplier("totalAttr", "atk_", 30),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModifierSrc.C2,
      desc: () => (
        <>
          While using Musou no Hitotachi and in the Musou Isshin state applied by Secret Art: Musou
          Shinsetsu, the Raiden Shogun's attacks ignore <Green b>60%</Green> of opponents'{" "}
          <Green>DEF</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyDebuff: ({ attPattBonus, desc, tracker }) => {
        const fields = ATTACK_PATTERNS.map((t) => `${t}.defIgnore`) as AttackPatternPath[];
        applyModifier(desc, attPattBonus, fields, 60, tracker);
      },
    },
  ],
};

export default Raiden;

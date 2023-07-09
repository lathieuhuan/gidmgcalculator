import type {
  CharInfo,
  DataCharacter,
  BuffDescriptionArgs,
  GetTalentBuffFn,
  ModifierCtrl,
  PartyData,
  TotalAttribute,
} from "@Src/types";
import { Electro, Green, Lightgold, Red } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { round } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier, type AttackPatternPath } from "@Src/utils/calculation";
import { checkAscs, checkCons, findInput, modIsActivated } from "../utils";

const isshinBonusMults = [0, 0.73, 0.78, 0.84, 0.91, 0.96, 1.02, 1.09, 1.16, 1.23, 1.31, 1.38, 1.45, 1.54];

const getBuffValue = {
  ES: (args: BuffDescriptionArgs) => {
    const level = args.toSelf
      ? finalTalentLv({ char: args.char, dataChar: Raiden, talentType: "ES", partyData: args.partyData })
      : args.inputs[0] || 0;
    const mult = Math.min(0.21 + level / 100, 0.3);

    return {
      desc: `${level} / ${round(mult, 2)}% * ${args.charData.EBcost} Energy Cost`,
      value: round(args.charData.EBcost * mult, 1),
    };
  },
  EB: (char: CharInfo, selfBuffCtrls: ModifierCtrl[], partyData: PartyData) => {
    const level = finalTalentLv({
      char,
      dataChar: Raiden,
      talentType: "EB",
      partyData,
    });
    const totalEnergy = findInput(selfBuffCtrls, 1, 0);
    const electroEnergy = findInput(selfBuffCtrls, 1, 1);
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

const getEBTalentBuff = (bonusType: "musouBonus" | "isshinBonus"): GetTalentBuffFn => {
  return ({ char, selfBuffCtrls, partyData }) => {
    if (modIsActivated(selfBuffCtrls, 1)) {
      const buffValue = getBuffValue.EB(char, selfBuffCtrls, partyData);
      if (buffValue.stacks) {
        return {
          mult_: {
            desc: `${buffValue.stacks} Resolve, ${buffValue[bonusType]}% extra multiplier each`,
            value: round(buffValue.stacks * buffValue[bonusType], 2),
          },
        };
      }
    }
    return {};
  };
};

const Raiden: DataCharacter = {
  code: 40,
  name: "Raiden Shogun",
  GOOD: "RaidenShogun",
  icon: "2/24/Raiden_Shogun_Icon",
  sideIcon: "c/c7/Raiden_Shogun_Side_Icon",
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
  bonusStat: { type: "er_", value: 8 },
  NAsConfig: {
    name: "Origin",
  },
  bonusLvFromCons: ["EB", "ES"],
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 39.65 },
        { name: "2-Hit", multFactors: 39.73 },
        { name: "3-Hit", multFactors: 49.88 },
        { name: "4-Hit (1/2)", multFactors: 28.98 },
        { name: "5-Hit", multFactors: 65.45 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 99.59 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Transcendence: Baleful Omen",
      image: "3/3c/Talent_Transcendence_Baleful_Omen",
      stats: [
        { name: "Skill DMG", multFactors: 117.2 },
        { name: "Coordinated ATK DMG", multFactors: 42 },
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
      stats: [
        {
          name: "Musou no Hitotachi",
          multFactors: { root: 400.8, scale: 2 },
          getTalentBuff: getEBTalentBuff("musouBonus"),
        },
        {
          name: "1-Hit",
          multFactors: 44.74,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "2-Hit",
          multFactors: 43.96,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "3-Hit",
          multFactors: 53.82,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "4-Hit",
          multFactors: [30.89, 30.98],
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "5-Hit",
          multFactors: 73.94,
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "Charged Attack",
          multFactors: [61.6, 74.36],
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "Plunge DMG",
          multFactors: { root: 63.93, scale: 1 },
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "Low Plunge",
          multFactors: { root: 127.84, scale: 1 },
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
        {
          name: "High Plunge",
          multFactors: { root: 159.68, scale: 1 },
          getTalentBuff: getEBTalentBuff("isshinBonus"),
        },
      ],
      multScale: 4,
      // getExtraStats: (lv) => [
      //   {
      //     name: "Resolve Bonus",
      //     value:
      //       `${round(3.89 * TALENT_LV_MULTIPLIERS[2][lv], 2)}% Initial/` +
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
          Each 1% above 100% <Green>Energy Recharge</Green> grants the Raiden Shogun <Green b>0.4%</Green>{" "}
          <Green>Electro DMG Bonus</Green>. <Red>Electro DMG Bonus: {getBuffValue.A4(totalAttr)}%.</Red>
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
      affect: EModAffect.PARTY,
      desc: (obj) => (
        <>
          Eye of Stormy Judgment increases <Green>Elemental Burst DMG</Green> based on the <Green>Energy Cost</Green> of
          the Elemental Burst during the eye's duration. <Red>DMG bonus: {getBuffValue.ES(obj).value}%.</Red>
        </>
      ),
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
      desc: ({ char, charBuffCtrls, partyData }) => {
        const { stackPerEnergy, stacks, extraStacks } = getBuffValue.EB(char, charBuffCtrls, partyData);
        return (
          <>
            Musou no Hitotachi and Musou Isshin's attacks <Green>[EB] DMG</Green> will be increased based on the number
            of Chakra Desiderata's Resolve stacks consumed.{" "}
            <Red>
              Resolve per Energy spent: {stackPerEnergy / 100}. Total Resolve: {stacks}
            </Red>
            <br />
            Grants an <Electro>Electro Infusion</Electro> which cannot be overridden.
            <br />• At <Lightgold>C1</Lightgold>, increases <Green>Resolve</Green> gained from Electro characters by{" "}
            <Green b>80%</Green>, from characters of other visions by <Green b>20%</Green>.{" "}
            <Red>Extra Resolve: {extraStacks}</Red>
            <br />• At <Lightgold>C2</Lightgold>, the Raiden Shogun's attacks ignore <Green b>60%</Green> of opponents'{" "}
            <Green>DEF</Green>.
          </>
        );
      },
      inputConfigs: [
        { label: "Total Energy spent", type: "text", max: 999 },
        { label: "Energy spent by Electro characters (C1)", type: "text", max: 999 },
      ],
      applyBuff: ({ char, attPattBonus, desc, tracker }) => {
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
      desc: () => (
        <>
          When the Musou Isshin state expires, all nearby party members (excluding the Raiden Shogun) gain{" "}
          <Green b>30%</Green> <Green>ATK</Green> for 10s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 30),
    },
  ],
};

export default Raiden;

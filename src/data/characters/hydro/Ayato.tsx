import type {
  CharInfo,
  DataCharacter,
  GetTalentBuffFn,
  ModifierCtrl,
  ModifierInput,
  PartyData,
} from "@Src/types";
import { Green, Hydro } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { NORMAL_ATTACKS } from "@Src/constants";
import { MEDIUM_PAs, EModSrc, TALENT_LV_MULTIPLIERS } from "../constants";
import { applyPercent, finalTalentLv } from "@Src/utils";
import { applyModifier, getInput, makeModApplier } from "@Src/calculators/utils";
import { charModIsInUse, checkCons, findInput, modIsActivated, talentBuff } from "../utils";

const C1TalentBuff = (char: CharInfo, charBuffCtrls: ModifierCtrl[]) =>
  [charModIsInUse(Ayato.buffs!, char, charBuffCtrls, 3), "pct", [false, 1], 40] as const;

const getESTalentBuff: GetTalentBuffFn = ({ char, partyData, selfBuffCtrls, totalAttr }) => {
  if (modIsActivated(selfBuffCtrls, 0)) {
    const level = finalTalentLv(char, "ES", partyData);
    const finalMult = 0.56 * +findInput(selfBuffCtrls, 0, 0) * TALENT_LV_MULTIPLIERS[7][level];
    const flat = applyPercent(totalAttr.hp, finalMult);

    return talentBuff(
      [true, "flat", "Elemental Skill", flat],
      [...C1TalentBuff(char, selfBuffCtrls)]
    );
  }
};

const getEBBuffValue = (
  toSelf: boolean,
  char: CharInfo,
  partyData: PartyData,
  inputs: ModifierInput[] | undefined
) => {
  const level = toSelf ? finalTalentLv(char, "EB", partyData) : getInput(inputs, 0, 0);
  return level ? Math.min(level + 10, 20) : 0;
};

const Ayato: DataCharacter = {
  code: 50,
  name: "Ayato",
  GOOD: "KamisatoAyato",
  icon: "a/a2/Character_Kamisato_Ayato_Thumb",
  sideIcon: "a/ab/Character_Kamisato_Ayato_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weapon: "sword",
  stats: [
    [1068, 23, 60],
    [2770, 60, 155],
    [3685, 80, 206],
    [5514, 120, 309],
    [6165, 134, 345],
    [7092, 155, 397],
    [7960, 174, 446],
    [8897, 194, 499],
    [9548, 208, 535],
    [10494, 229, 588],
    [11144, 243, 624],
    [12101, 264, 678],
    [12751, 278, 715],
    [13715, 299, 769],
  ],
  bonusStat: { type: "cDmg", value: 9.6 },
  NAsConfig: {
    name: "Kamisato Art - Marobashi",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 44.96, multType: 7 },
        { name: "2-Hit", baseMult: 47.16, multType: 7 },
        { name: "3-Hit", baseMult: 58.61, multType: 7 },
        { name: "4-Hit (1/2)", baseMult: 29.45, multType: 7 },
        { name: "5-Hit", baseMult: 75.6, multType: 7 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: 129.53, multType: 7 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Kamisato Art: Kyouka",
      image: "5/5d/Talent_Kamisato_Art_Kyouka",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "Shunsuiken 1-Hit DMG",
          baseMult: 52.89,
          multType: 7,
          getTalentBuff: getESTalentBuff,
        },
        {
          name: "Shunsuiken 2-Hit DMG",
          baseMult: 58.91,
          multType: 7,
          getTalentBuff: getESTalentBuff,
        },
        {
          name: "Shunsuiken 3-Hit DMG",
          baseMult: 64.93,
          multType: 7,
          getTalentBuff: getESTalentBuff,
        },
        {
          name: "Extra Shunsuiken strike (1/2) (C6)",
          baseMult: 0,
          multType: 7,
          conditional: true,
          getTalentBuff: ({ char, selfBuffCtrls }) =>
            talentBuff(
              [...C1TalentBuff(char, selfBuffCtrls)],
              [checkCons[6](char), "mult", [false, 6], 450]
            ),
        },
        {
          name: "Namisen DMG Bonus",
          baseStatType: "hp",
          baseMult: 0,
          multType: 7,
          conditional: true,
          getTalentBuff: ({ char, selfBuffCtrls, partyData }) => {
            const level = finalTalentLv(char, "ES", partyData);
            const stacks = findInput(selfBuffCtrls, 0, 0);
            return {
              mult: {
                desc: `Namisen effect with ${stacks} stacks`,
                value: 0.56 * +stacks * TALENT_LV_MULTIPLIERS[7][level],
              },
            };
          },
        },
        { name: "Water Illusion DMG", baseMult: 101.48, multType: 7 },
      ],
      // getExtraStats: (lv) => [
      //   {
      //     name: "Takimeguri Kanka Duration",
      //     value: "6s",
      //   },
      //   {
      //     name: "Namisen DMG Bonus",
      //     noCalc: true,
      //     value: Math.round(56 * TALENT_LV_MULTIPLIERS[7][lv]) / 100 + "% Max HP/stack",
      //   },
      // ],
    },
    EB: {
      name: "Kamisato Art: Suiyuu",
      image: "e/e8/Talent_Kamisato_Art_Suiyuu",
      xtraLvAtCons: 5,
      stats: [{ name: "Bloomwater Blade DMG", baseMult: 66.46, multType: 2 }],
      // getExtraStats: (lv) => [
      //   { name: "Normal Attack DMG Bonus", value: Math.min(lv + 10, 20) + "%" },
      //   { name: "Duration", value: "18s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "Kamisato Art: Mine Wo Matoishi Kiyotaki",
      image: "7/77/Talent_Kamisato_Art_Mine_Wo_Matoishi_Kiyotaki",
    },
    {
      name: "Kamisato Art: Michiyuku Hagetsu",
      image: "b/ba/Talent_Kamisato_Art_Michiyuku_Hagetsu",
    },
    { name: "Kamisato Art: Daily Cooking", image: "4/43/Talent_Kamisato_Art_Daily_Cooking" },
  ],
  constellation: [
    { name: "Kyouka Fushi", image: "a/ac/Constellation_Kyouka_Fuushi" },
    { name: "World Source", image: "e/ed/Constellation_World_Source" },
    { name: "To Admire the Flower", image: "0/06/Constellation_To_Admire_the_Flowers" },
    { name: "Endles Flow", image: "d/de/Constellation_Endless_Flow" },
    { name: "Bansui Ichiro", image: "f/f1/Constellation_Bansui_Ichiro" },
    { name: "Boundless Origin", image: "d/da/Constellation_Boundless_Origin" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      desc: () => (
        <>
          • Causes <Green>DMG</Green> from his <Green>Normal Attacks</Green> to be{" "}
          <Green>converted</Green> into AoE <Hydro>Hydro DMG</Hydro>. This cannot be overridden.
          <br />• Namisen increases the <Green>DMG</Green> dealt by <Green>Shunsuiken</Green> based
          on Ayato's <Green>current Max HP</Green>.
        </>
      ),
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [5],
      },
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      desc: ({ toSelf, char, partyData, inputs }) => (
        <>
          Increases the <Green>Normal Attack DMG</Green> of characters within its AoE by{" "}
          <Green b>{getEBBuffValue(toSelf, char, partyData, inputs)}%</Green>.
        </>
      ),
      affect: EModAffect.ACTIVE_UNIT,
      inputConfig: {
        labels: ["Elemental Burst Level"],
        renderTypes: ["text"],
        initialValues: [1],
        maxValues: [15],
      },
      applyBuff: ({ toSelf, char, partyData, inputs, attPattBonus, desc, tracker }) => {
        const bonusValue = getEBBuffValue(toSelf, char, partyData, inputs);
        applyModifier(desc, attPattBonus, "NA.pct", bonusValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      desc: () => (
        <>
          <Green>Shunsuiken DMG</Green> is increased by <Green b>40%</Green> against opponents with
          50% HP or less.
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
    },
    {
      index: 4,
      src: EModSrc.C2,
      desc: () => (
        <>
          When Kamisato Ayato has at least 3 Namisen stacks, his <Green>Max HP</Green> is increased
          by <Green b>50%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "hp_", 50),
    },
    {
      index: 5,
      src: EModSrc.C4,
      desc: () => (
        <>
          After using Kamisato Art: Suiyuu, all nearby party members will have <Green b>15%</Green>{" "}
          increased <Green>Normal Attack SPD</Green> for 12s.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "naAtkSpd", 15),
    },
  ],
  outdatedMods: [
    {
      index: 2,
      outdated: true,
      src: EModSrc.A4,
      desc: () => (
        <>
          <Green>Kamisato Art: Suiyuu's DMG</Green> is increased based on <Green b>3%</Green> of
          Ayato's <Green>Max HP</Green>.
        </>
      ),
    },
  ],
};

export default Ayato;

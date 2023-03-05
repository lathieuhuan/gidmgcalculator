import type {
  CharInfo,
  DataCharacter,
  GetTalentBuffFn,
  ModifierCtrl,
  ModifierInput,
  PartyData,
} from "@Src/types";
import { Green, Hydro, Lightgold } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { MEDIUM_PAs, EModSrc } from "../constants";
import { applyPercent } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import {
  charModIsInUse,
  checkCons,
  findInput,
  modIsActivated,
  talentBuff,
  TalentBuffConfig,
} from "../utils";

const C1TalentBuff = (char: CharInfo, charBuffCtrls: ModifierCtrl[]): TalentBuffConfig => {
  return [charModIsInUse(Ayato.buffs!, char, charBuffCtrls, 3), "pct", [false, 1], 40];
};

const getESTalentBuff: GetTalentBuffFn = ({ char, partyData, selfBuffCtrls, totalAttr }) => {
  if (modIsActivated(selfBuffCtrls, 0)) {
    const level = finalTalentLv({
      char,
      dataChar: Ayato,
      talentType: "ES",
      partyData,
    });
    const finalMult = 0.56 * +findInput(selfBuffCtrls, 0, 0) * TALENT_LV_MULTIPLIERS[7][level];
    const flat = applyPercent(totalAttr.hp, finalMult);

    return talentBuff([true, "flat", "Elemental Skill", flat], C1TalentBuff(char, selfBuffCtrls));
  }
  return {};
};

const getEBBuffValue = (
  toSelf: boolean,
  char: CharInfo,
  partyData: PartyData,
  inputs: ModifierInput[]
) => {
  const level = toSelf
    ? finalTalentLv({ char, dataChar: Ayato, talentType: "EB", partyData })
    : inputs[0] || 1;
  return level ? Math.min(level + 10, 20) : 0;
};

const Ayato: DataCharacter = {
  code: 50,
  name: "Ayato",
  GOOD: "KamisatoAyato",
  // icon: "a/a2/Character_Kamisato_Ayato_Thumb",
  icon: "2/27/Kamisato_Ayato_Icon",
  sideIcon: "a/ab/Character_Kamisato_Ayato_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "sword",
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
  bonusStat: { type: "cDmg_", value: 9.6 },
  NAsConfig: {
    name: "Kamisato Art - Marobashi",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 44.96 },
        { name: "2-Hit", multFactors: 47.16 },
        { name: "3-Hit", multFactors: 58.61 },
        { name: "4-Hit (1/2)", multFactors: 29.45 },
        { name: "5-Hit", multFactors: 75.6 },
      ],
      multScale: 7,
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: { root: 129.53, scale: 7 } }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Kamisato Art: Kyouka",
      image: "5/5d/Talent_Kamisato_Art_Kyouka",
      stats: [
        {
          name: "Shunsuiken 1-Hit DMG",
          attPatt: "NA",
          multFactors: 52.89,
          getTalentBuff: getESTalentBuff,
        },
        {
          name: "Shunsuiken 2-Hit DMG",
          attPatt: "NA",
          multFactors: 58.91,
          getTalentBuff: getESTalentBuff,
        },
        {
          name: "Shunsuiken 3-Hit DMG",
          attPatt: "NA",
          multFactors: 64.93,
          getTalentBuff: getESTalentBuff,
        },
        {
          name: "Extra Shunsuiken strike (1/2) (C6)",
          attPatt: "NA",
          multFactors: { root: 450, scale: 0 },
          getTalentBuff: ({ char, selfBuffCtrls }) => talentBuff(C1TalentBuff(char, selfBuffCtrls)),
        },
        {
          name: "Namisen DMG Bonus",
          notAttack: "other",
          isNotOfficial: true,
          multFactors: { root: 0, attributeType: "hp" },
          getTalentBuff: ({ char, selfBuffCtrls, partyData }) => {
            const level = finalTalentLv({
              char,
              dataChar: Ayato,
              talentType: "ES",
              partyData,
            });
            const stacks = findInput(selfBuffCtrls, 0, 0);
            return {
              mult: {
                desc: `Namisen effect with ${stacks} stacks`,
                value: 0.56 * +stacks * TALENT_LV_MULTIPLIERS[7][level],
              },
            };
          },
        },
        { name: "Water Illusion DMG", multFactors: 101.48 },
      ],
      multScale: 7,
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
      stats: [{ name: "Bloomwater Blade DMG", multFactors: 66.46 }],
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
      affect: EModAffect.SELF,
      desc: () => (
        <>
          • Converts his Normal Attack DMG into AoE <Hydro>Hydro DMG</Hydro> (Shunsuiken) that
          cannot be overridden.
          <br />• On hit, Shunsuikens grant Ayato Namisen stacks which increase{" "}
          <Green>Shunsuiken DMG</Green> based on his <Green>current Max HP</Green>.
          <br />• At <Lightgold>C2</Lightgold>, Ayato's <Green>Max HP</Green> is increased by{" "}
          <Green b>50%</Green> when he has at least 3 Namisen stacks.
        </>
      ),
      inputConfigs: [
        {
          label: "Namisen stacks",
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ char, totalAttr, inputs, desc, tracker }) => {
        if (checkCons[2](char) && (inputs[0] || 0) >= 3) {
          applyModifier(desc, totalAttr, "hp_", 50, tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.ACTIVE_UNIT,
      desc: ({ toSelf, char, partyData, inputs }) => (
        <>
          Increases the <Green>Normal Attack DMG</Green> of characters within its AoE by{" "}
          <Green b>{getEBBuffValue(toSelf, char, partyData, inputs)}%</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Burst Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: ({ toSelf, char, partyData, inputs, attPattBonus, desc, tracker }) => {
        const buffValue = getEBBuffValue(toSelf, char, partyData, inputs);
        applyModifier(desc, attPattBonus, "NA.pct", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          <Green>Shunsuiken DMG</Green> is increased by <Green b>40%</Green> against opponents with
          50% HP or less.
        </>
      ),
      isGranted: checkCons[1],
    },
    {
      index: 5,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          After using Kamisato Art: Suiyuu [EB], all nearby party members will have{" "}
          <Green b>15%</Green> increased <Green>Normal Attack SPD</Green> for 15s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
  ],
};

export default Ayato;

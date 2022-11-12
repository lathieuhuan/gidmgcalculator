import type { CharData, CharInfo, DataCharacter, ModifierCtrl, PartyData } from "@Src/types";
import { Green, Lightgold } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { applyPercent, finalTalentLv, round2 } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, modIsActivated, countVisionTypes, talentBuff, checkCons } from "../utils";

const getA4BuffValue = (
  toSelf: boolean,
  char: CharInfo,
  buffCtrls: ModifierCtrl[],
  charData: CharData,
  partyData: PartyData
) => {
  let result = 0;

  if (toSelf ? checkAscs[4](char) : modIsActivated(buffCtrls, 1)) {
    const numOfElmts = countVisionTypes(charData, partyData);
    result += numOfElmts * 2.5;

    if (numOfElmts === 4) {
      result += 1.5;
    }
  }
  return result;
};

const YunJin: DataCharacter = {
  code: 48,
  name: "Yun Jin",
  icon: "c/cb/Character_Yun_Jin_Thumb",
  sideIcon: "9/9a/Character_Yun_Jin_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weapon: "polearm",
  stats: [
    [894, 16, 62],
    [2296, 41, 158],
    [2963, 53, 204],
    [4438, 80, 306],
    [4913, 88, 339],
    [5651, 101, 389],
    [6283, 113, 433],
    [7021, 126, 484],
    [7495, 134, 517],
    [8233, 148, 567],
    [8707, 156, 600],
    [9445, 169, 651],
    [9919, 178, 684],
    [10657, 191, 734],
  ],
  bonusStat: { type: "er", value: 6.7 },
  NAsConfig: {
    name: "Cloud-Grazing Strike",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 40.51 },
        { name: "2-Hit", multBase: 40.25 },
        { name: "3-Hit", multBase: [22.96, 27.52] },
        { name: "4-Hit", multBase: [23.99, 28.81] },
        { name: "5-Hit", multBase: 67.34 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: 121.69 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Whirling Opener",
      image: "9/92/Talent_Opening_Flourish",
      xtraLvAtCons: 5,
      stats: [
        { name: "Press DMG", baseStatType: "def", multBase: 149.12 },
        { name: "Charge Level 1 DMG", baseStatType: "def", multBase: 260.96 },
        { name: "Charge Level 2 DMG", baseStatType: "def", multBase: 372.8 },
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          baseStatType: "hp",
          multBase: 12,
          multType: 2,
          flat: { base: 1155, type: 3 },
        },
      ],
      // getExtraStats: () => [{ name: "CD", value: "9s" }],
    },
    EB: {
      name: "Cliffbreaker's Banner",
      image: "5/59/Talent_Cliffbreaker%27s_Banner",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", multBase: 244 },
        {
          name: "DMG Increase",
          notAttack: "other",
          baseStatType: "def",
          multBase: 32.16,
          getTalentBuff: ({ char, selfBuffCtrls, charData, partyData }) => {
            const buffValue = getA4BuffValue(true, char, selfBuffCtrls, charData, partyData);

            return talentBuff([true, "mult", [true, 4], buffValue]);
          },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "12s" },
      //   { name: "Trigger Quota", value: "30" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "True to Oneself", image: "3/34/Talent_True_to_Oneself" },
    { name: "No Mere Traditionalist", image: "f/fa/Talent_Breaking_Conventions" },
    { name: "Light Nourishment", image: "3/39/Talent_Light_Nourishment" },
  ],
  constellation: [
    { name: "Stylized Equestrianism", image: "c/cd/Constellation_Thespian_Gallop" },
    { name: "Myriad Mise-en-Scène", image: "e/e5/Constellation_Myriad_Mise-En-Sc%C3%A8ne" },
    { name: "Seafaring General", image: "4/4c/Constellation_Seafaring_General" },
    { name: "Ascend, Cloud-Hanger", image: "a/a4/Constellation_Flower_and_a_Fighter" },
    { name: "Famed Throughout the Land", image: "f/f4/Constellation_Famed_Throughout_the_Land" },
    { name: "Decorous Harmony", image: "1/10/Constellation_Decorous_Harmony" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: ({ charData, partyData }) => {
        const n = countVisionTypes(charData, partyData);
        return (
          <>
            The <Green>Normal Attack DMG Bonus</Green> granted by Flying Cloud Flag Formation [EB]
            is further increased by <Green className={n === 1 ? "" : "opacity-50"}>2.5%</Green>/
            <Green className={n === 2 ? "" : "opacity-50"}>5%</Green>/
            <Green className={n === 3 ? "" : "opacity-50"}>7.5%</Green>/
            <Green className={n === 4 ? "" : "opacity-50"}>11.5%</Green> of Yun Jin's{" "}
            <Green>DEF</Green> when the party contains characters of 1/2/3/4 Elemental Types,
            respectively.
          </>
        );
      },
      isGranted: checkAscs[4],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      desc: () => (
        <>
          Increases <Green>Normal Attack DMG</Green> based on Yun Jin's <Green>current DEF</Green>.
          <br />• At <Lightgold>A4</Lightgold>, increases <Green>Normal Attack DMG</Green> by{" "}
          <Green b>15%</Green>.<br />• At <Lightgold>C6</Lightgold>, increases{" "}
          <Green>Normal ATK SPD</Green> by <Green b>12%</Green>.
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Current DEF", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "text", initialValue: 1, max: 13, for: "teammate" },
        { label: "Ascension 4 Passive", type: "check", for: "teammate" },
        { label: "Constrellation 6", type: "check", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { toSelf, inputs = [], char, partyData } = obj;
        const DEF = toSelf ? obj.totalAttr.def : inputs[0] || 0;
        const level = toSelf ? finalTalentLv(char, "EB", partyData) : inputs[1] || 1;
        let desc = `${obj.desc} / Lv. ${level}`;
        let tlMult = 32.16 * TALENT_LV_MULTIPLIERS[2][level];
        const xtraMult = getA4BuffValue(toSelf, char, obj.charBuffCtrls, obj.charData, partyData);

        if (xtraMult) {
          desc += ` / A4: ${xtraMult}% extra`;
          tlMult += xtraMult;
        }
        const buffValue = applyPercent(DEF, tlMult);
        desc += ` / ${round2(tlMult)}% of ${DEF} DEF`;
        applyModifier(desc, obj.attPattBonus, "NA.flat", buffValue, obj.tracker);

        if (toSelf ? checkCons[2](char) : inputs[2]) {
          applyModifier(obj.desc, obj.attPattBonus, "NA.pct", 15, obj.tracker);
        }
        if (toSelf ? checkCons[6](char) : inputs[3]) {
          applyModifier(obj.desc, obj.totalAttr, "naAtkSpd", 12, obj.tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      desc: () => (
        <>
          When Yun Jin trigger the Crystallize Reaction, her <Green>DEF</Green> is increased by{" "}
          <Green b>20%</Green> for 12s.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "def_", 20),
    },
  ],
};

export default YunJin;

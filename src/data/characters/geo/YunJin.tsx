import type { CharData, DataCharacter, PartyData } from "@Src/types";
import { Green, Lightgold, Red } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyPercent, round, countVision } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, talentBuff, checkCons } from "../utils";

const getA4BuffValue = (charData: CharData, partyData: PartyData) => {
  const visionCount = countVision(partyData, charData);
  const numOfElmts = Object.keys(visionCount).length;
  return numOfElmts * 2.5 + (numOfElmts === 4 ? 1.5 : 0);
};

const getNaBonus = ({ toSelf, inputs, char, charData, partyData, totalAttr }: any) => {
  const DEF = toSelf ? totalAttr.def : inputs[0] || 0;
  const level = toSelf
    ? finalTalentLv({ char, dataChar: YunJin, talentType: "EB", partyData })
    : inputs[1] || 1;
  let desc = ` / Lv. ${level}`;
  let tlMult = 32.16 * TALENT_LV_MULTIPLIERS[2][level];

  if (toSelf ? checkAscs[4](char) : inputs[2]) {
    const xtraMult = getA4BuffValue(charData, partyData);

    desc += ` / A4: ${xtraMult}% extra`;
    tlMult += xtraMult;
  }

  return {
    value: applyPercent(DEF, tlMult),
    xtraDesc: desc + ` / ${round(tlMult, 2)}% of ${DEF} DEF`,
  };
};

const YunJin: DataCharacter = {
  code: 48,
  name: "Yun Jin",
  GOOD: "YunJin",
  // icon: "c/cb/Character_Yun_Jin_Thumb",
  icon: "9/9c/Yun_Jin_Icon",
  sideIcon: "9/9a/Character_Yun_Jin_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
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
  bonusStat: { type: "er_", value: 6.7 },
  NAsConfig: {
    name: "Cloud-Grazing Strike",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 40.51 },
        { name: "2-Hit", multFactors: 40.25 },
        { name: "3-Hit", multFactors: [22.96, 27.52] },
        { name: "4-Hit", multFactors: [23.99, 28.81] },
        { name: "5-Hit", multFactors: 67.34 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 121.69 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Whirling Opener",
      image: "9/92/Talent_Opening_Flourish",
      stats: [
        { name: "Press DMG", multFactors: 149.12 },
        { name: "Charge Level 1 DMG", multFactors: 260.96 },
        { name: "Charge Level 2 DMG", multFactors: 372.8 },
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 12, attributeType: "hp" },
          flatFactor: 1155,
        },
      ],
      multAttributeType: "def",
      // getExtraStats: () => [{ name: "CD", value: "9s" }],
    },
    EB: {
      name: "Cliffbreaker's Banner",
      image: "5/59/Talent_Cliffbreaker%27s_Banner",
      stats: [
        { name: "Skill DMG", multFactors: 244 },
        {
          name: "DMG Increase",
          notAttack: "other",
          multFactors: { root: 32.16, attributeType: "def" },
          getTalentBuff: ({ charData, partyData }) => {
            return talentBuff([true, "mult", [true, 4], getA4BuffValue(charData, partyData)]);
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
        const visionCount = countVision(partyData, charData);
        const n = Object.keys(visionCount).length;
        return (
          <>
            The <Green>Normal Attack DMG Bonus</Green> granted by Flying Cloud Flag Formation [~EB]
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
      desc: (obj) => (
        <>
          Increases <Green>Normal Attack DMG</Green> based on Yun Jin's <Green>current DEF</Green>.{" "}
          {!obj.toSelf && <Red>Total bonus: {getNaBonus(obj).value}.</Red>}
          <br />• At <Lightgold>A4</Lightgold>, further increases the bonus based on how many
          element types in the party.
          <br />• At <Lightgold>C2</Lightgold>, increases <Green>Normal Attack DMG</Green> by{" "}
          <Green b>15%</Green>.
          <br />• At <Lightgold>C6</Lightgold>, increases <Green>Normal ATK SPD</Green> by{" "}
          <Green b>12%</Green>.
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Current DEF", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "text", initialValue: 1, max: 13, for: "teammate" },
        { label: EModSrc.A4, type: "check", for: "teammate" },
        { label: EModSrc.C2, type: "check", for: "teammate" },
        { label: EModSrc.C6, type: "check", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { toSelf, inputs, char, desc, tracker } = obj;
        const { value, xtraDesc } = getNaBonus(obj);

        applyModifier(desc + xtraDesc, obj.attPattBonus, "NA.flat", value, tracker);

        if (toSelf ? checkCons[2](char) : inputs[3]) {
          applyModifier(desc + ` + ${EModSrc.C2}`, obj.attPattBonus, "NA.pct", 15, tracker);
        }
        if (toSelf ? checkCons[6](char) : inputs[4]) {
          applyModifier(desc + ` + ${EModSrc.C6}`, obj.totalAttr, "naAtkSpd_", 12, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Yun Jin trigger the Crystallize Reaction, her <Green>DEF</Green> is increased by{" "}
          <Green b>20%</Green> for 12s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "def_", 20),
    },
  ],
};

export default YunJin;

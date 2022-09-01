import type { DataCharacter, ModifierInput } from "@Src/types";
import { Electro, Green, Red } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModifierSrc, LIGHT_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { applyPercent, finalTalentLv, round2 } from "@Src/utils";
import { applyModifier, getInput, increaseAttackBonus } from "@Src/calculators/utils";
import { checkCons } from "../utils";

const getAttackBuffValue = (inputs: ModifierInput[] | undefined): [number, string] => {
  const baseATK = getInput(inputs, 0, 0);
  const level = getInput(inputs, 1, 0);
  const mult = 42.96 * TALENT_LV_MULTIPLIERS[2][level];
  return [applyPercent(baseATK, mult), `${level} / ${round2(mult)}% of ${baseATK} Base ATK`];
};

const Sara: DataCharacter = {
  code: 41,
  name: "Kujou Sara",
  GOOD: "KujouSara",
  icon: "9/96/Character_Kujou_Sara_Thumb",
  sideIcon: "9/92/Character_Kujou_Sara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weapon: "bow",
  stats: [
    [802, 16, 53],
    [2061, 42, 135],
    [2661, 54, 175],
    [3985, 81, 262],
    [4411, 90, 289],
    [5074, 104, 333],
    [5642, 115, 370],
    [6305, 129, 414],
    [6731, 137, 442],
    [7393, 151, 485],
    [7818, 160, 513],
    [8481, 173, 556],
    [8907, 182, 584],
    [9570, 195, 628],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Tengu Bowmanship",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 36.89 },
        { name: "2-Hit", baseMult: 38.7 },
        { name: "3-Hit", baseMult: 48.5 },
        { name: "4-Hit", baseMult: 50.4 },
        { name: "5-Hit", baseMult: 58.05 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Tengu Stormcall",
      image: "6/6a/Talent_Tengu_Stormcall",
      xtraLvAtCons: 5,
      stats: [
        { name: "Tengu Juurai: Ambush DMG", baseMult: 125.76 },
        {
          name: "ATK Bonus",
          notAttack: "other",
          baseStatType: "base_atk",
          baseMult: 42.96,
          multType: 2,
        },
      ],
      // getExtraStats: () => [
      //   { name: "ATK Bonus Duration", value: "6s" },
      //   { name: "Hold CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Subjugation: Koukou Sendou",
      image: "e/e8/Talent_Subjugation_Koukou_Sendou",
      xtraLvAtCons: 3,
      stats: [
        { name: "Tengu Juurai: Titanbreaker DMG", baseMult: 409.6 },
        { name: "Tengu Juurai: Stormcluster DMG", baseMult: 34.12 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "20s" }],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Immovable Will", image: "4/4f/Talent_Immovable_Will" },
    { name: "Decorum", image: "b/b7/Talent_Decorum" },
    { name: "Land Survey", image: "e/e8/Talent_Land_Survey" },
  ],
  constellation: [
    { name: "Crow's Eye", image: "a/ad/Constellation_Crow%27s_Eye" },
    { name: "Dark Wings", image: "7/73/Constellation_Dark_Wings" },
    { name: "The War Within", image: "c/c4/Constellation_The_War_Within" },
    { name: "Conclusive Proof", image: "3/35/Constellation_Conclusive_Proof" },
    { name: "Spellsinger", image: "b/b1/Constellation_Spellsinger" },
    { name: "Sin of Pride", image: "b/b4/Constellation_Sin_of_Pride" },
  ],
  buffs: [
    {
      index: 0,
      src: EModifierSrc.ES,
      desc: ({ toSelf, inputs }) => (
        <>
          Grants the active character within its AoE an <Green>ATK Bonus</Green> based on Kujou
          Sara's <Green>Base ATK</Green>.{" "}
          {!toSelf && <Red>ATK Bonus: {getAttackBuffValue(inputs)[0]}.</Red>}
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfig: {
        labels: ["Base ATK", "Elemental Skill Level"],
        initialValues: [0, 1],
        renderTypes: ["text", "text"],
        maxValues: [9999, 13],
      },
      applyBuff: (obj) => {
        const buffValueArgs = obj.toSelf
          ? [obj.totalAttr.base_atk, finalTalentLv(obj.char, "ES", obj.partyData)]
          : obj.inputs;
        const [bonusValue, xtraDesc] = getAttackBuffValue(buffValueArgs);
        const desc = `${obj.desc} / Lv. ${xtraDesc}`;
        applyModifier(desc, obj.totalAttr, "atk", bonusValue, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          The <Electro>Electro DMG</Electro> of characters who have had their ATK increased by Tengu
          Juurai has its <Green>Crit DMG</Green> increased by <Green b>60%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.PARTY,
      applyBuff: (obj) => {
        increaseAttackBonus({
          ...obj,
          element: "electro",
          type: "cDmg",
          value: 60,
          mainCharVision: obj.charData.vision,
        });
      },
    },
  ],
};

export default Sara;

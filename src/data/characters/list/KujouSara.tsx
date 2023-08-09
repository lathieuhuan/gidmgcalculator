import type { AppCharacter, DefaultAppCharacter, ModifierInput } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkCons } from "../utils";

const getAttackBuffValue = (inputs: ModifierInput[]): [number, string] => {
  const baseATK = inputs[0] || 0;
  const level = inputs[1] || 1;
  const mult = 42.96 * TALENT_LV_MULTIPLIERS[2][level];
  return [applyPercent(baseATK, mult), `${level} / ${round(mult, 2)}% of ${baseATK} Base ATK`];
};

const KujouSara: DefaultAppCharacter = {
  code: 41,
  name: "Kujou Sara",
  GOOD: "KujouSara",
  icon: "d/df/Kujou_Sara_Icon",
  sideIcon: "0/00/Kujou_Sara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  bonusStat: {
    type: "atk_",
    value: 6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 36.89 },
      { name: "2-Hit", multFactors: 38.7 },
      { name: "3-Hit", multFactors: 48.5 },
      { name: "4-Hit", multFactors: 50.4 },
      { name: "5-Hit", multFactors: 58.05 },
    ],
    CA: BOW_CAs,
    PA: LIGHT_PAs,
    ES: [
      {
        name: "Tengu Juurai: Ambush DMG",
        multFactors: 125.76,
      },
    ],
    EB: [
      { name: "Tengu Juurai: Titanbreaker DMG", multFactors: 409.6 },
      { name: "Tengu Juurai: Stormcluster DMG", multFactors: 34.12 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Tengu Bowmanship",
    },
    ES: {
      name: "Tengu Stormcall",
      image: "6/6a/Talent_Tengu_Stormcall",
    },
    EB: {
      name: "Subjugation: Koukou Sendou",
      image: "e/e8/Talent_Subjugation_Koukou_Sendou",
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
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Grants the active character within its AoE an {ATK Bonus}#[gr] based on Kujou Sara's
      {Base ATK}#[gr].
      <br />• At {C6}#[g], it also increases {Electro Crit DMG}#[gr] by {60%}#[b,gr].`,
      inputConfigs: [
        { label: "Base ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { fromSelf } = obj;
        const buffValueArgs = fromSelf
          ? [obj.totalAttr.base_atk, finalTalentLv({ ...obj, charData: KujouSara as AppCharacter, talentType: "ES" })]
          : obj.inputs;
        const [buffValue, xtraDesc] = getAttackBuffValue(buffValueArgs);
        const desc = `${obj.desc} / Lv. ${xtraDesc}`;

        applyModifier(desc, obj.totalAttr, "atk", buffValue, obj.tracker);

        if ((fromSelf && checkCons[6](obj.char)) || (!fromSelf && obj.inputs[2])) {
          const descC6 = `${fromSelf ? "Self" : "Kujou Sara"} / ${EModSrc.C6}`;
          applyModifier(descC6, obj.attElmtBonus, "electro.cDmg_", 60, obj.tracker);
        }
      },
    },
  ],
};

export default KujouSara as AppCharacter;

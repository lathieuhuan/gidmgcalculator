import type { DataCharacter, ModifierInput } from "@Src/types";
import { Electro, Green, Lightgold, Red } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { applyPercent, round } from "@Src/utils";
import { finalTalentLv, applyModifier } from "@Src/utils/calculation";
import { checkCons } from "../utils";

const getAttackBuffValue = (inputs: ModifierInput[]): [number, string] => {
  const baseATK = inputs[0] || 0;
  const level = inputs[1] || 1;
  const mult = 42.96 * TALENT_LV_MULTIPLIERS[2][level];
  return [applyPercent(baseATK, mult), `${level} / ${round(mult, 2)}% of ${baseATK} Base ATK`];
};

const Sara: DataCharacter = {
  code: 41,
  name: "Kujou Sara",
  GOOD: "KujouSara",
  // icon: "9/96/Character_Kujou_Sara_Thumb",
  icon: "d/df/Kujou_Sara_Icon",
  sideIcon: "9/92/Character_Kujou_Sara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weaponType: "bow",
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
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: { root: 36.89 } },
        { name: "2-Hit", multFactors: { root: 38.7 } },
        { name: "3-Hit", multFactors: { root: 48.5 } },
        { name: "4-Hit", multFactors: { root: 50.4 } },
        { name: "5-Hit", multFactors: { root: 58.05 } },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Tengu Stormcall",
      image: "6/6a/Talent_Tengu_Stormcall",
      stats: [
        { name: "Tengu Juurai: Ambush DMG", multFactors: { root: 125.76 } },
        {
          name: "ATK Bonus",
          notAttack: "other",
          multFactors: { root: 42.96, attributeType: "base_atk" },
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
      stats: [
        { name: "Tengu Juurai: Titanbreaker DMG", multFactors: { root: 409.6 } },
        { name: "Tengu Juurai: Stormcluster DMG", multFactors: { root: 34.12 } },
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
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      desc: ({ toSelf, inputs }) => (
        <>
          Grants the active character within its AoE an <Green>ATK Bonus</Green> based on Kujou
          Sara's <Green>Base ATK</Green>.{" "}
          {!toSelf && <Red>ATK bonus: {getAttackBuffValue(inputs)[0]}.</Red>}
          <br />• At <Lightgold>C6</Lightgold>, it also increases <Electro>Electro</Electro>{" "}
          <Green>Crit DMG</Green> by <Green b>60%</Green>.
        </>
      ),
      inputConfigs: [
        { label: "Base ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { toSelf } = obj;
        const buffValueArgs = toSelf
          ? [obj.totalAttr.base_atk, finalTalentLv({ ...obj, dataChar: Sara, talentType: "ES" })]
          : obj.inputs;
        const [buffValue, xtraDesc] = getAttackBuffValue(buffValueArgs);
        const desc = `${obj.desc} / Lv. ${xtraDesc}`;

        applyModifier(desc, obj.totalAttr, "atk", buffValue, obj.tracker);

        if ((toSelf && checkCons[6](obj.char)) || (!toSelf && obj.inputs[2])) {
          const descC6 = `${toSelf ? "Self" : "Kujou Sara"} / ${EModSrc.C6}`;
          applyModifier(descC6, obj.attElmtBonus, "electro.cDmg_", 60, obj.tracker);
        }
      },
    },
  ],
};

export default Sara;

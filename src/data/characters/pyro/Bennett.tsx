import type { DataCharacter, ModifierInput } from "@Src/types";
import { Green, Lightgold, Red } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyPercent, round } from "@Src/utils";
import { finalTalentLv, applyModifier } from "@Src/utils/calculation";
import { checkCons, talentBuff } from "../utils";

function getEBBuffValue(inputs: ModifierInput[]): [number, string] {
  const baseATK = inputs[0] || 0;
  const level = inputs[1] || 0;
  const boosted = (inputs[2] || 0) === 1;
  let mult = 56 * TALENT_LV_MULTIPLIERS[2][level];
  let desc = level.toString();

  if (level && boosted) {
    mult += 20;
    desc += ` / C1: 20% extra`;
  }
  return [applyPercent(baseATK, mult), desc + ` / ${round(mult, 2)}% of ${baseATK} Base ATK`];
}

const Bennett: DataCharacter = {
  code: 19,
  name: "Bennett",
  // icon: "7/7b/Character_Bennett_Thumb",
  icon: "7/79/Bennett_Icon",
  sideIcon: "3/3c/Character_Bennett_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "sword",
  stats: [
    [1039, 16, 65],
    [2670, 41, 166],
    [3447, 53, 214],
    [5163, 80, 321],
    [5715, 88, 356],
    [6573, 101, 409],
    [7309, 113, 455],
    [8168, 126, 508],
    [8719, 134, 542],
    [9577, 148, 596],
    [10129, 156, 630],
    [10987, 169, 684],
    [11539, 178, 718],
    [12397, 191, 771],
  ],
  bonusStat: { type: "er", value: 6.7 },
  NAsConfig: {
    name: "Strike of Fortune",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 44.55 },
        { name: "2-Hit", multFactors: 42.7 },
        { name: "3-Hit", multFactors: 54.61 },
        { name: "4-Hit", multFactors: 59.68 },
        { name: "5-Hit", multFactors: 71.9 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: [55.9, 60.72] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Passion Overload",
      image: "6/66/Talent_Passion_Overload",
      stats: [
        { name: "Press", multFactors: 137.6 },
        { name: "Charge Level 1", multFactors: [84, 92] },
        { name: "Charge Level 2", multFactors: [88, 96] },
        { name: "Explosion", multFactors: 132 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "5/7.5/10s" }],
    },
    EB: {
      name: "Fantastic Voyage",
      image: "a/a2/Talent_Fantastic_Voyage",
      stats: [
        { name: "Skill DMG", multFactors: 232.8 },
        {
          name: "Regeneration",
          notAttack: "healing",
          multFactors: { root: 6, attributeType: "hp" },
          flatFactor: 577,
        },
        {
          name: "ATK Bonus",
          notAttack: "other",
          multFactors: { root: 56, attributeType: "base_atk" },
          getTalentBuff: ({ char }) => talentBuff([checkCons[1](char), "mult", [false, 1], 20]),
        },
      ],
      // getExtraStats: () => [
      //   { name: "Durtion", value: "12s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Rekindle", image: "7/77/Talent_Rekindle" },
    { name: "Fearnaught", image: "1/1a/Talent_Fearnaught" },
    { name: "It Should Be Safe...", image: "2/2a/Talent_It_Should_Be_Safe..." },
  ],
  constellation: [
    { name: "Grand Expectation", image: "c/c0/Constellation_Grand_Expectation" },
    { name: "Impasse Conqueror", image: "8/87/Constellation_Impasse_Conqueror" },
    { name: "Unstoppable Fervor", image: "e/ed/Constellation_Unstoppable_Fervor" },
    { name: "Unexpected Odyssey", image: "0/0e/Constellation_Unexpected_Odyssey" },
    { name: "True Explorer", image: "3/39/Constellation_True_Explorer" },
    { name: "Fire Ventures with Me", image: "3/3a/Constellation_Fire_Ventures_With_Me" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.ACTIVE_UNIT,
      desc: ({ toSelf, inputs }) => (
        <>
          Increases <Green>ATK</Green> of the characters within its AoE based on Bennett's{" "}
          <Green>Base ATK</Green>.<br />• At <Lightgold>C1</Lightgold>, the <Green>ATK Bonus</Green>{" "}
          is further increased by <Green b>20%</Green> of his <Green>Base ATK</Green>.{" "}
          {!toSelf && <Red>ATK Bonus: {getEBBuffValue(inputs)[0]}.</Red>}
          <br />• At <Lightgold>C6</Lightgold>, the characters also gain a <Green b>15%</Green>{" "}
          <Green>Pyro DMG Bonus</Green>.
        </>
      ),
      inputConfigs: [
        { label: "Base ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "text", initialValue: 1, max: 13, for: "teammate" },
        { label: "Constellation 1", type: "check", for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { toSelf, char, totalAttr, inputs } = obj;
        const args = toSelf
          ? [
              totalAttr.base_atk,
              finalTalentLv({ ...obj, dataChar: Bennett, talentType: "EB" }),
              checkCons[1](char) ? 1 : 0,
            ]
          : inputs;
        const [buffValue, xtraDesc] = getEBBuffValue(args);
        const desc = `${obj.desc} / Lv. ${xtraDesc}`;
        applyModifier(desc, totalAttr, "atk", buffValue, obj.tracker);

        if (toSelf ? checkCons[6](char) : inputs[3]) {
          const descC6 = `${toSelf ? "Self" : "Bennet"} / ${EModSrc.C6}`;
          applyModifier(descC6, totalAttr, "pyro", 15, obj.tracker);
        }
      },
    },
  ],
};

export default Bennett;

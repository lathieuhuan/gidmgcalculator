import type { DataCharacter, ModifierInput } from "@Src/types";
import { Green, Pyro, Red } from "@Src/styled-components";
import { EModAffect, NORMAL_ATTACKS } from "@Src/constants";
import { EModSrc, MEDIUM_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { applyPercent, finalTalentLv, round2 } from "@Src/utils";
import { applyModifier, getInput, makeModApplier } from "@Src/calculators/utils";
import { charModIsInUse, checkCons, talentBuff } from "../utils";

function getEBBuffValue(inputs: ModifierInput[] | undefined): [number, string] {
  const baseATK = getInput(inputs, 0, 0);
  const level = getInput(inputs, 1, 0);
  const boosted = getInput(inputs, 2, false);
  let mult = 56 * TALENT_LV_MULTIPLIERS[2][+level];
  let desc = level.toString();

  if (boosted) {
    mult += 20;
    desc += ` / C1: 20% extra`;
  }
  return [applyPercent(+baseATK, mult), desc + ` / ${round2(mult)}% of ${baseATK} Base ATK`];
}

const Bennett: DataCharacter = {
  code: 19,
  name: "Bennett",
  icon: "7/7b/Character_Bennett_Thumb",
  sideIcon: "3/3c/Character_Bennett_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weapon: "sword",
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
        { name: "1-Hit", baseMult: 44.55 },
        { name: "2-Hit", baseMult: 42.7 },
        { name: "3-Hit", baseMult: 54.61 },
        { name: "4-Hit", baseMult: 59.68 },
        { name: "5-Hit", baseMult: 71.9 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: [55.9, 60.72] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Passion Overload",
      image: "6/66/Talent_Passion_Overload",
      xtraLvAtCons: 3,
      stats: [
        { name: "Press", baseMult: 137.6 },
        { name: "Charge Level 1", baseMult: [84, 92] },
        { name: "Charge Level 2", baseMult: [88, 96] },
        { name: "Explosion", baseMult: 132 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "5/7.5/10s" }],
    },
    EB: {
      name: "Fantastic Voyage",
      image: "a/a2/Talent_Fantastic_Voyage",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", baseMult: 232.8 },
        {
          name: "Regeneration",
          notAttack: "healing",
          baseStatType: "hp",
          baseMult: 6,
          multType: 2,
          flat: { base: 577, type: 3 },
        },
        {
          name: "ATK Bonus",
          baseStatType: "base_atk",
          baseMult: 56,
          multType: 2,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const isActivated = charModIsInUse(Bennett.buffs!, char, selfBuffCtrls, 1);

            return talentBuff([isActivated, "mult", [false, 1], 20]);
          },
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
      desc: ({ toSelf, inputs }) => (
        <>
          The character within its AoE gains an <Green>ATK Bonus</Green> that is based on Bennett's{" "}
          <Green>Base ATK</Green>. {!toSelf && <Red>ATK Bonus: {getEBBuffValue(inputs)[0]}.</Red>}
        </>
      ),
      affect: EModAffect.ACTIVE_UNIT,
      inputConfig: {
        labels: ["Base ATK", "Elemental Burst Level", "Constellation 1"],
        renderTypes: ["text", "text", "check"],
        initialValues: [0, 1, false],
        maxValues: [9999, 13, 0],
      },
      applyBuff: (obj) => {
        const { char, totalAttr } = obj;
        const args = obj.toSelf
          ? [
              totalAttr.base_atk,
              finalTalentLv(obj.char, "EB", obj.partyData),
              !!charModIsInUse(Bennett.buffs!, char, obj.charBuffCtrls, 1),
            ]
          : obj.inputs;
        const [buffValue, xtraDesc] = getEBBuffValue(args);
        const desc = `${obj.desc} / Lv. ${xtraDesc}`;
        applyModifier(desc, totalAttr, "atk", buffValue, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.C1,
      desc: () => (
        <>
          Fantastic Voyage's ATK increase gains an additional <Green b>20%</Green> of Bennett's{" "}
          <Green>Base ATK</Green>.
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
    },
    {
      index: 2,
      src: EModSrc.C6,
      desc: () => (
        <>
          Sword, Claymore, Polearm characters inside Fantastic Voyage's radius gain a{" "}
          <Green b>15%</Green> <Green>Pyro DMG Bonus</Green> and their weapons are{" "}
          <Green>infused</Green> with <Pyro>Pyro</Pyro>.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.PARTY,
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: true,
        appliable: (charData) => ["sword", "claymore", "polearm"].includes(charData.weapon),
      },
      applyBuff: makeModApplier("totalAttr", "pyro", 15),
    },
  ],
};

export default Bennett;

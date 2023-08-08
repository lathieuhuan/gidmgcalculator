import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Layla: DefaultAppCharacter = {
  code: 61,
  name: "Layla",
  icon: "1/1a/Layla_Icon",
  sideIcon: "2/23/Layla_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [930, 18, 55],
    [2389, 47, 141],
    [3084, 60, 182],
    [4619, 90, 273],
    [5113, 100, 302],
    [5881, 115, 347],
    [6540, 128, 386],
    [7308, 143, 432],
    [7801, 152, 461],
    [8569, 167, 506],
    [9062, 177, 535],
    [9831, 192, 581],
    [10324, 202, 610],
    [11092, 217, 655],
  ],
  bonusStat: { type: "hp_", value: 6 },
  activeTalents: {
    NAs: {
      name: "Sword of the Radiant Path",
    },
    ES: {
      name: "Nights of Formal Focus",
      image: "9/90/Talent_Nights_of_Formal_Focus",
    },
    EB: {
      name: "Dream of the Star-Stream Shaker",
      image: "b/b4/Talent_Dream_of_the_Star-Stream_Shaker",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 51.22 },
      { name: "2-Hit", multFactors: 48.48 },
      { name: "3-Hit", multFactors: 72.97 },
    ],
    CA: [{ name: "Charged Attack DMG", multFactors: [47.73, 52.55] }],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 12.8 },
      {
        id: "ES.0",
        name: "Shooting Star DMG",
        multFactors: 14.72,
      },
      {
        id: "ES.1",
        name: "Base Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 10.8, attributeType: "hp" },
        flatFactor: 1040,
      },
    ],
    EB: [
      {
        name: "Starlight Slug DMG",
        multFactors: { root: 4.65, attributeType: "hp" },
      },
    ],
  },
  passiveTalents: [
    { name: "Like Nascent Light", image: "6/6d/Talent_Like_Nascent_Light" },
    {
      name: "Sweet Slumber Undisturbed",
      image: "3/32/Talent_Sweet_Slumber_Undisturbed",
    },
    { name: "Shadowy Dream-Signs", image: "5/51/Talent_Shadowy_Dream-Signs" },
  ],
  constellation: [
    {
      name: "Fortress of Fantasy",
      image: "5/50/Constellation_Fortress_of_Fantasy",
    },
    { name: "Light's Remit", image: "6/6a/Constellation_Light%27s_Remit" },
    {
      name: "Secrets of the Night",
      image: "6/66/Constellation_Secrets_of_the_Night",
    },
    {
      name: "Starry Illumination",
      image: "a/ab/Constellation_Starry_Illumination",
    },
    {
      name: "Stream of Consciousness",
      image: "8/8f/Constellation_Stream_of_Consciousness",
    },
    { name: "Radiant Soulfire", image: "b/b9/Constellation_Radiant_Soulfire" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `{Shooting Star DMG}#[gr] [~ES] is increased by {1.5%}#[b,gr] of Layla's {Max HP}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A4, "ES.0", "flat", applyPercent(totalAttr.hp, 1.5)));
      },
    },
    {
      src: EModSrc.C1,
      description: `The {Shield Absorption}#[gr] of the Curtain of Slumber [~ES] is increased by {20%}#[b,gr].`,
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C1, "ES.1", "pct_", 20));
      },
    },
    {
      src: EModSrc.C6,
      description: `Increases {Shooting Star DMG}#[gr] [~ES] and {Starlight Slug DMG}#[gr] [~EB] by {40%}#[b,gr].`,
      isGranted: checkCons[6],
      applyBuff: ({ attPattBonus, calcItemBuffs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "EB.pct_", 40, tracker);
        calcItemBuffs.push(exclBuff(EModSrc.C6, "ES.0", "pct_", 40));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `While the Curtain of Slumber [~ES] is active, each time the Curtain gains a Night Star:
      <br />• The {Shield Strength}#[gr] of the character is increased by {6%}#[b,gr]. Max {4}#[r] stacks.
      <br />• This effect persists until the Curtain of Slumber disappears.`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 6 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `When Nights of Formal Focus [ES] starts to fire off Shooting Stars, it will increases
      {Normal and Charged Attack DMG}#[gr] of nearby party members based on {5%}#[b,gr] of Layla's {Max HP}#[gr].`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Max HP",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: ({ toSelf, totalAttr, attPattBonus, inputs, desc, tracker }) => {
        const maxHP = toSelf ? totalAttr.hp : inputs[0] || 0;
        const buffValue = applyPercent(maxHP, 5);
        applyModifier(desc, attPattBonus, ["NA.flat", "CA.flat"], buffValue, tracker);
      },
    },
  ],
};

export default Layla as AppCharacter;

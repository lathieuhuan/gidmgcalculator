import type { DataCharacter } from "@Src/types";
import { Green, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { CHARACTER_IMAGES, NCPA_PERCENTS } from "@Data/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Thoma: DataCharacter = {
  code: 43,
  name: "Thoma",
  // icon: "8/8a/Character_Thoma_Thumb",
  icon: CHARACTER_IMAGES.Thoma,
  sideIcon: "4/46/Character_Thoma_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "polearm",
  stats: [
    [866, 17, 63],
    [2225, 43, 162],
    [2872, 56, 209],
    [4302, 84, 313],
    [4762, 93, 346],
    [5478, 107, 398],
    [6091, 119, 443],
    [6806, 133, 495],
    [7266, 142, 528],
    [7981, 156, 580],
    [8440, 165, 613],
    [9156, 179, 665],
    [9616, 188, 699],
    [10331, 202, 751],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Swiftshatter Spear",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 44.39 },
        { name: "2-Hit", multFactors: 43.63 },
        { name: "3-Hit (1/2)", multFactors: 26.79 },
        { name: "4-Hit", multFactors: 67.36 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 112.75 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Blazing Blessing",
      image: "9/9b/Talent_Blazing_Blessing",
      stats: [
        { name: "Skill DMG", multFactors: 146.4 },
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 7.2, attributeType: "hp" },
          flatFactor: 693,
        },
        {
          name: "Max Shield DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 19.6, attributeType: "hp" },
          flatFactor: 1887,
        },
      ],
      // getExtraStats: () => [
      //   { name: "Shield Duration", value: "8s" },
      //   { name: "CD", value: "15s" },
      // ],
    },
    EB: {
      name: "Crimson Ooyoroi",
      image: "e/e4/Talent_Crimson_Ooyoroi",
      stats: [
        { name: "Skill DMG", multFactors: 88 },
        {
          name: "Fiery Collapse DMG",
          multFactors: 58,
          getTalentBuff: ({ char, totalAttr }) => {
            const buffValue = applyPercent(totalAttr.hp, 2.2);
            return talentBuff([checkAscs[4](char), "flat", [true, 4], buffValue]);
          },
        },
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 1.14, attributeType: "hp" },
          flatFactor: 110,
        },
      ],
      // getExtraStats: () => [
      //   { name: "Shield Duration", value: "8s" },
      //   { name: "Scorching Ooyoroi Duration", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Imbricated Armor", image: "4/4b/Talent_Imbricated_Armor" },
    { name: "Flaming Assault", image: "0/03/Talent_Flaming_Assault" },
    { name: "Snap and Swing", image: "1/14/Talent_Snap_and_Swing" },
  ],
  constellation: [
    { name: "A Comrade's Duty", image: "9/9c/Constellation_A_Comrade%27s_Duty" },
    { name: "A Subordinate's Skills", image: "e/e9/Constellation_A_Subordinate%27s_Skills" },
    { name: "Fortified Resolve", image: "9/99/Constellation_Fortified_Resolve" },
    { name: "Long-Term Planning", image: "f/f4/Constellation_Long-Term_Planning" },
    { name: "Raging Wildfire", image: "5/5b/Constellation_Raging_Wildfire" },
    { name: "Burning Heart", image: "0/0f/Constellation_Burning_Heart" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          <Green>Fiery Collapse DMG</Green> [~EB] is increased by <Green b>2.2%</Green> of Thoma's{" "}
          <Green>Max HP</Green>.
        </>
      ),
      isGranted: checkAscs[4],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          When your current active character obtains or refreshes a Blazing Barrier, this
          character's <Green>Shield Strength</Green> will increase by <Green b>5%</Green> for 6s.
          Max <Rose>5</Rose> stacks, each stack can be obtained once every 0.3 seconds.
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shStr", 5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      isGranted: checkCons[6],
      desc: () => (
        <>
          When a Blazing Barrier is obtained or refreshed, all party members'{" "}
          <Green>Normal, Charged, and Plunging Attack DMG</Green> is increased by{" "}
          <Green b>15%</Green> for 6s.
        </>
      ),
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("attPattBonus", [...NCPA_PERCENTS], 15),
    },
  ],
};

export default Thoma;

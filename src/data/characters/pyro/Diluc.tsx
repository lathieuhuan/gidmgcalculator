import type { AttributeStat, DataCharacter } from "@Src/types";
import { Green, Lightgold, Pyro, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Diluc: DataCharacter = {
  code: 20,
  name: "Diluc",
  // icon: "0/02/Character_Diluc_Thumb",
  icon: "3/3d/Diluc_Icon",
  sideIcon: "a/af/Character_Diluc_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "claymore",
  stats: [
    [1011, 26, 61],
    [2621, 68, 158],
    [3488, 90, 211],
    [5219, 135, 315],
    [5834, 151, 352],
    [6712, 173, 405],
    [7533, 194, 455],
    [8421, 217, 509],
    [9036, 233, 546],
    [9932, 256, 600],
    [10547, 272, 637],
    [11453, 295, 692],
    [12068, 311, 729],
    [12981, 335, 784],
  ],
  bonusStat: { type: "cRate_", value: 4.8 },
  NAsConfig: {
    name: "Tempered Sword",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 89.7 },
        { name: "2-Hit", multFactors: 87.63 },
        { name: "3-Hit", multFactors: 98.81 },
        { name: "4-Hit", multFactors: 133.99 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", multFactors: 68.8 },
        { name: "Charged Attack Final", multFactors: 124.7 },
      ],
    },
    PA: {
      stats: [
        { name: "Plunge DMG", multFactors: 89.51 },
        { name: "Low Plunge", multFactors: 178.97 },
        { name: "High Plunge", multFactors: 223.55 },
      ],
    },
    ES: {
      name: "Searing Onslaught",
      image: "5/53/Talent_Searing_Onslaught",
      stats: [
        { name: "1-Hit DMG", multFactors: 94.4 },
        { name: "2-Hit DMG", multFactors: 97.6 },
        { name: "3-Hit DMG", multFactors: 128.8 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "10s" }],
    },
    EB: {
      name: "Dawn",
      image: "f/f5/Talent_Dawn",
      stats: [
        { name: "Splashing DMG", multFactors: 204 },
        { name: "DoT", multFactors: 60 },
        { name: "Explosion DMG", multFactors: 204 },
      ],
      // getExtraStats: () => [
      //   { name: "CD", value: "12s" },
      //   { name: "Infustion Durtion", value: "12s" },
      // ],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Relentless", image: "5/5f/Talent_Relentless" },
    { name: "Blessing of Phoenix", image: "c/c3/Talent_Blessing_of_Phoenix" },
    { name: "Tradition of the Dawn Knight", image: "a/af/Talent_Tradition_of_the_Dawn_Knight" },
  ],
  constellation: [
    { name: "Conviction", image: "7/72/Constellation_Conviction" },
    { name: "Searing Ember", image: "b/b4/Constellation_Searing_Ember" },
    { name: "Fire and Steel", image: "5/52/Constellation_Fire_and_Steel" },
    { name: "Flowing Flame", image: "a/a1/Constellation_Flowing_Flame" },
    {
      name: "Phoenix, Harbinger of Dawn",
      image: "d/dc/Constellation_Phoenix%2C_Harbinger_of_Dawn",
    },
    {
      name: "Flaming Sword, Nemesis of the Dark",
      image: "1/1c/Constellation_Flaming_Sword%2C_Nemesis_of_the_Dark",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      applyBuff: ({ char, totalAttr, tracker }) => {
        if (checkAscs[4](char)) {
          applyModifier(`Self / ${EModSrc.A4}`, totalAttr, "pyro", 20, tracker);
        }
      },
      desc: () => (
        <>
          After casting Dawn [EB], Diluc gains a <Pyro>Pyro Infusion</Pyro>.
          <br />• At <Lightgold>A4</Lightgold>, Diluc gains <Green b>20%</Green>{" "}
          <Green>Pyro DMG Bonus</Green> during this duration.
        </>
      ),
      infuseConfig: {
        overwritable: true,
      },
    },
    {
      index: 2,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Diluc deals <Green b>15%</Green> <Green>more DMG</Green> to opponents whose HP is above
          50%.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "all.pct", 15),
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Diluc takes DMG, his <Green>ATK</Green> increases by <Green b>10%</Green> and{" "}
          <Green>ATK SPD</Green> increases by <Green b>5%</Green> for 10s, up to <Rose>3</Rose>{" "}
          times.
        </>
      ),
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 5 * (inputs[0] || 0);
        const keys: AttributeStat[] = ["atk_", "naAtkSpd_", "caAtkSpd_"];
        applyModifier(desc, totalAttr, keys, [buffValue * 2, buffValue, buffValue], tracker);
      },
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Within 2s after casting Searing Onslaught [ES], casting the next Searing Onslaught in the
          combo deals <Green b>40%</Green> <Green>DMG Bonus</Green>. This effect lasts for 2s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "ES.pct", 40),
    },
    {
      index: 5,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Within 6s after casting Searing Onslaught [ES], the next <Rose>2</Rose>{" "}
          <Green>Normal Attacks</Green> will have their <Green>DMG and ATK SPD</Green> increased by{" "}
          <Green b>30%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "NA.pct", 30, tracker);
        applyModifier(desc, totalAttr, "naAtkSpd_", 30, tracker);
      },
    },
  ],
};

export default Diluc;

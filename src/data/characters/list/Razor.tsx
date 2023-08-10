import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const getEBBuffValue = (args: DescriptionSeedGetterArgs) => {
  const level = finalTalentLv({
    talentType: "EB",
    char: args.char,
    charData: Razor as AppCharacter,
    partyData: args.partyData,
  });
  return Math.min(24 + level * 2 - Math.max(level - 6, 0), 40);
};

const Razor: DefaultAppCharacter = {
  code: 11,
  name: "Razor",
  icon: "b/b8/Razor_Icon",
  sideIcon: "4/4d/Razor_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [1003, 20, 63],
    [2577, 50, 162],
    [3326, 65, 209],
    [4982, 97, 313],
    [5514, 108, 346],
    [6343, 124, 398],
    [7052, 138, 443],
    [7881, 154, 495],
    [8413, 164, 528],
    [9241, 180, 580],
    [9773, 191, 613],
    [10602, 207, 665],
    [11134, 217, 699],
    [11962, 234, 751],
  ],
  bonusStat: {
    type: "phys",
    value: 7.5,
  },
  calcListConfig: {
    NA: { multScale: 4 },
    CA: { multScale: 7 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 95.92 },
      { name: "2-Hit", multFactors: 82.63 },
      { name: "3-Hit", multFactors: 103.31 },
      { name: "4-Hit", multFactors: 136.05 },
      {
        name: "Lightning strike (C6)",
        multFactors: { root: 100, scale: 0 },
        attElmt: "electro",
        attPatt: "none",
      },
    ],
    CA: [
      { name: "Charged Attack Spinning", multFactors: 62.54 },
      { name: "Charged Attack Final", multFactors: 113.09 },
    ],
    PA: [
      { name: "Plunge DMG", multFactors: 82.05 },
      { name: "Low Plunge", multFactors: 164.06 },
      { name: "High Plunge", multFactors: 204.92 },
    ],
    ES: [
      { name: "Press DMG", multFactors: 199.2 },
      { name: "Hold DMG", multFactors: 295.2 },
    ],
    EB: [
      {
        name: "Burst DMG",
        multFactors: 160,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Steel Fang",
    },
    ES: {
      name: "Claw and Thunder",
      image: "0/06/Talent_Claw_and_Thunder",
    },
    EB: {
      name: "Lightning Fang",
      image: "3/3a/Talent_Lightning_Fang",
    },
  },
  passiveTalents: [
    { name: "Awakening", image: "5/5c/Talent_Awakening" },
    { name: "Hunger", image: "b/be/Talent_Hunger" },
    { name: "Wolvensprint", image: "0/0a/Talent_Wolvensprint" },
  ],
  constellation: [
    { name: "Wolf's Instinct", image: "c/cf/Constellation_Wolf%27s_Instinct" },
    { name: "Suppression", image: "1/16/Constellation_Suppression" },
    { name: "Soul Companion", image: "6/6a/Constellation_Soul_Companion" },
    { name: "Bite", image: "0/01/Constellation_Bite" },
    { name: "Sharpened Claws", image: "c/c4/Constellation_Sharpened_Claws" },
    { name: "Lupus Fulguris", image: "1/12/Constellation_Lupus_Fulguris" },
  ],
  dsGetters: [(args) => `${getEBBuffValue(args)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Increases Razor's {ATK SPD}#[gr] by {@0}#[b,gr].`,
      applyBuff: (obj) => {
        applyModifier(obj.desc, obj.totalAttr, "naAtkSpd_", getEBBuffValue(obj), obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Picking up an Elemental Orb or Particle increases Razor's {DMG}#[gr] by {10%}#[b,gr] for 8s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "all.pct_", 10),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Increases {CRIT Rate}#[gr] against opponents with less than 30% HP by {10%}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "cRate_", 10),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Claw and Thunder [ES] (Press) decreases opponents' {DEF}#[gr] by {15%}#[b,gr] for 7s.`,
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Razor as AppCharacter;

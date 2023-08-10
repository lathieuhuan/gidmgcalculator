import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc, HEAVIER_PAs } from "../constants";
import { checkAscs, getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 58.45 }, Xiao as AppCharacter, args);
};

const Xiao: DefaultAppCharacter = {
  code: 30,
  name: "Xiao",
  icon: "f/fd/Xiao_Icon",
  sideIcon: "4/49/Xiao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "anemo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [991, 27, 62],
    [2572, 71, 161],
    [3422, 94, 215],
    [5120, 140, 321],
    [5724, 157, 359],
    [6586, 181, 413],
    [7391, 203, 464],
    [8262, 227, 519],
    [8866, 243, 556],
    [9744, 267, 612],
    [10348, 284, 649],
    [11236, 308, 705],
    [11840, 325, 743],
    [12736, 349, 799],
  ],
  bonusStat: { type: "cRate_", value: 4.8 },
  activeTalents: {
    NAs: {
      name: "Whirlwind Thrust",
    },
    ES: {
      name: "Lemniscatic Wind Cycling",
      image: "d/da/Talent_Lemniscatic_Wind_Cycling",
    },
    EB: {
      name: "Bane of All Evil",
      image: "2/2f/Talent_Bane_of_All_Evil",
    },
  },
  calcListConfig: {
    NA: {
      multScale: 4,
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit (1/2)", multFactors: 27.54 },
      { name: "2-Hit", multFactors: 56.94 },
      { name: "3-Hit", multFactors: 68.55 },
      { name: "4-Hit (1/2)", multFactors: 37.66 },
      { name: "5-Hit", multFactors: 71.54 },
      { name: "6-Hit", multFactors: 95.83 },
    ],
    CA: [{ name: "Charged Attack", multFactors: { root: 121.09, scale: 4 } }],
    PA: HEAVIER_PAs,
    ES: [{ name: "Skill DMG", multFactors: 252.8 }],
    EB: [],
  },
  passiveTalents: [
    { name: "Conqueror of Evil: Tamer of Demons", image: "d/df/Talent_Conqueror_of_Evil_Tamer_of_Demons" },
    { name: "Dissolution Eon: Heaven Fall", image: "d/d8/Talent_Dissolution_Eon_Heaven_Fall" },
    { name: "Transcension: Gravity Defier", image: "4/46/Talent_Transcension_Gravity_Defier" },
  ],
  constellation: [
    { name: "Dissolution Eon: Destroyer of Worlds", image: "e/e7/Constellation_Dissolution_Eon_-_Destroyer_of_Worlds" },
    {
      name: "Annihilation Eon: Blossom of Kaleidos",
      image: "f/f7/Constellation_Annihilation_Eon_-_Blossom_of_Kaleidos",
    },
    { name: "Conqueror of Evil: Wrath Deity", image: "6/69/Constellation_Conqueror_of_Evil_-_Wrath_Deity" },
    {
      name: "Transcension: Extinction of Suffering",
      image: "2/24/Constellation_Transcension_-_Extinction_of_Suffering",
    },
    { name: "Evolution Eon: Origin of Ignorance", image: "f/f9/Constellation_Evolution_Eon_-_Origin_of_Ignorance" },
    { name: "Conqueror of Evil: Guardian Yaksha", image: "d/d7/Constellation_Conqueror_of_Evil_-_Guardian_Yaksha" },
  ],
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Increases Xiao's {Normal / Charged / Plunge Attack DMG}#[gr] by {@0}#[b,gr] and grants him an
      {Anemo Infusion}#[anemo] that cannot be overridden.
      <br />• At {A1}#[g], Xiao's {DMG}#[gr] is increased by {5%}#[b,gr], and a further {5%}#[b,gr] for every 3s the
      ability persists. Max {25%}#[r].`,
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: (obj) => {
        const [level, mult] = getEBBonus(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.attPattBonus, [...NCPA_PERCENTS], mult, obj.tracker);

        if (checkAscs[1](obj.char)) {
          applyModifier(EModSrc.A1, obj.attPattBonus, "all.pct_", 5 * (obj.inputs[0] || 0), obj.tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `Using Lemniscatic Wind Cycling increases subsequent Lemniscatic Wind Cycling {[ES] DMG}#[gr] by
      {15%}#[b,gr] for 7s. Maximum of {3}#[r] stacks.`,
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 15 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Xiao as AppCharacter;

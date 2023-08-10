import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, HEAVY_PAs } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 27.49 }, Kaveh as AppCharacter, args);
};

const Kaveh: DefaultAppCharacter = {
  code: 69,
  name: "Kaveh",
  icon: "1/1f/Kaveh_Icon",
  sideIcon: "5/5e/Kaveh_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
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
    [4982, 97, 213],
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
  bonusStat: { type: "em", value: 24 },
  activeTalents: {
    NAs: {
      name: "Schematic Setup",
    },
    ES: {
      name: "Artistic Ingenuity",
      image: "0/0b/Talent_Artistic_Ingenuity",
    },
    EB: {
      name: "Painted Dome",
      image: "2/28/Talent_Painted_Dome",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 76.19 },
      { name: "2-Hit", multFactors: 69.64 },
      { name: "3-Hit", multFactors: 84.26 },
      { name: "4-Hit", multFactors: 102.69 },
    ],
    CA: [
      { name: "Charged Attack Cyclic", multFactors: 53.15 },
      { name: "Charged Attack Final", multFactors: 96.15 },
    ],
    PA: HEAVY_PAs,
    ES: [{ name: "Skill DMG", multFactors: 204 }],
    EB: [
      { name: "Skill DMG", multFactors: 160 },
      {
        name: "Light of the Firmament (C6)",
        multFactors: { root: 61.8, scale: 0 },
        attPatt: "none",
      },
    ],
  },
  passiveTalents: [
    {
      name: "An Architect's Undertaking",
      image: "a/a6/Talent_An_Architect%27s_Undertaking",
    },
    {
      name: "A Craftsman's Curious Conceptions",
      image: "d/d1/Talent_A_Craftsman%27s_Curious_Conceptions",
    },
    { name: "The Art of Budgeting", image: "4/41/Talent_The_Art_of_Budgeting" },
  ],
  constellation: [
    {
      name: "Sublime Salutations",
      image: "1/14/Constellation_Sublime_Salutations",
    },
    {
      name: "Grace of Royal Roads",
      image: "2/28/Constellation_Grace_of_Royal_Roads",
    },
    {
      name: "Profferings of Dur Untash",
      image: "a/a7/Constellation_Profferings_of_Dur_Untash",
    },
    { name: "Feast of Apadana", image: "c/ca/Constellation_Feast_of_Apadana" },
    {
      name: "Treasures of Bonkhanak",
      image: "f/f6/Constellation_Treasures_of_Bonkhanak",
    },
    {
      name: "Pairidaeza's Dreams",
      image: "6/61/Constellation_Pairidaeza%27s_Dreams",
    },
  ],
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `• Grants {Dendro Infusion}#[dendro].
      <br />• Increases {Bloom DMG}#[gr] triggered by all party members by {@0}#[b,gr].
      <br />• At {A4}#[g], after Kaveh's Normal, Charged, and Plunging Attacks hit opponents, his
      {Elemental Mastery}#[gr] will increase by {25}#[b,gr]. Max {4}#[r] stacks.`,
      inputConfigs: [
        {
          label: "A4 stacks",
          type: "stacks",
          initialValue: 0,
          max: 4,
        },
      ],
      applyBuff: (obj) => {
        const { desc } = obj;
        const [level, mult] = getEBBonus(obj);
        applyModifier(desc + ` Lv.${level}`, obj.rxnBonus, "bloom.pct_", mult, obj.tracker);

        if (checkAscs[4](obj.char)) {
          const stacks = obj.inputs[0];
          applyModifier(`Self / ${EModSrc.A4}`, obj.totalAttr, "em", stacks * 25, obj.tracker);
        }
        if (checkCons[2](obj.char)) {
          applyModifier(`Self / ${EModSrc.C2}`, obj.totalAttr, "naAtkSpd_", 15, obj.tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.TEAMMATE,
      description: `Increases {Bloom DMG}#[gr] triggered by all party members by {@0}#[b,gr].`,
      inputConfigs: [
        {
          label: "Elemental Burst level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        applyModifier(obj.desc, obj.rxnBonus, "bloom.pct_", getEBBonus(obj)[1], obj.tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      isGranted: checkCons[4],
      description: `Dendro Cores created from {Bloom}#[gr] reactions Kaveh triggers will deal {60%}#[b,gr] more DMG when
      they burst.`,
      applyBuff: makeModApplier("rxnBonus", "bloom.pct_", 60),
    },
  ],
};

export default Kaveh as AppCharacter;

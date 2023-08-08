import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Cyno: DefaultAppCharacter = {
  code: 59,
  name: "Cyno",
  icon: "3/31/Cyno_Icon",
  sideIcon: "b/b1/Cyno_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "electro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [972, 25, 67],
    [2522, 64, 174],
    [3356, 85, 231],
    [5022, 128, 345],
    [5614, 143, 386],
    [6459, 165, 444],
    [7249, 185, 499],
    [8103, 206, 557],
    [8695, 221, 598],
    [9557, 243, 657],
    [10149, 258, 698],
    [11020, 281, 758],
    [11613, 296, 799],
    [12491, 318, 859],
  ],
  bonusStat: {
    type: "cDmg_",
    value: 9.6,
  },
  calcListConfig: {
    EB: { multScale: 7 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 49.26 },
      { name: "2-Hit", multFactors: 47.92 },
      { name: "3-Hit (1/2)", multFactors: 29.31 },
      { name: "4-Hit", multFactors: 75.89 },
    ],
    CA: [
      {
        name: "Charged Attack DMG",
        multFactors: 122.38,
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 130.4 },
      {
        id: "ES.0",
        name: "Mortuary Rite DMG",
        multFactors: 156.8,
      },
      {
        id: "ES.1",
        name: "Duststalker Bolt DMG (A1)",
        multFactors: { root: 100, scale: 0 },
      },
    ],
    EB: [
      { id: "EB.0", name: "1-Hit", attPatt: "NA", multFactors: 78.28 },
      { id: "EB.1", name: "2-Hit", attPatt: "NA", multFactors: 82.47 },
      { id: "EB.2", name: "3-Hit", attPatt: "NA", multFactors: 104.63 },
      { id: "EB.3", name: "4-Hit (1/2)", attPatt: "NA", multFactors: 51.69 },
      { id: "EB.4", name: "5-Hit", attPatt: "NA", multFactors: 130.84 },
      { name: "Charged Attack DMG", attPatt: "CA", multFactors: 101.05 },
      { name: "Plunge DMG", attPatt: "PA", multFactors: 63.93 },
      { name: "Low Plunge", attPatt: "PA", multFactors: 127.84 },
      { name: "High Plunge", attPatt: "PA", multFactors: 159.68 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Invoker's Spear",
    },
    ES: {
      name: "Secret Rite: Chasmic Soulfarer",
      image: "e/e3/Talent_Secret_Rite_Chasmic_Soulfarer",
    },
    EB: {
      name: "Sacred Rite: Wolf's Swiftness",
      image: "a/a0/Talent_Sacred_Rite_Wolf%27s_Swiftness",
    },
  },
  passiveTalents: [
    { name: "Featherfall Judgment", image: "b/b5/Talent_Featherfall_Judgment" },
    { name: "Authority Over the Nine Bows", image: "e/ed/Talent_Authority_Over_the_Nine_Bows" },
    { name: "The Gift of Silence", image: "4/4b/Talent_The_Gift_of_Silence" },
  ],
  constellation: [
    { name: "Ordinance: Unceasing Vigil", image: "2/2c/Constellation_Ordinance_Unceasing_Vigil" },
    { name: "Ceremony: Homecoming of Spirits", image: "c/cc/Constellation_Ceremony_Homecoming_of_Spirits" },
    { name: "Precept: Lawful Enforcer", image: "3/30/Constellation_Precept_Lawful_Enforcer" },
    { name: "Austerity: Forbidding Guard", image: "1/11/Constellation_Austerity_Forbidding_Guard" },
    {
      name: "Funerary Rite: The Passing of Starlight",
      image: "0/02/Constellation_Funerary_Rite_The_Passing_of_Starlight",
    },
    { name: "Raiment: Just Scales", image: "1/11/Constellation_Raiment_Just_Scales" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `• Pactsworn Pathclearer's [EB] {Normal Attack DMG}#[gr] is increased by {150%}#[b,gr] of Cyno's
      {Elemental Mastery}#[gr].
      <br />• {Duststalker Bolt DMG}#[gr] [A1] is increased by {250%}#[b,gr] of Cyno's {Elemental Mastery}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(
          exclBuff(EModSrc.A4, "ES.1", "flat", totalAttr.em * 2.5),
          exclBuff(EModSrc.A4, ["EB.0", "EB.1", "EB.2", "EB.3", "EB.4"], "flat", Math.round(totalAttr.em * 1.5))
        );
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Under Pactsworn Pathclearer state:
      <br />• Cyno's {Elemental Mastery}#[gr] is increased by {100}#[b,gr].
      <br />• Cyno gains an {Electro Infusion}#[electro] that cannot be overriden.`,
      applyBuff: makeModApplier("totalAttr", "em", 100),
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `If Cyno activates Secret Rite: Chasmic Soulfarer {[ES]}#[gr] while in Endseer stance [~EB], its
      {DMG}#[gr] will be increased by {35%}#[b,gr].`,
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A1, "ES.0", "pct_", 35));
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `After using Sacred Rite: Wolf's Swiftness, Cyno's {Normal Attack SPD}#[gr] will be increased by
      {20%}#[b,gr] for 10s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Cyno's Normal Attacks hit opponents, his {Electro DMG Bonus}#[gr] will increase by {10%}#[b,gr]
      for 4s. Max {5}#[r] stacks.`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "electro", (inputs[0] || 0) * 10, tracker);
      },
    },
  ],
};

export default Cyno as AppCharacter;

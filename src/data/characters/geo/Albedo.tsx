import type { DataCharacter } from "@Src/types";
import { Green } from "@Styled/DataDisplay";
import { EModAffect, EModifierSrc } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { MEDIUM_PA } from "../constants";
import { checkAscs, charModCtrlIsActivated, checkCons, findInput, makeTrackerDesc } from "../utils";

const Albedo: DataCharacter = {
  code: 29,
  name: "Albedo",
  icon: "0/00/Character_Albedo_Thumb",
  sideIcon: "1/12/Character_Albedo_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "geo",
  weapon: "sword",
  stats: [
    { base_hp: 1030, base_atk: 20, base_def: 68 },
    { base_hp: 2671, base_atk: 51, base_def: 177 },
    { base_hp: 3554, base_atk: 67, base_def: 235 },
    { base_hp: 5317, base_atk: 101, base_def: 352 },
    { base_hp: 5944, base_atk: 113, base_def: 394, geo_: 7.2 },
    { base_hp: 6839, base_atk: 130, base_def: 453, geo_: 7.2 },
    { base_hp: 7675, base_atk: 146, base_def: 508, geo_: 14.4 },
    { base_hp: 8579, base_atk: 163, base_def: 568, geo_: 14.4 },
    { base_hp: 9207, base_atk: 175, base_def: 610, geo_: 14.4 },
    { base_hp: 10119, base_atk: 192, base_def: 670, geo_: 14.4 },
    { base_hp: 10746, base_atk: 204, base_def: 712, geo_: 21.6 },
    { base_hp: 11669, base_atk: 222, base_def: 773, geo_: 21.6 },
    { base_hp: 12296, base_atk: 233, base_def: 815, geo_: 28.8 },
    { base_hp: 13226, base_atk: 251, base_def: 876, geo_: 28.8 },
  ],
  activeTalents: [
    {
      name: "Favonius Bladework - Weiss",
      stats: [
        { name: "1-Hit", baseMult: 36.74, multType: 1 },
        { name: "2-Hit", baseMult: 36.74, multType: 1 },
        { name: "3-Hit", baseMult: 47.45, multType: 1 },
        { name: "4-Hit", baseMult: 49.75, multType: 1 },
        { name: "5-Hit", baseMult: 62.07, multType: 1 },
        { name: "Charged Attack", baseMult: [47.3, 60.2], multType: 1 },
        ...MEDIUM_PA,
      ],
      caStamina: 20,
    },
    {
      name: "Abiogenesis: Solar Isotoma",
      image: "0/0e/Talent_Abiogenesis_Solar_Isotoma",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "elmt"],
          baseMult: 130.4,
          multType: 2,
        },
        {
          name: "Transient Blossom",
          dmgTypes: ["ES", "elmt"],
          baseStatType: "def",
          baseMult: 133.6,
          multType: 2,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            if (charModCtrlIsActivated(Albedo.buffs!, char, selfBuffCtrls, 0)) {
              return {
                pct: { desc: makeTrackerDesc(true, 1), value: 25 },
              };
            }
          },
        },
      ],
    },
    {
      name: "Rite of Progeniture: Tectonic Tide",
      image: "0/0a/Talent_Rite_of_Progeniture_Tectonic_Tide",
      xtraLvAtCons: 5,
      stats: [
        {
          name: "Burst DMG",
          dmgTypes: ["EB", "elmt"],
          baseMult: 367.2,
          multType: 2,
        },
        {
          name: "Fatal Blossom DMG",
          dmgTypes: ["EB", "elmt"],
          baseMult: 72,
          multType: 2,
        },
      ],
      energyCost: 40,
    },
  ],
  passiveTalents: [
    {
      name: "Calcite Might",
      image: "5/56/Talent_Calcite_Might",
    },
    {
      name: "Homuncular Nature",
      image: "8/80/Talent_Homuncular_Nature",
    },
    {
      name: "Flash of Genius",
      image: "3/32/Talent_Flash_of_Genius_%28Albedo%29",
    },
  ],
  constellation: [
    {
      name: "Flower of Eden",
      image: "2/29/Constellation_Flower_of_Eden",
    },
    {
      name: "Opening of Phanerozoic",
      image: "d/d8/Constellation_Opening_of_Phanerozoic",
    },
    {
      name: "Grace of Helios",
      image: "e/e8/Constellation_Grace_of_Helios",
    },
    {
      name: "Descent of Divinity",
      image: "8/8f/Constellation_Descent_of_Divinity",
    },
    {
      name: "Tide of Hadean",
      image: "a/a1/Constellation_Tide_of_Hadean",
    },
    {
      name: "Dust of Purification",
      image: "5/52/Constellation_Dust_of_Purification",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModifierSrc.A1,
      desc: () => (
        <>
          <Green>Transient Blossoms</Green> deal <Green b>25%</Green> <Green>more DMG</Green> to
          opponents whose HP is below 50%.
        </>
      ),
      affect: EModAffect.SELF,
      isGranted: checkAscs[1],
    },
    {
      index: 1,
      src: EModifierSrc.A4,
      desc: () => (
        <>
          Using Rite of Progeniture: Tectonic Tide increases the <Green>Elemental Mastery</Green> of
          nearby party members by <Green b>125</Green> for 10s.
        </>
      ),
      affect: EModAffect.PARTY,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttrs", "em", 125),
    },
    {
      index: 2,
      src: EModifierSrc.C2,
      desc: () => (
        <>
          Unleashing Rite of Progeniture: Tectonic Tide consumes all stacks of Fatal Reckoning. Each
          stack consumed increases the DMG dealt by <Green>Fatal Blossoms</Green> and{" "}
          <Green>Rite of Progeniture: Tectonic Tide's burst DMG</Green> by <Green b>30%</Green> of
          Albedo's <Green>DEF</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Stacks"],
        initialValues: [1],
        renderTypes: ["select"],
        maxs: [4],
      },
      applyFinalBuff: ({ totalAttrs, skillBonuses, charBuffCtrls, desc, tracker }) => {
        const bnValue = totalAttrs.def * 0.3 * +findInput(charBuffCtrls, 2, 0, 0);
        applyModifier(desc, skillBonuses, "EB.flat", Math.round(bnValue), tracker);
      },
    },
    {
      index: 3,
      src: EModifierSrc.C4,
      desc: () => (
        <>
          Active party members within the Solar Isotoma field have their{" "}
          <Green>Plunging Attack DMG</Green> increased by <Green b>30%</Green>.
        </>
      ),
      affect: EModAffect.PARTY,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("skillBonuses", "PA.pct", 30),
    },
    {
      index: 4,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          Active party members within the Solar Isotoma field who are protected by a shield created
          by Crystallize have their <Green>DMG</Green> increased by <Green b>17%</Green>.
        </>
      ),
      affect: EModAffect.PARTY,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("skillBonuses", "all.pct", 17),
    },
  ],
};

export default Albedo;

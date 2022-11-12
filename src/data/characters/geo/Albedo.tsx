import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { MEDIUM_PAs, EModSrc } from "../constants";
import { checkAscs, charModIsInUse, checkCons, findInput, talentBuff } from "../utils";

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
    [1030, 20, 68],
    [2671, 51, 177],
    [3554, 67, 235],
    [5317, 101, 352],
    [5944, 113, 394],
    [6839, 130, 453],
    [7675, 146, 508],
    [8579, 163, 568],
    [9207, 175, 610],
    [10119, 192, 670],
    [10746, 204, 712],
    [11669, 222, 773],
    [12296, 233, 815],
    [13226, 251, 876],
  ],
  bonusStat: { type: "geo", value: 7.2 },
  NAsConfig: {
    name: "Favonius Bladework - Weiss",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 36.74 },
        { name: "2-Hit", multBase: 36.74 },
        { name: "3-Hit", multBase: 47.45 },
        { name: "4-Hit", multBase: 49.75 },
        { name: "5-Hit", multBase: 62.07 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: [47.3, 60.2] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Abiogenesis: Solar Isotoma",
      image: "0/0e/Talent_Abiogenesis_Solar_Isotoma",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", multBase: 130.4 },
        {
          name: "Transient Blossom",
          baseStatType: "def",
          multBase: 133.6,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const A1isInUse = charModIsInUse(Albedo.buffs!, char, selfBuffCtrls, 0);
            return talentBuff([A1isInUse, "pct", [true, 1], 25]);
          },
        },
      ],
      // getExtraStats: (lv) => [
      //   { name: "Duration", value: "30s" },
      //   { name: "CD", value: "4s" }
      // ]
    },
    EB: {
      name: "Rite of Progeniture: Tectonic Tide",
      image: "0/0a/Talent_Rite_of_Progeniture_Tectonic_Tide",
      xtraLvAtCons: 5,
      stats: [
        { name: "Burst DMG", multBase: 367.2 },
        { name: "Fatal Blossom DMG", multBase: 72 },
      ],
      // getExtraStats: (lv) => [{ name: "CD", value: "12s" }],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Calcite Might", image: "5/56/Talent_Calcite_Might" },
    { name: "Homuncular Nature", image: "8/80/Talent_Homuncular_Nature" },
    { name: "Flash of Genius", image: "3/32/Talent_Flash_of_Genius_%28Albedo%29" },
  ],
  constellation: [
    { name: "Flower of Eden", image: "2/29/Constellation_Flower_of_Eden" },
    { name: "Opening of Phanerozoic", image: "d/d8/Constellation_Opening_of_Phanerozoic" },
    { name: "Grace of Helios", image: "e/e8/Constellation_Grace_of_Helios" },
    { name: "Descent of Divinity", image: "8/8f/Constellation_Descent_of_Divinity" },
    { name: "Tide of Hadean", image: "a/a1/Constellation_Tide_of_Hadean" },
    { name: "Dust of Purification", image: "5/52/Constellation_Dust_of_Purification" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
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
      src: EModSrc.A4,
      desc: () => (
        <>
          Using Rite of Progeniture: Tectonic Tide [EB] increases the{" "}
          <Green>Elemental Mastery</Green> of nearby party members by <Green b>125</Green> for 10s.
        </>
      ),
      affect: EModAffect.PARTY,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "em", 125),
    },
    {
      index: 2,
      src: EModSrc.C2,
      desc: () => (
        <>
          Transient Blossoms grant Albedo Fatal Reckoning for 30s. Unleashing Rite of Progeniture:
          Tectonic Tide consumes all stacks of Fatal Reckoning. Each stack consumed increases the
          DMG dealt by <Green>Fatal Blossoms</Green> and{" "}
          <Green>Rite of Progeniture: Tectonic Tide's burst DMG</Green> by <Green b>30%</Green> of
          Albedo's <Green>DEF</Green>. This effect stacks up to <Green b>4</Green> times.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyFinalBuff: ({ totalAttr, attPattBonus, charBuffCtrls, desc, tracker }) => {
        const buffValue = totalAttr.def * 0.3 * +findInput(charBuffCtrls, 2, 0, 0);
        applyModifier(desc, attPattBonus, "EB.flat", Math.round(buffValue), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      desc: () => (
        <>
          Active party members within the Solar Isotoma [ES] field have their{" "}
          <Green>Plunging Attack DMG</Green> increased by <Green b>30%</Green>.
        </>
      ),
      affect: EModAffect.ACTIVE_UNIT,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "PA.pct", 30),
    },
    {
      index: 4,
      src: EModSrc.C6,
      desc: () => (
        <>
          Active party members within the Solar Isotoma [ES] field who are protected by a shield
          created by Crystallize have their <Green>DMG</Green> increased by <Green b>17%</Green>.
        </>
      ),
      affect: EModAffect.ACTIVE_UNIT,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "all.pct", 17),
    },
  ],
};

export default Albedo;

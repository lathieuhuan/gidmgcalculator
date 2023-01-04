import type { DataCharacter } from "@Src/types";
import { Green, Hydro, Lightgold } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Candace: DataCharacter = {
  code: 58,
  name: "Candace",
  icon: "b/bf/Character_Candace_Thumb",
  sideIcon: "9/95/Character_Candace_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "hydro",
  weaponType: "polearm",
  stats: [
    [912, 18, 57],
    [2342, 46, 147],
    [3024, 59, 190],
    [4529, 88, 284],
    [5013, 98, 315],
    [5766, 113, 362],
    [6411, 125, 402],
    [7164, 140, 450],
    [7648, 149, 480],
    [8401, 164, 527],
    [8885, 174, 558],
    [9638, 188, 605],
    [10122, 198, 635],
    [10875, 212, 683],
  ],
  bonusStat: { type: "hp_", value: 6 },
  NAsConfig: {
    name: "Gleaming Spear - Guardian Stance",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 60.8 },
        { name: "2-Hit", multFactors: 61.15 },
        { name: "3-Hit", multFactors: [35.49, 43.37] },
        { name: "4-Hit", multFactors: 94.94 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack DMG", multFactors: 124.18 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Sacred Rite: Heron's Sanctum",
      image: "5/5d/Talent_Sacred_Rite_Heron%27s_Sanctum",
      xtraLvAtCons: 5,
      stats: [
        {
          name: "Shield DMG Absorption",
          multFactors: 12,
          flatFactor: 1156,
        },
        { name: "Basic DMG", multFactors: 12 },
        { name: "Charged Up DMG", multFactors: 19.04 },
      ],
      multAttributeType: "hp",
    },
    EB: {
      name: "Sacred Rite: Wagtail's Tide",
      image: "1/1a/Talent_Sacred_Rite_Wagtail%27s_Tide",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", multFactors: 6.61 },
        { name: "Wave Impact DMG", multFactors: 6.61 },
        {
          name: "Wave DMG (C6)",
          multFactors: { root: 15, scale: 0 },
        },
      ],
      multAttributeType: "hp",
      // getExtraStats: () => [
      //   { name: "Wave Instances", value: 3 },
      //   { name: "Duration", value: "9s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    {
      name: "Featherflow Guard",
      image: "3/33/Talent_Aegis_of_Crossed_Arrows",
      desc: (
        <>
          If Candace is hit by an attack in the Hold duration of Sacred Rite: Heron's Sanctum, that
          skill will finish charging instantly.
        </>
      ),
    },
    {
      name: "Celestial Dome of Sand",
      image: "8/86/Talent_Celestial_Dome_of_Sand",
      desc: (
        <>
          Characters affected by the Prayer of the Crimson Crown caused by Sacred Rite: Wagtail's
          Tide will deal <Green b>0.5%</Green> <Green>increased DMG</Green> to opponents for every
          1,000 points of Candace's Max HP when they deal Elemental DMG with their{" "}
          <Green>Normal Attacks</Green>.
        </>
      ),
    },
    { name: "To Dawn's First Light", image: "a/a6/Talent_To_Dawn%27s_First_Light" },
  ],
  constellation: [
    {
      name: "Returning Heir of the Scarlet Sands",
      image: "1/1d/Constellation_Returning_Heiress_of_the_Scarlet_Sands",
      desc: (
        <>
          The <Green>duration</Green> of Prayer of the Crimson Crown effect triggered by Sacred
          Rite: Wagtail's Tide is increased by <Green b>3s</Green>.
        </>
      ),
    },
    {
      name: "Moon-Piercing Brilliance",
      image: "3/3b/Constellation_Moon-Piercing_Brilliance",
      desc: (
        <>
          When Sacred Rite: Heron's Guard hits opponents, Candace's <Green>Max HP</Green> will be
          increased by <Green>20%</Green> for 15s.
        </>
      ),
    },
    { name: "Hunter's Supplication", image: "f/f2/Constellation_Hunter%27s_Supplication" },
    {
      name: "Sentinel Oath",
      image: "b/b7/Constellation_Sentinel_Oath",
      desc: (
        <>
          Shortens the Hold CD of Sacred Rite: Heron's Guard to be the same as that of the Tapping
          CD.
        </>
      ),
    },
    { name: "Golden Eye", image: "f/fc/Constellation_Heterochromatic_Gaze" },
    {
      name: "The Overflow",
      image: "e/ec/Constellation_The_Overflow",
      desc: (
        <>
          When characters (excluding Candace herself) affected by the Prayer of the Crimson Crown
          caused by Sacred Rite: Wagtail's Tide deal Elemental DMG to opponents using normal
          Attacks, an attack wave will be unleashed that deals AoE <Hydro>Hydro DMG</Hydro> equal to{" "}
          <Green b>15%</Green> of Candace's <Green>Max HP</Green>. <br />
          This effect can trigger once every 2.3s and is considered Elemental Burst DMG.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      desc: () => (
        <>
          Prayer of the Crimson Crown [EB] has the following properties:
          <br />• Characters deal <Green b>20%</Green> increased Elemental DMG with their{" "}
          <Green>Normal Attacks</Green>.
          <br />• At <Lightgold>A4</Lightgold>, increases the above bonus by <Green b>0.5%</Green>{" "}
          for every 1,000 points of Candace's <Green>Max HP</Green>.
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfigs: [
        {
          label: "Max HP (A4)",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: ({ toSelf, char, totalAttr, attPattBonus, inputs, desc, tracker }) => {
        const maxHP = toSelf && checkAscs[4](char) ? totalAttr.hp : !toSelf ? inputs[0] || 0 : 0;
        applyModifier(desc, attPattBonus, "NA.pct", 20 + (maxHP / 1000) * 0.5, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      desc: () => Candace.constellation[1].desc,
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "hp_", 20),
    },
  ],
};

export default Candace;

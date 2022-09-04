import type { DataCharacter } from "@Src/types";
import { Green, Hydro } from "@Src/styled-components";
import { EModAffect, NORMAL_ATTACKS } from "@Src/constants";
import { EModifierSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, getInput, makeModApplier } from "@Src/calculators/utils";
import { checkAscs, checkCons, talentBuff } from "../utils";

import candaceImg from "@Src/assets/images/candace.png";

const Candace: DataCharacter = {
  code: 58,
  beta: true,
  name: "Candace",
  icon: candaceImg,
  sideIcon: "",
  rarity: 4,
  nation: "sumeru",
  vision: "hydro",
  weapon: "polearm",
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
        { name: "1-Hit", baseMult: 60.8 },
        { name: "2-Hit", baseMult: 61.15 },
        { name: "3-Hit", baseMult: [35.49, 43.37] },
        { name: "4-Hit", baseMult: 94.94 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack DMG", baseMult: 124.18 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Sacred Rite: Heron's Sanctum",
      image: "",
      xtraLvAtCons: 5,
      stats: [
        {
          name: "Shield DMG Absorption",
          baseStatType: "hp",
          baseMult: 12,
          multType: 2,
          flat: { base: 1156, type: 3 },
        },
        { name: "Basic DMG", baseStatType: "hp", baseMult: 12.43 },
        { name: "Charged Up DMG", baseStatType: "hp", baseMult: 20.43 },
      ],
    },
    EB: {
      name: "Sacred Rite: Wagtail's Tide",
      image: "",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", baseStatType: "hp", baseMult: 6.61 },
        { name: "Wave Impact DMG", baseStatType: "hp", baseMult: 6.61 },
        {
          name: "Wave DMG (C6)",
          baseStatType: "hp",
          baseMult: 0,
          getTalentBuff: ({ char }) => talentBuff([checkCons[6](char), "mult", [false, 6], 15]),
        },
      ],
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
      image: "",
      desc: (
        <>
          If Candace is hit by an attack in the Hold duration of Sacred Rite: Heron's Sanctum, that
          skill will finish charging instantly.
        </>
      ),
    },
    {
      name: "Sand Arch",
      image: "",
      desc: (
        <>
          Characters affected by the Prayer of the Crimson Crown caused by Sacred Rite: Wagtail's
          Tide will deal <Green b>0.5%</Green> <Green>increased DMG</Green> to opponents for every
          1,000 points of Candace's Max HP when they deal Elemental DMG with their{" "}
          <Green>Normal Attacks</Green>.
        </>
      ),
    },
    { name: "To Dawn's First Light", image: "" },
  ],
  constellation: [
    {
      name: "Returning Heir of the Scarlet Sands",
      image: "",
      desc: (
        <>
          The <Green>duration</Green> of Prayer of the Crimson Crown effect triggered by Sacred
          Rite: Wagtail's Tide is increased by <Green b>3s</Green>.
        </>
      ),
    },
    {
      name: "Moon-Piercing Brilliance",
      image: "",
      desc: (
        <>
          When Sacred Rite: Heron's Guard hits opponents, Candace's <Green>Max HP</Green> will be
          increased by <Green>20%</Green> for 15s.
        </>
      ),
    },
    { name: "Hunter's Supplication", image: "" },
    {
      name: "Sentinel Oath",
      image: "",
      desc: (
        <>
          Shortens the Hold CD of Sacred Rite: Heron's Guard to be the same as that of the Tapping
          CD.
        </>
      ),
    },
    { name: "Golden Eye", image: "" },
    {
      name: "The Overflow",
      image: "",
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
      src: EModifierSrc.EB,
      desc: () => (
        <>
          Prayer of the Crimson Crown has the following properties:
          <br />• Characters deal <Green b>20%</Green> increased Elemental DMG with their{" "}
          <Green>Normal Attacks</Green>.
          <br />• Active Sword, Claymore, and Polearm-wielding character(s) under this effect will
          obtain a <Hydro>Hydro Infusion</Hydro>.
        </>
      ),
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("attPattBonus", "NA.pct", 20),
      infuseConfig: {
        appliable: ({ weapon }) => ["sword", "claymore", "polearm"].includes(weapon),
        range: [...NORMAL_ATTACKS],
        overwritable: true,
      },
    },
    {
      index: 1,
      src: EModifierSrc.A4,
      desc: () => Candace.passiveTalents[1].desc,
      isGranted: checkAscs[4],
      affect: EModAffect.PARTY,
      inputConfig: {
        labels: ["Max HP"],
        renderTypes: ["text"],
        initialValues: [912],
        maxValues: [99999],
      },
      applyFinalBuff: ({ toSelf, totalAttr, attPattBonus, inputs, desc, tracker }) => {
        const maxHP = toSelf ? totalAttr.hp : getInput(inputs, 0, 0);
        applyModifier(desc, attPattBonus, "NA.pct", (maxHP / 1000) * 0.5, tracker);
      },
    },
    {
      index: 2,
      src: EModifierSrc.C2,
      desc: () => Candace.constellation[1].desc,
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "hp_", 20),
    },
  ],
};

export default Candace;

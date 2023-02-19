import type { DataCharacter, GetTalentBuffFn } from "@Src/types";
import { Electro, Green, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { charModIsInUse, checkAscs, checkCons, talentBuff } from "../utils";

const getA4talentBuff: GetTalentBuffFn = ({ char, totalAttr }) => {
  return talentBuff([checkAscs[4](char), "flat", [true, 4], Math.round(totalAttr.em * 1.5)]);
};

const Cyno: DataCharacter = {
  code: 59,
  name: "Cyno",
  // icon: "d/d1/Character_Cyno_Thumb",
  icon: "3/31/Cyno_Icon",
  sideIcon: "d/de/Character_Cyno_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "electro",
  weaponType: "polearm",
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
  bonusStat: { type: "cDmg_", value: 9.6 },
  NAsConfig: {
    name: "Invoker's Spear",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 49.26 },
        { name: "2-Hit", multFactors: 47.92 },
        { name: "3-Hit (1/2)", multFactors: 29.31 },
        { name: "4-Hit", multFactors: 75.89 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack DMG", multFactors: 122.38 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Secret Rite: Chasmic Soulfarer",
      image: "e/e3/Talent_Secret_Rite_Chasmic_Soulfarer",
      stats: [
        {
          name: "Skill DMG",
          multFactors: 130.4,
        },
        {
          name: "Mortuary Rite DMG",
          multFactors: 156.8,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const A1isInUse = charModIsInUse(Cyno.buffs!, char, selfBuffCtrls, 1);
            return talentBuff([A1isInUse, "pct", [true, 1], 35]);
          },
        },
        {
          name: "Duststalker Bolt DMG (A1)",
          multFactors: { root: 100, scale: 0 },
          getTalentBuff: ({ char, totalAttr }) => {
            return talentBuff([checkAscs[4](char), "flat", [true, 4], totalAttr.em * 2.5]);
          },
        },
      ],
    },
    EB: {
      name: "Sacred Rite: Wolf's Swiftness",
      image: "a/a0/Talent_Sacred_Rite_Wolf%27s_Swiftness",
      stats: [
        {
          name: "1-Hit",
          attPatt: "NA",
          multFactors: 78.28,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "2-Hit",
          attPatt: "NA",
          multFactors: 82.47,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "3-Hit",
          attPatt: "NA",
          multFactors: 104.63,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "4-Hit (1/2)",
          attPatt: "NA",
          multFactors: 51.69,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "5-Hit",
          attPatt: "NA",
          multFactors: 130.84,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "Charged Attack DMG",
          attPatt: "CA",
          multFactors: 101.05,
        },
        { name: "Plunge DMG", attPatt: "PA", multFactors: 63.93 },
        { name: "Low Plunge", attPatt: "PA", multFactors: 127.84 },
        { name: "High Plunge", attPatt: "PA", multFactors: 159.68 },
      ],
      multScale: 7,
      // getExtraStats: () => [
      //   { name: "Elemental Mastery Bonus", value: 100 },
      //   { name: "Basic Duration", value: "10s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "Featherfall Judgment",
      image: "b/b5/Talent_Featherfall_Judgment",
      get desc() {
        return (
          <>
            {this.xtraDesc![0]}, and firing off 3 Duststalker Bolts that deal 100% of Cyno's ATK as
            Electro DMG.
            <br />
            Duststalker Bolt DMG is considered Elemental Skill DMG.
          </>
        );
      },
      xtraDesc: [
        <>
          When Cyno is in the Pactsworn Pathclearer state, he will enter the Endseer stance at
          intervals. If he activates Secret Rite: Chasmic Soulfarer <Green>[ES]</Green> whle
          affected by this stance, its <Green>DMG</Green> will be increased by <Green b>35%</Green>
        </>,
      ],
    },
    {
      name: "Authority Over the Nine Bows",
      image: "e/ed/Talent_Authority_Over_the_Nine_Bows",
      desc: (
        <>
          • Pactsworn Pathclearer's [EB] <Green>Normal Attack DMG</Green> is increased by{" "}
          <Green b>150%</Green> of Cyno's <Green>Elemental Mastery</Green>.
          <br />• <Green>Duststalker Bolt DMG</Green> [A1] is increased by <Green b>250%</Green> of
          Cyno's <Green>Elemental Mastery</Green>.
        </>
      ),
    },
    { name: "The Gift of Silence", image: "4/4b/Talent_The_Gift_of_Silence" },
  ],
  constellation: [
    {
      name: "Ordinance: Unceasing Vigil",
      image: "2/2c/Constellation_Ordinance_Unceasing_Vigil",
      get desc() {
        return (
          <>
            {this.xtraDesc![0]} If the Judication effect of the Ascension Talent Featherfall
            Judgment is triggered during Secret Rite: Chasmic Soulfarer, the duration of this
            increase will be refreshed.
            <br />
            You need to unlock the Passive Talent "Featherfall Judgment."
          </>
        );
      },
      xtraDesc: [
        <>
          After using Sacred Rite: Wolf's Swiftness, Cyno's <Green>Normal Attack SPD</Green> will be
          increased by <Green b>20%</Green> for 10s.
        </>,
      ],
    },
    {
      name: "Ceremony: Homecoming of Spirits",
      image: "c/cc/Constellation_Ceremony_Homecoming_of_Spirits",
      desc: (
        <>
          When Cyno's Normal Attacks hit opponents, his <Green>Electro DMG Bonus</Green> will
          increase by <Green b>10%</Green> for 4s. This effect can be triggered once every 0.1s. Max{" "}
          <Rose>5</Rose> stacks.
        </>
      ),
    },
    { name: "Precept: Lawful Enforcer", image: "3/30/Constellation_Precept_Lawful_Enforcer" },
    {
      name: "Austerity: Forbidding Guard",
      image: "1/11/Constellation_Austerity_Forbidding_Guard",
      desc: (
        <>
          When Cyno is in the Pactsworn Pathclearer state, after he triggers Electro-Charged,
          Overloaded, Quicken, Hyperbloom, an Electro Swirl or an Electro Crystallization reaction,
          he will restore 3 Elemental Energy for all nearby party members (except himself).
          <br />
          This effect can occur 5 times within one use of Sacred Rite: Wolf's Swiftness.
        </>
      ),
    },
    {
      name: "Funerary Rite: The Passing of Starlight",
      image: "0/02/Constellation_Funerary_Rite_The_Passing_of_Starlight",
    },
    {
      name: "Raiment: Just Scales",
      image: "1/11/Constellation_Raiment_Just_Scales",
      desc: (
        <>
          After using Sacred Rite: Wolf's Swiftness or triggering Judication, Cyno will gain{" "}
          <Green b>4</Green> <Green>stacks</Green> of the "Day of the Jackal" effect. When he hits
          opponents with Normal Attacks, he will consume 1 stack of "Day of the Jackal" to trigger
          one Duststalker Bolt. Day of the Jackal lasts for 8s. Max <Rose>8</Rose> stacks. 1 stack
          can be consumed every 0.4s. This effect will be canceled once Pactsworn Pathclearer ends.
          <br />
          You must unlock the Passive Talent "Featherfall Judgment."
        </>
      ),
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => Cyno.passiveTalents[1].desc,
      isGranted: checkAscs[4],
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Under Pactsworn Pathclearer state:
          <br />• Cyno's <Green>Elemental Mastery</Green> is increased by <Green b>100</Green>.
          <br />• Cyno gains an <Electro>Electro Infusion</Electro> that cannot be overriden.
        </>
      ),
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
      desc: () => Cyno.passiveTalents[0].xtraDesc?.[0],
      isGranted: checkAscs[1],
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => Cyno.constellation[0].xtraDesc?.[0],
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => Cyno.constellation[1].desc,
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

export default Cyno;

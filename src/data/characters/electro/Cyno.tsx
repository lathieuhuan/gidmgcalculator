import type { DataCharacter, GetTalentBuffFn } from "@Src/types";
import { Electro, Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { charModIsInUse, checkAscs, checkCons, talentBuff } from "../utils";

const getA4talentBuff: GetTalentBuffFn = ({ char, totalAttr }) => {
  return talentBuff([checkAscs[4](char), "flat", [true, 4], Math.round(totalAttr.em * 1.5)]);
};

const Cyno: DataCharacter = {
  code: 59,
  name: "Cyno",
  icon: "d/d1/Character_Cyno_Thumb",
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
  bonusStat: { type: "cDmg", value: 9.6 },
  NAsConfig: {
    name: "Invoker's Spear",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 49.26 },
        { name: "2-Hit", multBase: 47.92 },
        { name: "3-Hit (1/2)", multBase: 29.31 },
        { name: "4-Hit", multBase: 75.89 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack DMG", multBase: 122.38 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Secret Rite: Chasmic Soulfarer",
      image: "e/e3/Talent_Secret_Rite_Chasmic_Soulfarer",
      xtraLvAtCons: 5,
      stats: [
        {
          name: "Skill DMG",
          multBase: 130.4,
        },
        {
          name: "Mortuary Rite DMG",
          multBase: 156.8,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const A1isInUse = charModIsInUse(Cyno.buffs!, char, selfBuffCtrls, 1);
            return talentBuff([A1isInUse, "pct", [true, 1], 35]);
          },
        },
        {
          name: "Duststalker Bolt DMG (A1)",
          multBase: 100,
          multType: 0,
          getTalentBuff: ({ char, totalAttr }) => {
            return talentBuff([checkAscs[4](char), "flat", [true, 4], totalAttr.em * 2.5]);
          },
        },
      ],
    },
    EB: {
      name: "Sacred Rite: Wolf's Swiftness",
      image: "a/a0/Talent_Sacred_Rite_Wolf%27s_Swiftness",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "1-Hit",
          attPatt: "NA",
          multBase: 78.28,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "2-Hit",
          attPatt: "NA",
          multBase: 82.47,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "3-Hit",
          attPatt: "NA",
          multBase: 104.63,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "4-Hit (1/2)",
          attPatt: "NA",
          multBase: 51.69,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "5-Hit",
          attPatt: "NA",
          multBase: 130.84,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "Charged Attack DMG",
          attPatt: "CA",
          multBase: 101.05,
          multType: 7,
        },
        { name: "Plunge DMG", attPatt: "PA", multBase: 63.93, multType: 7 },
        { name: "Low Plunge", attPatt: "PA", multBase: 127.84, multType: 7 },
        { name: "High Plunge", attPatt: "PA", multBase: 159.68, multType: 7 },
      ],
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
          When Cyno is in the Pactsworn Pathclearer state activated by Sacred Rite: Wolf's
          Swiftness, Cyno will enter the Endseer stance at intervals. If he activates Secret Rite:
          Chasmic Soulfarer whle affected by this stance, he will activate the Judication effect,
          increasing the <Green>DMG</Green> of this <Green>Secret Rite: Chasmic Soulfarer</Green> by{" "}
          <Green b>35%</Green>
        </>,
      ],
    },
    {
      name: "Authority Over the Nine Bows",
      image: "e/ed/Talent_Authority_Over_the_Nine_Bows",
      desc: (
        <>
          Cyno's DMG values will be increased based on his Elemental Mastery as follows:
          <br />• Pactsworn Pathclearer's <Green>Normal Attack DMG</Green> is increased by{" "}
          <Green b>150%</Green> of his <Green>Elemental Mastery</Green>.
          <br />• <Green>Duststalker Bolt DMG</Green> from his Ascension Talent Featherfall Judgment
          is increased by <Green b>250%</Green> of his <Green>Elemental Mastery</Green>.
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
          <Green b>5</Green> <Green>stacks</Green>.
        </>
      ),
    },
    { name: "Precept: Lawful Enforcer", image: "3/30/Constellation_Precept_Lawful_Enforcer" },
    {
      name: "Austerity: Forbidding Guard",
      image: "1/11/Constellation_Austerity_Forbidding_Guard",
      desc: (
        <>
          When Cyno is in the Pactsworn Pathclearer state triggered by Sacred Rite: Wolf's
          Swiftness, after he triggers Electro-Charged, Overloaded, Quicken, Hyperbloom, an Electro
          Swirl or an Electro Crystallization reaction, he will restore 3 Elemental Energy for all
          nearby party members (except himself).
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
          one Duststalker Bolt. Day of the Jackal lasts for 8s. Max <Green b>8</Green>{" "}
          <Green>stacks</Green>. 1 stack can be consumed every 0.4s. This effect will be canceled
          once Pactsworn Pathclearer ends.
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
      desc: () => (
        <>
          Under Pactsworn Pathclearer state:
          <br />• Cyno's <Green>Elemental Mastery</Green> is increased by <Green b>100</Green>.
          <br />• Cyno's <Green>Normal, Charged, and Plunging Attacks</Green> will be converted to{" "}
          <Electro>Electro DMG</Electro> that cannot be overriden.
        </>
      ),
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "em", 100),
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      desc: () => Cyno.passiveTalents[0].xtraDesc?.[0],
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
    },
    {
      index: 3,
      src: EModSrc.C1,
      desc: () => Cyno.constellation[0].xtraDesc?.[0],
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "naAtkSpd", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      desc: () => Cyno.constellation[1].desc,
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
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

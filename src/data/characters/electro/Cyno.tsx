import type { DataCharacter, GetTalentBuffFn } from "@Src/types";
import { Electro, Green } from "@Src/styled-components";
import { EModAffect, NORMAL_ATTACKS } from "@Src/constants";
import { EModifierSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, getInput, makeModApplier } from "@Src/calculators/utils";
import { charModCtrlIsActivated, checkAscs, checkCons, talentBuff } from "../utils";

import cynoImg from "@Src/assets/images/cyno.png";

const getA1TalentBuff: GetTalentBuffFn = ({ char, selfBuffCtrls }) =>
  talentBuff([charModCtrlIsActivated(Cyno.buffs!, char, selfBuffCtrls, 1), "pct", [true, 1], 35]);

const getA4talentBuff: GetTalentBuffFn = ({ char, selfBuffCtrls, totalAttr }) => {
  const isActivated = charModCtrlIsActivated(Cyno.buffs!, char, selfBuffCtrls, 2);

  return talentBuff([isActivated, "flat", [true, 4], Math.round(totalAttr.em * 1.25)]);
};

const Cyno: DataCharacter = {
  code: 59,
  beta: true,
  name: "Cyno",
  icon: cynoImg,
  sideIcon: "",
  rarity: 5,
  nation: "sumeru",
  vision: "electro",
  weapon: "polearm",
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
        { name: "1-Hit", baseMult: 49.26 },
        { name: "2-Hit", baseMult: 47.92 },
        { name: "3-Hit (1/2)", baseMult: 29.31 },
        { name: "4-Hit", baseMult: 75.89 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack DMG", baseMult: 116.1 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Secret Rite: Chasmic Soulfarer",
      image: "",
      xtraLvAtCons: 5,
      stats: [
        {
          name: "Skill DMG",
          baseMult: 130.4,
          getTalentBuff: getA1TalentBuff,
        },
        {
          name: "Mortuary Rite DMG",
          baseMult: 156.8,
          getTalentBuff: getA1TalentBuff,
        },
        {
          name: "Duststalker Bolt DMG (A1)",
          baseMult: 0,
          conditional: true,
          getTalentBuff: ({ char, selfBuffCtrls, totalAttr }) => {
            const A4isActivated = charModCtrlIsActivated(Cyno.buffs!, char, selfBuffCtrls, 2);

            return talentBuff(
              [checkAscs[1](char), "mult", [true, 1], 50],
              [A4isActivated, "flat", [true, 4], totalAttr.em * 2.5]
            );
          },
        },
      ],
    },
    EB: {
      name: "Sacred Rite: Wolf's Swiftness",
      image: "",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "electro"],
          baseMult: 78.28,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "electro"],
          baseMult: 82.47,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "electro"],
          baseMult: 104.63,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "electro"],
          baseMult: 51.69,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "electro"],
          baseMult: 130.84,
          multType: 7,
          getTalentBuff: getA4talentBuff,
        },
        {
          name: "Charged Attack DMG",
          dmgTypes: ["CA", "electro"],
          baseMult: 101.05,
          multType: 7,
        },
        { name: "Plunge DMG", dmgTypes: ["CA", "electro"], baseMult: 63.93, multType: 7 },
        { name: "Low Plunge", dmgTypes: ["CA", "electro"], baseMult: 127.84, multType: 7 },
        { name: "High Plunge", dmgTypes: ["CA", "electro"], baseMult: 159.68, multType: 7 },
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
      image: "",
      get desc() {
        return (
          <>
            {this.xtraDesc![0]}, and firing off 3 Duststalker Bolts that deal 50% of Cyno's ATK as
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
      image: "",
      desc: (
        <>
          Cyno's DMG values will be increased based on his Elemental Mastery as follows:
          <br />• Pactsworn Pathclearer's <Green>Normal Attack DMG</Green> is increased by{" "}
          <Green b>125%</Green> of his <Green>Elemental Mastery</Green>.
          <br />• <Green>Duststalker Bolt DMG</Green> from his Ascension Talent Featherfall Judgment
          is increased by <Green b>250%</Green> of his <Green>Elemental Mastery</Green>.
        </>
      ),
    },
    { name: "The Gift of Silence", image: "" },
  ],
  constellation: [
    {
      name: "Ordinance: Unceasing Vigil",
      image: "",
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
      image: "",
      desc: (
        <>
          When Cyno's Normal Attacks hit opponents, his <Green>Normal Attack CRIT Rate</Green> and{" "}
          <Green>CRIT DMG</Green> will be increased by <Green b>3%</Green> and <Green b>6%</Green>{" "}
          respectively for 4s. This effect can be triggered once every 0.1s. Max <Green>5</Green>{" "}
          <Green>stacks</Green>. Each stack's duration is counted independently.
        </>
      ),
    },
    { name: "Precept: Lawful Enforcer", image: "" },
    {
      name: "Austerity: Forbidding Guard",
      image: "",
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
    { name: "Funerary Rite: The Passing of Starlight", image: "" },
    {
      name: "Raiment: Just Scales",
      image: "",
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
  buffs: [
    {
      index: 0,
      src: EModifierSrc.EB,
      desc: () => (
        <>
          Pactsworn Pathclearer state:
          <br />• Cyno's <Green>Elemental Mastery</Green> and increase by <Green b>100</Green>.
          <br />• Cyno's <Green>Normal, Charged, and Plunging Attacks</Green> will be converted to{" "}
          <Electro>Electro DMG</Electro> that cannot be overriden.
        </>
      ),
      isGranted: () => true,
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "em", 100),
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModifierSrc.A1,
      desc: () => Cyno.passiveTalents[0].xtraDesc?.[0],
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
    },
    {
      index: 2,
      src: EModifierSrc.A4,
      desc: () => Cyno.passiveTalents[1].desc,
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
    },
    {
      index: 3,
      src: EModifierSrc.C1,
      desc: () => Cyno.constellation[0].xtraDesc?.[0],
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "naAtkSpd", 20),
    },
    {
      index: 4,
      src: EModifierSrc.C2,
      desc: () => Cyno.constellation[1].desc,
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [5],
      },
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const stacks = getInput(inputs, 0, 0);
        const buffValue = [stacks * 3, stacks * 6];
        applyModifier(desc, totalAttr, ["cRate", "cDmg"], buffValue, tracker);
      },
    },
  ],
};

export default Cyno;

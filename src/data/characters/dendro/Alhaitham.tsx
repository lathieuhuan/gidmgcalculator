import type { DataCharacter } from "@Src/types";
import { Dendro, Green, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyModifier } from "@Src/utils/calculation";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Alhaitham: DataCharacter = {
  code: 65,
  beta: true,
  name: "Alhaitham",
  icon: "alhaithamImg",
  sideIcon: "",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "sword",
  stats: [
    [1039, 24, 61],
    [2695, 63, 158],
    [3586, 84, 210],
    [5366, 126, 314],
    [5999, 141, 351],
    [6902, 162, 404],
    [7747, 182, 454],
    [8659, 203, 507],
    [9292, 218, 544],
    [10213, 240, 598],
    [10846, 255, 635],
    [11777, 276, 690],
    [12410, 291, 727],
    [13348, 313, 782],
  ],
  bonusStat: { type: "dendro", value: 7.2 },
  NAsConfig: {
    name: "Abductive Reasoning",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 49.53 },
        { name: "2-Hit", multFactors: 50.75 },
        { name: "3-Hit (1/2)", multFactors: 34.18 },
        { name: "4-Hit", multFactors: 66.77 },
        { name: "5-Hit", multFactors: 83.85 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack (1/2)", multFactors: 55.26 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Universality: An Elaboration on Form",
      image: "",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "Rush Attack DMG",
          multFactors: [
            { root: 193.6, attributeType: "atk" },
            { root: 154.88, attributeType: "em" },
          ],
          isWholeFactor: true,
        },
        {
          name: "1-Mirror Projection DMG",
          multFactors: [
            { root: 67.2, attributeType: "atk" },
            { root: 134.4, attributeType: "em" },
          ],
          isWholeFactor: true,
          getTalentBuff: ({ char, totalAttr }) => {
            const buffValue = Math.min(totalAttr.em * 0.1, 100);
            return talentBuff([checkAscs[4](char), "pct", [true, 4], buffValue]);
          },
        },
        {
          name: "2-Mirror Projection DMG (1/2)",
          multFactors: [
            { root: 67.2, attributeType: "atk" },
            { root: 134.4, attributeType: "em" },
          ],
          isWholeFactor: true,
          getTalentBuff: ({ char, totalAttr }) => {
            const buffValue = Math.min(totalAttr.em * 0.1, 100);
            return talentBuff([checkAscs[4](char), "pct", [true, 4], buffValue]);
          },
        },
        {
          name: "3-Mirror Projection DMG (1/3)",
          multFactors: [
            { root: 67.2, attributeType: "atk" },
            { root: 134.4, attributeType: "em" },
          ],
          isWholeFactor: true,
          getTalentBuff: ({ char, totalAttr }) => {
            const buffValue = Math.min(totalAttr.em * 0.1, 100);
            return talentBuff([checkAscs[4](char), "pct", [true, 4], buffValue]);
          },
        },
      ],
    },
    EB: {
      name: "Particular Field: Fetters of Phenomena",
      image: "",
      xtraLvAtCons: 5,
      stats: [
        {
          name: "Single-Instance DMG",
          multFactors: [
            { root: 121.6, attributeType: "atk" },
            { root: 97.28, attributeType: "em" },
          ],
          isWholeFactor: true,
        },
      ],
      energyCost: 70,
    },
  },
  passiveTalents: [
    {
      name: "Four-Causal Correction",
      image: "",
      desc: (
        <>
          When Alhaitham's Charged and Plunging Attacks hit opponents, they will create 1
          Chisel-Light Mirror. This effect can be triggered once every 12s.
        </>
      ),
    },
    {
      name: "Mysteries Laid Bare",
      image: "",
      desc: (
        <>
          Each point of Alhaitham's Elemental Mastery will increase the{" "}
          <Green>Projection Attacks DMG</Green> [~ES] and Particular Field: Fetters of Phenomena{" "}
          <Green>[EB] DMG</Green> by <Green b>0.1%</Green>. Max <Rose>100%</Rose>.
        </>
      ),
    },
    { name: "Law of Reductive Overdetermination", image: "" },
  ],
  constellation: [
    {
      name: "Intuition",
      image: "",
      desc: (
        <>
          When a Projection Attack hits an opponent, Universality: An Elaboration on Form's CD is
          decreased by 1.2s. This effect can be triggered once every 1s.
        </>
      ),
    },
    {
      name: "Debate",
      image: "",
      get desc() {
        return (
          <>
            {this.xtraDesc?.[0]}
            Each stack's duration is counted independently. This effect can be triggered even when
            the maximum number of Chisel-Light Mirrors has been reached.
          </>
        );
      },
      xtraDesc: [
        <>
          When Alhaitham generates a Chisel-Light Mirror, his <Green>Elemental Mastery</Green> will
          be increased by <Green b>50</Green> for 8 seconds, max <Rose>4</Rose> stacks.
        </>,
      ],
    },
    { name: "Negation", image: "" },
    {
      name: "Elucidation",
      image: "",
      desc: (
        <>
          Buff based on the number of Chisel-Light Mirrors consumed and generated by Particular
          Field: Fetters of Phenomena [EB]:
          <br />• Each Mirror consumed will increase the <Green>Elemental Mastery</Green> of all
          other nearby party members by <Green b>30</Green> for 15s.
          <br />• Each Mirror generated will grant Alhaitham a <Green b>10%</Green>{" "}
          <Green>Dendro DMG Bonus</Green> for 15s.
        </>
      ),
    },
    { name: "Sagacity", image: "" },
    {
      name: "Validity",
      image: "",
      get desc() {
        return (
          <>
            2 seconds after Particular Field: Fetters of Phenomena is unleashed, he will generate 3
            Chisel-Light Mirrors regardless of the number of mirrors consumed.
            <br />
            {this.xtraDesc?.[0]}
            <br />
            If this effect is triggered again during its initial duration, the duration remaining
            will be increased by 5s.
          </>
        );
      },
      xtraDesc: [
        <>
          If Alhaitham creates a Chisel-Light Mirror when their numbers have already maxed out, then
          each excess Chisel-Light Mirror will increase his <Green>CRIT Rate</Green> by{" "}
          <Green b>10%</Green> and <Green>CRIT DMG</Green> by <Green b>70%</Green> for 5s.
        </>,
      ],
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => Alhaitham.passiveTalents[1].desc,
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "EB.pct", Math.min(totalAttr.em * 0.1, 100), tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Chisel-Light Mirrors",
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When he possesses Chisel-Light Mirrors, Alhaitham gains <Dendro>Dendro Infusion</Dendro>.
        </>
      ),
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => Alhaitham.constellation[1].xtraDesc?.[0],
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", (inputs[0] || 0) * 50, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => Alhaitham.constellation[3].desc,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Consumed Mirrors",
          type: "select",
          max: 3,
        },
      ],
      applyBuff: ({ toSelf, totalAttr, inputs, desc, tracker }) => {
        if (toSelf) {
          applyModifier(desc, totalAttr, "dendro", (3 - (inputs[0] || 0)) * 10, tracker);
        } else {
          applyModifier(desc, totalAttr, "em", (inputs[0] || 0) * 30, tracker);
        }
      },
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => Alhaitham.constellation[5].xtraDesc?.[0],
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const stacks = inputs[0] || 0;
        applyModifier(desc, totalAttr, ["cRate", "cDmg"], [stacks * 10, stacks * 70], tracker);
      },
    },
  ],
};

export default Alhaitham;

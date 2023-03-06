import type { DataCharacter } from "@Src/types";
import { Dendro, Green, Lightgold, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, HEAVY_PAs } from "../constants";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const getEBbuffValue = (level: number) => (level ? round(27.49 * TALENT_LV_MULTIPLIERS[2][level], 2) : 0);

const Kaveh: DataCharacter = {
  code: 69,
  beta: true,
  name: "Kaveh",
  icon: "https://i.ibb.co/7zsCR62/kaveh.png",
  sideIcon: "",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "claymore",
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
  NAsConfig: {
    name: "Torque Settings",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 80.57 },
        { name: "2-Hit", multFactors: 73.68 },
        { name: "3-Hit", multFactors: 92.39 },
        { name: "4-Hit", multFactors: 110.77 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Cyclic", multFactors: 53.15 },
        { name: "Charged Attack Final", multFactors: 96.15 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Artistic Ingenuity",
      image: "",
      stats: [{ name: "Skill DMG", multFactors: 204 }],
    },
    EB: {
      name: "Painted Dome",
      image: "",
      stats: [
        { name: "Skill DMG", multFactors: 160 },
        {
          name: "Light of the Firmament (C6)",
          multFactors: { root: 61.8, scale: 0 },
          attPatt: "none",
        },
      ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "Creator's Undertaking",
      image: "",
      desc: (
        <>
          When DMG dealt by a Dendro Core (including Burgeon and Hyperbloom) hits Kaveh, he will regain HP equal to 300%
          of his Elemental Mastery. This effect can be triggered once every 0.5s.
        </>
      ),
    },
    {
      name: "A Craftsman's Curious Conceptions",
      image: "",
      get desc() {
        return (
          <>
            During Painted Dome [EB], {this.xtraDesc?.[0]} This effect can be triggered once every 0.1s.
            <br />
            This effect will be canceled when Painted Dome's effects end.
          </>
        );
      },
      xtraDesc: [
        <>
          after Kaveh's Normal, Charged, and Plunging Attacks hit opponents, his <Green>Elemental Mastery</Green> will
          increase by <Green b>25</Green>. Max <Rose>4</Rose> stacks.
        </>,
      ],
    },
    {
      name: "The Art of Budgeting",
      image: "",
    },
  ],
  constellation: [
    {
      name: "Sublime Salutations",
      image: "",
      desc: (
        <>
          Within 3.5s after using Artistic Ingenuity [ES], Kaveh's Dendro RES will be increased by 50% and he will
          receive 50% more healing.
        </>
      ),
    },
    {
      name: "The Grand Road",
      image: "",
      desc: (
        <>
          Kaveh's <Green>Normal Attack SPD</Green> increases by <Green b>15%</Green> during Painted Dome [EB].
        </>
      ),
    },
    { name: "Profferrings of the Golden Tower", image: "" },
    {
      name: "Feast of a Hundred Pillars",
      image: "",
      desc: (
        <>
          Dendro Cores created from <Green>Bloom</Green> reactions Kaveh triggers will have their rupture DMG increased
          by <Green b>60%</Green>.
        </>
      ),
    },
    { name: "Sacred Storage", image: "" },
    {
      name: "Idyllic Ideal",
      image: "",
      desc: (
        <>
          When Kaveh's Normal, Charged, and Plunging Attacks hit opponents during Painted Dome [EB], it will unleash the
          Light of the Firmament upon the opponent's position, dealing <Green b>61.8%</Green> of Kaveh's{" "}
          <Green>ATK</Green> as AoE Dendro DMG and causing all Dendro Cores within that AoE to rupture. This effect can
          be triggered once every 3s.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: (args) => {
        const level = finalTalentLv({ ...args, dataChar: Kaveh, talentType: "EB" });
        return (
          <>
            • Grants <Dendro>Dendro Infusion</Dendro>.<br />• Increases Bloom DMG triggered by all party members by{" "}
            <Green b>{getEBbuffValue(level)}%</Green>.
            <br />• At <Lightgold>A4</Lightgold>, {Kaveh.passiveTalents[1].xtraDesc?.[0]}
            <br />• At <Lightgold>C2</Lightgold>, {Kaveh.constellation[1].desc}
          </>
        );
      },
      inputConfigs: [
        {
          label: "A4 stacks",
          type: "stacks",
          initialValue: 0,
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, rxnBonus, char, partyData, inputs, desc, tracker }) => {
        const level = finalTalentLv({ char, dataChar: Kaveh, talentType: "EB", partyData });

        applyModifier(desc, rxnBonus, "bloom.pct_", getEBbuffValue(level), tracker);

        if (checkAscs[4](char)) {
          const stacks = inputs[0];
          applyModifier(desc + ` / ${EModSrc.A4}`, totalAttr, "em", stacks * 25);
        }
        if (checkCons[2](char)) {
          applyModifier(desc + ` / ${EModSrc.C2}`, totalAttr, "naAtkSpd_", 15);
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
      desc: ({ inputs }) => (
        <>
          Increases Bloom DMG triggered by all party members by <Green b>{getEBbuffValue(inputs[0])}%</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Burst level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: ({ rxnBonus, inputs, desc, tracker }) => {
        applyModifier(desc, rxnBonus, "bloom.pct_", getEBbuffValue(inputs[0]), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      isGranted: checkCons[4],
      desc: () => Kaveh.constellation[3].desc,
      applyBuff: makeModApplier("rxnBonus", "bloom.pct_", 60),
    },
  ],
};

export default Kaveh;

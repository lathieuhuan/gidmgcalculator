import { Green, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { DataCharacter } from "@Src/types";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkCons } from "../utils";

const Yaoyao: DataCharacter = {
  code: 66,
  beta: true,
  name: "Yaoyao",
  icon: "",
  sideIcon: "",
  rarity: 4,
  nation: "liyue",
  vision: "dendro",
  weaponType: "polearm",
  stats: [
    [1030, 18, 63],
    [2647, 46, 162],
    [3417, 59, 209],
    [5118, 88, 313],
    [5665, 98, 346],
    [6516, 113, 398],
    [7245, 125, 443],
    [8096, 140, 495],
    [8643, 149, 528],
    [9493, 164, 580],
    [10040, 174, 613],
    [10891, 188, 665],
    [11438, 198, 699],
    [12289, 212, 751],
  ],
  bonusStat: { type: "hp_", value: 6 },
  NAsConfig: {
    name: "Toss 'N' Turn Spear",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 47.44 },
        { name: "2-Hit", multFactors: 47.44 },
        { name: "3-Hit", multFactors: [31.38, 32.95] },
        { name: "4-Hit", multFactors: 77.93 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 112.66 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Raphanus Sky Cluster",
      image: "",
      xtraLvAtCons: 3,
      stats: [
        { name: "White Jade Radish DMG", multFactors: 29.92 },
        {
          name: "White Jade Radish Healing",
          notAttack: "healing",
          multFactors: { root: 1.71, attributeType: "hp" },
          flatFactor: 165,
        },
        {
          name: "Radish Extra Healing per sec (A4)",
          notAttack: "healing",
          multFactors: { root: 0.8, attributeType: "hp", scale: 0 },
        },
        {
          name: "Mega Radish DMG (C6)",
          multFactors: { root: 75, scale: 0 },
        },
        {
          name: "Mega Radish Healing (C6)",
          notAttack: "healing",
          multFactors: { root: 7.5, attributeType: "hp", scale: 0 },
        },
      ],
    },
    EB: {
      name: "Moonjade Descent",
      image: "",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", multFactors: 114.56 },
        { name: "Adeptal Legacy Radish DMG", multFactors: 72.16 },
        {
          name: "Adeptal Legacy Radish Healing",
          notAttack: "healing",
          multFactors: { root: 2.02, attributeType: "hp" },
          flatFactor: 194,
        },
      ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "Starscatter",
      image: "",
      desc: (
        <>
          While affected by the Adeptal Legacy state [~EB], Yaoyao will constantly throw White Jade
          Radishes at nearby opponents when she is sprinting, jumping, or running. She can throw 1
          White Jade Radish this way once every 0.6s.
        </>
      ),
    },
    {
      name: "In Others' Shoes",
      image: "",
      desc: (
        <>
          When White Jade Radishes [~ES] explode, active characters within their AoE will regain HP
          every 1s based on 0.8% of Yaoyao's Max HP. This effect lasts 5s.
        </>
      ),
    },
    { name: "Tailing on Tiptoes", image: "" },
  ],
  constellation: [
    {
      name: "Adeptus' Tutelage",
      image: "",
      get desc() {
        return (
          <>
            {this.xtraDesc?.[0]} and have <Green b>15</Green> <Green>Stamina</Green> restored to
            them. This form of Stamina Restoration can only be triggered every 5s.
          </>
        );
      },
      xtraDesc: [
        <>
          When White Jade Radishes [~ES] explode, active characters within their AoE will gain{" "}
          <Green b>15%</Green> <Green b>Dendro DMG Bonus</Green> for 8s
        </>,
      ],
    },
    {
      name: "Innocent",
      image: "",
      desc: (
        <>
          While affected by the Adeptal Legacy state [~EB], if White Jade Radish explosions damage
          opponents, 3 Energy will be restored to Yaoyao. This form of Energy regeneration can occur
          once every 0.8s.
        </>
      ),
    },
    { name: "Loyal and Kind", image: "" },
    {
      name: "Winsome",
      image: "",
      desc: (
        <>
          After using Raphanus Sky Cluster [ES] or Moonjade Descent [EB], Yaoyao's{" "}
          <Green>Elemental Mastery</Green> will be increased based on <Green b>0.3%</Green> of her{" "}
          <Green>Max HP</Green> for 8s. Max <Rose>120</Rose> Elemental Mastery.
        </>
      ),
    },
    { name: "Compassionate", image: "" },
    {
      name: "Beneficent",
      image: "",
      desc: (
        <>
          For every 2 White Jade Radishes Yuegui: Throwing Mode [ES] throws out, it will also throw
          a Mega Radish that has a larger AoE and upon exploding, it will:
          <br />• Deal AoE Dendro DMG based on <Green b>75%</Green> of Yaoyao's <Green>ATK</Green>.
          <br />• Restore HP for the active character based on <Green b>7.5%</Green> of Yaoyao's{" "}
          <Green>Max HP</Green>.
          <br />
          Every Yuegei: Throwing Mode can throw out a maximum of <Rose>2</Rose> Mega Radishes.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.PARTY,
      desc: () => Yaoyao.constellation[0].xtraDesc?.[0],
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "dendro", 15),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => Yaoyao.constellation[3].desc,
      isGranted: checkCons[4],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const buffValue = Math.min(Math.round(totalAttr.hp * 0.003), 120);
        applyModifier(desc, totalAttr, "em", buffValue, tracker);
      },
    },
  ],
};

export default Yaoyao;

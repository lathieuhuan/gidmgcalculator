import type { DataCharacter } from "@Src/types";
import { Dendro, Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModifierSrc, LIGHT_PAs } from "../constants";
import { makeModApplier } from "@Src/calculators/utils";
import { checkCons } from "../utils";

const Collei: DataCharacter = {
  code: 55,
  beta: true,
  name: "Collei",
  icon: "https://i.ibb.co/wQb7kY4/collei.png",
  sideIcon: "",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
  weapon: "bow",
  stats: [
    [821, 17, 50],
    [2108, 43, 129],
    [2721, 56, 167],
    [4076, 83, 250],
    [4512, 92, 277],
    [5189, 106, 318],
    [5770, 118, 354],
    [6448, 132, 396],
    [6884, 140, 422],
    [7561, 154, 464],
    [7996, 163, 491],
    [8674, 177, 532],
    [9110, 186, 559],
    [9787, 200, 601],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Supplicant's Bowmanship",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 43.6 },
        { name: "2-Hit", baseMult: 42.66 },
        { name: "3-Hit", baseMult: 54.09 },
        { name: "4-Hit", baseMult: 68.03 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Floral Brush",
      image: "",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", baseMult: 151.2 }],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
    },
    EB: {
      name: "Trump-Card Kitty",
      image: "",
      xtraLvAtCons: 5,
      stats: [
        { name: "Explosion DMG", baseMult: 201.82 },
        { name: "Leap DMG", baseMult: 43.25 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "6s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    {
      name: "Floral Sidewinder",
      image: "",
      desc: (
        <>
          If one of your party members has triggered Burning, Quicken, Aggravate, Spread, Bloom,
          Hyperbloom, or Burgeon reactions before the Floral Ring returns, it will grant the
          character the Sprout effect upon return, which will continuously deal Dendro DMG
          equivalent to <Green b>40%</Green> of Collei's <Green>ATK</Green> to nearby opponents for
          3s.
          <br />
          If another Sprout effect is triggered during its initial duration, the initial effect will
          be removed.
        </>
      ),
    },
    {
      name: "The Languid Wood",
      image: "",
      desc: (
        <>
          When a character within the Cuilein-Anbar Zone triggers Burning, Quicken, Aggravate,
          Spread, Bloom, Hyperbloom, or Burgeon reactions, the Zone's <Green>duration</Green> will
          be increased by <Green>1s</Green>.
          <br />A single Trump-Card Kitty can be extended by up to <Green>3s</Green>.
        </>
      ),
    },
    { name: "Gliding Champion of Sumeru", image: "" },
  ],
  constellation: [
    {
      name: "Beginnings Determined at the Roots",
      image: "",
      desc: (
        <>
          When in the party and not on the field, Collei's <Green>Energy Recharge</Green> is
          increased by <Green b>20%</Green>.
        </>
      ),
    },
    {
      name: "Through Hill and Copse",
      image: "",
      get desc() {
        return (
          <>
            The Passive Talent Floral Sidewinder is changed to this:
            <br />
            ...
            {this.xtraDesc![0]}
            <br />
            The effect will last up to 6s if the field's duraton ends or if it no longer has
            opponents within it.
          </>
        );
      },
      xtraDesc: [
        <>
          From the moment of using Floral Brush to the moment when this instance of Sprout effect
          ends, if any of your party members triggers Burning, Quicken, Aggravate, Spread, Bloom,
          Hyperbloom, or Burgeon reactions, the <Green>Sprout effect</Green> will be extended by{" "}
          <Green b>3s</Green>.
        </>,
      ],
    },
    { name: "Scent of Summer", image: "" },
    {
      name: "Gift of the Woods",
      image: "",
      desc: (
        <>
          Using Trump-Card Kitty will increase all nearby characters'{" "}
          <Green>Elemental Mastery</Green> by <Green b>60</Green> for 12s (not including Collei
          herself).
        </>
      ),
    },
    { name: "All Embers", image: "" },
    {
      name: "Forest of Falling Arrows",
      image: "",
      desc: (
        <>
          When the Floral Ring hits opponents, it will create a miniature Cuilein-Anbar that will
          deal <Green b>200%</Green> of Collei's <Green>ATK</Green> as <Dendro>Dendro DMG</Dendro>.
          <br />
          Each Floral Brush can only create one such miniature Cuilein-Anbar.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModifierSrc.A1,
      desc: () => Collei.constellation[0].desc,
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "er", 20),
    },
    {
      index: 4,
      src: EModifierSrc.C4,
      desc: () => Collei.constellation[3].desc,
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "em", 60),
    },
  ],
};

export default Collei;
import type { DataCharacter } from "@Src/types";
import { Green, Red } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModifierSrc, MEDIUM_PAs } from "../constants";
import { round1 } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { charModCtrlIsActivated, checkAscs, checkCons, talentBuff } from "../utils";

import nilouImg from "@Src/assets/images/nilou.png";

const Nilou: DataCharacter = {
  code: 60,
  beta: true,
  name: "Nilou",
  icon: nilouImg,
  sideIcon: "",
  rarity: 5,
  nation: "sumeru",
  vision: "hydro",
  weapon: "sword",
  stats: [
    [1182, 18, 57],
    [3066, 46, 147],
    [4080, 62, 196],
    [6105, 92, 293],
    [6825, 103, 327],
    [7852, 119, 377],
    [8813, 133, 423],
    [9850, 149, 473],
    [10571, 160, 507],
    [11618, 176, 557],
    [12338, 187, 592],
    [13397, 203, 643],
    [14117, 213, 677],
    [15185, 230, 729],
  ],
  bonusStat: { type: "hp_", value: 7.2 },
  NAsConfig: {
    name: "Dance of the Bowstring Moon",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 50.31 },
        { name: "2-Hit", baseMult: 45.44 },
        { name: "3-Hit", baseMult: 70.35 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: [50.22, 54.44] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Dance of the Seven Realms",
      image: "",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", baseStatType: "hp", baseMult: 3.34 },
        { name: "Sword Dance 1-Hit DMG", baseStatType: "hp", baseMult: 4.55 },
        { name: "Sword Dance 2-Hit DMG", baseStatType: "hp", baseMult: 5.14 },
        {
          name: "Watery Moon DMG",
          baseStatType: "hp",
          baseMult: 7.17,
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const isActivated = charModCtrlIsActivated(Nilou.buffs!, char, selfBuffCtrls, 2);
            talentBuff([isActivated, "pct", [false, 1], 65]);
          },
        },
        { name: "Whirling Steps 1-Hit DMG", baseStatType: "hp", baseMult: 3.26 },
        { name: "Whirling Steps 2-Hit DMG", baseStatType: "hp", baseMult: 3.96 },
        { name: "Water Wheel DMG", baseStatType: "hp", baseMult: 5.06 },
      ],
      // getExtraStats: () => [
      //   { name: "Pirouette Duration", value: "10s" },
      //   { name: "Lunar Prayer Duration", value: "8s" },
      //   { name: "Tranquility Aura Duration", value: "12s" },
      //   { name: "CD", value: "18s" },
      // ],
    },
    EB: {
      name: "Dance of the Lotus: Distant Dreams, Listening Spring",
      image: "",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", baseStatType: "hp", baseMult: 24.58 },
        { name: "Lingering Aeon DMG", baseStatType: "hp", baseMult: 30.04 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "18s" }],
      energyCost: 70,
    },
  },
  passiveTalents: [
    {
      name: "Court of Dancing Petals",
      image: "",
      get desc() {
        return (
          <>
            When all characters in the party are either Dendro or Hydro, and there is at least one
            Dendro and Hydro character, the flowery steps of Nilou's Dance of the Seven Realms will
            grant all nearby characters the Golden Chalice's Bounty for 30s.
            <br /> {this.xtraDesc![0]} Also, triggering the Bloom reaction will create Bountiful
            Cores instead of Dendro Cores.
            <br /> Such Cores will burst very quickly after being created, and they have larger
            AoEs.
            <br /> Bountiful Cores cannot trigger Hyperbloom or Burgeon, and they share a upper
            numerical limit with Dendro Cores. Bountiful Core DMG is considered DMG dealt by Dendro
            Cores produced by Bloom (Rupture).
          </>
        );
      },
      xtraDesc: [
        <>
          Characters under the effect of Golden Chalice's Bounty will have their{" "}
          <Green>Elemental Mastery</Green> increased by <Green b>60</Green> for 10s whenever they
          are hit by Dendro attacks.
        </>,
      ],
    },
    {
      name: "Dreamy Dance of Aeons",
      image: "",
      desc: (
        <>
          Each 1,000 points of Max HP above 30,000 will cause the <Green>DMG</Green> dealt by{" "}
          <Green>Bountiful Cores</Green> created by characters affected by Golden Chalice's Bounty
          to increase by <Green b>7%</Green>.
          <br />
          The <Green>maximum</Green> increase in Bountiful Core DMG that can be achieved this way is{" "}
          <Green b>300%</Green>.
        </>
      ),
    },
    { name: "White Jade Lotus", image: "" },
  ],
  constellation: [
    {
      name: "Dance of the Waning Moon",
      image: "",
      get desc() {
        return (
          <>
            Dance of the Seven Realms will be enhanced as follows:
            <br />• {this.xtraDesc![0]}
            <br />• The Tranquility Aura's duration is extended by 6s.
          </>
        );
      },
      xtraDesc: [
        <>
          <Green>Watery moon DMG</Green> is increased by <Green b>65%</Green>.
        </>,
      ],
    },
    {
      name: "The Starry Skies Their Flowers Rain",
      image: "",
      get desc() {
        return (
          <>
            {this.xtraDesc![0]} {this.xtraDesc![1]}
            <br />
            You need to have unlocked the “Court of Dancing Petals” Talent.
          </>
        );
      },
      xtraDesc: [
        <>
          After characters affected by the Golden Chalice's Bounty deal Hydro DMG to opponents, that
          opponent's <Green>Hydro RES</Green> will be decreased by <Green b>35%</Green> for 10s.
        </>,
        <>
          After a triggered Bloom reaction deals DMG to opponents, their <Green>Dendro RES</Green>{" "}
          will be decreased by <Green b>35%</Green> for 10s.
        </>,
      ],
    },
    { name: "Beguiling Shadowstep", image: "" },
    {
      name: "Fricative Pulse",
      image: "",
      get desc() {
        return (
          <>
            After the third dance step of Dance of the Seven Realms' Pirouette hits opponents, Nilou
            will gain 15 Elemental Energy, and {this.xtraDesc![0]}
          </>
        );
      },
      xtraDesc: [
        <>
          <Green>DMG</Green> from her{" "}
          <Green>Dance of the Lotus: Distant Dreams, Listening Spring</Green> will be increased by{" "}
          <Green b>50%</Green> for 8s.
        </>,
      ],
    },
    { name: "Twirling Light", image: "" },
    {
      name: "Frostbreaker's Melody",
      image: "",
      desc: (
        <>
          For every 1,000 points of Max HP, Nilou's <Green>CRIT Rate</Green> and{" "}
          <Green>CRIT DMG</Green> will increase by <Green b>0.6%</Green> and <Green b>1.2%</Green>{" "}
          respectively.
          <br />
          The maximum increase in <Green>CRIT Rate</Green> and <Green>CRIT DMG</Green> is{" "}
          <Green b>30%</Green> and <Green b>60%</Green> respectively.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModifierSrc.A1,
      desc: () => Nilou.passiveTalents[0].xtraDesc?.[0],
      isGranted: checkAscs[1],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "em", 60),
    },
    {
      index: 1,
      src: EModifierSrc.A4,
      affect: EModAffect.SELF,
      desc: ({ totalAttr }) => {
        return (
          <>
            {Nilou.passiveTalents[1].desc}{" "}
            <Red>
              Bonus DMG:{" "}
              {totalAttr.hp > 30000 ? round1(Math.min((totalAttr.hp / 1000 - 30) * 7, 300)) : 0}%
            </Red>
          </>
        );
      },
      isGranted: checkAscs[4],
    },
    {
      index: 2,
      src: EModifierSrc.C1,
      affect: EModAffect.SELF,
      isGranted: checkCons[1],
      desc: () => Nilou.constellation[0].xtraDesc?.[0],
    },
    {
      index: 3,
      src: EModifierSrc.C4,
      affect: EModAffect.SELF,
      desc: () => Nilou.constellation[3].xtraDesc?.[0],
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "EB.pct", 50),
    },
    {
      index: 4,
      src: EModifierSrc.C6,
      affect: EModAffect.SELF,
      desc: () => Nilou.constellation[5].desc,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const baseValue = round1(Math.min((totalAttr.hp / 1000) * 0.6, 30));
        const buffValues = [baseValue, baseValue * 2];
        applyModifier(desc, totalAttr, ["cRate", "cDmg"], buffValues, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModifierSrc.C2,
      desc: () => Nilou.constellation[1].xtraDesc?.[0],
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resisReduct", "hydro", 35),
    },
    {
      index: 1,
      src: EModifierSrc.C2,
      desc: () => Nilou.constellation[1].xtraDesc?.[1],
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resisReduct", "dendro", 35),
    },
  ],
};

export default Nilou;

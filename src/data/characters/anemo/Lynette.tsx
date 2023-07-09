import type { DataCharacter } from "@Src/types";
import { Anemo, Green } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";
import { countVision } from "@Src/utils";

const Lynette: DataCharacter = {
  code: 72,
  name: "Lynette",
  icon: "https://images2.imgbox.com/5b/1a/kApSKvQl_o.png",
  sideIcon: "",
  rarity: 4,
  nation: "fontaine",
  vision: "anemo",
  weaponType: "sword",
  stats: [
    [1039, 19, 60],
    [2670, 50, 153],
    [3447, 64, 198],
    [5163, 96, 296],
    [5715, 107, 328],
    [6573, 123, 377],
    [7309, 136, 420],
    [8168, 153, 469],
    [8719, 163, 501],
    [9577, 179, 550],
    [10129, 189, 582],
    [10987, 205, 631],
    [11539, 215, 663],
    [12397, 232, 712],
  ],
  bonusStat: { type: "anemo", value: 6 },
  NAsConfig: {
    name: "Rapid Ritesword",
  },
  bonusLvFromCons: ["EB", "ES"],
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 43.08 },
        { name: "2-Hit", multFactors: 37.61 },
        { name: "3-Hit", multFactors: [27.86, 21.59] },
        { name: "4-Hit", multFactors: 63.15 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: [44.2, 61.4] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Enigmatic Feint",
      image: "",
      stats: [
        { name: "Enigma Thrust", multFactors: 268 },
        { name: "Surging Blade", multFactors: 31.2 },
      ],
    },
    EB: {
      name: "Magic Trick: Astonishing Shift",
      image: "",
      stats: [
        { name: "Skill DMG", multFactors: 83.2 },
        { name: "Bogglecat Box", multFactors: 51.2 },
        { name: "Vivid Shot", multFactors: 45.6, attElmt: "various" },
      ],
      energyCost: 70,
    },
  },
  passiveTalents: [
    {
      name: "Sophisticated Synergy",
      image: "",
      desc: (
        <>
          Within 10s after using Magic Trick: Astonishing Shift [EB], when there are 1/2/3/4 Elemental Types in the
          party, all party members' <Green>ATK</Green> will be increased by <Green b>8%/12%/16%/20%</Green>{" "}
          respectively.
        </>
      ),
    },
    {
      name: "Props Positively Prepped",
      image: "",
      desc: (
        <>
          After the Bogglecat Box [~EB] performs Elemental Coversion, Lynette's <Green>Elemental Burst DMG</Green> will
          be increased by <Green b>15%</Green>. This effect will persist until the Bogglecat Box's duration ends.
        </>
      ),
    },
    { name: "Point Mnemonics", image: "" },
  ],
  constellation: [
    {
      name: "A Cold Blade Like a Shadow",
      image: "",
      desc: (
        <>
          When Enigma Thrust [~ES] hits an opponent with Shadowsign, a vortex will be created at that opponent's
          position that will pull nearby opponents in.
        </>
      ),
    },
    {
      name: "Endless Mysteries",
      image: "",
      desc: <>Whenever the Bogglecat Box [~EB] fires a Vivid Shot, it will fire an extra Vivid Shot.</>,
    },
    {
      name: "Cognition-Inverting Gaze",
      image: "",
    },
    { name: "Tacit Coordination", image: "", desc: <>Increases Enigmatic Feint's [ES] charges by 1.</> },
    { name: "Obscuring Ambiguity", image: "" },
    {
      name: "Intent-Identifying Insight",
      image: "",
      desc: (
        <>
          When Lynette uses Enigma Thrust [~ES], she will gain an <Anemo>Anemo Infusion</Anemo> and <Green>20%</Green>{" "}
          <Green>Anemo DMG Bonus</Green> for 6s.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.PARTY,
      desc: () => Lynette.passiveTalents[0].desc,
      isGranted: checkAscs[1],
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        const numOfElmts = Object.keys(countVision(partyData, charData)).length;
        applyModifier(desc, totalAttr, "atk_", 4 * (numOfElmts + 1), tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => Lynette.passiveTalents[1].desc,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => Lynette.constellation[5].desc,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "anemo", 20),
      infuseConfig: {
        overwritable: false,
      },
    },
  ],
};

export default Lynette;

import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Anemo, Green } from "@Src/pure-components";
import { countVision } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Lynette: DefaultAppCharacter = {
  code: 72,
  name: "Lynette",
  icon: "https://images2.imgbox.com/5b/1a/kApSKvQl_o.png",
  sideIcon: "",
  rarity: 4,
  nation: "fontaine",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 43.08 },
      { name: "2-Hit", multFactors: 37.61 },
      { name: "3-Hit", multFactors: [27.86, 21.59] },
      { name: "4-Hit", multFactors: 63.15 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: [44.2, 61.4],
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Enigma Thrust", multFactors: 268 },
      { name: "Surging Blade", multFactors: 31.2 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 83.2 },
      { name: "Bogglecat Box", multFactors: 51.2 },
      { name: "Vivid Shot", multFactors: 45.6, attElmt: "various" },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Rapid Ritesword",
    },
    ES: {
      name: "Enigmatic Feint",
      image: "",
    },
    EB: {
      name: "Magic Trick: Astonishing Shift",
      image: "",
    },
  },
  passiveTalents: [
    {
      name: "Sophisticated Synergy",
      image: "",
      description:
        "Within 10s after using Magic Trick: Astonishing Shift [EB], when there are 1/2/3/4 Elemental Types in the party, all party members' ATK will be increased by 8%/12%/16%/20% respectively.",
    },
    {
      name: "Props Positively Prepped",
      image: "",
      description:
        "After the Bogglecat Box [~EB] performs Elemental Coversion, Lynette's Elemental Burst DMG will be increased by 15%. This effect will persist until the Bogglecat Box's duration ends.",
    },
    { name: "Point Mnemonics", image: "" },
  ],
  constellation: [
    {
      name: "A Cold Blade Like a Shadow",
      image: "",
      description:
        "When Enigma Thrust [~ES] hits an opponent with Shadowsign, a vortex will be created at that opponent's position that will pull nearby opponents in.",
    },
    {
      name: "Endless Mysteries",
      image: "",
      description: "Whenever the Bogglecat Box [~EB] fires a Vivid Shot, it will fire an extra Vivid Shot.",
    },
    {
      name: "Cognition-Inverting Gaze",
      image: "",
    },
    {
      name: "Tacit Coordination",
      image: "",
      description: "Increases Enigmatic Feint's [ES] charges by 1.",
    },
    { name: "Obscuring Ambiguity", image: "" },
    {
      name: "Intent-Identifying Insight",
      image: "",
      description:
        "When Lynette uses Enigma Thrust [~ES], she will gain an Anemo Infusion and 20% Anemo DMG Bonus for 6s.",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.PARTY,
      description: `Within 10s after using Magic Trick: Astonishing Shift [EB], when there are 1/2/3/4 Elemental Types in
      the party, all party members' {ATK}#[Gr] will be increased by {8%}#[B,Gr]/{12%}#[B,Gr]/{16%}#[B,Gr]/{20%}#[B,Gr]
      respectively.`,
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
      description: `After the Bogglecat Box [~EB] performs Elemental Coversion, Lynette's {Elemental Burst DMG}#[Gr]
      will be increased by {15%}#[B,Gr]. This effect will persist until the Bogglecat Box's duration ends.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `When Lynette uses Enigma Thrust [~ES], she will gain an {Anemo Infusion}#[anemo] and {20%}#[B,Gr]
      {Anemo DMG Bonus}#[Gr] for 6s.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "anemo", 20),
      infuseConfig: {
        overwritable: false,
      },
    },
  ],
};

export default Lynette as AppCharacter;

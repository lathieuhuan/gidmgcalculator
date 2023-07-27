import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkCons, exclBuff } from "../utils";

const Diona: DefaultAppCharacter = {
  code: 24,
  name: "Diona",
  icon: "4/40/Diona_Icon",
  sideIcon: "e/e1/Diona_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [802, 18, 50],
    [2061, 46, 129],
    [2661, 59, 167],
    [3985, 88, 250],
    [4411, 98, 277],
    [5074, 113, 318],
    [5642, 125, 354],
    [6305, 140, 396],
    [6731, 149, 422],
    [7393, 164, 464],
    [7818, 174, 491],
    [8481, 188, 532],
    [8907, 198, 559],
    [9570, 212, 601],
  ],
  bonusStat: { type: "cryo", value: 6 },
  activeTalents: {
    NAs: {
      name: "Kätzlein Style",
    },
    ES: {
      name: "Icy Paws",
      image: "e/e9/Talent_Icy_Paws",
    },
    EB: {
      name: "Signature Mix",
      image: "5/57/Talent_Signature_Mix",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 36.12 },
      { name: "2-Hit", multFactors: 33.54 },
      { name: "3-Hit", multFactors: 45.58 },
      { name: "4-Hit", multFactors: 43 },
      { name: "5-Hit", multFactors: 53.75 },
    ],
    CA: BOW_CAs,
    PA: LIGHT_PAs,
    ES: [
      {
        name: "DMG per Paw",
        multFactors: 41.92,
      },
      {
        id: "ES.0",
        name: "Base DMG Absorption",
        type: "shield",
        multFactors: { root: 7.2, attributeType: "hp" },
        flatFactor: 693,
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 80 },
      { name: "Continuous DMG", multFactors: 52.64 },
      {
        name: "HP Regen. Over Time",
        type: "healing",
        multFactors: { root: 5.34, attributeType: "hp" },
        flatFactor: 513,
      },
    ],
  },
  passiveTalents: [
    {
      name: "Cat's Tail Secret Menu",
      image: "c/cc/Talent_Cat%27s_Tail_Secret_Menu",
    },
    { name: "Drunkards' Farce", image: "5/53/Talent_Drunkards%27_Farce" },
    {
      name: "Complimentary Bar Food",
      image: "d/da/Talent_Complimentary_Bar_Food",
    },
  ],
  constellation: [
    {
      name: "A Lingering Flavor",
      image: "e/e2/Constellation_A_Lingering_Flavor",
    },
    {
      name: "Shaken, Not Purred",
      image: "3/3a/Constellation_Shaken%2C_Not_Purred",
    },
    {
      name: "A-Another Round?",
      image: "1/14/Constellation_A—Another_Round%3F",
    },
    {
      name: "Wine Industry Slayer",
      image: "9/93/Constellation_Wine_Industry_Slayer",
    },
    {
      name: "Double Shot, On The Rocks",
      image: "b/b4/Constellation_Double_Shot%2C_on_the_Rocks",
    },
    {
      name: "Cat's Tail Closing Time",
      image: "2/2f/Constellation_Cat%27s_Tail_Closing_Time",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C2,
      desc: () => (
        <>
          Increases Icy Paws <Green>[ES] DMG</Green> by <Green b>15%</Green>, and increases its shield's{" "}
          <Green>DMG Absorption</Green> by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: ({ attPattBonus, calcItemBuffs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 15, tracker);
        calcItemBuffs.push(exclBuff(EModSrc.C2, "ES.0", "pct_", 15));
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          When characters within Signature Mix's radius have more than 50% HP, their <Green>Elemental Mastery</Green> is
          increased by <Green b>200</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "em", 200),
    },
  ],
};

export default Diona as AppCharacter;

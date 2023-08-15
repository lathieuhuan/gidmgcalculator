import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkCons } from "../utils";

const Sucrose: DefaultAppCharacter = {
  code: 3,
  name: "Sucrose",
  icon: "0/0e/Sucrose_Icon",
  sideIcon: "9/98/Sucrose_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [775, 14, 59],
    [1991, 37, 151],
    [2570, 47, 195],
    [3850, 71, 293],
    [4261, 78, 324],
    [4901, 90, 373],
    [5450, 100, 414],
    [6090, 112, 463],
    [6501, 120, 494],
    [7141, 131, 543],
    [7552, 139, 574],
    [8192, 151, 623],
    [8604, 158, 654],
    [9244, 170, 703],
  ],
  bonusStat: { type: "anemo", value: 6 },
  activeTalents: {
    NAs: {
      name: "Wind Spirit Creation",
    },
    ES: {
      name: "Astable Anemohypostasis Creation - 6308",
      image: "7/76/Talent_Astable_Anemohypostasis_Creation_-_6308",
    },
    EB: {
      name: "Forbidden Creation - Isomer 75 / Type II",
      image: "4/4d/Talent_Forbidden_Creation_-_Isomer_75_Type_II",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 33.46 },
      { name: "2-Hit", multFactors: 30.62 },
      { name: "3-Hit", multFactors: 38.45 },
      { name: "4-Hit", multFactors: 47.92 },
    ],
    CA: [{ name: "Charged Attack", multFactors: 120.16 }],
    PA: LIGHT_PAs,
    ES: [{ name: "Skill DMG", multFactors: 211.2 }],
    EB: [
      { name: "DoT", multFactors: 148 },
      {
        name: "Additional Elemental DMG",
        multFactors: 44,
        attElmt: "various",
      },
    ],
  },
  passiveTalents: [
    { name: "Catalyst Conversion", image: "8/8b/Talent_Catalyst_Conversion" },
    { name: "Mollis Favonius", image: "0/02/Talent_Mollis_Favonius" },
    { name: "Astable Invention", image: "7/7e/Talent_Astable_Invention" },
  ],
  constellation: [
    { name: "Clustered Vacuum Field", image: "c/ce/Constellation_Clustered_Vacuum_Field" },
    { name: "Beth: Unbound Form", image: "3/3c/Constellation_Beth_Unbound_Form" },
    { name: "Flawless Alchemistress", image: "c/cb/Constellation_Flawless_Alchemistress" },
    { name: "Alchemania", image: "3/3e/Constellation_Alchemania" },
    { name: "Caution: Standard Flask", image: "5/5e/Constellation_Caution_Standard_Flask" },
    { name: "Chaotic Entropy", image: "b/b1/Constellation_Chaotic_Entropy" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      description: `When Sucrose triggers a Swirl, all characters in the party with the matching element (excluding Sucrose) have
      their {Elemental Mastery}#[gr] increased by {50}#[b,gr] for 8s.`,
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      description: `When Astable Anemohypostasis Creation - 6308 [ES] or Forbidden Creation - Isomer 75 / Type II [EB]
      hits an opponent, increases all party members' (excluding Sucrose) {Elemental Mastery}#[gr] based on {20%}#[b,gr]
      of Sucrose's {Elemental Mastery}#[gr] for 8s.`,
      inputConfigs: [
        {
          label: "Elemental Mastery",
          type: "text",
          max: 9999,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", Math.round((inputs[0] || 0) * 0.2), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `If Forbidden Creation - Isomer 75 / Type II [EB] triggers an Elemental Absorption, all party
      members gain a {20%}#[b,gr] {Elemental DMG Bonus}#[gr] for the corresponding {absorbed element}#[gr] during its
      duration.`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element Absorbed",
          type: "anemoable",
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        applyModifier(desc, totalAttr, VISION_TYPES[elmtIndex], 20, tracker);
      },
    },
  ],
};

export default Sucrose as AppCharacter;
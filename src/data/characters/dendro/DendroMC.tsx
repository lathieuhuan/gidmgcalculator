import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const DendroMC: DefaultAppCharacter = {
  code: 57,
  name: "Dendro Traveler",
  ...TRAVELER_INFO,
  vision: "dendro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  activeTalents: {
    NAs: {
      name: "Foreign Fieldcleaver",
    },
    ES: {
      name: "Razorgrass Blade",
      image: "2/24/Talent_Razorgrass_Blade",
    },
    EB: {
      name: "Surgent Manifestation",
      image: "a/af/Talent_Surgent_Manifestation",
    },
  },
  calcList: {
    ...TRAVELLER_NCPAs,
    ES: [{ name: "Skill DMG", multFactors: 230.4 }],
    EB: [
      { name: "Lea Lotus Lamp Attack DMG", multFactors: 80.16 },
      { name: "Explosion DMG", multFactors: 400.8 },
    ],
  },
  passiveTalents: [
    { name: "Verdant Overgrowth", image: "5/55/Talent_Verdant_Overgrowth" },
    { name: "Verdant Luxury", image: "5/55/Talent_Verdant_Luxury" },
  ],
  constellation: [
    {
      name: "Symbiotic Creeper",
      image: "1/16/Constellation_Symbiotic_Creeper",
    },
    { name: "Green Resilience", image: "f/f4/Constellation_Green_Resilience" },
    { name: "Whirling Weeds", image: "3/3c/Constellation_Whirling_Weeds" },
    { name: "Treacle Grass", image: "f/f5/Constellation_Treacle_Grass" },
    {
      name: "Viridian Transience",
      image: "8/8f/Constellation_Viridian_Transience",
    },
    {
      name: "Withering Aggregation",
      image: "d/dc/Constellation_Withering_Aggregation",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          Every point of Elemental Mastery the Traveler possesses increases Razorgrass Blade <Green>[ES] DMG</Green> by{" "}
          <Green b>0.15%</Green> and Surgent Manifestation <Green>[EB] DMG</Green> by <Green b>0.1%</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ desc, attPattBonus, totalAttr, tracker }) => {
        const buffValue1 = totalAttr.em * 0.15;
        const buffValue2 = totalAttr.em * 0.1;
        applyModifier(desc, attPattBonus, ["ES.pct_", "EB.pct_"], [buffValue1, buffValue2], tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          Lea Lotus Lamp [~EB] will obtain one level of Overflowing Lotuslight every second it is on the field,
          increasing the <Green>Elemental Mastery</Green> of active character(s) within its AoE by <Green b>6</Green>.
          Maximum <Rose>10</Rose> stacks.
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 10,
        },
      ],
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        applyModifier(desc, totalAttr, "em", 6 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          The <Green>Dendro DMG Bonus</Green> of the character under the effect of Overflowing Lotuslight [~EB] is
          increased by <Green b>12%</Green>. If the Lamp has experienced a Lotuslight Transfiguration previously, the
          character will also gain <Green b>12%</Green> <Green>DMG Bonus</Green> for the{" "}
          <Green>corresponding element</Green>.
        </>
      ),
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element contact",
          type: "dendroable",
        },
      ],
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        applyModifier(desc, totalAttr, ["dendro", VISION_TYPES[elmtIndex]], 12, tracker);
      },
    },
  ],
};

export default DendroMC as AppCharacter;

import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { applyModifier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const DendroMC: DataCharacter = {
  code: 57,
  name: "Dendro Traveler",
  ...TRAVELER_INFO,
  vision: "dendro",
  NAsConfig: {
    name: "Foreign Fieldcleaver",
  },
  activeTalents: {
    ...TRAVELLER_NCPAs,
    ES: {
      name: "Razorgrass Blade",
      image: "2/24/Talent_Razorgrass_Blade",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", multFactors: 230.4 }],
      // getExtraStats: () => [{ name: "CD", value: "8s" }],
    },
    EB: {
      name: "Surgent Manifestation",
      image: "a/af/Talent_Surgent_Manifestation",
      xtraLvAtCons: 5,
      stats: [
        { name: "Lea Lotus Lamp Attack DMG", multFactors: 80.16 },
        { name: "Explosion DMG", multFactors: 400.8 },
      ],
      // getExtraStats: () => [
      //   { name: "Lea Lotus Lamp Duration", value: "12s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    {
      name: "Verdant Overgrowth",
      image: "5/55/Talent_Verdant_Overgrowth",
      desc: (
        <>
          Lea Lotus Lamp will obtain one level of Overflowing Lotuslight every second it is on the
          field, increasing the <Green>Elemental Mastery</Green> of active character(s) within its
          AoE by <Green b>6</Green>. Overflowing Lotuslight has a maximum of <Green b>10</Green>{" "}
          <Green>stacks</Green>.
        </>
      ),
    },
    {
      name: "Verdant Luxury",
      image: "5/55/Talent_Verdant_Luxury",
      desc: (
        <>
          Every point of Elemental Mastery the Traveler possesses increases the DMG dealt by{" "}
          <Green>Razorgrass Blade</Green> by <Green b>0.15%</Green> and the DMG dealt by{" "}
          <Green>Surgent Manifestation</Green> by <Green b>0.1%</Green>.
        </>
      ),
    },
  ],
  constellation: [
    {
      name: "Symbiotic Creeper",
      image: "1/16/Constellation_Symbiotic_Creeper",
      desc: (
        <>
          After Razorgrass Blade hits an opponent, it will regenerate <Green b>3.5</Green>{" "}
          <Green>Energy</Green> for the Traveler.
        </>
      ),
    },
    {
      name: "Green Resilience",
      image: "f/f4/Constellation_Green_Resilience",
      desc: (
        <>
          Lea Lotus Lamp's <Green>duration</Green> is increased by <Green>3s</Green>.
        </>
      ),
    },
    { name: "Whirling Weeds", image: "3/3c/Constellation_Whirling_Weeds" },
    {
      name: "Treacle Grass",
      image: "f/f5/Constellation_Treacle_Grass",
      desc: (
        <>
          After the Lea Lotus Lamp triggers a Lotuslight Transfiguration, it will obtain 5 stacks of
          the Overflowing Lotuslight effect from the Passive Talent "Verdant Overgrowth."
          <br />
          You must have unlocked this Passive Talent first.
        </>
      ),
    },
    { name: "Viridian Transience", image: "8/8f/Constellation_Viridian_Transience" },
    {
      name: "Withering Aggregation",
      image: "d/dc/Constellation_Withering_Aggregation",
      desc: (
        <>
          The <Green>Dendro DMG Bonus</Green> of the character under the effect of Overflowing
          Lotuslight as created by the Lea Lotus Lamp is increased by <Green b>12%</Green>. If the
          Lamp has experienced a Lotuslight Transfiguration previously, the character will also gain{" "}
          <Green b>12%</Green> <Green>DMG Bonus</Green> for the corresponding element.
        </>
      ),
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => DendroMC.passiveTalents[1].desc,
      isGranted: checkAscs[4],
      applyBuff: ({ desc, attPattBonus, totalAttr, tracker }) => {
        const buffValue1 = totalAttr.em * 0.15;
        const buffValue2 = totalAttr.em * 0.1;
        applyModifier(desc, attPattBonus, ["ES.pct", "EB.pct"], [buffValue1, buffValue2], tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      desc: () => DendroMC.passiveTalents[0].desc,
      isGranted: checkAscs[1],
      affect: EModAffect.ACTIVE_UNIT,
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
      desc: () => DendroMC.constellation[5].desc,
      isGranted: checkCons[6],
      affect: EModAffect.ACTIVE_UNIT,
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

export default DendroMC;

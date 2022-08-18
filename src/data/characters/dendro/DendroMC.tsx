import type { DataCharacter, Vision } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModifierSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { applyModifier } from "@Src/calculators/utils";
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
      image: "",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", baseMult: 230.4 }],
      // getExtraStats: () => [{ name: "CD", value: "8s" }],
    },
    EB: {
      name: "Surgent Manifestation",
      image: "",
      xtraLvAtCons: 5,
      stats: [
        { name: "Lea Lotus Lamp Attack DMG", baseMult: 80.16 },
        { name: "Explosion DMG", dmgTypes: ["EB", "various"], baseMult: 400.8 },
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
      image: "",
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
      image: "",
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
      name: "Parasitic Creeper",
      image: "",
      desc: (
        <>
          After Razorgrass Blade hits an opponent, it will regenerate <Green b>3.5</Green>{" "}
          <Green>Energy</Green> for the Traveler.
        </>
      ),
    },
    {
      name: "Green Resilience",
      image: "",
      desc: (
        <>
          Lea Lotus Lamp's <Green>duration</Green> is increased by <Green>3s</Green>.
        </>
      ),
    },
    { name: "Whirling Weeds", image: "" },
    {
      name: "Treacle Grass",
      image: "",
      desc: (
        <>
          After the Lea Lotus Lamp triggers a Lotuslight Transfiguration, it will obtain 5 stacks of
          the Overflowing Lotuslight effect from the Passive Talent "Verdant Overgrowth."
          <br />
          You must have unlocked this Passive Talent first.
        </>
      ),
    },
    { name: "Viridian Transience", image: "" },
    {
      name: "Withering Aggregation",
      image: "",
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
  buffs: [
    {
      index: 0,
      src: EModifierSrc.A1,
      desc: () => DendroMC.passiveTalents[0].desc,
      isGranted: checkAscs[1],
      affect: EModAffect.PARTY,
      inputConfig: {
        labels: ["Stacks"],
        selfLabels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [10],
      },
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        applyModifier(desc, totalAttr, "em", 6 * +inputs![0], tracker);
      },
    },
    {
      index: 1,
      src: EModifierSrc.A4,
      desc: () => DendroMC.passiveTalents[1].desc,
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      applyBuff: ({ desc, attPattBonus, totalAttr, tracker }) => {
        const buffValue1 = totalAttr.em * 0.15;
        const buffValue2 = totalAttr.em * 0.1;
        applyModifier(desc, attPattBonus, ["ES.pct", "EB.pct"], [buffValue1, buffValue2], tracker);
      },
    },
    {
      index: 2,
      src: EModifierSrc.C6,
      desc: () => DendroMC.constellation[5].desc,
      isGranted: checkCons[6],
      affect: EModAffect.PARTY,
      inputConfig: {
        labels: ["Element contact"],
        selfLabels: ["Element contact"],
        renderTypes: ["dendroable"],
        initialValues: ["Pyro"],
      },
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        applyModifier(desc, totalAttr, ["dendro", inputs![0] as Vision], 12, tracker);
      },
    },
  ],
};

export default DendroMC;

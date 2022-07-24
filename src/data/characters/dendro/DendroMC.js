import { addAndTrack } from "../../../calculators/helpers";
import { Green } from "../../../styledCpns/DataDisplay";
import { SwordDesc, TravelerInfo, TravelerNCPAs } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const DendroMC = {
  ...TravelerInfo,
  code: 57,
  name: "Dendro Traveler",
  vision: "Dendro",
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Foreign Fieldcleaver",
      desc: SwordDesc,
      stats: TravelerNCPAs
    },
    {
      type: "Elemental Skill",
      name: "Razorgrass Blade",
      image: "",
      desc: [],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 230.4,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "8s" }]
    },
    {
      type: "Elemental Burst",
      name: "Surgent Manifestation",
      image: "",
      desc: [],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Lea Lotus Lamp Attack DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 80.16,
          multType: 2
        },
        {
          name: "Explosion DMG",
          dmgTypes: ["EB", "Various"],
          baseMult: 400.8,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Lea Lotus Lamp Duration", value: "12s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Verdant Overgrowth",
      image: "",
      desc: (
        <>
          Lea Lotus Lamp will obtain one level of Overflowing Lotuslight every
          second it is on the field, increasing the{" "}
          <Green>Elemental Mastery</Green> of active character(s) within its AoE
          by <Green b>6</Green>. Overflowing Lotuslight has a maximum of{" "}
          <Green b>10</Green> <Green>stacks</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Verdant Luxury",
      image: "",
      desc: (
        <>
          Every point of Elemental Mastery the Traveler possesses increases the
          DMG dealt by <Green>Razorgrass Blade</Green> by <Green b>0.15%</Green>{" "}
          and the DMG dealt by <Green>Surgent Manifestation</Green> by{" "}
          <Green b>0.1%</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Parasitic Creeper",
      image: "",
      desc: (
        <>
          After Razorgrass Blade hits an opponent, it will regenerate{" "}
          <Green b>3.5</Green> <Green>Energy</Green> for the Traveler.
        </>
      )
    },
    {
      name: "Green Resilience",
      image: "",
      desc: (
        <>
          Lea Lotus Lamp's <Green>duration</Green> is increased by{" "}
          <Green>3s</Green>.
        </>
      )
    },
    {
      name: "Whirling Weeds",
      image: "",
      desc: "Razorgrass Blade"
    },
    {
      name: "Treacle Grass",
      image: "",
      desc: (
        <>
          After the Lea Lotus Lamp triggers a Lotuslight Transfiguration, it
          will obtain 5 stacks of the Overflowing Lotuslight effect from the
          Passive Talent "Verdant Overgrowth."
          <br />
          You must have unlocked this Passive Talent first.
        </>
      )
    },
    {
      name: "Viridian Transience",
      image: "",
      desc: "Surgent Manifestation"
    },
    {
      name: "Withering Aggregation",
      image: "",
      desc: (
        <>
          The <Green>Dendro DMG Bonus</Green> of the character under the effect
          of Overflowing Lotuslight as created by the Lea Lotus Lamp is
          increased by <Green b>12%</Green>. If the Lamp has experienced a
          Lotuslight Transfiguration previously, the character will also gain{" "}
          <Green b>12%</Green> <Green>DMG Bonus</Green> for the corresponding
          element.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => DendroMC.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "party",
      labels: ["Stacks"],
      selfLabels: ["Stacks"],
      inputTypes: ["select"],
      inputs: [1],
      maxs: [10],
      addBnes: ({ tkDesc, ATTRs, inputs, tracker }) => {
        const bnValue = 6 * inputs[0];
        addAndTrack(tkDesc, ATTRs, "Elemental Mastery", bnValue, tracker);
      }
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => DendroMC.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: ({ tkDesc, hitBnes, ATTRs, tracker }) => {
        const bnValue1 = ATTRs["Elemental Mastery"] * 0.15;
        const bnValue2 = ATTRs["Elemental Mastery"] * 0.1;
        addAndTrack(
          tkDesc,
          hitBnes,
          ["ES.pct", "EB.pct"],
          [bnValue1, bnValue2],
          tracker
        );
      }
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => DendroMC.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "party",
      labels: ["Element contact"],
      selfLabels: ["Element contact"],
      inputTypes: ["dendroable"],
      inputs: ["Pyro"],
      addBnes: ({ tkDesc, ATTRs, inputs, tracker }) => {
        const paths = ["Dendro DMG Bonus", inputs[0] + " DMG Bonus"];
        const bnValue = 12;
        addAndTrack(tkDesc, ATTRs, paths, bnValue, tracker);
      }
    }
  ]
};

export default DendroMC;

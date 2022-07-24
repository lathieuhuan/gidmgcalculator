import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { cryoDmg, Green } from "../../../styledCpns/DataDisplay";
import { BowNaDesc_6, BowPaDesc, lightPAs_Bow } from "../config";
import {
  checkAscs,
  checkCharMC,
  checkCons,
  makeTlBnes,
  xtraTlLv
} from "../helpers";

const tlBnes_ascs1 = ({ char, selfMCs }) =>
  makeTlBnes(
    checkCharMC(Ganyu.buffs, char, selfMCs.BCs, 0),
    "cRate",
    [1, 1],
    20
  );

const Ganyu = {
  code: 28,
  name: "Ganyu",
  icon: "0/0a/Character_Ganyu_Thumb",
  sideIcon: "e/e1/Character_Ganyu_Side_Icon",
  rarity: 5,
  nation: "Liyue",
  vision: "Cryo",
  weapon: "Bow",
  stats: [
    { "Base HP": 763, "Base ATK": 26, "Base DEF": 49 },
    { "Base HP": 1978, "Base ATK": 68, "Base DEF": 127 },
    { "Base HP": 2632, "Base ATK": 90, "Base DEF": 169 },
    { "Base HP": 3939, "Base ATK": 135, "Base DEF": 253 },
    { "Base HP": 4403, "Base ATK": 151, "Base DEF": 283, "CRIT DMG": 9.6 },
    { "Base HP": 5066, "Base ATK": 173, "Base DEF": 326, "CRIT DMG": 9.6 },
    { "Base HP": 5686, "Base ATK": 194, "Base DEF": 366, "CRIT DMG": 19.2 },
    { "Base HP": 6355, "Base ATK": 217, "Base DEF": 409, "CRIT DMG": 19.2 },
    { "Base HP": 6820, "Base ATK": 233, "Base DEF": 439, "CRIT DMG": 19.2 },
    { "Base HP": 7495, "Base ATK": 256, "Base DEF": 482, "CRIT DMG": 19.2 },
    { "Base HP": 7960, "Base ATK": 272, "Base DEF": 512, "CRIT DMG": 28.8 },
    { "Base HP": 8643, "Base ATK": 295, "Base DEF": 556, "CRIT DMG": 28.8 },
    { "Base HP": 9108, "Base ATK": 311, "Base DEF": 586, "CRIT DMG": 38.4 },
    { "Base HP": 9797, "Base ATK": 335, "Base DEF": 630, "CRIT DMG": 38.4 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Liutian Archery",
      desc: [
        BowNaDesc_6,
        {
          heading: "CA",
          content: (
            <>
              Perform a more precise Aimed Shot with increased DMG.
              <br />
              While aiming, an icy aura will accumulate on the arrowhead before
              the arrow is fired. Has different effects based on how long the
              energy has been charged:
              <br />• Charge Level 1: Fires off an icy arrow that deals{" "}
              {cryoDmg}.
              <br />• Charge Level 2: Fires off a Frostflake Arrow that deals{" "}
              {cryoDmg}. The Frostflake Arrow blooms after hitting its target,
              dealing AoE {cryoDmg}.
            </>
          )
        },
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 31.73,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 35.6,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 45.49,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 45.49,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 48.25,
          multType: 1
        },
        {
          name: "6-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 57.62,
          multType: 1
        },
        {
          name: "Aimed Shot",
          dmgTypes: ["CA", "Physical"],
          baseMult: 43.86,
          multType: 1
        },
        {
          name: "Aimed Shot Charged Level 1",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 124,
          multType: 2
        },
        {
          name: "Frostflake Arrow",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 128,
          multType: 2,
          getTlBnes: tlBnes_ascs1
        },
        {
          name: "Frostflake Arrow Bloom",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 217.6,
          multType: 2,
          getTlBnes: tlBnes_ascs1
        },
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Trail of the Qilin",
      image: "d/d1/Talent_Trail_of_the_Qilin",
      getXtraLv: xtraTlLv.cons5,
      desc: [
        {
          content: (
            <>
              Leaving a single Ice Lotus behind, Ganyu dashes backward, shunning
              all impurity and dealing AoE {cryoDmg}.
            </>
          )
        },
        {
          heading: "Ice Lotus",
          content: (
            <>
              • Continuously taunts surrounding opponents, attracting them to
              attack it.
              <br />• Endurance scales based on Ganyu's Max HP.
              <br />• Blooms profusely when destroyed or once its duration ends,
              dealing AoE {cryoDmg}.
            </>
          )
        }
      ],
      stats: [
        {
          name: "Inherited HP",
          baseSType: "HP",
          baseMult: 120,
          multType: 2
        },
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 132,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "6s" },
        { name: "CD", value: "10s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Celestial Shower",
      image: "4/47/Talent_Celestial_Shower",
      desc: [
        {
          content: (
            <>
              Coalesces atmospheric frost and snow to summon a Sacred Cryo Pearl
              that exorcises evil.
              <br />
              During its ability duration, the Sacred Cryo Pearl will
              continuously rain down shards of ice, striking opponents within an
              AoE and dealing {cryoDmg}.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Ice shard DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 70.27,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "15s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Undivided Heart",
      image: "a/a3/Talent_Undivided_Heart",
      desc: (
        <>
          After firing a Frostflake Arrow, the <Green>CRIT Rate</Green> of
          subsequent <Green>Frostflake Arrows</Green> and their resulting{" "}
          <Green>bloom effects</Green> is increased by <Green b>20%</Green> for
          5s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Harmony between Heaven and Earth",
      image: "d/d4/Talent_Harmony_between_Heaven_and_Earth",
      desc: (
        <>
          Celestial Shower grants a <Green b>20%</Green>{" "}
          <Green>Cryo DMG Bonus</Green> to active members in the AoE.
        </>
      )
    },
    {
      type: "Passive",
      name: "Preserved for the Hunt",
      image: "c/cf/Talent_Preserved_for_the_Hunt",
      desc: (
        <>
          Refunds <Green b>15%</Green> of the <Green>ores</Green> used when
          crafting <Green>Bow-type</Green> weapons.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Dew-Drinker",
      image: "7/74/Constellation_Dew-Drinker",
      get desc() {
        return (
          <>
            {this.debuff}
            <br />A hit also regenerates <Green b>2</Green>{" "}
            <Green>Energy</Green> for Ganyu. This effect can only occur once per
            Charge Level 2 Frostflake Arrow, regardless if Frostflake Arrow
            itself or its Bloom hits the target.
          </>
        );
      },
      debuff: (
        <>
          Charge Level 2 Frostflake Arrows or Frostflake Arrow Blooms decrease
          opponents' <Green>Cryo RES</Green> by <Green b>15%</Green> for 6s upon
          hit.
        </>
      )
    },
    {
      name: "The Auspicious",
      image: "d/d9/Constellation_The_Auspicious",
      desc: (
        <>
          Trail of the Qilin gains <Green b>1</Green>{" "}
          <Green>additional charge</Green>.
        </>
      )
    },
    {
      name: "Cloud-Strider",
      image: "b/bf/Constellation_Cloud-Strider",
      desc: "Celestial Shower"
    },
    {
      name: "Westward Sojourn",
      image: "e/e0/Constellation_Westward_Sojourn",
      get desc() {
        return (
          <>
            {this.buff}
            <br />
            The effect lingers for 3s after the opponent leaves the AoE.
          </>
        );
      },
      buff: (
        <>
          Opponents within Celestial Shower take increased DMG. This effect
          strengthens over time. Increased <Green>DMG</Green> taken begins at{" "}
          <Green b>5%</Green> and increases by <Green b>5%</Green> every 3s, up
          to a maximum of <Green b>25%</Green>.
        </>
      )
    },
    {
      name: "The Merciful",
      image: "5/57/Constellation_The_Merciful",
      desc: "Trail of the Qilin"
    },
    {
      name: "The Clement",
      image: "b/b5/Constellation_The_Clement",
      desc: (
        <>
          Using Trail of the Qilin causes the next Frostflake Arrow shot within
          30s to <Green>not require charging</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Ganyu.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "self"
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Ganyu.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Cryo DMG Bonus", 20)
    },
    {
      index: 2,
      src: "Constellation 4",
      desc: () => Ganyu.constellation[3].buff,
      isGranted: checkCons[4],
      affect: "party",
      selfLabels: ["Stacks"],
      labels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [5],
      addBnes: ({ hitBnes, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "All.pct", 5 * inputs[0], tracker);
      }
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 1",
      desc: () => Ganyu.constellation[0].debuff,
      isGranted: checkCons[1],
      addPntes: simpleAnTmaker("rdMult", "Cryo_rd", 15)
    }
  ]
};

export default Ganyu;

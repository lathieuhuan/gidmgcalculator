import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { Electro, electroDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, SwordDesc } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Keqing = {
  code: 9,
  name: "Keqing",
  icon: "0/06/Character_Keqing_Thumb",
  sideIcon: "b/ba/Character_Keqing_Side_Icon",
  rarity: 5,
  nation: "Liyue",
  vision: "Electro",
  weapon: "Sword",
  stats: [
    { "Base HP": 1020, "Base ATK": 25, "Base DEF": 62 },
    { "Base HP": 2646, "Base ATK": 65, "Base DEF": 161 },
    { "Base HP": 3521, "Base ATK": 87, "Base DEF": 215 },
    { "Base HP": 5268, "Base ATK": 130, "Base DEF": 321 },
    { "Base HP": 5889, "Base ATK": 145, "Base DEF": 359, "CRIT DMG": 9.6 },
    { "Base HP": 6776, "Base ATK": 167, "Base DEF": 413, "CRIT DMG": 9.6 },
    { "Base HP": 7604, "Base ATK": 187, "Base DEF": 464, "CRIT DMG": 19.2 },
    { "Base HP": 8500, "Base ATK": 209, "Base DEF": 519, "CRIT DMG": 19.2 },
    { "Base HP": 9121, "Base ATK": 225, "Base DEF": 556, "CRIT DMG": 19.2 },
    { "Base HP": 10025, "Base ATK": 247, "Base DEF": 612, "CRIT DMG": 19.2 },
    { "Base HP": 10647, "Base ATK": 262, "Base DEF": 649, "CRIT DMG": 28.8 },
    { "Base HP": 11561, "Base ATK": 285, "Base DEF": 705, "CRIT DMG": 28.8 },
    { "Base HP": 12182, "Base ATK": 300, "Base DEF": 743, "CRIT DMG": 38.4 },
    { "Base HP": 13103, "Base ATK": 323, "Base DEF": 799, "CRIT DMG": 38.4 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Yunlai Swordsmanship",
      desc: SwordDesc,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 41.02,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 41.02,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 54.44,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: [31.48, 34.4],
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 66.99,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: [76.8, 86],
          multType: 1
        },
        CaStamina[25],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Stellar Restoration",
      image: "5/5a/Talent_Stellar_Restoration",
      desc: [
        {
          content: (
            <>
              Hurls a Lightning Stiletto that annihilates her opponents like the
              swift thunder.
              <br />
              When the Stiletto hits its target, it deals {electroDmg} to
              opponents in a small AoE, and places a Stiletto Mark on the spot
              hit.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Hold to adjust the direction in which the Stiletto shall be
              thrown.
              <br />
              Stilettos thrown by the Hold attack mode can be suspended in
              mid-air, allowing Keqing to jump to them when using Stellar
              Restoration a second time.
            </>
          )
        },
        {
          heading: "Lightning Stiletto",
          content: (
            <>
              If Keqing uses Stellar Restoration again or uses a Charged Attack
              while its duration lasts, it will clear the Stiletto Mark and
              produce different effects:
              <br />• If she uses Stellar Restoration again, she will blink to
              the location of the Mark and unleash one slashing attack that
              deals AoE {electroDmg}. When blinking to a Stiletto that was
              thrown from a Holding attack, Keqing can leap across obstructing
              terrain.
              <br />• If Keqing uses a Charged Attack, she will ignite a series
              of thundering cuts at the Mark's location, dealing AoE{" "}
              {electroDmg}.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Lightning Stiletto",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 50.4,
          multType: 2
        },
        {
          name: "Slashing / Thunderclap Slash DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 168,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "7.5s" }]
    },
    {
      type: "Elemental Burst",
      name: "Starward Sword",
      image: "1/14/Talent_Starward_Sword",
      desc: [
        {
          content: (
            <>
              Keqing unleashes the power of lightning, dealing {electroDmg} in
              an AOE.
              <br />
              She then blends into the shadow of her blade, striking a series of
              thunderclap-blows to nearby opponents simultaneously that deal
              multiple instances of {electroDmg}. The final attack deals massive
              AoE {electroDmg}.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 88,
          multType: 2
        },
        {
          name: "Consecutive Slash (1/8)",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 24,
          multType: 2
        },
        {
          name: "Last Attack",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 188.8,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "12s" }],
      energyCost: 40
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Thundering Penance",
      image: "a/a4/Talent_Thundering_Penance",
      desc: (
        <>
          After recasting Stellar Restoration while a Lightning Stiletto is
          present, Keqing's weapon gains an <Electro>Electro</Electro>{" "}
          <Green>Infusion</Green> for 5s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Aristocratic Dignity",
      image: "d/d3/Talent_Aristocratic_Dignity",
      desc: (
        <>
          When casting Starward Sword, Keqing's <Green>CRIT Rate</Green> and{" "}
          <Green>Energy Recharge</Green> are increased by <Green b>15%</Green>.
          This effect lasts for 8s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Land's Overseer",
      image: "2/2c/Talent_Land%27s_Overseer",
      desc: (
        <>
          When dispatched on an <Green>expedition</Green> in Liyue,{" "}
          <Green>time consumed</Green> is reduced by <Green b>25%</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Thundering Might",
      image: "c/cc/Constellation_Thundering_Might",
      desc: (
        <>
          Recasting Stellar Restoration while a Lightning Stiletto is present
          causes Keqing to deal <Green b>50%</Green> of her <Green>ATK</Green>{" "}
          as AoE {electroDmg} at the start point and terminus of her Blink.
        </>
      )
    },
    {
      name: "Keen Extraction",
      image: "0/07/Constellation_Keen_Extraction",
      desc: (
        <>
          When Keqing's Normal and Charged Attacks hit opponents affected by
          Electro, they have a <Green b>50%</Green> <Green>chance</Green> of
          producing <Green>an Elemental Particle</Green>.
          <br />
          This effect can only occur once every 5s.
        </>
      )
    },
    {
      name: "Foreseen Reformation",
      image: "4/49/Constellation_Foreseen_Reformation",
      desc: "Starward Sword"
    },
    {
      name: "Attunement",
      image: "a/ac/Constellation_Attunement",
      desc: (
        <>
          For 10s after Keqing triggers an Electro-related Elemental Reaction,
          her <Green>ATK</Green> is increased by <Green b>25%</Green>.
        </>
      )
    },
    {
      name: "Beckoning Stars",
      image: "3/35/Constellation_Beckoning_Stars",
      desc: "Stellar Restoration"
    },
    {
      name: "Tenacious Star",
      image: "b/b9/Constellation_Tenacious_Star",
      desc: (
        <>
          When initiating a Normal Attack, a Charged Attack, Elemental Skill or
          Elemental Burst, Keqing gains a <Green b>6%</Green>{" "}
          <Green>Electro DMG Bonus</Green> for 8s. Effects triggered by Normal
          Attacks, Charged Attacks, Elemental Skills and Elemental Bursts are
          considered independent entities.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Keqing.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "self",
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: true
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Keqing.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", ["CRIT Rate", "Energy Recharge"], 15)
    },
    {
      index: 2,
      src: "Constellation 4",
      desc: () => Keqing.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "ATK%", 25)
    },
    {
      index: 3,
      src: "Constellation 6",
      desc: () => Keqing.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [4],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        const bnValue = 6 * inputs[0];
        addAndTrack(tkDesc, ATTRs, "Electro DMG Bonus", bnValue, tracker);
      }
    }
  ]
};

export default Keqing;

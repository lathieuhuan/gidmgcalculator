import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { getFinalTlLv } from "../../../helpers";
import { Green, hydroDmg, Red, Span } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  CatalystCaDesc_Hydro,
  CatalystPaDesc,
  lightPAs_Catalyst
} from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Mona = {
  code: 16,
  name: "Mona",
  icon: "a/a0/Character_Mona_Thumb",
  sideIcon: "1/1a/Character_Mona_Side_Icon",
  rarity: 5,
  nation: "Mondstadt",
  vision: "Hydro",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 810, "Base ATK": 22, "Base DEF": 51 },
    { "Base HP": 2102, "Base ATK": 58, "Base DEF": 132 },
    { "Base HP": 2797, "Base ATK": 77, "Base DEF": 176 },
    { "Base HP": 4185, "Base ATK": 115, "Base DEF": 263 },
    { "Base HP": 4678, "Base ATK": 129, "Base DEF": 294, "Energy Recharge": 8 },
    { "Base HP": 5383, "Base ATK": 148, "Base DEF": 338, "Energy Recharge": 8 },
    {
      "Base HP": 6041,
      "Base ATK": 167,
      "Base DEF": 379,
      "Energy Recharge": 16
    },
    {
      "Base HP": 6752,
      "Base ATK": 186,
      "Base DEF": 424,
      "Energy Recharge": 16
    },
    {
      "Base HP": 7246,
      "Base ATK": 200,
      "Base DEF": 455,
      "Energy Recharge": 16
    },
    {
      "Base HP": 7964,
      "Base ATK": 220,
      "Base DEF": 500,
      "Energy Recharge": 16
    },
    {
      "Base HP": 8458,
      "Base ATK": 233,
      "Base DEF": 531,
      "Energy Recharge": 24
    },
    {
      "Base HP": 9184,
      "Base ATK": 253,
      "Base DEF": 576,
      "Energy Recharge": 24
    },
    {
      "Base HP": 9677,
      "Base ATK": 267,
      "Base DEF": 607,
      "Energy Recharge": 32
    },
    {
      "Base HP": 10409,
      "Base ATK": 287,
      "Base DEF": 653,
      "Energy Recharge": 32
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Ripple of Fate",
      desc: [
        {
          heading: "NA",
          content: (
            <>Perform up to 4 water splash attacks that deal {hydroDmg}.</>
          )
        },
        CatalystCaDesc_Hydro,
        CatalystPaDesc("Hydro", "Kokomi")
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 37.6,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 36,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 44.8,
          multType: 2
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 56.16,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 149.72,
          multType: 2
        },
        CaStamina[50],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Mirror Reflection of Doom",
      image: "4/45/Talent_Mirror_Reflection_of_Doom",
      desc: [
        {
          content: (
            <>Creates an illusory Phantom of Fate from coalesced waterspouts.</>
          )
        },
        {
          content: (
            <>
              The <Span color="lightGold">Phantom</Span> has the following
              special properties:
              <br />• Continuously taunts nearby opponents, attracting their
              fire.
              <br />• Continuously deals {hydroDmg} to nearby opponents.
              <br />• When its duration expires, the Phantom explodes, dealing
              AoE {hydroDmg}.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Utilizes water currents to move backwards swiftly before conjuring
              a Phantom.
            </>
          )
        },
        {
          content: (
            <>
              Only one Phantom created by Mirror Reflection of Doom can exist at
              any time.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "DoT",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 32,
          multType: 2
        },
        {
          name: "Explosion DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 132.8,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "12s" }]
    },
    {
      type: "Elemental Burst",
      name: "Stellaris Phantasm",
      image: "c/c4/Talent_Stellaris_Phantasm",
      desc: [
        {
          content: (
            <>
              Mona summons the sparkling waves and creates a reflection of the
              starry sky, applying the Illusory Bubble status to opponents in a
              large AoE.
            </>
          )
        },
        {
          heading: "Illusory Bubble",
          content: (
            <>
              Traps opponents inside a pocket of destiny and also makes them
              Wet. Renders weaker opponents immobile.
              <br />
              When an opponent affected by Illusory Bubble sustains DMG, it has
              the following effects:
              <br />• Applies an Omen to the opponent, which gives a DMG Bonus,
              also increasing the DMG of the attack that causes it.
              <br />• Removes the Illusory Bubble, dealing {hydroDmg} in the
              process.
            </>
          )
        },
        {
          heading: "Omen",
          content: (
            <>
              During its duration, increases <Green>DMG</Green> taken by
              opponents.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        { name: "", noCalc: true, getValue: () => "8s" },
        {
          name: "Bubble Explosion DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 442.4,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        { name: "DMG Bonus", value: Math.min(40 + lv * 2, 60) + "%" },
        {
          name: "Omen Duration",
          value: Math.min(3.5 + Math.ceil(lv / 3) * 0.5, 5) + "s"
        },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    },
    {
      type: "Alternate Sprint",
      name: "Illusory Torrent",
      image: "9/9a/Talent_Illusory_Torrent",
      desc: [
        {
          heading: "Alternate Sprint",
          content: (
            <>
              Mona cloaks herself within the water's flow, consuming Stamina to
              move rapidly.
            </>
          )
        },
        {
          content: (
            <>
              When under the effect of Illusory Torrent, Mona can move at high
              speed on water.
              <br />
              Applies the Wet status to nearby opponents when she reappears.
            </>
          )
        }
      ],
      stats: [],
      otherStats: () => [
        { name: "Activation Stamina Consumption", value: 10 },
        { name: "Stamina Drain", value: "15/s" }
      ]
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Come 'n' Get Me, Hag!",
      image: `8/8f/Talent_"Come_%27n%27_Get_Me%2C_Hag%21"`,
      desc: (
        <>
          After she has used Illusory Torrent for 2s, if there are any opponents
          nearby, Mona will automatically create a Phantom.
          <br />A Phantom created in this manner lasts for 2s, and its explosion
          DMG is equal to 50% of Mirror Reflection of Doom.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Waterborne Destiny",
      image: "6/6a/Talent_Waterborne_Destiny",
      desc: (
        <>
          Increases Mona's <Green>Hydro DMG Bonus</Green> by a degree equivalent
          to <Green b>20%</Green> of her <Green>Energy Recharge</Green> rate.
        </>
      )
    },
    {
      type: "Passive",
      name: "Principium of Astrology",
      image: "4/48/Talent_Principium_of_Astrology",
      desc: (
        <>
          When Mona crafts <Green>Weapon Ascension Materials</Green>, she has a{" "}
          <Green b>25%</Green> <Green>chance</Green> to refund{" "}
          <Green b>one</Green> <Green>count</Green> of one material out of all
          the crafting materials used.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Prophecy of Submersion",
      image: "2/27/Constellation_Prophecy_of_Submersion",
      desc: (
        <>
          When any of your own party members hits an opponent affected by an
          Omen, <Green>Electro-Charged DMG</Green>, <Green>Vaporize DMG</Green>,{" "}
          <Green>Hydro Swirl DMG</Green>, and <Green>Frozen duration</Green> are
          increased by <Green b>15%</Green> for 8s.
        </>
      )
    },
    {
      name: "Lunar Chain",
      image: "1/16/Constellation_Lunar_Chain",
      desc: (
        <>
          When a Normal Attack hits, there is a <Green b>20%</Green>{" "}
          <Green>chance</Green> that it will be automatically followed by a
          Charged Attack.
          <br />
          This effect can only occur once every 5s.
        </>
      )
    },
    {
      name: "Restless Revolution",
      image: "2/2a/Constellation_Restless_Revolution",
      desc: "Stellaris Phantasm"
    },
    {
      name: "Prophecy of Oblivion",
      image: "3/38/Constellation_Prophecy_of_Oblivion",
      desc: (
        <>
          When any party member attacks an opponent affected by an Omen, their{" "}
          <Green>CRIT Rate</Green> is increased by <Green b>15%</Green>.
        </>
      )
    },
    {
      name: "Mockery of Fortuna",
      image: "b/bd/Constellation_Mockery_of_Fortuna",
      desc: "Mirror Reflection of Doom"
    },
    {
      name: "Rhetorics of Calamitas",
      image: "6/62/Constellation_Rhetorics_of_Calamitas",
      desc: (
        <>
          Upon entering Illusory Torrent, Mona gains a <Green b>60%</Green>{" "}
          <Green>DMG increase</Green> of her next <Green>Charged Attack</Green>{" "}
          per second of movement (up to <Green b>180%</Green>) for 8s.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: (obj) => (
        <>
          Omen increases <Green b>{Mona.buffs[0].bnValue(obj)}%</Green>{" "}
          <Green>DMG taken</Green> by opponents. (This is actually a DMG bonus.)
        </>
      ),
      isGranted: () => true,
      affect: "party",
      labels: ["Elemental Burst Level"],
      inputs: [1],
      inputTypes: ["text"],
      maxs: [13],
      addBnes: ({ hitBnes, tkDesc, tracker, ...rest }) => {
        const bnValue = Mona.buffs[0].bnValue(rest);
        addAndTrack(tkDesc, hitBnes, "All.pct", bnValue, tracker);
      },
      bnValue: ({ toSelf, char, partyData, inputs }) => {
        const level = toSelf
          ? getFinalTlLv(char, Mona.actvTalents[2], partyData)
          : inputs[0];
        return level ? Math.min(40 + level * 2, 60) : 0;
      }
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: ({ ATTRs }) => (
        <>
          {Mona.pasvTalents[1].desc}{" "}
          <Red>Hydro DMG Bonus: {Mona.buffs[1].bnValue(ATTRs)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: ({ ATTRs, tkDesc, tracker }) => {
        const bnValue = Mona.buffs[1].bnValue(ATTRs);
        addAndTrack(tkDesc, ATTRs, "Hydro DMG Bonus", bnValue, tracker);
      },
      bnValue: (ATTRs) => Math.round(ATTRs["Energy Recharge"] * 2) / 10
    },
    {
      index: 2,
      src: "Constellation 1",
      desc: () => Mona.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "party",
      addBnes: simpleAnTmaker(
        "rxnBnes",
        ["Electro-Charged", "Swirl", "Vaporize"],
        15
      )
    },
    {
      index: 3,
      src: "Constellation 4",
      desc: () => Mona.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "CRIT Rate", 15)
    },
    {
      index: 4,
      src: "Constellation 6",
      desc: () => Mona.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [3],
      addBnes: ({ hitBnes, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "CA.pct", 60 * inputs[0], tracker);
      }
    }
  ]
};

export default Mona;

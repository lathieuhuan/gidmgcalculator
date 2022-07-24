import { simpleAnTmaker } from "../../../calculators/helpers";
import { electroDmg, Green } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  CatalystCaDesc_Electro,
  CatalystPaDesc,
  lightPAs_Catalyst
} from "../config";
import { checkAscs, xtraTlLv } from "../helpers";

const Lisa = {
  code: 10,
  name: "Lisa",
  icon: "5/51/Character_Lisa_Thumb",
  sideIcon: "e/e6/Character_Lisa_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Electro",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 802, "Base ATK": 19, "Base DEF": 48 },
    { "Base HP": 2061, "Base ATK": 50, "Base DEF": 123 },
    { "Base HP": 2661, "Base ATK": 64, "Base DEF": 159 },
    { "Base HP": 3985, "Base ATK": 96, "Base DEF": 239 },
    {
      "Base HP": 4411,
      "Base ATK": 107,
      "Base DEF": 264,
      "Elemental Mastery": 24
    },
    {
      "Base HP": 5074,
      "Base ATK": 123,
      "Base DEF": 304,
      "Elemental Mastery": 24
    },
    {
      "Base HP": 5642,
      "Base ATK": 136,
      "Base DEF": 338,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 6305,
      "Base ATK": 153,
      "Base DEF": 378,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 6731,
      "Base ATK": 163,
      "Base DEF": 403,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 7393,
      "Base ATK": 179,
      "Base DEF": 443,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 7818,
      "Base ATK": 189,
      "Base DEF": 468,
      "Elemental Mastery": 72
    },
    {
      "Base HP": 8481,
      "Base ATK": 205,
      "Base DEF": 508,
      "Elemental Mastery": 72
    },
    {
      "Base HP": 8907,
      "Base ATK": 215,
      "Base DEF": 534,
      "Elemental Mastery": 96
    },
    {
      "Base HP": 9570,
      "Base ATK": 232,
      "Base DEF": 573,
      "Elemental Mastery": 96
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Lightning Touch",
      desc: [
        {
          heading: "NA",
          content: (
            <>Perform up to 4 lightning attacks that deal {electroDmg}.</>
          )
        },
        CatalystCaDesc_Electro,
        CatalystPaDesc("Electro", "Lisa")
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 39.6,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 35.92,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 42.8,
          multType: 2
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 54.96,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 177.12,
          multType: 2
        },
        CaStamina[50],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Violet Arc",
      image: "c/c8/Talent_Violet_Arc",
      desc: [
        {
          content: (
            <>
              Channels the power of lightning to sweep bothersome matters away.
            </>
          )
        },
        {
          heading: "Press",
          content: (
            <>
              Releases a homing Lightning Orb. On hit, it deals {electroDmg} and
              applies a stack of the Conductive status (max 3 stacks) to
              opponents in a small AoE.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              After an extended casting time, calls down lightning from the
              heavens, dealing massive {electroDmg} to all nearby opponents.
              <br />
              Deals great amounts of extra damage to opponents based on the
              number of Conductive stacks applied to them, and clears their
              Conductive status.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Press DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 80,
          multType: 2
        },
        { name: "Press CD", noCalc: true, getValue: () => "1s" },
        {
          name: "0-stack Hold",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 320,
          multType: 2
        },
        {
          name: "1-stack Hold",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 368,
          multType: 2
        },
        {
          name: "2-stack Hold",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 424,
          multType: 2
        },
        {
          name: "3-stack Hold",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 487.2,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "Hold CD", value: "16s" }]
    },
    {
      type: "Elemental Burst",
      name: "Lightning Rose",
      image: "f/fd/Talent_Lightning_Rose",
      desc: [
        {
          content: (
            <>
              Summons a Lightning Rose that unleashes powerful lightning bolts,
              launching surrounding opponents and dealing {electroDmg}.
              <br />
              The Lightning Rose will continuously emit lightning to knock back
              opponents and deal {electroDmg} throughout the ability's duration.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Discharge DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 36.56,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "15s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Induced Aftershock",
      image: "4/48/Talent_Induced_Aftershock",
      desc: (
        <>
          Hits by Charged Attacks apply Violet Arc's Conductive status to
          opponents.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Static Electricity Field",
      image: "9/9a/Talent_Static_Electricity_Field",
      desc: (
        <>
          Opponents hit by Lightning Rose have their <Green>DEF</Green>{" "}
          decreased by <Green b>15%</Green> for 10s.
        </>
      )
    },
    {
      type: "Passive",
      name: "General Pharmaceutics",
      image: "7/7c/Talent_General_Pharmaceutics",
      desc: (
        <>
          When Lisa crafts a <Green>potion</Green>, she has a{" "}
          <Green b>20%</Green> <Green>chance</Green> to refund{" "}
          <Green b>one</Green> <Green>count</Green> of one material out of all
          the crafting materials used.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Infinite Circuit",
      image: "1/13/Constellation_Infinite_Circuit",
      desc: (
        <>
          Lisa regenerates <Green b>2</Green> <Green>Energy</Green> for every
          opponent hit while holding Violet Arc.
          <br />A <Green>maximum</Green> of <Green b>10</Green>{" "}
          <Green>Energy</Green> can be regenerated in this manner at any one
          time.
        </>
      )
    },
    {
      name: "Electromagnetic Field",
      image: "f/f5/Constellation_Electromagnetic_Field",
      desc: (
        <>
          Holding Violet Arc has the following effects:
          <br />• Increases <Green>DEF</Green> by <Green b>25%</Green>.
          <br />• Increases Lisa's resistance to interruption.
        </>
      )
    },
    {
      name: "Resonant Thunder",
      image: "d/de/Constellation_Resonant_Thunder",
      desc: "Lightning Rose"
    },
    {
      name: "Plasma Eruption",
      image: "2/2b/Constellation_Plasma_Eruption",
      desc: (
        <>
          Increases the <Green>number of lightning bolts</Green> released by
          Lightning Rose by <Green b>1-3</Green>.
        </>
      )
    },
    {
      name: "Electrocute",
      image: "1/1d/Constellation_Electrocute",
      desc: "Violet Arc"
    },
    {
      name: "Pulsating Witch",
      image: "f/f4/Constellation_Pulsating_Witch",
      desc: (
        <>
          When Lisa takes the field, she applies <Green b>3</Green>{" "}
          <Green>stacks</Green> of Violet Arc's Conductive status onto nearby
          opponents.
          <br />
          This effect can only occur once every 5s.
        </>
      )
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: () => Lisa.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      addPntes: simpleAnTmaker("rdMult", "Def_rd", 15)
    }
  ]
};

export default Lisa;

import { simpleAnTmaker } from "../../../calculators/helpers";
import { Green, pyroDmg } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  CatalystCaDesc_Pyro,
  CatalystPaDesc,
  lightPAs_Catalyst
} from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Klee = {
  code: 23,
  name: "Klee",
  icon: "c/c3/Character_Klee_Thumb",
  sideIcon: "c/c2/Character_Klee_Side_Icon",
  rarity: 5,
  nation: "Mondstadt",
  vision: "Pyro",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 801, "Base ATK": 24, "Base DEF": 48 },
    { "Base HP": 2077, "Base ATK": 63, "Base DEF": 124 },
    { "Base HP": 2764, "Base ATK": 84, "Base DEF": 165 },
    { "Base HP": 4126, "Base ATK": 125, "Base DEF": 247 },
    {
      "Base HP": 4623,
      "Base ATK": 140,
      "Base DEF": 276,
      "Pyro DMG Bonus": 7.2
    },
    {
      "Base HP": 5318,
      "Base ATK": 161,
      "Base DEF": 318,
      "Pyro DMG Bonus": 7.2
    },
    {
      "Base HP": 5970,
      "Base ATK": 180,
      "Base DEF": 357,
      "Pyro DMG Bonus": 14.4
    },
    {
      "Base HP": 6673,
      "Base ATK": 202,
      "Base DEF": 399,
      "Pyro DMG Bonus": 14.4
    },
    {
      "Base HP": 7161,
      "Base ATK": 216,
      "Base DEF": 428,
      "Pyro DMG Bonus": 14.4
    },
    {
      "Base HP": 7870,
      "Base ATK": 238,
      "Base DEF": 470,
      "Pyro DMG Bonus": 14.4
    },
    {
      "Base HP": 8358,
      "Base ATK": 253,
      "Base DEF": 500,
      "Pyro DMG Bonus": 21.6
    },
    {
      "Base HP": 9076,
      "Base ATK": 274,
      "Base DEF": 542,
      "Pyro DMG Bonus": 21.6
    },
    {
      "Base HP": 9563,
      "Base ATK": 289,
      "Base DEF": 572,
      "Pyro DMG Bonus": 28.8
    },
    {
      "Base HP": 10287,
      "Base ATK": 311,
      "Base DEF": 615,
      "Pyro DMG Bonus": 28.8
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Kaboom!",
      desc: [
        {
          heading: "NA",
          content: (
            <>
              Throws things that go boom when they hit things! Perform up to 3
              explosive attacks, dealing AoE {pyroDmg}.
            </>
          )
        },
        CatalystCaDesc_Pyro,
        CatalystPaDesc("Pyro", "Klee")
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 72.16,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 62.4,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 89.92,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 157.36,
          multType: 2
        },
        CaStamina[50],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Jumpy Dumpty",
      image: "3/33/Talent_Jumpy_Dumpty",
      desc: [
        {
          content: (
            <>
              Jumpy Dumpty is tons of boom-bang-fun!
              <br />
              When thrown, Jumpy Dumpty bounces thrice, igniting and dealing AoE{" "}
              {pyroDmg} with every bounce.
            </>
          )
        },
        {
          content: (
            <>
              On the third bounce, the bomb splits into many mines.
              <br />
              The mines will explode upon contact with opponents, or after a
              short period of time, dealing AoE {pyroDmg}.
            </>
          )
        },
        {
          content: <>Starts with 2 charges.</>
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Jumpy Dumpty",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 95.2,
          multType: 2
        },
        {
          name: "Mine DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 32.8,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Mine Durtion", value: "15s" },
        { name: "CD", value: "20s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Sparks 'n' Splash",
      image: "6/64/Talent_Sparks_%27n%27_Splash",
      desc: [
        {
          content: (
            <>
              Klee's Blazing Delight! For the duration of this ability,
              continuously summons Sparks 'n' Splash to attack nearby opponents,
              dealing AoE {pyroDmg}.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Sparks 'n' Splash",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 42.64,
          multType: 2
        },
        {
          name: "Total Max DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 852,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Durtion", value: "10s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Pounding Surprise",
      image: "9/97/Talent_Pounding_Surprise",
      get desc() {
        return (
          <>
            When Jumpy Dumpty and Normal Attacks deal DMG, Klee has a{" "}
            <Green b>50%</Green> <Green>chance</Green> to obtain an Explosive
            Spark.
            <br />
            This {this.buff}
          </>
        );
      },
      buff: (
        <>
          Explosive Spark is consumed by the next <Green>Charged Attacks</Green>
          , which costs no Stamina and deals <Green b>50%</Green> increased{" "}
          <Green>DMG</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Sparkling Burst",
      image: "9/90/Talent_Sparkling_Burst",
      desc: (
        <>
          When Klee's Charged Attack results in a CRIT Hit, all party members
          gain <Green b>2</Green> <Green>Elemental Energy</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "All Of My Treasures!",
      image: "a/ad/Talent_All_Of_My_Treasures%21",
      desc: (
        <>
          Displays the location of nearby <Green>resources</Green> unique to{" "}
          <Green>Mondstadt</Green> on the mini-map.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Chained Reactions",
      image: "a/ac/Constellation_Chained_Reactions",
      desc: (
        <>
          Attacks and Skills have a certain chance to summon sparks that bombard
          opponents, dealing DMG equal to <Green b>120%</Green> of Sparks 'n'
          Splash's <Green>DMG</Green>.
        </>
      )
    },
    {
      name: "Explosive Frags",
      image: "e/e0/Constellation_Explosive_Frags",
      desc: (
        <>
          Being hit by Jumpy Dumpty's mines decreases opponents'{" "}
          <Green>DEF</Green> by <Green b>23%</Green> for 10s.
        </>
      )
    },
    {
      name: "Exquisite Compound",
      image: "6/6f/Constellation_Exquisite_Compound",
      desc: "Jumpy Dumpty"
    },
    {
      name: "Sparkly Explosion",
      image: "3/3a/Constellation_Sparkly_Explosion",
      desc: (
        <>
          If Klee leaves the field during the duration of Sparks 'n' Splash, her
          departure triggers an explosion that deals <Green b>555%</Green> of
          her <Green>ATK</Green> as AoE {pyroDmg}.
        </>
      )
    },
    {
      name: "Nova Burst",
      image: "a/a7/Constellation_Nova_Burst",
      desc: "Sparks 'n' Splash"
    },
    {
      name: "Blazing Delight",
      image: "b/bb/Constellation_Blazing_Delight",
      get desc() {
        return (
          <>
            While under the effects of Sparks 'n' Splash, Klee will regenerate{" "}
            <Green b>3</Green> <Green>Energy</Green> for all members of the
            party (excluding Klee) every 3s.
            <br />
            {this.buff}
          </>
        );
      },
      buff: (
        <>
          When Sparks 'n' Splash is used, all party members will gain a{" "}
          <Green b>10%</Green> <Green>Pyro DMG Bonus</Green> for 25s.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Klee.pasvTalents[0].buff,
      isGranted: checkAscs[1],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "CA.pct", 50)
    },
    {
      index: 1,
      src: "Constellation 6",
      desc: () => Klee.constellation[5].buff,
      isGranted: checkCons[6],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Pyro DMG Bonus", 10)
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => Klee.constellation[1].desc,
      isGranted: checkCons[2],
      addPntes: simpleAnTmaker("rdMult", "Def_rd", 23)
    }
  ]
};

export default Klee;

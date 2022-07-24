import { simpleAnTmaker } from "../../../calculators/helpers";
import { geoDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, CatalystPaDesc, lightPAs_Catalyst } from "../config";
import { checkAscs, xtraTlLv } from "../helpers";

const Ningguang = {
  code: 13,
  name: "Ningguang",
  icon: "2/2b/Character_Ningguang_Thumb",
  sideIcon: "6/64/Character_Ningguang_Side_Icon",
  rarity: 4,
  nation: "Liyue",
  vision: "Geo",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 821, "Base ATK": 18, "Base DEF": 48 },
    { "Base HP": 2108, "Base ATK": 46, "Base DEF": 123 },
    { "Base HP": 2721, "Base ATK": 59, "Base DEF": 159 },
    { "Base HP": 4076, "Base ATK": 88, "Base DEF": 239 },
    { "Base HP": 4512, "Base ATK": 98, "Base DEF": 264, "Geo DMG Bonus": 6 },
    { "Base HP": 5189, "Base ATK": 113, "Base DEF": 304, "Geo DMG Bonus": 6 },
    { "Base HP": 5770, "Base ATK": 125, "Base DEF": 338, "Geo DMG Bonus": 12 },
    { "Base HP": 6448, "Base ATK": 140, "Base DEF": 378, "Geo DMG Bonus": 12 },
    { "Base HP": 6884, "Base ATK": 149, "Base DEF": 403, "Geo DMG Bonus": 12 },
    { "Base HP": 7561, "Base ATK": 164, "Base DEF": 443, "Geo DMG Bonus": 12 },
    { "Base HP": 7996, "Base ATK": 174, "Base DEF": 468, "Geo DMG Bonus": 18 },
    { "Base HP": 8674, "Base ATK": 188, "Base DEF": 508, "Geo DMG Bonus": 18 },
    { "Base HP": 9110, "Base ATK": 198, "Base DEF": 534, "Geo DMG Bonus": 24 },
    { "Base HP": 9787, "Base ATK": 212, "Base DEF": 573, "Geo DMG Bonus": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Sparkling Scatter",
      desc: [
        {
          name: "NA",
          content: (
            <>
              Shoots gems that deal {geoDmg}.
              <br />
              Upon hit, this grants Ningguang 1 Star Jade.
            </>
          )
        },
        {
          name: "CA",
          content: (
            <>
              Consumes a certain amount of stamina to fire off a giant gem that
              deals {geoDmg}.
              <br />
              If Ningguang has any Star Jades, unleashing a Charged Attack will
              cause the Star Jades to be fired at the enemy as well, dealing
              additional DMG.
            </>
          )
        },
        CatalystPaDesc("Geo", "Ningguang")
      ],
      stats: [
        {
          name: "Normal Attack",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 28,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 174.08,
          multType: 2
        },
        {
          name: "DMG per Star Jade",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 49.6,
          multType: 2
        },
        CaStamina[50],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Jade Screen",
      image: "e/e8/Talent_Jade_Screen",
      desc: [
        {
          content: (
            <>
              Ningguang creates a Jade Screen out of gold, obsidian and her
              great opulence, dealing AoE {geoDmg}.
            </>
          )
        },
        {
          name: "Jade Screen",
          content: (
            <>
              • Blocks opponents' projectiles.
              <br />• Endurance scales based on Ningguang's Max HP.
            </>
          )
        },
        {
          content: (
            <>
              Jade Screen is considered a Geo Construct and can be used to block
              certain attacks, but cannot be climbed. Only one Jade Screen may
              exist at any one time.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Inherited HP",
          baseSType: "HP",
          baseMult: 50.1,
          multType: 5
        },
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 230.4,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "12s" }]
    },
    {
      type: "Elemental Burst",
      name: "Starshatter",
      image: "4/47/Talent_Starshatter",
      desc: [
        {
          content: (
            <>
              Gathering a great number of gems, Ningguang scatters them all at
              once, sending homing projectiles at her opponents that deal
              massive {geoDmg}.
              <br />
              If Starshatter is cast when a Jade Screen is nearby, the Jade
              Screen will fire additional gem projectiles at the same time.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "DMG per Gem",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 86.96,
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
      name: "Backup Plan",
      image: "2/2d/Talent_Backup_Plan",
      desc: (
        <>
          When Ningguang is in possession of Star Jades, her Charged Attack does
          not consume Stamina.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Strategic Reserve",
      image: "6/62/Talent_Strategic_Reserve",
      desc: (
        <>
          A character that passes through the Jade Screen will gain a{" "}
          <Green b>12%</Green> <Green>Geo DMG Bonus</Green> for 10s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Trove of Marvelous Treasures",
      image: "4/43/Talent_Trove_of_Marvelous_Treasures",
      desc: (
        <>
          Displays the location of nearby{" "}
          <Green>nearby ore veins used in forging</Green> on the mini-map.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Piercing Fragments",
      image: "5/52/Constellation_Piercing_Fragments",
      desc: (
        <>
          When a Normal Attack hits, it deals <Green>AoE DMG</Green>.
        </>
      )
    },
    {
      name: "Shock Effect",
      image: "8/8b/Constellation_Shock_Effect",
      desc: (
        <>
          When Jade Screen is shattered, its <Green>CD</Green> will{" "}
          <Green>reset</Green>.
          <br />
          Can occur once every 6s.
        </>
      )
    },
    {
      name: "Majesty be the Array of Stars",
      image: "e/e4/Constellation_Majesty_Be_the_Array_of_Stars",
      desc: "Starshatter"
    },
    {
      name: "Exquisite be the Jade, Outshining All Beneath",
      image:
        "a/a8/Constellation_Exquisite_be_the_Jade%2C_Outshining_All_Beneath",
      desc: (
        <>
          Jade Screen increases nearby characters' <Green>Elemental RES</Green>{" "}
          by <Green b>10%</Green>.
        </>
      )
    },
    {
      name: "Invincible be the Jade Screen",
      image: "4/45/Constellation_Invincible_Be_the_Jade_Screen",
      desc: "Jade Screen"
    },
    {
      name: "Grandeur be the Seven Stars",
      image: "9/9b/Constellation_Grandeur_Be_the_Seven_Stars",
      desc: (
        <>
          When Starshatter is used, Ningguang gains <Green b>7</Green>{" "}
          <Green>Star Jades</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: () => Ningguang.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Geo DMG Bonus", 12)
    }
  ]
};

export default Ningguang;

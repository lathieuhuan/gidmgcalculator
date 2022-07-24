import { Green, hydroDmg } from "../../../styledCpns/DataDisplay";
import {
  bowCAs,
  BowNaDesc_6,
  BowPaDesc_content,
  CaStamina,
  mediumPAs
} from "../config";
import { xtraTlLv } from "../helpers";

const Tartaglia = {
  code: 26,
  name: "Tartaglia",
  icon: "5/53/Character_Tartaglia_Thumb",
  sideIcon: "c/ca/Character_Tartaglia_Side_Icon",
  rarity: 5,
  nation: "Snezhnaya",
  vision: "Hydro",
  weapon: "Bow",
  stats: [
    { "Base HP": 1020, "Base ATK": 23, "Base DEF": 63 },
    { "Base HP": 2646, "Base ATK": 61, "Base DEF": 165 },
    { "Base HP": 3521, "Base ATK": 81, "Base DEF": 219 },
    { "Base HP": 5268, "Base ATK": 121, "Base DEF": 328 },
    {
      "Base HP": 5889,
      "Base ATK": 135,
      "Base DEF": 366,
      "Hydro DMG Bonus": 7.2
    },
    {
      "Base HP": 6776,
      "Base ATK": 156,
      "Base DEF": 421,
      "Hydro DMG Bonus": 7.2
    },
    {
      "Base HP": 7604,
      "Base ATK": 175,
      "Base DEF": 473,
      "Hydro DMG Bonus": 14.4
    },
    {
      "Base HP": 8500,
      "Base ATK": 195,
      "Base DEF": 528,
      "Hydro DMG Bonus": 14.4
    },
    {
      "Base HP": 9121,
      "Base ATK": 210,
      "Base DEF": 567,
      "Hydro DMG Bonus": 14.4
    },
    {
      "Base HP": 10025,
      "Base ATK": 231,
      "Base DEF": 623,
      "Hydro DMG Bonus": 14.4
    },
    {
      "Base HP": 10647,
      "Base ATK": 247,
      "Base DEF": 662,
      "Hydro DMG Bonus": 21.6
    },
    {
      "Base HP": 11561,
      "Base ATK": 266,
      "Base DEF": 719,
      "Hydro DMG Bonus": 21.6
    },
    {
      "Base HP": 12182,
      "Base ATK": 280,
      "Base DEF": 757,
      "Hydro DMG Bonus": 28.8
    },
    {
      "Base HP": 13103,
      "Base ATK": 301,
      "Base DEF": 815,
      "Hydro DMG Bonus": 28.8
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Cutting Torrent",
      desc: [
        BowNaDesc_6,
        {
          heading: "CA",
          content: (
            <>
              Perform a more precise Aimed Shot with increased DMG. While
              aiming, the power of Hydro will accumulate on the arrowhead.
              <br />
              An arrow fully charged with the torrent will deal {hydroDmg} and
              apply the Riptide status.
            </>
          )
        },
        {
          heading: "Riptide",
          content: (
            <>
              Opponents affected by Riptide will suffer from AoE {hydroDmg}{" "}
              effects when attacked by Tartaglia in various ways. DMG dealt in
              this way is considered Normal Attack DMG.
              <br />• Riptide Flash: A fully-charged Aimed Shot that hits an
              opponent affected by Riptide deals consecutive bouts of AoE DMG.
              Can occur once every 0.7s.
              <br />• Riptide Burst: Defeating an opponent affected by Riptide
              creates a Hydro burst that inflicts the Riptide status on nearby
              opponents hit.
            </>
          )
        },
        {
          heading: "PA",
          content: (
            <>
              {BowPaDesc_content}
              <br />
              When Tartaglia is in Foul Legacy: Raging Tide's Melee Stance, he
              cannot perform a plunging attack.
            </>
          )
        }
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 41.28,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 46.27,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 55.38,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 57.02,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 60.89,
          multType: 1
        },
        {
          name: "6-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 72.76,
          multType: 1
        },
        ...bowCAs,
        {
          name: "Riptide Flash x3",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 37.2,
          multType: 2
        },
        {
          name: "Riptide Burst",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 62,
          multType: 2
        },
        { name: "Riptide Duration", noCalc: true, getValue: () => "10s" },
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Foul Legacy: Raging Tide",
      image: "b/b5/Talent_Foul_Legacy_Raging_Tide",
      desc: [
        {
          content: (
            <>
              Unleashes a set of weaponry made of pure water, dealing {hydroDmg}{" "}
              to surrounding opponents and entering Melee Stance.
              <br />
              In this Stance, Tartaglia's Normal and Charged Attacks are
              converted to {hydroDmg} that cannot be overridden by any other
              elemental infusion and change as follows:
            </>
          )
        },
        {
          heading: "NA",
          content: <>Perform up to 6 consecutive Hydro strikes.</>
        },
        {
          heading: "CA",
          content: (
            <>
              Consumes a certain amount of Stamina to unleash a cross slash,
              dealing {hydroDmg}.
            </>
          )
        },
        {
          heading: "Riptide Slash",
          content: (
            <>
              Hitting an opponent affected by Riptide with a melee attack
              unleashes a Riptide Slash that deals AoE {hydroDmg}. DMG dealt in
              this way is considered Elemental Skill DMG, and can only occur
              once every 1.5s.
            </>
          )
        },
        {
          content: (
            <>
              After 30s, or when the ability is unleashed again, this skill will
              end. Tartaglia will return to his Ranged Stance and this ability
              will enter CD. The longer Tartaglia stays in his Melee Stance, the
              longer the CD.
              <br />
              If the return to a ranged stance occurs automatically after 30s,
              the CD is even longer.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Stance Change DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 72,
          multType: 2
        },
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 38.87,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 41.62,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 56.33,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 59.94,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 55.3,
          multType: 1
        },
        {
          name: "6-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: [35.43, 37.67],
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: [60.2, 71.98],
          multType: 1
        },
        CaStamina[20],
        {
          name: "Riptide Slash",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 60.2,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Max Duration", value: "12s" },
        { name: "Preemtive CD", value: "6-36s" },
        { name: "Max CD", value: "45s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Havoc: Obliteration",
      image: "0/03/Talent_Havoc_Obliteration",
      desc: [
        {
          content: (
            <>
              Performs different attacks based on what stance Tartaglia is in
              when casting.
            </>
          )
        },
        {
          heading: "Ranged Stance: Flash of Havoc",
          content: (
            <>
              Swiftly fires a Hydro-imbued magic arrow, dealing AoE {hydroDmg}{" "}
              and applying the Riptide status.
              <br />
              Returns a portion of its Energy Cost after use.
            </>
          )
        },
        {
          heading: "Melee Stance: Light of Obliteration",
          content: (
            <>
              Performs a slash with a large AoE, dealing massive {hydroDmg} to
              all surrounding opponents, which triggers Riptide Blast.
            </>
          )
        },
        {
          heading: "Riptide Blast",
          content: (
            <>
              When the obliterating waters hit an opponent affected by Riptide,
              it clears their Riptide status and triggers a Hydro Explosion that
              deals AoE {hydroDmg}.
              <br />
              DMG dealt in this way is considered Elemental Burst DMG.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Melee Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 464,
          multType: 2
        },
        {
          name: "Range Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 378.4,
          multType: 2
        },
        {
          name: "Riptide Blast",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 120,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Energy Return (Range)", value: "12s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Never Ending",
      image: "e/ea/Talent_Never_Ending",
      desc: (
        <>
          Extends Riptide <Green>duration</Green> by <Green b>8s</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Sword of Torrents",
      image: "d/d8/Talent_Sword_of_Torrents",
      desc: (
        <>
          When Tartaglia is in Foul Legacy: Raging Tide's Melee Stance, on
          dealing a CRIT hit, Normal and Charged Attacks apply the Riptide
          status effect to opponents.
        </>
      )
    },
    {
      type: "Passive",
      name: "Master of Weaponry",
      image: "4/45/Talent_Master_of_Weaponry",
      desc: (
        <>
          Increases your own party members' <Green>Normal Attack Level</Green>{" "}
          by <Green b>1</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Foul Legacy: Tide Withholder",
      image: "f/ff/Constellation_Foul_Legacy_Tide_Withholder",
      desc: (
        <>
          Decreases the <Green>CD</Green> of Foul Legacy: Raging Tide by{" "}
          <Green b>20%</Green>.
        </>
      )
    },
    {
      name: "Foul Legacy: Understream",
      image: "0/0e/Constellation_Foul_Legacy_Understream",
      desc: (
        <>
          When opponents affected by Riptide are defeated, Tartaglia regenerates{" "}
          <Green b>4</Green> <Green>Elemental Energy</Green>.
        </>
      )
    },
    {
      name: "Abyssal Mayhem: Vortex of Turmoil",
      image: "6/6d/Constellation_Abyssal_Mayhem_Vortex_of_Turmoil",
      desc: "Foul Legacy: Raging Tide"
    },
    {
      name: "Abyssal Mayhem: Hydrospout",
      image: "9/9d/Constellation_Abyssal_Mayhem_Hydrospout",
      desc: (
        <>
          If Tartaglia is in Foul Legacy: Raging Tide's Melee Stance, triggers
          Riptide Slash against opponents on the field affected by Riptide every
          4s, otherwise, triggers Riptide Flash.
          <br />
          Riptide Slashes and Riptide Flashes triggered by this Constellation
          effect are not subject to the time intervals that would typically
          apply to these two Riptide effects, nor do they have any effect on
          those time intervals.
        </>
      )
    },
    {
      name: "Havoc: Formless Blade",
      image: "2/20/Constellation_Havoc_Formless_Blade",
      desc: "Havoc: Obliteration"
    },
    {
      name: "Havoc: Annihilation",
      image: "5/5a/Constellation_Havoc_Annihilation",
      desc: (
        <>
          When Havoc: Obliteration is cast in Melee Stance, the{" "}
          <Green>CD</Green> of Foul Legacy: Raging Tide is <Green>reset</Green>.
          <br />
          This effect will only take place once Tartaglia returns to his Ranged
          Stance.
        </>
      )
    }
  ]
};

export default Tartaglia;

import { simpleAnTmaker } from "../../../calculators/helpers";
import { cryoDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, sprintStaminaPasv, SwordDesc } from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const Kaeya = {
  code: 5,
  name: "Kaeya",
  icon: "3/33/Character_Kaeya_Thumb",
  sideIcon: "d/d0/Character_Kaeya_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Cryo",
  weapon: "Sword",
  stats: [
    { "Base HP": 976, "Base ATK": 19, "Base DEF": 66 },
    { "Base HP": 2506, "Base ATK": 48, "Base DEF": 171 },
    { "Base HP": 3235, "Base ATK": 62, "Base DEF": 220 },
    { "Base HP": 4846, "Base ATK": 93, "Base DEF": 330 },
    {
      "Base HP": 5364,
      "Base ATK": 103,
      "Base DEF": 365,
      "Energy Recharge": 6.7
    },
    {
      "Base HP": 6170,
      "Base ATK": 118,
      "Base DEF": 420,
      "Energy Recharge": 6.7
    },
    {
      "Base HP": 6860,
      "Base ATK": 131,
      "Base DEF": 467,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 7666,
      "Base ATK": 147,
      "Base DEF": 522,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 8184,
      "Base ATK": 157,
      "Base DEF": 557,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 8989,
      "Base ATK": 172,
      "Base DEF": 612,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 9507,
      "Base ATK": 182,
      "Base DEF": 647,
      "Energy Recharge": 20
    },
    {
      "Base HP": 10312,
      "Base ATK": 198,
      "Base DEF": 702,
      "Energy Recharge": 20
    },
    {
      "Base HP": 10830,
      "Base ATK": 208,
      "Base DEF": 737,
      "Energy Recharge": 26.7
    },
    {
      "Base HP": 11636,
      "Base ATK": 223,
      "Base DEF": 792,
      "Energy Recharge": 26.7
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Ceremonial Bladework",
      desc: SwordDesc,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 53.75,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 51.69,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 65.27,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 70.86,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 88.24,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: [55.04, 73.1],
          multType: 1
        },
        CaStamina[20],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Frostgnaw",
      image: "5/51/Talent_Frostgnaw",
      desc: [
        {
          content: (
            <>
              Unleashes a frigid blast, dealing {cryoDmg} to opponents in front
              of Kaeya.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 191.2,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "6s" }]
    },
    {
      type: "Elemental Burst",
      name: "Glacial Waltz",
      image: "2/29/Talent_Glacial_Waltz",
      desc: [
        {
          content: (
            <>
              Coalescing the frost in the air, Kaeya summons 3 icicles that
              revolve around him.
              <br />
              These icicles will follow the character around and deal {
                cryoDmg
              }{" "}
              to opponents in their path for the ability's duration.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 77.6,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "8s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Cold-Blooded Strike",
      image: "c/c4/Talent_Cold-Blooded_Strike",
      desc: (
        <>
          Every hit with Frostgnaw regenerates <Green>HP</Green> for Kaeya equal
          to <Green b>15%</Green> of his <Green>ATK</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Glacial Heart",
      image: "6/6f/Talent_Glacial_Heart",
      desc: (
        <>
          Opponents Frozen by Frostgnaw will drop additional Elemental
          Particles. Frostgnaw may only produce a maximum of <Green b>2</Green>{" "}
          <Green>additional Elemental Particles</Green> per use.
        </>
      )
    },
    {
      type: "Passive",
      name: "Hidden Strength",
      image: "8/8e/Talent_Hidden_Strength",
      desc: sprintStaminaPasv
    }
  ],
  constellation: [
    {
      name: "Excellent Blood",
      image: "0/0a/Constellation_Excellent_Blood",
      desc: (
        <>
          The <Green>CRIT Rate</Green> of Kaeya's{" "}
          <Green>Normal and Charged Attacks</Green> against opponents affected
          by Cryo is increased by <Green b>15%</Green>.
        </>
      )
    },
    {
      name: "Never-Ending Performance",
      image: "7/78/Constellation_Never-Ending_Performance",
      desc: (
        <>
          Every time Glacial Waltz defeats an opponent during its duration, its{" "}
          <Green>duration</Green> is increased by <Green b>2.5s</Green>, up to a{" "}
          <Green>maximum</Green> of <Green b>15s</Green>.
        </>
      )
    },
    {
      name: "Dance of Frost",
      image: "2/2d/Constellation_Dance_of_Frost",
      desc: "Frostgnaw"
    },
    {
      name: "Frozen Kiss",
      image: "a/a3/Constellation_Frozen_Kiss",
      desc: (
        <>
          Triggers automatically when Kaeya's HP falls below 20%: Creates a
          shield that absorbs damage equal to <Green b>30%</Green> of Kaeya's{" "}
          <Green>Max HP</Green>. Lasts for 20s.
          <br />
          This shield absorbs Cryo DMG with 250% efficiency.
          <br />
          Can only occur once every 60s.
        </>
      )
    },
    {
      name: "Frostbiting Embrace",
      image: "0/04/Constellation_Frostbiting_Embrace",
      desc: "Glacial Waltz"
    },
    {
      name: "Glacial Whirlwind",
      image: "b/bb/Constellation_Glacial_Whirlwind",
      desc: (
        <>
          Glacial Waltz will generate <Green b>1</Green>{" "}
          <Green>additional icicle</Green>, and will regenerate{" "}
          <Green b>15</Green> <Green>Energy</Green> when cast.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 1",
      desc: () => Kaeya.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", ["NA.cRate", "CA.cRate"], 15)
    }
  ]
};

export default Kaeya;

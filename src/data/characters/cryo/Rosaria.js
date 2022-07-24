import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { cryoDmg, Green, Red } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, PolearmDesc_5 } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Rosaria = {
  code: 32,
  name: "Rosaria",
  icon: "f/f6/Character_Rosaria_Thumb",
  sideIcon: "0/08/Character_Rosaria_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Cryo",
  weapon: "Polearm",
  stats: [
    { "Base HP": 1030, "Base ATK": 20, "Base DEF": 60 },
    { "Base HP": 2647, "Base ATK": 52, "Base DEF": 163 },
    { "Base HP": 3417, "Base ATK": 67, "Base DEF": 197 },
    { "Base HP": 5118, "Base ATK": 100, "Base DEF": 296 },
    { "Base HP": 5665, "Base ATK": 111, "Base DEF": 327, "ATK%": 6 },
    { "Base HP": 6516, "Base ATK": 127, "Base DEF": 376, "ATK%": 6 },
    { "Base HP": 7245, "Base ATK": 141, "Base DEF": 418, "ATK%": 12 },
    { "Base HP": 8096, "Base ATK": 158, "Base DEF": 468, "ATK%": 12 },
    { "Base HP": 8643, "Base ATK": 169, "Base DEF": 499, "ATK%": 12 },
    { "Base HP": 9493, "Base ATK": 185, "Base DEF": 548, "ATK%": 12 },
    { "Base HP": 10040, "Base ATK": 196, "Base DEF": 580, "ATK%": 18 },
    { "Base HP": 10891, "Base ATK": 213, "Base DEF": 629, "ATK%": 18 },
    { "Base HP": 11438, "Base ATK": 223, "Base DEF": 661, "ATK%": 24 },
    { "Base HP": 12289, "Base ATK": 240, "Base DEF": 710, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Spear of the Church",
      desc: PolearmDesc_5,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 52.46,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 51.6,
          multType: 1
        },
        {
          name: "3-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 31.82,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 69.66,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: [41.62, 43],
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 136.74,
          multType: 1
        },
        CaStamina[25],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Ravaging Confession",
      image: "c/ce/Talent_Ravaging_Confession",
      desc: [
        {
          content: (
            <>
              Rosaria swiftly shifts her position to appear behind her opponent,
              then stabs and slashes them with her polearm, dealing {cryoDmg}.
              <br />
              This ability cannot be used to travel behind opponents of a larger
              build.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: [58.4, 136],
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "6s" }]
    },
    {
      type: "Elemental Burst",
      name: "Rites of Termination",
      image: "2/26/Talent_Rites_of_Termination",
      desc: [
        {
          content: (
            <>
              Rosaria's unique take on this prayer ritual: First, she swings her
              weapon to slash surrounding opponents; then, she summons a frigid
              Ice Lance that strikes the ground. Both actions deal {cryoDmg}.
              <br />
              While active, the Ice Lance periodically releases a blast of cold
              air, dealing {cryoDmg} to surrounding opponents.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: [104, 152],
          multType: 2
        },
        {
          name: "Ice Lance DoT",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 132,
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
      name: "Regina Probationum",
      image: "e/e3/Talent_Regina_Probationum",
      desc: (
        <>
          When Rosaria strikes an opponent from behind using Ravaging
          Confession, her <Green>CRIT Rate</Green> increased by{" "}
          <Green b>12%</Green> for 5s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Shadow Samaritan",
      image: "5/53/Talent_Shadow_Samaritan",
      desc: (
        <>
          Casting Rites of Termination increases <Green>CRIT Rate</Green> of all
          nearby party members by <Green b>15%</Green> of Rosaria's{" "}
          <Green>CRIT Rate</Green> for 10s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Night Walk",
      image: "c/c8/Talent_Night_Walk",
      desc: (
        <>
          At night (<Green>18:00 – 6:00</Green>), increases the{" "}
          <Green>Movement SPD</Green> of your own party members by{" "}
          <Green b>10%</Green>.
          <br />
          Does not take effect in Domains, Trounce Domains, or Spiral Abyss. Not
          stackable with Passive Talents that provide the same effects.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Unholy Revelation",
      image: "f/f9/Constellation_Unholy_Revelation",
      desc: (
        <>
          When Rosaria deals a CRIT Hit, her <Green>ATK SPD</Green> and{" "}
          <Green>Normal Attack DMG</Green> increases by <Green b>10%</Green> for
          4s.
        </>
      )
    },
    {
      name: "Land Without Promise",
      image: "1/1d/Constellation_Land_Without_Promise",
      desc: (
        <>
          The <Green>duration</Green> of the Ice Lance created by Rites of
          Termination is increased by <Green b>4s</Green>.
        </>
      )
    },
    {
      name: "The Wages of Sin",
      image: "3/31/Constellation_The_Wages_of_Sin",
      desc: "Ravaging Confession"
    },
    {
      name: "Painful Grace",
      image: "5/57/Constellation_Painful_Grace",
      desc: (
        <>
          Ravaging Confession's CRIT Hits regenerate <Green b>5</Green>{" "}
          <Green>Energy</Green> for Rosaria.
          <br />
          Can only be triggered once each time Ravaging Confession is cast.
        </>
      )
    },
    {
      name: "Last Rites",
      image: "8/88/Constellation_Last_Rites",
      desc: "Rites of Termination"
    },
    {
      name: "Divine Retribution",
      image: "b/bd/Constellation_Divine_Retribution",
      desc: (
        <>
          Rites of Termination's attack decreases opponents'{" "}
          <Green>Physical RES</Green> by <Green b>20%</Green> for 10s.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Rosaria.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "CRIT Rate", 12)
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: ({ inputs }) => (
        <>
          {Rosaria.pasvTalents[1].desc}{" "}
          <Red>CRIT Rate Bonus: {Rosaria.buffs[1].bnValue(inputs)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      affect: "teammates",
      labels: ["CRIT Rate"],
      inputs: [5],
      inputTypes: ["text"],
      maxs: [100],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        const bnValue = Rosaria.buffs[1].bnValue(inputs);
        addAndTrack(tkDesc, ATTRs, "CRIT Rate", bnValue, tracker);
      },
      bnValue: ([CR]) => Math.round(CR * 1.5) / 10
    },
    {
      index: 2,
      src: "Constellation 1",
      desc: () => Rosaria.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: ({ ATTRs, hitBnes, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "NA.pct", 10, tracker);
        const fields = ["Normal ATK SPD", "Charged ATK SPD"];
        addAndTrack(tkDesc, ATTRs, fields, 10, tracker);
      }
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 6",
      desc: () => Rosaria.constellation[5].desc,
      isGranted: checkCons[6],
      addPntes: simpleAnTmaker("rdMult", "Physical_rd", 20)
    }
  ]
};

export default Rosaria;

import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { electroDmg, Green } from "../../../styledCpns/DataDisplay";
import {
  CaStaminaClaymore,
  ClaymoreDesc_5slash,
  heavyPAs,
  swimStaminaPasv
} from "../config";
import { checkAscs, checkCons, makeTlBnes, xtraTlLv } from "../helpers";

const Beidou = {
  code: 6,
  name: "Beidou",
  icon: "6/61/Character_Beidou_Thumb",
  sideIcon: "5/54/Character_Beidou_Side_Icon",
  rarity: 4,
  nation: "Liyue",
  vision: "Electro",
  weapon: "Claymore",
  stats: [
    { "Base HP": 1094, "Base ATK": 19, "Base DEF": 54 },
    { "Base HP": 2811, "Base ATK": 48, "Base DEF": 140 },
    { "Base HP": 3628, "Base ATK": 63, "Base DEF": 180 },
    { "Base HP": 5435, "Base ATK": 94, "Base DEF": 270 },
    {
      "Base HP": 6015,
      "Base ATK": 104,
      "Base DEF": 299,
      "Electro DMG Bonus": 6
    },
    {
      "Base HP": 6919,
      "Base ATK": 119,
      "Base DEF": 344,
      "Electro DMG Bonus": 6
    },
    {
      "Base HP": 7694,
      "Base ATK": 133,
      "Base DEF": 382,
      "Electro DMG Bonus": 12
    },
    {
      "Base HP": 8597,
      "Base ATK": 148,
      "Base DEF": 427,
      "Electro DMG Bonus": 12
    },
    {
      "Base HP": 9178,
      "Base ATK": 158,
      "Base DEF": 456,
      "Electro DMG Bonus": 12
    },
    {
      "Base HP": 10081,
      "Base ATK": 174,
      "Base DEF": 501,
      "Electro DMG Bonus": 12
    },
    {
      "Base HP": 10662,
      "Base ATK": 184,
      "Base DEF": 530,
      "Electro DMG Bonus": 18
    },
    {
      "Base HP": 11565,
      "Base ATK": 200,
      "Base DEF": 575,
      "Electro DMG Bonus": 18
    },
    {
      "Base HP": 12146,
      "Base ATK": 210,
      "Base DEF": 603,
      "Electro DMG Bonus": 24
    },
    {
      "Base HP": 13050,
      "Base ATK": 225,
      "Base DEF": 648,
      "Electro DMG Bonus": 24
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Oceanborne",
      desc: ClaymoreDesc_5slash,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 71.12,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 70.86,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 88.32,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 86.52,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 112.14,
          multType: 1
        },
        {
          name: "Charged Attack Spinning",
          dmgTypes: ["CA", "Physical"],
          baseMult: 56.24,
          multType: 1
        },
        {
          name: "Charged Attack Final",
          dmgTypes: ["CA", "Physical"],
          baseMult: 101.82,
          multType: 1
        },
        {
          name: "Extra Hit (C4)",
          dmgTypes: [null, "Elemental"],
          baseMult: 0,
          multType: 1,
          conditional: true,
          getTlBnes: ({ char }) =>
            makeTlBnes(checkCons[4](char), "mult", [0, 4], 20)
        },
        ...CaStaminaClaymore,
        ...heavyPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Tidecaller",
      image: "9/92/Talent_Tidecaller",
      desc: [
        {
          heading: "Press",
          content: (
            <>
              Accumulating the power of lightning, Beidou swings her blade
              forward fiercely, dealing {electroDmg}.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Lifts her weapon up as a shield. Max DMG absorbed scales off
              Beidou's Max HP.
              <br />
              Attacks using the energy stored within the greatsword upon release
              or once this ability's duration expires, dealing {electroDmg}. DMG
              dealt scales with the number of times Beidou is attacked in the
              skill's duration. The greatest DMG Bonus will be attained once
              this effect is triggered twice.
              <br />
              The shield possesses the following properties:
              <br />• Has 250% Electro DMG Absorption Efficiency.
              <br />• Applies the Electro element to Beidou upon activation.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Shield DMG Absorption",
          baseSType: "HP",
          baseMult: 14.4,
          multType: 2,
          baseFlat: 1386,
          flatType: 3
        },
        {
          name: "Base DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 121.6,
          multType: 2
        },
        {
          name: "DMG Bonus on Hit",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 160,
          multType: 2
        },
        {
          name: "Full Counter",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 441.6,
          multType: 2,
          conditional: true
        }
      ],
      otherStats: () => [{ name: "CD", value: "7.5s" }]
    },
    {
      type: "Elemental Burst",
      name: "Stormbreaker",
      image: "3/33/Talent_Stormbreaker",
      desc: [
        {
          content: (
            <>
              Recalling her slaying of the great beast Haishan, Beidou calls
              upon that monstrous strength and the lightning to create a
              Thunderbeast's Targe around herself, dealing {electroDmg} to
              nearby opponents.
            </>
          )
        },
        {
          heading: "Thunderbeast's Targe",
          content: (
            <>
              • When Normal and Charged Attacks hit, they create a lightning
              discharge that can jump between opponents, dealing {electroDmg}.
              <br />• Increases the character's resistance to interruption, and
              decreases DMG taken.
            </>
          )
        },
        {
          content: (
            <>A maximum of 1 lightning discharge can be triggered per second.</>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 121.6,
          multType: 2
        },
        {
          name: "Lightning DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 96,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        {
          name: "DMG Reduction",
          value:
            [0, 20, 21, 22, 24, 25, 26, 28, 30, 32, 34, 35, 36, 37, 38, 39][
              lv
            ] + "%"
        },
        { name: "Duration", value: "15s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Retribution",
      image: "6/69/Talent_Retribution",
      desc: (
        <>
          Counterattacking with Tidecaller at the precise moment when the
          character is hit grants the maximum DMG Bonus.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Lightning Storm",
      image: "8/8a/Talent_Lightning_Storm",
      get desc() {
        return (
          <>
            {this.buff} Additionally, greatly reduced delay before unleashing
            Charged Attacks.
          </>
        );
      },
      buff: (
        <>
          After unleashing Tidecaller with its maximum DMG Bonus, Beidou's{" "}
          <Green>Normal and Charged Attacks DMG</Green> and{" "}
          <Green>ATK SPD</Green> are increased by <Green b>15%</Green> for 10s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Conqueror of Tides",
      image: "d/d3/Talent_Conqueror_of_Tides",
      desc: swimStaminaPasv
    }
  ],
  constellation: [
    {
      name: "Sea Beast's Scourge",
      image: "2/23/Constellation_Sea_Beast%27s_Scourge",
      desc: (
        <>
          When Stormbreaker is used: Creates a shield that absorbs up to{" "}
          <Green b>16%</Green> of Beidou's <Green>Max HP</Green> for 15s.
          <br />
          This shield absorbs Electro DMG 250% more effectively.
        </>
      )
    },
    {
      name: "Upon the Turbulent Sea, the Thunder Arises",
      image: "d/df/Constellation_Upon_the_Turbulent_Sea%2C_the_Thunder_Arises",
      desc: (
        <>
          Stormbreaker's arc lightning can jump to <Green b>2</Green>{" "}
          <Green>additional targets</Green>.
        </>
      )
    },
    {
      name: "Summoner of Storm",
      image: "8/8e/Constellation_Summoner_of_Storm",
      desc: "Tidecaller"
    },
    {
      name: "Stunning Revenge",
      image: "6/63/Constellation_Stunning_Revenge",
      desc: (
        <>
          Upon being attacked, Beidou's Normal Attacks gain an{" "}
          <Green>additional instance</Green> of <Green b>20%</Green>{" "}
          {electroDmg} for 10s.
        </>
      )
    },
    {
      name: "Crimson Tidewalker",
      image: "2/23/Constellation_Crimson_Tidewalker",
      desc: "Stormbreaker"
    },
    {
      name: "Bane of Evil",
      image: "c/c5/Constellation_Bane_of_Evil",
      desc: (
        <>
          During the duration of Stormbreaker, the <Green>Electro RES</Green> of
          surrounding opponents is decreased by <Green b>15%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: () => Beidou.pasvTalents[1].buff,
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: ({ ATTRs, hitBnes, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, ["NA.pct", "CA.pct"], 15, tracker);
        const fields = ["Normal ATK SPD", "Charged ATK SPD"];
        addAndTrack(tkDesc, ATTRs, fields, 15, tracker);
      }
    },
    {
      index: 1,
      outdated: true,
      src: "Constellation 4",
      desc: () => Beidou.constellation[3].desc
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 6",
      desc: () => Beidou.constellation[5].desc,
      isGranted: checkCons[6],
      addPntes: simpleAnTmaker("rdMult", "Electro_rd", 15)
    }
  ]
};

export default Beidou;

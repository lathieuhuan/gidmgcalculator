import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { anemoDmg, Green } from "../../../styledCpns/DataDisplay";
import {
  BowCaDesc,
  BowNaDesc_6,
  BowPaDesc,
  glideStaminaPasv,
  lightPAs_Bow
} from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const addPntes_cons2 = ({ rdMult, tkDesc, tracker }) => {
  const fields = ["Physical_rd", "Anemo_rd"];
  addAndTrack(tkDesc, rdMult, fields, 12, tracker);
};

const Venti = {
  code: 22,
  name: "Venti",
  icon: "8/8d/Character_Venti_Thumb",
  sideIcon: "f/f7/Character_Venti_Side_Icon",
  rarity: 5,
  nation: "Mondstadt",
  vision: "Anemo",
  weapon: "Bow",
  stats: [
    { "Base HP": 820, "Base ATK": 20, "Base DEF": 52 },
    { "Base HP": 2127, "Base ATK": 53, "Base DEF": 135 },
    { "Base HP": 2830, "Base ATK": 71, "Base DEF": 180 },
    { "Base HP": 4234, "Base ATK": 106, "Base DEF": 269 },
    { "Base HP": 4734, "Base ATK": 118, "Base DEF": 301, "Energy Recharge": 8 },
    { "Base HP": 5446, "Base ATK": 136, "Base DEF": 346, "Energy Recharge": 8 },
    {
      "Base HP": 6112,
      "Base ATK": 153,
      "Base DEF": 388,
      "Energy Recharge": 16
    },
    {
      "Base HP": 6832,
      "Base ATK": 171,
      "Base DEF": 434,
      "Energy Recharge": 16
    },
    {
      "Base HP": 7331,
      "Base ATK": 183,
      "Base DEF": 465,
      "Energy Recharge": 16
    },
    {
      "Base HP": 8058,
      "Base ATK": 201,
      "Base DEF": 512,
      "Energy Recharge": 16
    },
    {
      "Base HP": 8557,
      "Base ATK": 214,
      "Base DEF": 543,
      "Energy Recharge": 24
    },
    {
      "Base HP": 9292,
      "Base ATK": 232,
      "Base DEF": 590,
      "Energy Recharge": 24
    },
    {
      "Base HP": 9791,
      "Base ATK": 245,
      "Base DEF": 622,
      "Energy Recharge": 32
    },
    {
      "Base HP": 10531,
      "Base ATK": 263,
      "Base DEF": 669,
      "Energy Recharge": 32
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Divine Marksmanship",
      desc: [
        BowNaDesc_6,
        BowCaDesc("favorable winds", "A fully charged wind arrow", "Anemo"),
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 20.38,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 44.38,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 52.37,
          multType: 1
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 26.06,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 50.65,
          multType: 1
        },
        {
          name: "6-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 70.95,
          multType: 1
        },
        {
          name: "Aimed Shot",
          dmgTypes: ["CA", "Physical"],
          baseMult: 43.86,
          multType: 1
        },
        {
          name: "Fully-charged Aimed Shot",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 124,
          multType: 8
        },
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Skyward Sonnet",
      image: "1/17/Talent_Skyward_Sonnet",
      desc: [
        {
          heading: "Press",
          content: (
            <>
              Summons a Wind Domain at the opponent's location, dealing AoE{" "}
              {anemoDmg} and launching opponents into the air.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Summons an even larger Wind Domain with Venti as the epicenter,
              dealing AoE {anemoDmg} and launching affected opponents into the
              air.
              <br />
              After unleashing the Hold version of this ability, Venti rides the
              wind into the air.
              <br />
              Opponents hit by Skyward Sonnet will fall to the ground slowly.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Press DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 276,
          multType: 2
        },
        { name: "Press CD", noCalc: true, getValue: () => "6s" },
        {
          name: "Hold DMG",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 380,
          multType: 1
        },
        { name: "Hold CD", noCalc: true, getValue: () => "15s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Wind's Grand Ode",
      image: "3/32/Talent_Wind%27s_Grand_Ode",
      desc: [
        {
          content: (
            <>
              Fires off an arrow made of countless coalesced winds, creating a
              huge Stormeye that sucks in opponents and deals continuous{" "}
              {anemoDmg}.
            </>
          )
        },
        { heading: "Elemental Absorption", content: "the Stormeye" }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "DoT",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 37.6,
          multType: 2
        },
        {
          name: "Addition Elemental DMG",
          dmgTypes: ["EB", "Various"],
          baseMult: 18.8,
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
      name: "Embrace of Winds",
      image: "7/70/Talent_Embrace_of_Winds",
      desc: <>Holding Skyward Sonnet creates an upcurrent that lasts for 20s.</>
    },
    {
      type: "Ascension 4",
      name: "Stormeye",
      image: "b/b2/Talent_Stormeye",
      desc: (
        <>
          Regenerates <Green b>15</Green> <Green>Energy</Green> for Venti after
          the effects of Wind's Grand Ode end. If an Elemental Absorption
          occurred, this also restores <Green b>15</Green> <Green>Energy</Green>{" "}
          to all characters of that <Green>corresponding element</Green> in the
          party.
        </>
      )
    },
    {
      type: "Passive",
      name: "Windrider",
      image: "0/05/Talent_Windrider",
      desc: glideStaminaPasv
    }
  ],
  constellation: [
    {
      name: "Splitting Gales",
      image: "5/5b/Constellation_Splitting_Gales",
      desc: (
        <>
          Fires <Green b>2</Green> <Green>additional arrows</Green> per Aimed
          Shot, each dealing <Green b>33%</Green> of the original arrow's{" "}
          <Green>DMG</Green>.
        </>
      )
    },
    {
      name: "Breeze of Reminiscence",
      image: "1/1c/Constellation_Breeze_of_Reminiscence",
      get desc() {
        return (
          <>
            {this.lines[0]} {this.lines[1]}
          </>
        );
      },
      lines: [
        <>
          Skyward Sonnet decreases opponents' <Green>Anemo RES</Green> and{" "}
          <Green>Physical RES</Green> by <Green b>12%</Green> for 10s.
        </>,
        <>
          Opponents launched by Skyward Sonnet suffer an additional{" "}
          <Green b>12%</Green> <Green>Anemo RES</Green> and{" "}
          <Green>Physical RES</Green> decrease while airborne.
        </>
      ]
    },
    {
      name: "Ode to Thousand Winds",
      image: "5/53/Constellation_Ode_to_Thousand_Winds",
      desc: "Wind's Grand Ode"
    },
    {
      name: "Hurricane of Freedom",
      image: "e/ee/Constellation_Hurricane_of_Freedom",
      desc: (
        <>
          When Venti picks up an Elemental Orb or Particle, he receives a{" "}
          <Green b>25%</Green> <Green>Anemo DMG Bonus</Green> for 10s.
        </>
      )
    },
    {
      name: "Concerto dal Cielo",
      image: "b/b7/Constellation_Concerto_dal_Cielo",
      desc: "Skyward Sonnet"
    },
    {
      name: "Storm of Defiance",
      image: "1/1d/Constellation_Storm_of_Defiance",
      desc: (
        <>
          Wind's Grand Ode decreases opponents' <Green>Anemo RES</Green> and{" "}
          <Green>RES</Green> towards the <Green>Element absorbed</Green> by{" "}
          <Green b>20%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 4",
      desc: () => Venti.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Anemo DMG Bonus", 25)
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => Venti.constellation[1].lines[0],
      isGranted: checkCons[2],
      addPntes: addPntes_cons2
    },
    {
      index: 1,
      src: "Constellation 2",
      desc: () => Venti.constellation[1].lines[1],
      isGranted: checkCons[2],
      addPntes: addPntes_cons2
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Venti.constellation[5].desc,
      isGranted: checkCons[6],
      selfLabels: ["Element Absorbed"],
      labels: ["Element Absorbed"],
      inputTypes: ["absorption"],
      addPntes: ({ rdMult, inputs, tkDesc, tracker }) => {
        const fields = ["Anemo_rd", `${inputs[0]}_rd`];
        addAndTrack(tkDesc, rdMult, fields, 20, tracker);
      }
    }
  ]
};

export default Venti;

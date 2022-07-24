import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { Green, pyroDmg } from "../../../styledCpns/DataDisplay";
import {
  CaStaminaClaymore,
  ClaymoreDesc_4spin,
  doubleCooking,
  heavyPAs
} from "../config";
import {
  checkAscs,
  checkCharMC,
  checkCons,
  makeTlBnes,
  xtraTlLv
} from "../helpers";

const Xinyan = {
  code: 27,
  name: "Xinyan",
  icon: "9/9d/Character_Xinyan_Thumb",
  sideIcon: "3/32/Character_Xinyan_Side_Icon",
  rarity: 4,
  nation: "Liyue",
  vision: "Pyro",
  weapon: "Claymore",
  stats: [
    { "Base HP": 939, "Base ATK": 21, "Base DEF": 67 },
    { "Base HP": 2413, "Base ATK": 54, "Base DEF": 172 },
    { "Base HP": 3114, "Base ATK": 69, "Base DEF": 222 },
    { "Base HP": 4665, "Base ATK": 103, "Base DEF": 333 },
    { "Base HP": 5163, "Base ATK": 115, "Base DEF": 368, "ATK%": 6 },
    { "Base HP": 5939, "Base ATK": 132, "Base DEF": 423, "ATK%": 6 },
    { "Base HP": 6604, "Base ATK": 147, "Base DEF": 471, "ATK%": 12 },
    { "Base HP": 7379, "Base ATK": 164, "Base DEF": 526, "ATK%": 12 },
    { "Base HP": 7878, "Base ATK": 175, "Base DEF": 562, "ATK%": 12 },
    { "Base HP": 8653, "Base ATK": 192, "Base DEF": 617, "ATK%": 12 },
    { "Base HP": 9151, "Base ATK": 203, "Base DEF": 652, "ATK%": 18 },
    { "Base HP": 9927, "Base ATK": 220, "Base DEF": 708, "ATK%": 18 },
    { "Base HP": 10425, "Base ATK": 231, "Base DEF": 743, "ATK%": 24 },
    { "Base HP": 11201, "Base ATK": 249, "Base DEF": 799, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Dance on Fire",
      desc: ClaymoreDesc_4spin,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 76.54,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 73.96,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 95.46,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 115.84,
          multType: 1
        },
        {
          name: "Charged Attack Spinning",
          dmgTypes: ["CA", "Physical"],
          baseMult: 62.55,
          multType: 1
        },
        {
          name: "Charged Attack Final",
          dmgTypes: ["CA", "Physical"],
          baseMult: 113.09,
          multType: 1
        },
        ...CaStaminaClaymore,
        ...heavyPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Sweeping Fervor",
      image: "8/85/Talent_Sweeping_Fervor",
      desc: [
        {
          content: (
            <>
              Xinyan brandishes her instrument, dealing {pyroDmg} on nearby
              opponents, forming a shield made out of her audience's passion.
              <br />
              The shield's DMG Absorption scales based on Xinyan's DEF and on
              the number of opponents hit.
              <br />• Hitting 0–1 opponents grants Shield Level 1: Ad Lib.
              <br />• Hitting 2 opponents grants Shield Level 2: Lead-In.
              <br />• Hitting 3 or more opponents grants Shield Level 3: Rave,
              which will also deal intermittent {pyroDmg} to nearby opponents.
            </>
          )
        },
        {
          content: (
            <>
              The shield has the following special properties:
              <br />• When unleashed, it infuses Xinyan with Pyro.
              <br />• It has 250% DMG Absorption effectiveness against {pyroDmg}
              .
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Swing DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 169.6,
          multType: 2
        },
        {
          name: "DoT",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 33.6,
          multType: 2
        },
        {
          name: "Shield Level 1 DMG Absorption",
          baseSType: "DEF",
          baseMult: 104.04,
          multType: 2,
          baseFlat: 501,
          flatType: 3
        },
        {
          name: "Shield Level 2 DMG Absorption",
          baseSType: "DEF",
          baseMult: 122.4,
          multType: 2,
          baseFlat: 589,
          flatType: 3
        },
        {
          name: "Shield Level 3 DMG Absorption",
          baseSType: "DEF",
          baseMult: 144,
          multType: 2,
          baseFlat: 693,
          flatType: 3
        }
      ],
      otherStats: () => [
        { name: "Shield Duration", value: "12s" },
        { name: "CD", value: "18s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Riff Revolution",
      image: "0/06/Talent_Riff_Revolution",
      desc: [
        {
          content: (
            <>
              Strumming rapidly, Xinyan launches nearby opponents and deals
              Physical DMG to them, hyping up the crowd.
              <br />
              The sheer intensity of the atmosphere will cause explosions that
              deal {pyroDmg} to nearby opponents.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Physical Burst DMG",
          dmgTypes: ["EB", "Physical"],
          baseMult: 340.8,
          multType: 2,
          getTlBnes: ({ char, selfMCs }) =>
            makeTlBnes(
              checkCharMC(Xinyan.buffs, char, selfMCs.BCs, 2),
              "cRate",
              [0, 2],
              100
            )
        },
        {
          name: "Pyro DoT",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 40,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "2s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: `"The Show Goes On, Even Without an Audience..."`,
      image: `b/b0/Talent_"The_Show_Goes_On%2C_Even_Without_An_Audience..."`,
      desc: (
        <>
          Decreases the number of opponents Sweeping Fervor must hit to trigger
          each level of shielding.
          <br />• Shield Level 2: Lead-In requirement reduced to 1 opponent hit.
          <br />• Shield Level 3: Rave requirement reduced to 2 opponents hit or
          more.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: `"...Now That's Rock 'N' Roll!"`,
      image: "e/e5/Talent_%22...Now_That%27s_Rock_%27N%27_Roll%21%22",
      desc: (
        <>
          Characters shielded by Sweeping Fervor deal <Green b>15%</Green>{" "}
          increased <Green>Physical DMG</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "A Rad Recipe",
      image: "3/39/Talent_A_Rad_Recipe",
      desc: doubleCooking("Xinyan", "DEF-boosting dish")
    }
  ],
  constellation: [
    {
      name: "Fatal Acceleration",
      image: "7/7e/Constellation_Fatal_Acceleration",
      get desc() {
        return (
          <>
            {this.buff}
            <br />
            Can only occur once every 5s.
          </>
        );
      },
      buff: (
        <>
          Upon scoring a CRIT Hit, increases <Green>ATK SPD</Green> of Xinyan's{" "}
          <Green>Normal and Charged Attacks</Green> by <Green b>12%</Green> for
          5s.
        </>
      )
    },
    {
      name: "Impromptu Opening",
      image: "4/45/Constellation_Impromptu_Opening",
      get desc() {
        return (
          <>
            {this.buff}, and will form a shield at Shield Level 3: Rave when
            cast.
          </>
        );
      },
      buff: (
        <>
          <Green>Riff Revolution's Physical DMG</Green> has its{" "}
          <Green>CRIT Rate</Green> increased by <Green b>100%</Green>
        </>
      )
    },
    {
      name: "Double-Stop",
      image: "e/e3/Constellation_Double-Stop",
      desc: "Sweeping Fervor"
    },
    {
      name: "Wildfire Rhythm",
      image: "6/6f/Constellation_Wildfire_Rhythm",
      desc: (
        <>
          Sweeping Fervor's swing DMG decreases opponent's{" "}
          <Green>Physical RES</Green> by <Green b>15%</Green> for 12s.
        </>
      )
    },
    {
      name: "Screamin' for an Encore",
      image: "1/18/Constellation_Screamin%27_for_an_Encore",
      desc: "Riff Revolution"
    },
    {
      name: "Rockin' in a Flaming World",
      image: "4/40/Constellation_Rockin%27_in_a_Flaming_World",
      get desc() {
        return (
          <>
            Decreases the <Green>Stamina Consumption</Green> of Xinyan's{" "}
            <Green>Charged Attacks</Green> by <Green b>30%</Green>.
            Additionally, {this.buff}
          </>
        );
      },
      buff: (
        <>
          Xinyan's <Green>Charged Attacks</Green> gain an{" "}
          <Green>ATK Bonus</Green> equal to <Green b>50%</Green> of her{" "}
          <Green>DEF</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: () => Xinyan.pasvTalents[1].desc,
      isGranted: checkAscs[1],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Physical DMG Bonus", 15)
    },
    {
      index: 1,
      src: "Constellation 1",
      desc: () => Xinyan.constellation[0].buff,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker(
        "ATTRs",
        ["Normal ATK SPD", "Charged ATK SPD"],
        12
      )
    },
    {
      index: 2,
      src: "Constellation 2",
      desc: () => <>{Xinyan.constellation[1].buff}.</>,
      isGranted: checkCons[2],
      affect: "self"
    },
    {
      index: 3,
      src: "Constellation 6",
      desc: () => Xinyan.constellation[5].buff,
      isGranted: checkCons[6],
      affect: "self",
      addFinalBnes: ({ ATTRs, hitBnes, tkDesc, tracker }) => {
        const bnValue = Math.round(ATTRs.DEF / 2);
        addAndTrack(tkDesc, hitBnes, "CA.flat", bnValue, tracker);
      }
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 4",
      desc: () => Xinyan.constellation[3].desc,
      isGranted: checkCons[4],
      addPntes: simpleAnTmaker("rdMult", "Physical_rd", 15)
    }
  ]
};

export default Xinyan;

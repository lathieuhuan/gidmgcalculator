import { addAndTrack } from "../../../calculators/helpers";
import { Green, GreenOn, hydroDmg } from "../../../styledCpns/DataDisplay";
import {
  BowCaDesc_contentMaker,
  bowCAs,
  BowNaDesc_4,
  BowPaDesc,
  lightPAs_Bow
} from "../config";
import {
  checkAscs,
  checkCons,
  countElmts,
  makeTlBnes,
  xtraTlLv
} from "../helpers";

const Yelan = {
  code: 51,
  name: "Yelan",
  icon: "a/a8/Character_Yelan_Thumb",
  sideIcon: "9/9c/Character_Yelan_Side_Icon",
  rarity: 5,
  nation: "Liyue",
  vision: "Hydro",
  weapon: "Bow",
  stats: [
    { "Base HP": 1125, "Base ATK": 19, "Base DEF": 43 },
    { "Base HP": 2918, "Base ATK": 49, "Base DEF": 111 },
    { "Base HP": 3883, "Base ATK": 66, "Base DEF": 147 },
    { "Base HP": 5810, "Base ATK": 98, "Base DEF": 220 },
    { "Base HP": 6495, "Base ATK": 110, "Base DEF": 246, "CRIT Rate": 4.8 },
    { "Base HP": 7472, "Base ATK": 126, "Base DEF": 283, "CRIT Rate": 4.8 },
    { "Base HP": 8386, "Base ATK": 142, "Base DEF": 318, "CRIT Rate": 9.6 },
    { "Base HP": 9374, "Base ATK": 158, "Base DEF": 355, "CRIT Rate": 9.6 },
    { "Base HP": 10059, "Base ATK": 170, "Base DEF": 381, "CRIT Rate": 9.6 },
    { "Base HP": 11056, "Base ATK": 187, "Base DEF": 419, "CRIT Rate": 9.6 },
    { "Base HP": 11741, "Base ATK": 198, "Base DEF": 445, "CRIT Rate": 14.4 },
    { "Base HP": 12749, "Base ATK": 215, "Base DEF": 483, "CRIT Rate": 14.4 },
    { "Base HP": 13434, "Base ATK": 227, "Base DEF": 509, "CRIT Rate": 19.2 },
    { "Base HP": 14450, "Base ATK": 244, "Base DEF": 548, "CRIT Rate": 19.2 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Stealthy Bowshot",
      desc: [
        BowNaDesc_4,
        {
          heading: "CA",
          content: BowCaDesc_contentMaker(
            "flowing water",
            "A fully charged torrential arrow",
            "Hydro"
          )
        },
        {
          heading: "Breakthrough",
          content: (
            <>
              Yelan will enter a Breakthrough state after spending 5s off-field,
              which will cause her next Charged Aimed Shot to have{" "}
              <Green b>80%</Green> <Green>decreased charge time</Green>, and
              once charged, she can fire a "Breakthrough Barb" that will deal
              AoE {hydroDmg} based on Yelan's <Green>Max HP</Green>.
            </>
          )
        },
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 40.68,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 39.04,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 51.6,
          multType: 1
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 32.51,
          multType: 1
        },
        ...bowCAs,
        {
          name: "Breakthrough Barb DMG",
          baseSType: "HP",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 11.58,
          multType: 2
        },
        {
          name: "Special Breakthrough Barb DMG (C6)",
          baseSType: "HP",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 18.0648,
          multType: 2,
          conditional: true
        },
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Lingering Lifeline",
      image: "5/59/Talent_Lingering_Lifeline",
      desc: [
        {
          content: (
            <>
              Fires off a Lifeline that allows her to move rapidly, entangling
              and marking opponents along its path. When this rapid movement
              ends, the Lifeline will explode, dealing {hydroDmg} to the marked
              opponents based on Yelan's <Green>Max HP</Green>.
            </>
          )
        },
        {
          heading: "Tap",
          content: <>Moves a certain distance forward swiftly.</>
        },
        {
          heading: "Hold",
          content: (
            <>
              Engages in continuous, swift movement, during which Yelan's
              resistance to interruption is increased.
              <br />
              During this time, Yelan can control this rapid movement and end it
              by using this Skill again. Additionally, each opponent marked by
              the "Lifeline" when it explodes grants Yelan a{" "}
              <Green b>34%</Green> <Green>chance</Green> to reset her
              "Breakthrough" state.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          baseSType: "HP",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 22.61,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Max Duration (Hold)", value: "3s" },
        { name: "CD", value: "10" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Depth-Clarion Dice",
      image: "b/bd/Talent_Depth-Clarion_Dice",
      desc: [
        {
          content: (
            <>
              Deals AoE {hydroDmg} and creates an Exquisite Throw, which aids
              her in battle.
            </>
          )
        },
        {
          heading: "Exquisite Throw",
          content: (
            <>
              follows the character around and will initiate a coordinated
              attack under the following circumstances, dealing {hydroDmg} based
              on Yelan's Max HP:
              <br />• This can occur once every second when your active
              character uses a Normal Attack.
              <br />• Will occur each time Yelan's Lifeline explodes and hits
              opponents.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          baseSType: "HP",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 7.31,
          multType: 2
        },
        {
          name: "Exquisite Throw DMG (1/3)",
          baseSType: "HP",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 4.87,
          multType: 2
        },
        {
          name: "Additional Water Arrow DMG (C2)",
          baseSType: "HP",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 0,
          multType: 2,
          conditional: true,
          getTlBnes: ({ char }) =>
            makeTlBnes(checkCons[2](char), "mult", [0, 2], 14)
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "15s" },
        { name: "CD", value: "18s" }
      ],
      energyCost: 70
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Turn Control",
      image: "4/42/Talent_Turn_Control",
      desc: (
        <>
          When the party has 1/2/3/4 Elemental Types, Yelan's{" "}
          <Green>Max HP</Green> is increased by <Green b>6%/12%/18%/30%</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Adapt With Ease",
      image: "9/9d/Talent_Adapt_With_Ease",
      desc: (
        <>
          So long as an Exquisite Throw is in play, your own active character
          deals <Green b>1%</Green> <Green>more DMG</Green>. This increases by a
          further <Green b>3.5%</Green> <Green>DMG</Green> every second. The{" "}
          <Green>maximum</Green> increase to DMG dealt is <Green b>50%</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Necessary Calculation",
      image: "b/bd/Talent_Necessary_Calculation",
      desc: (
        <>
          Gains <Green b>25%</Green> more <Green>rewards</Green> when dispatched
          on a Liyue <Green>Expedition</Green> for 20 hours.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Enter the Plotters",
      image: "a/af/Constellation_Enter_the_Plotters",
      desc: (
        <>
          Lingering Lifeline gains <Green b>1</Green>{" "}
          <Green>additional charge</Green>.
        </>
      )
    },
    {
      name: "Taking All Comers",
      image: "8/8e/Constellation_Taking_All_Comers",
      desc: (
        <>
          When Exquisite Throw conducts a coordinated attack, it will fire an
          additional water arrow that will deal <Green b>14%</Green> of Yelan's{" "}
          <Green>Max HP</Green> as {hydroDmg}.
          <br />
          This effect can trigger once every 1.8s.
        </>
      )
    },
    {
      name: "Beware the Trickster's Dice",
      image: "e/ea/Constellation_Beware_the_Trickster%27s_Dice",
      desc: "Depth-Clarion Dice"
    },
    {
      name: "Bait-and-Switch",
      image: "8/83/Constellation_Bait-and-Switch",
      desc: (
        <>
          Increases all party members' <Green>Max HP</Green> by{" "}
          <Green b>10%</Green> for 25s for every opponent marked by Lifeline
          when the Lifeline explodes. A <Green>maximum</Green> increase of{" "}
          <Green b>40%</Green> <Green>Max HP</Green> can be attained in this
          manner.
        </>
      )
    },
    {
      name: "Dealer's Sleight",
      image: "6/6f/Constellation_Dealer%27s_Sleight",
      desc: "Lingering Lifeline"
    },
    {
      name: "Winner Take All",
      image: "5/59/Constellation_Winner_Takes_All",
      desc: (
        <>
          After using Depth-Clarion Dice, Yelan will enter the Mastermind state.
          <br />
          In this state, all of Yelan's Normal Attacks will be the stronger
          Breakthrough Barbs. These Breakthrough Barbs will have all its normal
          abilities and the DMG dealt will be considered Charged Attack DMG,
          dealing <Green b>156%</Green> of their <Green>normal DMG</Green>.
          <br />
          <br />
          The Mastermind state lasts 20s and will be cleared after Yelan fires{" "}
          <Green b>5</Green> <Green>arrows</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: ({ charData, partyData }) => {
        const n = countElmts(charData, partyData);
        return (
          <>
            When the party has 1/2/3/4 Elemental Types, Yelan's{" "}
            <Green>Max HP</Green> is increased by{" "}
            <GreenOn on={n === 1}>6%</GreenOn>/
            <GreenOn on={n === 2}>12%</GreenOn>/
            <GreenOn on={n === 3}>18%</GreenOn>/
            <GreenOn on={n === 4}>30%</GreenOn>.
          </>
        );
      },
      isGranted: (char) => char.ascension >= 1,
      affect: "self",
      addBnes: ({ ATTRs, charData, partyData, tkDesc, tracker }) => {
        const numOfElmts = countElmts(charData, partyData);
        let bnValue = numOfElmts * 6;
        if (numOfElmts === 4) bnValue += 6;
        addAndTrack(tkDesc, ATTRs, "HP%", bnValue, tracker);
      }
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Yelan.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "party",
      selfLabels: ["Stacks (max 14)"],
      labels: ["Stacks"],
      inputs: [0],
      inputTypes: ["text"],
      maxs: [14],
      addBnes: ({ hitBnes, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "All.pct", 1 + 3.5 * inputs[0], tracker);
      }
    },
    {
      index: 2,
      src: "Constellation 4",
      desc: () => Yelan.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "party",
      selfLabels: ["Stacks"],
      labels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [4],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, ATTRs, "HP%", 10 * inputs[0], tracker);
      }
    }
  ]
};

export default Yelan;

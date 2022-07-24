import { addAndTrack } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { getFinalTlLv, round2 } from "../../../helpers";
import { anemoDmg, Green } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  PolearmNaDesc_6,
  PolearmUpCaDesc,
  SwordPaDesc_content,
  xiaoPAs
} from "../config";
import { checkAscs, xtraTlLv, NCPApcts } from "../helpers";
import tlLvMults from "../tlLvMults";

const Xiao = {
  code: 30,
  name: "Xiao",
  icon: "b/b9/Character_Xiao_Thumb",
  sideIcon: "8/83/Character_Xiao_Side_Icon",
  rarity: 5,
  nation: "Liyue",
  vision: "Anemo",
  weapon: "Polearm",
  stats: [
    { "Base HP": 991, "Base ATK": 27, "Base DEF": 62 },
    { "Base HP": 2572, "Base ATK": 71, "Base DEF": 161 },
    { "Base HP": 3422, "Base ATK": 94, "Base DEF": 215 },
    { "Base HP": 5120, "Base ATK": 140, "Base DEF": 321 },
    { "Base HP": 5724, "Base ATK": 157, "Base DEF": 359, "CRIT Rate": 4.8 },
    { "Base HP": 6586, "Base ATK": 181, "Base DEF": 413, "CRIT Rate": 4.8 },
    { "Base HP": 7391, "Base ATK": 203, "Base DEF": 464, "CRIT Rate": 9.6 },
    { "Base HP": 8262, "Base ATK": 227, "Base DEF": 519, "CRIT Rate": 9.6 },
    { "Base HP": 8866, "Base ATK": 243, "Base DEF": 556, "CRIT Rate": 9.6 },
    { "Base HP": 9744, "Base ATK": 267, "Base DEF": 612, "CRIT Rate": 9.6 },
    { "Base HP": 10348, "Base ATK": 284, "Base DEF": 649, "CRIT Rate": 14.4 },
    { "Base HP": 11236, "Base ATK": 308, "Base DEF": 705, "CRIT Rate": 14.4 },
    { "Base HP": 11840, "Base ATK": 325, "Base DEF": 743, "CRIT Rate": 19.2 },
    { "Base HP": 12736, "Base ATK": 349, "Base DEF": 799, "CRIT Rate": 19.2 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Whirlwind Thrust",
      desc: [
        PolearmNaDesc_6,
        PolearmUpCaDesc,
        {
          heading: "PA",
          content: (
            <>
              {SwordPaDesc_content}
              <br />
              Xiao does not take DMG from performing Plunging Attacks.
            </>
          )
        }
      ],
      stats: [
        {
          name: "1-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 27.54,
          multType: 4
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 56.94,
          multType: 4
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 68.55,
          multType: 4
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 37.66,
          multType: 4
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 71.54,
          multType: 4
        },
        {
          name: "6-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 95.83,
          multType: 4
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 121.09,
          multType: 4
        },
        CaStamina[25],
        ...xiaoPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Lemniscatic Wind Cycling",
      image: "d/da/Talent_Lemniscatic_Wind_Cycling",
      desc: [
        {
          content: (
            <>
              Xiao lunges forward, dealing {anemoDmg} to opponents in his path.
              Can be used in mid-air.
              <br />
              Starts with 2 charges.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 252.8,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "10s" }]
    },
    {
      type: "Elemental Burst",
      name: "Bane of All Evil",
      image: "2/2f/Talent_Bane_of_All_Evil",
      desc: [
        {
          content: (
            <>
              Xiao dons the Yaksha Mask that set gods and demons trembling
              millennia ago.
            </>
          )
        },
        {
          heading: "Yaksha's Mask",
          content: (
            <>
              • Greatly increases Xiao's jumping ability.
              <br />• Increases his attack AoE and attack DMG.
              <br />• Converts attack DMG into {anemoDmg}, which cannot be
              overridden by any other elemental infusion.
            </>
          )
        },
        {
          content: (
            <>
              In this state, Xiao will continuously lose HP.
              <br />
              The effects of this skill end when Xiao leaves the field.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [],
      otherStats: (lv = 1) => [
        {
          name: "Normal/Charged/Plunging Attack DMG Bonus",
          value: Xiao.buffs[0].bnValue({ "Elemental Burst": lv }) + "%"
        },
        {
          name: "Life Drain",
          value:
            Math.max(3.5 - Math.ceil(lv / 3) * 0.5, 2) +
            "% Current HP per Second"
        },
        { name: "Duration", value: "15s" },
        { name: "CD", value: "18s" }
      ],
      energyCost: 70
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Conqueror of Evil: Tamer of Demons",
      image: "d/df/Talent_Conqueror_of_Evil_Tamer_of_Demons",
      desc: (
        <>
          With the effects of Bane of All Evil, <Green>all DMG</Green> dealt by
          Xiao increases by <Green b>5%</Green>. DMG increases by a further{" "}
          <Green b>5%</Green> for every 3s the ability persists. The maximum DMG
          Bonus is <Green b>25%</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Dissolution Eon: Heaven Fall",
      image: "d/d8/Talent_Dissolution_Eon_Heaven_Fall",
      desc: (
        <>
          Using Lemniscatic Wind Cycling increases the DMG of subsequent{" "}
          <Green>Lemniscatic Wind Cycling</Green> by <Green b>15%</Green> for
          10s. This effect lasts for 7s, and has a maximum of <Green b>3</Green>{" "}
          <Green>stacks</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Transcension: Gravity Defier",
      image: "4/46/Talent_Transcension_Gravity_Defier",
      desc: (
        <>
          Decreases <Green>climbing Stamina consumption</Green> for your own
          party members by <Green b>20%</Green>.
          <br />
          Not stackable with Passive Talents that provide the exact same
          effects.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Dissolution Eon: Destroyer of Worlds",
      image: "e/e7/Constellation_Dissolution_Eon_-_Destroyer_of_Worlds",
      desc: (
        <>
          Increases Lemniscatic Wind Cycling's <Green>charges</Green> by{" "}
          <Green b>1</Green>.
        </>
      )
    },
    {
      name: "Annihilation Eon: Blossom of Kaleidos",
      image: "f/f7/Constellation_Annihilation_Eon_-_Blossom_of_Kaleidos",
      desc: (
        <>
          When in the party and not on the field, Xiao's{" "}
          <Green>Energy Recharge</Green> is increased by <Green b>25%</Green>.
        </>
      )
    },
    {
      name: "Conqueror of Evil: Wrath Deity",
      image: "6/69/Constellation_Conqueror_of_Evil_-_Wrath_Deity",
      desc: "Lemniscatic Wind Cycling"
    },
    {
      name: "Transcension: Extinction of Suffering",
      image: "2/24/Constellation_Transcension_-_Extinction_of_Suffering",
      desc: (
        <>
          When Xiao's HP falls below 50%, he gains a <Green b>100%</Green>{" "}
          <Green>DEF Bonus</Green>.
        </>
      )
    },
    {
      name: "Evolution Eon: Origin of Ignorance",
      image: "f/f9/Constellation_Evolution_Eon_-_Origin_of_Ignorance",
      desc: "Bane of All Evil"
    },
    {
      name: "Conqueror of Evil: Guardian Yaksha",
      image: "d/d7/Constellation_Conqueror_of_Evil_-_Guardian_Yaksha",
      desc: (
        <>
          While under the effects of Bane of All Evil, hitting at least 2
          opponents with Xiao's Plunging Attack will immediately grant him{" "}
          <Green b>1</Green> <Green>charge</Green> of Lemniscatic Wind Cycling,
          and for the next 1s, he may use Lemniscatic Wind Cycling while{" "}
          <Green>ignoring its CD</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: ({ char, partyData }) => (
        <>
          Increases Xiao's <Green>Normal / Charged / Plunge Attack DMG</Green>{" "}
          by <Green b>{Xiao.buffs[0].bnValue(char, partyData)}%</Green> and
          converts them to {anemoDmg}.
        </>
      ),
      isGranted: () => true,
      affect: "self",
      addBnes: ({ hitBnes, char, partyData, tkDesc, tracker }) => {
        const bnValue = Xiao.buffs[0].bnValue(char, partyData);
        addAndTrack(tkDesc, hitBnes, NCPApcts, bnValue, tracker);
      },
      bnValue: (char, partyData) => {
        const level = getFinalTlLv(char, Xiao.actvTalents[2], partyData);
        return round2(58.45 * tlLvMults[5][level]);
      },
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: false
    },
    {
      index: 1,
      src: "Ascension 1 Passive Talent",
      desc: () => Xiao.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [5],
      addBnes: ({ hitBnes, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "All.pct", 5 * inputs[0], tracker);
      }
    },
    {
      index: 2,
      src: "Ascension 4 Passive Talent",
      desc: () => Xiao.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [3],
      addBnes: ({ hitBnes, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "ES.pct", 15 * inputs[0], tracker);
      }
    }
  ]
};

export default Xiao;

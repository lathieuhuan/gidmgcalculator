import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { anemoDmg, anemoIA, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, lightPAs_Catalyst, sprintStaminaPasv } from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const Heizou = {
  code: 53,
  name: "Heizou",
  icon: "e/e4/Character_Shikanoin_Heizou_Thumb",
  sideIcon: "8/89/Character_Shikanoin_Heizou_Side_Icon",
  rarity: 4,
  nation: "Inazuma",
  vision: "Anemo",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 894, "Base ATK": 19, "Base DEF": 57 },
    { "Base HP": 2296, "Base ATK": 48, "Base DEF": 147 },
    { "Base HP": 2963, "Base ATK": 63, "Base DEF": 190 },
    { "Base HP": 4438, "Base ATK": 94, "Base DEF": 285 },
    { "Base HP": 4913, "Base ATK": 104, "Base DEF": 315, "Anemo DMG Bonus": 6 },
    { "Base HP": 5651, "Base ATK": 119, "Base DEF": 363, "Anemo DMG Bonus": 6 },
    {
      "Base HP": 6283,
      "Base ATK": 133,
      "Base DEF": 403,
      "Anemo DMG Bonus": 12
    },
    {
      "Base HP": 7021,
      "Base ATK": 148,
      "Base DEF": 451,
      "Anemo DMG Bonus": 12
    },
    {
      "Base HP": 7495,
      "Base ATK": 158,
      "Base DEF": 481,
      "Anemo DMG Bonus": 12
    },
    {
      "Base HP": 8233,
      "Base ATK": 174,
      "Base DEF": 528,
      "Anemo DMG Bonus": 12
    },
    {
      "Base HP": 8707,
      "Base ATK": 184,
      "Base DEF": 559,
      "Anemo DMG Bonus": 18
    },
    {
      "Base HP": 9445,
      "Base ATK": 200,
      "Base DEF": 606,
      "Anemo DMG Bonus": 18
    },
    {
      "Base HP": 9919,
      "Base ATK": 210,
      "Base DEF": 637,
      "Anemo DMG Bonus": 24
    },
    {
      "Base HP": 10657,
      "Base ATK": 225,
      "Base DEF": 684,
      "Anemo DMG Bonus": 24
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Fudou Style Martial Arts",
      desc: [
        {
          heading: "NA",
          content: (
            <>
              Performs up to 5 fisticuffs empowered by a mighty wind, dealing{" "}
              {anemoDmg}.
            </>
          )
        },
        {
          heading: "CA",
          content: (
            <>
              Consumes a certain amount of Stamina and performs a sweeping kick
              that deals {anemoDmg}.
            </>
          )
        },
        {
          heading: "PA",
          content: (
            <>
              Calling upon the surging wind, Heizou plunges towards the ground
              from mid-air, damaging all opponents in his path. Deals AoE{" "}
              {anemoDmg} upon impact with the ground.
            </>
          )
        }
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 37.47,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 36.85,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 51.06,
          multType: 2
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: [14.78, 16.26, 19.22],
          multType: 2
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 61.45,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 73,
          multType: 2
        },
        CaStamina[25],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Heartstopper Strike",
      image: "c/cb/Talent_Heartstopper_Strike",
      desc: [
        {
          heading: "Tab",
          content: (
            <>
              Wields the swift winds to launch a Heartstopper Strike that deals{" "}
              {anemoDmg}.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Charges energy to unleash an even stronger blow. He will obtain
              the Declension effect while charging, which will increase the
              power of the Heartstopper Strike. When the skill button is
              released or the skill finishes charging, he will strike forward,
              dealing {anemoDmg}.
            </>
          )
        },
        {
          heading: "Declension",
          content: (
            <>
              Increases the power of the next Heartstopper Strike. Max 4 stacks.
              <br />
              When you possess 4 Declension stacks, the Conviction effect will
              be produced, which will cause the next Hearstopper Strike to be
              even stronger and have a larger AoE.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 227.52,
          multType: 2
        },
        {
          name: "Declension DMG Bonus / stack",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 56.88,
          multType: 2
        },
        {
          name: "Conviction DMG Bonus",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 113.76,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Declension Duration", value: "60s" },
        { name: "CD", value: "10s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Windmuster Kick",
      image: "0/0a/Talent_Windmuster_Kick",
      desc: [
        {
          content: (
            <>
              Leaps into the air and uses the Fudou Style Vacuum Slugger to
              explosively kick his opponent, dealing AoE {anemoDmg}.
              <br />
              When Vacuum Slugger hits opponents affected by {anemoIA}, these
              opponents will be afflicted with Windmuster Iris, which will
              explode after a moment and deal AoE DMG of the corresponding
              aforementioned elemental type.
              <br />
              Vacuum Slugger can afflict a maximum of 4 opponents with the
              Windmuster Iris. A single opponent cannot be under the effect of
              Windmuster Irises of different elements at the same time.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Fudou Style Vacuum Slugger DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 314.69,
          multType: 2
        },
        {
          name: "Windmuster Iris DMG",
          dmgTypes: ["EB", "Various"],
          baseMult: 21.5,
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
      name: "Paradoxical Practice",
      image: "c/c4/Talent_Paradoxical_Practice",
      desc: (
        <>
          When Shikanoin Heizou activates a Swirl reaction while on the field,
          he will gain <Green b>1</Green> <Green>Declension stack</Green> for
          Heartstopper Strike. This effect can be triggered once every 0.1s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Penetrative Reasoning",
      image: "8/82/Talent_Penetrative_Reasoning",
      desc: (
        <>
          After Shikanoin Heizou's Heartstopper Strike hits an opponent,
          increases all party members' (excluding Shikanoin Heizou){" "}
          <Green>Elemental Mastery</Green> by <Green b>80</Green> for 10s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Pre-Existing Guilt",
      image: "b/b1/Talent_Cloud_Strider",
      desc: sprintStaminaPasv
    }
  ],
  constellation: [
    {
      name: "Named Juvenile Casebook",
      image: "6/65/Constellation_Named_Juvenile_Casebook",
      get desc() {
        return (
          <>
            {this.buff}
            He also gains <Green b>1</Green> <Green>Declension stack</Green> for
            Heartstopper Strike. This effect can be triggered once every 10s.
          </>
        );
      },
      buff: (
        <>
          For 5s after Shikanoin Heizou takes the field, his{" "}
          <Green>Normal Attack SPD</Green> is increased by <Green>15%</Green>.
        </>
      )
    },
    {
      name: "Investigative Collection",
      image: "0/03/Constellation_Investigative_Collection",
      desc: (
        <>
          When the Fudou Style Vacuum Slugger created by Windmuster Kick
          explodes, it will pull nearby opponents in.
        </>
      )
    },
    {
      name: "Esoteric Puzzle Book",
      image: "e/ee/Constellation_Esoteric_Puzzle_Book",
      desc: "Heartstopper Strike"
    },
    {
      name: "Tome of Lies",
      image: "5/59/Constellation_Tome_of_Lies",
      desc: (
        <>
          The first Windmuster Iris explosion in each Windmuster Kick will
          regenerate <Green b>9</Green> <Green>Elemental Energy</Green> for
          Shikanoin Heizou. Every subsequent explosion in that Windmuster Kick
          will each regenerate an additional <Green b>1.5</Green>{" "}
          <Green>Energy</Green> for Heizou.
          <br />
          One Windmuster Kick can regenerate a total of 13.5 Energy for Heizou
          in this manner.
        </>
      )
    },
    {
      name: "Secret Archive",
      image: "9/9d/Constellation_Secret_Archive",
      desc: "Windmuster Kick"
    },
    {
      name: "Curious Casefiles",
      image: "3/3a/Constellation_Curious_Casefiles",
      desc: (
        <>
          Each Declension stack will increase the <Green>CRIT Rate</Green> of
          the Heartstopper Strike unleashed by <Green b>4%</Green>. When Heizou
          possesses Conviction, this Heartstoppper Strike's{" "}
          <Green>CRIT DMG</Green> is increased by <Green b>32%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: () => Heizou.pasvTalents[1].desc,
      affect: "teammates",
      addBnes: simpleAnTmaker("ATTRs", "Elemental Mastery", 80)
    },
    {
      index: 1,
      src: "Constellation 1",
      desc: () => <>{Heizou.constellation[0].buff}</>,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Normal ATK SPD", 15)
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Heizou.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [4],
      addBnes: ({ hitBnes, inputs, tkDesc, tracker }) => {
        const fields = ["ES.cRate"];
        const bnValues = [4 * inputs[0]];
        if (inputs[0] === 4) {
          fields.push("ES.cDmg");
          bnValues.push(32);
        }
        addAndTrack(tkDesc, hitBnes, fields, bnValues, tracker);
      }
    }
  ]
};

export default Heizou;

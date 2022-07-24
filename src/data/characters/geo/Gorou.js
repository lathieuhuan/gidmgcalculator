import {
  addAndTrack,
  incElementalBnes,
  simpleAnTmaker
} from "../../../calculators/helpers";
import { getFinalTlLv } from "../../../helpers";
import { Geo, geoDmg, Green, Red } from "../../../styledCpns/DataDisplay";
import {
  BowCaDesc,
  bowCAs,
  BowNaDesc_4,
  BowPaDesc,
  lightPAs_Bow
} from "../config";
import {
  checkAscs,
  checkCharMC,
  checkCons,
  makeTlBnes,
  xtraTlLv
} from "../helpers";
import tlLvMults from "../tlLvMults";

const Gorou = {
  code: 44,
  name: "Gorou",
  icon: "5/56/Character_Gorou_Thumb",
  sideIcon: "6/67/Character_Gorou_Side_Icon",
  rarity: 4,
  nation: "Inazuma",
  vision: "Geo",
  weapon: "Bow",
  stats: [
    { "Base HP": 802, "Base ATK": 15, "Base DEF": 54 },
    { "Base HP": 2061, "Base ATK": 39, "Base DEF": 140 },
    { "Base HP": 2661, "Base ATK": 51, "Base DEF": 180 },
    { "Base HP": 3985, "Base ATK": 76, "Base DEF": 270 },
    { "Base HP": 4411, "Base ATK": 84, "Base DEF": 299, "Geo DMG Bonus": 6 },
    { "Base HP": 5074, "Base ATK": 97, "Base DEF": 344, "Geo DMG Bonus": 6 },
    { "Base HP": 5642, "Base ATK": 108, "Base DEF": 382, "Geo DMG Bonus": 12 },
    { "Base HP": 6305, "Base ATK": 120, "Base DEF": 427, "Geo DMG Bonus": 12 },
    { "Base HP": 6731, "Base ATK": 128, "Base DEF": 456, "Geo DMG Bonus": 12 },
    { "Base HP": 7393, "Base ATK": 141, "Base DEF": 501, "Geo DMG Bonus": 12 },
    { "Base HP": 7818, "Base ATK": 149, "Base DEF": 530, "Geo DMG Bonus": 18 },
    { "Base HP": 8481, "Base ATK": 162, "Base DEF": 575, "Geo DMG Bonus": 18 },
    { "Base HP": 8907, "Base ATK": 170, "Base DEF": 603, "Geo DMG Bonus": 24 },
    { "Base HP": 9570, "Base ATK": 183, "Base DEF": 648, "Geo DMG Bonus": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Ripping Fang Fletching",
      desc: [
        BowNaDesc_4,
        BowCaDesc("stone crystals", "A fully charged crystalline arrow", "Geo"),
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 37.75,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 37.15,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 49.45,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 59,
          multType: 1
        },
        ...bowCAs,
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Inuzaka All-Round Defense",
      image: "e/e6/Talent_Inuzaka_All-Round_Defense",
      desc: [
        {
          content: <>Deals AoE {geoDmg} and sets up a General's War Banner.</>
        },
        {
          heading: "General's War Banner",
          get content() {
            return (
              <>
                {this.lines[0]}
                {this.lines[1]}.{this.lines[2]}
                {this.lines[3]}
              </>
            );
          },
          lines: [
            <>
              Provides up to 3 buffs to active characters within the skill's AoE
              based on the number of <Geo>Geo</Geo> characters in the party at
              the time of casting:
            </>,
            <>
              <br />• 1 Geo character: Adds "Standing Firm" -{" "}
              <Green>DEF Bonus</Green>
            </>,
            <>
              <br />• 2 Geo characters: Adds "Impregnable" - Increased
              resistance to interruption.
            </>,
            <>
              <br />• 3 Geo character: Adds "Crunch" - <Green b>15%</Green>{" "}
              <Green>Geo DMG Bonus</Green>.
            </>
          ]
        },
        {
          content: (
            <>
              Gorou can deploy only 1 General's War Banner on the field at any
              one time. Characters can only benefit from 1 General's War Banner
              at a time. When a party member leaves the field, the active buff
              will last for 2s.
            </>
          )
        },
        {
          heading: "Hold",
          content: <>Adjust the location of the skill.</>
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 107.2,
          multType: 2
        },
        {
          name: "DEF Increase",
          baseMult: 0,
          multType: 2,
          baseFlat: 206,
          flatType: 2
        }
      ],
      otherStats: () => [
        { name: "Geo DMG Bonus", value: "10%" },
        { name: "Duration", value: "10s" },
        { name: "CD", value: "10s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Juuga: Forward Unto Victory",
      image: "f/f9/Talent_Juuga_Forward_Unto_Victory",
      desc: [
        {
          content: (
            <>
              Displaying his valor as a general, Gorou deals AoE {geoDmg} and
              creates a field known as General's Glory to embolden his comrades.
            </>
          )
        },
        {
          heading: "General's Glory",
          content: (
            <>
              This field has the following properties:
              <br />• Like the General's War Banner created by Inuzaka All-Round
              Defense, provides buffs to active characters within the skill's
              AoE based on the number of Geo characters in the party. Also moves
              together with your active character.
              <br />• Generates 1 Crystal Collapse every 1.5s that deals AoE{" "}
              {geoDmg} to 1 opponent within the skill's AoE.
              <br />• Pulls 1 elemental shard in the skill's AoE to your active
              character's position every 1.5s (elemental shards are created by
              Crystallize reactions).
            </>
          )
        },
        {
          content: (
            <>
              If a General's War Banner created by Gorou currently exists on the
              field when this ability is used, it will be destroyed. In
              addition, for the duration of General's Glory, Gorou's Elemental
              Skill "Inuzaka All-Round Defense" will not create the General's
              War Banner.
              <br />
              If Gorou falls, the effects of General's Glory will be cleared.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseSType: "DEF",
          baseMult: 98.22,
          multType: 2
        },
        {
          name: "Crystal Collapse DMG",
          dmgTypes: ["EB", "Elemental"],
          baseSType: "DEF",
          baseMult: 61.3,
          multType: 2
        },
        {
          name: "Heal Amount (C4)",
          baseSType: "DEF",
          isHealing: true,
          baseMult: 0,
          multType: 2,
          conditional: true,
          getTlBnes: ({ char }) => {
            return makeTlBnes(char.constellation >= 4, "mult", [0, 4], 50);
          }
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "9s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Heedless of the Wind and Weather",
      image: "8/89/Talent_Heedless_of_the_Wind_and_Weather",
      desc: (
        <>
          After using Juuga: Forward Unto Victory, all nearby party members'{" "}
          <Green>DEF</Green> is increased by <Green b>25%</Green> for 12s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "A Favor Repaid",
      image: "6/61/Talent_A_Favor_Repaid",
      desc: (
        <>
          Gorou receives the following DMG Bonuses to his attacks based on his
          DEF:
          <br />• <Green>Inuzaka All-Round Defense</Green>: Skill DMG increased
          by <Green b>156%</Green> of <Green>DEF</Green>
          <br />• <Green>Juuga: Forward Unto Victory</Green>: Skill DMG and
          Crystal Collapse DMG increased by <Green b>15.6%</Green> of{" "}
          <Green>DEF</Green>
        </>
      )
    },
    {
      type: "Passive",
      name: "Seeker of Shinies",
      image: "8/82/Talent_Seeker_of_Shinies",
      desc: (
        <>
          Displays the location of nearby <Green>resources</Green> unique to{" "}
          <Green>Inazuma</Green> on the mini-map.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Rushing Hound: Swift as the Wind",
      image: "2/2e/Constellation_Rushing_Hound_Swift_as_the_Wind",
      desc: (
        <>
          When characters (other than Gorou) within the AoE of Gorou's General's
          War Banner or General's Glory deal {geoDmg} to opponents, the{" "}
          <Green>CD</Green> of Gorou's Inuzaka All-Round Defense is decreased by{" "}
          <Green b>2s</Green>.
          <br />
          This effect can occur once every 10s.
        </>
      )
    },
    {
      name: "Sitting Hound: Steady as a Clock",
      image: "0/0c/Constellation_Sitting_Hound_Steady_as_a_Clock",
      desc: (
        <>
          While General's Glory is in effect, its <Green>duration</Green> is
          extended by <Green b>1s</Green> when a nearby active character obtains
          an Elemental Shard from a Crystallize reaction.
          <br />
          This effect can occur once every 0.1s. <Green>Max</Green> extension is{" "}
          <Green b>3s</Green>.
        </>
      )
    },
    {
      name: "Mauling Hound: Fierce as Fire",
      image: "2/25/Constellation_Mauling_Hound_Fierce_as_Fire",
      desc: "Inuzaka All-Round Defense"
    },
    {
      name: "Lapping Hound: Warm as Water",
      image: "4/4d/Constellation_Lapping_Hound_Warm_as_Water",
      desc: (
        <>
          When General's Glory is in the "Impregnable" or "Crunch" states, it
          will also <Green>heal</Green> active characters within its AoE by{" "}
          <Green b>50%</Green> of Gorou's own <Green>DEF</Green> every 1.5s.
        </>
      )
    },
    {
      name: "Striking Hound: Thunderous Force",
      image: "4/47/Constellation_Striking_Hound_Thunderous_Force",
      desc: "Juuga: Forward Unto Victory"
    },
    {
      name: "Valiant Hound: Mountainous Fealty",
      image: "9/9d/Constellation_Valiant_Hound_Mountainous_Fealty",
      get desc() {
        return (
          <>
            {this.lines[0]}
            {this.lines[1]}
            {this.lines[2]}
            {this.lines[3]}
          </>
        );
      },
      lines: [
        <>
          For 12s after using Inuzaka All-Round Defense or Juuga: Forward Unto
          Victory, increases the <Green>CRIT DMG</Green> of all nearby party
          members' {geoDmg} based on the buff level of the skill's field at the
          time of use:
        </>,
        <>
          <br />• "Standing Firm": <Green b>+10%</Green>
        </>,
        <>
          <br />• "Impregnable": <Green b>+20%</Green>
        </>,
        <>
          <br />• "Crunch": <Green b>+40%</Green>
        </>
      ]
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: ({ toSelf, charData, inputs, partyData }) => {
        const numOfGeo = countGeo(charData, partyData);
        return (
          <>
            {Gorou.actvTalents[1].desc[1].lines[0]}
            <span className={numOfGeo >= 1 ? "" : "unavailable"}>
              {Gorou.actvTalents[1].desc[1].lines[1]}
              {toSelf ? (
                "."
              ) : (
                <>
                  : <Red>{Gorou.buffs[0].bnValue(inputs[0])}.</Red>
                </>
              )}
            </span>
            <span className={numOfGeo >= 2 ? "" : "unavailable"}>
              {Gorou.actvTalents[1].desc[1].lines[2]}
            </span>
            <span className={numOfGeo >= 3 ? "" : "unavailable"}>
              {Gorou.actvTalents[1].desc[1].lines[3]}
            </span>
          </>
        );
      },
      isGranted: () => true,
      affect: "party",
      labels: ["Elemental Skill Level"],
      inputs: [1],
      inputTypes: ["text"],
      maxs: [13],
      addBnes: (obj) => {
        const level = obj.toSelf
          ? getFinalTlLv(obj.char, Gorou.actvTalents[1], obj.partyData)
          : obj.inputs[0];
        let fields = "DEF";
        let bnValues = Gorou.buffs[0].bnValue(level);
        if (countGeo(obj.charData, obj.partyData) > 2) {
          fields = [fields, "Geo DMG Bonus"];
          bnValues = [bnValues, 15];
        }
        addAndTrack(obj.tkDesc, obj.ATTRs, fields, bnValues, obj.tracker);
      },
      bnValue: (level) => Math.round(206 * tlLvMults[2][level])
    },
    {
      index: 1,
      src: "Ascension 1 Pasive Talent",
      desc: () => Gorou.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "DEF%", 25)
    },
    {
      index: 2,
      src: "Ascension 4 Pasive Talent",
      desc: () => Gorou.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      addFinalBnes: ({ hitBnes, ATTRs, tkDesc, tracker }) => {
        const bnValues = [ATTRs.DEF * 1.56, ATTRs.DEF * 0.156];
        addAndTrack(tkDesc, hitBnes, ["ES.flat", "EB.flat"], bnValues, tracker);
      }
    },
    {
      index: 3,
      src: "Constellation 6",
      desc: ({ charData, partyData }) => {
        const n = countGeo(charData, partyData);
        return (
          <>
            {Gorou.constellation[5].lines[0]}
            <span className={n === 1 ? "" : "unavailable"}>
              {Gorou.constellation[5].lines[1]}
            </span>
            <span className={n === 2 ? "" : "unavailable"}>
              {Gorou.constellation[5].lines[2]}
            </span>
            <span className={n >= 3 ? "" : "unavailable"}>
              {Gorou.constellation[5].lines[3]}
            </span>
          </>
        );
      },
      isGranted: checkCons[6],
      affect: "party",
      addBnes: (obj) => {
        const { charData } = obj;
        const settings = {
          vision: charData.vision,
          infusion: obj.infusion,
          elmt: "Geo",
          type: "cDmg",
          value: [10, 20, 40, 40][countGeo(charData, obj.partyData) - 1]
        };
        incElementalBnes(settings, obj.hitBnes, obj.tkDesc, obj.tracker);
      }
    }
  ]
};

export default Gorou;

const countGeo = (charData, partyData) =>
  partyData.reduce(
    (result, data) => (data.vision === "Geo" ? result + 1 : result),
    charData.vision === "Geo" ? 1 : 0
  );

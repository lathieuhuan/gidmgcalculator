import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { applyPct, getFinalTlLv } from "../../../helpers";
import { geoDmg, Green } from "../../../styledCpns/DataDisplay";
import {
  CaStaminaClaymore,
  ClaymoreDesc_4spin,
  doubleCooking,
  heavyPAs
} from "../config";
import { checkCharMC, checkCons, makeTlBnes, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const Noelle = {
  code: 14,
  name: "Noelle",
  icon: "a/ab/Character_Noelle_Thumb",
  sideIcon: "5/5e/Character_Noelle_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Geo",
  weapon: "Claymore",
  stats: [
    { "Base HP": 1012, "Base ATK": 16, "Base DEF": 67 },
    { "Base HP": 2600, "Base ATK": 41, "Base DEF": 172 },
    { "Base HP": 3356, "Base ATK": 53, "Base DEF": 222 },
    { "Base HP": 5027, "Base ATK": 80, "Base DEF": 333 },
    { "Base HP": 5564, "Base ATK": 88, "Base DEF": 368, "DEF%": 7.5 },
    { "Base HP": 6400, "Base ATK": 101, "Base DEF": 423, "DEF%": 7.5 },
    { "Base HP": 7117, "Base ATK": 113, "Base DEF": 471, "DEF%": 15 },
    { "Base HP": 7953, "Base ATK": 126, "Base DEF": 526, "DEF%": 15 },
    { "Base HP": 8490, "Base ATK": 134, "Base DEF": 562, "DEF%": 15 },
    { "Base HP": 9325, "Base ATK": 148, "Base DEF": 617, "DEF%": 15 },
    { "Base HP": 9862, "Base ATK": 156, "Base DEF": 652, "DEF%": 22.5 },
    { "Base HP": 10698, "Base ATK": 169, "Base DEF": 708, "DEF%": 22.5 },
    { "Base HP": 11235, "Base ATK": 178, "Base DEF": 743, "DEF%": 30 },
    { "Base HP": 12071, "Base ATK": 191, "Base DEF": 799, "DEF%": 30 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Favonius Bladework - Maid",
      desc: ClaymoreDesc_4spin,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 79.12,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 73.36,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 86.26,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 113.43,
          multType: 1
        },
        {
          name: "Charged Attack Spinning",
          dmgTypes: ["CA", "Physical"],
          baseMult: 50.74,
          multType: 1
        },
        {
          name: "Charged Attack Final",
          dmgTypes: ["CA", "Physical"],
          baseMult: 90.47,
          multType: 1
        },
        ...CaStaminaClaymore,
        ...heavyPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Breastplate",
      image: "5/5a/Talent_Breastplate",
      desc: [
        {
          content: (
            <>
              Summons protective stone armor, dealing Geo DMG to surrounding
              opponents and creating a shield. The shield's DMG Absorption
              scales based on Noelle's DEF.
              <br />
              The shield has the following properties:
              <br />• When Noelle's Normal and Charged Attacks hit a target,
              they have a certain chance to regenerate HP for all characters.
              <br />• Possesses 150% DMG Absorption efficiency against all
              Elemental and Physical DMG.
            </>
          )
        },
        {
          content: (
            <>
              The amount of HP healed when regeneration is triggered scales
              based on Noelle's DEF.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseSType: "DEF",
          baseMult: 120,
          multType: 2
        },
        {
          name: "DMG Absorption",
          baseSType: "DEF",
          baseMult: 160,
          multType: 2,
          baseFlat: 770,
          flatType: 3
        },
        {
          name: "Healing",
          isHealing: true,
          baseSType: "DEF",
          baseMult: 21.28,
          multType: 2,
          baseFlat: 103,
          flatType: 3
        }
      ],
      otherStats: (lv) => [
        {
          name: "Healing Trigger Chance",
          value: (lv < 11 ? 49 + lv : lv === 11 ? 59 : 60) + "%"
        },
        { name: "Duration", value: "12s" },
        { name: "CD", value: "24s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Sweeping Time",
      image: "7/7c/Talent_Sweeping_Time",
      desc: [
        {
          get content() {
            return (
              <>
                Gathering the strength of stone around her weapon, Noelle
                strikes the opponents surrounding her within a large AoE,
                dealing Geo DMG.
                <br />
                Afterwards, Noelle gains the following effects:
                <br />• Larger attack AoE.
                <br />
                {this.lines[0]}
                {this.lines[1]}
              </>
            );
          },
          lines: [
            <>
              • <Green>Converts</Green> attack DMG to {geoDmg} that cannot be
              overridden by any other elemental infusion.
            </>,
            <>
              <br />• Increased <Green>ATK</Green> that scales based on her{" "}
              <Green>DEF</Green>.
            </>
          ]
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Burst DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 67.2,
          multType: 2
        },
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 92.8,
          multType: 2
        },
        {
          name: "ATK Bonus",
          baseSType: "DEF",
          baseMult: 40,
          multType: 2,
          getTlBnes: ({ char, selfMCs }) =>
            makeTlBnes(
              checkCharMC(Noelle.buffs, char, selfMCs.BCs, 2),
              "mult",
              [0, 6],
              50
            )
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "15s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Devotion",
      image: "b/b2/Talent_Devotion",
      desc: (
        <>
          When Noelle is in the party but not on the field, this ability
          triggers automatically when your active character's HP falls below
          30%:
          <br />
          Creates a shield for your active character that lasts for 20s and{" "}
          <Green>absorbs DMG</Green> equal to <Green b>400%</Green> of Noelle's{" "}
          <Green>DEF</Green>.
          <br />
          The shield has a 150% DMG Absorption effectiveness against all
          Elemental and Physical DMG.
          <br />
          This effect can only occur once every 60s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Nice and Clean",
      image: "9/9a/Talent_Nice_and_Clean",
      desc: (
        <>
          Noelle will decrease the <Green>CD</Green> of Breastplate by{" "}
          <Green b>1s</Green> for every 4 Normal or Charged Attack hits she
          scores on opponents.
          <br />
          One hit may be counted every 0.1s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Maid's Knighthood",
      image: "d/dd/Talent_Maid%27s_Knighthood",
      desc: doubleCooking("Noelle", "DEF-boosting dish")
    }
  ],
  constellation: [
    {
      name: "I Got Your Back",
      image: "7/73/Constellation_I_Got_Your_Back",
      desc: (
        <>
          While Sweeping Time and Breastplate are both in effect, the{" "}
          <Green>chance</Green> of Breastplate's <Green>healing</Green> effects
          activating is increased to <Green b>100%</Green>.
        </>
      )
    },
    {
      name: "Combat Maid",
      image: "7/73/Constellation_Combat_Maid",
      get desc() {
        return (
          <>
            Decreases the <Green>Stamina Consumption</Green> of Noelle's{" "}
            <Green>Charged Attacks</Green> by <Green b>20%</Green> and increases{" "}
            {this.buff}.
          </>
        );
      },
      buff: (
        <>
          her <Green>Charged Attack DMG</Green> by <Green b>15%</Green>.
        </>
      )
    },
    {
      name: "Invulnerable Maid",
      image: "3/36/Constellation_Invulnerable_Maid",
      desc: "Breastplate"
    },
    {
      name: "To Be Cleaned",
      image: "8/81/Constellation_To_Be_Cleaned",
      desc: (
        <>
          When Breastplate's duration expires or it is destroyed by DMG, it will
          deal <Green b>400%</Green> <Green>ATK</Green> of {geoDmg} to
          surrounding opponents.
        </>
      )
    },
    {
      name: "Favonius Sweeper Master",
      image: "3/3f/Constellation_Favonius_Sweeper_Master",
      desc: "Sweeping Time"
    },
    {
      name: "Must Be Spotless",
      image: "1/14/Constellation_Must_Be_Spotless",
      get desc() {
        return (
          <>
            {this.buff}
            <br />
            Additionally, every opponent defeated during the skill's duration
            adds <Green b>1s</Green> to the <Green>duration</Green>, up to{" "}
            <Green b>10s</Green>.
          </>
        );
      },
      buff: (
        <>
          <Green>Sweeping Time</Green> increases Noelle's <Green>ATK</Green> by
          an additional <Green b>50%</Green> of her <Green>DEF</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: () => (
        <>
          {Noelle.actvTalents[2].desc[0].lines[0]}
          {Noelle.actvTalents[2].desc[0].lines[1]}
        </>
      ),
      isGranted: () => true,
      affect: "self",
      addFinalBnes: ({ ATTRs, char, charBCs, partyData, tkDesc, tracker }) => {
        const level = getFinalTlLv(char, Noelle.actvTalents[2], partyData);
        let mult = 40 * tlLvMults[2][level];
        if (checkCharMC(Noelle.buffs, char, charBCs, 2)) {
          mult += 50;
        }
        addAndTrack(tkDesc, ATTRs, "ATK", applyPct(ATTRs.DEF, mult), tracker);
      },
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: false
    },
    {
      index: 1,
      src: "Constellation 2",
      desc: () => <>Increases {Noelle.constellation[1].buff}</>,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "CA.pct", 15)
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Noelle.constellation[5].buff,
      isGranted: checkCons[6],
      affect: "self"
    }
  ]
};

export default Noelle;

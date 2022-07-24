import { addAndTrack } from "../../../calculators/helpers";
import { getFinalTlLv, round2 } from "../../../helpers";
import { cryoDmg, Green, Red } from "../../../styledCpns/DataDisplay";
import {
  BowCaDesc,
  bowCAs,
  BowNaDesc_4,
  BowPaDesc,
  lightPAs_Bow
} from "../config";
import { checkAscs, findInput, modIsOn } from "../helpers";
import tlLvMults from "../tlLvMults";

export const Aloy = {
  code: 39,
  name: "Aloy",
  icon: "6/6a/Character_Aloy_Thumb",
  sideIcon: "0/0c/Character_Aloy_Side_Icon",
  rarity: 5,
  nation: "Outland",
  vision: "Cryo",
  weapon: "Bow",
  stats: [
    { "Base HP": 848, "Base ATK": 18, "Base DEF": 53 },
    { "Base HP": 2201, "Base ATK": 47, "Base DEF": 137 },
    { "Base HP": 2928, "Base ATK": 63, "Base DEF": 182 },
    { "Base HP": 4382, "Base ATK": 94, "Base DEF": 272 },
    {
      "Base HP": 4899,
      "Base ATK": 105,
      "Base DEF": 304,
      "Cryo DMG Bonus": 7.2
    },
    {
      "Base HP": 5636,
      "Base ATK": 121,
      "Base DEF": 350,
      "Cryo DMG Bonus": 7.2
    },
    {
      "Base HP": 6325,
      "Base ATK": 136,
      "Base DEF": 393,
      "Cryo DMG Bonus": 14.4
    },
    {
      "Base HP": 7070,
      "Base ATK": 152,
      "Base DEF": 439,
      "Cryo DMG Bonus": 14.4
    },
    {
      "Base HP": 7587,
      "Base ATK": 163,
      "Base DEF": 471,
      "Cryo DMG Bonus": 14.4
    },
    {
      "Base HP": 8339,
      "Base ATK": 179,
      "Base DEF": 517,
      "Cryo DMG Bonus": 14.4
    },
    {
      "Base HP": 8856,
      "Base ATK": 190,
      "Base DEF": 550,
      "Cryo DMG Bonus": 21.6
    },
    {
      "Base HP": 9616,
      "Base ATK": 206,
      "Base DEF": 597,
      "Cryo DMG Bonus": 21.6
    },
    {
      "Base HP": 10133,
      "Base ATK": 217,
      "Base DEF": 629,
      "Cryo DMG Bonus": 28.8
    },
    {
      "Base HP": 10899,
      "Base ATK": 234,
      "Base DEF": 676,
      "Cryo DMG Bonus": 28.8
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Rapid Fire",
      desc: [
        BowNaDesc_4,
        BowCaDesc("biting frost", "A fully charged frost arrow", "Cryo"),
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: [21.12, 23.76],
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 43.12,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 52.8,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 65.65,
          multType: 1
        },
        ...bowCAs,
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Frozen Wilds",
      image: "9/9a/Talent_Frozen_Wilds",
      desc: [
        {
          content: (
            <>
              Aloy throws a Freeze Bomb in the targeted direction that explodes
              on impact, dealing {cryoDmg}. After it explodes, the Freeze Bomb
              will split up into many Chillwater Bomblets that explode on
              contact with opponents or after a short delay, dealing {cryoDmg}.
              <br />
              When a Freeze Bomb or Chillwater Bomblet hits an opponent, the
              opponent's ATK is decreased and Aloy receives 1 Coil stack.
              <br />
              Aloy can gain up to 1 Coil stack every 0.1s.
            </>
          )
        },
        {
          heading: "Coil",
          get content() {
            return (
              <>
                • {this.lines[0]}
                <br />• {this.lines[1]}
              </>
            );
          },
          lines: [
            <>
              Each stack increases Aloy's <Green>Normal Attack DMG</Green>.
            </>,
            <>
              When Aloy has 4 Coil stacks, all stacks of Coil are cleared. She
              then enters the Rushing Ice state, which further increases the{" "}
              <Green>DMG</Green> dealt by her <Green>Normal Attacks</Green> and
              converts her <Green>Normal Attack DMG</Green> to {cryoDmg}.
            </>
          ]
        },
        {
          content: (
            <>
              While in the Rushing Ice state, Aloy cannot obtain new Coil
              stacks. Coil effects will be cleared 30s after Aloy leaves the
              field.
            </>
          )
        }
      ],
      stats: [
        {
          name: "Freeze Bomb",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 177.6,
          multType: 2
        },
        {
          name: "Chillwater Bomblets",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 40,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        {
          name: "ATK Decrease",
          value: Math.min(11 + Math.ceil(lv / 3), 15) + "%"
        },
        { name: "ATK Decrease Duration", value: "6s" },
        {
          name: "Coil Normal Attack DMG Bonus",
          value: [1, 2, 3]
            .map((stack) => round2(5.846 * tlLvMults[5][lv] * stack) + "%")
            .join(" / ")
        },
        {
          name: "Rushing Ice Normal Attack DMG Bonus",
          value: round2(29.23 * tlLvMults[5][lv]) + "%"
        },
        { name: "Rushing Ice Duration", value: "10s" },
        { name: "CD", value: "20s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Prophecies of Dawn",
      image: "b/b4/Talent_Prophecies_of_Dawn",
      desc: [
        {
          content: (
            <>
              Aloy throws a Power Cell filled with Cryo in the targeted
              direction, then detonates it with an arrow, dealing AoE {cryoDmg}.
            </>
          )
        }
      ],
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 359.2,
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
      name: "Combat Override",
      image: "0/01/Talent_Combat_Override",
      desc: (
        <>
          When Aloy receives the Coil effect from Frozen Wilds, her{" "}
          <Green>ATK</Green> is increased by <Green b>16%</Green>, while nearby
          party members' <Green>ATK</Green> is increased by <Green b>8%</Green>.
          This effect lasts 10s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Strong Strike",
      image: "b/ba/Talent_Strong_Strike",
      desc: (
        <>
          When Aloy is in the Rushing Ice state conferred by Frozen Wilds, her{" "}
          <Green>Cryo DMG Bonus</Green> increases by <Green b>3.5%</Green> every
          1s, up to <Green b>35%</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Easy Does It",
      image: "0/0f/Talent_Easy_Does_It",
      desc: (
        <>
          When Aloy is in the party, animals who produce Fowl, Raw Meat, or
          Chilled Meat will not be startled when party members approach them.
        </>
      )
    }
  ],
  constellation: [],
  buffs: [
    {
      index: 0,
      src: "Coil stacks",
      desc: ({ char, charBCs, partyData }) => (
        <>
          {Aloy.actvTalents[1].desc[1].lines[0]}{" "}
          <Red>
            Total DMG Bonus: {Aloy.buffs[0].bnValue(char, charBCs, partyData)}%.
          </Red>
        </>
      ),
      isGranted: () => true,
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [3],
      addBnes: ({ hitBnes, char, charBCs, partyData, tkDesc, tracker }) => {
        const bnValue = Aloy.buffs[0].bnValue(char, charBCs, partyData);
        addAndTrack(tkDesc, hitBnes, "NA.pct", bnValue, tracker);
      },
      bnValue: (char, charBCs, partyData) => {
        const level = getFinalTlLv(char, Aloy.actvTalents[1], partyData);
        const stacks = modIsOn(charBCs, 1) ? 5 : findInput(charBCs, 0, 0);
        return round2(5.846 * tlLvMults[5][level] * stacks);
      }
    },
    {
      index: 1,
      src: "Max Coil stacks",
      desc: () => Aloy.actvTalents[1].desc[1].lines[1],
      isGranted: () => true,
      affect: "self",
      canInfuse: () => true,
      infuseRange: ["NA"],
      canBeOverrided: false
    },
    {
      index: 2,
      src: "Ascension 1 Passive Talent",
      desc: () => Aloy.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "party",
      addBnes: ({ ATTRs, toSelf, tkDesc, tracker }) => {
        addAndTrack(tkDesc, ATTRs, "ATK%", toSelf ? 16 : 8, tracker);
      }
    },
    {
      index: 3,
      src: "Ascension 4 Passive Talent",
      desc: () => Aloy.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [10],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        const bnValue = 3.5 * inputs[0];
        addAndTrack(tkDesc, ATTRs, "Cryo DMG Bonus", bnValue, tracker);
      }
    }
  ]
};

export default Aloy;

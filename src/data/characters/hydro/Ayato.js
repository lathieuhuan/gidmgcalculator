import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { applyPct, getFinalTlLv } from "../../../helpers";
import { Green, hydroDmg } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  mediumPAs,
  susCooking,
  SwordNaDesc,
  SwordPaDesc
} from "../config";
import {
  checkCharMC,
  checkCons,
  findInput,
  makeTlBnes,
  modIsOn,
  xtraTlLv
} from "../helpers";
import tlLvMults from "../tlLvMults";

const tlBnes_cons1 = (char, BCs) => [
  checkCharMC(Ayato.buffs, char, BCs, 3),
  "pct",
  [0, 1],
  40
];

const tlBnes_ES = ({ char, selfMCs: { BCs }, ATTRs, partyData }) => {
  if (modIsOn(BCs, 0)) {
    const level = getFinalTlLv(char, Ayato.actvTalents[1], partyData);
    const finalMult = 0.56 * findInput(BCs, 0, 0) * tlLvMults[7][level];
    const flat = applyPct(ATTRs.HP, finalMult);
    return makeTlBnes([
      [true, "flat", "Elemental Skill", flat],
      tlBnes_cons1(char, BCs)
    ]);
  }
};

const Ayato = {
  code: 50,
  name: "Ayato",
  GOOD: "KamisatoAyato",
  icon: "a/a2/Character_Kamisato_Ayato_Thumb",
  sideIcon: "a/ab/Character_Kamisato_Ayato_Side_Icon",
  rarity: 5,
  nation: "Inazuma",
  vision: "Hydro",
  weapon: "Sword",
  stats: [
    { "Base HP": 1068, "Base ATK": 23, "Base DEF": 60 },
    { "Base HP": 2770, "Base ATK": 60, "Base DEF": 155 },
    { "Base HP": 3685, "Base ATK": 80, "Base DEF": 206 },
    { "Base HP": 5514, "Base ATK": 120, "Base DEF": 309 },
    { "Base HP": 6165, "Base ATK": 134, "Base DEF": 345, "CRIT DMG": 9.6 },
    { "Base HP": 7092, "Base ATK": 155, "Base DEF": 397, "CRIT DMG": 9.6 },
    { "Base HP": 7960, "Base ATK": 174, "Base DEF": 446, "CRIT DMG": 19.2 },
    { "Base HP": 8897, "Base ATK": 194, "Base DEF": 499, "CRIT DMG": 19.2 },
    { "Base HP": 9548, "Base ATK": 208, "Base DEF": 535, "CRIT DMG": 19.2 },
    { "Base HP": 10494, "Base ATK": 229, "Base DEF": 588, "CRIT DMG": 19.2 },
    { "Base HP": 11144, "Base ATK": 243, "Base DEF": 624, "CRIT DMG": 28.8 },
    { "Base HP": 12101, "Base ATK": 264, "Base DEF": 678, "CRIT DMG": 28.8 },
    { "Base HP": 12751, "Base ATK": 278, "Base DEF": 715, "CRIT DMG": 38.4 },
    { "Base HP": 13715, "Base ATK": 299, "Base DEF": 769, "CRIT DMG": 38.4 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Kamisato Art - Marobashi",
      desc: [
        SwordNaDesc,
        {
          heading: "CA",
          content: (
            <>
              Consumes a certain amount of Stamina to dash forward and perform
              an iai.
            </>
          )
        },
        SwordPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 44.96,
          multType: 7
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 47.16,
          multType: 7
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 58.61,
          multType: 7
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 29.45,
          multType: 7
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 75.6,
          multType: 7
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 129.53,
          multType: 7
        },
        CaStamina[20],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Kamisato Art: Kyouka",
      image: "5/5d/Talent_Kamisato_Art_Kyouka",
      desc: [
        {
          content: (
            <>
              Kamisato Ayato shifts positions and enters the Takimeguri Kanka
              state.
              <br />
              After this shift, he will leave a watery illusion at his original
              location. After it is formed, the watery illusion will explode if
              opponents are nearby or after its duration ends, dealing AoE{" "}
              {hydroDmg}.
            </>
          )
        },
        {
          heading: "Takimeguri Kanka",
          get content() {
            return (
              <>
                In this state, Kamisato Ayato uses his Shunsuiken to engage in
                blindingly fast attacks, causing {this.lines[0]}
                <br />
                It also has the following properties:
                <br />• After a Shunsuiken attack hits an opponent, it will
                grant Ayato the Namisen effect, increasing {this.lines[1]} The
                initial maximum number of Namisen <Green>stacks</Green> is{" "}
                <Green b>4</Green>, and 1 stack can be gained through Shunsuiken
                every 0.1s. This effect will be dispelled when Takimeguri Kanka
                ends.
                <br />• Kamisato Ayato's resistance to interruption is
                increased.
                <br />• Unable to use Charged or Plunging Attacks.
              </>
            );
          },
          lines: [
            <>
              <Green>DMG</Green> from his <Green>Normal Attacks</Green> to be{" "}
              <Green>converted</Green> into AoE {hydroDmg}. This cannot be
              overridden.
            </>,
            <>
              the <Green>DMG</Green> dealt by <Green>Shunsuiken</Green> based on
              Ayato's <Green>current Max HP</Green>.
            </>
          ]
        },
        {
          content: (
            <>
              Takimeguri Kanka will be cleared when Ayato leaves the field.
              Using Kamisato Art: Kyouka again while in the Takimeguri Kanka
              state will reset and replace the pre-existing state.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Shunsuiken 1-Hit DMG",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 52.89,
          multType: 7,
          getTlBnes: tlBnes_ES
        },
        {
          name: "Shunsuiken 2-Hit DMG",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 58.91,
          multType: 7,
          getTlBnes: tlBnes_ES
        },
        {
          name: "Shunsuiken 3-Hit DMG",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 64.93,
          multType: 7,
          getTlBnes: tlBnes_ES
        },
        {
          name: "Extra Shunsuiken strike (1/2) (C6)",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 0,
          multType: 7,
          conditional: true,
          getTlBnes: ({ char, selfMCs }) =>
            makeTlBnes([
              tlBnes_cons1(char, selfMCs.BCs),
              [checkCons[6](char), "mult", [0, 6], 450]
            ])
        },
        {
          name: "Takimeguri Kanka Duration",
          noCalc: true,
          getValue: () => "6s"
        },
        {
          name: "Namisen DMG Bonus",
          noCalc: true,
          getValue: (lv) =>
            Math.round(56 * tlLvMults[7][lv]) / 100 + "% Max HP/stack"
        },
        {
          name: "Namisen DMG Bonus",
          baseSType: "HP",
          baseMult: 0,
          multType: 7,
          conditional: true,
          getTlBnes: ({ char, selfMCs, partyData }) => {
            const level = getFinalTlLv(char, Ayato.actvTalents[1], partyData);
            const stacks = findInput(selfMCs.BCs, 0, 0);
            return {
              mult: {
                desc: `Namisen effect with ${stacks} stacks`,
                value: 0.56 * stacks * tlLvMults[7][level]
              }
            };
          }
        },
        {
          name: "Water Illusion DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 101.48,
          multType: 7
        }
      ],
      otherStats: () => [
        { name: "Water Illusion Duration", value: "6s" },
        { name: "CD", value: "12s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Kamisato Art: Suiyuu",
      image: "e/e8/Talent_Kamisato_Art_Suiyuu",
      desc: [
        {
          content: (
            <>
              Unveils a garden of purity that extinguishes all cacophony within.
              <br />
              While this space exists, Bloomwater Blades will constantly rain
              down and attack opponents within its AoE, dealing {hydroDmg} and
              increasing the <Green>Normal Attack DMG Bonus</Green> of
              characters within.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Bloomwater Blade DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 66.46,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        {
          name: "Normal Attack DMG Bonus",
          value: Ayato.buffs[1].calcValue(lv) + "%"
        },
        { name: "Duration", value: "18s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Kamisato Art: Mine Wo Matoishi Kiyotaki",
      image: "7/77/Talent_Kamisato_Art_Mine_Wo_Matoishi_Kiyotaki",
      desc: (
        <>
          <Green>Kamisato Art: Kyouka</Green> has the following properties:
          <br />• After it is used, Kamisato Ayato will gain <Green b>
            2
          </Green>{" "}
          Namisen <Green>stacks</Green>.
          <br />• When the water illusion explodes due to being attacked, Ayato
          will gain a Namisen effect equal to the <Green b>maximum</Green>{" "}
          number of <Green>stacks</Green> possible.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Kamisato Art: Michiyuku Hagetsu",
      image: "b/ba/Talent_Kamisato_Art_Michiyuku_Hagetsu",
      desc: (
        <>
          If Kamisato Ayato is not on the field and his Energy is less than 40,
          he will regenerate <Green b>2</Green> <Green>Energy</Green> for
          himself every second.
        </>
      )
    },
    {
      type: "Passive",
      name: "Kamisato Art: Daily Cooking",
      image: "4/43/Talent_Kamisato_Art_Daily_Cooking",
      desc: susCooking("Ayato", "he")
    }
  ],
  constellation: [
    {
      name: "Kyouka Fushi",
      image: "a/ac/Constellation_Kyouka_Fuushi",
      desc: (
        <>
          <Green>Shunsuiken DMG</Green> is increased by <Green b>40%</Green>{" "}
          against opponents with 50% HP or less.
        </>
      )
    },
    {
      name: "World Source",
      image: "e/ed/Constellation_World_Source",
      get desc() {
        return (
          <>
            Namisen's <Green>maximum stack</Green> count is increased to{" "}
            <Green b>5</Green>. {this.buff}
          </>
        );
      },
      buff: (
        <>
          When Kamisato Ayato has at least 3 Namisen stacks, his{" "}
          <Green>Max HP</Green> is increased by <Green b>50%</Green>.
        </>
      )
    },
    {
      name: "To Admire the Flower",
      image: "0/06/Constellation_To_Admire_the_Flowers",
      desc: "Kamisato Art: Kyouka"
    },
    {
      name: "Endles Flow",
      image: "d/de/Constellation_Endless_Flow",
      desc: (
        <>
          After using Kamisato Art: Suiyuu, all nearby party members will have{" "}
          <Green b>15%</Green> increased <Green>Normal Attack SPD</Green> for
          12s.
        </>
      )
    },
    {
      name: "Bansui Ichiro",
      image: "f/f1/Constellation_Bansui_Ichiro",
      desc: "Kamisato Art: Suiyuu"
    },
    {
      name: "Boundless Origin",
      image: "d/da/Constellation_Boundless_Origin",
      desc: (
        <>
          After using Kamisato Art: Kyouka, Ayato's next Shunsuiken attack will
          create <Green b>2</Green> extra Shunsuiken <Green>strikes</Green> when
          they hit opponents, each one dealing <Green b>450%</Green> of Ayato's{" "}
          <Green>ATK</Green> as DMG.
          <br />
          Both these Shunsuiken attacks will not be affected by Namisen.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: () => (
        <>
          • Causes {Ayato.actvTalents[1].desc[1].lines[0]}
          <br />• Namisen increases {Ayato.actvTalents[1].desc[1].lines[1]}
        </>
      ),
      isGranted: () => true,
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [5],
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: false
    },
    {
      index: 1,
      src: "Elemental Burst",
      desc: ({ toSelf, char, partyData, inputs }) => (
        <>
          Increases the <Green>Normal Attack DMG</Green> of characters within
          its AoE by{" "}
          <Green b>
            {Ayato.buffs[1].bnValue(toSelf, char, partyData, inputs)}%
          </Green>
          .
        </>
      ),
      isGranted: () => true,
      affect: "party",
      labels: ["Elemental Burst Level"],
      inputs: [1],
      inputTypes: ["text"],
      maxs: [15],
      addBnes: (obj) => {
        const { toSelf, char, partyData, inputs } = obj;
        const bnValue = Ayato.buffs[1].bnValue(toSelf, char, partyData, inputs);
        addAndTrack(obj.tkDesc, obj.hitBnes, "NA.pct", bnValue, obj.tracker);
      },
      bnValue: (toSelf, char, partyData, inputs) => {
        const level = toSelf
          ? getFinalTlLv(char, Ayato.actvTalents[2], partyData)
          : inputs[0];
        return level ? Ayato.buffs[1].calcValue(level) : 0;
      },
      calcValue: (lv) => Math.min(lv + 10, 20)
    },
    {
      index: 2,
      outdated: true,
      src: "Ascension 4 Passive Talent",
      desc: () => (
        <>
          <Green>Kamisato Art: Suiyuu's DMG</Green> is increased based on{" "}
          <Green b>3%</Green> of Ayato's <Green>Max HP</Green>.
        </>
      )
    },
    {
      index: 3,
      src: "Constellation 1",
      desc: () => Ayato.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "self"
    },
    {
      index: 4,
      src: "Constellation 2",
      desc: () => Ayato.constellation[1].buff,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "HP%", 50)
    },
    {
      index: 5,
      src: "Constellation 4",
      desc: () => Ayato.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Normal ATK SPD", 15)
    }
  ]
};

export default Ayato;

import { electroDmg, Green } from "../../../styledCpns/DataDisplay";
import { bowCAs, BowNaDesc_5, BowPaDesc, lightPAs_Bow } from "../config";
import {
  checkAscs,
  checkCharMC,
  checkCons,
  makeTlBnes,
  xtraTlLv
} from "../helpers";

const Fischl = {
  code: 8,
  name: "Fischl",
  icon: "1/14/Character_Fischl_Thumb",
  sideIcon: "e/ec/Character_Fischl_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Electro",
  weapon: "Bow",
  stats: [
    { "Base HP": 770, "Base ATK": 20, "Base DEF": 50 },
    { "Base HP": 1979, "Base ATK": 53, "Base DEF": 128 },
    { "Base HP": 2555, "Base ATK": 68, "Base DEF": 165 },
    { "Base HP": 3827, "Base ATK": 102, "Base DEF": 247 },
    { "Base HP": 4236, "Base ATK": 113, "Base DEF": 274, "ATK%": 6 },
    { "Base HP": 4872, "Base ATK": 130, "Base DEF": 315, "ATK%": 6 },
    { "Base HP": 5418, "Base ATK": 144, "Base DEF": 350, "ATK%": 12 },
    { "Base HP": 6054, "Base ATK": 161, "Base DEF": 391, "ATK%": 12 },
    { "Base HP": 6463, "Base ATK": 172, "Base DEF": 418, "ATK%": 12 },
    { "Base HP": 7099, "Base ATK": 189, "Base DEF": 459, "ATK%": 12 },
    { "Base HP": 7508, "Base ATK": 200, "Base DEF": 485, "ATK%": 18 },
    { "Base HP": 8144, "Base ATK": 216, "Base DEF": 526, "ATK%": 18 },
    { "Base HP": 8553, "Base ATK": 227, "Base DEF": 553, "ATK%": 24 },
    { "Base HP": 9189, "Base ATK": 244, "Base DEF": 594, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Bolts of Downfall",
      desc: [
        BowNaDesc_5,
        {
          heading: "CA",
          content: (
            <>
              Perform a more precise Aimed Shot with increased DMG.
              <br />
              While aiming, the dark lightning spirits of Immernachtreich shall
              heed the call of their Prinzessin and indwell the enchanted
              arrowhead. When fully indwelt, the Rachsüchtig Blitz shall deal
              immense {electroDmg}.
            </>
          )
        },
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 44.12,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 46.78,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 58.14,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 57.71,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 72.07,
          multType: 1
        },
        {
          name: "Oz's Joint Attack (C1)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 0,
          multType: 2,
          conditional: true,
          getTlBnes: ({ char }) =>
            makeTlBnes(checkCons[1](char), "mult", [0, 1], 22)
        },
        ...bowCAs,
        {
          name: "Thundering Retribution (A1)",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 0,
          multType: 2,
          conditional: true,
          getTlBnes: ({ char }) =>
            makeTlBnes(checkAscs[1](char), "mult", [1, 1], 189.35)
        },
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Nightrider",
      image: "b/b3/Talent_Nightrider",
      desc: [
        {
          content: (
            <>
              Summons Oz. The night raven forged of darkness and lightning
              descends upon the land, dealing {electroDmg} in a small AoE.
              <br />
              For the ability's duration, Oz will continuously attack nearby
              opponents with Freikugel.
            </>
          )
        },
        {
          content: (
            <>
              Hold to adjust the location Oz will be summoned to.
              <br />
              Press again any time during the ability's duration to once again
              summon him to Fischl's side.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Oz's ATK",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 88.8,
          multType: 2
        },
        {
          name: "Summoning DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 115.44,
          multType: 2,
          getTlBnes: ({ char, selfMCs }) =>
            makeTlBnes(
              checkCharMC(Fischl.buffs, char, selfMCs.BCs, 2),
              "mult",
              [0, 2],
              200
            )
        },
        {
          name: "Thundering Retribution (A4)",
          dmgTypes: [null, "Elemental"],
          baseMult: 0,
          multType: 2,
          conditional: true,
          getTlBnes: ({ char }) =>
            makeTlBnes(checkAscs[4](char), "mult", [1, 4], 80)
        },
        {
          name: "Oz's Joint Attack (C6)",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 0,
          multType: 2,
          conditional: true,
          getTlBnes: ({ char }) =>
            makeTlBnes(checkCons[6](char), "mult", [0, 6], 30)
        }
      ],
      otherStats: () => [
        { name: "Oz's Duration", value: "10s" },
        { name: "CD", value: "25s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Midnight Phantasmagoria",
      image: "f/ff/Talent_Midnight_Phantasmagoria",
      desc: [
        {
          content: (
            <>
              Summons Oz to spread his twin wings of twilight and defend Fischl.
              <br />
              Has the following properties during the ability's duration:
              <br />• Fischl takes on Oz's form, greatly increasing her Movement
              Speed.
              <br />• Strikes nearby opponents with lightning, dealing{" "}
              {electroDmg} to opponents she comes into contact with. Each
              opponent can only be struck once.
              <br />• Once this ability's effects end, Oz will remain on the
              battlefield and attack his Prinzessin's foes. If Oz is already on
              the field, then this will reset the duration of his presence.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Falling Thunder",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 208,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "15s" }],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Stellar Predator",
      image: "2/28/Talent_Stellar_Predator",
      desc: (
        <>
          When Fischl hits Oz with a fully-charged Aimed Shot, Oz brings down
          Thundering Retribution, dealing AoE {electroDmg} equal to{" "}
          <Green b>152.7%</Green> of the arrow's <Green>DMG</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Undone Be Thy Sinful Hex",
      image: "7/75/Talent_Undone_Be_Thy_Sinful_Hex",
      desc: (
        <>
          If your active character triggers an Electro-related Elemental
          Reaction when Oz is on the field, the opponent shall be dealt{" "}
          {electroDmg} equal to <Green b>80%</Green> of Fischl's{" "}
          <Green>ATK</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Mein Hausgarten",
      image: "6/60/Talent_Mein_Hausgarten",
      desc: (
        <>
          When dispatched on an <Green>expedition</Green> in Mondstadt,{" "}
          <Green>time consumed</Green> is reduced by <Green b>25%</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Gaze of the Deep",
      image: "7/7c/Constellation_Gaze_of_the_Deep",
      get desc() {
        return (
          <>
            Even when Oz is not present in combat, he can still watch over
            Fischl through his raven eyes. {this.buff}
          </>
        );
      },
      buff: (
        <>
          When Fischl performs a Normal Attack against an opponent, Oz fires a
          joint attack, dealing <b>Physical DMG</b> equal to{" "}
          <Green b>22%</Green> of Fischl's <Green>ATK</Green>.
        </>
      )
    },
    {
      name: "Devourer of All Sins",
      image: "6/69/Constellation_Devourer_of_All_Sins",
      desc: (
        <>
          When <Green>Nightrider</Green> is used, it deals an{" "}
          <Green>additional</Green> <Green b>200%</Green> <Green>ATK</Green> as
          DMG.
        </>
      )
    },
    {
      name: "Wings of Nightmare",
      image: "7/7b/Constellation_Wings_of_Nightmare",
      desc: "Nightrider"
    },
    {
      name: "Her Pilgrimage of Bleak",
      image: "7/78/Constellation_Her_Pilgrimage_of_Bleak",
      desc: (
        <>
          When Midnight Phantasmagoria is used, it deals <Green b>222%</Green>{" "}
          of <Green>ATK</Green> as {electroDmg} to surrounding opponents. When
          the skill duration ends, Fischl regenerates <Green b>20%</Green> of
          her <Green>HP</Green>.
        </>
      )
    },
    {
      name: "Against the Fleeing Light",
      image: "5/5f/Constellation_Against_the_Fleeing_Light",
      desc: "Midnight Phantasmagoria"
    },
    {
      name: "Evernight Raven",
      image: "4/4e/Constellation_Evernight_Raven",
      get desc() {
        return (
          <>
            Extends the <Green>duration</Green> of Oz's presence on the field by{" "}
            <Green b>2s</Green>. Additionally, {this.buff}
          </>
        );
      },
      buff: (
        <>
          Oz performs joint attacks with your active character when present,
          dealing <Green b>30%</Green> of Fischl's <Green>ATK</Green> as{" "}
          {electroDmg}.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      outdated: true,
      src: "Ascension 4 Passive Talent",
      desc: () => Fischl.pasvTalents[1].desc
    },
    {
      index: 1,
      outdated: true,
      src: "Constellation 1",
      desc: () => Fischl.constellation[0].buff
    },
    {
      index: 2,
      src: "Constellation 2",
      desc: () => Fischl.constellation[1].desc,
      isGranted: (char) => char.constellation >= 2,
      affect: "self"
    },
    {
      index: 3,
      outdated: true,
      src: "Constellation 6",
      desc: () => Fischl.constellation[5].buff
    }
  ]
};

export default Fischl;

import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { applyPct } from "../../../helpers";
import { Green, pyroDmg } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, PolearmDesc_4 } from "../config";
import {
  checkAscs,
  checkCharMC,
  checkCons,
  makeTlBnes,
  NCPApcts,
  xtraTlLv
} from "../helpers";

const Thoma = {
  code: 43,
  name: "Thoma",
  icon: "8/8a/Character_Thoma_Thumb",
  sideIcon: "4/46/Character_Thoma_Side_Icon",
  rarity: 4,
  nation: "Inazuma",
  vision: "Pyro",
  weapon: "Polearm",
  stats: [
    { "Base HP": 866, "Base ATK": 17, "Base DEF": 63 },
    { "Base HP": 2225, "Base ATK": 43, "Base DEF": 162 },
    { "Base HP": 2872, "Base ATK": 56, "Base DEF": 209 },
    { "Base HP": 4302, "Base ATK": 84, "Base DEF": 313 },
    { "Base HP": 4762, "Base ATK": 93, "Base DEF": 346, "ATK%": 6 },
    { "Base HP": 5478, "Base ATK": 107, "Base DEF": 398, "ATK%": 6 },
    { "Base HP": 6091, "Base ATK": 119, "Base DEF": 443, "ATK%": 12 },
    { "Base HP": 6806, "Base ATK": 133, "Base DEF": 495, "ATK%": 12 },
    { "Base HP": 7266, "Base ATK": 142, "Base DEF": 528, "ATK%": 12 },
    { "Base HP": 7981, "Base ATK": 156, "Base DEF": 580, "ATK%": 12 },
    { "Base HP": 8440, "Base ATK": 165, "Base DEF": 613, "ATK%": 18 },
    { "Base HP": 9156, "Base ATK": 179, "Base DEF": 665, "ATK%": 18 },
    { "Base HP": 9616, "Base ATK": 188, "Base DEF": 699, "ATK%": 24 },
    { "Base HP": 10331, "Base ATK": 202, "Base DEF": 751, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Swiftshatter Spear",
      desc: PolearmDesc_4,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 44.39,
          multType: 4
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 43.63,
          multType: 4
        },
        {
          name: "3-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 26.79,
          multType: 4
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 67.36,
          multType: 4
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 112.75,
          multType: 4
        },
        CaStamina[25],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Blazing Blessing",
      image: "9/9b/Talent_Blazing_Blessing",
      desc: [
        {
          get content() {
            return (
              <>
                Thoma vaults forward with his polearm and delivers a
                flame-filled flying kick that deals AoE {pyroDmg}, while also
                summoning a defensive Blazing Barrier. At the moment of casting,
                Thoma's Elemental Skill applies Pyro to himself.
                <br />
                The DMG Absorption of the Blazing Barrier scales off Thoma's Max
                HP.
                <br />
                The Blazing Barrier has the following traits:
                {this.shield}
              </>
            );
          },
          shield: [
            <>
              <br />• Absorbs Pyro DMG 250% more effectively.
              <br />• When a new Blazing Barrier is obtained, the remaining DMG
              Absorption of an existing Blazing Barrier will stack and its
              duration will be refreshed.
            </>
          ]
        },
        {
          content: (
            <>
              The maximum DMG Absorption of the Blazing Barrier will not exceed
              a certain percentage of Thoma's Max HP.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 146.4,
          multType: 2
        },
        {
          name: "Shield DMG Absorption",
          baseSType: "HP",
          baseMult: 7.2,
          multType: 2,
          baseFlat: 693,
          flatType: 3
        },
        { name: "Shield Duration", noCalc: true, getValue: () => "8s" },
        {
          name: "Max Shield DMG Absorption",
          baseSType: "HP",
          baseMult: 19.6,
          multType: 2,
          baseFlat: 1887,
          flatType: 3
        }
      ],
      otherStats: () => [{ name: "CD", value: "15s" }]
    },
    {
      type: "Elemental Burst",
      name: "Crimson Ooyoroi",
      image: "e/e4/Talent_Crimson_Ooyoroi",
      desc: [
        {
          content: (
            <>
              Thoma spins his polearm, slicing at his foes with roaring flames
              that deal AoE {pyroDmg} and weave themselves into a Scorching
              Ooyoroi.
            </>
          )
        },
        {
          heading: "Scorching Ooyoroi",
          content: (
            <>
              While Scorching Ooyoroi is in effect, the active character's
              Normal Attacks will trigger Fiery Collapse, dealing AoE {pyroDmg}{" "}
              and summoning a Blazing Barrier.
              <br />
              Fiery Collapse can be triggered once every 1s.
            </>
          )
        },
        {
          get content() {
            return (
              <>
                Except for the amount of DMG they can absorb, the Blazing
                Barriers created in this way are identical to those created by
                Thoma's Elemental Skill, Blazing Blessing:
                {Thoma.actvTalents[1].desc[0].shield}
              </>
            );
          }
        },
        {
          content: (
            <>
              The maximum DMG Absorption of the Blazing Barrier will not exceed
              a certain percentage of Thoma's Max HP.
            </>
          )
        },
        {
          content: (
            <>
              If Thoma falls, the effects of Scorching Ooyoroi will be cleared.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 88,
          multType: 2
        },
        {
          name: "Fiery Collapse DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 58,
          multType: 2,
          getTlBnes: ({ char, selfMCs, ATTRs }) =>
            makeTlBnes(
              checkCharMC(Thoma.buffs, char, selfMCs.BCs, 1),
              "flat",
              [1, 4],
              applyPct(ATTRs.HP, 2.2)
            )
        },
        {
          name: "Shield DMG Absorption",
          baseSType: "HP",
          baseMult: 1.14,
          multType: 2,
          baseFlat: 110,
          flatType: 3
        }
      ],
      otherStats: () => [
        { name: "Shield Duration", value: "8s" },
        { name: "Scorching Ooyoroi Duration", value: "15s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Imbricated Armor",
      image: "4/4b/Talent_Imbricated_Armor",
      desc: (
        <>
          When your current active character obtains or refreshes a Blazing
          Barrier, this character's <Green>Shield Strength</Green> will increase
          by <Green b>5%</Green> for 6s.
          <br />
          This effect can be triggered once every 0.3 seconds. Max{" "}
          <Green b>5</Green> <Green>stacks</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Flaming Assault",
      image: "0/03/Talent_Flaming_Assault",
      desc: (
        <>
          <Green>DMG</Green> dealt by{" "}
          <Green>Crimson Ooyoroi's Fiery Collapse</Green> is increased by{" "}
          <Green b>2.2%</Green> of Thoma's <Green>Max HP</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Snap and Swing",
      image: "1/14/Talent_Snap_and_Swing",
      desc: (
        <>
          When you fish successfully in Inazuma, Thoma's help grants a{" "}
          <Green b>20%</Green> <Green>chance</Green> of scoring a{" "}
          <Green b>double</Green> <Green>catch</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "A Comrade's Duty",
      image: "9/9c/Constellation_A_Comrade%27s_Duty",
      desc: (
        <>
          When a character protected by Thoma's own Blazing Barrier (Thoma
          excluded) is attacked, Thoma's own Blazing Blessing <Green>CD</Green>{" "}
          is decreased by <Green b>3s</Green>, while his own Crimson Ooyoroi's{" "}
          <Green>CD</Green> is decreased by <Green b>3s</Green>.
          <br />
          This effect can be triggered once every 20s.
        </>
      )
    },
    {
      name: "A Subordinate's Skills",
      image: "e/e9/Constellation_A_Subordinate%27s_Skills",
      desc: (
        <>
          Crimson Ooyoroi's <Green>duration</Green> is increased by{" "}
          <Green b>3s</Green>.
        </>
      )
    },
    {
      name: "Fortified Resolve",
      image: "9/99/Constellation_Fortified_Resolve",
      desc: "Blazing Blessing"
    },
    {
      name: "Long-Term Planning",
      image: "f/f4/Constellation_Long-Term_Planning",
      desc: (
        <>
          After using Crimson Ooyoroi, <Green b>15</Green> <Green>Energy</Green>{" "}
          will be restored to Thoma.
        </>
      )
    },
    {
      name: "Raging Wildfire",
      image: "5/5b/Constellation_Raging_Wildfire",
      desc: "Crimson Ooyoroi"
    },
    {
      name: "Burning Heart",
      image: "0/0f/Constellation_Burning_Heart",
      desc: (
        <>
          When a Blazing Barrier is obtained or refreshed, the{" "}
          <Green>DMG</Green> dealt by all party members'{" "}
          <Green>Normal, Charged, and Plunging Attacks</Green> is increased by{" "}
          <Green b>15%</Green> for 6s.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Thoma.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "party",
      selfLabels: ["Stacks"],
      labels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [5],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, ATTRs, "Shield Strength", 5 * inputs[0], tracker);
      }
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Thoma.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self"
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Thoma.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "party",
      addBnes: simpleAnTmaker("hitBnes", NCPApcts, 15)
    }
  ]
};

export default Thoma;

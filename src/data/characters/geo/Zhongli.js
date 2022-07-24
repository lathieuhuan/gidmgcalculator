import { addAndTrack } from "../../../calculators/helpers";
import { physAndElmts } from "../../../configs";
import { applyPct } from "../../../helpers";
import { geoDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, PolearmNaDesc_6, SwordPaDesc } from "../config";
import { checkAscs, xtraTlLv } from "../helpers";

const Zhongli = {
  code: 25,
  name: "Zhongli",
  icon: "c/c2/Character_Zhongli_Thumb",
  sideIcon: "e/e1/Character_Zhongli_Side_Icon",
  rarity: 5,
  nation: "Liyue",
  vision: "Geo",
  weapon: "Polearm",
  stats: [
    { "Base HP": 1144, "Base ATK": 20, "Base DEF": 57 },
    { "Base HP": 2967, "Base ATK": 51, "Base DEF": 149 },
    { "Base HP": 3948, "Base ATK": 67, "Base DEF": 198 },
    { "Base HP": 5908, "Base ATK": 101, "Base DEF": 297 },
    { "Base HP": 6605, "Base ATK": 113, "Base DEF": 332, "Geo DMG Bonus": 7.2 },
    { "Base HP": 7599, "Base ATK": 130, "Base DEF": 382, "Geo DMG Bonus": 7.2 },
    {
      "Base HP": 8528,
      "Base ATK": 146,
      "Base DEF": 428,
      "Geo DMG Bonus": 14.4
    },
    {
      "Base HP": 9533,
      "Base ATK": 163,
      "Base DEF": 479,
      "Geo DMG Bonus": 14.4
    },
    {
      "Base HP": 10230,
      "Base ATK": 175,
      "Base DEF": 514,
      "Geo DMG Bonus": 14.4
    },
    {
      "Base HP": 11243,
      "Base ATK": 192,
      "Base DEF": 564,
      "Geo DMG Bonus": 14.4
    },
    {
      "Base HP": 11940,
      "Base ATK": 204,
      "Base DEF": 599,
      "Geo DMG Bonus": 21.6
    },
    {
      "Base HP": 12965,
      "Base ATK": 222,
      "Base DEF": 651,
      "Geo DMG Bonus": 21.6
    },
    {
      "Base HP": 13662,
      "Base ATK": 233,
      "Base DEF": 686,
      "Geo DMG Bonus": 28.8
    },
    {
      "Base HP": 14695,
      "Base ATK": 251,
      "Base DEF": 738,
      "Geo DMG Bonus": 28.8
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Rain of Stone",
      desc: [
        PolearmNaDesc_6,
        {
          heading: "CA",
          content: (
            <>
              Consumes a certain amount of Stamina to lunge forward, causing
              stone spears to fall along his path.
            </>
          )
        },
        SwordPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 30.77,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 31.15,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 38.58,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 42.94,
          multType: 1
        },
        {
          name: "5-Hit (1/4)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 10.75,
          multType: 1
        },
        {
          name: "6-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 54.5,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 111.03,
          multType: 1
        },
        CaStamina[25],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Dominus Lapidis",
      image: "9/93/Talent_Dominus_Lapidis",
      desc: [
        {
          heading: "Press",
          content: <>Commands the power of earth to create a Stone Stele.</>
        },
        {
          heading: "Hold",
          content: (
            <>
              Causes nearby Geo energy to explode, causing the following
              effects:
              <br />• If their maximum number hasn't been reached, creates a
              Stone Stele.
              <br />• Creates a shield of jade. The shield's DMG Absorption
              scales based on Zhongli's Max HP.
              <br />• Deals AoE {geoDmg}.
              <br />• If there are nearby targets with the Geo element, it will
              drain a large amount of Geo element from a maximum of 2 such
              targets. This effect does not cause DMG.
            </>
          )
        },
        {
          heading: "Stone Stele",
          content: (
            <>
              When created, deals AoE {geoDmg}.
              <br />
              Additionally, it will intermittently resonate with other nearby
              Geo constructs, dealing {geoDmg} to nearby opponents.
              <br />
              The Stone Stele is considered a Geo construct that can both be
              climbed and used to block attacks.
              <br />
              Only one Stele created by Zhongli himself may initially exist at
              any one time.
            </>
          )
        },
        {
          heading: "Jade Shield",
          get content() {
            return (
              <>
                Possesses 150% DMG Absorption against all Elemental and Physical
                DMG.
                <br />
                {this.debuff}
              </>
            );
          },
          debuff: (
            <>
              Characters protected by the Jade Shield will decrease the{" "}
              <Green>Elemental RES</Green> and <Green>Physical RES</Green> of
              opponents in a small AoE by <Green b>20%</Green>. This effect
              cannot be stacked.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Stone Stele DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 16,
          multType: 2
        },
        {
          name: "Resonance DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 32,
          multType: 2
        },
        { name: "Press CD", noCalc: true, getValue: () => "4s" },
        {
          name: "Hold DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 80,
          multType: 2
        },
        {
          name: "Shield DMG Absorption",
          baseSType: "HP",
          baseMult: 12.8,
          multType: 2,
          baseFlat: 1232,
          flatType: 3
        }
      ],
      otherStats: () => [
        { name: "Shield Duration", value: "20s" },
        { name: "CD", value: "12s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Planet Befall",
      image: "7/76/Talent_Planet_Befall",
      desc: [
        {
          content: (
            <>
              Brings a falling meteor down to earth, dealing massive {geoDmg} to
              opponents caught in its AoE and applying the Petrification status
              to them.
            </>
          )
        },
        {
          name: "Petrification",
          content: (
            <>Opponents affected by the Petrification status cannot move.</>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 401.08,
          multType: 6
        }
      ],
      otherStats: (lv) => [
        {
          name: "Petrification Duration",
          value: Math.min(30 + lv, 40) / 10 + "s"
        },
        { name: "CD", value: "12s" }
      ],
      energyCost: 40
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Resonant Waves",
      image: "4/4f/Talent_Resonant_Waves",
      desc: (
        <>
          When the Jade Shield takes DMG, it will Fortify:
          <br />• Fortified characters have <Green b>5%</Green> increased{" "}
          <Green>Shield Strength</Green>.<br />
          Can stack up to <Green b>5</Green> times, and lasts until the Jade
          Shield disappears.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Dominance of Earth",
      image: "f/ff/Talent_Dominance_of_Earth",
      desc: (
        <>
          Zhongli deals bonus DMG based on his <Green>Max HP</Green>:<br />•{" "}
          Normal Attack, Charged Attack, and Plunging Attack DMG increased by{" "}
          <Green b>1.39%</Green> of Max HP.
          <br />• Dominus Lapidis Stone Stele, resonance, and hold DMG increased
          by <Green b>1.9%</Green> of Max HP.
          <br />• Planet Befall DMG increased by <Green b>33%</Green> of Max HP.
        </>
      )
    },
    {
      type: "Passive",
      name: "Arcanum of Crystal",
      image: "9/90/Talent_Arcanum_of_Crystal",
      desc: (
        <>
          Refunds <Green b>15%</Green> of the <Green>ores</Green> used when
          crafting <Green>Polearm-type</Green> weapons.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Rock, the Backbone of Earth",
      image: "a/a5/Constellation_Rock%2C_the_Backbone_of_Earth",
      desc: (
        <>
          Increases the <Green>maximum</Green> number of{" "}
          <Green>Stone Steles</Green> created by Dominus Lapidis that may exist
          simultaneously to <Green b>2</Green>.
        </>
      )
    },
    {
      name: "Stone, the Cradle of Jade",
      image: "a/aa/Constellation_Stone%2C_the_Cradle_of_Jade",
      desc: (
        <>
          Planet Befall grants nearby characters on the field a{" "}
          <Green>Jade Shield</Green> when it descends.
        </>
      )
    },
    {
      name: "Jade, Shimmering through Darkness",
      image: "0/08/Constellation_Jade%2C_Shimmering_through_Darkness",
      desc: "Dominus Lapidis"
    },
    {
      name: "Topaz, Unbreakable and Fearless",
      image: "f/f3/Constellation_Topaz%2C_Unbreakable_and_Fearless",
      desc: (
        <>
          Increases Planet Befall's <Green>AoE</Green> by <Green b>20%</Green>{" "}
          and increases the <Green>duration</Green> of Planet Befall's
          Petrification effect by <Green b>2s</Green>.
        </>
      )
    },
    {
      name: "Lazuli, Herald of the Order",
      image: "a/a6/Constellation_Lazuli%2C_Herald_of_the_Order",
      desc: "Planet Befall"
    },
    {
      name: "Chrysos, Bounty of Dominator",
      image: "7/7c/Constellation_Chrysos%2C_Bounty_of_Dominator",
      desc: (
        <>
          When the Jade Shield takes DMG, <Green b>40%</Green> of that{" "}
          <Green>incoming DMG</Green> is converted to <Green>HP</Green> for the
          current character.
          <br />A single instance of regeneration cannot exceed 8% of that
          character's Max HP.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Zhongli.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "party",
      selfLabels: ["Stacks"],
      labels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [5],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, ATTRs, "Shield Strength", inputs[0] * 5, tracker);
      }
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Zhongli.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      addFinalBnes: ({ ATTRs, hitBnes, tkDesc, tracker }) => {
        const rs = [1.39, 1.9, 33].map((mult) => applyPct(ATTRs.HP, mult));
        const fields = ["NA", "CA", "PA", "ES", "EB"].map((t) => `${t}.flat`);
        const bnValues = [rs[0], rs[0], rs[0], rs[1], rs[2]];
        addAndTrack(tkDesc, hitBnes, fields, bnValues, tracker);
      }
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Jade Shield",
      desc: () => Zhongli.actvTalents[1].desc[3].debuff,
      isGranted: () => true,
      addPntes: ({ rdMult, tkDesc, tracker }) => {
        const fields = physAndElmts.map((t) => `${t}_rd`);
        addAndTrack(tkDesc, rdMult, fields, 20, tracker);
      }
    }
  ]
};

export default Zhongli;

import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { applyPct, getFinalTlLv } from "../../../helpers";
import { Geo, geoDmg, Green } from "../../../styledCpns/DataDisplay";
import { SwordPaDesc, xiaoPAs } from "../config";
import {
  checkAscs,
  checkCharMC,
  checkCons,
  makeTlBnes,
  xtraTlLv
} from "../helpers";
import tlLvMults from "../tlLvMults";

const tlBnes_ascs4 = ({ char, selfMCs, ATTRs }) =>
  makeTlBnes(
    checkCharMC(Itto.buffs, char, selfMCs.BCs, 1),
    "flat",
    [1, 4],
    applyPct(ATTRs.DEF, 35)
  );

const Itto = {
  code: 45,
  name: "Itto",
  GOOD: "AratakiItto",
  icon: "7/79/Character_Arataki_Itto_Thumb",
  sideIcon: "f/fe/Character_Arataki_Itto_Side_Icon",
  rarity: 5,
  nation: "Inazuma",
  vision: "Geo",
  weapon: "Claymore",
  stats: [
    { "Base HP": 1001, "Base ATK": 18, "Base DEF": 75 },
    { "Base HP": 2597, "Base ATK": 46, "Base DEF": 194 },
    { "Base HP": 3455, "Base ATK": 61, "Base DEF": 258 },
    { "Base HP": 5170, "Base ATK": 91, "Base DEF": 386 },
    { "Base HP": 5779, "Base ATK": 102, "Base DEF": 431, "CRIT Rate": 4.8 },
    { "Base HP": 6649, "Base ATK": 117, "Base DEF": 496, "CRIT Rate": 4.8 },
    { "Base HP": 7462, "Base ATK": 132, "Base DEF": 557, "CRIT Rate": 9.6 },
    { "Base HP": 8341, "Base ATK": 147, "Base DEF": 622, "CRIT Rate": 9.6 },
    { "Base HP": 8951, "Base ATK": 158, "Base DEF": 668, "CRIT Rate": 9.6 },
    { "Base HP": 9838, "Base ATK": 174, "Base DEF": 734, "CRIT Rate": 9.6 },
    { "Base HP": 10448, "Base ATK": 185, "Base DEF": 779, "CRIT Rate": 14.4 },
    { "Base HP": 11345, "Base ATK": 200, "Base DEF": 846, "CRIT Rate": 14.4 },
    { "Base HP": 11954, "Base ATK": 211, "Base DEF": 892, "CRIT Rate": 19.2 },
    { "Base HP": 12858, "Base ATK": 227, "Base DEF": 959, "CRIT Rate": 19.2 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Fight Club Legend",
      desc: [
        {
          heading: "NA",
          content: (
            <>
              <>Performs up to 4 consecutive strikes.</>
              <br />
              When the 2nd and 4th strikes hit opponents, Itto will gain 1 or 2
              stacks of Superlative Superstrength, respectively.
              <br />
              Max 5 stacks. Triggering this effect will refresh the current
              duration of any existing stacks.
            </>
          )
        },
        {
          content: (
            <>
              Additionally, Itto's Normal Attack combo does not immediately
              reset after sprinting or using his Elemental Skill, "Masatsu
              Zetsugi: Akaushi Burst!"
            </>
          )
        },
        {
          heading: "CA",
          content: (
            <>
              When holding to perform a Charged Attack, Itto unleashes a series
              of Arataki Kesagiri slashes without consuming Stamina. Instead,
              each Arataki Kesagiri slash consumes 1 stack of Superlative
              Superstrength. When the final stack is consumed, Itto delivers a
              powerful final slash.
              <br />
              If no stacks of Superlative Superstrength are available, Itto will
              perform a single Saichimonji Slash.
            </>
          )
        },
        SwordPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 79.23,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 76.37,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 91.64,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 117.22,
          multType: 1
        },
        {
          name: "Arataki Kesagiri Combo Slash DMG",
          dmgTypes: ["CA", "Physical"],
          baseMult: 91.16,
          multType: 1,
          getTlBnes: tlBnes_ascs4
        },
        {
          name: "Arataki Kesagiri Final Slash DMG",
          dmgTypes: ["CA", "Physical"],
          baseMult: 190.92,
          multType: 1,
          getTlBnes: tlBnes_ascs4
        },
        {
          name: "Superlative Superstrength Duration",
          noCalc: true,
          getValue: () => "60s"
        },

        {
          name: "Saichimonji Slash DMG",
          dmgTypes: ["CA", "Physical"],
          baseMult: 90.47,
          multType: 1
        },
        {
          name: "Saichimonji Slash Stamina Cost",
          noCalc: true,
          getValue: () => 20
        },
        ...xiaoPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Masatsu Zetsugi: Akaushi Burst!",
      image: "5/51/Talent_Masatsu_Zetsugi_Akaushi_Burst%21",
      desc: [
        {
          content: (
            <>
              Hurls Ushi, the young akaushi bull and auxiliary member of the
              Arataki Gang, dealing {geoDmg} to opponents on hit. When Ushi hits
              opponents, Arataki Itto gains 1 stack of Superlative
              Superstrength.
            </>
          )
        },
        {
          content: (
            <>
              Ushi will remain on the field and provide support in the following
              ways:
              <br />• Taunts surrounding opponents and draws their attacks.
              <br />• Inherits HP based on a percentage of Arataki Itto's Max
              HP.
              <br />• When Ushi takes DMG, Arataki Itto gains 1 stack of
              Superlative Superstrength. Only 1 stack can be gained in this way
              every 2s.
              <br />• Ushi will flee when its HP reaches 0 or its duration ends.
              It will grant Arataki Itto 1 stack of Superlative Superstrength
              when it leaves.
            </>
          )
        },
        {
          heading: "Hold",
          content: <>Adjust throwing angle.</>
        },
        {
          content: (
            <>
              Ushi is considered a Geo construct. Arataki Itto can only deploy 1
              Ushi on the field at any one time.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 307.2,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Inherited HP", value: "100%" },
        { name: "Duration", value: "6s" },
        { name: "CD", value: "10s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Royal Descent: Behold, Itto the Evil!",
      image: "5/50/Talent_Royal_Descent_Behold%2C_Itto_the_Evil%21",
      desc: [
        {
          get content() {
            return (
              <>
                Time to show 'em the might of the Arataki Gang! For a time, Itto
                lets out his inner Raging Oni King, wielding his Oni King's
                Kanabou in battle.
                <br />
                This state has the following special properties:
                <br />
                {this.lines[0]}
                {this.lines[1]}
                <br />• On hit, the 1st and 3rd strikes of his attack combo will
                each grant Arataki Itto 1 stack of Superlative Superstrength.
                <br />• Decreases Itto's Elemental and Physical RES by 20%.
              </>
            );
          },
          lines: [
            <>
              • <Green>Converts</Green> Itto's Normal, Charged, and Plunging
              Attacks to {geoDmg}. This cannot be overridden.
            </>,
            <>
              <br />• Increases Itto's <Green>Normal Attack SPD</Green>. Also
              increases his <Green>ATK</Green> based on his <Green>DEF</Green>.
            </>
          ]
        },
        {
          content: (
            <>
              The Raging Oni King state will be cleared when Itto leaves the
              field.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "ATK Bonus",
          baseSType: "DEF",
          baseMult: 57.6,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "ATK SPD Bonus", value: "10%" },
        { name: "Duration", value: "11s" },
        { name: "CD", value: "18s" }
      ],
      energyCost: 70
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Arataki Ichiban",
      image: "a/a5/Talent_Arataki_Ichiban",
      desc: (
        <>
          When Arataki Itto uses consecutive Arataki Kesagiri, he obtains the
          following effects:
          <br />• Each slash increases the <Green>ATK SPD</Green> of the next
          slash by <Green b>10%</Green>. <Green>Max</Green> ATK SPD increase is{" "}
          <Green b>30%</Green>.
          <br />• Increases his resistance to interruption.
          <br />
          <br />
          These effects will be cleared once he stops performing consecutive
          slashes.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Bloodline of the Crimson Oni",
      image: "d/db/Talent_Bloodline_of_the_Crimson_Oni",
      desc: (
        <>
          <Green>Arataki Kesagiri DMG</Green> is increased by{" "}
          <Green b>35%</Green> of Itto's <Green>DEF</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Woodchuck Chucked",
      image: "4/47/Talent_Woodchuck_Chucked",
      desc: (
        <>
          When a party member uses attacks to obtain wood from a tree, they have
          a <Green b>25%</Green> <Green>chance</Green> to obtain{" "}
          <Green b>an</Green> <Green>additional log</Green> of wood.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Stay a While and Listen Up",
      image: "6/64/Constellation_Stay_a_While_and_Listen_Up",
      desc: (
        <>
          After using Royal Descent: Behold, Itto the Evil!, Arataki Itto gains{" "}
          <Green b>2</Green> <Green>stacks</Green> of Superlative Superstrength.
          After 1s, Itto will gain <Green b>1</Green> <Green>stacks</Green> of
          Superlative Superstrength every 0.5s for 1.5s.
        </>
      )
    },
    {
      name: "Gather 'Round, It's a Brawl!",
      image: "0/09/Constellation_Gather_%27Round%2C_It%27s_a_Brawl%21",
      desc: (
        <>
          After using Royal Descent: Behold, Itto the Evil!, each party member
          whose Element is <Geo>Geo</Geo> will decrease that skill's{" "}
          <Green>CD</Green> by <Green b>1.5s</Green> and restore{" "}
          <Green b>6</Green> <Green>Energy</Green> to Arataki Itto.
          <br />
          <Green>CD</Green> can be decreased by <Green>up to</Green>{" "}
          <Green b>4.5s</Green> in this manner. <Green>Max</Green>{" "}
          <Green b>18</Green> <Green>Energy</Green> can be restored in this
          manner.
        </>
      )
    },
    {
      name: "Horns Lowered, Coming Through",
      image: "a/a5/Constellation_Horns_Lowered%2C_Coming_Through",
      desc: "Masatsu Zetsugi: Akaushi Burst!"
    },
    {
      name: "Jailhouse Bread and Butter",
      image: "d/d4/Constellation_Jailhouse_Bread_and_Butter",
      desc: (
        <>
          When the Raging Oni King state caused by Royal Descent: Behold, Itto
          the Evil ends, all nearby party members gain <Green b>20%</Green>{" "}
          <Green>DEF</Green> and <Green b>20%</Green> <Green>ATK</Green> for
          10s.
        </>
      )
    },
    {
      name: "10 Years of Hanamizaka Fame",
      image: "f/f3/Constellation_10_Years_of_Hanamizaka_Fame",
      desc: "Royal Descent: Behold, Itto the Evil!"
    },
    {
      name: "Arataki Itto, Present!",
      image: "8/89/Constellation_Arataki_Itto%2C_Present%21",
      desc: (
        <>
          Itto's <Green>Charged Attacks</Green> deal <Green b>+70%</Green>{" "}
          <Green>CRIT DMG</Green>.
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
          {Itto.actvTalents[2].desc[0].lines[0]}
          {Itto.actvTalents[2].desc[0].lines[1]}
        </>
      ),
      isGranted: () => true,
      affect: "self",
      addFinalBnes: ({ ATTRs, char, partyData, tkDesc, tracker }) => {
        const level = getFinalTlLv(char, Itto.actvTalents[2], partyData);
        const fields = ["ATK", "Normal ATK SPD"];
        const bnValue = applyPct(ATTRs.DEF, 57.6 * tlLvMults[2][level]);
        addAndTrack(tkDesc, ATTRs, fields, [bnValue, 10], tracker);
      },
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: false
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Itto.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self"
    },
    {
      index: 2,
      src: "Constellation 4",
      desc: () => Itto.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", ["DEF%", "ATK%"], 20)
    },
    {
      index: 3,
      src: "Constellation 6",
      desc: () => Itto.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "CA.cDmg", 70)
    }
  ]
};

export default Itto;

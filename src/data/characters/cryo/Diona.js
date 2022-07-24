import { simpleAnTmaker } from "../../../calculators/helpers";
import { cryoDmg, Green } from "../../../styledCpns/DataDisplay";
import {
  BowCaDesc,
  BowNaDesc_5,
  BowPaDesc,
  doubleCooking,
  lightPAs_Bow
} from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const Diona = {
  code: 24,
  name: "Diona",
  icon: "b/b9/Character_Diona_Thumb",
  sideIcon: "c/c2/Character_Diona_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Cryo",
  weapon: "Bow",
  stats: [
    { "Base HP": 802, "Base ATK": 18, "Base DEF": 50 },
    { "Base HP": 2061, "Base ATK": 46, "Base DEF": 129 },
    { "Base HP": 2661, "Base ATK": 59, "Base DEF": 167 },
    { "Base HP": 3985, "Base ATK": 88, "Base DEF": 250 },
    { "Base HP": 4411, "Base ATK": 98, "Base DEF": 277, "Cryo DMG Bonus": 6 },
    { "Base HP": 5074, "Base ATK": 113, "Base DEF": 318, "Cryo DMG Bonus": 6 },
    { "Base HP": 5642, "Base ATK": 125, "Base DEF": 354, "Cryo DMG Bonus": 12 },
    { "Base HP": 6305, "Base ATK": 140, "Base DEF": 396, "Cryo DMG Bonus": 12 },
    { "Base HP": 6731, "Base ATK": 149, "Base DEF": 422, "Cryo DMG Bonus": 12 },
    { "Base HP": 7393, "Base ATK": 164, "Base DEF": 464, "Cryo DMG Bonus": 12 },
    { "Base HP": 7818, "Base ATK": 174, "Base DEF": 491, "Cryo DMG Bonus": 18 },
    { "Base HP": 8481, "Base ATK": 188, "Base DEF": 532, "Cryo DMG Bonus": 18 },
    { "Base HP": 8907, "Base ATK": 198, "Base DEF": 559, "Cryo DMG Bonus": 24 },
    { "Base HP": 9570, "Base ATK": 212, "Base DEF": 601, "Cryo DMG Bonus": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Kätzlein Style",
      desc: [
        BowNaDesc_5,
        BowCaDesc("biting frost", "A fully charged frost arrow", "Cryo"),
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 36.12,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 33.54,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 45.58,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 43,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 53.75,
          multType: 1
        },
        {
          name: "Aimed Shot",
          dmgTypes: ["CA", "Physical"],
          baseMult: 43.86,
          multType: 1
        },
        {
          name: "Fully-charged Aimed Shot",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 124,
          multType: 8
        },
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Icy Paws",
      image: "e/e9/Talent_Icy_Paws",
      desc: [
        {
          content: (
            <>
              Fires an Icy Paw that deals {cryoDmg} to opponents and forms a
              shield on hit.
              <br />
              The shield's DMG Absorption scales based on Diona's Max HP, and
              its duration scales off the number of Icy Paws that hit their
              target.
            </>
          )
        },
        {
          heading: "Press",
          content: <>Rapidly fires off 2 Icy Paws.</>
        },
        {
          heading: "Hold",
          content: (
            <>
              Dashes back quickly before firing five Icy Paws.
              <br />
              The shield created by a Hold attack will gain a 75% DMG Absorption
              Bonus.
            </>
          )
        },
        {
          content: (
            <>
              The shield has a 250% Cryo DMG Absorption Bonus, and will cause
              your active character to become affected by Cryo at the point of
              formation for a short duration.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "DMG per Paw",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 41.92,
          multType: 2
        },
        {
          name: "Base DMG Absorption",
          baseSType: "HP",
          baseMult: 7.2,
          multType: 2,
          baseFlat: 693,
          flatType: 3
        }
      ],
      otherStats: (lv) => [
        {
          name: "Duration",
          value: Math.min(17 + lv, 24) / 10 + " per Paw"
        },
        { name: "Press CD", value: "6s" },
        { name: "Hold CD", value: "15s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Signature Mix",
      image: "5/57/Talent_Signature_Mix",
      desc: [
        {
          content: (
            <>
              Tosses out a special cold brew that deals AoE {cryoDmg} and
              creates a Drunken Mist in an AoE.
            </>
          )
        },
        {
          heading: "Drunken Mist",
          content: (
            <>
              • Deals continuous {cryoDmg} to opponents within the AoE.
              <br />• Continuously regenerates the HP of characters within the
              AoE.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 80,
          multType: 2
        },
        {
          name: "Continuous DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 52.64,
          multType: 2
        },
        {
          name: "HP Regen. Over Time",
          isHealing: true,
          baseSType: "HP",
          baseMult: 5.34,
          multType: 2,
          baseFlat: 513,
          flatType: 3
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "12s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Cat's Tail Secret Menu",
      image: "c/cc/Talent_Cat%27s_Tail_Secret_Menu",
      desc: (
        <>
          Characters shielded by Icy Paws have their <Green>Movement SPD</Green>{" "}
          increased by <Green b>10%</Green> and their{" "}
          <Green>Stamina Consumption</Green> decreased by <Green b>10%</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Drunkards' Farce",
      image: "5/53/Talent_Drunkards%27_Farce",
      desc: (
        <>
          Opponents who enter the AoE of Signature Mix have <Green b>10%</Green>{" "}
          <Green>decreased ATK</Green> for 15s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Complimentary Bar Food",
      image: "d/da/Talent_Complimentary_Bar_Food",
      desc: doubleCooking("Diona", "dish with restorative effects")
    }
  ],
  constellation: [
    {
      name: "A Lingering Flavor",
      image: "e/e2/Constellation_A_Lingering_Flavor",
      desc: (
        <>
          Regenerates <Green b>15</Green> <Green>Energy</Green> for Diona after
          the effects of Signature Mix end.
        </>
      )
    },
    {
      name: "Shaken, Not Purred",
      image: "3/3a/Constellation_Shaken%2C_Not_Purred",
      get desc() {
        return (
          <>
            {this.buff}, and increases its shield's{" "}
            <Green>DMG Absorption</Green> by <Green b>15%</Green>. Additionally,
            when paws hit their targets, creates a shield for other nearby
            characters on the field with <Green b>50%</Green> of the Icy Paws
            shield's <Green>DMG Absorption</Green> for 5s.
          </>
        );
      },
      buff: (
        <>
          Increases Icy Paws' <Green>DMG</Green> by <Green b>15%</Green>
        </>
      )
    },
    {
      name: "A-Another Round?",
      image: "1/14/Constellation_A—Another_Round%3F",
      desc: "Signature Mix"
    },
    {
      name: "Wine Industry Slayer",
      image: "9/93/Constellation_Wine_Industry_Slayer",
      desc: (
        <>
          Within the radius of Signature Mix, Diona's <Green>charge time</Green>{" "}
          for aimed shots is reduced by <Green b>60%</Green>.
        </>
      )
    },
    {
      name: "Double Shot, On The Rocks",
      image: "b/b4/Constellation_Double_Shot%2C_on_the_Rocks",
      desc: "Icy Paws"
    },
    {
      name: "Cat's Tail Closing Time",
      image: "2/2f/Constellation_Cat%27s_Tail_Closing_Time",
      get desc() {
        return (
          <>
            {this.lines[0]}
            {this.lines[1]}
            {this.lines[2]}
          </>
        );
      },
      lines: [
        <>
          Characters within Signature Mix's radius will gain the following
          effects based on their HP amounts:
        </>,
        <>
          <br />• Increases <Green>Incoming Healing Bonus</Green> by{" "}
          <Green b>30%</Green> when HP falls below or is equal to 50%.
        </>,
        <>
          <br />• <Green>Elemental Mastery</Green> increased by{" "}
          <Green b>200</Green> when HP is above 50%.
        </>
      ]
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => <>{Diona.constellation[1].buff}.</>,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "ES.pct", 15)
    },
    {
      index: 1,
      src: "Constellation 6",
      desc: () => (
        <>
          {Diona.constellation[5].lines[0]}
          {Diona.constellation[5].lines[2]}
        </>
      ),
      isGranted: checkCons[6],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Elemental Mastery", 200)
    }
  ]
};

export default Diona;

import { simpleAnTmaker } from "../../../calculators/helpers";
import { dendroDmg, Green } from "../../../styledCpns/DataDisplay";
import { lightPAs_Bow } from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const Collei = {
  code: 55,
  beta: true,
  name: "Collei",
  icon: "https://i.ibb.co/wQb7kY4/collei.png",
  sideIcon: "",
  rarity: 4,
  nation: "Sumeru",
  vision: "Dendro",
  weapon: "Bow",
  stats: [
    { "Base HP": 821, "Base ATK": 17, "Base DEF": 50 },
    { "Base HP": 2108, "Base ATK": 43, "Base DEF": 129 },
    { "Base HP": 2721, "Base ATK": 56, "Base DEF": 167 },
    { "Base HP": 4076, "Base ATK": 83, "Base DEF": 250 },
    { "Base HP": 4512, "Base ATK": 92, "Base DEF": 277, "ATK%": 6 },
    { "Base HP": 5189, "Base ATK": 106, "Base DEF": 318, "ATK%": 6 },
    { "Base HP": 5770, "Base ATK": 118, "Base DEF": 354, "ATK%": 12 },
    { "Base HP": 6448, "Base ATK": 132, "Base DEF": 396, "ATK%": 12 },
    { "Base HP": 6884, "Base ATK": 140, "Base DEF": 422, "ATK%": 12 },
    { "Base HP": 7561, "Base ATK": 154, "Base DEF": 464, "ATK%": 12 },
    { "Base HP": 7996, "Base ATK": 163, "Base DEF": 491, "ATK%": 18 },
    { "Base HP": 8674, "Base ATK": 177, "Base DEF": 532, "ATK%": 18 },
    { "Base HP": 9110, "Base ATK": 186, "Base DEF": 559, "ATK%": 24 },
    { "Base HP": 9787, "Base ATK": 200, "Base DEF": 601, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Supplicant's Bowmanship",
      desc: [
        //
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 43.6,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 42.66,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 54.09,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 68.03,
          multType: 1
        },
        {
          name: "Aimed Shot",
          dmgTypes: ["CA", "Physical"],
          baseMult: 43.86,
          multType: 1
        },
        {
          name: "Fully-Charged Aimed Shot",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 124,
          multType: 2
        },
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Floral Brush",
      image: "",
      desc: [
        //
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 151.2,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "12s" }]
    },
    {
      type: "Elemental Burst",
      name: "Trump-Card Kitty",
      image: "",
      desc: [
        //
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Explosion DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 201.82,
          multType: 2
        },
        {
          name: "Leap DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 43.25,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "6s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Floral Sidewinder",
      image: "",
      desc: (
        <>
          If one of your party members has triggered Burning, Quicken,
          Aggravate, Spread, Bloom, Hyperbloom, or Burgeon reactions before the
          Floral Ring returns, it will grant the character the Sprout effect
          upon return, which will continuously deal Dendro DMG equivalent to{" "}
          <Green b>40%</Green> of Collei's <Green>ATK</Green> to nearby
          opponents for 3s.
          <br />
          If another Sprout effect is triggered during its initial duration, the
          initial effect will be removed.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "The Languid Wood",
      image: "",
      desc: (
        <>
          When a character within the Cuilein-Anbar Zone triggers Burning,
          Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon reactions,
          the Zone's <Green>duration</Green> will be increased by{" "}
          <Green>1s</Green>.
          <br />A single Trump-Card Kitty can be extended by up to{" "}
          <Green>3s</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Gliding Champion of Sumeru",
      image: "",
      desc: ""
    }
  ],
  constellation: [
    {
      name: "Beginnings Determined at the Roots",
      image: "",
      desc: (
        <>
          When in the party and not on the field, Collei's{" "}
          <Green>Energy Recharge</Green> is increased by <Green b>20%</Green>.
        </>
      )
    },
    {
      name: "Through Hill and Copse",
      image: "",
      get desc() {
        return (
          <>
            The Passive Talent Floral Sidewinder is changed to this:
            <br />
            ...
            {this.buff}
            <br />
            The effect will last up to 6s if the field's duraton ends or if it
            no longer has opponents within it.
          </>
        );
      },
      buff: (
        <>
          From the moment of using Floral Brush to the moment when this instance
          of Sprout effect ends, if any of your party members triggers Burning,
          Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon reactions,
          the <Green>Sprout effect</Green> will be extended by{" "}
          <Green b>3s</Green>.
        </>
      )
    },
    {
      name: "Scent of Summer",
      image: "",
      desc: "Floral Brush"
    },
    {
      name: "Gift of the Woods",
      image: "",
      desc: (
        <>
          Using Trump-Card Kitty will increase all nearby characters'{" "}
          <Green>Elemental Mastery</Green> by <Green b>60</Green> for 12s (not
          including Collei herself).
        </>
      )
    },
    {
      name: "All Embers",
      image: "",
      desc: "Trump-Card Kitty"
    },
    {
      name: "Forest of Falling Arrows",
      image: "",
      desc: (
        <>
          When the Floral Ring hits opponents, it will create a miniature
          Cuilein-Anbar that will deal <Green b>200%</Green> of Collei's{" "}
          <Green>ATK</Green> as {dendroDmg}.
          <br />
          Each Floral Brush can only create one such miniature Cuilein-Anbar.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 1",
      desc: () => Collei.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Energy Recharge", 20)
    },
    {
      index: 4,
      src: "Constellation 4",
      desc: () => Collei.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Elemental Mastery", 60)
    }
  ]
};

export default Collei;

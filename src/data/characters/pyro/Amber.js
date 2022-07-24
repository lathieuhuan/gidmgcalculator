import { simpleAnTmaker } from "../../../calculators/helpers";
import { Green, pyroDmg } from "../../../styledCpns/DataDisplay";
import {
  BowCaDesc,
  bowCAs,
  BowNaDesc_5,
  BowPaDesc,
  glideStaminaPasv,
  lightPAs_Bow
} from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Amber = {
  code: 18,
  name: "Amber",
  icon: "c/c6/Character_Amber_Thumb",
  sideIcon: "4/4f/Character_Amber_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Pyro",
  weapon: "Bow",
  stats: [
    { "Base HP": 793, "Base ATK": 19, "Base DEF": 50 },
    { "Base HP": 2038, "Base ATK": 48, "Base DEF": 129 },
    { "Base HP": 2630, "Base ATK": 62, "Base DEF": 167 },
    { "Base HP": 3940, "Base ATK": 93, "Base DEF": 250 },
    { "Base HP": 4361, "Base ATK": 103, "Base DEF": 277, "ATK%": 6 },
    { "Base HP": 5016, "Base ATK": 118, "Base DEF": 318, "ATK%": 6 },
    { "Base HP": 5578, "Base ATK": 131, "Base DEF": 354, "ATK%": 12 },
    { "Base HP": 6233, "Base ATK": 147, "Base DEF": 396, "ATK%": 12 },
    { "Base HP": 6654, "Base ATK": 157, "Base DEF": 422, "ATK%": 12 },
    { "Base HP": 7309, "Base ATK": 172, "Base DEF": 464, "ATK%": 12 },
    { "Base HP": 7730, "Base ATK": 182, "Base DEF": 491, "ATK%": 18 },
    { "Base HP": 8385, "Base ATK": 198, "Base DEF": 532, "ATK%": 18 },
    { "Base HP": 8806, "Base ATK": 208, "Base DEF": 559, "ATK%": 24 },
    { "Base HP": 9461, "Base ATK": 223, "Base DEF": 601, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Sharpshooter",
      desc: [
        BowNaDesc_5,
        BowCaDesc("flames", "A fully charged flaming arrow", "Pyro"),
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
          baseMult: 36.12,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 46.44,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 47.3,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 59.34,
          multType: 1
        },
        ...bowCAs,
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Explosive Puppet",
      image: "e/e0/Talent_Explosive_Puppet",
      desc: [
        {
          content: <>The ever-reliable Baron Bunny takes the stage.</>
        },
        {
          heading: "Baron Bunny",
          content: (
            <>
              • Continuously taunts the enemy, drawing their fire.
              <br />• Baron Bunny's HP scales with Amber's Max HP.
              <br />• When destroyed or when its timer expires, Baron Bunny
              explodes, dealing AoE {pyroDmg}.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Adjusts the throwing direction of Baron Bunny.
              <br />
              The longer the button is held, the further the throw.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Inherited HP",
          baseSType: "HP",
          baseMult: 41.4,
          multType: 2
        },
        {
          name: "Explosion DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 123.2,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "15s" }]
    },
    {
      type: "Elemental Burst",
      name: "Fiery Rain",
      image: "6/6c/Talent_Fiery_Rain",
      desc: [
        {
          content: (
            <>Fires off a shower of arrows, dealing continuous AoE {pyroDmg}.</>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Each Wave DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 28.08,
          multType: 2
        },
        {
          name: "Total DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 505.44,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "2s" },
        { name: "CD", value: "12s" }
      ],
      energyCost: 40
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Every Arrow Finds Its Target",
      image: "5/54/Talent_Every_Arrow_Finds_Its_Target",
      get desc() {
        return (
          <>
            {this.buff} and widens its <Green>AoE</Green> by{" "}
            <Green b>30%</Green>.
          </>
        );
      },
      buff: (
        <>
          Increases the <Green>CRIT Rate</Green> of <Green>Fiery Rain</Green> by{" "}
          <Green b>10%</Green>
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Precise Shot",
      image: "5/51/Talent_Precise_Shot",
      desc: (
        <>
          Aimed Shot hits on weak spots increase <Green>ATK</Green> by{" "}
          <Green b>15%</Green> for 10s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Gliding Champion",
      image: "d/df/Talent_Gliding_Champion",
      desc: glideStaminaPasv
    }
  ],
  constellation: [
    {
      name: "One Arrow to Rule Them All",
      image: "c/c9/Constellation_One_Arrow_to_Rule_Them_All",
      desc: (
        <>
          Fires 2 arrows per Aimed Shot. The <Green>second arrow</Green> deals{" "}
          <Green b>20%</Green> of the first arrow's <Green>DMG</Green>.
        </>
      )
    },
    {
      name: "Bunny Triggered",
      image: "7/75/Constellation_Bunny_Triggered",
      get desc() {
        return (
          <>
            Baron Bunny, new and improved! Hitting Baron Bunny's foot with a
            fully-charged Aimed Shot manually detonates it.
            <br />
            {this.buff}
          </>
        );
      },
      buff: (
        <>
          <Green>Baron Bunny</Green>'s explosion via manual detonation deals{" "}
          <Green b>200%</Green> <Green>additional DMG</Green>.
        </>
      )
    },
    {
      name: "It Burns!",
      image: "9/93/Constellation_It_Burns%21",
      desc: "Fiery Rain"
    },
    {
      name: "It's Not Just Any Doll...",
      image: "d/d6/Constellation_It%27s_Not_Just_Any_Doll...",
      desc: (
        <>
          Decreases Explosive Puppet's <Green>CD</Green> by <Green b>20%</Green>
          . Adds <Green b>1</Green> <Green>additional charge</Green>.
        </>
      )
    },
    {
      name: "It's Baron Bunny!",
      image: "9/95/Constellation_It%27s_Baron_Bunny%21",
      desc: "Explosive Puppet"
    },
    {
      name: "Wildfire",
      image: "1/1b/Constellation_Wildfire",
      desc: (
        <>
          Fiery Rain increases all party members' <Green>Movement SPD</Green>{" "}
          and <Green>ATK</Green> by <Green b>15%</Green> for 10s.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => <>{Amber.pasvTalents[0].buff}.</>,
      isGranted: checkAscs[1],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "EB.cRate", 10)
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Amber.pasvTalents[1].desc,
      affect: "self",
      isGranted: checkAscs[4],
      addBnes: simpleAnTmaker("ATTRs", "ATK%", 15)
    },
    {
      index: 2,
      src: "Constellation 2",
      desc: () => Amber.constellation[1].buff,
      affect: "self",
      isGranted: checkCons[2],
      addBnes: simpleAnTmaker("hitBnes", "ES.pct", 200)
    },
    {
      index: 3,
      src: "Constellation 6",
      desc: () => Amber.constellation[5].desc,
      affect: "party",
      isGranted: checkCons[6],
      addBnes: simpleAnTmaker("ATTRs", "ATK%", 15)
    }
  ]
};

export default Amber;

import { simpleAnTmaker } from "../../../calculators/helpers";
import { anemoDmg, Green } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  doubleCooking,
  mediumPAs,
  SwordNaDesc,
  SwordPaDesc
} from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const Jean = {
  code: 2,
  name: "Jean",
  icon: "8/89/Character_Jean_Thumb",
  sideIcon: "9/9e/Character_Jean_Side_Icon",
  rarity: 5,
  nation: "Mondstadt",
  vision: "Anemo",
  weapon: "Sword",
  stats: [
    { "Base HP": 1144, "Base ATK": 19, "Base DEF": 60 },
    { "Base HP": 2967, "Base ATK": 48, "Base DEF": 155 },
    { "Base HP": 3948, "Base ATK": 64, "Base DEF": 206 },
    { "Base HP": 5908, "Base ATK": 96, "Base DEF": 309 },
    { "Base HP": 6605, "Base ATK": 108, "Base DEF": 345, "Healing Bonus": 5.5 },
    { "Base HP": 7599, "Base ATK": 124, "Base DEF": 397, "Healing Bonus": 5.5 },
    {
      "Base HP": 8528,
      "Base ATK": 139,
      "Base DEF": 446,
      "Healing Bonus": 11.1
    },
    {
      "Base HP": 9533,
      "Base ATK": 155,
      "Base DEF": 499,
      "Healing Bonus": 11.1
    },
    {
      "Base HP": 10230,
      "Base ATK": 166,
      "Base DEF": 535,
      "Healing Bonus": 11.1
    },
    {
      "Base HP": 11243,
      "Base ATK": 183,
      "Base DEF": 588,
      "Healing Bonus": 11.1
    },
    {
      "Base HP": 11940,
      "Base ATK": 194,
      "Base DEF": 624,
      "Healing Bonus": 16.6
    },
    {
      "Base HP": 12965,
      "Base ATK": 211,
      "Base DEF": 678,
      "Healing Bonus": 16.6
    },
    {
      "Base HP": 13662,
      "Base ATK": 222,
      "Base DEF": 715,
      "Healing Bonus": 22.2
    },
    {
      "Base HP": 14695,
      "Base ATK": 239,
      "Base DEF": 769,
      "Healing Bonus": 22.2
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Favonius Bladework",
      desc: [
        SwordNaDesc,
        {
          heading: "CA",
          content: (
            <>
              Consumes a certain amount of stamina to launch an opponent using
              the power of wind.
              <br />
              Launched opponents will slowly fall to the ground.
            </>
          )
        },
        SwordPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 48.33,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 45.58,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 60.29,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 65.88,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 79.21,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 162.02,
          multType: 1
        },
        CaStamina[20],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Gale Blade",
      image: "2/24/Talent_Gale_Blade",
      desc: [
        {
          content: (
            <>
              Focusing the might of the formless wind around her blade, Jean
              releases a miniature storm, launching opponents in the direction
              she aims at, dealing massive {anemoDmg}.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              At the cost of continued stamina consumption, Jean can command the
              whirlwind to pull surrounding opponents and objects towards her
              front. Direction can be adjusted.
              <br />
              Character is immobile during skill duration.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 292,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Stamina Consumption", value: "20 per Second" },
        { name: "Max Duration", value: "5s" },
        { name: "CD", value: "6s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Dandelion Breeze",
      image: "e/ef/Talent_Dandelion_Breeze",
      desc: [
        {
          content: (
            <>
              Calling upon the wind's protection, Jean creates a swirling
              Dandelion Field, launching surrounding opponents and dealing{" "}
              {anemoDmg}. At the same time, she instantly regenerates a large
              amount of HP for all party members. The amount of HP restored
              scales off Jean's ATK.
            </>
          )
        },
        {
          heading: "Dandelion Field",
          content: (
            <>
              • Continuously regenerates HP of characters within the AoE and
              continuously imbues them with {anemoDmg}.
              <br />• Deals {anemoDmg} to opponents entering or exiting the
              Dandelion Field.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Burst DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 424.8,
          multType: 2
        },
        {
          name: "Entering/Exiting DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 78.4,
          multType: 2
        },
        {
          name: "Activation Healing",
          isHealing: true,
          baseSType: "ATK",
          baseMult: 251.2,
          multType: 2,
          baseFlat: 1540,
          flatType: 3
        },
        {
          name: "Continuous Regen.",
          isHealing: true,
          baseSType: "ATK",
          baseMult: 25.12,
          multType: 2,
          baseFlat: 154,
          flatType: 3
        }
      ],
      otherStats: () => [{ name: "CD", value: "20s" }],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Wind Companion",
      image: "7/79/Talent_Wind_Companion",
      desc: (
        <>
          On hit, Jean's Normal Attacks have a <Green b>50%</Green>{" "}
          <Green>chance</Green> to regenerate HP equal to <Green b>15%</Green>{" "}
          of Jean's <Green>ATK</Green> for all party members.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Let the Wind Lead",
      image: "1/1d/Talent_Let_the_Wind_Lead",
      desc: (
        <>
          Using Dandelion Breeze will regenerate <Green b>20%</Green> of its{" "}
          <Green>Energy</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Guiding Breeze",
      image: "c/cc/Talent_Guiding_Breeze",
      desc: doubleCooking("Jean", "dish with restorative effects")
    }
  ],
  constellation: [
    {
      name: "Spiraling Tempest",
      image: "a/ad/Constellation_Spiraling_Tempest",
      desc: (
        <>
          Increases the pulling speed of Gale Blade after holding for more than
          1s, and increases the <Green>DMG</Green> dealt by <Green b>40%</Green>
          .
        </>
      )
    },
    {
      name: "People's Aegis",
      image: "4/49/Constellation_People%27s_Aegis",
      desc: (
        <>
          When Jean picks up an Elemental Orb/Particle, all party members have
          their <Green>Movement SPD</Green> and <Green>ATK SPD</Green> increased
          by <Green b>15%</Green> for 15s.
        </>
      )
    },
    {
      name: "When the West Wind Arises",
      image: "a/a7/Constellation_When_the_West_Wind_Arises",
      desc: "Dandelion Breeze"
    },
    {
      name: "Lands of Dandelion",
      image: "b/b1/Constellation_Lands_of_Dandelion",
      desc: (
        <>
          Within the Field created by Dandelion Breeze, all opponents have their{" "}
          <Green>Anemo RES</Green> decreased by <Green b>40%</Green>.
        </>
      )
    },
    {
      name: "Outbursting Gust",
      image: "a/a0/Constellation_Outbursting_Gust",
      desc: "Gale Blade"
    },
    {
      name: "Lion's Fang, Fair Protector of Mondstadt",
      image: "e/e4/Constellation_Lion%27s_Fang%2C_Fair_Protector_of_Mondstadt",
      desc: (
        <>
          <Green>Incoming DMG</Green> is decreased by <Green b>35%</Green>{" "}
          within the Field created by Dandelion Breeze. Upon leaving the
          Dandelion Field, this effect lasts for 3 attacks or 10s.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 1",
      desc: () => Jean.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "ES.pct", 40)
    },
    {
      index: 1,
      src: "Constellation 2",
      desc: () => Jean.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "party",
      addBnes: simpleAnTmaker(
        "ATTRs",
        ["Normal ATK SPD", "Charged ATK SPD"],
        15
      )
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 4",
      desc: () => Jean.constellation[3].desc,
      isGranted: checkCons[4],
      addPntes: simpleAnTmaker("rdMult", "Anemo_rd", 40)
    }
  ]
};

export default Jean;

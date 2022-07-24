import { simpleAnTmaker } from "../../../calculators/helpers";
import { cryoDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, SwordDesc } from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const Qiqi = {
  code: 7,
  name: "Qiqi",
  icon: "d/d5/Character_Qiqi_Thumb",
  sideIcon: "1/1c/Character_Qiqi_Side_Icon",
  rarity: 5,
  nation: "Liyue",
  vision: "Cryo",
  weapon: "Sword",
  stats: [
    { "Base HP": 963, "Base ATK": 22, "Base DEF": 72 },
    { "Base HP": 2498, "Base ATK": 58, "Base DEF": 186 },
    { "Base HP": 3323, "Base ATK": 77, "Base DEF": 248 },
    { "Base HP": 4973, "Base ATK": 115, "Base DEF": 371 },
    { "Base HP": 5559, "Base ATK": 129, "Base DEF": 415, "Healing Bonus": 5.5 },
    { "Base HP": 6396, "Base ATK": 148, "Base DEF": 477, "Healing Bonus": 5.5 },
    {
      "Base HP": 7178,
      "Base ATK": 167,
      "Base DEF": 535,
      "Healing Bonus": 11.1
    },
    {
      "Base HP": 8023,
      "Base ATK": 186,
      "Base DEF": 598,
      "Healing Bonus": 11.1
    },
    {
      "Base HP": 8610,
      "Base ATK": 200,
      "Base DEF": 642,
      "Healing Bonus": 11.1
    },
    {
      "Base HP": 9463,
      "Base ATK": 220,
      "Base DEF": 706,
      "Healing Bonus": 11.1
    },
    {
      "Base HP": 10050,
      "Base ATK": 223,
      "Base DEF": 749,
      "Healing Bonus": 16.6
    },
    {
      "Base HP": 10912,
      "Base ATK": 253,
      "Base DEF": 814,
      "Healing Bonus": 16.6
    },
    {
      "Base HP": 11499,
      "Base ATK": 267,
      "Base DEF": 857,
      "Healing Bonus": 22.2
    },
    {
      "Base HP": 12368,
      "Base ATK": 287,
      "Base DEF": 922,
      "Healing Bonus": 22.2
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Ancient Sword Art",
      desc: SwordDesc,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 37.75,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 38.87,
          multType: 1
        },
        {
          name: "3-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 24.17,
          multType: 1
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 24.68,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 63.04,
          multType: 1
        },
        {
          name: "Charged Attack (1/2)",
          dmgTypes: ["CA", "Physical"],
          baseMult: 64.33,
          multType: 1
        },
        CaStamina[20],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Adeptus Art: Herald of Frost",
      image: "7/7f/Talent_Adeptus_Art_Herald_of_Frost",
      desc: [
        {
          content: (
            <>
              Using the Icevein Talisman, Qiqi brings forth the Herald of Frost,
              dealing {cryoDmg} to surrounding opponents.
            </>
          )
        },
        {
          heading: "Herald of Frost",
          content: (
            <>
              • On hit, Qiqi's Normal and Charged Attacks regenerate HP for your
              own party members and nearby teammates. Healing scales based on
              Qiqi's ATK.
              <br />• Periodically regenerates your active character's HP.
              <br />• Follows the character around, dealing {cryoDmg} to
              opponents in their path.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 96,
          multType: 2
        },
        {
          name: "Herald DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 36,
          multType: 2
        },
        {
          name: "Regen. on Hit",
          isHealing: true,
          baseSType: "ATK",
          baseMult: 10.56,
          multType: 2,
          baseFlat: 67,
          flatType: 3
        },
        {
          name: "Continuous Regen.",
          isHealing: true,
          baseSType: "ATK",
          baseMult: 69.6,
          multType: 2,
          baseFlat: 451,
          flatType: 3
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "15s" },
        { name: "CD", value: "30s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Adeptus Art: Preserver of Fortune",
      image: "7/7c/Talent_Adeptus_Art_Preserver_of_Fortune",
      desc: [
        {
          content: (
            <>
              Qiqi releases the adeptus power sealed within her body, marking
              nearby opponents with a Fortune-Preserving Talisman that deals{" "}
              {cryoDmg}.
            </>
          )
        },
        {
          heading: "Fortune-Preserving Talisman",
          content: (
            <>
              When opponents affected by this Talisman take DMG, the character
              that dealt this DMG regenerates HP.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 284.8,
          multType: 2
        },
        {
          name: "Healing",
          isHealing: true,
          baseSType: "ATK",
          baseMult: 90,
          multType: 2,
          baseFlat: 577,
          flatType: 3
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "15s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Life-Prolonging Methods",
      image: "b/b5/Talent_Life-Prolonging_Methods",
      desc: (
        <>
          When a character under the effects of Adeptus Art: Herald of Frost
          triggers an Elemental Reaction, their{" "}
          <Green>Incoming Healing Bonus</Green> is increased by{" "}
          <Green b>20%</Green> for 8s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "A Glimpse into Arcanum",
      image: "f/f8/Talent_A_Glimpse_Into_Arcanum",
      desc: (
        <>
          When Qiqi hits opponents with her Normal and Charged Attacks, she has
          a <Green b>50%</Green> <Green>chance</Green> to apply a
          Fortune-Preserving Talisman to them for 6s. This effect can only occur
          once every 30s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Former Life Memories",
      image: "5/5e/Talent_Former_Life_Memories",
      desc: (
        <>
          Displays the location of nearby <Green>resources</Green> unique to{" "}
          <Green>Liyue</Green> on the mini-map.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Ascetics of Frost",
      image: "1/10/Constellation_Ascetics_of_Frost",
      desc: (
        <>
          When the Herald of Frost hits an opponent marked by a
          Fortune-Preserving Talisman, Qiqi regenerates <Green b>2</Green>{" "}
          <Green>Energy</Green>.
        </>
      )
    },
    {
      name: "Frozen to the Bone",
      image: "b/ba/Constellation_Frozen_to_the_Bone",
      desc: (
        <>
          Qiqi's <Green>Normal and Charged Attack DMG</Green> against opponents
          affected by Cryo is increased by <Green b>15%</Green>.
        </>
      )
    },
    {
      name: "Ascendant Praise",
      image: "c/c6/Constellation_Ascendant_Praise",
      desc: "Adeptus Art: Preserver of Fortune"
    },
    {
      name: "Divine Suppression",
      image: "6/61/Constellation_Divine_Suppression",
      desc: (
        <>
          Targets marked by the Fortune-Preserving Talisman have their{" "}
          <Green>ATK</Green> decreased by <Green b>20%</Green>.
        </>
      )
    },
    {
      name: "Crimson Lotus Bloom",
      image: "e/ec/Constellation_Crimson_Lotus_Bloom",
      desc: "Adeptus Art: Herald of Frost"
    },
    {
      name: "Rite of Resurrection",
      image: "b/b9/Constellation_Rite_of_Resurrection",
      desc: (
        <>
          Using Adeptus Art: Preserver of Fortune{" "}
          <Green>revives all fallen party members</Green> nearby and regenerates{" "}
          <Green b>50%</Green> of their <Green>HP</Green>.<br />
          This effect can only occur once every 15 mins.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => Qiqi.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", ["NA.pct", "CA.pct"], 15)
    }
  ]
};

export default Qiqi;

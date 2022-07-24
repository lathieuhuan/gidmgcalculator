import { simpleAnTmaker } from "../../../calculators/helpers";
import { electroDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, SwordCaDesc, SwordPaDesc } from "../config";
import { checkAscs, checkCharMC, makeTlBnes, xtraTlLv } from "../helpers";

const tlBnes_ascs4 = (index) => ({ ATTRs, char, selfMCs }) =>
  makeTlBnes(
    checkCharMC(Shinobu.buffs, char, selfMCs.BCs, 1),
    "flat",
    [1, 4],
    Math.round(ATTRs["Elemental Mastery"] * (index ? 0.25 : 0.75))
  );

const Shinobu = {
  code: 52,
  name: "Shinobu",
  icon: "3/37/Character_Kuki_Shinobu_Thumb",
  sideIcon: "",
  rarity: 4,
  nation: "Inazuma",
  vision: "Electro",
  weapon: "Sword",
  stats: [
    { "Base HP": 1030, "Base ATK": 18, "Base DEF": 63 },
    { "Base HP": 2647, "Base ATK": 46, "Base DEF": 162 },
    { "Base HP": 3417, "Base ATK": 59, "Base DEF": 209 },
    { "Base HP": 5118, "Base ATK": 88, "Base DEF": 313 },
    { "Base HP": 5665, "Base ATK": 98, "Base DEF": 346, "HP%": 6 },
    { "Base HP": 6516, "Base ATK": 113, "Base DEF": 398, "HP%": 6 },
    { "Base HP": 7245, "Base ATK": 125, "Base DEF": 443, "HP%": 12 },
    { "Base HP": 8096, "Base ATK": 140, "Base DEF": 495, "HP%": 12 },
    { "Base HP": 8643, "Base ATK": 149, "Base DEF": 528, "HP%": 12 },
    { "Base HP": 9493, "Base ATK": 164, "Base DEF": 580, "HP%": 12 },
    { "Base HP": 10040, "Base ATK": 174, "Base DEF": 613, "HP%": 18 },
    { "Base HP": 10891, "Base ATK": 188, "Base DEF": 665, "HP%": 18 },
    { "Base HP": 11438, "Base ATK": 198, "Base DEF": 699, "HP%": 24 },
    { "Base HP": 12289, "Base ATK": 212, "Base DEF": 751, "HP%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Shinobu's Shadowsword",
      desc: [
        { heading: "NA", content: <>Performs up to 4 rapid strikes.</> },
        SwordCaDesc,
        SwordPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 48.76,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 44.55,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 59.34,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 76.11,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: [55.63, 66.77],
          multType: 1
        },
        CaStamina[20],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Sanctifying Ring",
      image: "d/d7/Talent_Sanctifying_Ring",
      desc: [
        {
          content: (
            <>
              Creates a Grass Ring of Sanctification at the cost of part of her
              HP, dealing {electroDmg} to nearby opponents.
            </>
          )
        },
        {
          heading: "Grass Ring of Sanctification",
          content: (
            <>
              Follows the current active character around. Deals {electroDmg} to
              nearby opponents every 1.5s and <Green>restores HP</Green> for the
              active character(s) within the ring's AoE based on Kuki Shinobu's{" "}
              <Green>Max HP</Green>.
            </>
          )
        },
        {
          content: (
            <>
              The HP consumption from using this skill can only bring her to 20%
              HP.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 75.71,
          multType: 2
        },
        {
          name: "Grass Ring of Sanctification Healing",
          baseSType: "HP",
          isHealing: true,
          baseMult: 3,
          multType: 2,
          baseFlat: 289,
          flatType: 3,
          getTlBnes: tlBnes_ascs4(0)
        },
        {
          name: "Grass Ring of Sanctification DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 25.24,
          multType: 2,
          getTlBnes: tlBnes_ascs4(1)
        }
      ],
      otherStats: () => [
        { name: "Activation Cost", value: "30% Current HP" },
        { name: "Duration", value: "12s" },
        { name: "CD", value: "15s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Gyoei Narukami Kariyama Rite",
      image: "4/47/Talent_Gyoei_Narukami_Kariyama_Rite",
      desc: [
        {
          content: (
            <>
              Stabs an evil-excoriating blade into the ground, creating a field
              that cleanses the area of all that is foul, dealing continuous{" "}
              {electroDmg} to opponents within its AoE based on Shinobu's{" "}
              <Green>Max HP</Green>.
              <br />
              If Shinobu's HP is less than or equal to 50% when this skill is
              used, the field will last longer.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Single Instance DMG",
          baseSType: "HP",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 3.6,
          multType: 2
        },
        {
          name: "Total DMG (HP > 50%)",
          baseSType: "HP",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 25.23,
          multType: 2
        },
        {
          name: "Total DMG",
          baseSType: "HP",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 43.26,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "2s/3.5s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Breaking Free",
      image: "c/c7/Talent_Breaking_Free",
      desc: (
        <>
          When Shinobu's HP is not higher than 50%, her{" "}
          <Green>Healing Bonus</Green> is increased by <Green b>15%</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Heart's Repose",
      image: "1/13/Talent_Heart%27s_Repose",
      desc: (
        <>
          Sanctifying Ring's abilities will be boosted based on Shinobu's
          Elemental Mastery:
          <br />• <Green>Healing amount</Green> will be increased by{" "}
          <Green b>75%</Green> of <Green>Elemental Mastery</Green>.
          <br />• <Green>DMG</Green> dealt is increased by <Green b>25%</Green>{" "}
          of <Green>Elemental Mastery</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Protracted Prayers",
      image: "5/5e/Talent_Protracted_Prayers",
      desc: (
        <>
          Gains <Green b>25%</Green> more <Green>rewards</Green> when dispatched
          on a Inazuma <Green>Expedition</Green> for 20 hours.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "To Cloister Compassion",
      image: "4/4c/Constellation_To_Cloister_Compassion",
      desc: (
        <>
          Goei Narukami Kariyama Rite's <Green>AoE</Green> is increased by{" "}
          <Green b>50%</Green>.
        </>
      )
    },
    {
      name: "To Forsake Fortune",
      image: "a/a8/Constellation_To_Forsake_Fortune",
      desc: (
        <>
          Grass Ring of Santification's <Green>duration</Green> is increased by{" "}
          <Green b>3s</Green>.
        </>
      )
    },
    {
      name: "To Sequester Sorrow",
      image: "e/e4/Constellation_To_Sequester_Sorrow",
      desc: "Sanctifying Ring"
    },
    {
      name: "To Sever Sealing",
      image: "d/db/Constellation_To_Sever_Sealing",
      desc: (
        <>
          When the Normal, Charged, or Plunging Attacks of characters affected
          by Shinobu's Grass Ring of Sanctification hit opponents, a
          Thundergrass Mark will land on the opponent's position and deal AoE{" "}
          {electroDmg} based on <Green b>9.7%</Green> of Shinobu's{" "}
          <Green>Max HP</Green>.
          <br />
          This effect can occur once every 5s.
        </>
      )
    },
    {
      name: "To Cease Courtesies",
      image: "6/6f/Constellation_To_Cease_Courtesies",
      desc: "Goei Narukami Kariyama Rite"
    },
    {
      name: "To Ward Weakness",
      image: "9/9f/Constellation_To_Ward_Weakness",
      get desc() {
        return (
          <>
            When Kuki Shinobu takes lethal DMG, this instance of DMG will not
            take her down. This effect will automatically trigger when her HP
            reaches 1 and will trigger once every 60s.
            <br />
            {this.extra}
          </>
        );
      },
      extra: (
        <>
          When Shinobu's HP drops below 25%, she will gain <Green b>150</Green>{" "}
          <Green>Elemental Mastery</Green> for 15s. This effect will trigger
          once every 60s.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Shinobu.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Healing Bonus", 15)
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Shinobu.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self"
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Shinobu.constellation[5].extra,
      isGranted: (char) => char.constellation >= 6,
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Elemental Mastery", 150)
    }
  ]
};

export default Shinobu;

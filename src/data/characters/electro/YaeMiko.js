import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { electroDmg, Green, Red } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  CatalystCaDesc_Electro,
  lightPAs_Catalyst
} from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const YaeMiko = {
  code: 49,
  name: "Yae Miko",
  icon: "5/57/Character_Yae_Miko_Thumb",
  sideIcon: "2/25/Character_Yae_Miko_Side_Icon",
  rarity: 5,
  nation: "Inazuma",
  vision: "Electro",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 807, "Base ATK": 26, "Base DEF": 44 },
    { "Base HP": 2095, "Base ATK": 69, "Base DEF": 115 },
    { "Base HP": 2787, "Base ATK": 91, "Base DEF": 153 },
    { "Base HP": 4170, "Base ATK": 137, "Base DEF": 229 },
    { "Base HP": 4662, "Base ATK": 153, "Base DEF": 256, "CRIT Rate": 4.8 },
    { "Base HP": 5364, "Base ATK": 176, "Base DEF": 294, "CRIT Rate": 4.8 },
    { "Base HP": 6020, "Base ATK": 197, "Base DEF": 330, "CRIT Rate": 9.6 },
    { "Base HP": 6729, "Base ATK": 220, "Base DEF": 369, "CRIT Rate": 9.6 },
    { "Base HP": 7220, "Base ATK": 236, "Base DEF": 396, "CRIT Rate": 9.6 },
    { "Base HP": 7936, "Base ATK": 260, "Base DEF": 435, "CRIT Rate": 9.6 },
    { "Base HP": 8428, "Base ATK": 276, "Base DEF": 462, "CRIT Rate": 14.4 },
    { "Base HP": 9151, "Base ATK": 300, "Base DEF": 502, "CRIT Rate": 14.4 },
    { "Base HP": 9643, "Base ATK": 316, "Base DEF": 529, "CRIT Rate": 19.2 },
    { "Base HP": 10372, "Base ATK": 340, "Base DEF": 569, "CRIT Rate": 19.2 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Spiritfox Sin-Eater",
      desc: [
        {
          heading: "NA",
          content: (
            <>
              Summons forth kitsune spirits, initiating a maximum of 3 attacks
              that deal {electroDmg}.
            </>
          )
        },
        CatalystCaDesc_Electro,
        {
          heading: "PA",
          content: (
            <>
              Plunges towards the ground from mid-air, damaging all opponents in
              her path with thunderous might. Deals AoE {electroDmg} upon impact
              with the ground.
            </>
          )
        }
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 39.66,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 38.52,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 56.89,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 142.89,
          multType: 2
        },
        CaStamina[50],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Yakan Evocation: Sesshou Sakura",
      image: "9/93/Talent_Yakan_Evocation_Sesshou_Sakura",
      desc: [
        {
          content: (
            <>
              To Yae, such dull tasks as can be accomplished by driving spirits
              out need not be done personally.
              <br />
              Moves swiftly, leaving a Sesshou Sakura behind.
            </>
          )
        },
        {
          heading: "Sesshou Sakura",
          content: (
            <>
              Has the following properties:
              <br />• Periodically strikes one nearby opponent with lightning,
              dealing {electroDmg}.
              <br />• When there are other Sesshou Sakura nearby, their level
              will increase, boosting the DMG dealt by these lightning strikes.
            </>
          )
        },
        {
          content: (
            <>
              This skill has three charges.
              <br />A maximum of 3 Sesshou Sakura can exist simultaneously. The
              initial level of each Sesshou Sakura is 1, and the initial highest
              level each sakura can reach is 3. If a new Sesshou Sakura is
              created too close to an existing one, the existing one will be
              destroyed.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Sesshou Sakura DMG Lv.1",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 60.67,
          multType: 2
        },
        {
          name: "DMG Lv. 2",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 75.84,
          multType: 2
        },
        {
          name: "DMG Lv. 3",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 94.8,
          multType: 2
        },
        {
          name: "DMG Lv. 4",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 118.5,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "14s" },
        { name: "CD", value: "4s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Great Secret Art: Tenko Kenshin",
      image: "9/93/Talent_Great_Secret_Art_Tenko_Kenshin",
      desc: [
        {
          content: (
            <>
              Legends of "kitsunetsuki," or the manifestation of a kitsune's
              might, are common in Inazuma's folktales. One that particularly
              captures the imagination is that of the Sky Kitsune, said to cause
              lightning to fall down upon the foes of the Grand Narukami Shrine.
              Summons a lightning strike, dealing AoE {electroDmg}.
              <br />
              When she uses this skill, Yae Miko will unseal nearby Sesshou
              Sakura, destroying their outer forms and transforming them into
              Tenko Thunderbolts that descend from the skies, dealing AoE{" "}
              {electroDmg}. Each Sesshou Sakura destroyed in this way will
              create one Tenko Thunderbolt.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 260,
          multType: 2
        },
        {
          name: "Tenko Thunderbolt DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 333.82,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "22s" }],
      energyCost: 90
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "The Shrine's Sacred Shade",
      image: "6/68/Talent_The_Shrine%27s_Sacred_Shade",
      desc: (
        <>
          When casting Great Secret Art: Tenko Kenshin, each Sesshou Sakura
          destroyed <Green>reset the cooldown</Green> of <Green b>1</Green>{" "}
          <Green>charge</Green> of Yakan Evocation: Sesshou Sakura.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Enlightened Blessing",
      image: "b/ba/Talent_Enlightened_Blessing",
      desc: (
        <>
          Every point of <Green>Elemental Mastery</Green> Yae Miko possesses
          will increase <Green>Sesshou Sakura DMG</Green> by{" "}
          <Green b>0.15%</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Meditation of a Yako",
      image: "e/e5/Talent_Meditations_of_a_Yako",
      desc: (
        <>
          Has a <Green b>25%</Green> <Green>chance</Green> to get{" "}
          <Green b>1</Green> <Green>regional Character Talent Material</Green>{" "}
          (base material excluded) when crafting. The rarity is that of the base
          material.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Yakan Offering",
      image: "4/4e/Constellation_Yakan_Offering",
      desc: (
        <>
          Each time Great Secret Art: Tenko Kenshin activates a Tenko
          Thunderbolt, Yae Miko will restore <Green b>8</Green>{" "}
          <Green>Elemental Energy</Green> for herself.
        </>
      )
    },
    {
      name: "Fox's Mooncall",
      image: "5/55/Constellation_Fox%27s_Mooncall",
      desc: (
        <>
          Sesshou Sakura start at <Green>Level</Green> <Green b>2</Green> when
          created, their <Green>max level</Green> is increased to{" "}
          <Green b>4</Green>, and their <Green>attack range</Green> is increased
          by <Green b>60%</Green>.
        </>
      )
    },
    {
      name: "The Seven Glamours",
      image: "a/aa/Constellation_The_Seven_Glamours",
      desc: "Yakan Evocation: Sesshou Sakura"
    },
    {
      name: "Sakura Channeling",
      image: "7/70/Constellation_Sakura_Channeling",
      desc: (
        <>
          When Sesshou Sakura thunderbolt hit opponents, the{" "}
          <Green>Electro DMG Bonus</Green> of all nearby party members is
          increased by <Green b>20%</Green> for 5s.
        </>
      )
    },
    {
      name: "Mischievous Teasing",
      image: "a/ac/Constellation_Mischievous_Teasing",
      desc: "Great Secret Art: Tenko Kenshin"
    },
    {
      name: "Forbidden Art: Daisesshou",
      image: "c/cd/Constellation_Forbidden_Art_Daisesshou",
      desc: (
        <>
          Sesshou Sakura's attacks will ignore <Green b>60%</Green> of the
          opponents' <Green>DEF</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: ({ ATTRs }) => (
        <>
          {YaeMiko.pasvTalents[1].desc}{" "}
          <Red>DMG Bonus: {YaeMiko.buffs[0].bnValue(ATTRs)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: ({ ATTRs, hitBnes, tkDesc, tracker }) => {
        const bnValue = YaeMiko.buffs[0].bnValue(ATTRs);
        addAndTrack(tkDesc, hitBnes, "ES.pct", bnValue, tracker);
      },
      bnValue: (ATTRs) => (ATTRs["Elemental Mastery"] * 15) / 100
    },
    {
      index: 1,
      outdated: true,
      src: "Constellation 2",
      desc: () => YaeMiko.constellation[1].desc
    },
    {
      index: 2,
      src: "Constellation 4",
      desc: () => YaeMiko.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Electro DMG Bonus", 20)
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 6",
      desc: () => YaeMiko.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self",
      addPntes: simpleAnTmaker("rdMult", "ES_ig", 60)
    }
  ]
};

export default YaeMiko;

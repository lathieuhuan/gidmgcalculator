import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { anemoDmg, Green, Red } from "../../../styledCpns/DataDisplay";
import { CaStamina, CatalystCaDesc_Anemo, lightPAs_Catalyst } from "../config";
import { xtraTlLv } from "../helpers";

const Sucrose = {
  code: 3,
  name: "Sucrose",
  icon: "6/61/Character_Sucrose_Thumb",
  sideIcon: "4/4f/Character_Sucrose_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Anemo",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 775, "Base ATK": 14, "Base DEF": 59 },
    { "Base HP": 1991, "Base ATK": 37, "Base DEF": 151 },
    { "Base HP": 2570, "Base ATK": 47, "Base DEF": 195 },
    { "Base HP": 3850, "Base ATK": 71, "Base DEF": 293 },
    { "Base HP": 4261, "Base ATK": 78, "Base DEF": 324, "Anemo DMG Bonus": 6 },
    { "Base HP": 4901, "Base ATK": 90, "Base DEF": 373, "Anemo DMG Bonus": 6 },
    {
      "Base HP": 5450,
      "Base ATK": 100,
      "Base DEF": 414,
      "Anemo DMG Bonus": 12
    },
    {
      "Base HP": 6090,
      "Base ATK": 112,
      "Base DEF": 463,
      "Anemo DMG Bonus": 12
    },
    {
      "Base HP": 6501,
      "Base ATK": 120,
      "Base DEF": 494,
      "Anemo DMG Bonus": 12
    },
    {
      "Base HP": 7141,
      "Base ATK": 131,
      "Base DEF": 543,
      "Anemo DMG Bonus": 12
    },
    {
      "Base HP": 7552,
      "Base ATK": 139,
      "Base DEF": 574,
      "Anemo DMG Bonus": 18
    },
    {
      "Base HP": 8192,
      "Base ATK": 151,
      "Base DEF": 623,
      "Anemo DMG Bonus": 18
    },
    {
      "Base HP": 8604,
      "Base ATK": 158,
      "Base DEF": 654,
      "Anemo DMG Bonus": 24
    },
    {
      "Base HP": 9244,
      "Base ATK": 170,
      "Base DEF": 703,
      "Anemo DMG Bonus": 24
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Wind Spirit Creation",
      desc: [
        {
          heading: "NA",
          content: (
            <>
              Performs up to 4 attacks using Wind Spirits, dealing {anemoDmg}.
            </>
          )
        },
        CatalystCaDesc_Anemo,
        {
          heading: "PA",
          content: (
            <>
              Calling upon the power of her Wind Spirits, Sucrose plunges
              towards the ground from mid-air, damaging all opponents in her
              path. Deals AoE {anemoDmg} upon impact with the ground.
            </>
          )
        }
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 33.46,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 30.62,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 38.45,
          multType: 2
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 47.92,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 120.16,
          multType: 2
        },
        CaStamina[50],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Astable Anemohypostasis Creation - 6308",
      image: "7/76/Talent_Astable_Anemohypostasis_Creation_-_6308",
      desc: [
        {
          content: (
            <>
              Creates a small Wind Spirit that pulls opponents and objects
              towards its location, launches opponents within its AoE, and deals{" "}
              {anemoDmg}.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 211.2,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "15s" }]
    },
    {
      type: "Elemental Burst",
      name: "Forbidden Creation - Isomer 75 / Type II",
      image: "4/4d/Talent_Forbidden_Creation_-_Isomer_75_Type_II",
      desc: [
        {
          content: (
            <>
              Sucrose hurls an unstable concoction that creates a Large Wind
              Spirit. While it persists, the Large Wind Spirit will continuously
              pull in surrounding opponents and objects, launch nearby
              opponents, and deal {anemoDmg}.
            </>
          )
        },
        {
          heading: "Elemental Absorption",
          content: "the Wind Spirit"
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "DoT",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 148,
          multType: 2
        },
        {
          name: "Additional Elemental DMG",
          dmgTypes: ["EB", "Various"],
          baseMult: 44,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "6s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Catalyst Conversion",
      image: "8/8b/Talent_Catalyst_Conversion",
      desc: (
        <>
          When Sucrose triggers a Swirl, all characters in the party with the
          matching element have their <Green>Elemental Mastery</Green> increased
          by <Green b>50</Green> for 8s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Mollis Favonius",
      image: "0/02/Talent_Mollis_Favonius",
      desc: (
        <>
          When Astable Anemohypostasis Creation - 6308 or Forbidden Creation -
          Isomer 75 / Type II hits an opponent, increases all party members'{" "}
          <Green>Elemental Mastery</Green> based on <Green b>20%</Green> of
          Sucrose's <Green>Elemental Mastery</Green> for 8s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Astable Invention",
      image: "7/7e/Talent_Astable_Invention",
      desc: (
        <>
          When Sucrose crafts{" "}
          <Green>Character and Weapon Enhancement Materials</Green>, she has a{" "}
          <Green b>10%</Green> <Green>chance</Green> to obtain{" "}
          <Green b>double</Green> the product.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Clustered Vacuum Field",
      image: "c/ce/Constellation_Clustered_Vacuum_Field",
      desc: (
        <>
          Astable Anemohypostasis Creation - 6308 gains <Green b>1</Green>{" "}
          <Green>additional charge</Green>.
        </>
      )
    },
    {
      name: "Beth: Unbound Form",
      image: "3/3c/Constellation_Beth_Unbound_Form",
      desc: (
        <>
          The <Green>duration</Green> of Forbidden Creation - Isomer 75 / Type
          II is increased by <Green b>2s</Green>.
        </>
      )
    },
    {
      name: "Flawless Alchemistress",
      image: "c/cb/Constellation_Flawless_Alchemistress",
      desc: "Astable Anemohypostasis Creation - 6308"
    },
    {
      name: "Alchemania",
      image: "3/3e/Constellation_Alchemania",
      desc: (
        <>
          Sucrose will reduce the <Green>CD</Green> of Astable Anemohypostasis
          Creation - 6308 by <Green b>1-7s</Green> for every 7 Normal or Charged
          Attack hits she scores against opponents. One hit may be counted every
          0.1s.
        </>
      )
    },
    {
      name: "Caution: Standard Flask",
      image: "5/5e/Constellation_Caution_Standard_Flask",
      desc: "Forbidden Creation - Isomer 75 / Type II"
    },
    {
      name: "Chaotic Entropy",
      image: "b/b1/Constellation_Chaotic_Entropy",
      desc: (
        <>
          If Forbidden Creation - Isomer 75 / Type II triggers an Elemental
          Absorption, all party members gain a <Green b>20%</Green>{" "}
          <Green>Elemental DMG Bonus</Green> for the corresponding{" "}
          <Green>absorbed element</Green> during its duration.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Sucrose.pasvTalents[0].desc,
      affect: "teammates",
      addBnes: simpleAnTmaker("ATTRs", "Elemental Mastery", 50)
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: ({ inputs }) => (
        <>
          {Sucrose.pasvTalents[1].desc}{" "}
          <Red>
            Elemental Mastery Bonus: {Sucrose.buffs[1].bnValue(inputs)}.
          </Red>
        </>
      ),
      affect: "teammates",
      labels: ["Elemental Mastery"],
      inputs: [0],
      inputTypes: ["text"],
      maxs: [9999],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        const bnValue = Sucrose.buffs[1].bnValue(inputs);
        addAndTrack(tkDesc, ATTRs, "Elemental Mastery", bnValue, tracker);
      },
      bnValue: ([EM]) => Math.round(EM * 0.2)
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Sucrose.constellation[5].desc,
      affect: "teammates",
      labels: ["Element Absorbed"],
      inputs: ["Pyro"],
      inputTypes: ["swirl"],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        const field = inputs[0] + " DMG Bonus";
        addAndTrack(tkDesc, ATTRs, field, 20, tracker);
      }
    }
  ]
};

export default Sucrose;

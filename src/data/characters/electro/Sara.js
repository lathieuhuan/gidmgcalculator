import { addAndTrack, incElementalBnes } from "../../../calculators/helpers";
import { applyPct, getFinalTlLv, round2 } from "../../../helpers";
import { electroDmg, Green, Red } from "../../../styledCpns/DataDisplay";
import {
  BowCaDesc_contentMaker,
  bowCAs,
  BowNaDesc_5,
  BowPaDesc,
  lightPAs_Bow
} from "../config";
import { checkCons, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const Sara = {
  code: 41,
  name: "Kujou Sara",
  GOOD: "KujouSara",
  icon: "9/96/Character_Kujou_Sara_Thumb",
  sideIcon: "9/92/Character_Kujou_Sara_Side_Icon",
  rarity: 4,
  nation: "Inazuma",
  vision: "Electro",
  weapon: "Bow",
  stats: [
    { "Base HP": 802, "Base ATK": 16, "Base DEF": 53 },
    { "Base HP": 2061, "Base ATK": 42, "Base DEF": 135 },
    { "Base HP": 2661, "Base ATK": 54, "Base DEF": 175 },
    { "Base HP": 3985, "Base ATK": 81, "Base DEF": 262 },
    { "Base HP": 4411, "Base ATK": 90, "Base DEF": 289, "ATK%": 6 },
    { "Base HP": 5074, "Base ATK": 104, "Base DEF": 333, "ATK%": 6 },
    { "Base HP": 5642, "Base ATK": 115, "Base DEF": 370, "ATK%": 12 },
    { "Base HP": 6305, "Base ATK": 129, "Base DEF": 414, "ATK%": 12 },
    { "Base HP": 6731, "Base ATK": 137, "Base DEF": 442, "ATK%": 12 },
    { "Base HP": 7393, "Base ATK": 151, "Base DEF": 485, "ATK%": 12 },
    { "Base HP": 7818, "Base ATK": 160, "Base DEF": 513, "ATK%": 18 },
    { "Base HP": 8481, "Base ATK": 173, "Base DEF": 556, "ATK%": 18 },
    { "Base HP": 8907, "Base ATK": 182, "Base DEF": 584, "ATK%": 24 },
    { "Base HP": 9570, "Base ATK": 195, "Base DEF": 628, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Tengu Bowmanship",
      desc: [
        BowNaDesc_5,
        {
          heading: "CA",
          content: (
            <>
              {BowCaDesc_contentMaker(
                "crackling lightning",
                "An arrow fully charged with the storm's might",
                "Electro"
              )}
              <br />
              When in the Crowfeather Cover state, a fully-charged arrow will
              leave a Crowfeather behind after it hits.
            </>
          )
        },
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 36.89,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 38.7,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 48.5,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 50.4,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 58.05,
          multType: 1
        },
        ...bowCAs,
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Tengu Stormcall",
      image: "6/6a/Talent_Tengu_Stormcall",
      desc: [
        {
          get content() {
            return (
              <>
                Retreats rapidly with the speed of a tengu, summoning the
                protection of the Crowfeather.
                <br />
                Gains Crowfeather Cover for 18s, and when Kujou Sara fires a
                fully-charged Aimed Shot, Crowfeather Cover will be consumed,
                and will leave a Crowfeather at the target location.
                <br />
                Crowfeathers will trigger Tengu Juurai: Ambush after a short
                time, dealing {electroDmg} and granting {this.buff}
              </>
            );
          },
          buff: (
            <>
              the active character within its AoE an <Green>ATK Bonus</Green>{" "}
              based on Kujou Sara's <Green>Base ATK</Green>.
            </>
          )
        },
        {
          content: (
            <>
              The ATK Bonuses from different Tengu Juurai will not stack, and
              their effects and duration will be determined by the last Tengu
              Juurai to take effect.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Tengu Juurai: Ambush DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 125.76,
          multType: 2
        },
        {
          name: "ATK Bonus",
          baseSType: "Base ATK",
          baseMult: 42.96,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "ATK Bonus Duration", value: "6s" },
        { name: "Hold CD", value: "10s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Subjugation: Koukou Sendou",
      image: "e/e8/Talent_Subjugation_Koukou_Sendou",
      desc: [
        {
          content: (
            <>
              Casts down Tengu Juurai: Titanbreaker, dealing AoE {electroDmg}.
              Afterwards, Tengu Juurai: Titanbreaker spreads out into 4
              consecutive bouts of Tengu Juurai: Stormcluster, dealing AoE{" "}
              {electroDmg}.
              <br />
              Tengu Juurai: Titanbreaker and Tengu Juurai: Stormcluster can
              provide the active character within their AoE with the same ATK
              Bonus as given by the Elemental Skill, Tengu Stormcall.
            </>
          )
        },
        {
          content: (
            <>
              The ATK Bonus provided by various kinds of Tengu Juurai will not
              stack, and their effects and duration will be determined by the
              last Tengu Juurai to take effect.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Tengu Juurai: Titanbreaker DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 409.6,
          multType: 2
        },
        {
          name: "Tengu Juurai: Stormcluster DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 34.12,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "20s" }],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Immovable Will",
      image: "4/4f/Talent_Immovable_Will",
      desc: (
        <>
          While in the Crowfeather Cover state provided by Tengu Stormcall,{" "}
          <Green>Aimed Shot charge times</Green> are decreased by{" "}
          <Green b>60%</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Decorum",
      image: "b/b7/Talent_Decorum",
      desc: (
        <>
          When Tengu Juurai: Ambush hits opponents, Kujou Sara will restore{" "}
          <Green b>1.2</Green> <Green>Energy</Green> to all party members for
          every 100% Energy Recharge she has. This effect can be triggered once
          every 3s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Land Survey",
      image: "e/e8/Talent_Land_Survey",
      desc: (
        <>
          When dispatched on an <Green>expedition</Green> in Inazuma,{" "}
          <Green>time consumed</Green> is reduced by <Green b>25%</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Crow's Eye",
      image: "a/ad/Constellation_Crow%27s_Eye",
      desc: (
        <>
          When Tengu Juurai grant characters ATK Bonuses or hits opponents, the{" "}
          <Green>CD</Green> of Tengu Stormcall is decreased by{" "}
          <Green b>1s</Green>.
          <br />
          This effect can be triggered once every 3s.
        </>
      )
    },
    {
      name: "Dark Wings",
      image: "7/73/Constellation_Dark_Wings",
      desc: (
        <>
          Unleashing Tengu Stormcall will leave a weaker{" "}
          <Green>Crowfeather</Green> at Kujou Sara's original position that will
          deal <Green b>30%</Green> of its <Green>original DMG</Green>.
        </>
      )
    },
    {
      name: "The War Within",
      image: "c/c4/Constellation_The_War_Within",
      desc: "Subjugation: Koukou Sendou"
    },
    {
      name: "Conclusive Proof",
      image: "3/35/Constellation_Conclusive_Proof",
      desc: (
        <>
          The <Green>number of Tengu Juurai: Stormcluster</Green> released by
          Subjugation: Koukou Sendou is increased to <Green b>6</Green>.
        </>
      )
    },
    {
      name: "Spellsinger",
      image: "b/b1/Constellation_Spellsinger",
      desc: "Tengu Stormcall"
    },
    {
      name: "Sin of Pride",
      image: "b/b4/Constellation_Sin_of_Pride",
      desc: (
        <>
          The {electroDmg} of characters who have had their ATK increased by
          Tengu Juurai has its <Green>Crit DMG</Green> increased by{" "}
          <Green b>60%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: ({ toSelf, inputs }) => (
        <>
          Grants {Sara.actvTalents[1].desc[0].buff}{" "}
          {!toSelf && <Red>ATK Bonus: {Sara.buffs[0].bnValue(inputs)[0]}.</Red>}
        </>
      ),
      isGranted: () => true,
      affect: "party",
      labels: ["Base ATK", "Elemental Skill Level"],
      inputs: [0, 1],
      inputTypes: ["text", "text"],
      maxs: [9999, 13],
      addBnes: (obj) => {
        const args = obj.toSelf
          ? [
              obj.ATTRs["Base ATK"],
              getFinalTlLv(obj.char, Sara.actvTalents[1], obj.partyData)
            ]
          : obj.inputs;
        const result = Sara.buffs[0].bnValue(args);
        const desc = `${obj.tkDesc} / Lv. ${result[1]}`;
        addAndTrack(desc, obj.ATTRs, "ATK", result[0], obj.tracker);
      },
      bnValue: ([baseATK, level]) => {
        const tlMult = 42.96 * tlLvMults[2][level];
        return [
          applyPct(baseATK, tlMult),
          `${level} / ${round2(tlMult)}% of ${baseATK} Base ATK`
        ];
      }
    },
    {
      index: 1,
      src: "Constellation 6",
      desc: () => Sara.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "party",
      addBnes: ({ hitBnes, charData, infusion, tkDesc, tracker }) => {
        const settings = {
          vision: charData.vision,
          infusion,
          elmt: "Electro",
          type: "cDmg",
          value: 60
        };
        incElementalBnes(settings, hitBnes, tkDesc, tracker);
      }
    }
  ]
};

export default Sara;

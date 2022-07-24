import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { applyPct, getFinalTlLv } from "../../../helpers";
import { Green, hydroDmg } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  CatalystCaDesc_Hydro,
  CatalystPaDesc,
  lightPAs_Catalyst,
  swimStaminaPasv
} from "../config";
import { checkAscs, checkCharMC, checkCons, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const Kokomi = {
  code: 42,
  name: "Kokomi",
  GOOD: "SangonomiyaKokomi",
  icon: "c/cc/Character_Sangonomiya_Kokomi_Thumb",
  sideIcon: "b/b4/Character_Sangonomiya_Kokomi_Side_Icon",
  rarity: 5,
  nation: "Inazuma",
  vision: "Hydro",
  weapon: "Catalyst",
  stats: [
    {
      "Base HP": 1049,
      "Base ATK": 18,
      "Base DEF": 51,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 2720,
      "Base ATK": 47,
      "Base DEF": 133,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 3619,
      "Base ATK": 63,
      "Base DEF": 177,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 5416,
      "Base ATK": 94,
      "Base DEF": 264,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 6055,
      "Base ATK": 105,
      "Base DEF": 295,
      "Hydro DMG Bonus": 7.2,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 6966,
      "Base ATK": 121,
      "Base DEF": 340,
      "Hydro DMG Bonus": 7.2,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 7818,
      "Base ATK": 136,
      "Base DEF": 381,
      "Hydro DMG Bonus": 14.4,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 8738,
      "Base ATK": 152,
      "Base DEF": 426,
      "Hydro DMG Bonus": 14.4,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 9377,
      "Base ATK": 163,
      "Base DEF": 457,
      "Hydro DMG Bonus": 14.4,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 10306,
      "Base ATK": 179,
      "Base DEF": 503,
      "Hydro DMG Bonus": 14.4,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 10945,
      "Base ATK": 190,
      "Base DEF": 534,
      "Hydro DMG Bonus": 21.6,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 11885,
      "Base ATK": 207,
      "Base DEF": 580,
      "Hydro DMG Bonus": 21.6,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 12524,
      "Base ATK": 218,
      "Base DEF": 611,
      "Hydro DMG Bonus": 28.8,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    },
    {
      "Base HP": 13471,
      "Base ATK": 234,
      "Base DEF": 657,
      "Hydro DMG Bonus": 28.8,
      "CRIT Rate": -100,
      "Healing Bonus": 25
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "The Shape of Water",
      desc: [
        {
          heading: "NA",
          content: (
            <>
              Performs up to 3 consecutive attacks that take the form of
              swimming fish, dealing {hydroDmg}.
            </>
          )
        },
        CatalystCaDesc_Hydro,
        CatalystPaDesc("Hydro", "Kokomi")
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 68.38,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 61.54,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 94.31,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 148.32,
          multType: 2
        },
        CaStamina[50],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Kurage's Oath",
      image: "6/6e/Talent_Kurage%27s_Oath",
      desc: [
        {
          content: (
            <>
              Summons a "Bake-Kurage" created from water that can heal her
              allies.
              <br />
              Using this skill will apply the Wet status to Sangonomiya Kokomi.
            </>
          )
        },
        {
          heading: "Bake-Kurage",
          content: (
            <>
              Deals {hydroDmg} to surrounding opponents and heal nearby active
              characters at fixed intervals. This healing is based on Kokomi's
              Max HP.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Regeneration",
          isHealing: true,
          baseSType: "HP",
          baseMult: 4.4,
          multType: 2,
          baseFlat: 424,
          flatType: 3
        },
        {
          name: "Ripple DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 109.19,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "12s" },
        { name: "CD", value: "20s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Nereid's Ascension",
      image: "4/46/Talent_Nereid%27s_Ascension",
      desc: [
        {
          content: (
            <>
              Summons the might of Watatsumi, dealing {hydroDmg} to surrounding
              opponents, before robing Kokomi in a Ceremonial Garment made from
              the flowing waters of Sangonomiya.
            </>
          )
        },
        {
          heading: "Ceremonial Garment",
          get content() {
            return (
              <>
                • {this.buff}
                <br />• When her Normal and Charged Attacks hit opponents,
                Kokomi will restore HP for all nearby party members, and the
                amount restored is based on her Max HP.
                <br />• Increases Sangonomiya Kokomi's resistance to
                interruption and allows her to walk on the water's surface.
              </>
            );
          },
          buff: (
            <>
              Kokomi's{" "}
              <Green>Normal Attack, Charged Attack and Bake-Kurage DMG</Green>{" "}
              are increased based on her <Green>Max HP</Green>.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseSType: "HP",
          baseMult: 10.42,
          multType: 2
        },
        {
          name: "HP Regen. per Hit",
          isHealing: true,
          baseSType: "HP",
          baseMult: 0.81,
          multType: 2,
          baseFlat: 77,
          flatType: 3
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "10s" },
        { name: "CD", value: "18s" }
      ],
      energyCost: 70
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Tamanooya's Casket",
      image: "c/cd/Talent_Tamanooya%27s_Casket",
      desc: (
        <>
          If Sangonomiya Kokomi's own Bake-Kurage is on the field when she uses
          Nereid's Ascension, the Bake-Kurage's <Green>duration</Green> will be{" "}
          <Green>refreshed</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Song of Pearls",
      image: "5/5f/Talent_Song_of_Pearls",
      desc: (
        <>
          During Nereid's Ascension, the{" "}
          <Green>Normal and Charged Attack DMG Bonus</Green> Kokomi gains based
          on her <Green>Max HP</Green> will receive a further increase based on{" "}
          <Green b>15%</Green> of her <Green>Healing Bonus</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Princess of Watatsumi",
      image: "4/49/Talent_Princess_of_Watatsumi",
      desc: swimStaminaPasv
    },
    {
      type: "Passive",
      name: "Flawless Strategy",
      image: "d/d5/Talent_Flawless_Strategy",
      desc: (
        <>
          Kokomi has a <Green b>25%</Green> <Green>Healing Bonus</Green>, but a{" "}
          <Green b>100%</Green> decrease in <Green>CRIT Rate</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "At Water's Edge",
      image: "6/6b/Constellation_At_Water%27s_Edge",
      desc: (
        <>
          While donning the Ceremonial Garment created by Nereid's Ascension,
          the final Normal Attack in Sangonomiya Kokomi's combo will unleash a
          swimming fish to deal <Green b>30%</Green> of her{" "}
          <Green>Max HP</Green> as {hydroDmg}.
          <br />
          This DMG is not considered Normal Attack DMG.
        </>
      )
    },
    {
      name: "The Clouds Like Waves Rippling",
      image: "9/9d/Constellation_The_Clouds_Like_Waves_Rippling",
      desc: (
        <>
          Sangonomiya Kokomi gains the following Healing Bonuses with regard to
          characters with 50% or less HP via the following methods:
          <br />• Kurage's Oath Bake-Kurage: <Green b>4.5%</Green> of Kokomi's{" "}
          <Green>Max HP</Green>.
          <br />• Nereid's Ascension Normal and Charged Attacks:{" "}
          <Green b>0.6%</Green> of Kokomi's <Green>Max HP</Green>.
        </>
      )
    },
    {
      name: "The Moon, A Ship O'er the Seas",
      image: "c/cd/Constellation_The_Moon%2C_A_Ship_O%27er_the_Seas",
      desc: "Nereid's Ascension"
    },
    {
      name: "The Moon Overlooks the Waters",
      image: "f/fc/Constellation_The_Moon_Overlooks_the_Waters",
      get desc() {
        return (
          <>
            {this.buff}, and Normal Attacks that hit opponents will restore{" "}
            <Green b>0.8</Green> <Green>Energy</Green> for her.
            <br />
            This effect can occur once every 0.2s.
          </>
        );
      },
      buff: (
        <>
          During Nereid's Ascension, Kokomi's <Green>Normal Attack SPD</Green>{" "}
          is increased by <Green b>10%</Green>
        </>
      )
    },
    {
      name: "All Streams Flow to the Sea",
      image: "e/e4/Constellation_All_Streams_Flow_to_the_Sea",
      desc: "Kurage's Oath"
    },
    {
      name: "Sango Isshin",
      image: "3/3b/Constellation_Sango_Isshin",
      desc: (
        <>
          During Nereid's Ascension, Kokomi gains a <Green b>40%</Green>{" "}
          <Green>Hydro DMG Bonus</Green> for 4s after her Normal and Charged
          Attacks heal, or would heal, any party member with 80% or more HP.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: () => Kokomi.actvTalents[2].desc[1].buff,
      isGranted: () => true,
      affect: "self",
      addFinalBnes: (obj) => {
        const { char } = obj;
        const fields = ["NA.flat", "CA.flat", "ES.flat"];
        const level = getFinalTlLv(char, Kokomi.actvTalents[2], obj.partyData);
        const bnValues = [4.84, 6.78, 7.1].map((mult, i) => {
          let finalMult = mult * tlLvMults[2][level];
          if (checkCharMC(Kokomi.buffs, char, obj.charBCs, 1) && i !== 2) {
            finalMult += obj.ATTRs["Healing Bonus"] * 0.15;
          }
          return applyPct(obj.ATTRs.HP, finalMult);
        });
        addAndTrack(obj.tkDesc, obj.hitBnes, fields, bnValues, obj.tracker);
      }
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: () => Kokomi.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self"
    },
    {
      index: 2,
      src: "Constellation 4",
      desc: () => <>{Kokomi.constellation[3].buff}.</>,
      isGranted: checkCons[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Normal ATK SPD", 10)
    },
    {
      index: 3,
      src: "Constellation 6",
      desc: () => Kokomi.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Hydro DMG Bonus", 40)
    }
  ]
};

export default Kokomi;

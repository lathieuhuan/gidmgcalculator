import { simpleAnTmaker } from "../../../calculators/helpers";
import { Green, hydroDmg } from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  CatalystCaDesc_Hydro,
  CatalystPaDesc,
  doubleCooking,
  lightPAs_Catalyst
} from "../config";
import { checkCons, xtraTlLv } from "../helpers";

const Barbara = {
  code: 15,
  name: "Barbara",
  icon: "7/72/Character_Barbara_Thumb",
  sideIcon: "5/50/Character_Barbara_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Hydro",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 821, "Base ATK": 13, "Base DEF": 56 },
    { "Base HP": 2108, "Base ATK": 34, "Base DEF": 144 },
    { "Base HP": 2721, "Base ATK": 44, "Base DEF": 186 },
    { "Base HP": 4076, "Base ATK": 66, "Base DEF": 279 },
    { "Base HP": 4512, "Base ATK": 73, "Base DEF": 308, "HP%": 6 },
    { "Base HP": 5189, "Base ATK": 84, "Base DEF": 355, "HP%": 6 },
    { "Base HP": 5770, "Base ATK": 94, "Base DEF": 394, "HP%": 12 },
    { "Base HP": 6448, "Base ATK": 105, "Base DEF": 441, "HP%": 12 },
    { "Base HP": 6884, "Base ATK": 112, "Base DEF": 470, "HP%": 12 },
    { "Base HP": 7561, "Base ATK": 123, "Base DEF": 517, "HP%": 12 },
    { "Base HP": 7996, "Base ATK": 130, "Base DEF": 546, "HP%": 18 },
    { "Base HP": 8674, "Base ATK": 141, "Base DEF": 593, "HP%": 18 },
    { "Base HP": 9110, "Base ATK": 148, "Base DEF": 623, "HP%": 24 },
    { "Base HP": 9787, "Base ATK": 159, "Base DEF": 669, "HP%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Whisper of Water",
      desc: [
        {
          heading: "NA",
          content: (
            <>Perform up to 4 water splash attacks that deal {hydroDmg}.</>
          )
        },
        CatalystCaDesc_Hydro,
        CatalystPaDesc("Hydro", "Barbara")
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 37.84,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 35.52,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 41.04,
          multType: 2
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 55.2,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 166.24,
          multType: 2
        },
        CaStamina[50],
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Let the Show Begin♪",
      image: "9/95/Talent_Let_the_Show_Begin%E2%99%AA",
      desc: [
        {
          content: (
            <>
              Summons water droplets resembling musical notes that form a Melody
              Loop, dealing {hydroDmg} to surrounding opponents and applying the
              Wet status to them.
            </>
          )
        },
        {
          heading: "Melody Loop",
          content: (
            <>
              • On hit, Barbara's Normal Attacks heal your own party members and
              nearby teammates for a certain amount of HP, which scales with
              Barbara's Max HP.
              <br />• On hit, Barbara's Charged Attack generates 4 times the
              amount of healing.
              <br />• Periodically regenerates your own active character's HP.
              <br />• Applies the Wet status to the character and to opponents
              who come in contact with them.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "HP Regen. per Hit",
          isHealing: true,
          baseSType: "HP",
          baseMult: 0.75,
          multType: 2,
          baseFlat: 72,
          flatType: 3
        },
        {
          name: "Continuous Regen.",
          isHealing: true,
          baseSType: "HP",
          baseMult: 4,
          multType: 2,
          baseFlat: 385,
          flatType: 3
        },
        {
          name: "Droplet DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 58.4,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "15s" },
        { name: "CD", value: "32s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Shining Miracle♪",
      image: "c/cb/Talent_Shining_Miracle%E2%99%AA",
      desc: [
        {
          content: (
            <>
              Heals your own party members and nearby teammates for a large
              amount of HP that scales with Barbara's Max HP.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Regeneration",
          isHealing: true,
          baseSType: "HP",
          baseMult: 17.6,
          multType: 2,
          baseFlat: 1694,
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
      name: "Glorious Season",
      image: "4/49/Talent_Glorious_Season",
      desc: (
        <>
          The <Green>Stamina Consumption</Green> of characters within Let the
          Show Begin♪'s Melody Loop is reduced by <Green b>12%</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Encore",
      image: "3/3f/Talent_Encore",
      desc: (
        <>
          When your active character gains an Elemental Orb/Particle, the{" "}
          <Green>duration</Green> of the Melody Loop of Let the Show Begin♪ is
          extended by <Green b>1s</Green>.
          <br />
          The <Green>maximum</Green> extension is <Green b>5s</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "With My Whole Heart♪",
      image: "4/4f/Talent_With_My_Whole_Heart%E2%99%AA",
      desc: doubleCooking("Barbara", "dish with restorative effects")
    }
  ],
  constellation: [
    {
      name: "Gleeful Songs",
      image: "b/b7/Constellation_Gleeful_Songs",
      desc: (
        <>
          Barbara regenerates <Green b>1</Green> <Green>Energy</Green> every
          10s.
        </>
      )
    },
    {
      name: "Vitality Burst",
      image: "1/14/Constellation_Vitality_Burst",
      get desc() {
        return (
          <>
            Decreases the <Green>CD</Green> of Let the Show Begin♪ by{" "}
            <Green b>15%</Green>.
            <br />
            {this.buff}
          </>
        );
      },
      buff: (
        <>
          During Let the Show Begin's duration, your active character gains a{" "}
          <Green b>15%</Green> <Green>Hydro DMG Bonus</Green>.
        </>
      )
    },
    {
      name: "Star of Tomorrow",
      image: "6/67/Constellation_Star_of_Tomorrow",
      desc: "Shining Miracle♪"
    },
    {
      name: "Attentiveness be My Power",
      image: "6/69/Constellation_Attentiveness_be_My_Power",
      desc: (
        <>
          Every opponent Barbara hits with her Charged Attack regenerates{" "}
          <Green b>1</Green> <Green>Energy</Green> for her.
          <br />A maximum of <Green b>5</Green> <Green>Energy</Green> can be
          regenerated in this manner with any one Charged Attack.
        </>
      )
    },
    {
      name: "The Purest Companionship",
      image: "6/69/Constellation_The_Purest_Companionship",
      desc: "Let the Show Begin♪"
    },
    {
      name: "Dedicating Everything to You",
      image: "a/a0/Constellation_Dedicating_Everything_to_You",
      desc: (
        <>
          When Barbara is in the party but not on the field, and one of your own
          party members falls:
          <br />• Automatically <Green>revives</Green> the fallen character.
          <br />• Fully restores the revived character's <Green>
            HP
          </Green> to <Green b>100%</Green>.
          <br />
          This effect can only occur once every 15 mins.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => Barbara.constellation[1].buff,
      isGranted: checkCons[2],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Hydro DMG Bonus", 15)
    }
  ]
};

export default Barbara;

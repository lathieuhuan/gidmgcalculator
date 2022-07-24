import { simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { Cryo, cryoDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, SwordNaDesc, SwordPaDesc } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Ayaka = {
  code: 37,
  name: "Ayaka",
  GOOD: "KamisatoAyaka",
  icon: "f/fd/Character_Kamisato_Ayaka_Thumb",
  sideIcon: "c/c4/Character_Kamisato_Ayaka_Side_Icon",
  rarity: 5,
  nation: "Inazuma",
  vision: "Cryo",
  weapon: "Sword",
  stats: [
    { "Base HP": 1001, "Base ATK": 27, "Base DEF": 61 },
    { "Base HP": 2597, "Base ATK": 69, "Base DEF": 158 },
    { "Base HP": 3455, "Base ATK": 92, "Base DEF": 211 },
    { "Base HP": 5170, "Base ATK": 138, "Base DEF": 315 },
    { "Base HP": 5779, "Base ATK": 154, "Base DEF": 352, "CRIT DMG": 9.6 },
    { "Base HP": 6649, "Base ATK": 177, "Base DEF": 405, "CRIT DMG": 9.6 },
    { "Base HP": 7462, "Base ATK": 198, "Base DEF": 455, "CRIT DMG": 19.2 },
    { "Base HP": 8341, "Base ATK": 222, "Base DEF": 509, "CRIT DMG": 19.2 },
    { "Base HP": 8951, "Base ATK": 238, "Base DEF": 546, "CRIT DMG": 19.2 },
    { "Base HP": 9838, "Base ATK": 262, "Base DEF": 600, "CRIT DMG": 19.2 },
    { "Base HP": 10448, "Base ATK": 278, "Base DEF": 637, "CRIT DMG": 28.8 },
    { "Base HP": 11345, "Base ATK": 302, "Base DEF": 692, "CRIT DMG": 28.8 },
    { "Base HP": 11954, "Base ATK": 318, "Base DEF": 729, "CRIT DMG": 38.4 },
    { "Base HP": 12858, "Base ATK": 342, "Base DEF": 784, "CRIT DMG": 38.4 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Kamisato Art: Kabuki",
      desc: [
        SwordNaDesc,
        {
          heading: "CA",
          content: (
            <>
              Consumes a certain amount of Stamina to unleash a flurry of sword
              ki.
            </>
          )
        },
        SwordPaDesc
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 45.73,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 48.68,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 62.62,
          multType: 1
        },
        {
          name: "4-Hit (1/3)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 22.65,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 78.18,
          multType: 1
        },
        {
          name: "Charged Attack (1/3)",
          dmgTypes: ["CA", "Physical"],
          baseMult: 55.13,
          multType: 1
        },
        CaStamina[20],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Kamisato Art: Hyouka",
      image: "5/56/Talent_Kamisato_Art_Hyouka",
      desc: [
        {
          content: (
            <>
              Summons blooming ice to launch nearby opponents, dealing AoE{" "}
              {cryoDmg}.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 239.2,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "10s" }]
    },
    {
      type: "Elemental Burst",
      name: "Kamisato Art: Soumetsu",
      image: "1/11/Talent_Kamisato_Art_Soumetsu",
      desc: [
        {
          content: (
            <>
              Summons forth a snowstorm with flawless poise, unleashing a
              Frostflake Seki no To that moves forward continuously.
            </>
          )
        },
        {
          heading: "Frostflake Seki no To",
          content: (
            <>
              • A storm of whirling icy winds that slashes repeatedly at every
              enemy it touches, dealing {cryoDmg}.
              <br />• The snowstorm explodes after its duration ends, dealing
              AoE {cryoDmg}.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Cutting DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 112.3,
          multType: 2
        },
        {
          name: "Bloom DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 168.45,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "5s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    },
    {
      type: "Alternate Sprint",
      name: "Kamisato Art: Senho",
      image: "d/d8/Talent_Kamisato_Art_Senho",
      desc: [
        {
          heading: "Alternate Sprint",
          content: (
            <>
              Ayaka consumes Stamina and cloaks herself in a frozen fog that
              moves with her.
            </>
          )
        },
        {
          get content() {
            return (
              <>
                {this.lines[0]}
                <br />
                {this.lines[1]}
                {this.lines[2]}
                {this.lines[3]}
              </>
            );
          },
          lines: [
            <>In Senho form, she moves swiftly upon water.</>,
            <>When she reappears, the following effects occur:</>,
            <>
              <br />• Ayaka unleashes frigid energy to apply <Cryo>Cryo</Cryo>{" "}
              on nearby opponents.
            </>,
            <>
              <br />• Coldness condenses around Ayaka's blade,{" "}
              <Green>infusing</Green> her attacks with <Cryo>Cryo</Cryo> for a
              brief period.
            </>
          ]
        }
      ],
      stats: [],
      otherStats: () => [
        { name: "Activation Stamina Consumption", value: 10 },
        { name: "Stamina Drain", value: "15/s" },
        { name: "Infusion Duration", value: "5s" }
      ]
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Amatsumi Kunitsumi Sanctification",
      image: "d/d9/Talent_Amatsumi_Kunitsumi_Sanctification",
      desc: (
        <>
          After using Kamisato Art: Hyouka, Ayaka's{" "}
          <Green>Normal and Charged attacks</Green> deal <Green b>30%</Green>{" "}
          increased <Green>DMG</Green> for 6s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Kanten Senmyou Blessing",
      image: "d/db/Talent_Kanten_Senmyou_Blessing",
      get desc() {
        return (
          <>
            {this.lines[0]}
            {this.lines[1]}
            {this.lines[2]}
          </>
        );
      },
      lines: [
        <>
          When the Cryo application at the end of Kamisato Art: Senho hits an
          opponent, Ayaka gains the following effects:
        </>,
        <>
          <br />• Restores <Green b>10</Green> <Green>Stamina</Green>.
        </>,
        <>
          <br />• Gains <Green b>18%</Green> <Green>Cryo DMG Bonus</Green> for
          10s.
        </>
      ]
    },
    {
      type: "Passive",
      name: "Fruits of Shinsa",
      image: "0/02/Talent_Fruits_of_Shinsa",
      desc: (
        <>
          When Ayaka crafts <Green>Weapon Ascension Materials</Green>, she has a{" "}
          <Green b>10%</Green> <Green>chance</Green> to receive{" "}
          <Green b>double</Green> the product.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Snowswept Sakura",
      image: "e/eb/Constellation_Snowswept_Sakura",
      desc: (
        <>
          When Ayaka's Normal or Charged Attacks deal {cryoDmg} to opponents, it
          has a <Green b>50%</Green> <Green>chance</Green> of decreasing the{" "}
          <Green>CD</Green> of Kamisato Art: Hyouka by <Green b>0.3s</Green>.
          This effect can occur once every 0.1s.
        </>
      )
    },
    {
      name: "Blizzard Blade Seki no To",
      image: "4/4a/Constellation_Blizzard_Blade_Seki_no_To",
      desc: (
        <>
          When casting Kamisato Art: Soumetsu, unleashes <Green b>2</Green>{" "}
          smaller additional <Green>Frostflake Seki no To</Green>, each dealing{" "}
          <Green b>20%</Green> of the original storm's <Green>DMG</Green>.
        </>
      )
    },
    {
      name: "Frostbloom Kamifubuki",
      image: "d/d3/Constellation_Frostbloom_Kamifubuki",
      desc: "Kamisato Art: Soumetsu"
    },
    {
      name: "Ebb and Flow",
      image: "f/f7/Constellation_Ebb_and_Flow",
      desc: (
        <>
          Opponents damaged by Kamisato Art: Soumetsu's Frostflake Seki no To
          will have their <Green>DEF</Green> decreased by <Green b>30%</Green>{" "}
          for 6s.
        </>
      )
    },
    {
      name: "Blossom Cloud Irutsuki",
      image: "d/d2/Constellation_Blossom_Cloud_Irutsuki",
      desc: "Kamisato Art: Hyouka"
    },
    {
      name: "Dance of Suigetsu",
      image: "d/d5/Constellation_Dance_of_Suigetsu",
      get desc() {
        return (
          <>
            {this.buff} This buff will be cleared 0.5s after Ayaka's Charged ATK
            hits an opponent, after which the timer for this ability will
            restart.
          </>
        );
      },
      buff: (
        <>
          Ayaka gains Usurahi Butou every 10s, increasing her{" "}
          <Green>Charged Attack DMG</Green> by <Green b>298%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Alternate Sprint",
      desc: () => (
        <>
          {Ayaka.actvTalents[3].desc[1].lines[1]}
          {Ayaka.actvTalents[3].desc[1].lines[3]}
        </>
      ),
      isGranted: () => true,
      affect: "self",
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: true
    },
    {
      index: 1,
      src: "Ascension 1 Passive Talent",
      desc: () => Ayaka.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", ["NA.pct", "CA.pct"], 30)
    },
    {
      index: 2,
      src: "Ascension 4 Passive Talent",
      desc: () => (
        <>
          {Ayaka.pasvTalents[1].lines[0]}
          {Ayaka.pasvTalents[1].lines[2]}
        </>
      ),
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Cryo DMG Bonus", 18)
    },
    {
      index: 3,
      src: "Constellation 6",
      desc: () => Ayaka.constellation[5].buff,
      isGranted: checkCons[6],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "CA.pct", 298)
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 4",
      desc: () => Ayaka.constellation[3].desc,
      isGranted: checkCons[4],
      addPntes: simpleAnTmaker("rdMult", "Def_rd", 30)
    }
  ]
};

export default Ayaka;

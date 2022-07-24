import { simpleAnTmaker } from "../../../calculators/helpers";
import { Green, hydroDmg } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, SwordDesc } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Xingqiu = {
  code: 17,
  name: "Xingqiu",
  icon: "4/4a/Character_Xingqiu_Thumb",
  sideIcon: "4/4e/Character_Xingqiu_Side_Icon",
  rarity: 4,
  nation: "Liyue",
  vision: "Hydro",
  weapon: "Sword",
  stats: [
    { "Base HP": 857, "Base ATK": 17, "Base DEF": 64 },
    { "Base HP": 2202, "Base ATK": 43, "Base DEF": 163 },
    { "Base HP": 2842, "Base ATK": 56, "Base DEF": 211 },
    { "Base HP": 4257, "Base ATK": 84, "Base DEF": 316 },
    { "Base HP": 4712, "Base ATK": 93, "Base DEF": 349, "ATK%": 6 },
    { "Base HP": 5420, "Base ATK": 107, "Base DEF": 402, "ATK%": 6 },
    { "Base HP": 6027, "Base ATK": 119, "Base DEF": 447, "ATK%": 12 },
    { "Base HP": 6735, "Base ATK": 133, "Base DEF": 499, "ATK%": 12 },
    { "Base HP": 7190, "Base ATK": 142, "Base DEF": 533, "ATK%": 12 },
    { "Base HP": 7897, "Base ATK": 156, "Base DEF": 585, "ATK%": 12 },
    { "Base HP": 8352, "Base ATK": 165, "Base DEF": 619, "ATK%": 18 },
    { "Base HP": 9060, "Base ATK": 179, "Base DEF": 671, "ATK%": 18 },
    { "Base HP": 9514, "Base ATK": 188, "Base DEF": 705, "ATK%": 24 },
    { "Base HP": 10222, "Base ATK": 202, "Base DEF": 758, "ATK%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Guhua Style",
      desc: SwordDesc,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 46.61,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 47.64,
          multType: 1
        },
        {
          name: "3-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 28.55,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 55.99,
          multType: 1
        },
        {
          name: "5-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 35.86,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: [47.3, 56.16],
          multType: 1
        },
        CaStamina[20],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Guhua Sword: Fatal Rainscreen",
      image: "5/5d/Talent_Guhua_Sword_Fatal_Rainscreen",
      desc: [
        {
          content: (
            <>
              Xingqiu performs twin strikes with his sword, dealing {hydroDmg}.
              At the same time, this ability creates the maximum number of Rain
              Swords, which will orbit your active character.
              <br />
              The Rain Swords have the following properties:
              <br />• When a character takes DMG, the Rain Sword will shatter,
              reducing the amount of DMG taken.
              <br />• Increases the character's resistance to interruption. 20%
              of Xingqiu's Hydro DMG Bonus will be converted to additional DMG
              Reduction for the Rain Swords.
            </>
          )
        },
        {
          content: (
            <>
              The maximum amount of additional DMG Reduction that can be gained
              this way is 24%.
              <br />
              The initial maximum number of Rain Swords is 3.
              <br />
              Using this ability applies the Wet status onto the character.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: [168, 191.2],
          multType: 2
        }
      ],
      otherStats: (lv) => [
        { name: "DMG Redution Ratio", value: Math.min(19 + lv, 29) + "%" },
        { name: "Duration", value: "15s" },
        { name: "CD", value: "21s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Guhua Sword: Raincutter",
      image: "2/23/Talent_Guhua_Sword_Raincutter",
      desc: [
        {
          content: (
            <>
              Initiate Rainbow Bladework and fight using an illusory sword rain,
              while creating the maximum number of Rain Swords.
            </>
          )
        },
        {
          heading: "Rainbow Bladework",
          content: (
            <>
              • Your active character's Normal Attacks will trigger consecutive
              sword rain attacks, dealing {hydroDmg}.
              <br />• Rain Swords will remain at the maximum number throughout
              the ability's duration.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Sword Rain",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 54.27,
          multType: 2
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
      name: "Hydropathic",
      image: "f/f6/Talent_Hydropathic",
      desc: (
        <>
          When a Rain Sword is shattered or when its duration expires, it{" "}
          <Green>regenerates</Green> the current character's <Green>HP</Green>{" "}
          based on <Green b>6%</Green> of Xingqiu's <Green>Max HP</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Blades Amidst Raindrops",
      image: "9/90/Talent_Blades_Amidst_Raindrops",
      desc: (
        <>
          Xingqiu gains a <Green b>20%</Green> <Green>Hydro DMG Bonus</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Flash of Genius",
      image: "b/bb/Talent_Flash_of_Genius",
      desc: (
        <>
          When Xingqiu crafts <Green>Character Talent Materials</Green>, he has
          a <Green b>25%</Green> <Green>chance</Green> to refund{" "}
          <Green b>a portion</Green> of the crafting materials used.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "The Scent Remained",
      image: "6/6c/Constellation_The_Scent_Remained",
      desc: (
        <>
          Increases the <Green>maximum number</Green> of Rain Swords by{" "}
          <Green b>1</Green>.
        </>
      )
    },
    {
      name: "Rainbow Upon the Azure Sky",
      image: "a/a5/Constellation_Rainbow_Upon_the_Azure_Sky",
      get desc() {
        return (
          <>
            Extends the <Green>duration</Green> of Guhua Sword: Raincutter by{" "}
            <Green b>3s</Green>.
            <br />
            {this.debuff}
          </>
        );
      },
      debuff: (
        <>
          Decreases the <Green>Hydro RES</Green> of opponents hit by sword rain
          attacks by <Green b>15%</Green> for 4s.
        </>
      )
    },
    {
      name: "Weaver of Verses",
      image: "3/3e/Constellation_Weaver_of_Verses",
      desc: "Guhua Sword: Raincutter"
    },
    {
      name: "Evilsoother",
      image: "e/e6/Constellation_Evilsoother",
      desc: (
        <>
          Throughout the duration of Guhua Sword: Raincutter, the{" "}
          <Green>DMG</Green> dealt by{" "}
          <Green>Guhua Sword: Fatal Rainscreen</Green> is increased by{" "}
          <Green b>50%</Green>.
        </>
      )
    },
    {
      name: "Embrace of Rain",
      image: "9/9b/Constellation_Embrace_of_Rain",
      desc: "Guhua Sword: Fatal Rainscreen"
    },
    {
      name: "Hence, Call Them My Own Verses",
      image: "9/91/Constellation_Hence%2C_Call_Them_My_Own_Verses",
      desc: (
        <>
          Activating 2 of Guhua Sword: Raincutter's sword rain attacks greatly
          enhances the third sword rain attack. On hit, the third sword rain
          attack also regenerates <Green b>3</Green> <Green>Energy</Green> for
          Xingqiu.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: () => Xingqiu.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Hydro DMG Bonus", 20)
    },
    {
      index: 1,
      src: "Constellation 4",
      desc: () => Xingqiu.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "ES.sMult", 50)
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => Xingqiu.constellation[1].debuff,
      isGranted: checkCons[2],
      addPntes: simpleAnTmaker("rdMult", "Hydro_rd", 15)
    }
  ]
};

export default Xingqiu;

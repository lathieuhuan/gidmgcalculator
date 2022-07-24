import { simpleAnTmaker } from "../../../calculators/helpers";
import { Green, pyroDmg } from "../../../styledCpns/DataDisplay";
import { CaStamina, doubleCooking, mediumPAs, PolearmDesc_5 } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Xiangling = {
  code: 21,
  name: "Xiangling",
  icon: "a/a0/Character_Xiangling_Thumb",
  sideIcon: "4/4a/Character_Xiangling_Side_Icon",
  rarity: 4,
  nation: "Liyue",
  vision: "Pyro",
  weapon: "Polearm",
  stats: [
    { "Base HP": 912, "Base ATK": 19, "Base DEF": 56 },
    { "Base HP": 2342, "Base ATK": 48, "Base DEF": 144 },
    { "Base HP": 3024, "Base ATK": 63, "Base DEF": 186 },
    { "Base HP": 4529, "Base ATK": 94, "Base DEF": 279 },
    {
      "Base HP": 5013,
      "Base ATK": 104,
      "Base DEF": 308,
      "Elemental Mastery": 24
    },
    {
      "Base HP": 5766,
      "Base ATK": 119,
      "Base DEF": 355,
      "Elemental Mastery": 24
    },
    {
      "Base HP": 6411,
      "Base ATK": 133,
      "Base DEF": 394,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 7164,
      "Base ATK": 148,
      "Base DEF": 441,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 7648,
      "Base ATK": 158,
      "Base DEF": 470,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 8401,
      "Base ATK": 174,
      "Base DEF": 517,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 8885,
      "Base ATK": 184,
      "Base DEF": 546,
      "Elemental Mastery": 72
    },
    {
      "Base HP": 9638,
      "Base ATK": 200,
      "Base DEF": 593,
      "Elemental Mastery": 72
    },
    {
      "Base HP": 10122,
      "Base ATK": 210,
      "Base DEF": 623,
      "Elemental Mastery": 96
    },
    {
      "Base HP": 10875,
      "Base ATK": 225,
      "Base DEF": 669,
      "Elemental Mastery": 96
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Dough-Fu",
      desc: PolearmDesc_5,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 42.05,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 42.14,
          multType: 1
        },
        {
          name: "3-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 26.06,
          multType: 1
        },
        {
          name: "4-Hit (1/4)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 14.1,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 71.04,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 121.69,
          multType: 1
        },
        CaStamina[25],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Guoba Attack",
      image: "a/a9/Talent_Guoba_Attack",
      desc: [
        {
          content: (
            <>
              Summons Guoba, who will continuously breathe fire at opponents,
              dealing AoE {pyroDmg}.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Flame DMG (1/4)",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 111.28,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "12s" }]
    },
    {
      type: "Elemental Burst",
      name: "Pyronado",
      image: "2/29/Talent_Pyronado",
      desc: [
        {
          content: (
            <>
              Displaying her mastery over both fire and polearms, Xiangling
              sends a Pyronado whirling around her.
              <br />
              The Pyronado will move with your character for the ability's
              duration, dealing {pyroDmg} to all opponents in its path.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "1-Hit Swing",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 72,
          multType: 2
        },
        {
          name: "2-Hit Swing",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 88,
          multType: 2
        },
        {
          name: "3-Hit Swing",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 109.6,
          multType: 2
        },
        {
          name: "Pyronado DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 112,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "10s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Crossfire",
      image: "3/3e/Talent_Crossfire",
      desc: (
        <>
          Increases the flame <Green>range</Green> of Guoba by{" "}
          <Green b>20%</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Beware, It's Super Hot!",
      image: "4/49/Talent_Beware%2C_It%27s_Super_Hot%21",
      get desc() {
        return (
          <>
            When Guoba Attack's effect ends, Guoba leaves a chili pepper on the
            spot where it disappeared. {this.buff}
          </>
        );
      },
      buff: (
        <>
          Picking up a chili pepper increases <Green>ATK</Green> by{" "}
          <Green b>10%</Green> for 10s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Chef de Cuisine",
      image: "4/4e/Talent_Chef_de_Cuisine",
      desc: doubleCooking("Xiangling", "ATK-boosting dish")
    }
  ],
  constellation: [
    {
      name: "Crispy Outside, Tender Inside",
      image: "7/78/Constellation_Crispy_Outside%2C_Tender_Inside",
      desc: (
        <>
          Opponents hit by Guoba's attacks have their <Green>Pyro RES</Green>{" "}
          reduced by <Green b>15%</Green> for 6s.
        </>
      )
    },
    {
      name: "Oil Meets Fire",
      image: "4/40/Constellation_Oil_Meets_Fire",
      desc: (
        <>
          The last attack in a Normal Attack sequence applies the Implode status
          onto the opponent for 2s. An explosion will occur once this duration
          ends, dealing <Green b>75%</Green> of Xiangling's <Green>ATK</Green>{" "}
          as AoE {pyroDmg}.
        </>
      )
    },
    {
      name: "Deepfry",
      image: "2/24/Constellation_Deepfry",
      desc: "Pyronado"
    },
    {
      name: "Slowbake",
      image: "7/7b/Constellation_Slowbake",
      desc: (
        <>
          Pyronado's <Green>duration</Green> is increased by{" "}
          <Green b>40%</Green>.
        </>
      )
    },
    {
      name: "Guoba Mad",
      image: "a/a2/Constellation_Guoba_Mad",
      desc: "Guoba Attack"
    },
    {
      name: "Condensed Pyronado",
      image: "8/8a/Constellation_Condensed_Pyronado",
      desc: (
        <>
          For the duration of Pyronado, all party members receive a{" "}
          <Green b>15%</Green> <Green>Pyro DMG Bonus</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 4 Passive Talent",
      desc: () => Xiangling.pasvTalents[1].buff,
      isGranted: checkAscs[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "ATK%", 10)
    },
    {
      index: 1,
      src: "Constellation 6",
      desc: () => Xiangling.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Pyro DMG Bonus", 15)
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 1",
      desc: () => Xiangling.constellation[0].desc,
      isGranted: checkCons[1],
      addPntes: simpleAnTmaker("rdMult", "Pyro_rd", 15)
    }
  ]
};

export default Xiangling;

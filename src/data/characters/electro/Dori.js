import { simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { Electro, Green } from "../../../styledCpns/DataDisplay";
import { CaStaminaClaymore, heavyPAs } from "../config";
import { checkCharMC, checkCons, makeTlBnes, xtraTlLv } from "../helpers";

const Dori = {
  code: 56,
  beta: true,
  name: "Dori",
  icon: "https://i.ibb.co/BfrvTMM/dori.png",
  sideIcon: "",
  rarity: 4,
  nation: "Sumeru",
  vision: "Electro",
  weapon: "Claymore",
  stats: [
    { "Base HP": 1039, "Base ATK": 19, "Base DEF": 61 },
    { "Base HP": 2670, "Base ATK": 48, "Base DEF": 156 },
    { "Base HP": 3447, "Base ATK": 62, "Base DEF": 201 },
    { "Base HP": 5163, "Base ATK": 93, "Base DEF": 301 },
    { "Base HP": 5715, "Base ATK": 103, "Base DEF": 333, "HP%": 6 },
    { "Base HP": 6573, "Base ATK": 118, "Base DEF": 384, "HP%": 6 },
    { "Base HP": 7309, "Base ATK": 131, "Base DEF": 427, "HP%": 12 },
    { "Base HP": 8168, "Base ATK": 147, "Base DEF": 477, "HP%": 12 },
    { "Base HP": 8719, "Base ATK": 157, "Base DEF": 509, "HP%": 12 },
    { "Base HP": 9577, "Base ATK": 172, "Base DEF": 559, "HP%": 12 },
    { "Base HP": 10129, "Base ATK": 182, "Base DEF": 591, "HP%": 18 },
    { "Base HP": 10987, "Base ATK": 198, "Base DEF": 641, "HP%": 18 },
    { "Base HP": 11539, "Base ATK": 208, "Base DEF": 673, "HP%": 24 },
    { "Base HP": 12397, "Base ATK": 223, "Base DEF": 723, "HP%": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Marvelous Sword-Dance (Modified)",
      desc: [],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 71.21,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: [33.94, 35.64],
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 95.29,
          multType: 1
        },
        {
          name: "Charged Attack Spinning",
          dmgTypes: ["CA", "Physical"],
          baseMult: 62.55,
          multType: 1
        },
        {
          name: "Charged Attack Final",
          dmgTypes: ["CA", "Physical"],
          baseMult: 113.09,
          multType: 1
        },
        ...CaStaminaClaymore,
        ...heavyPAs,
        {
          name: "Heal on Normal Attacks hit (C6)",
          baseSType: "HP",
          isHealing: true,
          baseMult: 0,
          multType: 2,
          conditional: true,
          getTlBnes: ({ char, selfMCs }) =>
            makeTlBnes(
              checkCharMC(Dori.buffs, char, selfMCs.BCs, 1),
              "mult",
              [0, 6],
              4
            )
        }
      ]
    },
    {
      type: "Elemental Skill",
      name: "Spirit-Warding Lamp: Troubleshooter Cannon",
      image: "",
      desc: [],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Troubleshooter Shot DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 156.24,
          multType: 2
        },
        {
          name: "After-Sales Service Round DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 33.48,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "9s" }]
    },
    {
      type: "Elemental Burst",
      name: "Alcazarzaray's Exactitude",
      image: "",
      desc: [],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Connector DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 15.88,
          multType: 2
        },
        {
          name: "Continuous Healing",
          baseSType: "HP",
          isHealing: true,
          baseMult: 5.34,
          multType: 2,
          baseFlat: 514,
          flatType: 3
        }
      ],
      otherStats: (lv) => [
        {
          name: "Energy Regeneration",
          value: Math.min(1.5 + Math.floor(lv / 2) * 0.1, 2)
        },
        { name: "Duration", value: "12s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "An Eye for Gold",
      image: "",
      desc: (
        <>
          After a character connected to the Lamp Spirit triggers an
          Electro-Charged, Superconduct, Overloaded, Quicken, Aggravate, or
          Spread reaction, the <Green>CD</Green> of Spirit-Warding Lamp:
          Troubleshooter Cannon is decreased by <Green b>1s</Green>.
          <br />
          This effect can be triggered once every 3s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Compound Interest",
      image: "",
      desc: (
        <>
          When the Troubleshooter Shots or After-Sales Service Rounds from
          Spirit-Warding Lamp: Troubleshooter Cannon hit opponents, Dori will
          restore <Green b>5</Green> <Green>Elemental Energy</Green> for every
          100% Energy Recharge possessed.
          <br />A maximum of <Green b>15</Green> <Green>Energy</Green> can be
          restored this way per Spirit-Warding Lamp: Troubleshooter Cannon.
        </>
      )
    },
    {
      type: "Passive",
      name: "Unexpected Order",
      image: "",
      desc: ""
    }
  ],
  constellation: [
    {
      name: "Additional Investment",
      image: "",
      desc: (
        <>
          The number of After-Sales Service Rounds created by Troubleshooter
          Shots is increased by <Green b>1</Green>.
        </>
      )
    },
    {
      name: "Special Franchise",
      image: "",
      desc: (
        <>
          When the Lamp Spirit heals the character it is connected to, it will
          fire a Jinni Toop from that character's position that deals{" "}
          <Green b>20%</Green> of <Green>Troubleshooter Shot's DMG</Green>.
        </>
      )
    },
    {
      name: "Value for Mora",
      image: "",
      desc: "Spirit-Warding Lamp: Troubleshooter Cannon"
    },
    {
      name: "Discretionary Supplement",
      image: "",
      get desc() {
        return (
          <>
            The character connected to the Lamp Spirit will obtain the following
            buffs based on their current HP and Energy:
            <br />
            When their HP is lower than 50%, they gain <Green b>50%</Green>{" "}
            <Green>Incoming Healing</Green> Bonus.
            <br />
            When their Energy {this.buff}.
          </>
        );
      },
      buff: (
        <>
          is less than 50%, they gain <Green b>30%</Green>{" "}
          <Green>Energy Recharge</Green>.
        </>
      )
    },
    {
      name: "Wonders Never Cease",
      image: "",
      desc: "Alcazarzaray's Exactitude"
    },
    {
      name: "Sprinkling Weight",
      image: "",
      desc: (
        <>
          Dori gains the following effects for 3s after using Spirit-Warding
          Lamp: Troubleshooter Cannon:
          <br />• <Electro>Electro</Electro> Infusion.
          <br />• When Normal Attacks hit opponents, all party members will heal
          HP equivalent to <Green b>4%</Green> of Dori's <Green>Max HP</Green>.
          This type of healing can occur once every 0.1s.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Constellation 4",
      desc: () => (
        <>
          When Energy of the character connected to the Lamp Spirit
          {Dori.constellation[3].buff}
        </>
      ),
      isGranted: checkCons[4],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Energy Recharge", 30)
    },
    {
      index: 1,
      src: "Constellation 6",
      desc: () => Dori.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self",
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: true
    }
  ]
};

export default Dori;

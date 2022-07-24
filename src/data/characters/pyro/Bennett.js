import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { applyPct, getFinalTlLv, round2 } from "../../../helpers";
import { Green, Pyro, pyroDmg, Red } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, SwordDesc } from "../config";
import { checkCharMC, checkCons, makeTlBnes, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const Bennett = {
  code: 19,
  name: "Bennett",
  icon: "7/7b/Character_Bennett_Thumb",
  sideIcon: "3/3c/Character_Bennett_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Pyro",
  weapon: "Sword",
  stats: [
    { "Base HP": 1039, "Base ATK": 16, "Base DEF": 65 },
    { "Base HP": 2670, "Base ATK": 41, "Base DEF": 166 },
    { "Base HP": 3447, "Base ATK": 53, "Base DEF": 214 },
    { "Base HP": 5163, "Base ATK": 80, "Base DEF": 321 },
    {
      "Base HP": 5715,
      "Base ATK": 88,
      "Base DEF": 356,
      "Energy Recharge": 6.7
    },
    {
      "Base HP": 6573,
      "Base ATK": 101,
      "Base DEF": 409,
      "Energy Recharge": 6.7
    },
    {
      "Base HP": 7309,
      "Base ATK": 113,
      "Base DEF": 455,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 8168,
      "Base ATK": 126,
      "Base DEF": 508,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 8719,
      "Base ATK": 134,
      "Base DEF": 542,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 9577,
      "Base ATK": 148,
      "Base DEF": 596,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 10129,
      "Base ATK": 156,
      "Base DEF": 630,
      "Energy Recharge": 20
    },
    {
      "Base HP": 10987,
      "Base ATK": 169,
      "Base DEF": 684,
      "Energy Recharge": 20
    },
    {
      "Base HP": 11539,
      "Base ATK": 178,
      "Base DEF": 718,
      "Energy Recharge": 26.7
    },
    {
      "Base HP": 12397,
      "Base ATK": 191,
      "Base DEF": 771,
      "Energy Recharge": 26.7
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Strike of Fortune",
      desc: SwordDesc,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 44.55,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 42.7,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 54.61,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 59.68,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 71.9,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: [55.9, 60.72],
          multType: 1
        },
        CaStamina[20],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Passion Overload",
      image: "6/66/Talent_Passion_Overload",
      desc: [
        {
          heading: "Press ",
          content: <>A single, swift flame strike that deals {pyroDmg}.</>
        },
        {
          heading: "Hold",
          content: (
            <>
              Charges up, resulting in different effects when unleashed based on
              the Charge Level.
              <br />• Level 1: Strikes twice, dealing {pyroDmg} and launching
              opponents.
              <br />• Level 2: Unleashes 3 consecutive attacks that deal
              impressive {pyroDmg}, but the last attack triggers an explosion
              that launches both Bennett and the enemy.
              <br />
              Bennett takes no damage from being launched.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Press",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 137.6,
          multType: 2
        },
        {
          name: "Charge Level 1",
          dmgTypes: ["ES", "Elemental"],
          baseMult: [84, 92],
          multType: 2
        },
        {
          name: "Charge Level 2",
          dmgTypes: ["ES", "Elemental"],
          baseMult: [88, 96],
          multType: 2
        },
        {
          name: "Explosion",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 132,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "5/7.5/10s" }]
    },
    {
      type: "Elemental Burst",
      name: "Fantastic Voyage",
      image: "a/a2/Talent_Fantastic_Voyage",
      desc: [
        {
          content: (
            <>
              Bennett performs a jumping attack that deals {pyroDmg}, creating
              an Inspiration Field.
            </>
          )
        },
        {
          heading: "Inspiration Field",
          content: (
            <>
              • If the health of a character within the AoE is equal to or falls
              below 70%, their health will continuously regenerate. The amount
              of HP restored scales off Bennett's Max HP.
              <br />• If the health of a character within the AoE is higher than
              70%, they gain an ATK Bonus that is based on Bennett's Base ATK.
              <br />• Imbues characters within the AoE with Pyro.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 232.8,
          multType: 2
        },
        {
          name: "Regeneration",
          isHealing: true,
          baseSType: "HP",
          baseMult: 6,
          multType: 2,
          baseFlat: 577,
          flatType: 3
        },
        {
          name: "ATK Bonus",
          baseSType: "Base ATK",
          baseMult: 56,
          multType: 2,
          getTlBnes: ({ char, selfMCs }) =>
            makeTlBnes(
              checkCharMC(Bennett.buffs, char, selfMCs.BCs, 1),
              "mult",
              [0, 1],
              20
            )
        }
      ],
      otherStats: () => [
        { name: "Durtion", value: "12s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Rekindle",
      image: "7/77/Talent_Rekindle",
      desc: (
        <>
          Decreases Passion Overload's <Green>CD</Green> by <Green b>20%</Green>
          .
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Fearnaught",
      image: "1/1a/Talent_Fearnaught",
      desc: (
        <>
          Within the area created by Fantastic Voyage, Passion Overload takes on
          the following effects:
          <br />• <Green>CD</Green> is reduced by <Green b>50%</Green>.
          <br />• Bennett will not be launched by the effects of Charge Level 2.
        </>
      )
    },
    {
      type: "Passive",
      name: "It Should Be Safe...",
      image: "2/2a/Talent_It_Should_Be_Safe...",
      desc: (
        <>
          When dispatched on an <Green>expedition</Green> in Mondstadt,{" "}
          <Green>time consumed</Green> is reduced by <Green b>25%</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Grand Expectation",
      image: "c/c0/Constellation_Grand_Expectation",
      get desc() {
        return (
          <>
            Fantastic Voyage's ATK increase no longer has an HP restriction, and
            {this.buff}
          </>
        );
      },
      buff: (
        <>
          gains an additional <Green b>20%</Green> of Bennett's{" "}
          <Green>Base ATK</Green>.
        </>
      )
    },
    {
      name: "Impasse Conqueror",
      image: "8/87/Constellation_Impasse_Conqueror",
      desc: (
        <>
          When Bennett's HP falls below 70%, his <Green>Energy Recharge</Green>{" "}
          is increased by <Green b>30%</Green>.
        </>
      )
    },
    {
      name: "Unstoppable Fervor",
      image: "e/ed/Constellation_Unstoppable_Fervor",
      desc: "Passion Overload"
    },
    {
      name: "Unexpected Odyssey",
      image: "0/0e/Constellation_Unexpected_Odyssey",
      desc: (
        <>
          Using a Normal Attack when executing the second attack of Passion
          Overload's Charge Level 1 allows an additional attack to be performed.
          <br />
          This additional attack does <Green b>135%</Green> of the{" "}
          <Green>second attack's DMG</Green>.
        </>
      )
    },
    {
      name: "True Explorer",
      image: "3/39/Constellation_True_Explorer",
      desc: "Fantastic Voyage"
    },
    {
      name: "Fire Ventures with Me",
      image: "3/3a/Constellation_Fire_Ventures_With_Me",
      desc: (
        <>
          Sword, Claymore, Polearm characters inside Fantastic Voyage's radius
          gain a <Green b>15%</Green> <Green>Pyro DMG Bonus</Green> and their
          weapons are <Green>infused</Green> with <Pyro>Pyro</Pyro>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: ({ toSelf, inputs }) => (
        <>
          The character within its AoE gains an <Green>ATK Bonus</Green> that is
          based on Bennett's <Green>Base ATK</Green>.{" "}
          {!toSelf && (
            <Red>ATK Bonus: {Bennett.buffs[0].bnValue(inputs)[0]}.</Red>
          )}
        </>
      ),
      isGranted: () => true,
      affect: "party",
      labels: ["Base ATK", "Elemental Burst Level", "Constellation 1"],
      inputs: [0, 1, false],
      inputTypes: ["text", "text", "check"],
      maxs: [9999, 13, null],
      addBnes: (obj) => {
        const args = obj.toSelf
          ? [
              obj.ATTRs["Base ATK"],
              getFinalTlLv(obj.char, Bennett.actvTalents[2], obj.partyData),
              checkCharMC(Bennett.buffs, obj.char, obj.charBCs, 1)
            ]
          : obj.inputs;
        const result = Bennett.buffs[0].bnValue(args);
        const desc = `${obj.tkDesc} / Lv. ${result[1]}`;
        addAndTrack(desc, obj.ATTRs, "ATK", result[0], obj.tracker);
      },
      bnValue: ([baseATK, level, boosted]) => {
        let tlMult = 56 * tlLvMults[2][level];
        let desc = level;
        if (boosted) {
          tlMult += 20;
          desc += ` / C1: 20% extra`;
        }
        return [
          applyPct(baseATK, tlMult),
          desc + ` / ${round2(tlMult)}% of ${baseATK} Base ATK`
        ];
      }
    },
    {
      index: 1,
      src: "Constellation 1",
      desc: () => (
        <>Fantastic Voyage's ATK increase {Bennett.constellation[0].buff}</>
      ),
      isGranted: (char) => char.constellation >= 1,
      affect: "self"
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Bennett.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Pyro DMG Bonus", 15),
      canInfuse: (charData) =>
        ["Sword", "Claymore", "Polearm"].includes(charData.weapon),
      infuseElmt: "Pyro",
      infuseRange: NAs,
      canBeOverrided: true
    }
  ]
};

export default Bennett;

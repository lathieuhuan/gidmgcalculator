import { addAndTrack } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { getFinalTlLv, round1, round2 } from "../../../helpers";
import {
  Electro,
  electroDmg,
  Green,
  Red
} from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  mediumPAs,
  PolearmNaDesc_5,
  PolearmUpCaDesc,
  SwordPaDesc
} from "../config";
import { checkAscs, checkCons, findInput, modIsOn, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

export const isshinBnMults = [
  0,
  0.73,
  0.78,
  0.84,
  0.91,
  0.96,
  1.02,
  1.09,
  1.16,
  1.23,
  1.31,
  1.38,
  1.45,
  1.54
];

const countResolve = (energyCost, lv) =>
  Math.round(energyCost * Math.min(Math.ceil(14.5 + lv * 0.5), 20)) / 100;

const EBtlBnes = (index) => ({ char, selfMCs: { BCs }, partyData }) => {
  if (modIsOn(BCs, 1)) {
    const value = modValue.EB(char, BCs, partyData).map(round2);
    if (value[0]) {
      return {
        mult: {
          desc: `Bonus from ${value[0]} Resolve, each gave ${value[index]}% extra multiplier`,
          value: round2(value[0] * value[index])
        }
      };
    }
  }
};

const modValue = {
  ES: (toSelf, char, { EBcost }, inputs, partyData) => {
    const level = toSelf
      ? getFinalTlLv(char, Raiden.actvTalents[1], partyData)
      : inputs[0];
    const mult = Math.min(0.21 + level / 100, 0.3);
    return [
      round1(EBcost * mult),
      `${level} / ${round2(mult)}% * ${EBcost} Energy Cost`
    ];
  },
  EB: (char, charBCs, partyData) => {
    const level = getFinalTlLv(char, Raiden.actvTalents[2], partyData);
    let stacks = countResolve(findInput(charBCs, 1, 0), level);
    if (checkCons[1](char) && modIsOn(charBCs, 3)) {
      stacks += modValue.cons1(char, charBCs, partyData, level);
    }
    stacks = Math.min(round2(stacks), 60);
    return [stacks, 3.89 * tlLvMults[2][level], isshinBnMults[level]];
  },
  ascs4: (ATTRs) => {
    return round1((ATTRs["Energy Recharge"] - 100) * 0.4);
  },
  cons1: (char, charBCs, partyData, EBlevel) => {
    const electroEnergy = findInput(charBCs, 3, 0);
    const otherEC = findInput(charBCs, 1, 0) - electroEnergy;
    if (otherEC < 0) return 0;
    const level =
      EBlevel || getFinalTlLv(char, Raiden.actvTalents[2], partyData);
    const electroResolve = countResolve(electroEnergy, level);
    const otherResolve = countResolve(otherEC, level);
    return round1(electroResolve * 0.8 + otherResolve * 0.2);
  }
};

const Raiden = {
  code: 40,
  name: "Raiden Shogun",
  GOOD: "RaidenShogun",
  icon: "5/52/Character_Raiden_Shogun_Thumb",
  sideIcon: "9/95/Character_Raiden_Shogun_Side_Icon",
  rarity: 5,
  nation: "Inazuma",
  vision: "Electro",
  weapon: "Polearm",
  stats: [
    { "Base HP": 1005, "Base ATK": 26, "Base DEF": 61 },
    { "Base HP": 2606, "Base ATK": 68, "Base DEF": 159 },
    { "Base HP": 3468, "Base ATK": 91, "Base DEF": 212 },
    { "Base HP": 5189, "Base ATK": 136, "Base DEF": 317 },
    { "Base HP": 5801, "Base ATK": 152, "Base DEF": 355, "Energy Recharge": 8 },
    { "Base HP": 6675, "Base ATK": 174, "Base DEF": 408, "Energy Recharge": 8 },
    {
      "Base HP": 7491,
      "Base ATK": 196,
      "Base DEF": 458,
      "Energy Recharge": 16
    },
    {
      "Base HP": 8373,
      "Base ATK": 219,
      "Base DEF": 512,
      "Energy Recharge": 16
    },
    {
      "Base HP": 8985,
      "Base ATK": 235,
      "Base DEF": 549,
      "Energy Recharge": 16
    },
    {
      "Base HP": 9875,
      "Base ATK": 258,
      "Base DEF": 604,
      "Energy Recharge": 16
    },
    {
      "Base HP": 10487,
      "Base ATK": 274,
      "Base DEF": 641,
      "Energy Recharge": 24
    },
    {
      "Base HP": 11388,
      "Base ATK": 298,
      "Base DEF": 696,
      "Energy Recharge": 24
    },
    {
      "Base HP": 12000,
      "Base ATK": 314,
      "Base DEF": 734,
      "Energy Recharge": 32
    },
    {
      "Base HP": 12907,
      "Base ATK": 337,
      "Base DEF": 789,
      "Energy Recharge": 32
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Origin",
      desc: [PolearmNaDesc_5, PolearmUpCaDesc, SwordPaDesc],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 39.65,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 39.73,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 49.88,
          multType: 1
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 28.98,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 65.45,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 99.59,
          multType: 1
        },
        CaStamina[25],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Transcendence: Baleful Omen",
      image: "3/3c/Talent_Transcendence_Baleful_Omen",
      desc: [
        {
          content: (
            <>
              The Raiden Shogun unveils a shard of her Euthymia, dealing{" "}
              {electroDmg} to nearby opponents, and granting nearby party
              members the Eye of Stormy Judgment.
            </>
          )
        },
        {
          heading: "Eye of Stormy Judgment",
          get content() {
            return (
              <>
                • When characters with this buff attack and deal DMG to
                opponents, the Eye will unleash a coordinated attack, dealing
                AoE {electroDmg} at the opponent's position.
                <br />• {this.buff}
              </>
            );
          },
          buff: (
            <>
              Eye of Stormy Judgment increases{" "}
              <Green>Elemental Burst DMG</Green> based on the{" "}
              <Green>Energy Cost</Green> of the Elemental Burst during the Eye's
              duration.
            </>
          )
        },
        {
          content: (
            <>
              The Eye can initiate one coordinated attack every 0.9s per party.
              <br />
              Coordinated attacks generated by characters not controlled by you
              deal 20% of the normal DMG.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 117.2,
          multType: 2
        },
        {
          name: "Coordinated ATK DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 42,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        { name: "Duration", value: "25s" },
        {
          name: "Elemental Burst DMG Bonus",
          value: Math.min(21 + lv, 30) / 100 + "% per Energy"
        },
        { name: "CD", value: "10s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Secret Art: Musou Shinsetsu",
      image: "e/e0/Talent_Secret_Art_Musou_Shinsetsu",
      desc: [
        {
          get content() {
            return (
              <>
                Gathering truths unnumbered and wishes uncounted, the Raiden
                Shogun unleashes the Musou no Hitotachi and deals AoE{" "}
                {electroDmg}, using Musou Isshin in combat for a certain
                duration afterward. {this.buff}
              </>
            );
          },
          buff: (
            <>
              The DMG dealt by Musou no Hitotachi and Musou Isshin's attacks
              will be increased based on the number of Chakra Desiderata's
              Resolve stacks consumed when this skill is used.
            </>
          )
        },
        {
          heading: "Musou Isshin",
          get content() {
            return (
              <>
                While in this state, the Raiden Shogun will wield her tachi in
                battle, while her {this.infusion}. When such attacks hit
                opponents, she will regenerate Energy for all nearby party
                members. Energy can be restored this way once every 1s, and this
                effect can be triggered <Green b>5</Green> <Green>times</Green>{" "}
                throughout this skill's duration.
                <br />
                While in this state, the Raiden Shogun's resistance to
                interruption is increased, and she is immune to Electro-Charged
                reaction DMG.
                <br />
                While Musou Isshin is active, the Raiden Shogun's Normal,
                Charged, and Plunging Attack DMG will be considered{" "}
                <Green>Elemental Burst DMG</Green>.
              </>
            );
          },
          infusion: (
            <>
              Normal, Charged, and Plunging Attacks will be{" "}
              <Green>infused</Green> with {electroDmg}, which cannot be
              overridden.
            </>
          )
        },
        {
          content: (
            <>
              The effects of Musou Isshin will be cleared when the Raiden Shogun
              leaves the field.
            </>
          )
        },
        {
          name: "Chakra Desiderata",
          content: (
            <>
              When nearby party members (excluding the Raiden Shogun herself)
              use their Elemental Bursts, the Raiden Shogun will build up
              Resolve stacks based on the Energy Cost of these Elemental Bursts.
              <br />
              The <Green>maximum number of Resolve stacks</Green> is{" "}
              <Green b>60</Green>.
            </>
          )
        },
        {
          content: (
            <>
              The Resolve gained by Chakra Desiderata will be cleared 300s after
              the Raiden Shogun leaves the field.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Musou no Hitotachi",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 400.8,
          multType: 2,
          getTlBnes: EBtlBnes(1)
        },
        {
          name: "Resolve Bonus",
          noCalc: true,
          getValue: (lv) =>
            round2(3.89 * tlLvMults[2][lv]) +
            "% Initial/" +
            isshinBnMults[lv] +
            "% ATK DMG per Stack"
        },
        {
          name: "Resolve Stacks Gained",
          noCalc: true,
          getValue: (lv) =>
            Math.min(Math.ceil(14.5 + lv * 0.5), 20) / 100 +
            " per Energy Consumed"
        },
        {
          name: "1-Hit",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 44.74,
          multType: 4,
          getTlBnes: EBtlBnes(2)
        },
        {
          name: "2-Hit",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 43.96,
          multType: 4,
          getTlBnes: EBtlBnes(2)
        },
        {
          name: "3-Hit",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 53.82,
          multType: 4,
          getTlBnes: EBtlBnes(2)
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 30.89,
          multType: 4,
          getTlBnes: EBtlBnes(2)
        },
        {
          name: "5-Hit",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 73.94,
          multType: 4,
          getTlBnes: EBtlBnes(2)
        },
        {
          name: "Charged Attack",
          dmgTypes: ["EB", "Elemental"],
          baseMult: [61.6, 74.36],
          multType: 4,
          getTlBnes: EBtlBnes(2)
        },
        CaStamina[20],
        {
          name: "Plunge DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 63.93,
          multType: 1,
          getTlBnes: EBtlBnes(2)
        },
        {
          name: "Low Plunge",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 127.84,
          multType: 1,
          getTlBnes: EBtlBnes(2)
        },
        {
          name: "High Plunge",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 159.68,
          multType: 1,
          getTlBnes: EBtlBnes(2)
        }
      ],
      otherStats: (lv) => [
        {
          name: "Musshou Isshin Energy Restoration",
          value: Math.min(15 + lv, 25) / 10
        },
        { name: "Musshou Isshin Duration", value: "7s" },
        { name: "CD", value: "18s" }
      ],
      energyCost: 90
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Wishes Unnumbered",
      image: "b/bc/Talent_Wishes_Unnumbered",
      desc: (
        <>
          When nearby party members gain Elemental Orbs or Particles, Chakra
          Desiderata gains <Green b>2</Green> <Green>Resolve stacks</Green>.
          <br />
          This effect can occur once every 3s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Enlightened One",
      image: "b/b7/Talent_Enlightened_One",
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
          Each <Green b>1%</Green> above 100% <Green>Energy Recharge</Green>{" "}
          that the Raiden Shogun possesses grants her:
        </>,
        <>
          <br />• <Green b>0.6%</Green>{" "}
          <Green>greater Energy restoration</Green> from Musou Isshin
        </>,
        <>
          <br />• <Green b>0.4%</Green> <Green>Electro DMG Bonus</Green>.
        </>
      ]
    },
    {
      type: "Passive",
      name: "All-Preserver",
      image: "0/0e/Talent_All-Preserver",
      desc: (
        <>
          <Green>Mora</Green> expended when <Green>ascending Swords</Green> and{" "}
          <Green>Polearms</Green> is decreased by <Green b>50%</Green>.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Ominous Inscription",
      image: "2/24/Constellation_Ominous_Inscription",
      get desc() {
        return (
          <>Chakra Desiderata will gather Resolve even faster. {this.buff}</>
        );
      },
      buff: (
        <>
          When <Electro>Electro</Electro> characters use their Elemental Bursts,
          the <Green>Resolve</Green> gained is increased by <Green b>80%</Green>
          . When characters of other Elemental Types use their Elemental Bursts,
          the <Green>Resolve</Green> gained is increased by <Green b>20%</Green>
          .
        </>
      )
    },
    {
      name: "Steelbreaker",
      image: "4/4e/Constellation_Steelbreaker",
      desc: (
        <>
          While using Musou no Hitotachi and in the Musou Isshin state applied
          by Secret Art: Musou Shinsetsu, the Raiden Shogun's attacks ignore{" "}
          <Green b>60%</Green> of opponents' <Green>DEF</Green>.
        </>
      )
    },
    {
      name: "Shinkage Bygones",
      image: "4/4d/Constellation_Shinkage_Bygones",
      desc: "Secret Art: Musou Shinsetsu"
    },
    {
      name: "Pledge of Propriety",
      image: "c/c4/Constellation_Pledge_of_Propriety",
      desc: (
        <>
          When the Musou Isshin state expires, all nearby party members
          (excluding the Raiden Shogun) gain <Green b>30%</Green>{" "}
          <Green>bonus ATK</Green> for 10s.
        </>
      )
    },
    {
      name: "Shogun's Descent",
      image: "8/85/Constellation_Shogun%27s_Descent",
      desc: "Transcendence: Baleful Omen"
    },
    {
      name: "Wishbearer",
      image: "5/5e/Constellation_Wishbearer",
      desc: (
        <>
          While in the Musou Isshin state applied by Secret Art: Musou
          Shinsetsu, attacks by the Raiden Shogun that are considered part of
          her Elemental Burst will decrease all nearby party members' (not
          including the Raiden Shogun herself) Elemental Burst CD by 1s when
          they hit opponents.
          <br />
          This effect can trigger once every 1s and can trigger a total of 5
          times during Musou Isshin's duration.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: ({ toSelf, char, charData, inputs, partyData }) => (
        <>
          {Raiden.actvTalents[1].desc[1].buff}{" "}
          <Red>
            Elemental Burst DMG Bonus:{" "}
            {modValue.ES(toSelf, char, charData, inputs, partyData)[0]}
            %.
          </Red>
        </>
      ),
      isGranted: () => true,
      affect: "party",
      labels: ["Elemental Skill Level"],
      inputs: [1],
      inputTypes: ["text"],
      maxs: [13],
      addBnes: (obj) => {
        const { toSelf, char, charData, inputs, partyData } = obj;
        const result = modValue.ES(toSelf, char, charData, inputs, partyData);
        const desc = `${obj.tkDesc} / Lv. ${result[1]}`;
        addAndTrack(desc, obj.hitBnes, "EB.pct", result[0], obj.tracker);
      }
    },
    {
      index: 1,
      src: "Elemental Burst",
      desc: ({ char, charBCs, partyData }) => {
        return (
          <>
            {Raiden.actvTalents[2].desc[0].buff}{" "}
            <Red>
              Total Resolve: {modValue.EB(char, charBCs, partyData)[0]}.
            </Red>
            <br />
            {Raiden.actvTalents[2].desc[1].infusion}
          </>
        );
      },
      isGranted: () => true,
      affect: "self",
      selfLabels: ["Total Energy Spent"],
      inputs: [0],
      inputTypes: ["text"],
      maxs: [999],
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: false
    },
    {
      index: 2,
      src: "Ascension 4 Passive Talent",
      desc: ({ ATTRs }) => (
        <>
          {Raiden.pasvTalents[1].lines[0]}
          {Raiden.pasvTalents[1].lines[2]}{" "}
          <Red>Electro DMG Bonus: {modValue.ascs4(ATTRs)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: ({ ATTRs, tkDesc, tracker }) => {
        const bnValue = modValue.ascs4(ATTRs);
        addAndTrack(tkDesc, ATTRs, "Electro DMG Bonus", bnValue, tracker);
      }
    },
    {
      index: 3,
      src: "Constellation 1",
      desc: ({ char, charBCs, partyData }) => (
        <>
          {Raiden.constellation[0].buff}{" "}
          <Red>Extra Resolve: {modValue.cons1(char, charBCs, partyData)}.</Red>
        </>
      ),
      isGranted: checkCons[1],
      affect: "self",
      selfLabels: ["Energy Spent by Electro Characters (part of total)"],
      inputs: [0],
      inputTypes: ["text"],
      maxs: [999]
    },
    {
      index: 4,
      src: "Constellation 4",
      desc: () => Raiden.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "teammates",
      addBnes: ({ ATTRs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, ATTRs, "ATK%", 30, tracker);
      }
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 2",
      desc: () => Raiden.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "self",
      addPntes: ({ rdMult, tkDesc, tracker }) => {
        const fields = ["NA", "CA", "PA", "ES", "EB"].map((t) => `${t}_ig`);
        addAndTrack(tkDesc, rdMult, fields, 60, tracker);
      }
    }
  ]
};

export default Raiden;

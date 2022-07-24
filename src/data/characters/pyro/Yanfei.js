import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { round1, getFinalTlLv } from "../../../helpers";
import { Green, pyroDmg } from "../../../styledCpns/DataDisplay";
import { CaStamina, CatalystPaDesc, lightPAs_Catalyst } from "../config";
import { checkAscs, checkCons, makeTlBnes, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const Yanfei = {
  code: 34,
  name: "Yanfei",
  icon: "1/1f/Character_Yanfei_Thumb",
  sideIcon: "4/4c/Character_Yanfei_Side_Icon",
  rarity: 4,
  nation: "Liyue",
  vision: "Pyro",
  weapon: "Catalyst",
  stats: [
    { "Base HP": 784, "Base ATK": 20, "Base DEF": 49 },
    { "Base HP": 2014, "Base ATK": 52, "Base DEF": 126 },
    { "Base HP": 2600, "Base ATK": 67, "Base DEF": 163 },
    { "Base HP": 3894, "Base ATK": 100, "Base DEF": 244 },
    { "Base HP": 4311, "Base ATK": 111, "Base DEF": 271, "Pyro DMG Bonus": 6 },
    { "Base HP": 4959, "Base ATK": 127, "Base DEF": 311, "Pyro DMG Bonus": 6 },
    { "Base HP": 5514, "Base ATK": 141, "Base DEF": 346, "Pyro DMG Bonus": 12 },
    { "Base HP": 6161, "Base ATK": 158, "Base DEF": 387, "Pyro DMG Bonus": 12 },
    { "Base HP": 6578, "Base ATK": 169, "Base DEF": 413, "Pyro DMG Bonus": 12 },
    { "Base HP": 7225, "Base ATK": 185, "Base DEF": 453, "Pyro DMG Bonus": 12 },
    { "Base HP": 7641, "Base ATK": 196, "Base DEF": 480, "Pyro DMG Bonus": 18 },
    { "Base HP": 8289, "Base ATK": 213, "Base DEF": 520, "Pyro DMG Bonus": 18 },
    { "Base HP": 8705, "Base ATK": 223, "Base DEF": 546, "Pyro DMG Bonus": 24 },
    { "Base HP": 9352, "Base ATK": 240, "Base DEF": 587, "Pyro DMG Bonus": 24 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Seal of Approval",
      desc: [
        {
          heading: "NA",
          content: (
            <>
              Shoots fireballs that deal up to three counts of {pyroDmg}.
              <br />
              When Yanfei's Normal Attacks hit enemies, they will grant her a
              single Scarlet Seal. Yanfei may possess a maximum of 3 Scarlet
              Seals, and each time this effect is triggered, the duration of
              currently possessed Scarlet Seals will refresh.
              <br />
              Each Scarlet Seal will decrease Yanfei's Stamina consumption and
              will disappear when she leaves the field.
            </>
          )
        },
        {
          heading: "CA",
          content: (
            <>
              Consumes Stamina and all Scarlet Seals before dealing AoE{" "}
              {pyroDmg} to opponents after a short casting time.
              <br />
              This Charged Attack's AoE and DMG will increase according to the
              amount of Scarlet Seals consumed.
            </>
          )
        },
        CatalystPaDesc("Pyro", "Yanfei")
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 58.34,
          multType: 2
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 52.13,
          multType: 2
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Elemental"],
          baseMult: 76.01,
          multType: 2
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 98.23,
          multType: 2
        },
        {
          name: "1-Seal Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 115.56,
          multType: 2
        },
        {
          name: "2-Seal Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 132.9,
          multType: 2
        },
        {
          name: "3-Seal Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 150.23,
          multType: 2
        },
        {
          name: "4-Seal Charged Attack",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 167.57,
          multType: 2
        },
        {
          name: "Extra Hit (A4)",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 0,
          multType: 2,
          conditional: true,
          getTlBnes: ({ char }) =>
            makeTlBnes(checkAscs[4](char), "mult", [1, 4], 80)
        },
        CaStamina[50],
        {
          name: "Scarlet Seal Stamina Consumption Decrease",
          noCalc: true,
          getValue: () => "15% per Seal"
        },
        { name: "Scarlet Seal Duration", noCalc: true, getValue: () => "10s" },
        ...lightPAs_Catalyst
      ]
    },
    {
      type: "Elemental Skill",
      name: "Signed Edict",
      image: "a/a3/Talent_Signed_Edict",
      desc: [
        {
          content: (
            <>
              Summons blistering flames that deal AoE {pyroDmg}.
              <br />
              Opponents hit by the flames will grant Yanfei the maximum number
              of Scarlet Seals.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 169.6,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "9s" }]
    },
    {
      type: "Elemental Burst",
      name: "Done Deal",
      image: "9/96/Talent_Done_Deal",
      desc: [
        {
          content: (
            <>
              Triggers a spray of intense flames that rush at nearby opponents,
              dealing AoE {pyroDmg}, granting Yanfei the maximum number of
              Scarlet Seals, and applying Brilliance to her.
            </>
          )
        },
        {
          heading: "Brilliance",
          get content() {
            return (
              <>
                Has the following effects:
                <br />• Grants Yanfei a Scarlet Seal at fixed intervals.
                <br />• {this.buff}.
                <br />
                The effects of Brilliance will end if Yanfei leaves the field or
                falls in battle.
              </>
            );
          },
          buff: (
            <>
              Increases the <Green>DMG</Green> dealt by her{" "}
              <Green>Charged Attacks</Green>
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 182.4,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        { name: "Scarlet Seal Grant Interval", value: "1s" },
        {
          name: "Charged Attack DMG Bonus",
          value: round1(33.4 * tlLvMults[5][lv]) + "%"
        },
        { name: "Duration", value: "15s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Proviso",
      image: "7/73/Talent_Proviso",
      get desc() {
        return (
          <>
            {this.buff} When a Charged Attack is used again during the effect's
            duration, it will dispel the previous effect.
          </>
        );
      },
      buff: (
        <>
          When Yanfei's Charged Attack consumes Scarlet Seals, each Scarlet Seal
          will increase her <Green>Pyro DMG Bonus</Green> by <Green b>5%</Green>
          . This effect lasts for 6s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Blazing Eye",
      image: "1/19/Talent_Blazing_Eye",
      desc: (
        <>
          When Yanfei's Charged Attack deals a CRIT Hit to opponents, she will
          deal an additional instance of AoE {pyroDmg} equal to{" "}
          <Green b>80%</Green> of her <Green>ATK</Green>. This DMG counts as
          Charged Attack DMG.
        </>
      )
    },
    {
      type: "Passive",
      name: "Encyclopedic Expertise	",
      image: "0/08/Talent_Encyclopedic_Expertise",
      desc: (
        <>
          Displays the location of nearby <Green>resources</Green> unique to{" "}
          <Green>Liyue</Green> on the mini-map.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "The Law Knows No Kindness",
      image: "7/79/Constellation_The_Law_Knows_No_Kindness",
      desc: (
        <>
          When Yanfei uses her Charged Attack, each existing Scarlet Seal
          additionally reduces the <Green>stamina cost</Green> of this{" "}
          <Green>Charged Attack</Green> by <Green b>10%</Green> and increases
          resistance against interruption during its release.
        </>
      )
    },
    {
      name: "Right of Final Interpretation",
      image: "e/e2/Constellation_Right_of_Final_Interpretation",
      desc: (
        <>
          Increases Yanfei's <Green>Charged Attack CRIT Rate</Green> by{" "}
          <Green b>20%</Green> against enemies below 50% HP.
        </>
      )
    },
    {
      name: "Samadhi Fire-Forged",
      image: "e/e4/Constellation_Samadhi_Fire-Forged",
      desc: "Signed Edict"
    },
    {
      name: "Supreme Amnesty",
      image: "5/58/Constellation_Supreme_Amnesty",
      desc: (
        <>
          When Done Deal is used:
          <br />
          Creates a <Green>shield</Green> that absorbs up to{" "}
          <Green b>45%</Green> of Yanfei's <Green>Max HP</Green> for 15s.
          <br />
          This shield absorbs Pyro DMG 250% more effectively.
        </>
      )
    },
    {
      name: "Abiding Affidavit",
      image: "9/9f/Constellation_Abiding_Affidavit",
      desc: "Done Deal"
    },
    {
      name: "Extra Clause",
      image: "c/c5/Constellation_Extra_Clause",
      desc: (
        <>
          Increases the <Green>maximum</Green> number of{" "}
          <Green>Scarlet Seals</Green> by <Green b>1</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 3,
      src: "Elemental Burst",
      desc: ({ char, partyData }) => (
        <>
          {Yanfei.actvTalents[2].desc[1].buff} by{" "}
          <Green b>{Yanfei.buffs[0].bnValue(char, partyData)}%</Green>.
        </>
      ),
      isGranted: () => true,
      affect: "self",
      addBnes: ({ hitBnes, char, partyData, tkDesc, tracker }) => {
        const bnValue = Yanfei.buffs[0].bnValue(char, partyData);
        addAndTrack(tkDesc, hitBnes, "CA.pct", bnValue, tracker);
      },
      bnValue: (char, partyData) => {
        const level = getFinalTlLv(char, Yanfei.actvTalents[2], partyData);
        return round1(33.4 * tlLvMults[5][level]);
      }
    },
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: () => Yanfei.pasvTalents[0].buff,
      isGranted: checkAscs[1],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [4],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, ATTRs, "Pyro DMG Bonus", 5 * inputs[0], tracker);
      }
    },
    {
      index: 1,
      outdated: true,
      src: "Ascension 4 Passive Talent",
      desc: () => Yanfei.pasvTalents[1].desc
    },
    {
      index: 2,
      src: "Constellation 2",
      desc: () => Yanfei.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "CA.cRate", 20)
    }
  ]
};

export default Yanfei;

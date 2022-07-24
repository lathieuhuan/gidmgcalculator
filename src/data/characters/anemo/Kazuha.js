import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { round2 } from "../../../helpers";
import {
  Anemo,
  anemoDmg,
  anemoIA,
  Green,
  Red
} from "../../../styledCpns/DataDisplay";
import {
  CaStamina,
  sprintStaminaPasv,
  SwordCaDesc,
  SwordNaDesc,
  SwordPaDesc_content,
  xiaoPAs
} from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";

const Kazuha = {
  code: 35,
  name: "Kazuha",
  GOOD: "KaedeharaKazuha",
  icon: "f/f0/Character_Kaedehara_Kazuha_Thumb",
  sideIcon: "1/16/Character_Kaedehara_Kazuha_Side_Icon",
  rarity: 5,
  nation: "Inazuma",
  vision: "Anemo",
  weapon: "Sword",
  stats: [
    { "Base HP": 1039, "Base ATK": 23, "Base DEF": 63 },
    { "Base HP": 2695, "Base ATK": 60, "Base DEF": 163 },
    { "Base HP": 3586, "Base ATK": 80, "Base DEF": 217 },
    { "Base HP": 5366, "Base ATK": 119, "Base DEF": 324 },
    {
      "Base HP": 5999,
      "Base ATK": 133,
      "Base DEF": 363,
      "Elemental Mastery": 28.8
    },
    {
      "Base HP": 6902,
      "Base ATK": 153,
      "Base DEF": 417,
      "Elemental Mastery": 28.8
    },
    {
      "Base HP": 7747,
      "Base ATK": 172,
      "Base DEF": 468,
      "Elemental Mastery": 57.6
    },
    {
      "Base HP": 8659,
      "Base ATK": 192,
      "Base DEF": 523,
      "Elemental Mastery": 57.6
    },
    {
      "Base HP": 9292,
      "Base ATK": 206,
      "Base DEF": 562,
      "Elemental Mastery": 57.6
    },
    {
      "Base HP": 10213,
      "Base ATK": 227,
      "Base DEF": 617,
      "Elemental Mastery": 57.6
    },
    {
      "Base HP": 10846,
      "Base ATK": 241,
      "Base DEF": 656,
      "Elemental Mastery": 86.4
    },
    {
      "Base HP": 11777,
      "Base ATK": 262,
      "Base DEF": 712,
      "Elemental Mastery": 86.4
    },
    {
      "Base HP": 12410,
      "Base ATK": 276,
      "Base DEF": 750,
      "Elemental Mastery": 115.2
    },
    {
      "Base HP": 13348,
      "Base ATK": 297,
      "Base DEF": 807,
      "Elemental Mastery": 115.2
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Garyuu Bladework",
      desc: [
        SwordNaDesc,
        SwordCaDesc,
        {
          heading: "PA",
          content: (
            <>
              {SwordPaDesc_content} If this Plunging Attack is triggered by
              Chihayaburu, it will be converted to Plunging Attack: Midare
              Ranzan.
            </>
          )
        },
        {
          heading: "Plunging Attack: Midare Ranzan",
          content: (
            <>
              When a Plunging Attack is performed using the effects of the
              Elemental Skill Chihayaburu, Plunging Attack DMG is converted to{" "}
              {anemoDmg} and will create a small wind tunnel via a secret blade
              technique that pulls in nearby objects and opponents.
            </>
          )
        }
      ],
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 44.98,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 45.24,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: [25.8, 30.96],
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 60.72,
          multType: 1
        },
        {
          name: "5-Hit (1/3)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 25.37,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: [43, 74.65],
          multType: 1
        },
        CaStamina[20],
        ...xiaoPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Chihayaburu",
      image: "2/22/Talent_Chihayaburu",
      desc: [
        {
          get content() {
            return (
              <>
                Unleashes a secret technique as fierce as the rushing wind that
                pulls objects and opponents towards Kazuha's current position
                before launching opponents within the AoE, dealing {anemoDmg}{" "}
                and lifting Kazuha into the air on a rushing gust of wind.
                <br />
                {this.buff}.
              </>
            );
          },
          buff: (
            <>
              Within 10s of remaining airborne after casting Chihayaburu, Kazuha
              can unleash a powerful Plunging Attack known as Midare Ranzan
            </>
          )
        },
        {
          heading: "Press",
          content: <>Can be used in mid-air.</>
        },
        {
          heading: "Hold",
          content: (
            <>
              Charges up before unleashing greater {anemoDmg} over a larger AoE
              than Press Mode.
            </>
          )
        },
        {
          heading: "Plunging Attack: Midare Ranzan",
          content: (
            <>
              When a Plunging Attack is performed using the effects of the
              Elemental Skill Chihayaburu, Plunging Attack DMG is converted to{" "}
              {anemoDmg}. On landing, Kazuha creates a small wind tunnel via a
              secret blade technique that pulls in nearby objects and opponents.
              <br />
              Midare Ranzan's DMG is considered{" "}
              <Green>Plunging Attack DMG</Green>.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Press DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 192,
          multType: 2
        },
        { name: "Press CD", noCalc: true, getValue: () => "6s" },
        {
          name: "Hold DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 260.8,
          multType: 2
        },
        { name: "Hold CD", noCalc: true, getValue: () => "9s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Kazuha Slash",
      image: "0/06/Talent_Kazuha_Slash",
      desc: [
        {
          content: (
            <>
              The signature technique of Kazuha's self-styled bladework — a
              single slash that strikes with the force of the first winds of
              autumn, dealing AoE {anemoDmg}.
              <br />
              The blade's passage will leave behind a field named "Autumn
              Whirlwind" that periodically deals AoE {anemoDmg} to opponents
              within its range.
            </>
          )
        },
        {
          heading: "Elemental Absorption",
          content: "Autumn Whirlwind"
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Slashing DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 262.4,
          multType: 2
        },
        {
          name: "DoT",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 120,
          multType: 2
        },
        {
          name: "Additional Elemental DMG",
          dmgTypes: ["EB", "Various"],
          baseMult: 36,
          multType: 2
        }
      ],
      otherStats: () => [{ name: "CD", value: "15s" }],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Soumon Swordsmanship",
      image: "1/16/Talent_Soumon_Swordsmanship",
      desc: (
        <>
          If Chihayaburu comes into contact with {anemoIA} when cast,
          Chihayaburu will absorb that element and if Plunging Attack: Midare
          Ranzan is used before the effect expires, it will deal an additional{" "}
          <Green b>200%</Green> <Green>ATK</Green> of the absorbed elemental
          type as DMG. This will be considered Plunging Attack DMG.
          <br />
          Elemental Absorption may only occur once per use of Chihayaburu.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Poetics of Fuubutsu",
      image: "e/e4/Talent_Poetics_of_Fuubutsu",
      desc: (
        <>
          Upon triggering a Swirl, Kazuha will grant all party members a{" "}
          <Green b>0.04%</Green> <Green>Elemental DMG Bonus</Green> to the
          element absorbed by Swirl for every point of{" "}
          <Green>Elemental Mastery</Green> he has for 8s.
        </>
      )
    },
    {
      type: "Passive",
      name: "Cloud Strider",
      image: "b/b1/Talent_Cloud_Strider",
      desc: sprintStaminaPasv
    }
  ],
  constellation: [
    {
      name: "Scarlet Hills",
      image: "6/6b/Constellation_Scarlet_Hills",
      desc: (
        <>
          Decreases Chihayaburu's <Green>CD</Green> by <Green b>10%</Green>.
          Using Kazuha Slash <Green>resets the CD</Green> of Chihayaburu.
        </>
      )
    },
    {
      name: "Yamaarashi Tailwind",
      image: "f/f2/Constellation_Yamaarashi_Tailwind",
      desc: (
        <>
          The Autumn Whirlwind field created by Kazuha Slash has the following
          effects:
          <br />• Increases Kaedehara Kazuha's own{" "}
          <Green>Elemental Mastery</Green> by <Green b>200</Green>.<br />•
          Increases the <Green>Elemental Mastery</Green> of characters within
          the field by <Green b>200</Green>.<br />
          The Elemental Mastery-increasing effects of this Constellation do not
          stack.
        </>
      )
    },
    {
      name: "Maple Monogatari",
      image: "c/c3/Constellation_Maple_Monogatari",
      desc: "Chihayaburu"
    },
    {
      name: "Oozora Genpou",
      image: "0/07/Constellation_Oozora_Genpou",
      desc: (
        <>
          When Kaedehara Kazuha's Energy is lower than 45, he obtains the
          following effects:
          <br />• Taping/Pressing or Holding Chihayaburu regenerates{" "}
          <Green b>3</Green> or <Green b>4</Green> <Green>Energy</Green> for
          Kaedehara Kazuha, respectively.
          <br />• When gliding, Kaedehara Kazuha regenerates <Green b>
            2
          </Green>{" "}
          <Green>Energy</Green> per second.
        </>
      )
    },
    {
      name: "Wisdom of Bansei",
      image: "f/f7/Constellation_Wisdom_of_Bansei",
      desc: "Kazuha Slash"
    },
    {
      name: "Crimson Momiji",
      image: "8/87/Constellation_Crimson_Momiji",
      desc: (
        <>
          After using Chihayaburu or Kazuha Slash, Kazuha gains an{" "}
          <Anemo>Anemo Infusion</Anemo> for 5s. Additionally, each point of{" "}
          <Green>Elemental Mastery</Green> will increase the <Green>DMG</Green>{" "}
          dealt by Kazuha's <Green>Normal, Charged, and Plunging Attack</Green>{" "}
          by <Green b>0.2%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: () => (
        <>
          {Kazuha.actvTalents[1].desc[0].buff}, <Green>converting</Green> his{" "}
          <Green>Plunging Attack DMG</Green> to {anemoDmg}.
        </>
      ),
      isGranted: () => true,
      affect: "self",
      canInfuse: () => true,
      infuseRange: ["PA"],
      canBeOverrided: false
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: ({ toSelf, ATTRs, inputs }) => (
        <>
          {Kazuha.pasvTalents[1].desc}{" "}
          <Red>
            {inputs[0]} DMG Bonus:{" "}
            {Kazuha.buffs[1].bnValue(toSelf, ATTRs, inputs)}%.
          </Red>
        </>
      ),
      isGranted: checkAscs[4],
      affect: "party",
      labels: ["Element Swirled", "Elemental Mastery"],
      selfLabels: ["Element Swirled"],
      inputs: ["Pyro", 0],
      inputTypes: ["swirl", "text"],
      maxs: [null, 9999],
      addBnes: ({ toSelf, ATTRs, inputs, tkDesc, tracker }) => {
        const field = inputs[0] + " DMG Bonus";
        const bnValue = Kazuha.buffs[1].bnValue(toSelf, ATTRs, inputs);
        addAndTrack(tkDesc, ATTRs, field, bnValue, tracker);
      },
      bnValue: (toSelf, ATTRs, inputs) => {
        const EM = toSelf ? ATTRs["Elemental Mastery"] : inputs[1];
        return round2(EM * 0.04);
      }
    },
    {
      index: 2,
      src: "Constellation 2",
      desc: () => (
        <>
          The Autumn Whirlwind field created by Kazuha Slash increases the{" "}
          <Green>Elemental Mastery</Green> of him and characters within the
          field by <Green b>200</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Elemental Mastery", 200)
    },
    {
      index: 3,
      src: "Constellation 6",
      desc: ({ ATTRs }) => (
        <>
          {Kazuha.constellation[5].desc}{" "}
          <Red>DMG Bonus: {Kazuha.buffs[3].bnValue(ATTRs)}%.</Red>
        </>
      ),
      isGranted: checkCons[6],
      affect: "self",
      addFinalBnes: ({ ATTRs, hitBnes, tkDesc, tracker }) => {
        const fields = ["NA.pct", "CA.pct", "PA.pct"];
        const bnValue = Kazuha.buffs[3].bnValue(ATTRs);
        addAndTrack(tkDesc, hitBnes, fields, bnValue, tracker);
      },
      bnValue: (ATTRs) => Math.round(ATTRs["Elemental Mastery"] * 2) / 10,
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: true
    }
  ]
};

export default Kazuha;

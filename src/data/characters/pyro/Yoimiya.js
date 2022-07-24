import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { round2, getFinalTlLv } from "../../../helpers";
import { Green, pyroDmg } from "../../../styledCpns/DataDisplay";
import { bowCAs, BowNaDesc_5, BowPaDesc, lightPAs_Bow } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const Yoimiya = {
  code: 38,
  name: "Yoimiya",
  icon: "0/05/Character_Yoimiya_Thumb",
  sideIcon: "5/5f/Character_Yoimiya_Side_Icon",
  rarity: 5,
  nation: "Inazuma",
  vision: "Pyro",
  weapon: "Bow",
  stats: [
    { "Base HP": 791, "Base ATK": 25, "Base DEF": 48 },
    { "Base HP": 2053, "Base ATK": 65, "Base DEF": 124 },
    { "Base HP": 2731, "Base ATK": 87, "Base DEF": 165 },
    { "Base HP": 4086, "Base ATK": 130, "Base DEF": 247 },
    { "Base HP": 4568, "Base ATK": 145, "Base DEF": 276, "CRIT Rate": 4.8 },
    { "Base HP": 5256, "Base ATK": 167, "Base DEF": 318, "CRIT Rate": 4.8 },
    { "Base HP": 5899, "Base ATK": 187, "Base DEF": 357, "CRIT Rate": 9.6 },
    { "Base HP": 6593, "Base ATK": 209, "Base DEF": 399, "CRIT Rate": 9.6 },
    { "Base HP": 7075, "Base ATK": 225, "Base DEF": 428, "CRIT Rate": 9.6 },
    { "Base HP": 7777, "Base ATK": 247, "Base DEF": 470, "CRIT Rate": 9.6 },
    { "Base HP": 8259, "Base ATK": 262, "Base DEF": 500, "CRIT Rate": 14.4 },
    { "Base HP": 8968, "Base ATK": 285, "Base DEF": 542, "CRIT Rate": 14.4 },
    { "Base HP": 9450, "Base ATK": 300, "Base DEF": 572, "CRIT Rate": 19.2 },
    { "Base HP": 10164, "Base ATK": 323, "Base DEF": 615, "CRIT Rate": 19.2 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Firework Flare-Up",
      desc: [
        BowNaDesc_5,
        {
          heading: "CA",
          content: (
            <>
              Performs a more precise Aimed Shot with increased DMG.
              <br />
              While aiming, flames will accumulate on the arrowhead before being
              fired off as an attack. Has different effects based on how long
              the energy has been charged:
              <br />• Charge Level 1: Fires off a flaming arrow that deals{" "}
              {pyroDmg}.
              <br />• Charge Level 2: Generates a maximum of 3 Kindling Arrows
              based on time spent charging, releasing them as part of this Aimed
              Shot. Kindling Arrows will home in on nearby opponents, dealing{" "}
              {pyroDmg} on hit.
            </>
          )
        },
        BowPaDesc
      ],
      stats: [
        {
          name: "1-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 35.64,
          multType: 4
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 68.38,
          multType: 4
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 88.89,
          multType: 4
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 46.42,
          multType: 4
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 105.86,
          multType: 4
        },
        ...bowCAs,
        {
          name: "Kindling Arrow",
          dmgTypes: ["CA", "Elemental"],
          baseMult: 16.4,
          multType: 2
        },
        ...lightPAs_Bow
      ]
    },
    {
      type: "Elemental Skill",
      name: "Niwabi Fire-Dance",
      image: "0/03/Talent_Niwabi_Fire-Dance",
      desc: [
        {
          content: (
            <>
              Yoimiya waves a sparkler and causes a ring of saltpeter to
              surround her.
            </>
          )
        },
        {
          heading: "Niwabi Enshou",
          get content() {
            return (
              <>
                {this.buff} and converted to {pyroDmg}. During this time, Normal
                Attack: Firework Flare-Up will not generate Kindling Arrows at
                Charge Level 2.
              </>
            );
          },
          buff: (
            <>
              During this time, arrows fired by Yoimiya's{" "}
              <Green>Normal Attack</Green> will be Blazing Arrows, and their{" "}
              <Green>DMG</Green> will be increased
            </>
          )
        },
        {
          content: (
            <>This effect will deactivate when Yoimiya leaves the field.</>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Blazing Arrow DMG",
          noCalc: true,
          getValue: (lv) =>
            round2(100 + 37.91 * tlLvMults[5][lv]) + "% Normal Attack DMG"
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "10s" },
        { name: "CD", value: "18s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Ryuukin Saxifrage",
      image: "a/a7/Talent_Ryuukin_Saxifrage",
      desc: [
        {
          content: (
            <>
              Yoimiya leaps into the air along with her original creation, the
              "Ryuukin Saxifrage," and fires forth blazing rockets bursting with
              surprises that deal AoE {pyroDmg} and mark one of the hit
              opponents with Aurous Blaze.
            </>
          )
        },
        {
          heading: "Aurous Blaze",
          content: (
            <>
              All Normal/Charged/Plunging Attacks, Elemental Skills, and
              Elemental Bursts by any party member other than Yoimiya that hit
              an opponent marked by Aurous Blaze will trigger an explosion,
              dealing AoE {pyroDmg}.
              <br />
              When an opponent affected by Aurous Blaze is defeated before its
              duration expires, the effect will pass on to another nearby
              opponent, who will inherit the remaining duration.
            </>
          )
        },
        {
          content: (
            <>
              One Aurous Blaze explosion can be triggered every 2s. When Yoimiya
              is down, Aurous Blaze effects created through her skills will be
              deactivated.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 127.2,
          multType: 2
        },
        {
          name: "Aurous Blaze Explosion",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 122,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "10s" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Tricks of the Trouble-Maker",
      image: "a/a2/Talent_Tricks_of_the_Trouble-Maker",
      desc: (
        <>
          During Niwabi Fire-Dance, shots from Yoimiya's Normal Attack will
          increase her <Green>Pyro DMG Bonus</Green> by <Green b>2%</Green> on
          hit. This effect lasts for 3s and can have a <Green>maximum</Green> of{" "}
          <Green b>10</Green> stacks.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Summer Night's Dawn",
      image: "9/9b/Talent_Summer_Night%27s_Dawn",
      desc: (
        <>
          Using Ryuukin Saxifrage causes nearby party members (not including
          Yoimiya) to gain a <Green b>10%</Green> <Green>ATK</Green> increase
          for 15s. Additionally, a further ATK Bonus will be added on based on
          the number of "Tricks of the Trouble-Maker" stacks Yoimiya possesses
          when using Ryuukin Saxifrage. Each stack increases this{" "}
          <Green>ATK Bonus</Green> by <Green b>1%</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Blazing Match",
      image: "6/6e/Talent_Blazing_Match",
      desc: (
        <>
          When Yoimiya crafts <Green>Decoration</Green>, <Green>Ornament</Green>
          , and <Green>Landscape-type Furnishings</Green>, she has a{" "}
          <Green b>100%</Green> <Green>chance</Green> to refund{" "}
          <Green b>a portion</Green> of the materials used.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Agate Ryuukin",
      image: "8/8c/Constellation_Agate_Ryuukin",
      get desc() {
        return (
          <>
            The Aurous Blaze created by Ryuukin Saxifrage lasts for an{" "}
            <Green>extra</Green> <Green b>4s</Green>.
            <br />
            Additionally, when {this.buff}
          </>
        );
      },
      buff: (
        <>
          an opponent affected by Aurous Blaze is defeated within its duration,
          Yoimiya's <Green>ATK</Green> is increased by <Green b>20%</Green> for
          20s.
        </>
      )
    },
    {
      name: "A Procession of Bonfires",
      image: "7/77/Constellation_A_Procession_of_Bonfires",
      get desc() {
        return (
          <>
            {this.buff}
            <br />
            This effect can be triggered even when Yoimiya is not the active
            character.
          </>
        );
      },
      buff: (
        <>
          When Yoimiya's {pyroDmg} scores a CRIT Hit, she will gain a{" "}
          <Green b>25%</Green> <Green>Pyro DMG Bonus</Green> for 6s.
        </>
      )
    },
    {
      name: "Trickster's Flare",
      image: "7/7e/Constellation_Trickster%27s_Flare",
      desc: "Niwabi Fire-Dance"
    },
    {
      name: "Pyrotechnic Professional",
      image: "e/e2/Constellation_Pyrotechnic_Professional",
      desc: (
        <>
          When Yoimiya's own Aurous Blaze triggers an explosion, Niwabi
          Fire-Dance's <Green>CD</Green> is decreased by <Green b>1.2s</Green>.
        </>
      )
    },
    {
      name: "A Summer Festival's Eve",
      image: "b/bc/Constellation_A_Summer_Festival%27s_Eve",
      desc: "Ryuukin Saxifrage"
    },
    {
      name: "Naganohara Meteor Swarm",
      image: "c/cc/Constellation_Naganohara_Meteor_Swarm",
      desc: (
        <>
          During Niwabi Fire-Dance, Yoimiya's Normal Attacks have a{" "}
          <Green b>50%</Green> <Green>chance</Green> of firing an extra Kindling
          Arrow that deals <Green b>60%</Green> of its{" "}
          <Green>original DMG</Green>. This DMG is considered Normal Attack DMG.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: ({ char, partyData }) => (
        <>
          {Yoimiya.actvTalents[1].desc[1].buff} by{" "}
          <Green b>{Yoimiya.buffs[0].bnValue(char, partyData)}%</Green> and{" "}
          <Green>converted</Green> to {pyroDmg}.
        </>
      ),
      isGranted: () => true,
      affect: "self",
      addBnes: ({ hitBnes, char, partyData, tkDesc, tracker }) => {
        const bnValue = Yoimiya.buffs[0].bnValue(char, partyData);
        addAndTrack(tkDesc, hitBnes, "NA.sMult", bnValue, tracker);
      },
      bnValue: (char, partyData) => {
        const level = getFinalTlLv(char, Yoimiya.actvTalents[1], partyData);
        return round2(37.91 * tlLvMults[5][level]);
      },
      canInfuse: () => true,
      infuseRange: ["NA"],
      canBeOverrided: false
    },
    {
      index: 1,
      src: "Ascension 1 Passive Talent",
      desc: () => Yoimiya.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [10],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, ATTRs, "Pyro DMG Bonus", 2 * inputs[0], tracker);
      }
    },
    {
      index: 2,
      src: "Ascension 4 Passive Talent",
      desc: () => Yoimiya.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "teammates",
      labels: ["Stacks"],
      inputs: [1],
      inputTypes: ["select"],
      maxs: [10],
      addBnes: ({ ATTRs, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, ATTRs, "ATK%", 10 + inputs[0], tracker);
      }
    },
    {
      index: 3,
      src: "Constellation 1",
      desc: () => <>When {Yoimiya.constellation[0].buff}</>,
      isGranted: (char) => char.constellation >= 1,
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "ATK%", 20)
    },
    {
      index: 4,
      src: "Constellation 2",
      desc: () => Yoimiya.constellation[1].buff,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Pyro DMG Bonus", 25)
    }
  ]
};

export default Yoimiya;

import {
  addAndTrack,
  incElementalBnes,
  simpleAnTmaker
} from "../../../calculators/helpers";
import { applyPct, getFinalTlLv, round2 } from "../../../helpers";
import { Cryo, cryoDmg, Green } from "../../../styledCpns/DataDisplay";
import { CaStamina, mediumPAs, PolearmDesc_5 } from "../config";
import { checkAscs, checkCons, NCPApcts, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const Shenhe = {
  code: 47,
  name: "Shenhe",
  icon: "5/58/Character_Shenhe_Thumb",
  sideIcon: "8/8d/Character_Shenhe_Side_Icon",
  rarity: 5,
  nation: "Liyue",
  vision: "Cryo",
  weapon: "Polearm",
  stats: [
    { "Base HP": 1011, "Base ATK": 24, "Base DEF": 65 },
    { "Base HP": 2624, "Base ATK": 61, "Base DEF": 168 },
    { "Base HP": 3491, "Base ATK": 82, "Base DEF": 223 },
    { "Base HP": 5224, "Base ATK": 122, "Base DEF": 334 },
    { "Base HP": 5840, "Base ATK": 137, "Base DEF": 373, "ATK%": 7.2 },
    { "Base HP": 6719, "Base ATK": 157, "Base DEF": 429, "ATK%": 7.2 },
    { "Base HP": 7540, "Base ATK": 176, "Base DEF": 482, "ATK%": 14.4 },
    { "Base HP": 8429, "Base ATK": 197, "Base DEF": 538, "ATK%": 14.4 },
    { "Base HP": 9045, "Base ATK": 211, "Base DEF": 578, "ATK%": 14.4 },
    { "Base HP": 9941, "Base ATK": 232, "Base DEF": 635, "ATK%": 14.4 },
    { "Base HP": 10557, "Base ATK": 247, "Base DEF": 674, "ATK%": 21.6 },
    { "Base HP": 11463, "Base ATK": 268, "Base DEF": 732, "ATK%": 21.6 },
    { "Base HP": 12080, "Base ATK": 282, "Base DEF": 772, "ATK%": 28.8 },
    { "Base HP": 12993, "Base ATK": 304, "Base DEF": 830, "ATK%": 28.8 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Dawnstar Shooter",
      desc: PolearmDesc_5,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 43.26,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 40.25,
          multType: 1
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 53.32,
          multType: 1
        },
        {
          name: "4-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 26.32,
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 65.62,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 110.67,
          multType: 1
        },
        CaStamina[25],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Spring Spirit Summoning",
      image: "6/6c/Talent_Spring_Spirit_Summoning",
      desc: [
        {
          content: (
            <>
              Grants all nearby party members the Icy Quill effect and deals{" "}
              {cryoDmg} in different ways based on whether it is Tapped/Pressed
              or held.
            </>
          )
        },
        {
          heading: "Press",
          content: (
            <>
              Rushes forward together with a Talisman Spirit, dealing {cryoDmg}{" "}
              to opponents along the path.
            </>
          )
        },
        {
          heading: "Hold",
          content: <>Commands the Talisman Spirit to deal AoE {cryoDmg}.</>
        },
        {
          heading: "Icy Quill",
          content: (
            <>
              When Normal, Charged and Plunging Attacks, Elemental Skills, and
              Elemental Bursts deal {cryoDmg} the <Green>DMG</Green> dealt is
              increased based on Shenhe's <Green>current ATK</Green>.
            </>
          )
        },
        {
          content: (
            <>
              The Icy Quill's effects will be cleared once its duration ends or
              after being triggered a certain number of times. When held rather
              than Tapped/Pressed, the Icy Quill's effect lasts longer and can
              be triggered more times.
              <br />
              When one {cryoDmg} instance strikes multiple opponents, the effect
              is triggered multiple times based on the number of opponents hit.
              The number of times the effect is triggered is calculated
              independently for each party member with the Icy Quill.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Press Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 139.2,
          multType: 2
        },
        {
          name: "Hold Skill DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 188.8,
          multType: 2
        },
        {
          name: "DMG Bonus",
          baseMult: 45.66,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Press/Hold Duration", value: "10s/15s" },
        { name: "Press/Hold Trigger Quota", value: "5/7" },
        { name: "Press CD", value: "10s" },
        { name: "Hold CD", value: "15s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Divine Maiden's Deliverance",
      image: "d/d5/Talent_Divine_Maiden%27s_Deliverance",
      desc: [
        {
          get content() {
            return (
              <>
                Unleashes the power of the Talisman Spirit, allowing it to roam
                free in this plane, dealing AoE {cryoDmg}.
                <br />
                {this.debuff}. It also deals periodic {cryoDmg} to opponents
                within the field.
              </>
            );
          },
          debuff: (
            <>
              The field decreases the <Green>Cryo RES</Green> and{" "}
              <Green>Physical RES</Green> of opponents within it
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 100.8,
          multType: 2
        },
        {
          name: "RES Decrease",
          noCalc: true,
          getValue: (lv) => Math.min(5 + lv, 15) + "%"
        },
        {
          name: "DoT",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 33.12,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "12s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Deific Embrace",
      image: "2/29/Talent_Deific_Embrace",
      desc: (
        <>
          An active character within the field created by Divine Maiden's
          Deliverance gain <Green b>15%</Green> <Green>Cryo DMG Bonus</Green>.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Spirit Communion Seal",
      image: "5/5c/Talent_Spirit_Communion_Seal",
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
          After Shenhe uses Spring Spirit Summoning, she will grant all nearby
          party members the following effects:
        </>,
        <>
          <br />• Press: <Green>Elemental Skill and Elemental Burst DMG</Green>{" "}
          increased by <Green b>15%</Green> for 10s.
        </>,
        <>
          <br />• Hold: <Green>Normal, Charged and Plunging Attack DMG</Green>{" "}
          increased by <Green b>15%</Green> for 15s.
        </>
      ]
    },
    {
      type: "Passive",
      name: "Precise Comings and Goings",
      image: "d/d0/Talent_Precise_Comings_and_Goings",
      desc: (
        <>
          Gains <Green b>25%</Green> more <Green>rewards</Green> when dispatched
          on a Liyue <Green>Expedition</Green> for 20 hours.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Clarity of Heart",
      image: "1/13/Constellation_Clarity_of_Heart",
      desc: (
        <>
          Spring Spirit Summoning can be used <Green b>1</Green>{" "}
          <Green>more time</Green>.
        </>
      )
    },
    {
      name: "Centered Spirit",
      image: "9/90/Constellation_Centered_Spirit",
      desc: (
        <>
          Divine Maiden's Deliverance lasts for <Green b>6s</Green>{" "}
          <Green>longer</Green>. Active characters within Divine Maiden's
          Deliverance's field deal <Green b>15%</Green> increased{" "}
          <Cryo>Cryo</Cryo> <Green>CRIT DMG</Green>.
        </>
      )
    },
    {
      name: "Seclusion",
      image: "d/d9/Constellation_Seclusion",
      desc: "Spring Spirit Summoning"
    },
    {
      name: "Insight",
      image: "4/46/Constellation_Insight",
      desc: (
        <>
          Every time a character triggers Icy Quill's DMG Bonus, Shenhe will
          gain a Skyfrost Mantra stack. Each stack increases her next{" "}
          <Green>Spring Spirit Summoning's DMG</Green> by <Green b>5%</Green>.
          Stacks last for 60s and has a <Green>maximum</Green> of{" "}
          <Green b>50</Green>.
        </>
      )
    },
    {
      name: "Divine Attainment",
      image: "5/58/Constellation_Divine_Attainment",
      desc: "Divine Maiden's Deliverance"
    },
    {
      name: "Mystical Abandon",
      image: "0/0d/Constellation_Mystical_Abandon",
      desc: (
        <>
          When characters trigger Icy Quill's effects using{" "}
          <Green>Normal and Charged Attack DMG</Green>, it does not count toward
          the Trigger Quota.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Skill",
      desc: () => Shenhe.actvTalents[1].desc[3].content,
      isGranted: () => true,
      affect: "party",
      labels: ["Current ATK", "Elemental Skill Level"],
      inputs: [0, 1],
      inputTypes: ["text", "text"],
      maxs: [9999, 13],
      addFinalBnes: (obj) => {
        const { toSelf, inputs } = obj;
        const ATK = toSelf ? obj.ATTRs.ATK : inputs[0];
        const level = toSelf
          ? getFinalTlLv(obj.char, Shenhe.actvTalents[1], obj.partyData)
          : inputs[1];
        const tlMult = 45.66 * tlLvMults[2][level];
        const settings = {
          vision: obj.charData.vision,
          infusion: obj.infusion,
          elmt: "Cryo",
          type: "flat",
          value: applyPct(ATK, tlMult)
        };
        const desc = ` / Lv. ${level} / ${round2(tlMult)}% of ${ATK} ATK`;
        incElementalBnes(settings, obj.hitBnes, obj.tkDesc + desc, obj.tracker);
      }
    },
    {
      index: 1,
      src: "Ascension 1 Passive Talent",
      desc: () => Shenhe.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Cryo DMG Bonus", 15)
    },
    {
      index: 2,
      src: "Ascension 4 Passive Talent",
      desc: ({ inputs }) => (
        <>
          {Shenhe.pasvTalents[1].lines[0]}
          <span className={inputs[0] ? "" : "unavailable"}>
            {Shenhe.pasvTalents[1].lines[1]}
          </span>
          <span className={inputs[1] ? "" : "unavailable"}>
            {Shenhe.pasvTalents[1].lines[2]}
          </span>
        </>
      ),
      isGranted: checkAscs[4],
      affect: "party",
      selfLabels: ["Press", "Hold"],
      labels: ["Press", "Hold"],
      inputs: [true, false],
      inputTypes: ["check", "check"],
      addBnes: ({ hitBnes, inputs, tkDesc, tracker }) => {
        if (inputs[0]) {
          const fields = ["ES.pct", "EB.pct"];
          addAndTrack(tkDesc + " / Press", hitBnes, fields, 15, tracker);
        }
        if (inputs[1])
          addAndTrack(tkDesc + " / Hold", hitBnes, NCPApcts, 15, tracker);
      }
    },
    {
      index: 3,
      src: "Constellation 2",
      desc: () => Shenhe.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "party",
      addBnes: ({ charData, hitBnes, infusion, tkDesc, tracker }) => {
        const settings = {
          vision: charData.vision,
          infusion,
          elmt: "Cryo",
          type: "cDmg",
          value: 15
        };
        incElementalBnes(settings, hitBnes, tkDesc, tracker);
      }
    },
    {
      index: 4,
      src: "Constellation 4",
      desc: () => Shenhe.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "self",
      selfLabels: ["Stacks"],
      inputs: [0],
      inputTypes: ["text"],
      maxs: [50],
      addBnes: ({ hitBnes, inputs, tkDesc, tracker }) => {
        addAndTrack(tkDesc, hitBnes, "ES.pct", 5 * inputs[0], tracker);
      }
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: ({ fromSelf, char, inputs, partyData }) => (
        <>
          {Shenhe.actvTalents[2].desc[0].debuff} by{" "}
          <Green b>
            {Shenhe.debuffs[0].pntValue(fromSelf, char, inputs, partyData)}%
          </Green>
          .
        </>
      ),
      isGranted: () => true,
      labels: ["Elemental Burst Level"],
      inputTypes: ["text"],
      addPntes: (obj) => {
        const args = [obj.fromSelf, obj.char, obj.inputs, obj.partyData];
        const pntValue = Shenhe.debuffs[0].pntValue(...args);
        const fields = ["Physical_rd", "Cryo_rd"];
        addAndTrack(obj.tkDesc, obj.rdMult, fields, pntValue, obj.tracker);
      },
      pntValue: (fromSelf, char, inputs, partyData) => {
        const level = fromSelf
          ? getFinalTlLv(char, Shenhe.actvTalents[2], partyData)
          : inputs[0];
        return level ? Math.min(5 + level, 15) : 0;
      }
    }
  ]
};

export default Shenhe;

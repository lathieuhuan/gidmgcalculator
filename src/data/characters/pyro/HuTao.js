import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { NAs } from "../../../configs";
import { applyPct, getFinalTlLv } from "../../../helpers";
import { Green, pyroDmg, Span } from "../../../styledCpns/DataDisplay";
import { CaStamina, PolearmDesc_6, susCooking } from "../config";
import { checkAscs, checkCons, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const HuTao = {
  code: 31,
  name: "Hu Tao",
  GOOD: "HuTao",
  icon: "a/a4/Character_Hu_Tao_Thumb",
  sideIcon: "7/78/Character_Hu_Tao_Side_Icon",
  rarity: 5,
  nation: "Liyue",
  vision: "Pyro",
  weapon: "Polearm",
  stats: [
    { "Base HP": 1211, "Base ATK": 8, "Base DEF": 68 },
    { "Base HP": 3141, "Base ATK": 21, "Base DEF": 177 },
    { "Base HP": 4179, "Base ATK": 29, "Base DEF": 235 },
    { "Base HP": 6253, "Base ATK": 43, "Base DEF": 352 },
    { "Base HP": 6990, "Base ATK": 48, "Base DEF": 394, "CRIT DMG": 9.6 },
    { "Base HP": 8042, "Base ATK": 55, "Base DEF": 453, "CRIT DMG": 9.6 },
    { "Base HP": 9026, "Base ATK": 62, "Base DEF": 508, "CRIT DMG": 19.2 },
    { "Base HP": 10089, "Base ATK": 69, "Base DEF": 568, "CRIT DMG": 19.2 },
    { "Base HP": 10826, "Base ATK": 74, "Base DEF": 610, "CRIT DMG": 19.2 },
    { "Base HP": 11899, "Base ATK": 81, "Base DEF": 670, "CRIT DMG": 19.2 },
    { "Base HP": 12637, "Base ATK": 86, "Base DEF": 712, "CRIT DMG": 28.8 },
    { "Base HP": 13721, "Base ATK": 94, "Base DEF": 773, "CRIT DMG": 28.8 },
    { "Base HP": 14459, "Base ATK": 99, "Base DEF": 815, "CRIT DMG": 38.4 },
    { "Base HP": 15552, "Base ATK": 106, "Base DEF": 876, "CRIT DMG": 38.4 }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Secret Spear of Wangsheng",
      desc: PolearmDesc_6,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 46.89,
          multType: 4
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 48.25,
          multType: 4
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 61.05,
          multType: 4
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 65.64,
          multType: 4
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: [33.27, 35.2],
          multType: 4
        },
        {
          name: "6-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 85.96,
          multType: 4
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 135.96,
          multType: 4
        },
        CaStamina[25],
        {
          name: "Plunge DMG",
          dmgTypes: ["PA", "Physical"],
          baseMult: 65.42,
          multType: 4
        },
        {
          name: "Low Plunge",
          dmgTypes: ["PA", "Physical"],
          baseMult: 130.81,
          multType: 4
        },
        {
          name: "High Plunge",
          dmgTypes: ["PA", "Physical"],
          baseMult: 163.39,
          multType: 4
        }
      ]
    },
    {
      type: "Elemental Skill",
      name: "Guide to Afterlife",
      image: "b/be/Talent_Guide_to_Afterlife",
      desc: [
        {
          content: (
            <>
              Only an unwavering flame can cleanse the impurities of this world.
              <br />
              Hu Tao consumes a set portion of her HP to knock the surrounding
              enemies back and enter the Paramita Papilio state.
            </>
          )
        },
        {
          heading: "Paramita Papilio",
          get content() {
            return (
              <>
                • {this.lines[0]} at the time of entering this state. ATK Bonus
                gained this way cannot exceed 400% of Hu Tao's Base ATK.
                <br />• Converts {this.lines[1]}, which cannot be overridden by
                any other elemental infusion.
                <br />• Charged Attacks apply the Blood Blossom effect to the
                enemies hit.
                <br />• Increases Hu Tao's resistance to interruption.
              </>
            );
          },
          lines: [
            <>
              Increases Hu Tao's <Green>ATK</Green> based on her{" "}
              <Green>Max HP</Green>
            </>,
            <>
              <Green>attack DMG</Green> to {pyroDmg}
            </>
          ]
        },
        {
          heading: "Blood Blossom",
          content: (
            <>
              Enemies affected by Blood Blossom will take {pyroDmg} every 4s.
              This DMG is considered Elemental Skill DMG.
              <br />
              Each enemy can be affected by only one Blood Blossom effect at a
              time, and its duration may only be refreshed by Hu Tao herself.
            </>
          )
        },
        {
          content: (
            <>
              <Span color="lightGold">Paramita Papilio</Span> ends when its
              duration is over, or Hu Tao has left the battlefield or fallen.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Activation Cost",
          noCalc: true,
          getValue: () => "30% Current HP"
        },
        {
          name: "ATK Increase",
          baseSType: "HP",
          baseMult: 3.84,
          multType: 5,
          getLimit: ({ ATTRs }) => ATTRs["Base ATK"] * 4
        },
        {
          name: "Blood Blossom DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 64,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Blood Blossom Durtion", value: "8s" },
        { name: "Durtion", value: "9s" },
        { name: "CD", value: "16s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Spirit Soother",
      image: "1/11/Talent_Spirit_Soother",
      desc: [
        {
          content: (
            <>
              Commands a blazing spirit to attack, dealing {pyroDmg} in a large
              AoE.
              <br />
              Upon striking the enemy, regenerates a percentage of Hu Tao's Max
              HP. This effect can be triggered up to 5 times, based on the
              number of enemies hit.
              <br />
              If Hu Tao's HP is below or equal to 50% when the enemy is hit,
              both the DMG and HP Regeneration are increased.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 303.27,
          multType: 5
        },
        {
          name: "Low HP Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 379.09,
          multType: 5
        },
        {
          name: "HP Regen.",
          baseSType: "HP",
          baseMult: 6.26,
          multType: 5
        },
        {
          name: "Low HP Regen.",
          baseSType: "HP",
          baseMult: 8.35,
          multType: 5
        }
      ],
      otherStats: () => [{ name: "CD", value: "15s" }],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Flutter By",
      image: "1/13/Talent_Flutter_By",
      desc: (
        <>
          When a Paramita Papilio state ends, all allies in the party will have
          their <Green>CRIT Rate</Green> increased by <Green b>12%</Green> for
          8s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Sanguine Rouge",
      image: "2/24/Talent_Sanguine_Rouge",
      desc: (
        <>
          When Hu Tao's HP is equal to or less than 50%, her{" "}
          <Green>Pyro DMG Bonus</Green> is increased by <Green b>33%</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "The More the Merrier",
      image: "6/68/Talent_The_More_the_Merrier",
      desc: susCooking("Hu Tao", "she")
    }
  ],
  constellation: [
    {
      name: "Crimson Bouquet",
      image: "0/08/Constellation_Crimson_Bouquet",
      desc: (
        <>
          While in a Paramita Papilio state activated by Guide to Afterlife, Hu
          Tao's Charge Attacks do not consume Stamina.
        </>
      )
    },
    {
      name: "Ominous Rainfall",
      image: "b/b6/Constellation_Ominous_Rainfall",
      get desc() {
        return (
          <>
            {this.buff} at the time the effect is applied.
            <br />
            Additionally, Spirit Soother will also apply the Blood Blossom
            effect.
          </>
        );
      },
      buff: (
        <>
          Increases the <Green>Blood Blossom DMG</Green> by an amount equal to{" "}
          <Green b>10%</Green> of Hu Tao's <Green>Max HP</Green>
        </>
      )
    },
    {
      name: "Lingering Carmine",
      image: "7/7f/Constellation_Lingering_Carmine",
      desc: "Guide to Afterlife"
    },
    {
      name: "Garden of Eternal Rest",
      image: "5/57/Constellation_Garden_of_Eternal_Rest",
      desc: (
        <>
          Upon defeating an enemy affected by a Blood Blossom that Hu Tao
          applied herself, all nearby allies in the party (excluding Hu Tao
          herself) will have their <Green>CRIT Rate</Green> increased by{" "}
          <Green b>12%</Green> for 15s.
        </>
      )
    },
    {
      name: "Floral Incense",
      image: "f/f2/Constellation_Floral_Incense",
      desc: "Spirit Soother"
    },
    {
      name: "Butterfly's Embrace",
      image: "0/09/Constellation_Butterfly%27s_Embrace",
      desc: (
        <>
          Triggers when Hu Tao's HP drops below 25%, or when she suffers a
          lethal strike:
          <br />
          Hu Tao will not fall as a result of the DMG sustained. Additionally,
          for the next 10s, all of her Elemental and Physical RES is increased
          by 200%, her <Green>CRIT Rate</Green> is increased by{" "}
          <Green b>100%</Green>, and her resistance to interruption is greatly
          increased.
          <br />
          This effect triggers automatically when Hu Tao has 1 HP left.
          <br />
          Can only occur once every 60s.
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
          {HuTao.actvTalents[1].desc[1].lines[0]}, and convert her{" "}
          {HuTao.actvTalents[1].desc[1].lines[1]}.
        </>
      ),
      isGranted: () => true,
      affect: "self",
      addFinalBnes: ({ ATTRs, char, partyData, tkDesc, tracker }) => {
        const level = getFinalTlLv(char, HuTao.actvTalents[1], partyData);
        let bnValue = applyPct(ATTRs.HP, 3.84 * tlLvMults[5][level]);
        bnValue = Math.min(bnValue, ATTRs["Base ATK"] * 4);
        addAndTrack(tkDesc, ATTRs, "ATK", bnValue, tracker);
      },
      canInfuse: () => true,
      infuseRange: NAs,
      canBeOverrided: false
    },
    {
      index: 1,
      src: "Ascension 1 Passive Talent",
      desc: () => HuTao.pasvTalents[0].desc,
      isGranted: checkAscs[1],
      affect: "teammates",
      addBnes: simpleAnTmaker("ATTRs", "CRIT Rate", 12)
    },
    {
      index: 2,
      src: "Ascension 4 Passive Talent",
      desc: () => HuTao.pasvTalents[1].desc,
      isGranted: checkAscs[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "Pyro DMG Bonus", 33)
    },
    {
      index: 3,
      src: "Constellation 2",
      desc: () => HuTao.constellation[1].buff,
      isGranted: checkCons[2],
      affect: "self",
      addFinalBnes: ({ ATTRs, hitBnes, tkDesc, tracker }) => {
        const bnValue = Math.round(ATTRs.HP / 10);
        addAndTrack(tkDesc, hitBnes, "ES.flat", bnValue, tracker);
      }
    },
    {
      index: 5,
      src: "Constellation 4",
      desc: () => HuTao.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "teammates",
      addBnes: simpleAnTmaker("ATTRs", "CRIT Rate", 12)
    },
    {
      index: 4,
      src: "Constellation 6",
      desc: () => (
        <>
          When Hu Tao's HP drops below 25%, or when she suffers a lethal strike,
          her <Green>CRIT Rate</Green> is increased by <Green b>100%</Green> for
          10s.
        </>
      ),
      isGranted: checkCons[6],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "CRIT Rate", 100)
    }
  ]
};

export default HuTao;

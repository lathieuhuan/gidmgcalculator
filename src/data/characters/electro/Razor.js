import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { getFinalTlLv, round1 } from "../../../helpers";
import { electroDmg, Green } from "../../../styledCpns/DataDisplay";
import {
  CaStaminaClaymore,
  ClaymoreDesc_4spin,
  sprintStaminaPasv
} from "../config";
import { checkCons, xtraTlLv } from "../helpers";
import tlLvMults from "../tlLvMults";

const Razor = {
  code: 11,
  name: "Razor",
  icon: "1/1d/Character_Razor_Thumb",
  sideIcon: "5/57/Character_Razor_Side_Icon",
  rarity: 4,
  nation: "Mondstadt",
  vision: "Electro",
  weapon: "Claymore",
  stats: [
    { "Base HP": 1003, "Base ATK": 20, "Base DEF": 63 },
    { "Base HP": 2577, "Base ATK": 50, "Base DEF": 162 },
    { "Base HP": 3326, "Base ATK": 65, "Base DEF": 209 },
    { "Base HP": 4982, "Base ATK": 97, "Base DEF": 313 },
    {
      "Base HP": 5514,
      "Base ATK": 108,
      "Base DEF": 346,
      "Physical DMG Bonus": 7.5
    },
    {
      "Base HP": 6343,
      "Base ATK": 124,
      "Base DEF": 398,
      "Physical DMG Bonus": 7.5
    },
    {
      "Base HP": 7052,
      "Base ATK": 138,
      "Base DEF": 443,
      "Physical DMG Bonus": 15
    },
    {
      "Base HP": 7881,
      "Base ATK": 154,
      "Base DEF": 495,
      "Physical DMG Bonus": 15
    },
    {
      "Base HP": 8413,
      "Base ATK": 164,
      "Base DEF": 528,
      "Physical DMG Bonus": 15
    },
    {
      "Base HP": 9241,
      "Base ATK": 180,
      "Base DEF": 580,
      "Physical DMG Bonus": 15
    },
    {
      "Base HP": 9773,
      "Base ATK": 191,
      "Base DEF": 613,
      "Physical DMG Bonus": 22.5
    },
    {
      "Base HP": 10602,
      "Base ATK": 207,
      "Base DEF": 665,
      "Physical DMG Bonus": 22.5
    },
    {
      "Base HP": 11134,
      "Base ATK": 217,
      "Base DEF": 699,
      "Physical DMG Bonus": 30
    },
    {
      "Base HP": 11962,
      "Base ATK": 234,
      "Base DEF": 751,
      "Physical DMG Bonus": 30
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Steel Fang",
      desc: ClaymoreDesc_4spin,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 95.92,
          multType: 4
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 82.63,
          multType: 4
        },
        {
          name: "3-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 103.31,
          multType: 4
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 136.05,
          multType: 4
        },
        {
          name: "Charged Attack Spinning",
          dmgTypes: ["CA", "Physical"],
          baseMult: 62.54,
          multType: 7
        },
        {
          name: "Charged Attack Final",
          dmgTypes: ["CA", "Physical"],
          baseMult: 113.09,
          multType: 7
        },
        ...CaStaminaClaymore,
        {
          name: "Plunge DMG",
          dmgTypes: ["PA", "Physical"],
          baseMult: 82.05,
          multType: 7
        },
        {
          name: "Low Plunge",
          dmgTypes: ["PA", "Physical"],
          baseMult: 164.06,
          multType: 7
        },
        {
          name: "High Plunge",
          dmgTypes: ["PA", "Physical"],
          baseMult: 204.92,
          multType: 7
        }
      ]
    },
    {
      type: "Elemental Skill",
      name: "Claw and Thunder",
      image: "0/06/Talent_Claw_and_Thunder",
      desc: [
        {
          heading: "Press",
          content: (
            <>
              Swings the Thunder Wolf Claw, dealing {electroDmg} to opponents in
              front of Razor.
              <br />
              Upon striking an opponent, Razor will gain an Electro Sigil, which
              increases his Energy Recharge rate.
              <br />
              Razor can have up to 3 Electro Sigils simultaneously, and gaining
              a new Electro Sigil refreshes their duration.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Gathers Electro energy to unleash a lightning storm over a small
              AoE, causing massive {electroDmg}, and clears all of Razor's
              Electro Sigils.
              <br />
              Each Electro Sigil cleared in this manner will be converted into
              Energy for Razor.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Press DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 199.2,
          multType: 2
        },
        {
          name: "Hold DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 295.2,
          multType: 2
        }
      ],
      otherStats: () => [
        { name: "Energy Recharge Bonus", value: "20% per Electro Sigil" },
        { name: "Energy Regenerated", value: "5 per Electro Sigil Absorbed" },
        { name: "Electro Sigil Duration", value: "18s" },
        { name: "Press CD", value: "6s" },
        { name: "Hold CD", value: "10s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Lightning Fang",
      image: "3/3a/Talent_Lightning_Fang",
      desc: [
        {
          content: (
            <>
              Summons the Wolf Within, which deals {electroDmg} to all nearby
              opponents. This clears all of Razor's Electro Sigils, which will
              be converted into Elemental Energy for him.
              <br />
              The Wolf Within will fight alongside Razor for the skill's
              duration.
            </>
          )
        },
        {
          heading: "The Wolf Within",
          content: (
            <>
              • Strikes alongside Razor's normal attacks, dealing {electroDmg}.
              <br />• Raises Razor's ATK SPD and Electro RES.
              <br />• Causes Razor to be immune to DMG inflicted by the
              Electro-Charged status.
              <br />• Disables Razor's Charged Attacks.
              <br />• Increases Razor's resistance to interruption.
            </>
          )
        },
        {
          content: (
            <>
              These effects end when Razor leaves the battlefield.
              <br />
              When Razor leaves the field, a maximum of 10 Energy will be
              returned to him based off the duration remaining on this skill.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Burst DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 160,
          multType: 2
        }
      ],
      otherStats: (lv) => [
        {
          name: "Soul Companion DMG",
          value: round1(24 * tlLvMults[2][lv]) + "% Normal Attack DMG"
        },
        {
          name: "Normal ATK SPD Bonus",
          value: Razor.buffs[0].getPct(lv) + "%"
        },
        { name: "Electro RES Bonus", value: "80%" },
        { name: "Duration", value: "15s" },
        { name: "CD", value: "20s" }
      ],
      energyCost: 80
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "Awakening",
      image: "5/5c/Talent_Awakening",
      desc: (
        <>
          Decreases Claw and Thunder's <Green>CD</Green> by <Green b>18%</Green>
          .
          <br />
          Using Lightning Fang <Green>resets the CD</Green> of Claw and Thunder.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "Hunger",
      image: "b/be/Talent_Hunger",
      desc: (
        <>
          When Razor's Energy is below 50%, increases{" "}
          <Green>Energy Recharge</Green> by <Green b>30%</Green>.
        </>
      )
    },
    {
      type: "Passive",
      name: "Wolvensprint",
      image: "0/0a/Talent_Wolvensprint",
      desc: sprintStaminaPasv
    }
  ],
  constellation: [
    {
      name: "Wolf's Instinct",
      image: "c/cf/Constellation_Wolf%27s_Instinct",
      desc: (
        <>
          Picking up an Elemental Orb or Particle increases Razor's{" "}
          <Green>DMG</Green> by <Green b>10%</Green> for 8s.
        </>
      )
    },
    {
      name: "Suppression",
      image: "1/16/Constellation_Suppression",
      desc: (
        <>
          Increases <Green>CRIT Rate</Green> against opponents with less than
          30% HP by <Green b>10%</Green>.
        </>
      )
    },
    {
      name: "Soul Companion",
      image: "6/6a/Constellation_Soul_Companion",
      desc: "Lightning Fang"
    },
    {
      name: "Bite",
      image: "0/01/Constellation_Bite",
      desc: (
        <>
          Claw and Thunder (Press) decreases opponents' <Green>DEF</Green> by{" "}
          <Green b>15%</Green> for 7s.
        </>
      )
    },
    {
      name: "Sharpened Claws",
      image: "c/c4/Constellation_Sharpened_Claws",
      desc: "Claw and Thunder"
    },
    {
      name: "Lupus Fulguris",
      image: "1/12/Constellation_Lupus_Fulguris",
      desc: (
        <>
          Every 10s, Razor's sword charges up, causing the next Normal Attack to
          release lightning that deals <Green b>100%</Green> of Razor's{" "}
          <Green>ATK</Green> as {electroDmg}.
          <br />
          When Razor is not using Lightning Fang, a lightning strike on an
          opponent will grant Razor <Green>an Electro Sigil</Green> for Claw and
          Thunder.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: ({ char, partyData }) => (
        <>
          Raises Razor's <Green>ATK SPD</Green> by{" "}
          <Green b>{Razor.buffs[0].bnValue(char, partyData)}%</Green>.
        </>
      ),
      isGranted: () => true,
      affect: "self",
      addBnes: ({ ATTRs, char, partyData, tkDesc, tracker }) => {
        const bnValue = Razor.buffs[0].bnValue(char, partyData);
        addAndTrack(tkDesc, ATTRs, "Normal ATK SPD", bnValue, tracker);
      },
      bnValue: (char, partyData) => {
        const level = getFinalTlLv(char, Razor.actvTalents[2], partyData);
        return Razor.buffs[0].getPct(level);
      },
      getPct: (lv) => Math.min(24 + lv * 2 - Math.max(lv - 6, 0), 40)
    },
    {
      index: 1,
      src: "Constellation 1",
      desc: () => Razor.constellation[0].desc,
      isGranted: checkCons[1],
      affect: "self",
      addBnes: simpleAnTmaker("hitBnes", "All.pct", 10)
    },
    {
      index: 2,
      src: "Constellation 2",
      desc: () => Razor.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "CRIT Rate", 10)
    }
  ],
  debuffs: [
    {
      index: 0,
      src: "Constellation 4",
      desc: () => Razor.constellation[3].desc,
      isGranted: checkCons[4],
      addPntes: simpleAnTmaker("rdMult", "Def_rd", 15)
    }
  ]
};

export default Razor;

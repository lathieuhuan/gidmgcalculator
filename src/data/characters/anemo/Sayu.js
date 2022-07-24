import { anemoDmg, Green, Red } from "../../../styledCpns/DataDisplay";
import { CaStaminaClaymore, ClaymoreDesc_4spin, heavyPAs } from "../config";
import {
  checkAscs,
  checkCharMC,
  checkCons,
  findInput,
  makeTlBnes,
  xtraTlLv
} from "../helpers";

const tlBnes_cons2 = ({ char, selfMCs: { BCs } }) =>
  makeTlBnes(
    checkCharMC(Sayu.buffs, char, BCs, 1),
    "pct",
    [0, 2],
    3.3 * Math.floor(findInput(BCs, 1, 0) / 0.5)
  );
const tlBnes_cons6 = (index) => ({ char, selfMCs, ATTRs }) => {
  const EM = Math.min(ATTRs["Elemental Mastery"], 2000);
  return makeTlBnes(
    checkCharMC(Sayu.buffs, char, selfMCs.BCs, 2),
    index ? "flat" : "mult",
    [0, 6],
    EM * (index ? 3 : 0.2)
  );
};

const Sayu = {
  code: 36,
  name: "Sayu",
  icon: "e/ec/Character_Sayu_Thumb",
  sideIcon: "4/4a/Character_Sayu_Side_Icon",
  rarity: 4,
  nation: "Inazuma",
  vision: "Anemo",
  weapon: "Claymore",
  stats: [
    { "Base HP": 994, "Base ATK": 20, "Base DEF": 62 },
    { "Base HP": 2553, "Base ATK": 53, "Base DEF": 160 },
    { "Base HP": 3296, "Base ATK": 68, "Base DEF": 207 },
    { "Base HP": 4937, "Base ATK": 102, "Base DEF": 310 },
    {
      "Base HP": 5464,
      "Base ATK": 113,
      "Base DEF": 343,
      "Elemental Mastery": 24
    },
    {
      "Base HP": 6285,
      "Base ATK": 130,
      "Base DEF": 395,
      "Elemental Mastery": 24
    },
    {
      "Base HP": 6988,
      "Base ATK": 144,
      "Base DEF": 439,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 7809,
      "Base ATK": 161,
      "Base DEF": 491,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 8337,
      "Base ATK": 172,
      "Base DEF": 524,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 9157,
      "Base ATK": 189,
      "Base DEF": 575,
      "Elemental Mastery": 48
    },
    {
      "Base HP": 9684,
      "Base ATK": 200,
      "Base DEF": 608,
      "Elemental Mastery": 72
    },
    {
      "Base HP": 10505,
      "Base ATK": 216,
      "Base DEF": 660,
      "Elemental Mastery": 72
    },
    {
      "Base HP": 11033,
      "Base ATK": 227,
      "Base DEF": 693,
      "Elemental Mastery": 96
    },
    {
      "Base HP": 11854,
      "Base ATK": 244,
      "Base DEF": 745,
      "Elemental Mastery": 96
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Shuumatsuban Ninja Blade",
      desc: ClaymoreDesc_4spin,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 72.24,
          multType: 1
        },
        {
          name: "2-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 71.38,
          multType: 1
        },
        {
          name: "3-Hit (1/2)",
          dmgTypes: ["NA", "Physical"],
          baseMult: 43.43,
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 98.13,
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
        ...heavyPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Yoohoo Art: Fuuin Dash",
      image: "4/4b/Talent_Yoohoo_Art_Fuuin_Dash",
      desc: [
        {
          content: (
            <>
              Sayu curls up into a rolling Fuufuu Windwheel and smashes into
              opponents at high speed, dealing {anemoDmg}. When the duration
              ends, she unleashes a Fuufuu Whirlwind Kick, dealing AoE{" "}
              {anemoDmg}.
            </>
          )
        },
        {
          heading: "Press",
          content: (
            <>
              Enters the Fuufuu Windwheel state, rolling forward a short
              distance before using the Fuufuu Whirlwind Kick.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Rolls about continuously in the Fuufuu Windwheel state, increasing
              Sayu's resistance to interruption while within that state.
              <br />
              During this time, Sayu can control the direction of her roll, and
              can use the skill again to end her Windwheel state early and
              unleash a stronger version of the Fuufuu Whirlwind Kick. The Hold
              version of this skill can trigger Elemental Absorption.
              <br />
              This skill has a maximum duration of 10s and enters CD once its
              effects end. The longer Sayu remains in her Windwheel state, the
              longer the CD.
            </>
          )
        },
        {
          heading: "Elemental Absorption",
          content: "Sayu"
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Fuufuu Windwheel DMG",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 36,
          multType: 2
        },
        {
          name: "Fuufuu Windwheel Elemental DMG",
          dmgTypes: ["ES", "Various"],
          baseMult: 16.8,
          multType: 2
        },
        {
          name: "Press Kick",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 158.4,
          multType: 2,
          getTlBnes: ({ char, selfMCs }) =>
            makeTlBnes(
              checkCharMC(Sayu.buffs, char, selfMCs.BCs, 1),
              "pct",
              [0, 2],
              3.3
            )
        },
        {
          name: "Hold Kick",
          dmgTypes: ["ES", "Elemental"],
          baseMult: 217.6,
          multType: 2,
          getTlBnes: tlBnes_cons2
        },
        {
          name: "Kick's Elemental DMG",
          dmgTypes: ["ES", "Various"],
          baseMult: 76.16,
          multType: 2,
          getTlBnes: tlBnes_cons2
        }
      ],
      otherStats: () => [
        { name: "Max Duration (Hold)", value: "10s" },
        { name: "CD", value: "6s to 11s" }
      ]
    },
    {
      type: "Elemental Burst",
      name: "Yoohoo Art: Mujina Flurry",
      image: "b/be/Talent_Yoohoo_Art_Mujina_Flurry",
      desc: [
        {
          content: (
            <>
              The other super special technique of the Yoohoo Ninja Arts! It
              summons a pair of helping hands for Sayu. Deals {anemoDmg} to
              nearby opponents and heals all nearby party members. The amount of
              HP restored is based on Sayu's ATK. This skill then summons a
              Muji-Muji Daruma.
            </>
          )
        },
        {
          heading: "Muji-Muji Daruma",
          content: (
            <>
              At specific intervals, the Daruma will take one of several actions
              based on the situation around it:
              <br />• If the HP of nearby characters is above 70%, it will
              attack a nearby opponent, dealing {anemoDmg}.
              <br />• If there are active characters with 70% or less HP nearby,
              it will heal the active character with the lowest percentage HP
              left. If there are no opponents nearby, it will heal active
              characters nearby even if they have 70% HP or more.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Burst DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 116.8,
          multType: 2
        },
        {
          name: "Activation Healing",
          isHealing: true,
          baseSType: "ATK",
          baseMult: 92.16,
          multType: 2,
          baseFlat: 577,
          flatType: 3
        },
        {
          name: "Daruma DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 52,
          multType: 2,
          getTlBnes: tlBnes_cons6(0)
        },
        {
          name: "Daruma Healing",
          isHealing: true,
          baseSType: "ATK",
          baseMult: 79.87,
          multType: 2,
          baseFlat: 500,
          flatType: 3,
          getTlBnes: tlBnes_cons6(1)
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
      name: "Someone More Capable",
      image: "0/07/Talent_Someone_More_Capable",
      desc: (
        <>
          When Sayu triggers a Swirl reaction while active, she{" "}
          <Green>heals</Green> all your characters and nearby allies for{" "}
          <Green b>300</Green> <Green>HP</Green>. The healing is increased by{" "}
          <Green b>1.2</Green> <Green>HP</Green> for every point of{" "}
          <Green>Elemental Mastery</Green> she has.
          <br />
          This effect can be triggered once every 2s.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "No Work Today!",
      image: "8/85/Talent_No_Work_Today%21",
      desc: (
        <>
          The Muji-Muji Daruma created by Yoohoo Art: Mujina Flurry gains the
          following effects:
          <br />• When healing a character, it will also heal characters near
          that healed character for <Green b>20%</Green> the amount of{" "}
          <Green>HP</Green>.
          <br />• Increases the AoE of its attack against opponents.
        </>
      )
    },
    {
      type: "Passive",
      name: "Yoohoo Art: Silencer's Secret",
      image: "b/bc/Talent_Yoohoo_Art_Silencer%27s_Secret",
      desc: (
        <>
          When Sayu is in the party, your characters will not startle
          Crystalflies and certain other animals when getting near them.
          <br />
          Check the "Other" sub-category of the "Living Beings / Wildlife"
          section in the Archive for creatures this skill works on.
        </>
      )
    }
  ],
  constellation: [
    {
      name: "Multi-Task no Jutsu",
      image: "2/22/Constellation_Multi-Task_no_Jutsu",
      desc: (
        <>
          The Muji-Muji Daruma created by Yoohoo Art: Mujina Flurry will ignore
          HP limits and can simultaneously attack nearby opponents and heal
          characters.
        </>
      )
    },
    {
      name: "Egress Prep",
      image: "3/31/Constellation_Egress_Prep",
      desc: (
        <>
          Yoohoo Art: Fuuin Dash gains the following effects:
          <br />• <Green>Press Kick DMG</Green> increased by{" "}
          <Green b>3.3%</Green>.
          <br />• <Green>Hold Kick DMG</Green> increased by{" "}
          <Green b>3.3%</Green> for every 0.5s Sayu in Fuufuu Windwheel state,
          up to <Green b>66%</Green>.
        </>
      )
    },
    {
      name: "Eh, the Bunshin Can Handle It",
      image: "8/8c/Constellation_Eh%2C_the_Bunshin_Can_Handle_It",
      desc: "Yoohoo Art: Mujina Flurry"
    },
    {
      name: "Skiving: New and Improved",
      image: "9/9e/Constellation_Skiving_New_and_Improved",
      desc: (
        <>
          Sayu recovers <Green b>1.2</Green> <Green>Energy</Green> when she
          triggers a Swirl reaction. This effect occurs once every 2s.
        </>
      )
    },
    {
      name: "Speed Comes First",
      image: "a/aa/Constellation_Speed_Comes_First",
      desc: "Yoohoo Art: Fuuin Dash"
    },
    {
      name: "Sleep O'Clock",
      image: "2/22/Constellation_Sleep_O%27Clock",
      desc: (
        <>
          Each point of Sayu's <Green>Elemental Mastery</Green> will:
          <br />• Increases <Green>DMG</Green> dealt by the Daruma's attacks by{" "}
          <Green b>0.2%</Green> <Green>ATK</Green>, up to <Green b>400%</Green>{" "}
          ATK.
          <br />• Increases <Green>HP restored</Green> by Daruma by{" "}
          <Green b>3</Green>, up to <Green b>6,000</Green> additional HP.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Ascension 1 Passive Talent",
      desc: ({ ATTRs }) => (
        <>
          {Sayu.pasvTalents[0].desc}{" "}
          <Red>
            Total healing: {300 + Math.round(ATTRs["Elemental Mastery"] * 1.2)}.
            (read-only)
          </Red>
        </>
      ),
      isGranted: checkAscs[1],
      affect: "self"
    },
    {
      index: 1,
      src: "Constellation 2",
      desc: () => Sayu.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "self",
      selfLabels: ["Time (max. 10 sec)"],
      inputs: [0],
      inputTypes: ["text"],
      maxs: [10]
    },
    {
      index: 2,
      src: "Constellation 6",
      desc: () => Sayu.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "self"
    }
  ]
};

export default Sayu;

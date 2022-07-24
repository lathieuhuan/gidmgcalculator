import { addAndTrack, simpleAnTmaker } from "../../../calculators/helpers";
import { applyPct, getFinalTlLv, round2 } from "../../../helpers";
import { geoDmg, Green, GreenOn } from "../../../styledCpns/DataDisplay";
import { CaStamina, doubleCooking, mediumPAs, PolearmDesc_5 } from "../config";
import {
  checkAscs,
  checkCharMC,
  checkCons,
  countElmts,
  makeTlBnes,
  modIsOn,
  xtraTlLv
} from "../helpers";
import tlLvMults from "../tlLvMults";

const YunJin = {
  code: 48,
  name: "Yun Jin",
  icon: "c/cb/Character_Yun_Jin_Thumb",
  sideIcon: "9/9a/Character_Yun_Jin_Side_Icon",
  rarity: 4,
  nation: "Liyue",
  vision: "Geo",
  weapon: "Polearm",
  stats: [
    { "Base HP": 894, "Base ATK": 16, "Base DEF": 62 },
    { "Base HP": 2296, "Base ATK": 41, "Base DEF": 158 },
    { "Base HP": 2963, "Base ATK": 53, "Base DEF": 204 },
    { "Base HP": 4438, "Base ATK": 80, "Base DEF": 306 },
    {
      "Base HP": 4913,
      "Base ATK": 88,
      "Base DEF": 339,
      "Energy Recharge": 6.7
    },
    {
      "Base HP": 5651,
      "Base ATK": 101,
      "Base DEF": 389,
      "Energy Recharge": 6.7
    },
    {
      "Base HP": 6283,
      "Base ATK": 113,
      "Base DEF": 433,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 7021,
      "Base ATK": 126,
      "Base DEF": 484,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 7495,
      "Base ATK": 134,
      "Base DEF": 517,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 8233,
      "Base ATK": 148,
      "Base DEF": 567,
      "Energy Recharge": 13.3
    },
    {
      "Base HP": 8707,
      "Base ATK": 156,
      "Base DEF": 600,
      "Energy Recharge": 20
    },
    {
      "Base HP": 9445,
      "Base ATK": 169,
      "Base DEF": 651,
      "Energy Recharge": 20
    },
    {
      "Base HP": 9919,
      "Base ATK": 178,
      "Base DEF": 684,
      "Energy Recharge": 26.7
    },
    {
      "Base HP": 10657,
      "Base ATK": 191,
      "Base DEF": 734,
      "Energy Recharge": 26.7
    }
  ],
  actvTalents: [
    {
      type: "Normal Attack",
      name: "Cloud-Grazing Strike",
      desc: PolearmDesc_5,
      stats: [
        {
          name: "1-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 40.51,
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
          baseMult: [22.96, 27.52],
          multType: 1
        },
        {
          name: "4-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: [23.99, 28.81],
          multType: 1
        },
        {
          name: "5-Hit",
          dmgTypes: ["NA", "Physical"],
          baseMult: 67.34,
          multType: 1
        },
        {
          name: "Charged Attack",
          dmgTypes: ["CA", "Physical"],
          baseMult: 121.69,
          multType: 1
        },
        CaStamina[25],
        ...mediumPAs
      ]
    },
    {
      type: "Elemental Skill",
      name: "Whirling Opener",
      image: "9/92/Talent_Opening_Flourish",
      desc: [
        {
          heading: "Press",
          content: (
            <>
              Flourishes her polearm in a cloud-grasping stance, dealing{" "}
              {geoDmg}.
            </>
          )
        },
        {
          heading: "Hold",
          content: (
            <>
              Takes up the Opening Flourish stance and charges up, forming a
              shield. DMG Absorption is based on Yun Jin's Max HP and has 150%
              effectiveness against all Elemental DMG and Physical DMG. The
              shield lasts until she finishes unleashing her Elemental Skill.
              <br />
              When the skill is released, when its duration ends, or when the
              shield breaks, Yun Jin will unleash the charged energy as an
              attack, dealing {geoDmg}.
              <br />
              Based on the time spent charging, it will either unleash an attack
              at Charge Level 1 or Level 2.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons5,
      stats: [
        {
          name: "Press DMG",
          dmgTypes: ["ES", "Elemental"],
          baseSType: "DEF",
          baseMult: 149.12,
          multType: 2
        },
        {
          name: "Charge Level 1 DMG",
          dmgTypes: ["ES", "Elemental"],
          baseSType: "DEF",
          baseMult: 260.96,
          multType: 2
        },
        {
          name: "Charge Level 2 DMG",
          dmgTypes: ["ES", "Elemental"],
          baseSType: "DEF",
          baseMult: 372.8,
          multType: 2
        },
        {
          name: "Shield DMG Absorption",
          baseSType: "HP",
          baseMult: 12,
          multType: 2,
          baseFlat: 1155,
          flatType: 3
        }
      ],
      otherStats: () => [{ name: "CD", value: "9s" }]
    },
    {
      type: "Elemental Burst",
      name: "Cliffbreaker's Banner",
      image: "5/59/Talent_Cliffbreaker%27s_Banner",
      desc: [
        {
          content: (
            <>
              Deals AoE {geoDmg} and grants all nearby party members a Flying
              Cloud Flag Formation.
            </>
          )
        },
        {
          heading: "Flying Cloud Flag Formation",
          content: (
            <>
              When <Green>Normal Attack DMG</Green> is dealt to opponents,{" "}
              <Green>Bonus DMG</Green> will be dealt based on Yun Jin's{" "}
              <Green>current DEF</Green>.
            </>
          )
        },
        {
          content: (
            <>
              The effects of this skill will be cleared after a set duration or
              after being triggered a specific number of times.
              <br />
              When one Normal Attack hits multiple opponents, the effect is
              triggered multiple times according to the number of opponents hit.
              The number of times that the effect is triggered is counted
              independently for each member of the party with Flying Cloud Flag
              Formation.
            </>
          )
        }
      ],
      getXtraLv: xtraTlLv.cons3,
      stats: [
        {
          name: "Skill DMG",
          dmgTypes: ["EB", "Elemental"],
          baseMult: 244,
          multType: 2
        },
        {
          name: "DMG Increase",
          baseSType: "DEF",
          baseMult: 32.16,
          multType: 2,
          getTlBnes: ({ char, selfMCs, charData, partyData }) => {
            const args = [true, char, selfMCs.BCs, charData, partyData];
            return makeTlBnes(
              true,
              "mult",
              [1, 4],
              YunJin.buffs[0].getXtraMult(args)
            );
          }
        }
      ],
      otherStats: () => [
        { name: "Duration", value: "12s" },
        { name: "Trigger Quota", value: "30" },
        { name: "CD", value: "15s" }
      ],
      energyCost: 60
    }
  ],
  pasvTalents: [
    {
      type: "Ascension 1",
      name: "True to Oneself",
      image: "3/34/Talent_True_to_Oneself",
      desc: (
        <>
          Using Opening Flourish at the precise moment when Yun Jin is attacked
          will unleash its Level 2 Charged (Hold) form.
        </>
      )
    },
    {
      type: "Ascension 4",
      name: "No Mere Traditionalist",
      image: "f/fa/Talent_Breaking_Conventions",
      get desc() {
        return (
          <>
            {this.lines[0]} <Green b>2.5%/5%/7.5%/11.5%</Green> {this.lines[1]}
          </>
        );
      },
      lines: [
        <>
          The <Green>Normal Attack DMG Bonus</Green> granted by Flying Cloud
          Flag Formation is further increased by
        </>,
        <>
          of Yun Jin's <Green>DEF</Green> when the party contains characters of
          1/2/3/4 Elemental Types, respectively.
        </>
      ]
    },
    {
      type: "Passive",
      name: "Light Nourishment",
      image: "3/39/Talent_Light_Nourishment",
      desc: doubleCooking("Yun Jin", "Food with Adventure-related effects")
    }
  ],
  constellation: [
    {
      name: "Stylized Equestrianism",
      image: "c/cd/Constellation_Thespian_Gallop",
      desc: (
        <>
          Opening Flourish's <Green>CD</Green> is decreased by{" "}
          <Green b>18%</Green>.
        </>
      )
    },
    {
      name: "Myriad Mise-en-Scène",
      image: "e/e5/Constellation_Myriad_Mise-En-Sc%C3%A8ne",
      desc: (
        <>
          After Cliffbreaker's Banner is unleashed, all nearby party members's{" "}
          <Green>Normal Attack DMG</Green> is increased by <Green b>15%</Green>{" "}
          for 10s.
        </>
      )
    },
    {
      name: "Seafaring General",
      image: "4/4c/Constellation_Seafaring_General",
      desc: "Cliffbreaker's Banner"
    },
    {
      name: "Ascend, Cloud-Hanger",
      image: "a/a4/Constellation_Flower_and_a_Fighter",
      desc: (
        <>
          When Yun Jin trigger the Crystallize Reaction, her <Green>DEF</Green>{" "}
          is increased by <Green b>20%</Green> for 12s.
        </>
      )
    },
    {
      name: "Famed Throughout the Land",
      image: "f/f4/Constellation_Famed_Throughout_the_Land",
      desc: "Opening Flourish"
    },
    {
      name: "Decorous Harmony",
      image: "1/10/Constellation_Decorous_Harmony",
      desc: (
        <>
          Characters under the effects of the Flying Cloud Flag Formation have
          their <Green>Normal ATK SPD</Green> increased by <Green b>12%</Green>.
        </>
      )
    }
  ],
  buffs: [
    {
      index: 0,
      src: "Elemental Burst",
      desc: () => YunJin.actvTalents[2].desc[1].content,
      isGranted: () => true,
      affect: "party",
      labels: ["Current DEF", "Elemental Burst Level"],
      inputs: [0, 1],
      inputTypes: ["text", "text"],
      maxs: [9999, 13],
      addFinalBnes: (obj) => {
        const { toSelf, inputs, partyData } = obj;
        const DEF = toSelf ? obj.ATTRs.DEF : inputs[0];
        const level = toSelf
          ? getFinalTlLv(obj.char, YunJin.actvTalents[2], partyData)
          : inputs[1];
        let desc = `${obj.tkDesc} / Lv. ${level}`;
        let tlMult = 32.16 * tlLvMults[2][level];
        const args2 = [toSelf, obj.char, obj.charBCs, obj.charData, partyData];
        const xtraMult = YunJin.buffs[0].getXtraMult(args2);
        if (xtraMult) {
          tlMult += xtraMult;
          desc += ` / A4: ${xtraMult}% extra`;
        }
        const bnValue = applyPct(DEF, tlMult);
        desc += ` / ${round2(tlMult)}% of ${DEF} DEF`;
        addAndTrack(desc, obj.hitBnes, "NA.flat", bnValue, obj.tracker);
      },
      getXtraMult: ([toSelf, char, BCs, charData, partyData]) => {
        let result = 0;
        if (
          (toSelf && checkCharMC(YunJin.buffs, char, BCs, 1)) ||
          (!toSelf && modIsOn(BCs, 1))
        ) {
          const numOfElmts = countElmts(charData, partyData);
          result += numOfElmts * 2.5;
          if (numOfElmts === 4) result += 1.5;
        }
        return result;
      }
    },
    {
      index: 1,
      src: "Ascension 4 Passive Talent",
      desc: ({ charData, partyData }) => {
        const n = countElmts(charData, partyData);
        return (
          <>
            {YunJin.pasvTalents[1].lines[0]}{" "}
            <GreenOn on={n === 1}>2.5%</GreenOn>/
            <GreenOn on={n === 2}>5%</GreenOn>/
            <GreenOn on={n === 3}>7.5%</GreenOn>/
            <GreenOn on={n === 4}>11.5%</GreenOn>{" "}
            {YunJin.pasvTalents[1].lines[1]}
          </>
        );
      },
      isGranted: checkAscs[4],
      affect: "party"
    },
    {
      index: 2,
      src: "Constellation 2",
      desc: () => YunJin.constellation[1].desc,
      isGranted: checkCons[2],
      affect: "party",
      addBnes: simpleAnTmaker("hitBnes", "NA.pct", 15)
    },
    {
      index: 3,
      src: "Constellation 4",
      desc: () => YunJin.constellation[3].desc,
      isGranted: checkCons[4],
      affect: "self",
      addBnes: simpleAnTmaker("ATTRs", "DEF%", 20)
    },
    {
      index: 4,
      src: "Constellation 6",
      desc: () => YunJin.constellation[5].desc,
      isGranted: checkCons[6],
      affect: "party",
      addBnes: simpleAnTmaker("ATTRs", "Normal ATK SPD", 12)
    }
  ]
};

export default YunJin;

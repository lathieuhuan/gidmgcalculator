import type { CharInfo, DataCharacter, ModifierCtrl, PartyData } from "@Src/types";
import { Anemo, Green, Lightgold, Red, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, LIGHT_PAs } from "../constants";
import { round, findByIndex } from "@Src/utils";
import { finalTalentLv, applyModifier } from "@Src/utils/calculation";
import { charModIsInUse, checkAscs, checkCons, talentBuff } from "../utils";

const isInfusedHydroES = (charBuffCtrls: ModifierCtrl[]) => {
  return findByIndex(charBuffCtrls, 1)?.inputs?.includes(2);
};

const getESBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({
    char,
    dataChar: Wanderer,
    talentType: "ES",
    partyData,
  });
  return {
    NA: round(32.98 * TALENT_LV_MULTIPLIERS[5][level], 1),
    CA: round(26.39 * TALENT_LV_MULTIPLIERS[5][level], 1),
  };
};

const Wanderer: DataCharacter = {
  code: 63,
  name: "Wanderer",
  // icon: "f/f2/Character_Wanderer_Thumb",
  icon: "f/f8/Wanderer_Icon",
  sideIcon: "5/54/Character_Wanderer_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "catalyst",
  stats: [
    [791, 26, 47],
    [2053, 66, 123],
    [2731, 88, 163],
    [4086, 131, 244],
    [4568, 147, 273],
    [5256, 169, 313],
    [5899, 190, 352],
    [6593, 213, 394],
    [7076, 228, 423],
    [7777, 251, 465],
    [8259, 266, 493],
    [8968, 289, 536],
    [9450, 305, 564],
    [10164, 328, 607],
  ],
  bonusStat: { type: "cRate_", value: 4.8 },
  NAsConfig: {
    name: "Yuuban Meigen",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: { root: 68.71, scale: 1 } },
        { name: "2-Hit", multFactors: { root: 65.02, scale: 1 } },
        { name: "3-Hit (1/2)", multFactors: { root: 47.64, scale: 1 } },
        {
          name: "Wind Arrow DMG (A4) (1/4)",
          attPatt: "none",
          multFactors: { root: 35, scale: 0 },
          getTalentBuff: ({ char, selfBuffCtrls }) => {
            const ESisInUse = charModIsInUse(Wanderer.buffs || [], char, selfBuffCtrls, 0);
            return talentBuff([ESisInUse && checkCons[1](char), "mult_", [true, 4], 25]);
          },
        },
      ],
    },
    CA: {
      stats: [{ name: "Charged Attack", multFactors: { root: 132.08, scale: 2 } }],
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Hanega: Song of the Wind",
      image: "b/b0/Talent_Hanega_Song_of_the_Wind",
      stats: [{ name: "Skill DMG", multFactors: 95.2 }],
      //   getExtraStats: () => [{ name: "CD", value: "15s" }],
    },
    EB: {
      name: "Kyougen: Five Ceremonial Plays",
      image: "6/64/Talent_Kyougen_Five_Ceremonial_Plays",
      stats: [{ name: "Skill DMG (1/5)", multFactors: 147.2 }],
      energyCost: 60,
    },
  },
  passiveTalents: [
    {
      name: "Jade-Claimed Flower",
      image: "9/95/Talent_Jade-Claimed_Flower",
      get desc() {
        return (
          <>
            {this.xtraDesc?.[0]} <br />• Electro: When Normal and Charged Attacks hit opponents, 0.8 Energy will be
            restored. Energy can be restored in this manner every 0.2s.
            <br />
            {this.xtraDesc?.[1]}
          </>
        );
      },
      xtraDesc: [
        <>
          If Hanega: Song of the Wind [ES] comes into contact with Hydro/Pyro/Cryo/Electro, the Windfavored state will
          obtain buffs:
          <br />• Hydro: <Green>Kuugoryoku Point cap</Green> increases by <Green b>20</Green>.
          <br />• Pyro: <Green>ATK</Green> increases by <Green b>30%</Green>.
          <br />• Cryo: <Green>CRIT Rate</Green> increases by <Green b>20%</Green>.
        </>,
        <>You can have 2 different kinds of these buffs simultaneously.</>,
      ],
    },
    {
      name: "Gales of Reverie",
      image: "4/4f/Talent_Gales_of_Reverie",
      desc: (
        <>
          When The Wanderer hits opponents with Normal and Charged Attacks in his Windfavored state [~ES], he has a 16%
          chance to obtain the Descent effect: The next time The Wanderer sprints while in this instance of the
          Windfavored state, this effect will be removed, this sprint instance will not consume any Kuugoryoku Points,
          and he will fire off <Green b>4</Green> wind arrows that deal <Green b>35%</Green> of his <Green>ATK</Green>{" "}
          as <Anemo>Anemo DMG</Anemo> each.
          <br />
          For each Normal and Charged Attack that does not produce this effect, the next attack of those kinds will have
          a 12% increase chance of producing it. The calculation of the effect production is done once every 0.1s.
        </>
      ),
    },
    {
      name: "Strum the Swirling Winds",
      image: "8/85/Talent_Strum_the_Swirling_Winds",
      desc: <>Mora expended when ascending Bows and Catalysts is decreased by 50%.</>,
    },
  ],
  constellation: [
    {
      name: "Shoban: Ostentatious Plumage",
      image: "c/c9/Constellation_Shoban_Ostentatious_Plumage",
      desc: (
        <>
          When in the Windfavored State [~ES], The Wanderer's <Green>Normal and Charged Attack SPD</Green> is increased
          by <Green b>10%</Green>.
          <br />
          Additionally, the wind arrows fired by the Passive Talent “Gales of Reverie” <Green>[A4]</Green> will deal{" "}
          <Green b>25%</Green> <Green>additional ATK</Green> as DMG.
        </>
      ),
    },
    {
      name: "Niban: Moonlit Isle Amidst White Waves",
      image: "4/4a/Constellation_Niban_Moonlit_Isle_Amidst_White_Waves",
      desc: (
        <>
          When in the Windfavored State [~ES], Kyougen: Five Ceremonial Plays <Green>[EB] DMG</Green> will be increased
          by <Green b>4%</Green> per point of{" "}
          <Green>difference between the max and the current amount of Kuugoryoku Points</Green> when using this skill.
          Maximum <Rose>200%</Rose>.
        </>
      ),
    },
    { name: "Sanban: Moonflower Kusemai", image: "c/c0/Constellation_Sanban_Moonflower_Kusemai" },
    {
      name: "Yonban: Set Adrift into Spring",
      image: "7/77/Constellation_Yonban_Set_Adrift_into_Spring",
      desc: (
        <>
          When casting Hanega: Song of the Wind [ES], should the Passive Talent “Jade-Claimed Flower” [A1] be triggered,
          the character will gain enhancement effects in correspondence to the contacted Elemental Type(s), and also
          gain a random untriggered enhancement effect.
        </>
      ),
    },
    {
      name: "Matsuban: Ancient Illuminator From Abroad",
      image: "8/85/Constellation_Matsuban_Ancient_Illuminator_From_Abroad",
    },
    {
      name: "Shugen: The Curtains' Melancholic Sway",
      image: "0/01/Constellation_Shugen_The_Curtains%27_Melancholic_Sway",
      desc: (
        <>
          When The Wanderer actively hits opponents with Normal Attacks while in the Windfavored state [~ES], the
          following effects will occur:
          <br />• Deals an additional instance of Normal Attack, dealing 40% of the attack's original DMG.
          <br />• When Restores 4 Kuugoryoku Points to The Wanderer. Kuugoryoku Points can be restored in this manner
          once every 0.2s. This restoration can occur 5 times within one Windfavored duration.
        </>
      ),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => {
        const { NA, CA } = getESBuffValue(char, partyData);
        return (
          <>
            Increases <Green>Normal Attack DMG</Green> by <Green b>{round(1 + NA / 100, 3)}</Green> times and{" "}
            <Green>Charged Attack DMG</Green> by <Green b>{round(1 + CA / 100, 3)}</Green> times.
            <br />• At <Lightgold>C1</Lightgold>, increases <Green>Normal and Charged Attack SPD</Green> by{" "}
            <Green b>10%</Green>, increases <Green>Wind Arrow DMG</Green> [~A4] by <Green b>25%</Green> of{" "}
            <Green>ATK</Green>.
          </>
        );
      },
      applyBuff: ({ totalAttr, attPattBonus, char, partyData, desc, tracker }) => {
        const { NA, CA } = getESBuffValue(char, partyData);
        applyModifier(desc, attPattBonus, ["NA.multPlus_", "CA.multPlus_"], [NA, CA], tracker);

        if (checkCons[1](char)) {
          applyModifier(desc, totalAttr, ["naAtkSpd_", "caAtkSpd_"], 10, tracker);
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          {Wanderer.passiveTalents[0].xtraDesc?.[0]} {Wanderer.passiveTalents[0].xtraDesc?.[1]}
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          label: "Infused element 1",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
        {
          label: "Infused element 2",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
        {
          label: "Random infused element (C4)",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        if (inputs.includes(0)) {
          applyModifier(desc, totalAttr, "atk_", 30, tracker);
        }
        if (inputs.includes(1)) {
          applyModifier(desc, totalAttr, "cRate_", 20, tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: ({ charBuffCtrls }) => {
        return (
          <>
            {Wanderer.constellation[1].desc}{" "}
            <Red>Kuugoryoku Points cap: {isInfusedHydroES(charBuffCtrls) ? 120 : 100}.</Red>
          </>
        );
      },
      isGranted: checkCons[2],
      inputConfigs: [
        {
          label: "Current Kuugoryoku Points",
          type: "text",
          max: 120,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, charBuffCtrls, desc, tracker }) => {
        const pointDifference = (isInfusedHydroES(charBuffCtrls) ? 120 : 100) - (inputs[0] || 0);
        const buffValue = Math.min(Math.max(pointDifference, 0) * 4, 200);
        applyModifier(desc, attPattBonus, "EB.pct_", buffValue, tracker);
      },
    },
  ],
};

export default Wanderer;

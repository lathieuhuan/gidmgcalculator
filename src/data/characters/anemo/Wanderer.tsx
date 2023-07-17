import type { AppCharacter, CharInfo, DefaultAppCharacter, ModifierCtrl, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Lightgold, Red, Rose } from "@Src/pure-components";
import { findByIndex, round } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, talentBuff } from "../utils";

const isHydroInfusedES = (args: { char: CharInfo; charBuffCtrls: ModifierCtrl[] }) => {
  return checkCons[4](args.char) ? findByIndex(args.charBuffCtrls, 1)?.inputs?.includes(2) : false;
};

const getESBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({
    char,
    charData: Wanderer as AppCharacter,
    talentType: "ES",
    partyData,
  });
  return {
    NA: round(32.98 * TALENT_LV_MULTIPLIERS[5][level], 1),
    CA: round(26.39 * TALENT_LV_MULTIPLIERS[5][level], 1),
  };
};

const Wanderer: DefaultAppCharacter = {
  code: 63,
  name: "Wanderer",
  icon: "f/f8/Wanderer_Icon",
  sideIcon: "6/67/Wanderer_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 60,
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
      applyBuff: ({ totalAttr, attPattBonus, calcItemBonuses, char, partyData, desc, tracker }) => {
        const { NA, CA } = getESBuffValue(char, partyData);
        applyModifier(desc, attPattBonus, ["NA.multPlus", "CA.multPlus"], [NA, CA], tracker);

        if (checkCons[1](char)) {
          applyModifier(desc, totalAttr, ["naAtkSpd_", "caAtkSpd_"], 10, tracker);

          calcItemBonuses.push({
            ids: "NA.0",
            bonus: talentBuff([true, "mult_", [true, 4], 25]),
          });
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          If Hanega: Song of the Wind [ES] comes into contact with Hydro/Pyro/Cryo/Electro, the Windfavored state will
          obtain buffs:
          <br />• Hydro: <Green>Kuugoryoku Point cap</Green> increases by <Green b>20</Green>.
          <br />• Pyro: <Green>ATK</Green> increases by <Green b>30%</Green>.
          <br />• Cryo: <Green>CRIT Rate</Green> increases by <Green b>20%</Green>.
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
      desc: (obj) => {
        return (
          <>
            When in the Windfavored State [~ES], Kyougen: Five Ceremonial Plays <Green>[EB] DMG</Green> will be
            increased by <Green b>4%</Green> per point of{" "}
            <Green>difference between the max and the current amount of Kuugoryoku Points</Green> when using this skill.
            Maximum <Rose>200%</Rose>. <Red>Kuugoryoku Points cap: {isHydroInfusedES(obj) ? 120 : 100}.</Red>
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
      applyBuff: (obj) => {
        const difference = (isHydroInfusedES(obj) ? 120 : 100) - (obj.inputs[0] || 0);
        const buffValue = Math.min(Math.max(difference, 0) * 4, 200);
        applyModifier(obj.desc, obj.attPattBonus, "EB.pct_", buffValue, obj.tracker);
      },
    },
  ],
};

export default Wanderer as AppCharacter;

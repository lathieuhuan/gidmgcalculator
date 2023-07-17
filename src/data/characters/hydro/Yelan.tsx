import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { countVision } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Yelan: DefaultAppCharacter = {
  code: 51,
  name: "Yelan",
  icon: "d/d3/Yelan_Icon",
  sideIcon: "9/9f/Yelan_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "hydro",
  weaponType: "bow",
  EBcost: 70,
  innateBuffs: [
    {
      src: EModSrc.A1,
      desc: ({ charData, partyData }) => {
        const visionCount = countVision(partyData, charData);
        const n = Object.keys(visionCount).length;
        return (
          <>
            When the party has 1/2/3/4 Elemental Types, Yelan's <Green>Max HP</Green> is increased by{" "}
            <Green className={n === 1 ? "" : "opacity-50"}>6%</Green>/
            <Green className={n === 2 ? "" : "opacity-50"}>12%</Green>/
            <Green className={n === 3 ? "" : "opacity-50"}>18%</Green>/
            <Green className={n === 4 ? "" : "opacity-50"}>30%</Green>.
          </>
        );
      },
      isGranted: checkAscs[1],
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        const visionCount = countVision(partyData, charData);
        const numOfElmts = Object.keys(visionCount).length;
        applyModifier(desc, totalAttr, "hp_", (numOfElmts === 4 ? 5 : numOfElmts) * 6, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          During Depth-Clarion Dice [EB], your own active character gains <Green b>1%</Green> <Green>DMG Bonus</Green>{" "}
          which will increase by a further <Green b>3.5%</Green> every second. Maximum <Rose>50%</Rose>.
        </>
      ),
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          label: "Stacks (max 14)",
          type: "text",
          max: 14,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct_", 1 + 3.5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Increases all party members' <Green>Max HP</Green> by <Green b>10%</Green> for 25s for every opponent marked
          by Lifeline [~ES] when the Lifeline explodes. Maximum <Rose>40%</Rose>.
        </>
      ),
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "hp_", 10 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Yelan as AppCharacter;

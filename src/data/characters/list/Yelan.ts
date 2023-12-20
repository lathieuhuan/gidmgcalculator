import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
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
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.A1,
      description: `When the party has 1/2/3/4 Elemental Types, Yelan's {Max HP}#[k] is increased by
      {6%}#[v]/{12%}#[v]/{18%}#[v]/{30%}#[v]`,
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
      description: `During Depth-Clarion Dice [EB], your own active character gains {1%}#[v] {DMG Bonus}#[k] which
      will increase by a further {3.5%}#[v] every second. Maximum {50%}#[m].`,
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
      description: `Increases all party members' {Max HP}#[k] by {10%}#[v] for 25s for every opponent marked by
      Lifeline [~ES] when the Lifeline explodes. Maximum {40%}#[m].`,
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

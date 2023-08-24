import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Keqing: DefaultAppCharacter = {
  code: 9,
  name: "Keqing",
  icon: "5/52/Keqing_Icon",
  sideIcon: "6/60/Keqing_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "electro",
  weaponType: "sword",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `After recasting Stellar Restoration [ES] while a Lightning Stiletto is present, Keqing gains an
      {Electro Infusion}#[electro] for 5s.`,
      isGranted: checkAscs[1],
      infuseConfig: {
        overwritable: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `After casting Starward Sword [EB], Keqing's {CRIT Rate}#[gr] and {Energy Recharge}#[gr] are
      increased by {15%}#[b,gr] for 8s.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", ["cRate_", "er_"], 15),
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `For 10s after Keqing triggers an Electro-related Elemental Reaction, her {ATK}#[gr] is increased by
      {25%}#[b,gr].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 25),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `When initiating a Normal Attack, a Charged Attack, Elemental Skill or Elemental Burst, Keqing
      gains a {6%}#[b,gr] {Electro DMG Bonus}#[gr] for 8s. Effects triggered by different sources are considered
      independent entities.`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "electro", 6 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Keqing as AppCharacter;

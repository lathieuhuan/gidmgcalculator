import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Rosaria: DefaultAppCharacter = {
  code: 32,
  name: "Rosaria",
  icon: "3/35/Rosaria_Icon",
  sideIcon: "0/0e/Rosaria_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `When Rosaria strikes an opponent from behind using Ravaging Confession [ES], her {CRIT Rate}#[k]
      increased by {12%}#[v] for 5s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      description: `Casting Rites of Termination [EB] increases {CRIT Rate}#[k] of all nearby party members (excluding
      Rosaria) by {15%}#[v] of Rosaria's {CRIT Rate}#[k] for 10s. Maximum {15%}#[m].`,
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          label: "CRIT Rate",
          type: "text",
          max: 100,
          for: "teammate",
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = Math.round((inputs[0] || 0) * 15) / 100;
        applyModifier(desc, totalAttr, "cRate_", buffValue, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `When Rosaria deals a CRIT Hit, her {Normal Attack Speed and DMG}#[k] increases by {10%}#[v]
      for 4s.`,
      isGranted: checkCons[1],
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "NA.pct_", 10, tracker);
        applyModifier(desc, totalAttr, "naAtkSpd_", 10, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      description: `Rites of Termination's [EB] attack decreases opponents' {Physical RES}#[k] by {20%}#[v] for 10s.`,
      isGranted: checkCons[6],
      applyDebuff: makeModApplier("resistReduct", "phys", 20),
    },
  ],
};

export default Rosaria as AppCharacter;

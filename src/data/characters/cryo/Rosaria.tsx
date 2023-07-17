import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green, Red, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
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
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Rosaria strikes an opponent from behind using Ravaging Confession [ES], her <Green>CRIT Rate</Green>{" "}
          increased by <Green b>12%</Green> for 5s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      desc: ({ inputs }) => (
        <>
          Casting Rites of Termination [EB] increases <Green>CRIT Rate</Green> of all nearby party members (excluding
          Rosaria) by <Green b>15%</Green> of Rosaria's <Green>CRIT Rate</Green> for 10s. Maximum <Rose>15%</Rose>.{" "}
          <Red>CRIT Rate bonus: {Math.round((inputs[0] || 0) * 15) / 100}%.</Red>
        </>
      ),
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
      desc: () => (
        <>
          When Rosaria deals a CRIT Hit, her <Green>Normal Attack Speed and DMG</Green> increases by{" "}
          <Green b>10%</Green> for 4s.
        </>
      ),
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
      desc: () => (
        <>
          Rites of Termination's [EB] attack decreases opponents' <Green>Physical RES</Green> by <Green b>20%</Green>{" "}
          for 10s.
        </>
      ),
      isGranted: checkCons[6],
      applyDebuff: makeModApplier("resistReduct", "phys", 20),
    },
  ],
};

export default Rosaria as AppCharacter;

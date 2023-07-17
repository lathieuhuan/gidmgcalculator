import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Ganyu: DefaultAppCharacter = {
  code: 28,
  name: "Ganyu",
  icon: "7/79/Ganyu_Icon",
  sideIcon: "3/3a/Ganyu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 60,
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After firing a Frostflake Arrow, the <Green>CRIT Rate</Green> of subsequent <Green>Frostflake Arrows</Green>{" "}
          and their resulting <Green>bloom effects</Green> is increased by <Green b>20%</Green> for 5s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBonuses }) => {
        calcItemBonuses.push({
          ids: [],
          bonus: talentBuff([true, "cRate_", [true, 1], 20]),
        });
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          Celestial Shower [EB] grants a <Green b>20%</Green> <Green>Cryo DMG Bonus</Green> to active members in the
          AoE.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "cryo", 20),
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Opponents within Celestial Shower [EB] take increased DMG which begins at <Green b>5%</Green> and increases by{" "}
          <Green b>5%</Green> every 3s. Maximum <Rose>25%</Rose>.
        </>
      ),
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct_", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      desc: () => (
        <>
          Charge Level 2 Frostflake Arrows or Frostflake Arrow Blooms decrease opponents' <Green>Cryo RES</Green> by{" "}
          <Green b>15%</Green> for 6s upon hit.
        </>
      ),
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "cryo", 15),
    },
  ],
};

export default Ganyu as AppCharacter;

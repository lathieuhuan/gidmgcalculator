import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Thoma: DefaultAppCharacter = {
  code: 43,
  name: "Thoma",
  icon: "5/5b/Thoma_Icon",
  sideIcon: "e/e9/Thoma_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 80,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          <Green>Fiery Collapse DMG</Green> [~EB] is increased by <Green b>2.2%</Green> of Thoma's <Green>Max HP</Green>
          .
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBonuses, totalAttr }) => {
        calcItemBonuses.push({
          ids: "EB.0",
          bonus: talentBuff([true, "flat", [true, 4], applyPercent(totalAttr.hp, 2.2)]),
        });
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          When your current active character obtains or refreshes a Blazing Barrier, this character's{" "}
          <Green>Shield Strength</Green> will increase by <Green b>5%</Green> for 6s. Max <Rose>5</Rose> stacks, each
          stack can be obtained once every 0.3 seconds.
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      isGranted: checkCons[6],
      desc: () => (
        <>
          When a Blazing Barrier is obtained or refreshed, all party members'{" "}
          <Green>Normal, Charged, and Plunging Attack DMG</Green> is increased by <Green b>15%</Green> for 6s.
        </>
      ),
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("attPattBonus", [...NCPA_PERCENTS], 15),
    },
  ],
};

export default Thoma as AppCharacter;

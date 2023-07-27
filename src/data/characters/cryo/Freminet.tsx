import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Freminet: DefaultAppCharacter = {
  code: 74,
  name: "Freminet",
  icon: "https://images2.imgbox.com/fa/bf/A2tmjH1a_o.png",
  sideIcon: "",
  rarity: 4,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    ES: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.C1,
      desc: () => (
        <>
          The <Green>CRIT Rate of Shattering Pressure</Green> will be increased by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        const ids = Array.from({ length: 8 }).map((_, i) => `ES.${i + 1}`);
        calcItemBuffs.push(exclBuff(EModSrc.C1, ids, "cRate_", 15));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Stalking mode",
      affect: EModAffect.SELF,
      desc: () => (
        <>
          While in Stalking mode, <Green>Frost</Green> released by his Normal Attacks deal <Green b>200%</Green> of
          their original DMG.
        </>
      ),
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff("Stalking mode", "ES.0", "multPlus", 100));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Freminet triggers Shatter against opponents, <Green>Shattering Pressure DMG</Green> [~ES] will be
          increased by <Green>40%</Green> for 5s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ calcItemBuffs }) => {
        const ids = Array.from({ length: 8 }).map((_, i) => `ES.${i + 1}`);
        calcItemBuffs.push(exclBuff(EModSrc.A4, ids, "pct_", 40));
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his <Green>ATK</Green> will be
          increased by <Green b>9%</Green> for 6s. Max <Rose>2</Rose> stacks. This can be triggered once every 0.3s.
        </>
      ),
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 2,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 9 * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his <Green>CRIT DMG</Green> will be
          increased by <Green b>12%</Green> for 6s. Max <Rose>3</Rose> stacks. This can be triggered once every 0.3s.
        </>
      ),
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 12 * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "cDmg_", buffValue, tracker);
      },
    },
  ],
};

export default Freminet as AppCharacter;

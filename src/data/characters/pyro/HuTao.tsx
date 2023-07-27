import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Pyro } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const HuTao: DefaultAppCharacter = {
  code: 31,
  name: "Hu Tao",
  GOOD: "HuTao",
  icon: "e/e9/Hu_Tao_Icon",
  sideIcon: "8/8c/Hu_Tao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.C2,
      desc: () => (
        <>
          Increases the Blood Blossom <Green>[ES] DMG</Green> by an amount equal to <Green b>10%</Green> of Hu Tao's{" "}
          <Green>Max HP</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.flat", Math.round(totalAttr.hp / 10), tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Increases Hu Tao's <Green>ATK</Green> based on her <Green>Max HP</Green>, and grants her a{" "}
          <Pyro>Pyro Infusion</Pyro>.
        </>
      ),
      applyFinalBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv({
          char,
          charData: HuTao as AppCharacter,
          talentType: "ES",
          partyData,
        });
        let buffValue = applyPercent(totalAttr.hp, 3.84 * TALENT_LV_MULTIPLIERS[5][level]);
        buffValue = Math.min(buffValue, totalAttr.base_atk * 4);
        applyModifier(desc, totalAttr, "atk", buffValue, tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      desc: () => (
        <>
          When a Paramita Papilio [ES] state ends, all allies in the party (excluding Hu Tao) will have their{" "}
          <Green>CRIT Rate</Green> increased by <Green b>12%</Green> for 8s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Hu Tao's HP is equal to or less than 50%, her <Green>Pyro DMG Bonus</Green> is increased by{" "}
          <Green b>33%</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "pyro", 33),
    },
    {
      index: 5,
      src: EModSrc.C4,
      affect: EModAffect.TEAMMATE,
      desc: () => (
        <>
          Upon defeating an enemy affected by a Blood Blossom that Hu Tao applied herself, all nearby allies in the
          party (excluding Hu Tao) will have their <Green>CRIT Rate</Green> increased by <Green b>12%</Green> for 15s.
        </>
      ),
      isGranted: checkCons[4],
      applyFinalBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Hu Tao's HP drops below 25%, or when she suffers a lethal strike, her <Green>CRIT Rate</Green> is
          increased by <Green b>100%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "cRate_", 100),
    },
  ],
};

export default HuTao as AppCharacter;

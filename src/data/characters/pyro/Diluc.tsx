import type { AttributeStat, AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green, Lightgold, Pyro, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Diluc: DefaultAppCharacter = {
  code: 20,
  name: "Diluc",
  icon: "3/3d/Diluc_Icon",
  sideIcon: "6/67/Diluc_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "claymore",
  EBcost: 40,
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      applyBuff: ({ char, totalAttr, tracker }) => {
        if (checkAscs[4](char)) {
          applyModifier(`Self / ${EModSrc.A4}`, totalAttr, "pyro", 20, tracker);
        }
      },
      desc: () => (
        <>
          After casting Dawn [EB], Diluc gains a <Pyro>Pyro Infusion</Pyro>.
          <br />• At <Lightgold>A4</Lightgold>, Diluc gains <Green b>20%</Green> <Green>Pyro DMG Bonus</Green> during
          this duration.
        </>
      ),
      infuseConfig: {
        overwritable: true,
      },
    },
    {
      index: 2,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Diluc deals <Green b>15%</Green> <Green>more DMG</Green> to opponents whose HP is above 50%.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "all.pct_", 15),
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Diluc takes DMG, his <Green>ATK</Green> increases by <Green b>10%</Green> and <Green>ATK SPD</Green>{" "}
          increases by <Green b>5%</Green> for 10s, up to <Rose>3</Rose> times.
        </>
      ),
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 5 * (inputs[0] || 0);
        const keys: AttributeStat[] = ["atk_", "naAtkSpd_", "caAtkSpd_"];
        applyModifier(desc, totalAttr, keys, [buffValue * 2, buffValue, buffValue], tracker);
      },
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Within 2s after casting Searing Onslaught [ES], casting the next Searing Onslaught in the combo deals{" "}
          <Green b>40%</Green> <Green>DMG Bonus</Green>. This effect lasts for 2s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "ES.pct_", 40),
    },
    {
      index: 5,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Within 6s after casting Searing Onslaught [ES], the next <Rose>2</Rose> <Green>Normal Attacks</Green> will
          have their <Green>DMG and ATK SPD</Green> increased by <Green b>30%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "NA.pct_", 30, tracker);
        applyModifier(desc, totalAttr, "naAtkSpd_", 30, tracker);
      },
    },
  ],
};

export default Diluc as AppCharacter;

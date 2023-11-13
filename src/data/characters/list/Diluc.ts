import type { AttributeStat, AppCharacter, DefaultAppCharacter } from "@Src/types";
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
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
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
      description: `After casting Dawn [EB], Diluc gains a {Pyro Infusion}#[pyro].
      <br />• At {A4}#[ms], Diluc gains {20%}#[v] {Pyro DMG Bonus}#[k] during this duration.`,
      infuseConfig: {
        overwritable: true,
      },
    },
    {
      index: 2,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Diluc deals {15%}#[v] more {DMG}#[k] to opponents whose HP is above 50%.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "all.pct_", 15),
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Diluc takes DMG, his {ATK}#[k] increases by {10%}#[v] and {ATK SPD}#[k] increases by
      {5%}#[v] for 10s, up to {3}#[m] times.`,
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
      description: `Within 2s after casting Searing Onslaught [ES], casting the next Searing Onslaught in the combo deals
      {40%}#[v] {DMG Bonus}#[k].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "ES.pct_", 40),
    },
    {
      index: 5,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `Within 6s after casting Searing Onslaught [ES], the next {2}#[m] {Normal Attacks}#[k] will
      have their {DMG and ATK SPD}#[v] increased by {30%}#[v].`,
      isGranted: checkCons[6],
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "NA.pct_", 30, tracker);
        applyModifier(desc, totalAttr, "naAtkSpd_", 30, tracker);
      },
    },
  ],
};

export default Diluc as AppCharacter;

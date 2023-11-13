import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const HuTao: DefaultAppCharacter = {
  code: 31,
  name: "Hu Tao",
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
      description: `Increases the Blood Blossom {[ES] DMG}#[k] by {10%}#[v] of Hu Tao's {Max HP}#[k].`,
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
      description: `Increases Hu Tao's {ATK}#[k] based on her {Max HP}#[k] and grants her a {Pyro Infusion}#[pyro].`,
      applyFinalBuff: (obj) => {
        const [level, mult] = getTalentMultiplier(
          { talentType: "ES", root: 3.84, scale: 5 },
          HuTao as AppCharacter,
          obj
        );
        let description = obj.desc + ` Lv.${level} / ${round(mult, 2)}% of Max HP`;
        let buffValue = applyPercent(obj.totalAttr.hp, mult);
        const limit = obj.totalAttr.base_atk * 4;

        if (buffValue > limit) {
          buffValue = limit;
          description += ` / limited to ${limit}`;
        }
        applyModifier(description, obj.totalAttr, "atk", buffValue, obj.tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      description: `When a Paramita Papilio [ES] state ends, all allies in the party (excluding Hu Tao) will have their
      {CRIT Rate}#[k] increased by {12%}#[v] for 8s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `When Hu Tao's HP is equal to or less than 50%, her {Pyro DMG Bonus}#[k] is increased by {33%}#[v].`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "pyro", 33),
    },
    {
      index: 5,
      src: EModSrc.C4,
      affect: EModAffect.TEAMMATE,
      description: `Upon defeating an enemy affected by a Blood Blossom that Hu Tao applied herself, all nearby allies in the
      party (excluding Hu Tao) will have their {CRIT Rate}#[k] increased by {12%}#[v] for 15s.`,
      isGranted: checkCons[4],
      applyFinalBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `When Hu Tao's HP drops below 25%, or when she suffers a lethal strike, her {CRIT Rate}#[k] is
      increased by {100%}#[v] for 10s.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "cRate_", 100),
    },
  ],
};

export default HuTao as AppCharacter;

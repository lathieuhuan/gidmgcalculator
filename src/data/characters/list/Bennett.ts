import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, getTalentMultiplier } from "../utils";

const Bennett: DefaultAppCharacter = {
  code: 19,
  name: "Bennett",
  icon: "7/79/Bennett_Icon",
  sideIcon: "0/01/Bennett_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Increases {ATK}#[gr] of the characters within its AoE based on Bennett's {Base ATK}#[gr].
      <br />• At {C1}#[g], the {ATK Bonus}#[gr] is further increased by {20%}#[b,gr] of his Base ATK.
      <br />• At {C6}#[g], the characters also gain a {15%}#[b,gr] {Pyro DMG Bonus}#[gr].`,
      inputConfigs: [
        { label: "Base ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Constellation 1", type: "check", for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { fromSelf, totalAttr, inputs } = obj;
        const [level, mult] = getTalentMultiplier(
          { talentType: "EB", root: 56, inputIndex: 1 },
          Bennett as AppCharacter,
          obj
        );

        if (mult) {
          const baseATK = fromSelf ? totalAttr.base_atk : inputs[0] || 0;
          const boosted = fromSelf ? checkCons[1](obj.char) : inputs[2] === 1;
          let multiplier = mult;
          let description = obj.desc + ` Lv.${level}`;

          if (boosted) {
            multiplier += 20;
            description += ` + ${EModSrc.C1}`;
          }
          description += ` / ${multiplier}% of Base ATK`;
          const buffValue = applyPercent(baseATK, multiplier);

          applyModifier(description, totalAttr, "atk", buffValue, obj.tracker);
        }

        if (fromSelf ? checkCons[6](obj.char) : inputs[3]) {
          const descriptionC6 = `${fromSelf ? "Self" : "Bennet"} / ${EModSrc.C6}`;
          applyModifier(descriptionC6, totalAttr, "pyro", 15, obj.tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Bennett's HP falls below 70%, his {Energy Recharge}#[gr] is increased by {30%}#[b,gr].`,
      applyBuff: makeModApplier("totalAttr", "er_", 30),
    },
  ],
};

export default Bennett as AppCharacter;
import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getESBuffValue = ({ fromSelf, char, partyData, inputs }: DescriptionSeedGetterArgs) => {
  const level = fromSelf
    ? finalTalentLv({ talentType: "ES", char: char, charData: Mika as AppCharacter, partyData })
    : inputs[0] || 0;
  return level ? Math.min(12 + level, 25) : 0;
};

const Mika: DefaultAppCharacter = {
  code: 67,
  name: "Mika",
  icon: "d/dd/Mika_Icon",
  sideIcon: "8/84/Mika_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [(args) => `${getESBuffValue(args)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Grants nearby active characters Soulwind, increasing their {ATK SPD}#[gr] by {@0}#[b,gr].
      <br />• At {A1}#[g], Soulwind can grant characters the Detector effect, increasing their {Physical DMG}#[gr] by
      {10%}#[b,gr] each stack. Max {3}#[r] stacks.
      <br />• At {A4}#[g], the maximum number of {stacks}#[gr] is increased by {1}#[b,gr].
      <br />• At {C6}#[g], the maximum number of {stacks}#[gr] is increased by {1}#[b,gr]. Grants {60%}#[b,gr]
      {Physical CRIT DMG}#[gr] bonus.`,
      inputConfigs: [
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
        { label: "Detector stacks (A1)", type: "select", initialValue: 0, max: 5 },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { fromSelf, char, inputs, desc, tracker } = obj;
        applyModifier(desc, obj.totalAttr, "naAtkSpd_", getESBuffValue(obj), tracker);

        if (!fromSelf || checkAscs[1](char)) {
          let maxStacks = 5;

          if (fromSelf) {
            if (!checkAscs[4](char)) maxStacks--;
            if (!checkCons[6](char)) maxStacks--;
          }

          const detectorBuffValue = Math.min(fromSelf ? inputs[0] || 0 : inputs[1] || 0, maxStacks) * 10;
          applyModifier(desc + ` + ${EModSrc.A1}`, obj.totalAttr, "phys", detectorBuffValue, tracker);
        }
        if ((fromSelf && checkCons[6](char)) || (!fromSelf && inputs[2])) {
          applyModifier(desc + ` + ${EModSrc.C6}`, obj.attElmtBonus, "phys.cDmg_", 60, tracker);
        }
      },
    },
  ],
};

export default Mika as AppCharacter;

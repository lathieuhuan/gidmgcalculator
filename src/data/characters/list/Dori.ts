import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Dori: DefaultAppCharacter = {
  code: 56,
  name: "Dori",
  icon: "5/54/Dori_Icon",
  sideIcon: "6/6d/Dori_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C4,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Buff the character connected to the Jinni. When their HP < 50%, they gain {50%}#[v]
      {Incoming Healing Bonus}#[k]. When their Energy < 50%, they gain {30%}#[v] {Energy Recharge}#[k].`,
      isGranted: checkCons[4],
      inputConfigs: [
        { type: "check", label: "HP < 50%" },
        { type: "check", label: "Energy < 50%" },
      ],
      applyBuff: (obj) => {
        const [isBelowHalfHP, isBelowHalfEnergy] = obj.inputs;
        if (isBelowHalfHP) applyModifier(obj.desc, obj.totalAttr, "inHealB_", 50, obj.tracker);
        if (isBelowHalfEnergy) applyModifier(obj.desc, obj.totalAttr, "er_", 30, obj.tracker);
      },
    },
  ],
};

export default Dori as AppCharacter;

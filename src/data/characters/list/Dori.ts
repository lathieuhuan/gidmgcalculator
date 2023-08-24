import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
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
      description: `When Energy of the character connected to the Lamp Spirit is less than 50%, they gain {30%}#[b,gr]
      {Energy Recharge}#[gr].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "er_", 30),
    },
  ],
};

export default Dori as AppCharacter;

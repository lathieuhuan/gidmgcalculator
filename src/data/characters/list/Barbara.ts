import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Barbara: DefaultAppCharacter = {
  code: 15,
  name: "Barbara",
  icon: "6/6a/Barbara_Icon",
  sideIcon: "3/39/Barbara_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.ACTIVE_UNIT,
      description: `During Let the Show Begin's [ES] duration, your active character gains a {15%}#[b,gr]
      {Hydro DMG Bonus}#[gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "hydro", 15),
    },
  ],
};

export default Barbara as AppCharacter;

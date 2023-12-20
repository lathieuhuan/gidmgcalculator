import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Kaeya: DefaultAppCharacter = {
  code: 5,
  name: "Kaeya",
  icon: "b/b6/Kaeya_Icon",
  sideIcon: "b/b5/Kaeya_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Kaeya's {Normal and Charged Attack CRIT Rate}#[k] against opponents affected by Cryo is increased
      by {15%}#[v].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", ["NA.cRate_", "CA.cRate_"], 15),
    },
  ],
};

export default Kaeya as AppCharacter;

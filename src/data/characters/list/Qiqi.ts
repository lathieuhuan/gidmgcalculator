import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Qiqi: DefaultAppCharacter = {
  code: 7,
  name: "Qiqi",
  icon: "b/b3/Qiqi_Icon",
  sideIcon: "e/ef/Qiqi_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Qiqi's {Normal and Charged Attack DMG}#[gr] against opponents affected by Cryo is increased by
      {15%}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", ["NA.pct_", "CA.pct_"], 15),
    },
  ],
};

export default Qiqi as AppCharacter;

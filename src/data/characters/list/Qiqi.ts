import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

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
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `When a character under the effects of Adeptus Art: Herald of Frost [ES] triggers an Elemental
      Reaction, their {Incoming Healing Bonus}#[k] is increased by {20%}#[v] for 8s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "inHealB_", 20),
    },
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Qiqi's {Normal and Charged Attack DMG}#[k] against opponents affected by Cryo is increased by
      {15%}#[v].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", ["NA.pct_", "CA.pct_"], 15),
    },
  ],
};

export default Qiqi as AppCharacter;

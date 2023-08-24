import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Amber: DefaultAppCharacter = {
  code: 18,
  name: "Amber",
  icon: "7/75/Amber_Icon",
  sideIcon: "0/07/Amber_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.A1,
      description: `Increases Fiery Rain {[EB] CRIT Rate}#[gr] by {10%}#[b,gr].`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("attPattBonus", "EB.cRate_", 10),
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `Aimed Shot hits on weak spots increase {ATK}#[gr] by {15%}#[b,gr] for 10s.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 15),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Increases Baron Bunny {[ES] DMG}#[gr] via manual detonation by {200%}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "ES.pct_", 200),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `Fiery Rain [EB] increases all party members' Movement SPD and {ATK}#[gr] by {15%}#[b,gr] for 10s.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "atk_", 15),
    },
  ],
};

export default Amber as AppCharacter;

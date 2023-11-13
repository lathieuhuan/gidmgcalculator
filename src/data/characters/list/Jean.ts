import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Jean: DefaultAppCharacter = {
  code: 2,
  name: "Jean",
  icon: "6/64/Jean_Icon",
  sideIcon: "b/b2/Jean_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Increases the pulling speed of Gale Blade [ES] after holding for more than 1s, and increases the
      {DMG}#[k] dealt by {40%}#[v].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "ES.pct_", 40),
    },
    {
      index: 1,
      src: EModSrc.C2,
      affect: EModAffect.PARTY,
      description: `When Jean picks up an Elemental Orb/Particle, all party members have their Movement SPD and
      {ATK SPD}#[k] increased by {15%}#[v] for 15s.`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Within the field of Dandelion Breeze [EB], all opponents have their {Anemo RES}#[k] decreased by
      {40%}#[v].`,
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "anemo", 40),
    },
  ],
};

export default Jean as AppCharacter;

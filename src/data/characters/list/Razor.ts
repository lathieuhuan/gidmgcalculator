import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const getEBBuffValue = (args: DescriptionSeedGetterArgs) => {
  const level = finalTalentLv({
    talentType: "EB",
    char: args.char,
    charData: Razor as AppCharacter,
    partyData: args.partyData,
  });
  return Math.min(24 + level * 2 - Math.max(level - 6, 0), 40);
};

const Razor: DefaultAppCharacter = {
  code: 11,
  name: "Razor",
  icon: "b/b8/Razor_Icon",
  sideIcon: "4/4d/Razor_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [(args) => `${getEBBuffValue(args)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Increases Razor's {ATK SPD}#[gr] by {@0}#[b,gr].`,
      applyBuff: (obj) => {
        applyModifier(obj.desc, obj.totalAttr, "naAtkSpd_", getEBBuffValue(obj), obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Picking up an Elemental Orb or Particle increases Razor's {DMG}#[gr] by {10%}#[b,gr] for 8s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "all.pct_", 10),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Increases {CRIT Rate}#[gr] against opponents with less than 30% HP by {10%}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "cRate_", 10),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Claw and Thunder [ES] (Press) decreases opponents' {DEF}#[gr] by {15%}#[b,gr] for 7s.`,
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Razor as AppCharacter;

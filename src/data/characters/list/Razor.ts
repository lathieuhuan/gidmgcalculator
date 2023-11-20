import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
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
  dsGetters: [(args) => `${getEBBonus(args)}%`],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Claw and Thunder [ES] (Press) decreases opponents' {DEF}#[k] by {15%}#[v] for 7s.`,
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Razor as AppCharacter;

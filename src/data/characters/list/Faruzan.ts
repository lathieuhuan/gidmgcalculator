import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { getTalentMultiplier } from "../utils";
import { round } from "@Src/utils";

const getWindGiftBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 18 }, Faruzan as AppCharacter, args);
};

const Faruzan: DefaultAppCharacter = {
  code: 64,
  name: "Faruzan",
  icon: "b/b2/Faruzan_Icon",
  sideIcon: "c/c1/Faruzan_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(getWindGiftBonus(args)[1], 2)}%`],
  debuffs: [
    {
      index: 0,
      src: "Perfidious Wind's Bale",
      description: `Decreases opponents' {Anemo RES}#[k] by {30%}#[v].`,
      applyDebuff: makeModApplier("resistReduct", "anemo", 30),
    },
  ],
};

export default Faruzan as AppCharacter;

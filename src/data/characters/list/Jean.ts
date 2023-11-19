import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";
import { makeModApplier } from "@Src/utils/calculation";

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

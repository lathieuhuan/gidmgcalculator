import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Beidou: DefaultAppCharacter = {
  code: 6,
  name: "Beidou",
  icon: "e/e1/Beidou_Icon",
  sideIcon: "8/84/Beidou_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      description: `During the duration of Stormbreaker [EB], the {Electro RES}#[k] of surrounding opponents is
      decreased by {15%}#[v].`,
      isGranted: checkCons[6],
      applyDebuff: makeModApplier("resistReduct", "electro", 15),
    },
  ],
};

export default Beidou as AppCharacter;

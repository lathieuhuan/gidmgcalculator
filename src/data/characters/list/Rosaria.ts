import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Rosaria: DefaultAppCharacter = {
  code: 32,
  name: "Rosaria",
  icon: "3/35/Rosaria_Icon",
  sideIcon: "0/0e/Rosaria_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      description: `Rites of Termination's [EB] attack decreases opponents' {Physical RES}#[k] by {20%}#[v] for 10s.`,
      isGranted: checkCons[6],
      applyDebuff: makeModApplier("resistReduct", "phys", 20),
    },
  ],
};

export default Rosaria as AppCharacter;

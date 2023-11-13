import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModSrc } from "../constants";
import { checkCons, genExclusiveBuff } from "../utils";

const Fischl: DefaultAppCharacter = {
  code: 8,
  name: "Fischl",
  icon: "9/9a/Fischl_Icon",
  sideIcon: "b/b8/Fischl_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Nightrider's {Summoning DMG}#[k] is increased by {200%}#[v] of {ATK}#[k].`,
      isGranted: checkCons[2],
      applyBuff: (obj) => {
        obj.calcItemBuffs.push(genExclusiveBuff(EModSrc.C2, "ES.0", "mult_", 200));
      },
    },
  ],
};

export default Fischl as AppCharacter;

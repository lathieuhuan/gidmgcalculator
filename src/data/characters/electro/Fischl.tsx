import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green } from "@Src/pure-components";
import { EModSrc } from "../constants";
import { checkCons, exclBuff } from "../utils";

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
      desc: () => (
        <>
          Nightrider's <Green>Summoning DMG</Green> is increased by <Green b>200%</Green> of <Green>ATK</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyFinalBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C2, "ES.0", "mult_", 200));
      },
    },
  ],
};

export default Fischl as AppCharacter;

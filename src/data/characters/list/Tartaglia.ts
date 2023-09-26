import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";

const Tartaglia: DefaultAppCharacter = {
  code: 26,
  name: "Tartaglia",
  icon: "8/85/Tartaglia_Icon",
  sideIcon: "2/2f/Tartaglia_Side_Icon",
  rarity: 5,
  nation: "snezhnaya",
  vision: "hydro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `Tartaglia's {Normal and Charged Attacks}#[gr] are converted to {Hydro DMG}#[hydro] that cannot be
      overridden.`,
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
  ],
};

export default Tartaglia as AppCharacter;

import { EModAffect } from "@Src/constants";
import { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { countVision } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs } from "../utils";

const Chevreuse: DefaultAppCharacter = {
  code: 81,
  name: "Chevreuse",
  icon: "",
  sideIcon: "",
  rarity: 4,
  nation: "fontaine",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Chevreuse as AppCharacter;

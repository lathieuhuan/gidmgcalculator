import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { round } from "@Src/utils";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, getTalentMultiplier } from "../utils";

const getPropSurplusValue = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 53.2 }, Lyney as AppCharacter, args);
};

const Lyney: DefaultAppCharacter = {
  code: 73,
  name: "Lyney",
  icon: "b/b2/Lyney_Icon",
  sideIcon: "6/6a/Lyney_Side_Icon",
  rarity: 5,
  nation: "fontaine",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(getPropSurplusValue(args)[1], 2)}%`],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Lyney's {Pyro}#[pyro] Charged Attacks decreases opponent's {Pyro RES}#[k] by {20%}#[v] for 6s.`,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "pyro", 20),
    },
  ],
};

export default Lyney as AppCharacter;

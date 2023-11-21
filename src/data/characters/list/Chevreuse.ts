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
  debuffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.PARTY,
      isGranted: checkAscs[1],
      description: `When party only have Pyro and Electro characters, and at least 1 character for each of those
      elements, every party member gets "Coordinated Tactics": their Overload reactions decrease opponents' {Pyro RES}#[k]
      and {Electro RES}#[k] by {40%}#[v] for 6s.`,
      applyDebuff: (obj) => {
        const { pyro, electro, ...others } = countVision(obj.partyData, obj.charData);
        if (electro && !Object.keys(others).length) {
          applyModifier(obj.desc, obj.resistReduct, ["pyro", "electro"], 40, obj.tracker);
        }
      },
    },
  ],
};

export default Chevreuse as AppCharacter;

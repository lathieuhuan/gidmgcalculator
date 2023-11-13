import { EModAffect } from "@Src/constants";
import { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { countVision } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

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
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      isGranted: checkAscs[4],
      description: `After Chevreuse fires an Overcharged Ball [~ES], nearby Pyro and Electro characters' {ATK}#[gr] is
      increased by {1%}#[b,gr] for every {1000 Max HP}#[gr] Chevreuse has for 30s. Max {40%}#[r].`,
      inputConfigs: [
        {
          type: "text",
          label: "Chevreuse's Max HP",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: (obj) => {
        if (["pyro", "electro"].includes(obj.charData.vision)) {
          const hp = obj.fromSelf ? obj.totalAttr.hp : obj.inputs[0];
          const buffValue = Math.min(hp / 1000, 40);
          applyModifier(obj.desc, obj.totalAttr, "atk_", buffValue, obj.tracker);
        }
      },
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      isGranted: checkCons[6],
      description: `After a party member is healed by Short-Range Rapid Interdiction Fire [ES], they gain a {20%}#[b,gr]
      {Pyro DMG Bonus}#[gr] and {Electro DMG Bonus}#[gr] for 8s, up to {3}#[r] stacks.`,
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: (obj) => {
        const stacks = obj.inputs[0] ?? 0;
        applyModifier(obj.desc, obj.totalAttr, ["pyro", "electro"], stacks * 20, obj.tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.PARTY,
      isGranted: checkAscs[1],
      description: `When party only have Pyro and Electro characters, and at least 1 character for each of those
      elements, every party member gets "Coordinated Tactics": their Overload reactions decrease opponents' {Pyro RES}#[gr]
      and {Electro RES}#[gr] by {40%}#[b,gr] for 6s.`,
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

import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc, NCPA_PERCENTS } from "../constants";
import { checkAscs, getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 58.45 }, Xiao as AppCharacter, args);
};

const Xiao: DefaultAppCharacter = {
  code: 30,
  name: "Xiao",
  icon: "f/fd/Xiao_Icon",
  sideIcon: "4/49/Xiao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "anemo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Increases Xiao's {Normal / Charged / Plunge Attack DMG}#[gr] by {@0}#[b,gr] and grants him an
      {Anemo Infusion}#[anemo] that cannot be overridden.
      <br />• At {A1}#[g], Xiao's {DMG}#[gr] is increased by {5%}#[b,gr], and a further {5%}#[b,gr] for every 3s the
      ability persists. Max {25%}#[r].`,
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: (obj) => {
        const [level, mult] = getEBBonus(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.attPattBonus, [...NCPA_PERCENTS], mult, obj.tracker);

        if (checkAscs[1](obj.char)) {
          applyModifier(EModSrc.A1, obj.attPattBonus, "all.pct_", 5 * (obj.inputs[0] || 0), obj.tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `Using Lemniscatic Wind Cycling increases subsequent Lemniscatic Wind Cycling {[ES] DMG}#[gr] by
      {15%}#[b,gr] for 7s. Maximum of {3}#[r] stacks.`,
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 15 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Xiao as AppCharacter;

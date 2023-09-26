import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 33.4 }, Yanfei as AppCharacter, args);
};

const Yanfei: DefaultAppCharacter = {
  code: 34,
  name: "Yanfei",
  icon: "5/54/Yanfei_Icon",
  sideIcon: "b/b3/Yanfei_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
  buffs: [
    {
      index: 3,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Increases {Charged Attack DMG}#[gr] by {@0}#[b,gr].`,
      applyBuff: (obj) => {
        const [level, mult] = getEBBonus(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.attPattBonus, "CA.pct_", mult, obj.tracker);
      },
    },
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `When Yanfei's Charged Attack consumes Scarlet Seals, each Scarlet Seal will increase her
      {Pyro DMG Bonus}#[gr] by {5%}#[b,gr] for 6s.`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "pyro", 5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Increases Yanfei's {Charged Attack CRIT Rate}#[gr] by {20%}#[b,gr] against enemies below 50% HP.`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "CA.cRate_", 20),
    },
  ],
};

export default Yanfei as AppCharacter;

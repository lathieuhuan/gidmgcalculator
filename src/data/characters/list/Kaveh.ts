import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 27.49 }, Kaveh as AppCharacter, args);
};

const Kaveh: DefaultAppCharacter = {
  code: 69,
  name: "Kaveh",
  icon: "1/1f/Kaveh_Icon",
  sideIcon: "5/5e/Kaveh_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `• Grants {Dendro Infusion}#[dendro].
      <br />• Increases {Bloom DMG}#[gr] triggered by all party members by {@0}#[b,gr].
      <br />• At {A4}#[g], after Kaveh's Normal, Charged, and Plunging Attacks hit opponents, his
      {Elemental Mastery}#[gr] will increase by {25}#[b,gr]. Max {4}#[r] stacks.`,
      inputConfigs: [
        {
          label: "A4 stacks",
          type: "stacks",
          initialValue: 0,
          max: 4,
        },
      ],
      applyBuff: (obj) => {
        const { desc } = obj;
        const [level, mult] = getEBBonus(obj);
        applyModifier(desc + ` Lv.${level}`, obj.rxnBonus, "bloom.pct_", mult, obj.tracker);

        if (checkAscs[4](obj.char)) {
          const stacks = obj.inputs[0];
          applyModifier(`Self / ${EModSrc.A4}`, obj.totalAttr, "em", stacks * 25, obj.tracker);
        }
        if (checkCons[2](obj.char)) {
          applyModifier(`Self / ${EModSrc.C2}`, obj.totalAttr, "naAtkSpd_", 15, obj.tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.TEAMMATE,
      description: `Increases {Bloom DMG}#[gr] triggered by all party members by {@0}#[b,gr].`,
      inputConfigs: [
        {
          label: "Elemental Burst level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        applyModifier(obj.desc, obj.rxnBonus, "bloom.pct_", getEBBonus(obj)[1], obj.tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      isGranted: checkCons[4],
      description: `Dendro Cores created from {Bloom}#[gr] reactions Kaveh triggers will deal {60%}#[b,gr] more DMG when
      they burst.`,
      applyBuff: makeModApplier("rxnBonus", "bloom.pct_", 60),
    },
  ],
};

export default Kaveh as AppCharacter;
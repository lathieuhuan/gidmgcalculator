import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round, toMult } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 37.91, scale: 5 }, Yoimiya as AppCharacter, args);
};

const Yoimiya: DefaultAppCharacter = {
  code: 38,
  name: "Yoimiya",
  icon: "8/88/Yoimiya_Icon",
  sideIcon: "2/2a/Yoimiya_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(toMult(getESBonus(args)[1]), 3)}`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `Yoimiya's {Normal Attack DMG}#[k] will be increased by {@0}#[v] times and converted to
      {Pyro DMG}#[pyro].
      <br />• At {A1}#[ms], Normal Attacks on hit will increase Yoimiya's {Pyro DMG Bonus}#[k] by {2%}#[v] for 3s.
      Maximum {10}#[m] stacks.`,
      inputConfigs: [
        {
          label: "Stacks (A4)",
          type: "stacks",
          initialValue: 0,
          max: 10,
        },
      ],
      applyBuff: (obj) => {
        const [level, mult] = getESBonus(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.attPattBonus, "NA.multPlus", mult, obj.tracker);

        if (checkAscs[1](obj.char)) {
          applyModifier(EModSrc.A1, obj.totalAttr, "pyro", 2 * (obj.inputs[0] || 0), obj.tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      description: `Using Ryuukin Saxifrage [EB] causes nearby party members (excluding Yoimiya) to gain a {10%}#[v]
      {ATK Bonus}#[k] for 15s. A further {1%}#[v] {ATK Bonus}#[k] will be added for each "Tricks of the
      Trouble-Maker" [A1] stacks Yoimiya possesses when using Ryuukin Saxifrage.`,
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          type: "stacks",
          initialValue: 0,
          max: 10,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "atk_", 10 + (inputs[0] || 0), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `When an opponent affected by Aurous Blaze [EB] is defeated within its duration, Yoimiya's {ATK}#[k]
      is increased by {20%}#[v] for 20s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "atk_", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Yoimiya's Pyro DMG scores a CRIT Hit, she will gain a {25%}#[v] {Pyro DMG Bonus}#[k] for
      6s. Can work off-field.`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "pyro", 25),
    },
  ],
};

export default Yoimiya as AppCharacter;

import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, getTalentMultiplier } from "../utils";

const getCoilStackBuffValue = (args: DescriptionSeedGetterArgs) => {
  const [, mult] = getTalentMultiplier({ root: 5.846, talentType: "ES", scale: 5 }, Aloy as AppCharacter, args);
  let stacks = args.inputs[0] || 0;
  stacks = stacks === 4 ? 5 : stacks;
  return mult * stacks;
};

const Aloy: DefaultAppCharacter = {
  code: 39,
  name: "Aloy",
  icon: "e/e5/Aloy_Icon",
  sideIcon: "4/46/Aloy_Side_Icon",
  rarity: 5,
  nation: "outland",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 40,
  dsGetters: [(args) => `${round(getCoilStackBuffValue(args), 3)}%`],
  buffs: [
    {
      index: 0,
      src: "Coil stacks",
      affect: EModAffect.SELF,
      description: `Increases Aloy's {Normal Attack DMG}#[k] {@0}#[v]. When she has 4 stacks, all stacks are cleared, Aloy
      then enters the Rushing Ice state, which further increases her {Normal Attack DMG}#[k] and converts it to
      {Cryo DMG}#[cryo].
      <br />• At {A1}#[ms] when Aloy receives Coil effect, her {ATK}#[k] is increased by {16%}#[v] for 10s.
      <br />• At {A4}#[ms] when Aloy is in Rushing Ice state, her {Cryo DMG Bonus}#[k] increases by {3.5%}#[v]
      every 1s, up to {35%}#[m].`,
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
        {
          label: "Time passed (A4)",
          type: "stacks",
          max: 10,
        },
      ],
      applyBuff: (obj) => {
        const { desc, tracker } = obj;
        applyModifier(desc, obj.attPattBonus, "NA.pct_", getCoilStackBuffValue(obj), tracker);

        if (checkAscs[1](obj.char)) {
          applyModifier(desc, obj.totalAttr, "atk_", 16, tracker);
        }
        if (checkAscs[4](obj.char)) {
          applyModifier(desc, obj.totalAttr, "cryo", 3.5 * (obj.inputs[1] || 0), tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      description: `When Aloy receives the Coil effect, nearby party members' {ATK}#[k] is increased by {8%}#[v]
      for 10s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "atk_", 8),
    },
  ],
};

export default Aloy as AppCharacter;

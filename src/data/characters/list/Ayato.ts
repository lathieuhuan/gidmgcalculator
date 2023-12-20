import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, genExclusiveBuff } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  const level = args.fromSelf
    ? finalTalentLv({ talentType: "EB", char: args.char, charData: Ayato as AppCharacter, partyData: args.partyData })
    : args.inputs[0] || 0;

  if (level) {
    const mult = Math.min(level + 10, 20);
    return [level, mult];
  }
  return [0, 0];
};

const Ayato: DefaultAppCharacter = {
  code: 50,
  name: "Ayato",
  icon: "2/27/Kamisato_Ayato_Icon",
  sideIcon: "2/2c/Kamisato_Ayato_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${getEBBonus(args)[1]}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `• Converts his Normal Attack DMG into AoE {Hydro DMG}#[hydro] (Shunsuiken) that cannot be overridden.
      <br />• On hit, Shunsuikens grant Ayato Namisen stacks which increase {Shunsuiken DMG}#[k] based on his
      {Max HP}#[k].
      <br />• At {C2}#[ms], Ayato's {Max HP}#[k] is increased by {50%}#[v] when he has at least 3 Namisen stacks.`,
      inputConfigs: [
        {
          label: "Namisen stacks",
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ char, totalAttr, inputs, desc, tracker }) => {
        if (checkCons[2](char) && (inputs[0] || 0) >= 3) {
          applyModifier(desc, totalAttr, "hp_", 50, tracker);
        }
      },
      applyFinalBuff: ({ char, totalAttr, calcItemBuffs, inputs, partyData }) => {
        const level = finalTalentLv({
          char,
          charData: Ayato as AppCharacter,
          talentType: "ES",
          partyData,
        });
        const finalMult = 0.56 * (inputs[0] || 0) * TALENT_LV_MULTIPLIERS[7][level];

        calcItemBuffs.push(genExclusiveBuff(EModSrc.ES, "ES.0", "flat", applyPercent(totalAttr.hp, finalMult)));
      },
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Increases the {Normal Attack DMG}#[k] of characters within its AoE by {@0}#[v].`,
      inputConfigs: [
        {
          label: "Elemental Burst Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const [level, buffValue] = getEBBonus(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.attPattBonus, "NA.pct_", buffValue, obj.tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `{Shunsuiken DMG}#[k] is increased by {40%}#[v] against opponents with 50% HP or less.`,
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C1, ["ES.0", "ES.1"], "pct_", 40));
      },
    },
    {
      index: 5,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `After using Kamisato Art: Suiyuu [EB], all nearby party members will have {15%}#[v] increased
      {Normal Attack SPD}#[k] for 15s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
  ],
};

export default Ayato as AppCharacter;

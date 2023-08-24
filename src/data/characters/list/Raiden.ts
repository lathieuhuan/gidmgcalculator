import type {
  AppCharacter,
  BuffDescriptionArgs,
  DefaultAppCharacter,
  DescriptionSeedGetterArgs,
  TotalAttribute,
} from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier, type AttackPatternPath } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const getBuffValue = {
  ES: (args: BuffDescriptionArgs) => {
    const level = args.fromSelf
      ? finalTalentLv({
          char: args.char,
          charData: Raiden as AppCharacter,
          talentType: "ES",
          partyData: args.partyData,
        })
      : args.inputs[0] || 0;
    const mult = Math.min(0.21 + level / 100, 0.3);

    return {
      desc: `${level} / ${round(mult, 2)}% * ${args.charData.EBcost} Energy Cost`,
      value: round(args.charData.EBcost * mult, 1),
    };
  },
  EB: ({ char, partyData, inputs: [totalEnergy = 0, electroEnergy = 0] }: DescriptionSeedGetterArgs) => {
    const isshinBonusMults = [0, 0.73, 0.78, 0.84, 0.91, 0.96, 1.02, 1.09, 1.16, 1.23, 1.31, 1.38, 1.45, 1.54];
    const level = finalTalentLv({
      char,
      charData: Raiden as AppCharacter,
      talentType: "EB",
      partyData,
    });
    let extraEnergy = 0;

    if (checkCons[1](char) && electroEnergy <= totalEnergy) {
      extraEnergy += electroEnergy * 0.8 + (totalEnergy - electroEnergy) * 0.2;
    }

    const stackPerEnergy = Math.min(Math.ceil(14.5 + level * 0.5), 20);
    const countResolve = (energyCost: number) => Math.round(energyCost * stackPerEnergy) / 100;
    const stacks = countResolve(totalEnergy + extraEnergy);

    return {
      stackPerEnergy,
      stacks: Math.min(round(stacks, 2), 60),
      extraStacks: countResolve(extraEnergy),
      musouBonus: round(3.89 * TALENT_LV_MULTIPLIERS[2][level], 2),
      isshinBonus: isshinBonusMults[level],
    };
  },
  A4: (totalAttr: TotalAttribute) => {
    return round((totalAttr.er_ - 100) * 0.4, 1);
  },
};

const Raiden: DefaultAppCharacter = {
  code: 40,
  name: "Raiden Shogun",
  icon: "2/24/Raiden_Shogun_Icon",
  sideIcon: "c/c7/Raiden_Shogun_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "polearm",
  EBcost: 90,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Each 1% above 100% {Energy Recharge}#[gr] grants the Raiden Shogun {0.4%}#[b,gr]
      {Electro DMG Bonus}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const buffValue = getBuffValue.A4(totalAttr);
        applyModifier(desc, totalAttr, "electro", buffValue, tracker);
      },
    },
  ],
  dsGetters: [(args) => `${getBuffValue.EB(args).stacks}`, (args) => `${getBuffValue.EB(args).extraStacks}`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.PARTY,
      description: `Eye of Stormy Judgment increases {Elemental Burst DMG}#[gr] based on the {Energy Cost}#[gr] of
      the Elemental Burst.`,
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const result = getBuffValue.ES(obj);
        const desc = `${obj.desc} / Lv.${result.desc}`;
        applyModifier(desc, obj.attPattBonus, "EB.pct_", result.value, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Musou no Hitotachi and Musou Isshin's attacks {[EB] DMG}#[gr] will be increased based on the number
      of Resolve consumed.
      <br />--- Total Resolve: {@0}#[b] ---
      <br />Grants an {Electro Infusion}#[electro] which cannot be overridden.
      <br />• At {C1}#[g], increases {Resolve}#[gr] gained from Electro characters by {80%}#[b,gr], from characters of
      other visions by {20%}#[b,gr].
      <br />--- Extra Resolve: {@1}#[b] ---
      <br />• At {C2}#[g], the Raiden Shogun's attacks ignore {60%}#[b,gr] of opponents' {DEF}#[gr].`,
      inputConfigs: [
        { label: "Total Energy spent", type: "text", max: 999 },
        { label: "Energy spent by Electro characters (C1)", type: "text", max: 999 },
      ],
      applyBuff: (obj) => {
        const buffValue = getBuffValue.EB(obj);
        const { stacks, musouBonus, isshinBonus } = buffValue;

        if (stacks) {
          const musouDesc = `${stacks} Resolve, ${musouBonus}% extra multiplier each`;
          const isshinDesc = `${stacks} Resolve, ${isshinBonus}% extra multiplier each`;

          obj.calcItemBuffs.push(
            genExclusiveBuff(musouDesc, "EB.0", "mult_", round(stacks * musouBonus, 2)),
            genExclusiveBuff(isshinDesc, "EB.1", "mult_", round(stacks * isshinBonus, 2))
          );
        }

        if (checkCons[2](obj.char)) {
          const fields: AttackPatternPath[] = ["NA.defIgn_", "CA.defIgn_", "PA.defIgn_", "ES.defIgn_", "EB.defIgn_"];
          applyModifier(obj.desc, obj.attPattBonus, fields, 60, obj.tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.TEAMMATE,
      description: `When the Musou Isshin state expires, all nearby party members (excluding the Raiden Shogun) gain
      {30%}#[b,gr] {ATK}#[gr] for 10s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 30),
    },
  ],
};

export default Raiden as AppCharacter;

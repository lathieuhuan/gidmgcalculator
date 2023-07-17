import type {
  CharInfo,
  AppCharacter,
  DefaultAppCharacter,
  BuffDescriptionArgs,
  ModifierCtrl,
  PartyData,
  TotalAttribute,
} from "@Src/types";
import { Electro, Green, Lightgold, Red } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc } from "../constants";
import { round } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier, type AttackPatternPath } from "@Src/utils/calculation";
import { checkAscs, checkCons, findInput, talentBuff } from "../utils";

const getBuffValue = {
  ES: (args: BuffDescriptionArgs) => {
    const level = args.toSelf
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
  EB: (char: CharInfo, selfBuffCtrls: ModifierCtrl[], partyData: PartyData) => {
    const isshinBonusMults = [0, 0.73, 0.78, 0.84, 0.91, 0.96, 1.02, 1.09, 1.16, 1.23, 1.31, 1.38, 1.45, 1.54];
    const level = finalTalentLv({
      char,
      charData: Raiden as AppCharacter,
      talentType: "EB",
      partyData,
    });
    const totalEnergy = findInput(selfBuffCtrls, 1, 0);
    const electroEnergy = findInput(selfBuffCtrls, 1, 1);
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
  GOOD: "RaidenShogun",
  icon: "2/24/Raiden_Shogun_Icon",
  sideIcon: "c/c7/Raiden_Shogun_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "polearm",
  EBcost: 90,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: ({ totalAttr }) => (
        <>
          Each 1% above 100% <Green>Energy Recharge</Green> grants the Raiden Shogun <Green b>0.4%</Green>{" "}
          <Green>Electro DMG Bonus</Green>. <Red>Electro DMG Bonus: {getBuffValue.A4(totalAttr)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, desc, tracker }) => {
        const buffValue = getBuffValue.A4(totalAttr);
        applyModifier(desc, totalAttr, "electro", buffValue, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.PARTY,
      desc: (obj) => (
        <>
          Eye of Stormy Judgment increases <Green>Elemental Burst DMG</Green> based on the <Green>Energy Cost</Green> of
          the Elemental Burst during the eye's duration. <Red>DMG bonus: {getBuffValue.ES(obj).value}%.</Red>
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const result = getBuffValue.ES(obj);
        const desc = `${obj.desc} / Lv. ${result.desc}`;
        applyModifier(desc, obj.attPattBonus, "EB.pct_", result.value, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: ({ char, charBuffCtrls, partyData }) => {
        const { stackPerEnergy, stacks, extraStacks } = getBuffValue.EB(char, charBuffCtrls, partyData);
        return (
          <>
            Musou no Hitotachi and Musou Isshin's attacks <Green>[EB] DMG</Green> will be increased based on the number
            of Chakra Desiderata's Resolve stacks consumed.{" "}
            <Red>
              Resolve per Energy spent: {stackPerEnergy / 100}. Total Resolve: {stacks}
            </Red>
            <br />
            Grants an <Electro>Electro Infusion</Electro> which cannot be overridden.
            <br />• At <Lightgold>C1</Lightgold>, increases <Green>Resolve</Green> gained from Electro characters by{" "}
            <Green b>80%</Green>, from characters of other visions by <Green b>20%</Green>.{" "}
            <Red>Extra Resolve: {extraStacks}</Red>
            <br />• At <Lightgold>C2</Lightgold>, the Raiden Shogun's attacks ignore <Green b>60%</Green> of opponents'{" "}
            <Green>DEF</Green>.
          </>
        );
      },
      inputConfigs: [
        { label: "Total Energy spent", type: "text", max: 999 },
        { label: "Energy spent by Electro characters (C1)", type: "text", max: 999 },
      ],
      applyBuff: ({ char, attPattBonus, calcItemBonuses, charBuffCtrls, partyData, desc, tracker }) => {
        const buffValue = getBuffValue.EB(char, charBuffCtrls, partyData);

        if (buffValue.stacks) {
          calcItemBonuses.push(
            {
              ids: "EB.0",
              bonus: talentBuff([
                true,
                "mult_",
                `${buffValue.stacks} Resolve, ${buffValue.musouBonus}% extra multiplier each`,
                round(buffValue.stacks * buffValue.musouBonus, 2),
              ]),
            },
            {
              ids: Array.from({ length: 8 }).map((_, i) => `EB.${i + 1}`),
              bonus: talentBuff([
                true,
                "mult_",
                `${buffValue.stacks} Resolve, ${buffValue.isshinBonus}% extra multiplier each`,
                round(buffValue.stacks * buffValue.isshinBonus, 2),
              ]),
            }
          );
        }

        if (checkCons[2](char)) {
          const fields: AttackPatternPath[] = ["NA.defIgn_", "CA.defIgn_", "PA.defIgn_", "ES.defIgn_", "EB.defIgn_"];
          applyModifier(desc, attPattBonus, fields, 60, tracker);
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
      desc: () => (
        <>
          When the Musou Isshin state expires, all nearby party members (excluding the Raiden Shogun) gain{" "}
          <Green b>30%</Green> <Green>ATK</Green> for 10s.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 30),
    },
  ],
};

export default Raiden as AppCharacter;

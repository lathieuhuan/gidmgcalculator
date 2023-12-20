import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Cyno: DefaultAppCharacter = {
  code: 59,
  name: "Cyno",
  icon: "3/31/Cyno_Icon",
  sideIcon: "b/b1/Cyno_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "electro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `• Pactsworn Pathclearer's [EB] {Normal Attack DMG}#[k] is increased by {150%}#[v] of Cyno's
      {Elemental Mastery}#[k].
      <br />• {Duststalker Bolt DMG}#[k] [A1] is increased by {250%}#[v] of Cyno's {Elemental Mastery}#[k].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(
          genExclusiveBuff(EModSrc.A4, "ES.1", "flat", totalAttr.em * 2.5),
          genExclusiveBuff(EModSrc.A4, "EB.0", "flat", Math.round(totalAttr.em * 1.5))
        );
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Under Pactsworn Pathclearer state:
      <br />• Cyno's {Elemental Mastery}#[k] is increased by {100}#[v].
      <br />• Cyno gains an {Electro Infusion}#[electro] that cannot be overriden.`,
      applyBuff: makeModApplier("totalAttr", "em", 100),
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `If Cyno activates Secret Rite: Chasmic Soulfarer {[ES]}#[k] while in Endseer stance [~EB], its
      {DMG}#[k] will be increased by {35%}#[v].`,
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A1, "ES.0", "pct_", 35));
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `After using Sacred Rite: Wolf's Swiftness, Cyno's {Normal Attack SPD}#[k] will be increased by
      {20%}#[v] for 10s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Cyno's Normal Attacks hit opponents, his {Electro DMG Bonus}#[k] will increase by {10%}#[v]
      for 4s. Max {5}#[m] stacks.`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "electro", (inputs[0] || 0) * 10, tracker);
      },
    },
  ],
};

export default Cyno as AppCharacter;

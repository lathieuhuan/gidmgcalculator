import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, genExclusiveBuff } from "../utils";

const Dehya: DefaultAppCharacter = {
  code: 68,
  name: "Dehya",
  icon: "3/3f/Dehya_Icon",
  sideIcon: "a/af/Dehya_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "pyro",
  weaponType: "claymore",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.C1,
      isGranted: checkCons[1],
      description: `Dehya's {Max HP}#[gr] is increased by {20%}#[b,gr], and:
      <br />• Molten Inferno's {[ES] DMG}#[gr] will be increased by {3.6%}#[b,gr] of her {Max HP}#[gr].
      <br />• The Lioness's Bite's {[EB] DMG}#[gr] will be increased by {6%}#[b,gr] of her {Max HP}#[gr].`,
      applyBuff: makeModApplier("totalAttr", "hp_", 20),
      applyFinalBuff: ({ totalAttr, attPattBonus, tracker, desc }) => {
        const buffs = [3.6, 6].map((mult) => ({
          value: applyPercent(totalAttr.hp, mult),
          desc: desc + ` / ${mult}% of ${Math.round(totalAttr.hp)} HP`,
        }));

        applyModifier(buffs[0].desc, attPattBonus, "ES.flat", buffs[0].value, tracker);
        applyModifier(buffs[1].desc, attPattBonus, "EB.flat", buffs[1].value, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      isGranted: checkCons[2],
      description: `When active character(s) within the {Fiery Sanctum}#[gr] field are attacked, its next coordinated
      attack will deal {50%}#[b,gr] increased {DMG}#[gr].`,
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C2, "ES.0", "pct_", 50));
      },
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      isGranted: checkCons[6],
      description: `The {CRIT Rate}#[gr] of The Lioness's Bite {[EB]}#[gr] is increased by {10%}#[b,gr]. After a Flame-Mane's
      Fist attack hits an opponent and deals CRIT hits, it will cause the {CRIT DMG}#[gr] of The Lioness's Bite to
      increase by {15%}#[b,gr] for the rest of Blazing Lioness's duration. Max {60%}#[r].`,
      inputConfigs: [
        {
          type: "stacks",
          initialValue: 0,
          max: 4,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        const buffValue = (inputs[0] || 0) * 15;
        applyModifier(desc, attPattBonus, ["EB.cRate_", "EB.cDmg_"], [10, buffValue], tracker);
      },
    },
  ],
};

export default Dehya as AppCharacter;

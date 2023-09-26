import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getWindGiftBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 18 }, Faruzan as AppCharacter, args);
};

const Faruzan: DefaultAppCharacter = {
  code: 64,
  name: "Faruzan",
  icon: "b/b2/Faruzan_Icon",
  sideIcon: "c/c1/Faruzan_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  dsGetters: [(args) => `${round(getWindGiftBonus(args)[1], 2)}%`],
  buffs: [
    {
      index: 0,
      src: "Prayerful Wind's Benefit",
      affect: EModAffect.PARTY,
      description: `Increases {Anemo DMG Bonus}#[gr] by {@0}#[b,gr] to all nearby characters.
      <br />• At {A4}#[g], increases {Anemo DMG}#[anemo] based on {32%}#[b,gr] of Faruzan's {Base ATK}#[gr].
      <br />• At {C6}#[g], increases {Anemo CRIT DMG}#[gr] by {40%}#[b,gr].`,
      inputConfigs: [
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Ascension 4", type: "check", for: "teammate" },
        { label: "Base ATK (A4)", type: "text", max: 9999, for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { fromSelf, attElmtBonus, inputs } = obj;
        const [level, anemoBonus] = getWindGiftBonus(obj);
        const descRoot = fromSelf ? "Self" : "Faruzan";

        if (anemoBonus) {
          applyModifier(obj.desc + ` Lv.${level}`, obj.totalAttr, "anemo", anemoBonus, obj.tracker);
        }
        if (fromSelf ? checkAscs[4](obj.char) : inputs[1]) {
          const baseAtk = fromSelf ? obj.totalAttr.base_atk : inputs[2] || 0;
          const mult = 32;
          const description = `${descRoot} / ${EModSrc.C6} / ${mult}% of Base ATK`;

          applyModifier(description, attElmtBonus, "anemo.flat", applyPercent(baseAtk, mult), obj.tracker);
        }
        if (fromSelf ? checkCons[6](obj.char) : inputs[3]) {
          const description = `${descRoot} / ${EModSrc.C6}`;
          applyModifier(description, attElmtBonus, "anemo.cDmg_", 40, obj.tracker);
        }
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: "Perfidious Wind's Bale",
      description: `Decreases opponents' {Anemo RES}#[gr] by {30%}#[b,gr].`,
      applyDebuff: makeModApplier("resistReduct", "anemo", 30),
    },
  ],
};

export default Faruzan as AppCharacter;

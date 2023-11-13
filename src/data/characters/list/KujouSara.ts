import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, getTalentMultiplier } from "../utils";

const KujouSara: DefaultAppCharacter = {
  code: 41,
  name: "Kujou Sara",
  icon: "d/df/Kujou_Sara_Icon",
  sideIcon: "0/00/Kujou_Sara_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "electro",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Grants the active character within its AoE an {ATK Bonus}#[k] based on Kujou Sara's
      {Base ATK}#[k].
      <br />• At {C6}#[ms], it also increases {Electro Crit DMG}#[k] by {60%}#[v].`,
      inputConfigs: [
        { label: "Base ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { fromSelf } = obj;
        const baseATK = fromSelf ? obj.totalAttr.base_atk : obj.inputs[0];
        const [level, mult] = getTalentMultiplier(
          { talentType: "ES", root: 42.96, inputIndex: 1 },
          KujouSara as AppCharacter,
          obj
        );

        if (mult) {
          const description = `${obj.desc} Lv.${level} / ${round(mult, 2)}% of Base ATK`;
          const buffValue = applyPercent(baseATK, mult);
          applyModifier(description, obj.totalAttr, "atk", buffValue, obj.tracker);
        }

        if (fromSelf ? checkCons[6](obj.char) : obj.inputs[2]) {
          const descriptionC6 = `${fromSelf ? "Self" : "Kujou Sara"} / ${EModSrc.C6}`;
          applyModifier(descriptionC6, obj.attElmtBonus, "electro.cDmg_", 60, obj.tracker);
        }
      },
    },
  ],
};

export default KujouSara as AppCharacter;

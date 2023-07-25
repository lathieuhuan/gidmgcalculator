import type { AppCharacter, DefaultAppCharacter, ModifierInput } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Electro, Green, Lightgold, Red } from "@Src/pure-components";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const getAttackBuffValue = (inputs: ModifierInput[]): [number, string] => {
  const baseATK = inputs[0] || 0;
  const level = inputs[1] || 1;
  const mult = 42.96 * TALENT_LV_MULTIPLIERS[2][level];
  return [applyPercent(baseATK, mult), `${level} / ${round(mult, 2)}% of ${baseATK} Base ATK`];
};

const Sara: DefaultAppCharacter = {
  code: 41,
  name: "Kujou Sara",
  GOOD: "KujouSara",
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
      desc: ({ toSelf, inputs }) => (
        <>
          Grants the active character within its AoE an <Green>ATK Bonus</Green> based on Kujou Sara's{" "}
          <Green>Base ATK</Green>. {!toSelf && <Red>ATK bonus: {getAttackBuffValue(inputs)[0]}.</Red>}
          <br />• At <Lightgold>C6</Lightgold>, it also increases <Electro>Electro</Electro> <Green>Crit DMG</Green> by{" "}
          <Green b>60%</Green>.
        </>
      ),
      inputConfigs: [
        { label: "Base ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { toSelf } = obj;
        const buffValueArgs = toSelf
          ? [obj.totalAttr.base_atk, finalTalentLv({ ...obj, charData: Sara as AppCharacter, talentType: "ES" })]
          : obj.inputs;
        const [buffValue, xtraDesc] = getAttackBuffValue(buffValueArgs);
        const desc = `${obj.desc} / Lv. ${xtraDesc}`;

        applyModifier(desc, obj.totalAttr, "atk", buffValue, obj.tracker);

        if ((toSelf && checkCons[6](obj.char)) || (!toSelf && obj.inputs[2])) {
          const descC6 = `${toSelf ? "Self" : "Kujou Sara"} / ${EModSrc.C6}`;
          applyModifier(descC6, obj.attElmtBonus, "electro.cDmg_", 60, obj.tracker);
        }
      },
    },
  ],
};

export default Sara as AppCharacter;

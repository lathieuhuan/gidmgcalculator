import type { AppCharacter, DefaultAppCharacter, ModifierInput } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Green, Lightgold, Red } from "@Src/pure-components";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

function getEBBuffValue(inputs: ModifierInput[]): [number, string] {
  const baseATK = inputs[0] || 0;
  const level = inputs[1] || 0;
  const boosted = (inputs[2] || 0) === 1;
  let mult = 56 * TALENT_LV_MULTIPLIERS[2][level];
  let desc = level.toString();

  if (level && boosted) {
    mult += 20;
    desc += ` / C1: 20% extra`;
  }
  return [applyPercent(baseATK, mult), desc + ` / ${round(mult, 2)}% of ${baseATK} Base ATK`];
}

const Bennett: DefaultAppCharacter = {
  code: 19,
  name: "Bennett",
  icon: "7/79/Bennett_Icon",
  sideIcon: "0/01/Bennett_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.ACTIVE_UNIT,
      desc: ({ toSelf, inputs }) => (
        <>
          Increases <Green>ATK</Green> of the characters within its AoE based on Bennett's <Green>Base ATK</Green>.
          <br />• At <Lightgold>C1</Lightgold>, the <Green>ATK Bonus</Green> is further increased by{" "}
          <Green b>20%</Green> of his <Green>Base ATK</Green>.{" "}
          {!toSelf && <Red>ATK bonus: {getEBBuffValue(inputs)[0]}.</Red>}
          <br />• At <Lightgold>C6</Lightgold>, the characters also gain a <Green b>15%</Green>{" "}
          <Green>Pyro DMG Bonus</Green>.
        </>
      ),
      inputConfigs: [
        { label: "Base ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Constellation 1", type: "check", for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { toSelf, char, totalAttr, inputs } = obj;
        const args = toSelf
          ? [
              totalAttr.base_atk,
              finalTalentLv({ ...obj, charData: Bennett as AppCharacter, talentType: "EB" }),
              checkCons[1](char) ? 1 : 0,
            ]
          : inputs;
        const [buffValue, xtraDesc] = getEBBuffValue(args);
        const desc = `${obj.desc} / Lv. ${xtraDesc}`;
        applyModifier(desc, totalAttr, "atk", buffValue, obj.tracker);

        if (toSelf ? checkCons[6](char) : inputs[3]) {
          const descC6 = `${toSelf ? "Self" : "Bennet"} / ${EModSrc.C6}`;
          applyModifier(descC6, totalAttr, "pyro", 15, obj.tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Bennett's HP falls below 70%, his <Green>Energy Recharge</Green> is increased by <Green b>30%</Green>.
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "er_", 30),
    },
  ],
};

export default Bennett as AppCharacter;

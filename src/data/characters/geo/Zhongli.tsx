import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { ATTACK_ELEMENTS, EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { AttackPatternPath, applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs } from "../utils";

const Zhongli: DefaultAppCharacter = {
  code: 25,
  name: "Zhongli",
  icon: "a/a6/Zhongli_Icon",
  sideIcon: "6/68/Zhongli_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          • <Green>Normal Attack, Charged Attack, and Plunging Attack DMG</Green> increased by <Green b>1.39%</Green> of{" "}
          <Green>Max HP</Green>.
          <br />• Dominus Lapidis Stone Stele, resonance, and hold <Green>[ES] DMG</Green> increased by{" "}
          <Green b>1.9%</Green> of <Green>Max HP</Green>.
          <br />• Planet Befall <Green>[EB] DMG</Green> increased by <Green b>33%</Green> of <Green>Max HP</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const fields: AttackPatternPath[] = ["NA.flat", "CA.flat", "PA.flat", "ES.flat", "EB.flat"];
        const buffValues = [1.39, 1.39, 1.39, 1.9, 33].map((mult) => applyPercent(totalAttr.hp, mult));
        applyModifier(desc, attPattBonus, fields, buffValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          When Jade Shield takes DMG, the characters have their <Green>Shield Strength</Green> increased by{" "}
          <Green b>5%</Green> until the Jade Shield disappears. Max <Rose>5</Rose> stacks.
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: "Jade Shield",
      desc: () => (
        <>
          Jade Shield decreases <Green>Elemental RES</Green> and <Green>Physical RES</Green> of opponents in a small AoE
          by <Green b>20%</Green>. Cannot be stacked.
        </>
      ),
      applyDebuff: ({ resistReduct, desc, tracker }) => {
        applyModifier(desc, resistReduct, [...ATTACK_ELEMENTS], 20, tracker);
      },
    },
  ],
};

export default Zhongli as AppCharacter;

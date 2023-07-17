import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Heizou: DefaultAppCharacter = {
  code: 53,
  name: "Heizou",
  GOOD: "ShikanoinHeizou",
  icon: "2/20/Shikanoin_Heizou_Icon",
  sideIcon: "c/ca/Shikanoin_Heizou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 40,
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      desc: () => (
        <>
          When Heartstopper Strike [ES] hits an opponent, increases all party members' (excluding Heizou){" "}
          <Green>Elemental Mastery</Green> by <Green b>80</Green> for 10s.
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "em", 80),
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          For 5s after Heizou takes the field, his <Green>Normal Attack SPD</Green> is increased by <Green>15%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Each Declension stack increases Heartstopper Strike <Green>[ES] CRIT Rate</Green> by <Green b>4%</Green>. When
          Heizou possesses Conviction, Heartstoppper Strike's <Green>[ES] CRIT DMG</Green> is increased by{" "}
          <Green b>32%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        const stacks = inputs[0] || 0;

        if (stacks !== 4) {
          applyModifier(desc, attPattBonus, "ES.cRate_", 4 * stacks, tracker);
        } else {
          applyModifier(desc, attPattBonus, ["ES.cRate_", "ES.cDmg_"], [4 * stacks, 32], tracker);
        }
      },
    },
  ],
};

export default Heizou as AppCharacter;

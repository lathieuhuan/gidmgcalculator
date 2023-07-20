import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Layla: DefaultAppCharacter = {
  code: 61,
  name: "Layla",
  icon: "1/1a/Layla_Icon",
  sideIcon: "2/23/Layla_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 40,
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          <Green>Shooting Star DMG</Green> [~ES] is increased by <Green b>1.5%</Green> of Layla's <Green>Max HP</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A4, "ES.0", "flat", applyPercent(totalAttr.hp, 1.5)));
      },
    },
    {
      src: EModSrc.C1,
      desc: () => (
        <>
          The <Green>Shield Absorption</Green> of the Curtain of Slumber [~ES] is increased by <Green b>20%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C1, "ES.1", "pct_", 20));
      },
    },
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Increases <Green>Shooting Star DMG</Green> [~ES] and <Green>Starlight Slug DMG</Green> [~EB] by{" "}
          <Green b>40%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: ({ attPattBonus, calcItemBuffs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "EB.pct_", 40, tracker);
        calcItemBuffs.push(exclBuff(EModSrc.C6, "ES.0", "pct_", 40));
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
          While the Curtain of Slumber [~ES] is active, each time the Curtain gains a Night Star:
          <br />• The <Green>Shield Strength</Green> of the character is increased by <Green b>6%</Green>. Max{" "}
          <Rose>4</Rose> stacks.
          <br />• This effect persists until the Curtain of Slumber disappears.
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 6 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When Nights of Formal Focus [ES] starts to fire off Shooting Stars, it will increases{" "}
          <Green>Normal and Charged Attack DMG</Green> of nearby party members based on <Green b>5%</Green> of Layla's{" "}
          <Green>Max HP</Green>.
        </>
      ),
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Max HP",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: ({ toSelf, totalAttr, attPattBonus, inputs, desc, tracker }) => {
        const maxHP = toSelf ? totalAttr.hp : inputs[0] || 0;
        const buffValue = applyPercent(maxHP, 5);
        applyModifier(desc, attPattBonus, ["NA.flat", "CA.flat"], buffValue, tracker);
      },
    },
  ],
};

export default Layla as AppCharacter;

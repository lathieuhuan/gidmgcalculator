import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons, talentBuff } from "../utils";

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
  innateBuffs: [
    {
      src: EModSrc.C1,
      isGranted: checkCons[1],
      desc: () => (
        <>
          Dehya's <Green>Max HP</Green> is increased by <Green>20%</Green>, and:
          <br />• Molten Inferno's <Green>[ES] DMG</Green> will be increased by <Green b>3.6%</Green> of her{" "}
          <Green>Max HP</Green>.
          <br />• The Lioness's Bite's <Green>[EB] DMG</Green> will be increased by <Green b>6%</Green> of her{" "}
          <Green>Max HP</Green>.
        </>
      ),
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
      desc: () => (
        <>
          When a <Green>Fiery Sanctum</Green> exists on the field, <Green>DMG</Green> dealt by its next coordinated
          attack will be increased by <Green b>50%</Green> when active character(s) within the Fiery Sanctum field are
          attacked.
        </>
      ),
      applyBuff: ({ calcItemBonuses }) => {
        calcItemBonuses.push({
          ids: "ES.0",
          bonus: talentBuff([true, "pct_", [false, 2], 50]),
        });
      },
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      isGranted: checkCons[6],
      desc: () => (
        <>
          The <Green>CRIT Rate</Green> of The Lioness's Bite [EB] is increased by <Green b>10%</Green>. After a
          Flame-Mane's Fist attack hits an opponent and deals CRIT hits, it will cause the <Green>CRIT DMG</Green> of
          The Lioness's Bite to increase by <Green b>15%</Green> for the rest of Blazing Lioness's duration. Max{" "}
          <Rose>60%</Rose>.
        </>
      ),
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

import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier, ReactionBonusPath } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Baizhu: DefaultAppCharacter = {
  code: 70,
  name: "Baizhu",
  icon: "https://images2.imgbox.com/da/d9/A4umtyus_o.png",
  sideIcon: "f/f9/Baizhu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "dendro",
  weaponType: "catalyst",
  EBcost: 80,
  innateBuffs: [
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Increases <Green>Spiritveins [~EB] DMG</Green> by <Green b>8%</Green> of Baizhu's <Green>Max HP</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyFinalBuff: ({ calcItemBonuses, totalAttr }) => {
        const desc = `${EModSrc.C6} / 8% of ${Math.round(totalAttr.hp)} HP`;

        calcItemBonuses.push({
          ids: "EB.0",
          bonus: talentBuff([true, "flat", desc, Math.round(totalAttr.hp * 0.08)]),
        });
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      isGranted: checkAscs[1],
      desc: () => (
        <>
          Baizhu gains different effects according to the current HP of your current active character:
          <br />• When their HP is less than 50%, Baizhu gains <Green b>20%</Green> <Green>Healing Bonus</Green>.
          <br />• When their HP is equal to or more than 50%, Baizhu gains <Green b>25%</Green>{" "}
          <Green>Dendro DMG Bonus</Green>.
        </>
      ),
      inputConfigs: [{ label: "HP less than 50%", type: "check" }],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, inputs[0] ? "healB_" : "dendro", inputs[0] ? 20 : 25, tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      isGranted: checkAscs[4],
      desc: () => (
        <>
          Characters healed by Holistic Revivification [EB] will gain the Year of Verdant Favor effect: Each 1,000 Max
          HP that Baizhu possesses below 50,000 will increase their{" "}
          <Green>Burning, Bloom, Hyperbloom, and Burgeon DMG</Green> by <Green b>2%</Green>, while their{" "}
          <Green>Aggravate and Spread DMG</Green> will be increased by <Green b>0.8%</Green>. This effect lasts 6s.
        </>
      ),
      inputConfigs: [{ label: "Max HP", type: "text", max: 99999, for: "teammate" }],
      applyFinalBuff: ({ toSelf, totalAttr, rxnBonus, inputs, desc, tracker }) => {
        const hp = toSelf ? totalAttr.hp : inputs[0] || 0;
        const stacks = round(Math.min(hp, 50000) / 1000, 1);
        const fields: ReactionBonusPath[] = ["burning.pct_", "bloom.pct_", "hyperbloom.pct_", "burgeon.pct_"];

        applyModifier(desc, rxnBonus, fields, stacks * 2, tracker);
        applyModifier(desc, rxnBonus, ["aggravate.pct_", "spread.pct_"], stacks * 0.8, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      isGranted: checkCons[4],
      desc: () => (
        <>
          For 15s after Holistic Revivification [EB] is used, Baizhu will increase all nearby party members'{" "}
          <Green>Elemental Mastery</Green> by <Green b>80</Green>.
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "em", 80),
    },
  ],
};

export default Baizhu as AppCharacter;

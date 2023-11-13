import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier, ReactionBonusPath } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

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
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.C6,
      description: `Increases {Spiritveins DMG}#[k] [~EB] by {8%}#[v] of Baizhu's {Max HP}#[k].`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        const desc = `${EModSrc.C6} / 8% of ${Math.round(totalAttr.hp)} HP`;
        calcItemBuffs.push(genExclusiveBuff(desc, "EB.0", "flat", Math.round(totalAttr.hp * 0.08)));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      isGranted: checkAscs[1],
      description: `Based on the current HP of your current active character:
      <br />• When their HP is less than 50%, Baizhu gains {20%}#[v] {Healing Bonus}#[k].
      <br />• When their HP is equal to or more than 50%, Baizhu gains {25%}#[v] {Dendro DMG Bonus}#[k].`,
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
      description: `When characters healed by Holistic Revivification [EB], each 1,000 Max HP that Baizhu possesses
      below 50,000 will increase their {Burning, Bloom, Hyperbloom, and Burgeon DMG}#[k] by {2%}#[v], while their
      {Aggravate and Spread DMG}#[k] will be increased by {0.8%}#[v], for lasts 6s.`,
      inputConfigs: [{ label: "Max HP", type: "text", max: 99999, for: "teammate" }],
      applyFinalBuff: ({ fromSelf, totalAttr, rxnBonus, inputs, desc, tracker }) => {
        const hp = fromSelf ? totalAttr.hp : inputs[0] || 0;
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
      description: `For 15s after Holistic Revivification [EB] is used, Baizhu will increase all nearby party members'
      {Elemental Mastery}#[k] by {80}#[v].`,
      applyBuff: makeModApplier("totalAttr", "em", 80),
    },
  ],
};

export default Baizhu as AppCharacter;

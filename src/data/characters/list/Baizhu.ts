import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

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
  // buffs: [
  //   {
  //     index: 1,
  //     src: EModSrc.A4,
  //     affect: EModAffect.PARTY,
  //     isGranted: checkAscs[4],
  //     description: `When characters healed by Holistic Revivification [EB], each 1,000 Max HP that Baizhu possesses
  //     below 50,000 will increase their {Burning, Bloom, Hyperbloom, and Burgeon DMG}#[k] by {2%}#[v], while their
  //     {Aggravate and Spread DMG}#[k] will be increased by {0.8%}#[v], for lasts 6s.`,
  //     inputConfigs: [{ label: "Max HP", type: "text", max: 99999, for: "teammate" }],
  //     applyFinalBuff: ({ fromSelf, totalAttr, rxnBonus, inputs, desc, tracker }) => {
  //       const hp = fromSelf ? totalAttr.hp : inputs[0] || 0;
  //       const stacks = round(Math.min(hp, 50000) / 1000, 1);
  //       const fields: ReactionBonusPath[] = ["burning.pct_", "bloom.pct_", "hyperbloom.pct_", "burgeon.pct_"];

  //       applyModifier(desc, rxnBonus, fields, stacks * 2, tracker);
  //       applyModifier(desc, rxnBonus, ["aggravate.pct_", "spread.pct_"], stacks * 0.8, tracker);
  //     },
  //   },
  // ]
};

export default Baizhu as AppCharacter;

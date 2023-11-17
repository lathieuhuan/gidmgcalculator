import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Candace: DefaultAppCharacter = {
  code: 58,
  name: "Candace",
  icon: "d/dd/Candace_Icon",
  sideIcon: "7/7f/Candace_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "hydro",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  // buffs: [
  //   {
  //     index: 0,
  //     src: EModSrc.EB,
  //     affect: EModAffect.PARTY,
  //     description: `Prayer of the Crimson Crown [~EB] grants:
  //     <br />• Characters deal {20%}#[v] increased {Elemental Normal Attack DMG}#[k].
  //     <br />• At {A4}#[ms], increases the above bonus by {0.5%}#[v] for every 1,000 points of Candace's {Max HP}#[k].`,
  //     inputConfigs: [
  //       {
  //         label: "Max HP (A4)",
  //         type: "text",
  //         max: 99999,
  //         for: "teammate",
  //       },
  //     ],
  //     applyFinalBuff: (obj) => {
  //       const { fromSelf, char, charData, totalAttr, attPattBonus, inputs } = obj;

  //       if (charData.weaponType === "catalyst" || obj.infusedElement !== "phys") {
  //         const maxHP = fromSelf && checkAscs[4](char) ? totalAttr.hp : !fromSelf ? inputs[0] || 0 : 0;
  //         const buffValue = round(20 + (maxHP / 1000) * 0.5, 1);

  //         applyModifier(obj.desc, attPattBonus, "NA.pct_", buffValue, obj.tracker);
  //       }
  //     },
  //   },
  // ],
};

export default Candace as AppCharacter;

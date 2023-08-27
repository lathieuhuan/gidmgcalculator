import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

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
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      description: `Prayer of the Crimson Crown [~EB] grants:
      <br />• Characters deal {20%}#[b,gr] increased {Elemental Normal Attack DMG}#[gr].
      <br />• At {A4}#[g], increases the above bonus by {0.5%}#[b,gr] for every 1,000 points of Candace's {Max HP}#[gr].`,
      inputConfigs: [
        {
          label: "Max HP (A4)",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: (obj) => {
        const { fromSelf, char, charData, totalAttr, attPattBonus, inputs } = obj;

        if (charData.weaponType === "catalyst" || obj.infusedElement !== "phys") {
          const maxHP = fromSelf && checkAscs[4](char) ? totalAttr.hp : !fromSelf ? inputs[0] || 0 : 0;
          const buffValue = round(20 + (maxHP / 1000) * 0.5, 1);

          applyModifier(obj.desc, attPattBonus, "NA.pct_", buffValue, obj.tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Sacred Rite: Heron's Guard [ES] hits opponents, Candace's {Max HP}#[gr] will be increased by
      {20%}#[b,gr] for 15s.`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "hp_", 20),
    },
  ],
};

export default Candace as AppCharacter;
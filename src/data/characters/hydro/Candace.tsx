import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Lightgold } from "@Src/pure-components";
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
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Prayer of the Crimson Crown [~EB] has the following properties:
          <br />• Characters deal <Green b>20%</Green> increased <Green>Elemental Normal Attack DMG</Green>.
          <br />• At <Lightgold>A4</Lightgold>, increases the above bonus by <Green b>0.5%</Green> for every 1,000
          points of Candace's <Green>Max HP</Green>.
        </>
      ),
      inputConfigs: [
        {
          label: "Max HP (A4)",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyFinalBuff: (obj) => {
        const { toSelf, char, charData, totalAttr, attPattBonus, inputs } = obj;

        if (charData.weaponType === "catalyst" || obj.infusedElement !== "phys") {
          const maxHP = toSelf && checkAscs[4](char) ? totalAttr.hp : !toSelf ? inputs[0] || 0 : 0;
          const buffValue = round(20 + (maxHP / 1000) * 0.5, 1);

          applyModifier(obj.desc, attPattBonus, "NA.pct_", buffValue, obj.tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Sacred Rite: Heron's Guard [ES] hits opponents, Candace's <Green>Max HP</Green> will be increased by{" "}
          <Green>20%</Green> for 15s.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "hp_", 20),
    },
  ],
};

export default Candace as AppCharacter;

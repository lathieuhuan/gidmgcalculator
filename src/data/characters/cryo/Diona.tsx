import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { Green } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkCons, talentBuff } from "../utils";

const Diona: DefaultAppCharacter = {
  code: 24,
  name: "Diona",
  icon: "4/40/Diona_Icon",
  sideIcon: "e/e1/Diona_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 80,
  innateBuffs: [
    {
      src: EModSrc.C2,
      desc: () => (
        <>
          Increases Icy Paws <Green>[ES] DMG</Green> by <Green b>15%</Green>, and increases its shield's{" "}
          <Green>DMG Absorption</Green> by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: ({ attPattBonus, calcItemBonuses, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 15, tracker);

        calcItemBonuses.push({
          ids: "ES.0",
          bonus: talentBuff([true, "pct_", [false, 1], 15]),
        });
      },
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          When characters within Signature Mix's radius have more than 50% HP, their <Green>Elemental Mastery</Green> is
          increased by <Green b>200</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "em", 200),
    },
  ],
};

export default Diona as AppCharacter;

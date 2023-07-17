import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { Green, Red } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Sucrose: DefaultAppCharacter = {
  code: 3,
  name: "Sucrose",
  icon: "0/0e/Sucrose_Icon",
  sideIcon: "9/98/Sucrose_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 80,
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      desc: () => (
        <>
          When Sucrose triggers a Swirl, all characters in the party with the matching element (excluding Sucrose) have
          their <Green>Elemental Mastery</Green> increased by <Green b>50</Green> for 8s.
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      desc: ({ inputs }) => (
        <>
          When Astable Anemohypostasis Creation - 6308 [ES] or Forbidden Creation - Isomer 75 / Type II [EB] hits an
          opponent, increases all party members' (excluding Sucrose) <Green>Elemental Mastery</Green> based on{" "}
          <Green b>20%</Green> of Sucrose's <Green>Elemental Mastery</Green> for 8s.{" "}
          <Red>Elemental Mastery bonus: {Math.round((inputs[0] || 0) * 0.2)}.</Red>
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Mastery",
          type: "text",
          max: 9999,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "em", Math.round((inputs[0] || 0) * 0.2), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          If Forbidden Creation - Isomer 75 / Type II [EB] triggers an Elemental Absorption, all party members gain a{" "}
          <Green b>20%</Green> <Green>Elemental DMG Bonus</Green> for the corresponding <Green>absorbed element</Green>{" "}
          during its duration.
        </>
      ),
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element Absorbed",
          type: "anemoable",
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        applyModifier(desc, totalAttr, VISION_TYPES[elmtIndex], 20, tracker);
      },
    },
  ],
};

export default Sucrose as AppCharacter;
